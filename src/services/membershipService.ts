// ============================================================================
// JEEVAN JYOTI FOUNDATION - NGO MEMBERSHIP SERVICE
// जीवन ज्योति फाउंडेशन - आधिकारिक सदस्यता प्रबंधन, आवेदन, भुगतान व सत्यापन सेवा
// ============================================================================

import {
  NgoMemberRecord,
  NgoMembershipPlan,
  MembershipType,
  OFFICIAL_MEMBERSHIP_PLANS
} from '../types/membership';
import { db, isMockFirebase } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { saveCertificateToRegistry } from './certificateRegistryService';
import { syncCurrentAdminDataToGitHub } from './adminService';

const STORAGE_KEY = 'jjf_ngo_members_v1';
const FIRESTORE_COLLECTION = 'ngo_members';

// Normalize phone number to 10 digits
export function normalizeMemberPhone(phone?: string | null): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

// Initial default approved members for foundation registry demonstration
const SEED_APPROVED_MEMBERS: NgoMemberRecord[] = [
  {
    id: 'JJF-MEM-2018-001',
    applicationNo: 'JJF-MEM-APP-2018-001',
    membershipType: 'patron',
    planNameHindi: 'संरक्षक / मानद सदस्यता',
    planNameEnglish: 'Patron Membership',
    fullName: 'शैलेश प्रधान',
    fatherOrHusbandName: 'रामजन्म प्रधान',
    relationType: 'Father',
    gender: 'male',
    dob: '1985-05-15',
    age: 41,
    phone: '8052361666',
    whatsappNumber: '8052361666',
    email: 'jeevanjyotifoundationgzp@gmail.com',
    bloodGroup: 'B+',
    occupation: 'समाजसेवी एवं संस्था प्रबंधक',
    address: 'ग्राम व पोस्ट - दाउदपुर, तहसील - मोहम्मदाबाद',
    district: 'ग़ाज़ीपुर',
    state: 'उत्तर प्रदेश',
    pincode: '233303',
    block: 'मोहम्मदाबाद',
    wardOrVillage: 'दाउदपुर',
    idProofType: 'aadhaar',
    idProofNumber: 'XXXX-XXXX-9412',
    photoUrl: '/manager_secretary.webp',
    paymentAmount: 11000,
    paymentMode: 'bank_transfer',
    transactionRef: 'BOI/NEFT/2018/FOUNDER01',
    paymentDate: '2018-08-15',
    status: 'approved',
    appliedAt: '2018-08-15T10:00:00.000Z',
    approvedAt: '2018-08-15T12:00:00.000Z',
    approvedBy: 'संस्था कार्यकारिणी मंडल',
    validFrom: '2018-08-15',
    validTill: 'आजीवन (Lifetime)',
    certificateIssued: true,
    certificateNumber: 'JJF/MEM-CERT/2018/001'
  }
];

/**
 * Get all members from localStorage and Firestore
 */
export function getAllMembers(): NgoMemberRecord[] {
  let list: NgoMemberRecord[] = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        list = JSON.parse(stored);
      }
    }
  } catch (e) {
    console.warn('[MembershipService] LocalStorage read warning:', e);
  }

  if (!Array.isArray(list) || list.length === 0) {
    list = [...SEED_APPROVED_MEMBERS];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
  }

  // Deduplicate by ID or ApplicationNo
  const map = new Map<string, NgoMemberRecord>();
  list.forEach((item) => {
    if (item && (item.id || item.applicationNo)) {
      const key = (item.id || item.applicationNo).toUpperCase();
      map.set(key, item);
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(b.appliedAt || b.approvedAt || 0).getTime();
    const timeB = new Date(a.appliedAt || a.approvedAt || 0).getTime();
    return timeA - timeB;
  });
}

/**
 * Fetch all members from Firestore in the background
 */
export async function fetchRemoteMembers(): Promise<NgoMemberRecord[]> {
  const localList = getAllMembers();
  if (isMockFirebase || !db) return localList;

  try {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const remoteList: NgoMemberRecord[] = [];
      snap.forEach((d) => {
        remoteList.push(d.data() as NgoMemberRecord);
      });

      const mergedMap = new Map<string, NgoMemberRecord>();
      localList.forEach((m) => mergedMap.set((m.id || m.applicationNo).toUpperCase(), m));
      remoteList.forEach((m) => mergedMap.set((m.id || m.applicationNo).toUpperCase(), m));

      const merged = Array.from(mergedMap.values());
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch {}
      return merged;
    }
  } catch (err) {
    console.debug('[MembershipService] Firestore fetch notice:', err);
  }
  return localList;
}

/**
 * Find member by ID or Application Number
 */
