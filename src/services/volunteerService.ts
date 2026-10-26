// ============================================================================
// JEEVAN JYOTI FOUNDATION - VOLUNTEER (SWAYAM SEWAK) SERVICE
// जीवन ज्योति फाउंडेशन - स्वयंसेवक (Swayam Sewak) प्रबंधन, पंजीकरण एवं अनुमोदन सेवा
// ============================================================================

import { Volunteer } from '../types';
import { INITIAL_VOLUNTEERS } from '../data/taskData';
import {
  saveCertificateToRegistry,
  approveCertificateInRegistry,
  rejectCertificateInRegistry,
  cancelCertificateInRegistry,
  deleteCertificateFromRegistry
} from './certificateRegistryService';

export const VOLUNTEER_STORAGE_KEY = 'jjf_volunteers';

/**
 * Normalizes phone numbers to 10 digits
 */
function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '8052361666';
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits || '8052361666';
}

/**
 * Synchronize volunteer records into the central verification registry:
 * 1. Swayam Sewak ID Card
 * 2. Swayam Sewak Official Appointment Letter
 * 3. Swayam Sewak Honorary Service Certificate
 */
export function syncVolunteerIntoCentralRegistry(vol: Volunteer): void {
  try {
    const cleanPhone = cleanPhoneNumber(vol.phone);
    const effectiveApproval = vol.approvalStatus || (vol.status === 'certified' || vol.status === 'leader' ? 'approved' : 'pending');
    const cardId = vol.id.includes('VOL') ? vol.id.replace(/VOL/g, 'ID') : (vol.id.startsWith('JJF-ID') ? vol.id : `JJF-ID-2026-${vol.id.replace(/\D/g, '').slice(-3) || '101'}`);
    const apptId = `${vol.id}-APPT`;
    const certId = vol.id.includes('ID') ? vol.id.replace(/ID/g, 'VOL') : vol.id;

    // 1. Digital Identity Card (I-Card)
    saveCertificateToRegistry({
      id: cardId,
      type: 'volunteer_id',
      titleHindi: 'स्वयंसेवक डिजिटल पहचान पत्र',
      titleEnglish: 'Swayam Sewak Digital ID Card',
      recipientName: vol.name,
      fatherOrHusbandName: vol.fatherName,
      phone: cleanPhone,
      issueDate: vol.joinDate || new Date().toISOString().slice(0, 10),
      categoryOrPurpose: `${vol.role} • ${vol.areaHindi || vol.area}`,
      photoUrl: vol.photoUrl,
      details: `रक्त समूह: ${vol.bloodGroup || 'O+'} • अधिकृत स्वयंसेवक पहचान पत्र • कार्यक्षेत्र: ${vol.areaHindi || vol.area}`,
      status: 'active',
      approvalStatus: effectiveApproval,
      approvedAt: vol.approvedAt,
      approvedBy: vol.approvedBy,
      rejectionReason: vol.rejectionReason,
      rawVolunteer: vol
    });

    // 2. Official Appointment Letter (नियुक्ति पत्र on Official Letterhead)
    saveCertificateToRegistry({
      id: apptId,
      type: 'task_appreciation',
      titleHindi: 'स्वयंसेवक आधिकारिक नियुक्ति पत्र',
      titleEnglish: 'Official Volunteer Appointment Letter',
      recipientName: vol.name,
      fatherOrHusbandName: vol.fatherName,
      phone: cleanPhone,
      issueDate: vol.joinDate || new Date().toISOString().slice(0, 10),
      categoryOrPurpose: `${vol.role} • ${vol.areaHindi || vol.area}`,
      photoUrl: vol.photoUrl,
      details: `स्वयंसेवक नियुक्ति पत्र • कार्यक्षेत्र: ${vol.areaHindi || vol.area} • जिला: ${vol.district || 'गाजीपुर'}`,
      status: 'active',
      approvalStatus: effectiveApproval,
      approvedAt: vol.approvedAt,
      approvedBy: vol.approvedBy,
      rejectionReason: vol.rejectionReason,
      rawVolunteer: vol
    });

    // 3. Honorary Service Certificate (प्रमाण पत्र)
    saveCertificateToRegistry({
      id: certId,
      type: 'volunteer_cert',
      titleHindi: 'स्वयंसेवक मानद सेवा सम्मान प्रमाण पत्र',
      titleEnglish: 'Official Volunteer Certificate',
      recipientName: vol.name,
      fatherOrHusbandName: vol.fatherName,
      phone: cleanPhone,
      issueDate: vol.joinDate || new Date().toISOString().slice(0, 10),
      categoryOrPurpose: `${vol.role} • ${vol.areaHindi || vol.area}`,
      photoUrl: vol.photoUrl,
      details: `सेवा योगदान: ${vol.areaHindi || vol.area} • निष्काम समाज सेवा सम्मान`,
      status: 'verified',
      approvalStatus: effectiveApproval,
      approvedAt: vol.approvedAt,
      approvedBy: vol.approvedBy,
      rejectionReason: vol.rejectionReason,
      rawVolunteer: vol
    });
  } catch (err) {
    console.warn('Failed to sync volunteer into central registry:', err);
  }
}

