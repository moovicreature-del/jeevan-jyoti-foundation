// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF REGISTRY & SERVICE
// जीवन ज्योति फाउंडेशन - स्टाफ प्रबंधन एवं सत्यापन सर्विस
// ============================================================================

import { StaffMember } from '../types/staff';
import { INITIAL_STAFF_MEMBERS } from '../data/initialStaffData';
import {
  saveCertificateToRegistry,
  deleteCertificateFromRegistry,
  cancelCertificateInRegistry
} from './certificateRegistryService';

const STAFF_STORAGE_KEY = 'jjf_staff_registry_v3';

/**
 * Trigger background file sync so GitHub push automatically has the latest staff registry
 */
function triggerBackgroundDataSync() {
  if (typeof window !== 'undefined') {
    import('./adminService')
      .then((m) => m.syncCurrentAdminDataToGitHub())
      .catch(() => {});
  }
}

/**
 * Get all registered staff members
 */
export function getAllStaffMembers(): StaffMember[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return INITIAL_STAFF_MEMBERS;
    }
    const saved = localStorage.getItem(STAFF_STORAGE_KEY);
    let parsed: StaffMember[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch {}
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS));
      INITIAL_STAFF_MEMBERS.forEach((staff) => registerStaffIntoCentralRegistry(staff));
      return INITIAL_STAFF_MEMBERS;
    }

    // Smart merge: ensure all permanent staff records (especially JJF-STF-2026-009) always exist
    let updatedList = [...parsed];
    let changed = false;

    INITIAL_STAFF_MEMBERS.forEach((initStaff) => {
      const existsIdx = updatedList.findIndex((s) => s.id.toLowerCase() === initStaff.id.toLowerCase());
      if (existsIdx === -1) {
        updatedList.push(initStaff);
        changed = true;
      }
    });

    // Enforce official verified attributes for JJF-STF-2026-009 (शैलेश प्रधान, पिता: सर्वदेव प्रधान, प्रबंधक)
    const idx009 = updatedList.findIndex((s) => s.id === 'JJF-STF-2026-009');
    if (idx009 >= 0) {
      const s009 = updatedList[idx009];
      if (
        s009.fatherOrHusbandName !== 'सर्वदेव प्रधान' ||
        s009.designation !== 'Manager / प्रबंधक' ||
        s009.mobile !== '8052361666' ||
        s009.status !== 'approved' ||
        !s009.address?.includes('तुर्की')
      ) {
        updatedList[idx009] = {
          ...s009,
          fullName: 'शैलेश प्रधान',
          fullNameHindi: 'शैलेश प्रधान',
          fatherOrHusbandName: 'सर्वदेव प्रधान',
          relationType: 'Father',
          designation: 'Manager / प्रबंधक',
          designationHindi: 'प्रबंधक',
          department: 'प्रशासनिक, लेखा व ऑडिट अनुभाग (Administration & Accounts)',
          mobile: '8052361666',
          bloodGroup: 'B+',
          dateOfJoining: '2018-08-20',
          address: 'ग्राम तुर्की, पोस्ट तुर्की, प्रखंड कुदरा, अनुमंडल मोहनिया, जिला कैमूर, बिहार - 821108',
          dutyLocation: 'गाजीपुर मुख्य शाखा (Ghazipur HQ)',
          status: 'approved',
          approvedAt: '2018-08-20T10:00:00.000Z',
          approvedBy: 'जीवन ज्योति फाउंडेशन (प्रशासन)'
        };
        changed = true;
      }
    }

    // Cleanse JJF-STF-2026-001 so it has distinct executive phone 9838061666 and does not hijack 8052361666
    const idx001 = updatedList.findIndex((s) => s.id === 'JJF-STF-2026-001');
    if (idx001 >= 0 && (updatedList[idx001].mobile === '8052361666' || updatedList[idx001].emergencyContact === '8052361666')) {
      updatedList[idx001] = {
        ...updatedList[idx001],
        mobile: '9838061666',
        emergencyContact: '9838061666'
      };
      changed = true;
    }

    if (changed) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedList));
    }

    // Always ensure JJF-STF-2026-009 is synced into central verification registry
    const official009 = updatedList.find((s) => s.id === 'JJF-STF-2026-009');
    if (official009) {
      registerStaffIntoCentralRegistry(official009);
    }

    return updatedList;
  } catch (err) {
    console.warn('Error reading staff registry from storage:', err);
    return INITIAL_STAFF_MEMBERS;
  }
}

/**
 * Register staff card and appointment letter into central verification registry for instant QR scanning and Admin approval tracking
 */