export function getMemberById(idOrAppNo: string): NgoMemberRecord | null {
  if (!idOrAppNo) return null;
  const clean = idOrAppNo.trim().toUpperCase();
  const all = getAllMembers();
  return (
    all.find(
      (m) =>
        m.id?.toUpperCase() === clean ||
        m.applicationNo?.toUpperCase() === clean ||
        m.certificateNumber?.toUpperCase() === clean
    ) || null
  );
}

/**
 * Search members by 10-digit mobile number
 */
export function getMembersByPhone(phone: string): NgoMemberRecord[] {
  const cleanPhone = normalizeMemberPhone(phone);
  if (!cleanPhone || cleanPhone.length < 10) return [];
  const all = getAllMembers();
  return all.filter((m) => normalizeMemberPhone(m.phone) === cleanPhone);
}

/**
 * Apply for new NGO Membership (Submission with Payment Details)
 */
export async function applyForMembership(
  data: Omit<NgoMemberRecord, 'id' | 'applicationNo' | 'status' | 'appliedAt'>
): Promise<NgoMemberRecord> {
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationNo = `JJF-MEM-APP-${year}-${randomSuffix}`;
  const temporaryId = applicationNo;

  const plan = OFFICIAL_MEMBERSHIP_PLANS.find((p) => p.id === data.membershipType) || OFFICIAL_MEMBERSHIP_PLANS[0];

  const newRecord: NgoMemberRecord = {
    ...data,
    id: temporaryId,
    applicationNo,
    planNameHindi: plan.titleHindi,
    planNameEnglish: plan.titleEnglish,
    status: 'pending',
    appliedAt: now,
    certificateIssued: false
  };

  // 1. Save to LocalStorage
  const all = getAllMembers();
  all.unshift(newRecord);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  } catch (e) {
    console.warn('[MembershipService] LocalStorage save warning:', e);
  }

  // 2. Save to Firestore with 2s timeout
  if (!isMockFirebase && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, applicationNo);
      const writePromise = setDoc(docRef, newRecord, { merge: true });
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
      await Promise.race([writePromise, timeoutPromise]);
    } catch (err) {
      console.warn('[MembershipService] Firestore save notice:', err);
    }
  }

  // 3. Dispatch application event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-membership-updated', { detail: newRecord }));
  }

  // 4. Background GitHub Data Sync
  syncCurrentAdminDataToGitHub(false).catch(() => {});

  return newRecord;
}

/**
 * Approve Membership (Admin Action)
 * Assigns official membership number, validity period, and registers certificate
 */
export async function approveMembership(
  targetIdOrAppNo: string,
  adminName: string = 'सिस्टम व्यवस्थापक',
  adminUid: string = 'admin',
  options?: {
    customMembershipId?: string;
    customValidTill?: string;
  }
): Promise<NgoMemberRecord> {
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const all = getAllMembers();
  const targetIndex = all.findIndex(
    (m) =>
      m.id?.toUpperCase() === targetIdOrAppNo.toUpperCase() ||
      m.applicationNo?.toUpperCase() === targetIdOrAppNo.toUpperCase()
  );

  if (targetIndex === -1) {
    throw new Error('सदस्यता आवेदन रिकॉर्ड नहीं मिला।');
  }

  const existing = all[targetIndex];
  const countApproved = all.filter((m) => m.status === 'approved').length + 1;
  const sequentialNum = String(countApproved).padStart(3, '0');

  const officialMembershipId =
    options?.customMembershipId ||
    (existing.id.startsWith('JJF-MEM-20') && !existing.id.includes('APP')
      ? existing.id
      : `JJF-MEM-${year}-${sequentialNum}`);

  const certificateNumber = `JJF/MEM-CERT/${year}/${sequentialNum}`;

  // Calculate validity:
  let validTill = 'आजीवन (Lifetime)';
  if (existing.membershipType === 'annual' || existing.membershipType === 'youth' || existing.membershipType === 'executive') {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    validTill = options?.customValidTill || nextYear.toISOString().split('T')[0];
  } else if (options?.customValidTill) {
    validTill = options.customValidTill;
  }

  const updatedRecord: NgoMemberRecord = {
    ...existing,
    id: officialMembershipId,
    status: 'approved',
    approvedAt: now,
    approvedBy: adminName,
    validFrom: now.split('T')[0],
    validTill,
    certificateIssued: true,
    certificateNumber
  };

  all[targetIndex] = updatedRecord;

  // 1. Update LocalStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  } catch (e) {
    console.warn('[MembershipService] LocalStorage update warning:', e);
  }

  // 2. Register in Official Certificate Registry (for universal verification & QR code)
  try {
    await saveCertificateToRegistry({
      id: officialMembershipId,
      type: 'membership_cert' as any,
      titleHindi: `आधिकारिक संस्था सदस्यता प्रमाण पत्र (${updatedRecord.planNameHindi})`,
      titleEnglish: `Official NGO Membership Certificate (${updatedRecord.planNameEnglish})`,
      recipientName: updatedRecord.fullName,
      fatherOrHusbandName: updatedRecord.fatherOrHusbandName,
      phone: updatedRecord.phone,
      issueDate: updatedRecord.validFrom || now.split('T')[0],
      categoryOrPurpose: updatedRecord.planNameHindi,
      photoUrl: updatedRecord.photoUrl,
      amount: updatedRecord.paymentAmount,
      details: `सदस्यता क्रमांक: ${officialMembershipId} | योजना: ${updatedRecord.planNameHindi} | वैधता: ${validTill}`,
      status: 'verified',
      approvalStatus: 'approved',
      approvedAt: now,
      approvedBy: adminName,
      address: `${updatedRecord.address}, ${updatedRecord.district}, ${updatedRecord.state}`
    });
  } catch (regErr) {
    console.warn('[MembershipService] Certificate registry sync notice:', regErr);
  }

  // 3. Update Firestore with 2s timeout
  if (!isMockFirebase && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, updatedRecord.id);
      await setDoc(docRef, updatedRecord, { merge: true });
      // If previous id was application number, remove old doc
      if (existing.applicationNo && existing.applicationNo !== updatedRecord.id) {
        deleteDoc(doc(db, FIRESTORE_COLLECTION, existing.applicationNo)).catch(() => {});
      }
    } catch (err) {
      console.warn('[MembershipService] Firestore approval notice:', err);
    }
  }

  // 4. Dispatch update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-membership-updated', { detail: updatedRecord }));
    window.dispatchEvent(new CustomEvent('jjf-certificates-updated'));
  }

  // 5. Background GitHub Data Sync
  syncCurrentAdminDataToGitHub(false).catch(() => {});

  return updatedRecord;
}