/**
 * Retrieve all registered volunteers from localStorage, seeding with INITIAL_VOLUNTEERS if first run
 */
export function getAllVolunteers(): Volunteer[] {
  try {
    const raw = localStorage.getItem(VOLUNTEER_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Permanently remove dummy volunteer records
      const clean = parsed.filter((v) => {
        if (!v || !v.id) return false;
        const idUpper = v.id.toUpperCase();
        if (
          idUpper === 'VOL-01' ||
          idUpper === 'VOL-02' ||
          idUpper === 'VOL-03' ||
          idUpper === 'VOL-04' ||
          idUpper === 'VOL-05' ||
          idUpper === 'JJF-VOL-2026-001' ||
          idUpper === 'JJF-VOL-2026-01' ||
          idUpper === 'JJF-ID-2026-01' ||
          idUpper === 'JJF-VOL-01' ||
          idUpper === 'JJF-VOL-2026-659'
        ) {
          return false;
        }
        if (v.name === 'Aakash Verma' && v.phone === '+91-9876543211') return false;
        return true;
      });

      if (clean.length !== parsed.length) {
        localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(clean));
      }
      return clean;
    }
    return [];
  } catch (err) {
    console.warn('Error reading volunteers from localStorage:', err);
    return [];
  }
}

/**
 * Generate unique sequential Volunteer ID starting from 0001: e.g. JJF-VOL-2026-0001
 */
export function generateNextVolunteerId(): string {
  const current = getAllVolunteers();
  const year = new Date().getFullYear();
  let maxSeq = 0;

  current.forEach((v) => {
    const match = v.id.match(/JJF-VOL-\d+-(\d+)/i) || v.id.match(/VOL-(\d+)/i) || v.id.match(/JJF-ID-\d+-(\d+)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `JJF-VOL-${year}-${nextSeq}`;
}

/**
 * Register a new volunteer (default status: 'pending' awaiting Admin approval)
 */
export function registerNewVolunteer(
  data: Partial<Volunteer> & { name: string; fatherName: string },
  approvalStatus: 'pending' | 'approved' = 'pending'
): Volunteer {
  const id = data.id || generateNextVolunteerId();
  const cleanPhone = cleanPhoneNumber(data.phone);

  const newVol: Volunteer = {
    id,
    name: data.name.trim(),
    fatherName: data.fatherName.trim(),
    relationType: data.relationType || 'Father',
    role: data.role || 'सक्रिय स्वयंसेवक (Active Volunteer)',
    area: data.area || 'Social Service',
    areaHindi: data.areaHindi || 'समाज सेवा व निःशुल्क शिक्षा',
    hoursContributed: data.hoursContributed || 24,
    tasksCompleted: data.tasksCompleted || 4,
    joinDate: data.joinDate || new Date().toISOString().slice(0, 10),
    photoUrl: data.photoUrl,
    bloodGroup: data.bloodGroup || 'O+',
    status: approvalStatus === 'approved' ? 'certified' : 'active',
    approvalStatus,
    phone: cleanPhone ? `+91-${cleanPhone}` : undefined,
    country: data.country || 'India',
    state: data.state || 'Uttar Pradesh',
    district: data.district || 'Ghazipur',
    block: data.block || 'Mohammadabad',
    wardOrVillage: data.wardOrVillage || 'मीरानपुर (Miranpur)',
    whatsappConsent: data.whatsappConsent !== undefined ? data.whatsappConsent : true,
    whatsappOptInAt: data.whatsappOptInAt || new Date().toISOString()
  };

  const current = getAllVolunteers();
  // Check if exists
  const existIdx = current.findIndex((v) => v.id.toLowerCase() === id.toLowerCase());
  let updated: Volunteer[];
  if (existIdx >= 0) {
    updated = [...current];
    updated[existIdx] = { ...updated[existIdx], ...newVol };
  } else {
    updated = [newVol, ...current];
  }

  try {
    localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(updated));
    // Immediately register all 3 companion documents (ID card, appointment letter, certificate)
    syncVolunteerIntoCentralRegistry(newVol);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-volunteer-updated'));
    }
  } catch (err) {
    console.warn('LocalStorage save volunteer quota warning, applying safe trim:', err);
    try {
      const trimmed = updated.slice(0, 50).map((v, i) => (i > 15 ? { ...v, photoUrl: '' } : v));
      localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(trimmed));
      syncVolunteerIntoCentralRegistry(newVol);
    } catch {}
  }

  return newVol;
}

/**
 * Approve a volunteer registration (approves ID card, Appointment Letter and Certificate)
 */