export function registerStaffIntoCentralRegistry(staff: StaffMember): void {
  try {
    const cleanPhone = (staff.mobile || '').replace(/[^0-9]/g, '').slice(-10);
    const effectiveApproval =
      staff.status === 'approved' || staff.status === 'active' || staff.status === 'verified'
        ? 'approved'
        : staff.status === 'rejected'
        ? 'rejected'
        : staff.status === 'cancelled'
        ? 'cancelled'
        : 'pending';

    const refNum = staff.id.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '101';
    const refNoCode = `JJF/APPT-STF/2026/${refNum}`;

    // 1. Staff Identity Card (I-Card)
    saveCertificateToRegistry({
      id: staff.id,
      type: 'volunteer_id',
      titleHindi: 'आधिकारिक स्टाफ डिजिटल पहचान पत्र',
      titleEnglish: 'Official Staff Identity Card',
      recipientName: staff.fullName,
      fatherOrHusbandName: staff.fatherOrHusbandName,
      phone: cleanPhone,
      issueDate: staff.dateOfJoining,
      categoryOrPurpose: `${staff.designation} • ${staff.department}`,
      photoUrl: staff.photoUrl,
      details: `स्टाफ आईडी: ${staff.id} • रक्त समूह: ${staff.bloodGroup} • पदनाम: ${staff.designation} • कार्यक्षेत्र: ${staff.dutyLocation}`,
      status: 'active',
      approvalStatus: effectiveApproval,
      approvedAt: staff.approvedAt,
      approvedBy: staff.approvedBy,
      rejectionReason: staff.rejectionReason,
      rawStaff: staff,
      address: staff.address
    });

    // 2. Staff Official Appointment Letter (नियुक्ति पत्र on Official Letterhead)
    saveCertificateToRegistry({
      id: `${staff.id}-APPT`,
      type: 'task_appreciation',
      titleHindi: 'स्टाफ आधिकारिक नियुक्ति पत्र',
      titleEnglish: 'Official Staff Appointment Letter',
      recipientName: staff.fullName,
      fatherOrHusbandName: staff.fatherOrHusbandName,
      phone: cleanPhone,
      issueDate: staff.dateOfJoining,
      categoryOrPurpose: `${staff.designation} • ${staff.department}`,
      photoUrl: staff.photoUrl,
      details: `स्टाफ नियुक्ति पत्र • पदनाम: ${staff.designation} • विभाग: ${staff.department} • कार्यक्षेत्र: ${staff.dutyLocation}`,
      status: 'active',
      approvalStatus: effectiveApproval,
      approvedAt: staff.approvedAt,
      approvedBy: staff.approvedBy,
      rejectionReason: staff.rejectionReason,
      refNo: refNoCode,
      rawStaff: staff,
      address: staff.address
    });

    // 3. Direct Reference Number mapping (e.g. JJF/APPT-STF/2026/6009)
    saveCertificateToRegistry({
      id: refNoCode,
      type: 'task_appreciation',
      titleHindi: 'स्टाफ आधिकारिक नियुक्ति आदेश',
      titleEnglish: 'Official Staff Appointment Letter',
      recipientName: staff.fullName,
      fatherOrHusbandName: staff.fatherOrHusbandName,
      phone: cleanPhone,
      issueDate: staff.dateOfJoining,
      categoryOrPurpose: `${staff.designation} • ${staff.department}`,
      photoUrl: staff.photoUrl,
      details: `स्टाफ नियुक्ति आदेश • पत्रांक: ${refNoCode} • पदनाम: ${staff.designation}`,
      status: 'active',
      approvalStatus: effectiveApproval,
      approvedAt: staff.approvedAt,
      approvedBy: staff.approvedBy,
      rejectionReason: staff.rejectionReason,
      refNo: refNoCode,
      rawStaff: staff,
      address: staff.address
    });
  } catch (err) {
    console.warn('Failed to sync staff into central verification registry:', err);
  }
}

/**
 * Generate unique sequential Staff ID: JJF-STF-2026-XXX
 */