/**
 * Reject Membership (Admin Action)
 */
export async function rejectMembership(
  targetIdOrAppNo: string,
  rejectionReason: string,
  adminName: string = 'सिस्टम व्यवस्थापक'
): Promise<NgoMemberRecord> {
  const now = new Date().toISOString();
  const all = getAllMembers();
  const targetIndex = all.findIndex(
    (m) =>
      m.id?.toUpperCase() === targetIdOrAppNo.toUpperCase() ||
      m.applicationNo?.toUpperCase() === targetIdOrAppNo.toUpperCase()
  );

  if (targetIndex === -1) {
    throw new Error('सदस्यता आवेदन रिकॉर्ड नहीं मिला।');
  }

  const existing = all[targetIndex];
  const updatedRecord: NgoMemberRecord = {
    ...existing,
    status: 'rejected',
    rejectedAt: now,
    rejectionReason: rejectionReason || 'विवरण अथवा भुगतान सत्यापन में विसंगति पाई गई।'
  };

  all[targetIndex] = updatedRecord;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  } catch {}

  if (!isMockFirebase && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, existing.id || existing.applicationNo);
      await setDoc(docRef, updatedRecord, { merge: true });
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-membership-updated', { detail: updatedRecord }));
  }

  // Background GitHub Data Sync
  syncCurrentAdminDataToGitHub(false).catch(() => {});

  return updatedRecord;
}

/**
 * Delete Member Record (Admin Action)
 */
export async function deleteMember(targetIdOrAppNo: string): Promise<boolean> {
  let all = getAllMembers();
  const filtered = all.filter(
    (m) =>
      m.id?.toUpperCase() !== targetIdOrAppNo.toUpperCase() &&
      m.applicationNo?.toUpperCase() !== targetIdOrAppNo.toUpperCase()
  );

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {}

  if (!isMockFirebase && db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, targetIdOrAppNo));
    } catch {}
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf-membership-updated'));
  }

  // Background GitHub Data Sync
  syncCurrentAdminDataToGitHub(false).catch(() => {});

  return true;
}

// Convenient Aliases and Queries
export const getAllMembershipRecords = getAllMembers;
export const deleteMembershipRecord = deleteMember;

export function getPendingMembershipRecords(): NgoMemberRecord[] {
  return getAllMembers().filter((m) => m.status === 'pending');
}

export function getApprovedMembershipRecords(): NgoMemberRecord[] {
  return getAllMembers().filter((m) => m.status === 'approved');
}

export function generateMembershipId(): string {
  const year = new Date().getFullYear();
  const all = getAllMembers();
  const count = all.filter((m) => m.status === 'approved').length + 1;
  return `JJF-MEM-${year}-${String(count).padStart(3, '0')}`;
}