export function approveVolunteer(
  id: string,
  adminName: string = 'Admin'
): { volunteer: Volunteer; whatsappUrl: string } | null {
  const current = getAllVolunteers();
  const index = current.findIndex((v) => v.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const updatedVol: Volunteer = {
    ...current[index],
    status: 'certified',
    approvalStatus: 'approved',
    approvedAt: nowIso,
    approvedBy: adminName,
    rejectionReason: undefined
  };

  current[index] = updatedVol;

  try {
    localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(current));
    // Update registry companion records to approved
    syncVolunteerIntoCentralRegistry(updatedVol);
    approveCertificateInRegistry(updatedVol.id, adminName);
    approveCertificateInRegistry(`${updatedVol.id}-APPT`, adminName);
    const cardId = updatedVol.id.includes('VOL') ? updatedVol.id.replace(/VOL/g, 'ID') : updatedVol.id;
    approveCertificateInRegistry(cardId, adminName);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-volunteer-updated'));
    }
  } catch (err) {
    console.error('Failed to approve volunteer:', err);
  }

  const whatsappUrl = generateVolunteerApprovalWhatsAppUrl(updatedVol);
  return { volunteer: updatedVol, whatsappUrl };
}

/**
 * Reject a volunteer registration
 */
export function rejectVolunteer(
  id: string,
  reason: string = 'विवरण अथवा दस्तावेज अपूर्ण होने के कारण'
): Volunteer | null {
  const current = getAllVolunteers();
  const index = current.findIndex((v) => v.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const updatedVol: Volunteer = {
    ...current[index],
    approvalStatus: 'rejected',
    rejectionReason: reason,
    rejectedAt: nowIso
  };

  current[index] = updatedVol;

  try {
    localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(current));
    syncVolunteerIntoCentralRegistry(updatedVol);
    rejectCertificateInRegistry(updatedVol.id, reason);
    rejectCertificateInRegistry(`${updatedVol.id}-APPT`, reason);
    const cardId = updatedVol.id.includes('VOL') ? updatedVol.id.replace(/VOL/g, 'ID') : updatedVol.id;
    rejectCertificateInRegistry(cardId, reason);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-volunteer-updated'));
    }
  } catch (err) {
    console.error('Failed to reject volunteer:', err);
  }

  return updatedVol;
}

/**
 * Delete a volunteer permanently
 */
export function deleteVolunteer(id: string): boolean {
  const current = getAllVolunteers();
  const filtered = current.filter((v) => v.id.toLowerCase() !== id.toLowerCase());
  if (filtered.length === current.length) return false;

  try {
    localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(filtered));
    deleteCertificateFromRegistry(id).catch(() => {});
    deleteCertificateFromRegistry(`${id}-APPT`).catch(() => {});
    const cardId = id.includes('VOL') ? id.replace(/VOL/g, 'ID') : id;
    deleteCertificateFromRegistry(cardId).catch(() => {});

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-volunteer-updated'));
    }
    return true;
  } catch (err) {
    console.error('Failed to delete volunteer:', err);
    return false;
  }
}

/**
 * Generate pre-formatted WhatsApp congratulations message with download link
 */
export function generateVolunteerApprovalWhatsAppUrl(vol: Volunteer): string {
  const cleanMobile = cleanPhoneNumber(vol.phone);
  const cardId = vol.id.includes('VOL') ? vol.id.replace(/VOL/g, 'ID') : vol.id;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jeevanjyotifoundation.org';

  const message = `*जीवन ज्योति फाउंडेशन (पंजीकृत ट्रस्ट)*
मीरांपुर, मोहम्मदाबाद, गाजीपुर (उ.प्र.)

आदरणीय *${vol.name}* जी,
हार्दिक बधाई एवं साधुवाद! 🙏

आपके *स्वयंसेवक (Swayam Sewak) पंजीकरण* को संस्था द्वारा सहर्ष *स्वीकृत (Approved)* कर दिया गया है।

📋 *पंजीकरण विवरण:*
• स्वयंसेवक ID: *${vol.id}*
• डिजिटल ID कार्ड: *${cardId}*
• कार्यक्षेत्र: *${vol.areaHindi || vol.area}*
• स्थिति: *स्वीकृत एवं सक्रिय (Active & Approved)*

📜 *दस्तावेज डाउनलोड लिंक्स:*
1. *पहचान पत्र (I-Card)* एवं *नियुक्ति पत्र (Appointment Letter)* डाउनलोड करने हेतु:
${baseUrl}/?phone=${cleanMobile}#downloads

2. *सार्वजनिक क्यूआर सत्यापन लिंक:*
${baseUrl}/?verify=${encodeURIComponent(vol.id)}

मानव सेवा व राष्ट्र निर्माण के इस पुनीत अभियान में आपका स्वागत है।

- *प्रशासन, जीवन ज्योति फाउंडेशन*
हेल्पलाइन: +91 8052361666`;

  return `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(message)}`;
}