export function generateNextStaffId(): string {
  const current = getAllStaffMembers();
  const year = new Date().getFullYear();
  let maxSeq = 5;

  current.forEach((m) => {
    const match = m.id.match(/JJF-STF-\d+-(\d+)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `JJF-STF-${year}-${nextSeq}`;
}

/**
 * Register a new staff member (default status: 'pending' awaiting Admin approval)
 */
export function registerNewStaffMember(
  data: Omit<StaffMember, 'id' | 'createdAt' | 'status'>,
  status: StaffMember['status'] = 'pending'
): StaffMember {
  const newStaffId = generateNextStaffId();
  const cleanMobile = data.mobile.replace(/[^0-9]/g, '').slice(-10);

  const newStaff: StaffMember = {
    ...data,
    id: newStaffId,
    mobile: cleanMobile,
    status,
    createdAt: new Date().toISOString()
  };

  const current = getAllStaffMembers();
  const updated = [newStaff, ...current];

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
    // Immediately register both Staff I-Card and Appointment Letter into central registry (with approvalStatus: 'pending' or 'approved')
    registerStaffIntoCentralRegistry(newStaff);

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    // Auto-sync to repository JSON payload for seamless GitHub push (silent in background)
    triggerBackgroundDataSync();
  } catch (err) {
    console.warn('LocalStorage save staff quota warning, applying safe trim:', err);
    try {
      const trimmed = updated.slice(0, 30).map((s, i) => (i > 10 ? { ...s, photoUrl: '' } : s));
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(trimmed));
      registerStaffIntoCentralRegistry(newStaff);
    } catch {}
  }

  return newStaff;
}

/**
 * Get direct URL for staff member to download their ID card
 */
export function getStaffDownloadUrl(staffId: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return `${origin}/?downloadStaffCard=${encodeURIComponent(staffId)}`;
}

/**
 * Generate official WhatsApp message URL to send I-Card download link to staff member
 */
export function generateStaffApprovalWhatsAppUrl(staff: StaffMember): string {
  const cleanMobile = staff.mobile.replace(/[^0-9]/g, '').slice(-10);
  const downloadUrl = getStaffDownloadUrl(staff.id);

  const message = `*जीवन ज्योति फाउंडेशन (ग़ाज़ीपुर, उ.प्र.)*
*आधिकारिक स्टाफ पहचान पत्र स्वीकृति सूचना (Staff ID Approved)*

नमस्ते *${staff.fullName}* जी,
हार्दिक बधाई! जीवन ज्योति फाउंडेशन में आपका स्टाफ पंजीकरण एवं आधिकारिक डिजिटल पहचान पत्र संस्था प्रशासन (Admin) द्वारा *स्वीकृत (Approved)* कर दिया गया है।

🪪 *स्टाफ आईडी:* ${staff.id}
💼 *पदनाम:* ${staff.designation}
🏢 *विभाग:* ${staff.department}
📍 *कार्यक्षेत्र:* ${staff.dutyLocation}

📄 *अपना 2-Page प्रिंट-रेडी पहचान पत्र डाउनलोड करने का आधिकारिक लिंक:*
${downloadUrl}

🔒 *सुरक्षा निर्देश:* ऊपर दिए गए लिंक को खोलें और अपने रजिस्टर्ड मोबाइल नंबर (*+91 ${cleanMobile}*) पर प्राप्त OTP सत्यापित करके अपना पहचान पत्र तुरंत डाउनलोड करें।

- *प्रशासन, जीवन ज्योति फाउंडेशन*
मीरानपुर, मोहम्मदाबाद, जनपद गाजीपुर (उ.प्र.)
हेल्पलाइन: +91 8052361666`;

  return `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(message)}`;
}

/**
 * Approve a staff member and activate their official ID card
 */
export function approveStaffMember(
  id: string,
  adminName: string = 'Admin'
): { staff: StaffMember; whatsappUrl: string } | null {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const target = current[index];
  const updatedStaff: StaffMember = {
    ...target,
    status: 'approved',
    approvedAt: nowIso,
    statusUpdatedAt: nowIso,
    approvedBy: adminName,
    rejectionReason: undefined
  };

  current[index] = updatedStaff;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    // Register into public verification registry
    registerStaffIntoCentralRegistry(updatedStaff);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    triggerBackgroundDataSync();
  } catch (err) {
    console.error('Failed to update staff approval:', err);
  }

  const whatsappUrl = generateStaffApprovalWhatsAppUrl(updatedStaff);
  return { staff: updatedStaff, whatsappUrl };
}

/**
 * Reject a staff member registration with optional reason
 */
export function rejectStaffMember(
  id: string,
  reason: string = 'दस्तावेज या विवरण अपूर्ण होने के कारण'
): StaffMember | null {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const updatedStaff: StaffMember = {
    ...current[index],
    status: 'rejected',
    statusUpdatedAt: nowIso,
    rejectedAt: nowIso,
    rejectionReason: reason
  };

  current[index] = updatedStaff;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    // Also update rejection in central certificate registry
    registerStaffIntoCentralRegistry(updatedStaff);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    triggerBackgroundDataSync();
  } catch (err) {
    console.error('Failed to reject staff:', err);
  }

  return updatedStaff;
}

/**
 * Mark staff as notified via WhatsApp
 */
export function markStaffWhatsAppNotified(id: string): void {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return;

  current[index] = {
    ...current[index],
    whatsappNotified: true,
    whatsappNotifiedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
  } catch (err) {
    console.error('Failed to mark whatsapp notified:', err);
  }
}

/**
 * Cancel / Revoke an issued staff member ID card
 */
export function cancelStaffMember(
  id: string,
  reason: string = 'प्रशासनिक आदेश द्वारा पहचान पत्र निरस्त',
  adminName: string = 'Admin'
): StaffMember | null {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const updatedStaff: StaffMember = {
    ...current[index],
    status: 'cancelled',
    statusUpdatedAt: nowIso,
    cancelledAt: nowIso,
    cancelledBy: adminName,
    cancellationReason: reason
  };

  current[index] = updatedStaff;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    // Also cancel in central certificate registry for both ID and Appointment letter
    cancelCertificateInRegistry(id, reason, adminName);
    cancelCertificateInRegistry(`${id}-APPT`, reason, adminName);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    triggerBackgroundDataSync();
  } catch (err) {
    console.error('Failed to cancel staff card:', err);
  }

  return updatedStaff;
}

/**
 * Delete staff member from registry completely
 */
export function deleteStaffMember(id: string): boolean {
  const current = getAllStaffMembers();
  const filtered = current.filter((m) => m.id.toLowerCase() !== id.toLowerCase());
  if (filtered.length === current.length) return false;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(filtered));
    // Also expunge from central certificate registry
    deleteCertificateFromRegistry(id).catch((err) => console.debug('Central deletion note:', err));
    deleteCertificateFromRegistry(`${id}-APPT`).catch((err) => console.debug('Central deletion note:', err));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    triggerBackgroundDataSync();
    return true;
  } catch (err) {
    console.error('Failed to delete staff:', err);
    return false;
  }
}

/**
 * Find staff member by ID or 10-digit mobile number
 */
export function findStaffMember(query: string): StaffMember | null {
  if (!query) return null;
  const cleanQuery = query.trim().toLowerCase();
  const digitsOnly = query.replace(/[^0-9]/g, '');

  const all = getAllStaffMembers();

  // Search exact ID first
  const byId = all.find((m) => m.id.toLowerCase() === cleanQuery);
  if (byId) return byId;

  // Search by reference code (e.g., 6009 or JJF/APPT-STF/2026/6009)
  if (cleanQuery.includes('6009') || cleanQuery === 'jjf-stf-2026-009') {
    const s009 = all.find((m) => m.id === 'JJF-STF-2026-009');
    if (s009) return s009;
  }

  // Search by mobile (last 10 digits)
  if (digitsOnly.length >= 10) {
    const foundByPhone = findStaffByMobile(digitsOnly.slice(-10));
    if (foundByPhone) return foundByPhone;
  }

  // Search partial ID or Name (prioritizing approved official staff)
  const byPartialApproved = all.find(
    (m) =>
      (m.status === 'approved' || m.status === 'active' || m.status === 'verified') &&
      (m.id.toLowerCase().includes(cleanQuery) ||
        m.fullName.toLowerCase().includes(cleanQuery) ||
        m.designation.toLowerCase().includes(cleanQuery) ||
        (m.fatherOrHusbandName && m.fatherOrHusbandName.toLowerCase().includes(cleanQuery)))
  );
  if (byPartialApproved) return byPartialApproved;

  const byPartial = all.find(
    (m) =>
      m.id.toLowerCase().includes(cleanQuery) ||
      m.fullName.toLowerCase().includes(cleanQuery) ||
      m.designation.toLowerCase().includes(cleanQuery) ||
      (m.fatherOrHusbandName && m.fatherOrHusbandName.toLowerCase().includes(cleanQuery))
  );

  return byPartial || null;
}

/**
 * Find staff member specifically by 10-digit registered mobile number
 */
export function findStaffByMobile(mobile: string): StaffMember | null {
  if (!mobile) return null;
  const digitsOnly = mobile.replace(/[^0-9]/g, '');
  if (digitsOnly.length < 10) return null;
  const searchPhone = digitsOnly.slice(-10);

  const all = getAllStaffMembers();

  // 1. Direct priority: 8052361666 belongs to Manager Shailesh Pradhan (JJF-STF-2026-009)
  if (searchPhone === '8052361666') {
    const s009 = all.find((m) => m.id === 'JJF-STF-2026-009');
    if (s009) return s009;
  }

  // 2. Exact primary mobile match that is approved
  const approvedExact = all.find(
    (m) =>
      m.mobile &&
      m.mobile.replace(/[^0-9]/g, '').slice(-10) === searchPhone &&
      (m.status === 'approved' || m.status === 'active' || m.status === 'verified')
  );
  if (approvedExact) return approvedExact;

  // 3. Exact primary mobile match (any status)
  const anyExact = all.find(
    (m) => m.mobile && m.mobile.replace(/[^0-9]/g, '').slice(-10) === searchPhone
  );
  if (anyExact) return anyExact;

  // 4. Emergency contact match only as a fallback
  const byEmergency = all.find(
    (m) => m.emergencyContact && m.emergencyContact.replace(/[^0-9]/g, '').slice(-10) === searchPhone
  );
  return byEmergency || null;
}
