// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN STAFF I-CARD APPROVAL MANAGER
// जीवन ज्योति फाउंडेशन - स्टाफ आई-कार्ड अनुमोदन, अस्वीकृति एवं WhatsApp लिंक प्रबंधन
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  IdCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Phone,
  MessageSquare,
  Award,
  Eye,
  Trash2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Building,
  Droplet,
  User,
  Check,
  Send,
  Printer,
  FileText,
  X,
  Sparkles,
  MapPin,
  HelpCircle,
  RefreshCw,
  Table,
  LayoutGrid,
  ShieldAlert,
  ShieldCheck,
  History,
  Activity,
  Ban,
  RotateCcw
} from 'lucide-react';
import { StaffMember, StaffStatus, StaffCardTheme, StaffCardLanguage, formatRelationLabel } from '../../types/staff';
import {
  getAllStaffMembers,
  approveStaffMember,
  rejectStaffMember,
  deleteStaffMember,
  cancelStaffMember,
  generateStaffApprovalWhatsAppUrl,
  markStaffWhatsAppNotified,
  getStaffDownloadUrl
} from '../../services/staffService';
import { StaffIdCard } from '../staff/StaffIdCard';
import { exportElementsAsMultiPagePdf, directPrintElement } from '../../utils/exportImage';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AppointmentLetterModal } from '../common/AppointmentLetterModal';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { Volunteer } from '../../types';
import {
  getAllVolunteers,
  approveVolunteer,
  rejectVolunteer,
  deleteVolunteer,
  generateVolunteerApprovalWhatsAppUrl
} from '../../services/volunteerService';
import { SwayamSewakCardModal } from '../SwayamSewakCardModal';
import { VolunteerCertificateModal } from '../VolunteerCertificateModal';
import { StampedCandidatePhoto } from '../common/StampedCandidatePhoto';

export const TabStaffApprovalManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'cancelled'>('pending');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [previewStaff, setPreviewStaff] = useState<StaffMember | null>(null);
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [previewTheme, setPreviewTheme] = useState<StaffCardTheme>('maroon_gold');
  const [previewLang, setPreviewLang] = useState<StaffCardLanguage>('bilingual');
  const [isExporting, setIsExporting] = useState(false);
  const [adminAppointmentStaff, setAdminAppointmentStaff] = useState<StaffMember | null>(null);

  // WhatsApp Dialog Modal
  const [whatsappModalData, setWhatsappModalData] = useState<{
    staff: StaffMember;
    url: string;
  } | null>(null);

  // Rejection Dialog Modal
  const [rejectModalStaff, setRejectModalStaff] = useState<StaffMember | null>(null);
  const [rejectionReason, setRejectionReason] = useState('विवरण अथवा दस्तावेज अपूर्ण हैं।');

  // Cancellation Dialog Modal (Cancel Issued ID Card)
  const [cancelModalStaff, setCancelModalStaff] = useState<StaffMember | null>(null);
  const [cancelReasonStaff, setCancelReasonStaff] = useState('प्रशासनिक समीक्षा अथवा सेवा समाप्ति उपरांत पहचान पत्र निरस्त');

  // Delete Confirmation Dialog Modal
  const [deleteModalStaff, setDeleteModalStaff] = useState<StaffMember | null>(null);

  // Active Sub-Tab: 'staff' vs 'volunteer'
  const [activeRoleTab, setActiveRoleTab] = useState<'staff' | 'volunteer'>('staff');

  // Volunteer State & Filters
  const [volunteerList, setVolunteerList] = useState<Volunteer[]>([]);
  const [volStatusFilter, setVolStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [adminAppointmentVolunteer, setAdminAppointmentVolunteer] = useState<Volunteer | null>(null);
  const [previewVolunteerCard, setPreviewVolunteerCard] = useState<Volunteer | null>(null);
  const [previewVolunteerCert, setPreviewVolunteerCert] = useState<Volunteer | null>(null);
  const [rejectModalVolunteer, setRejectModalVolunteer] = useState<Volunteer | null>(null);
  const [volRejectionReason, setVolRejectionReason] = useState('विवरण अथवा दस्तावेज अपूर्ण हैं।');
  const [deleteModalVolunteer, setDeleteModalVolunteer] = useState<Volunteer | null>(null);

  const refreshList = () => {
    setStaffList(getAllStaffMembers());
    setVolunteerList(getAllVolunteers());
  };

  useEffect(() => {
    refreshList();

    const handleStaffUpdate = () => refreshList();
    const handleVolUpdate = () => refreshList();
    window.addEventListener('jjf-staff-updated', handleStaffUpdate);
    window.addEventListener('jjf-volunteer-updated', handleVolUpdate);
    return () => {
      window.removeEventListener('jjf-staff-updated', handleStaffUpdate);
      window.removeEventListener('jjf-volunteer-updated', handleVolUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Counts
  const counts = useMemo(() => {
    const pending = staffList.filter((s) => s.status === 'pending').length;
    const approved = staffList.filter((s) => s.status === 'approved' || s.status === 'active' || s.status === 'verified').length;
    const rejected = staffList.filter((s) => s.status === 'rejected').length;
    const cancelled = staffList.filter((s) => s.status === 'cancelled').length;
    return {
      total: staffList.length,
      pending,
      approved,
      rejected,
      cancelled
    };
  }, [staffList]);

  // Filtered List
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // Filter by Status
      if (statusFilter === 'pending' && staff.status !== 'pending') return false;
      if (statusFilter === 'approved' && staff.status !== 'approved' && staff.status !== 'active' && staff.status !== 'verified') return false;
      if (statusFilter === 'rejected' && staff.status !== 'rejected') return false;
      if (statusFilter === 'cancelled' && staff.status !== 'cancelled') return false;

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          staff.fullName.toLowerCase().includes(q) ||
          (staff.fullNameHindi && staff.fullNameHindi.toLowerCase().includes(q)) ||
          staff.id.toLowerCase().includes(q) ||
          staff.mobile.includes(q) ||
          staff.designation.toLowerCase().includes(q) ||
          staff.department.toLowerCase().includes(q) ||
          staff.fatherOrHusbandName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [staffList, statusFilter, searchQuery]);

  // Handle Approve Action
  const handleApprove = (staff: StaffMember) => {
    const adminName = adminProfile?.name || 'Admin';
    const result = approveStaffMember(staff.id, adminName);
    if (result) {
      refreshList();
      showToast(`✅ ${staff.fullName} जी का आई-कार्ड स्वीकृत कर दिया गया!`);
      // Open WhatsApp sending modal with prefilled link
      setWhatsappModalData({
        staff: result.staff,
        url: result.whatsappUrl
      });
    }
  };

  // Handle Reject Action
  const handleConfirmReject = () => {
    if (!rejectModalStaff) return;
    rejectStaffMember(rejectModalStaff.id, rejectionReason);
    showToast(`❌ ${rejectModalStaff.fullName} जी का पंजीकरण अस्वीकृत कर दिया गया।`);
    setRejectModalStaff(null);
    refreshList();
  };

  // Handle Cancel Issued I-Card Action
  const handleConfirmCancelStaff = () => {
    if (!cancelModalStaff) return;
    const adminName = adminProfile?.name || 'Admin';
    cancelStaffMember(cancelModalStaff.id, cancelReasonStaff, adminName);
    showToast(`⚠️ ${cancelModalStaff.fullName} (${cancelModalStaff.id}) का पहचान पत्र निरस्त (Cancelled) कर दिया गया।`);
    setCancelModalStaff(null);
    if (previewStaff?.id === cancelModalStaff.id) {
      setPreviewStaff({ ...previewStaff, status: 'cancelled' });
    }
    refreshList();
  };

  // Handle Delete Action
  const handleDelete = (staff: StaffMember) => {
    setDeleteModalStaff(staff);
  };

  const handleConfirmDelete = () => {
    if (!deleteModalStaff) return;
    deleteStaffMember(deleteModalStaff.id);
    showToast(`🗑️ ${deleteModalStaff.fullName} (${deleteModalStaff.id}) का स्टाफ रिकॉर्ड हमेशा के लिए हटा दिया गया।`);
    setDeleteModalStaff(null);
    if (previewStaff?.id === deleteModalStaff.id) {
      setPreviewStaff(null);
    }
    refreshList();
  };

  // =========================================================================
  // VOLUNTEER (SWAYAM SEWAK) COMPUTED METRICS & ACTIONS
  // =========================================================================
  const volunteerCounts = useMemo(() => {
    const pending = volunteerList.filter((v) => v.approvalStatus === 'pending').length;
    const approved = volunteerList.filter(
      (v) => v.approvalStatus === 'approved' || (!v.approvalStatus && (v.status === 'certified' || v.status === 'leader'))
    ).length;
    const rejected = volunteerList.filter((v) => v.approvalStatus === 'rejected').length;
    return {
      total: volunteerList.length,
      pending,
      approved,
      rejected
    };
  }, [volunteerList]);

  const filteredVolunteers = useMemo(() => {
    return volunteerList.filter((vol) => {
      const isApproved =
        vol.approvalStatus === 'approved' || (!vol.approvalStatus && (vol.status === 'certified' || vol.status === 'leader'));
      const isPending = vol.approvalStatus === 'pending';
      const isRejected = vol.approvalStatus === 'rejected';

      if (volStatusFilter === 'pending' && !isPending) return false;
      if (volStatusFilter === 'approved' && !isApproved) return false;
      if (volStatusFilter === 'rejected' && !isRejected) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          vol.name.toLowerCase().includes(q) ||
          vol.id.toLowerCase().includes(q) ||
          (vol.phone && vol.phone.includes(q)) ||
          vol.fatherName.toLowerCase().includes(q) ||
          vol.area.toLowerCase().includes(q) ||
          (vol.areaHindi && vol.areaHindi.includes(q)) ||
          (vol.district && vol.district.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [volunteerList, volStatusFilter, searchQuery]);

  const handleApproveVol = (vol: Volunteer) => {
    const adminName = adminProfile?.name || 'Admin';
    const res = approveVolunteer(vol.id, adminName);
    if (res) {
      refreshList();
      showToast(`✅ स्वयंसेवक ${vol.name} जी का पंजीकरण, आई-कार्ड व नियुक्ति पत्र स्वीकृत!`);
      const cleanPhone = (vol.phone || '').replace(/[^0-9]/g, '').slice(-10);
      setWhatsappModalData({
        staff: {
          id: vol.id,
          fullName: vol.name,
          fatherOrHusbandName: vol.fatherName,
          relationType: vol.relationType === 'Husband' ? 'Wo' : 'So',
          designation: vol.role || 'सक्रिय स्वयंसेवक (Volunteer)',
          department: vol.areaHindi || vol.area,
          dutyLocation: `${vol.district || 'गाजीपुर'}, ${vol.state || 'उ.प्र.'}`,
          mobile: cleanPhone,
          photoUrl: vol.photoUrl || '',
          bloodGroup: vol.bloodGroup || 'O+',
          dateOfJoining: vol.joinDate,
          staffBadgeLevel: 'कार्यकारी स्टाफ (Executive Staff)',
          status: 'approved',
          createdAt: vol.joinDate,
          emergencyContact: cleanPhone,
          address: `${vol.wardOrVillage || ''}, ${vol.block || ''}, ${vol.district || 'गाजीपुर'}`
        },
        url: res.whatsappUrl
      });
    }
  };

  const handleConfirmRejectVol = () => {
    if (!rejectModalVolunteer) return;
    rejectVolunteer(rejectModalVolunteer.id, volRejectionReason);
    showToast(`❌ स्वयंसेवक ${rejectModalVolunteer.name} का आवेदन अस्वीकृत किया गया।`);
    setRejectModalVolunteer(null);
    refreshList();
  };

  const handleConfirmDeleteVol = () => {
    if (!deleteModalVolunteer) return;
    deleteVolunteer(deleteModalVolunteer.id);
    showToast(`🗑️ स्वयंसेवक ${deleteModalVolunteer.name} का रिकॉर्ड स्थायी रूप से हटाया गया।`);
    setDeleteModalVolunteer(null);
    refreshList();
  };

  // Admin Direct PDF Download for Preview
  const handleAdminDownloadPdf = async () => {
    if (!previewStaff) return;
    setIsExporting(true);
    try {
      const frontEl = document.getElementById('admin-staff-card-front');
      const backEl = document.getElementById('admin-staff-card-back');
      if (frontEl && backEl) {
        await exportElementsAsMultiPagePdf(
          [frontEl, backEl],
          `JJF_Staff_Card_${previewStaff.id}_Official_2Page`,
          {
            quality: 1,
            pixelRatio: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5
          }
        );
        showToast('📄 2-Page PDF सफलतापूर्वक डाउनलोड हुआ!');
      }
    } catch (err) {
      console.error(err);
      showToast('PDF एक्सपोर्ट में त्रुटि आई।');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper for real-time Status Indicator column styling and badges
  const getStatusIndicator = (status: StaffStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          labelHindi: 'लंबित अनुमोदन',
          subtext: 'समीक्षा प्रतीक्षारत',
          badgeBg: 'bg-amber-50 border-amber-300 text-amber-900',
          dotBg: 'bg-amber-500',
          ringColor: 'ring-amber-400',
          indicatorBar: 'bg-amber-500',
          textColor: 'text-amber-800',
          rowBg: 'hover:bg-amber-50/40',
          pulse: true,
          icon: Clock
        };
      case 'approved':
      case 'active':
      case 'verified':
        return {
          label: 'Approved',
          labelHindi: 'स्वीकृत एवं सक्रिय',
          subtext: 'सक्रिय पहचान पत्र',
          badgeBg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          dotBg: 'bg-emerald-500',
          ringColor: 'ring-emerald-400',
          indicatorBar: 'bg-emerald-500',
          textColor: 'text-emerald-800',
          rowBg: 'hover:bg-emerald-50/30',
          pulse: false,
          icon: CheckCircle2
        };
      case 'rejected':
        return {
          label: 'Rejected',
          labelHindi: 'अस्वीकृत',
          subtext: 'आवेदन निरस्त',
          badgeBg: 'bg-red-50 border-red-300 text-red-900',
          dotBg: 'bg-red-500',
          ringColor: 'ring-red-400',
          indicatorBar: 'bg-red-500',
          textColor: 'text-red-800',
          rowBg: 'hover:bg-red-50/30',
          pulse: false,
          icon: XCircle
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          labelHindi: 'पहचान पत्र निरस्त',
          subtext: 'आदेश द्वारा निरस्त',
          badgeBg: 'bg-rose-50 border-rose-300 text-rose-900',
          dotBg: 'bg-rose-500',
          ringColor: 'ring-rose-400',
          indicatorBar: 'bg-rose-500',
          textColor: 'text-rose-800',
          rowBg: 'hover:bg-rose-50/30',
          pulse: false,
          icon: Ban
        };
      default:
        return {
          label: status,
          labelHindi: status,
          subtext: '',
          badgeBg: 'bg-slate-50 border-slate-300 text-slate-800',
          dotBg: 'bg-slate-400',
          ringColor: 'ring-slate-300',
          indicatorBar: 'bg-slate-400',
          textColor: 'text-slate-700',
          rowBg: 'hover:bg-slate-50',
          pulse: false,
          icon: AlertCircle
        };
    }
  };

  // Helper to format ISO or date strings into readable localized timestamp
  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 animate-bounce bg-blue-900 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-2xl border border-amber-400 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 🌟 MASTER ROLE SWITCHER: STAFF APPROVALS vs VOLUNTEER (SWAYAM SEWAK) APPROVALS */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveRoleTab('staff')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeRoleTab === 'staff'
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <IdCard className={`w-4 h-4 ${activeRoleTab === 'staff' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>1. स्टाफ अप्रूवल (Staff Approvals)</span>
            {counts.pending > 0 && (
              <span className="bg-amber-400 text-blue-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {counts.pending} लंबित
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('volunteer')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeRoleTab === 'volunteer'
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className={`w-4 h-4 ${activeRoleTab === 'volunteer' ? 'text-amber-300' : 'text-slate-500'}`} />
            <span>2. स्वयंसेवक अप्रूवल (Swayam Sewak Approvals)</span>
            {volunteerCounts.pending > 0 && (
              <span className="bg-amber-400 text-blue-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {volunteerCounts.pending} लंबित
              </span>
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-bold flex items-center gap-2">
          <span>
            कुल लंबित अनुमोदन: <strong className="text-amber-700 font-mono font-black">{counts.pending + volunteerCounts.pending}</strong>
          </span>
          <span>•</span>
          <button
            onClick={refreshList}
            className="text-blue-800 hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रिफ्रेश</span>
          </button>
        </div>
      </div>

      {activeRoleTab === 'staff' && (
        <>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-blue-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md shrink-0">
                  <Award className="w-7 h-7" />
                </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-['Cinzel',serif]">
                  स्टाफ आई-कार्ड अनुमोदन एवं जारीकरण (Staff I-Card Approvals)
                </h2>
                {counts.pending > 0 && (
                  <span className="bg-amber-400 text-blue-950 font-black text-xs px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                    {counts.pending} नई अर्जी लंबित
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 mt-1">
                स्टाफ पंजीकरण प्राप्त होते ही यहाँ सूची दिखेगी। अनुमोदन (Approve) करते ही सदस्य के रजिस्टर्ड मोबाइल (WhatsApp) पर आई-कार्ड डाउनलोड लिंक जाएगा।
              </p>
            </div>
          </div>

          <button
            onClick={refreshList}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer border border-white/15"
          >
            <RefreshCw className="w-4 h-4 text-amber-300" />
            <span>रिफ्रेश सूची</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Pending Approval Card */}
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500/15 border-amber-500 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
              लंबित अनुमोदन (Pending)
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 flex items-baseline gap-2">
            <span>{counts.pending}</span>
            {counts.pending > 0 && (
              <span className="text-[11px] text-amber-600 font-bold">कार्रवाई आवश्यक</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">स्वीकृति हेतु प्रतीक्षारत नए स्टाफ</p>
        </button>

        {/* 2. Approved & Active Card */}
        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
              स्वीकृत आई-कार्ड (Approved)
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{counts.approved}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">सक्रिय व जारी पहचान पत्र</p>
        </button>

        {/* 3. Cancelled Card */}
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'cancelled'
              ? 'bg-rose-500/15 border-rose-500 shadow-md ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">
              निरस्त आई-कार्ड (Cancelled)
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{counts.cancelled}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">रद्द किए गए पहचान पत्र</p>
        </button>

        {/* 4. Rejected Card */}
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-red-500/15 border-red-500 shadow-md ring-2 ring-red-400/30'
              : 'bg-white border-slate-200 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-700">
              अस्वीकृत (Rejected)
            </span>
            <div className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{counts.rejected}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">निरस्त की गई अर्जियां</p>
        </button>

        {/* 5. Total Staff */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-blue-500/15 border-blue-600 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-slate-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800">
              कुल पंजीकृत स्टाफ (Total)
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{counts.total}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">संस्था के कुल स्टाफ सदस्य</p>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'pending', label: '⏳ लंबित अप्रूवल', count: counts.pending, color: 'text-amber-800 bg-amber-100' },
            { id: 'approved', label: '✅ स्वीकृत स्टाफ', count: counts.approved, color: 'text-emerald-800 bg-emerald-100' },
            { id: 'cancelled', label: '🚫 निरस्त आई-कार्ड', count: counts.cancelled, color: 'text-rose-800 bg-rose-100' },
            { id: 'rejected', label: '❌ अस्वीकृत', count: counts.rejected, color: 'text-red-800 bg-red-100' },
            { id: 'all', label: '👥 सभी स्टाफ', count: counts.total, color: 'text-blue-800 bg-blue-100' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${tab.color}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & View Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, मोबाइल, पदनाम या ID खोजें..."
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 focus:bg-white outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="तालिका दृश्य (Table View with Status Indicator Column)"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">तालिका</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="कार्ड दृश्य (Cards View)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">कार्ड</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Applications List / Table */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            {statusFilter === 'pending'
              ? 'कोई लंबित स्टाफ आवेदन नहीं है!'
              : 'इस फ़िल्टर में कोई स्टाफ रिकॉर्ड नहीं मिला।'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {statusFilter === 'pending'
              ? 'जब भी कोई नया स्टाफ सदस्य वेबसाइट से पंजीकरण फॉर्म भरेगा, उसका नाम और विवरण सीधे यहाँ समीक्षा व स्वीकृति हेतु दिखाई देगा।'
              : 'कृपया अपनी खोज अथवा फ़िल्टर स्थिति बदलें।'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* ========================================================================= */
        /* REAL-TIME STATUS INDICATOR TABLE VIEW                                    */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Table Header Description & Status Legend */}
          <div className="p-4 sm:px-6 sm:py-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Table className="w-4 h-4 text-blue-800" />
              <span>
                स्टाफ पंजीकरण तालिका (Staff Registration Registry) • <strong>{filteredStaff.length}</strong> रिकॉर्ड्स
              </span>
            </div>

            {/* Real-time Status Indicator Legend */}
            <div className="flex items-center gap-3 flex-wrap text-[11px]">
              <span className="text-slate-400 font-bold">लाइव स्टेटस संकेतक:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300 animate-pulse"></span>
                <span className="text-amber-800 font-bold">Pending (लंबित)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span>
                <span className="text-emerald-800 font-bold">Approved (स्वीकृत)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-300"></span>
                <span className="text-red-800 font-bold">Rejected (अस्वीकृत)</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">स्टाफ सदस्य (Staff Member)</th>
                  <th className="px-4 py-3.5">स्टाफ आईडी (ID)</th>
                  <th className="px-4 py-3.5">पदनाम एवं प्रकोष्ठ (Designation)</th>
                  <th className="px-4 py-3.5">मोबाइल एवं रक्त समूह</th>
                  <th className="px-4 py-3.5">आवेदन तिथि</th>
                  {/* REAL-TIME STATUS INDICATOR COLUMN */}
                  <th className="px-4 py-3.5 min-w-[175px]">
                    <div className="flex items-center gap-1.5">
                      <span>स्टेटस इंडिकेटर (Status Indicator)</span>
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    </div>
                  </th>
                  {/* ACTIVITY LOG COLUMN */}
                  <th className="px-4 py-3.5 min-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-blue-700" />
                      <span>गतिविधि लॉग (Activity Log)</span>
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-right">कार्यवाही (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStaff.map((staff) => {
                  const isPending = staff.status === 'pending';
                  const isApproved = staff.status === 'approved' || staff.status === 'active' || staff.status === 'verified';
                  const isRejected = staff.status === 'rejected';
                  const isCancelled = staff.status === 'cancelled';
                  const statusInfo = getStatusIndicator(staff.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={staff.id}
                      className={`transition-colors relative group ${statusInfo.rowBg} ${
                        isPending ? 'bg-amber-50/20' : isRejected ? 'bg-red-50/15' : isCancelled ? 'bg-rose-50/15' : 'hover:bg-blue-50/30'
                      }`}
                    >
                      {/* Staff Member & Photo */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Live Status Accent Line on the left */}
                          <div className={`w-1 h-10 rounded-full shrink-0 ${statusInfo.indicatorBar}`} />

                          <img
                            src={staff.photoUrl}
                            alt={staff.fullName}
                            className="w-10 h-12 object-cover rounded-lg border-2 border-amber-400 shadow-xs shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 text-xs">
                              {staff.fullName}
                            </div>
                            {staff.fullNameHindi && staff.fullNameHindi !== staff.fullName && (
                              <div className="text-[11px] text-slate-500">
                                {staff.fullNameHindi}
                              </div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {formatRelationLabel(staff.relationType, staff.fatherOrHusbandName, 'hi')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Staff ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-[11px]">
                          {staff.id}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {staff.dutyLocation || 'गाजीपुर शाखा'}
                        </span>
                      </td>

                      {/* Designation & Department */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#8B0000] text-xs">
                          {staff.designation}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {staff.department}
                        </div>
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                          {staff.staffBadgeLevel}
                        </div>
                      </td>

                      {/* Mobile & Blood Group */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-xs">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>+91 {staff.mobile}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Droplet className="w-3 h-3 text-red-500" />
                          <span>रक्त समूह: <strong className="text-red-700">{staff.bloodGroup}</strong></span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="px-4 py-3.5">
                        <div className="text-slate-800 text-xs font-semibold">
                          {staff.dateOfJoining || staff.createdAt?.slice(0, 10)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>पंजीकृत</span>
                        </div>
                      </td>

                      {/* ======================================================= */}
                      {/* REAL-TIME STATUS INDICATOR COLUMN                      */}
                      {/* Changes color dynamically based on Pending/Approved/Rejected */}
                      {/* Includes hover tooltip indicating audit timestamp & details */}
                      {/* ======================================================= */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1.5">
                          {/* Live Dynamic Colored Badge with Audit Hover Tooltip */}
                          <div className="relative inline-block group/status">
                            <div
                              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-black shadow-2xs transition-all cursor-help ${statusInfo.badgeBg} hover:shadow-xs`}
                              title={`अंतिम स्थिति परिवर्तन: ${
                                formatTimestamp(
                                  staff.statusUpdatedAt ||
                                  staff.approvedAt ||
                                  staff.rejectedAt ||
                                  staff.createdAt
                                ) || 'लंबित'
                              }`}
                            >
                              {/* Real-time Status Pulse Beacon */}
                              <span className="relative flex h-2.5 w-2.5">
                                {statusInfo.pulse && (
                                  <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.dotBg}`}
                                  />
                                )}
                                <span
                                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ring-2 ${statusInfo.ringColor} ${statusInfo.dotBg}`}
                                />
                              </span>

                              <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                              <span className="whitespace-nowrap">{statusInfo.label}</span>
                            </div>

                            {/* Rich Audit Hover Tooltip Box */}
                            <div className="invisible opacity-0 group-hover/status:visible group-hover/status:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full left-0 mb-2 z-50 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-[11px]">
                              <div className="flex items-center gap-1.5 font-bold text-amber-300 pb-1 border-b border-slate-800">
                                <Clock className="w-3.5 h-3.5" />
                                <span>ऑडिट रिकॉर्ड (Audit Record)</span>
                              </div>
                              <div className="mt-1.5 space-y-1 text-slate-300">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">वर्तमान स्थिति:</span>
                                  <span className="font-bold text-white">{statusInfo.label}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 pt-0.5">
                                  <span className="text-slate-400">अंतिम स्थिति परिवर्तन (Last Changed):</span>
                                  <span className="font-semibold text-emerald-400 font-mono">
                                    {formatTimestamp(
                                      staff.statusUpdatedAt ||
                                      staff.approvedAt ||
                                      staff.rejectedAt ||
                                      staff.createdAt
                                    ) || 'लंबित (पंजीकरण के समय से)'}
                                  </span>
                                </div>
                                {isApproved && staff.approvedBy && (
                                  <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-800/80">
                                    स्वीकृत कर्ता: <strong className="text-white">{staff.approvedBy}</strong>
                                  </div>
                                )}
                                {isRejected && staff.rejectionReason && (
                                  <div className="text-[10px] text-red-300 pt-1 border-t border-slate-800/80 truncate">
                                    कारण: {staff.rejectionReason}
                                  </div>
                                )}
                              </div>
                              {/* Tooltip caret triangle pointing down */}
                              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>

                          {/* Descriptive Subtext */}
                          <div className={`text-[10.5px] font-bold flex items-center gap-1 ${statusInfo.textColor}`}>
                            <span>• {statusInfo.labelHindi}</span>
                          </div>

                          {/* Rejection reason snippet if rejected */}
                          {isRejected && staff.rejectionReason && (
                            <div className="text-[10px] text-red-700 bg-red-100/70 border border-red-200 px-2 py-0.5 rounded-md max-w-[200px] truncate" title={staff.rejectionReason}>
                              कारण: {staff.rejectionReason}
                            </div>
                          )}

                          {/* Approval info if approved */}
                          {isApproved && staff.approvedBy && (
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>एडमिन {staff.approvedBy} द्वारा स्वीकृत</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* ======================================================= */}
                      {/* ACTIVITY LOG COLUMN                                     */}
                      {/* Shows status last updated timestamp & WhatsApp delivery */}
                      {/* ======================================================= */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1.5 min-w-[190px]">
                          {/* Status Last Updated Timestamp */}
                          <div className="flex items-start gap-1.5 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                स्थिति अपडेट (Last Updated)
                              </div>
                              <div className="font-semibold text-slate-800">
                                {formatTimestamp(
                                  staff.statusUpdatedAt ||
                                  staff.approvedAt ||
                                  staff.rejectedAt ||
                                  staff.createdAt
                                ) || 'लंबित (समीक्षा जारी)'}
                              </div>
                            </div>
                          </div>

                          {/* WhatsApp Notification Link Delivery Status */}
                          <div className="pt-0.5">
                            {staff.whatsappNotified ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                <span>WhatsApp लिंक प्रेषित (Sent)</span>
                                {staff.whatsappNotifiedAt && (
                                  <span className="text-[9.5px] text-emerald-700 font-normal">
                                    • {formatTimestamp(staff.whatsappNotifiedAt)?.slice(0, 12)}
                                  </span>
                                )}
                              </div>
                            ) : isApproved ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <MessageSquare className="w-3 h-3 text-amber-600" />
                                <span>WhatsApp लिंक लंबित (Pending)</span>
                              </div>
                            ) : isPending ? (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-slate-300" />
                                <span>स्वीकृति पश्चात लिंक प्रेषित होगा</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-slate-300" />
                                <span>अस्वीकृत (लिंक आवश्यक नहीं)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions Column: Approve / Cancel / Reactivate / Reject / Delete */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* 1. Approve Button (for pending registrations) */}
                          {isPending && (
                            <button
                              onClick={() => handleApprove(staff)}
                              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-[11px] font-black shadow-xs transition flex items-center gap-1 cursor-pointer border border-emerald-400"
                              title="स्वीकृत करें (Approve) और WhatsApp लिंक भेजें"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                              <span>स्वीकृत करें</span>
                            </button>
                          )}

                          {/* 2. WhatsApp Button (for issued/approved cards) */}
                          {isApproved && (
                            <button
                              onClick={() => {
                                const whatsappUrl = generateStaffApprovalWhatsAppUrl(staff);
                                setWhatsappModalData({ staff, url: whatsappUrl });
                              }}
                              className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="स्टाफ के WhatsApp पर आई-कार्ड लिंक भेजें"
                            >
                              <Send className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* 3. Cancel Issued I-Card Button (for approved / issued cards) */}
                          {isApproved && (
                            <button
                              onClick={() => {
                                setCancelModalStaff(staff);
                                setCancelReasonStaff('प्रशासनिक समीक्षा अथवा सेवा समाप्ति उपरांत पहचान पत्र निरस्त');
                              }}
                              className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="जारी आई-कार्ड निरस्त / रद्द करें (Cancel Issued I-Card)"
                            >
                              <Ban className="w-3.5 h-3.5 text-amber-700" />
                              <span>निरस्त करें</span>
                            </button>
                          )}

                          {/* 4. Reactivate Button (if cancelled or rejected) */}
                          {(isCancelled || isRejected) && (
                            <button
                              onClick={() => handleApprove(staff)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="आई-कार्ड पुनः बहाल व स्वीकृत करें"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                              <span>पुनः बहाल</span>
                            </button>
                          )}

                          {/* 5. Reject Button (for pending only) */}
                          {isPending && (
                            <button
                              onClick={() => {
                                setRejectModalStaff(staff);
                                setRejectionReason('विवरण अथवा दस्तावेज अपूर्ण होने के कारण');
                              }}
                              className="px-2 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="अस्वीकृत करें (Reject)"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>अस्वीकृत</span>
                            </button>
                          )}

                          {/* 6. Preview I-Card (Always Available) */}
                          <button
                            onClick={() => {
                              setPreviewStaff(staff);
                              setPreviewSide('front');
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="आई-कार्ड प्रिव्यू देखें"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-800" />
                          </button>

                          {/* 6b. Official Appointment Letter Button */}
                          <button
                            onClick={() => setAdminAppointmentStaff(staff)}
                            className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="संस्था के अधिकृत लेटरहेड पर स्टाफ नियुक्ति पत्र देखें व प्रिंट करें"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-700" />
                            <span>नियुक्ति पत्र</span>
                          </button>

                          {/* 7. Delete Button (Permanent deletion from database) */}
                          <button
                            onClick={() => handleDelete(staff)}
                            className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                            title="स्टाफ रिकॉर्ड हमेशा के लिए हटाएं (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>डिलीट</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CARDS VIEW WITH STATUS INDICATOR                                         */
        /* ========================================================================= */
        <div className="space-y-3.5">
          {filteredStaff.map((staff) => {
            const isPending = staff.status === 'pending';
            const isApproved = staff.status === 'approved' || staff.status === 'active' || staff.status === 'verified';
            const isRejected = staff.status === 'rejected';
            const isCancelled = staff.status === 'cancelled';
            const statusInfo = getStatusIndicator(staff.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={staff.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${
                  isPending
                    ? 'border-amber-300 ring-1 ring-amber-200 bg-gradient-to-r from-amber-50/20 via-white to-white'
                    : isRejected
                    ? 'border-red-200 bg-red-50/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Staff Photo with Digital Cross Stamp + Core Profile */}
                  <div className="flex items-start gap-3.5">
                    <StampedCandidatePhoto
                      photoUrl={staff.photoUrl}
                      name={staff.fullName}
                      className="w-16 sm:w-18 shrink-0"
                      containerClassName="aspect-3/4"
                      showStamp={true}
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900">
                          {staff.fullName}
                        </h3>
                        {staff.fullNameHindi && staff.fullNameHindi !== staff.fullName && (
                          <span className="text-xs text-slate-500 font-medium">
                            ({staff.fullNameHindi})
                          </span>
                        )}

                        {/* Status Indicator Badge in Card View with Audit Tooltip */}
                        <div className="relative inline-block group/cardstatus">
                          <span
                            className={`border text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs cursor-help ${statusInfo.badgeBg}`}
                            title={`अंतिम स्थिति परिवर्तन: ${
                              formatTimestamp(
                                staff.statusUpdatedAt ||
                                staff.approvedAt ||
                                staff.rejectedAt ||
                                staff.createdAt
                              ) || 'लंबित'
                            }`}
                          >
                            <span className="relative flex h-2 w-2">
                              {statusInfo.pulse && (
                                <span
                                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusInfo.dotBg}`}
                                />
                              )}
                              <span
                                className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.dotBg}`}
                              />
                            </span>
                            <StatusIcon className="w-3 h-3" />
                            <span>{statusInfo.label} ({statusInfo.labelHindi})</span>
                          </span>

                          {/* Hover Tooltip for Card View */}
                          <div className="invisible opacity-0 group-hover/cardstatus:visible group-hover/cardstatus:opacity-100 transition-all duration-200 pointer-events-none absolute bottom-full left-0 mb-1.5 z-50 w-60 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-[10.5px]">
                            <div className="flex items-center gap-1 font-bold text-amber-300 pb-1 border-b border-slate-800">
                              <Clock className="w-3 h-3" />
                              <span>ऑडिट विवरण (Audit Info)</span>
                            </div>
                            <div className="mt-1 space-y-0.5 text-slate-300">
                              <div className="text-slate-400">अंतिम स्थिति परिवर्तन:</div>
                              <div className="font-semibold text-emerald-400 font-mono">
                                {formatTimestamp(
                                  staff.statusUpdatedAt ||
                                  staff.approvedAt ||
                                  staff.rejectedAt ||
                                  staff.createdAt
                                ) || 'लंबित'}
                              </div>
                            </div>
                            <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      </div>

                      {/* Designation & Department */}
                      <div className="text-xs font-bold text-[#8B0000] flex items-center gap-1.5 flex-wrap">
                        <span>{staff.designation}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">{staff.department}</span>
                      </div>

                      {/* Father / Husband / Guardian & ID */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                        <span>
                          <strong className="text-slate-700">
                            {formatRelationLabel(staff.relationType, staff.fatherOrHusbandName, 'hi')}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          स्टाफ ID:{' '}
                          <strong className="text-slate-900 font-mono font-black">{staff.id}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          रक्त समूह:{' '}
                          <strong className="text-red-600 font-bold">{staff.bloodGroup}</strong>
                        </span>
                      </div>

                      {/* Mobile & Date */}
                      <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap pt-0.5">
                        <span className="flex items-center gap-1 font-mono font-bold text-slate-800">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          +91 {staff.mobile}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {staff.dutyLocation || 'गाजीपुर शाखा'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          पंजीकरण: {staff.dateOfJoining || staff.createdAt?.slice(0, 10)}
                        </span>
                      </div>

                      {/* Activity Log Snippet in Card View */}
                      <div className="flex items-center gap-3 flex-wrap pt-1 text-[10.5px]">
                        <div className="flex items-center gap-1 text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                          <History className="w-3 h-3 text-blue-600" />
                          <span>
                            अपडेट:{' '}
                            <strong className="text-slate-700">
                              {formatTimestamp(
                                staff.statusUpdatedAt ||
                                staff.approvedAt ||
                                staff.rejectedAt ||
                                staff.createdAt
                              ) || 'लंबित'}
                            </strong>
                          </span>
                        </div>

                        {staff.whatsappNotified ? (
                          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp लिंक प्रेषित</span>
                            {staff.whatsappNotifiedAt && (
                              <span className="text-[9px] font-normal text-emerald-600">
                                ({formatTimestamp(staff.whatsappNotifiedAt)?.slice(0, 12)})
                              </span>
                            )}
                          </div>
                        ) : isApproved ? (
                          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <MessageSquare className="w-3 h-3 text-amber-600" />
                            <span>WhatsApp लिंक लंबित</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Rejection Note if available */}
                      {isRejected && staff.rejectionReason && (
                        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800">
                          <strong>अस्वीकृति कारण:</strong> {staff.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons (Approve / Cancel / Reactivate / Preview / Delete) */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* IF PENDING: Show Approve and Reject buttons */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(staff)}
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                          <span>स्वीकृत करें व WhatsApp भेजें</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectModalStaff(staff);
                            setRejectionReason('विवरण अथवा दस्तावेज अपूर्ण होने के कारण');
                          }}
                          className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>अस्वीकृत</span>
                        </button>
                      </>
                    )}

                    {/* IF APPROVED (ISSUED): Show WhatsApp Link & Cancel Button */}
                    {isApproved && (
                      <>
                        <button
                          onClick={() => {
                            const whatsappUrl = generateStaffApprovalWhatsAppUrl(staff);
                            setWhatsappModalData({ staff, url: whatsappUrl });
                          }}
                          className="flex-1 lg:flex-none px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                          title="स्टाफ के WhatsApp पर आई-कार्ड डाउनलोड लिंक भेजें"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp पर भेजें</span>
                        </button>

                        <button
                          onClick={() => {
                            setCancelModalStaff(staff);
                            setCancelReasonStaff('प्रशासनिक समीक्षा अथवा सेवा समाप्ति उपरांत पहचान पत्र निरस्त');
                          }}
                          className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                          title="जारी आई-कार्ड निरस्त / रद्द करें (Cancel Issued I-Card)"
                        >
                          <Ban className="w-3.5 h-3.5 text-amber-700" />
                          <span>आई-कार्ड निरस्त करें</span>
                        </button>
                      </>
                    )}

                    {/* IF CANCELLED OR REJECTED: Show Reactivate Option */}
                    {(isCancelled || isRejected) && (
                      <button
                        onClick={() => handleApprove(staff)}
                        className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="आई-कार्ड पुनः बहाल व स्वीकृत करें"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>पुनः बहाल / स्वीकृत करें</span>
                      </button>
                    )}

                    {/* Preview I-Card Button (Always Available) */}
                    <button
                      onClick={() => {
                        setPreviewStaff(staff);
                        setPreviewSide('front');
                      }}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="आई-कार्ड का लाइव प्रिव्यू देखें"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-800" />
                      <span>कार्ड देखें</span>
                    </button>

                    {/* Official Appointment Letter Button in Staff Card */}
                    <button
                      onClick={() => setAdminAppointmentStaff(staff)}
                      className="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="संस्था के अधिकृत लेटरहेड पर स्टाफ नियुक्ति पत्र देखें व प्रिंट करें"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      <span>नियुक्ति पत्र</span>
                    </button>

                    {/* Delete button (Permanent Deletion) */}
                    <button
                      onClick={() => handleDelete(staff)}
                      className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="स्टाफ रिकॉर्ड हमेशा के लिए हटाएं (Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>डिलीट</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  )}

  {/* ========================================================================= */}
  {/* 🤝 VOLUNTEER (SWAYAM SEWAK) APPROVAL VIEW                                  */}
  {/* ========================================================================= */}
  {activeRoleTab === 'volunteer' && (
    <>
      {/* Volunteer Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white font-['Cinzel',serif]">
                  स्वयंसेवक (Swayam Sewak) अनुमोदन एवं जारीकरण (Volunteer Approvals)
                </h2>
                {volunteerCounts.pending > 0 && (
                  <span className="bg-amber-400 text-blue-950 font-black text-xs px-2.5 py-0.5 rounded-full animate-pulse shadow-xs">
                    {volunteerCounts.pending} नए स्वयंसेवक लंबित
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                स्वयंसेवक पंजीकरण प्राप्त होते ही यहाँ सूची दिखेगी। अनुमोदन (Approve) करते ही डिजिटल पहचान पत्र (I-Card), अधिकृत लेटरहेड नियुक्ति पत्र (Appointment Letter) और सेवा सम्मान प्रमाण पत्र (Certificate) सक्रिय हो जाएंगे तथा WhatsApp पर लिंक जाएगा।
              </p>
            </div>
          </div>

          <button
            onClick={refreshList}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer border border-white/15"
          >
            <RefreshCw className="w-4 h-4 text-amber-300" />
            <span>रिफ्रेश सूची</span>
          </button>
        </div>
      </div>

      {/* Volunteer KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* 1. Pending */}
        <button
          onClick={() => setVolStatusFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            volStatusFilter === 'pending'
              ? 'bg-amber-500/15 border-amber-500 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
              लंबित अनुमोदन (Pending)
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 flex items-baseline gap-2">
            <span>{volunteerCounts.pending}</span>
            {volunteerCounts.pending > 0 && (
              <span className="text-[11px] text-amber-600 font-bold">कार्रवाई आवश्यक</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">स्वीकृति हेतु प्रतीक्षारत नए स्वयंसेवक</p>
        </button>

        {/* 2. Approved */}
        <button
          onClick={() => setVolStatusFilter('approved')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            volStatusFilter === 'approved'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
              स्वीकृत स्वयंसेवक (Approved)
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{volunteerCounts.approved}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">सक्रिय व अधिकृत स्वयंसेवक</p>
        </button>

        {/* 3. Rejected */}
        <button
          onClick={() => setVolStatusFilter('rejected')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            volStatusFilter === 'rejected'
              ? 'bg-red-500/15 border-red-500 shadow-md ring-2 ring-red-400/30'
              : 'bg-white border-slate-200 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-red-700">
              अस्वीकृत (Rejected)
            </span>
            <div className="w-7 h-7 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{volunteerCounts.rejected}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">निरस्त किए गए आवेदन</p>
        </button>

        {/* 4. Total */}
        <button
          onClick={() => setVolStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            volStatusFilter === 'all'
              ? 'bg-blue-500/15 border-blue-600 shadow-md ring-2 ring-blue-400/30'
              : 'bg-white border-slate-200 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800">
              कुल पंजीकृत स्वयंसेवक (Total)
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            <span>{volunteerCounts.total}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">संस्था के पंजीकृत समाज सेवी</p>
        </button>
      </div>

      {/* Volunteer Filter Chips & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'pending', label: '⏳ लंबित अप्रूवल', count: volunteerCounts.pending, color: 'text-amber-800 bg-amber-100' },
            { id: 'approved', label: '✅ स्वीकृत स्वयंसेवक', count: volunteerCounts.approved, color: 'text-emerald-800 bg-emerald-100' },
            { id: 'rejected', label: '❌ अस्वीकृत', count: volunteerCounts.rejected, color: 'text-red-800 bg-red-100' },
            { id: 'all', label: '👥 सभी स्वयंसेवक', count: volunteerCounts.total, color: 'text-blue-800 bg-blue-100' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setVolStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                volStatusFilter === tab.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${tab.color}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input & View Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, मोबाइल, कार्यक्षेत्र या ID..."
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 focus:bg-white outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="टेबल व्यू"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">टेबल</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'cards' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="कार्ड्स व्यू"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">कार्ड्स</span>
            </button>
          </div>
        </div>
      </div>

      {/* Volunteer List: Empty State */}
      {filteredVolunteers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-black text-slate-900 text-base">कोई स्वयंसेवक रिकॉर्ड नहीं मिला</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `खोज "${searchQuery}" के लिए कोई परिणाम नहीं मिला।`
              : volStatusFilter === 'pending'
              ? 'वर्तमान में कोई नया स्वयंसेवक आवेदन अनुमोदन हेतु लंबित नहीं है।'
              : 'चयनित फ़िल्टर के अंतर्गत कोई स्वयंसेवक दर्ज नहीं है।'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Volunteer Table View */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="px-4 py-3.5">स्वयंसेवक विवरण (Volunteer)</th>
                  <th className="px-4 py-3.5">आईडी / कार्यक्षेत्र (ID & Area)</th>
                  <th className="px-4 py-3.5">संपर्क व रक्त समूह (Phone)</th>
                  <th className="px-4 py-3.5">पता व तिथि (Date & Location)</th>
                  <th className="px-4 py-3.5">अनुमोदन स्थिति (Status)</th>
                  <th className="px-4 py-3.5 text-right">दस्तावेज़ एवं कार्रवाई (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVolunteers.map((vol) => {
                  const isApproved =
                    vol.approvalStatus === 'approved' || (!vol.approvalStatus && (vol.status === 'certified' || vol.status === 'leader'));
                  const isPending = vol.approvalStatus === 'pending';
                  const isRejected = vol.approvalStatus === 'rejected';

                  return (
                    <tr key={vol.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Photo + Name + Father */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={vol.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'}
                            alt={vol.name}
                            className="w-10 h-10 rounded-xl object-cover border border-amber-300 shadow-2xs shrink-0"
                            crossOrigin="anonymous"
                          />
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 text-xs truncate">{vol.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              पिता/पति: {vol.fatherName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID & Area */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-[11px]">
                          {vol.id}
                        </span>
                        <div className="text-[11px] font-bold text-amber-800 mt-1">
                          {vol.areaHindi || vol.area}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {vol.role}
                        </div>
                      </td>

                      {/* Phone & Blood Group */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-xs">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{vol.phone || '+91 8052361666'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Droplet className="w-3 h-3 text-red-500" />
                          <span>रक्त समूह: <strong className="text-red-700">{vol.bloodGroup || 'O+'}</strong></span>
                        </div>
                      </td>

                      {/* Date & Location */}
                      <td className="px-4 py-3.5">
                        <div className="text-slate-800 text-xs font-semibold">
                          {vol.joinDate || '2026-01-15'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{vol.district || 'गाजीपुर'}, {vol.state || 'उ.प्र.'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black bg-amber-50 border-amber-300 text-amber-900 shadow-2xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>लंबित अनुमोदन</span>
                          </div>
                        ) : isApproved ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>स्वीकृत एवं सक्रिय</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black bg-red-50 border-red-300 text-red-900 shadow-2xs">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>अस्वीकृत</span>
                          </div>
                        )}
                        {isRejected && vol.rejectionReason && (
                          <div className="text-[10px] text-red-700 bg-red-100/70 border border-red-200 px-2 py-0.5 rounded-md mt-1 truncate max-w-[180px]">
                            {vol.rejectionReason}
                          </div>
                        )}
                      </td>

                      {/* Document & Approval Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* 1. Swayam Sewak ID Card */}
                          <button
                            type="button"
                            onClick={() => setPreviewVolunteerCard(vol)}
                            className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="स्वयंसेवक डिजिटल पहचान पत्र (I-Card) देखें व डाउनलोड करें"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-700" />
                            <span>🪪 आई-कार्ड</span>
                          </button>

                          {/* 2. Official Appointment Letter */}
                          <button
                            type="button"
                            onClick={() => setAdminAppointmentVolunteer(vol)}
                            className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="संस्था लेटरहेड पर A4 नियुक्ति पत्र देखें व प्रिंट करें"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-700" />
                            <span>📜 नियुक्ति पत्र</span>
                          </button>

                          {/* 3. Official Certificate */}
                          <button
                            type="button"
                            onClick={() => setPreviewVolunteerCert(vol)}
                            className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="मानद सेवा सम्मान प्रमाण पत्र देखें व डाउनलोड करें"
                          >
                            <Award className="w-3.5 h-3.5 text-emerald-700" />
                            <span>🎖️ प्रमाण पत्र</span>
                          </button>

                          {/* 4. Approve Action */}
                          {(isPending || isRejected) && (
                            <button
                              type="button"
                              onClick={() => handleApproveVol(vol)}
                              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-[11px] font-black shadow-xs transition flex items-center gap-1 cursor-pointer border border-emerald-400"
                              title="स्वीकृत करें (Approve) और तीनों दस्तावेज़ जारी करें"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                              <span>स्वीकृत करें</span>
                            </button>
                          )}

                          {/* 5. Reject Action (if pending) */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => {
                                setRejectModalVolunteer(vol);
                                setVolRejectionReason('दस्तावेज अथवा विवरण अपूर्ण होने के कारण');
                              }}
                              className="px-2 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                              title="अस्वीकृत करें (Reject)"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>अस्वीकृत</span>
                            </button>
                          )}

                          {/* 6. Delete Action */}
                          <button
                            type="button"
                            onClick={() => setDeleteModalVolunteer(vol)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                            title="रिकॉर्ड हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Volunteer Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVolunteers.map((vol) => {
            const isApproved =
              vol.approvalStatus === 'approved' || (!vol.approvalStatus && (vol.status === 'certified' || vol.status === 'leader'));
            const isPending = vol.approvalStatus === 'pending';
            const isRejected = vol.approvalStatus === 'rejected';

            return (
              <div
                key={vol.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StampedCandidatePhoto
                      photoUrl={vol.photoUrl}
                      name={vol.name}
                      className="w-14 sm:w-16 shrink-0"
                      containerClassName="aspect-3/4"
                      showStamp={true}
                    />
                    <div className="min-w-0">
                      <div className="font-black text-slate-900 text-sm truncate">{vol.name}</div>
                      <div className="text-xs text-slate-500 truncate">पिता/पति: {vol.fatherName}</div>
                      <span className="inline-block mt-1 font-mono font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-[10.5px]">
                        {vol.id}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        ⏳ लंबित
                      </span>
                    ) : isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                        ✓ स्वीकृत
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-900 border border-red-300">
                        ✕ अस्वीकृत
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">सेवा प्रकल्प (Area):</span>
                    <span className="font-bold text-slate-800 truncate block">{vol.areaHindi || vol.area}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">रक्त समूह (Blood):</span>
                    <span className="font-bold text-red-700">{vol.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">मोबाइल (Phone):</span>
                    <span className="font-mono font-bold text-slate-800">{vol.phone || '+91 8052361666'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">जिला / क्षेत्र:</span>
                    <span className="font-semibold text-slate-700">{vol.district || 'गाजीपुर'}</span>
                  </div>
                </div>

                {/* 3 Document Links + Approval Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setPreviewVolunteerCard(vol)}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>🪪 आई-कार्ड</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminAppointmentVolunteer(vol)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      <span>📜 नियुक्ति पत्र</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewVolunteerCert(vol)}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>🎖️ प्रमाण पत्र</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(isPending || isRejected) && (
                      <button
                        type="button"
                        onClick={() => handleApproveVol(vol)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>स्वीकृत करें</span>
                      </button>
                    )}

                    {isPending && (
                      <button
                        type="button"
                        onClick={() => {
                          setRejectModalVolunteer(vol);
                          setVolRejectionReason('दस्तावेज अथवा विवरण अपूर्ण होने के कारण');
                        }}
                        className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        अस्वीकृत
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteModalVolunteer(vol)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  )}

      {/* WHATSAPP SENDING DIALOG MODAL */}
      {whatsappModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-400 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    स्टाफ आई-कार्ड WhatsApp लिंक प्रेषण
                  </h3>
                  <p className="text-xs text-emerald-100">
                    रजिस्टर्ड मोबाइल नंबर पर तत्काल सूचना
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalData(null)}
                className="p-1 rounded-lg text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-emerald-900">
                  सदस्य: {whatsappModalData.staff.fullName} ({whatsappModalData.staff.designation})
                </div>
                <div className="text-emerald-700 font-mono">
                  रजिस्टर्ड मोबाइल: +91 {whatsappModalData.staff.mobile}
                </div>
                <div className="text-emerald-700 font-mono">
                  स्टाफ आईडी: {whatsappModalData.staff.id}
                </div>
              </div>

              {/* Direct Download Link Box */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  आधिकारिक आई-कार्ड डाउनलोड लिंक:
                </label>
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-mono break-all text-blue-900">
                  {getStaffDownloadUrl(whatsappModalData.staff.id)}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  नीचे दिए गए बटन पर क्लिक करते ही WhatsApp (वेब अथवा मोबाइल ऐप) स्वतः खुलेगा और स्टाफ सदस्य को बधाई संदेश व डाउनलोड लिंक भेजा जा सकेगा।
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setWhatsappModalData(null)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
                >
                  बाद में भेजें (Close)
                </button>
                <button
                  onClick={() => {
                    markStaffWhatsAppNotified(whatsappModalData.staff.id);
                    window.open(whatsappModalData.url, '_blank');
                    setWhatsappModalData(null);
                    showToast('WhatsApp प्रेषण विंडो खोली गई!');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>WhatsApp पर भेजें (Send Now)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON DIALOG MODAL */}
      {rejectModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-red-400 p-5 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-700">
              <XCircle className="w-6 h-6" />
              <h3 className="text-base font-black">स्टाफ पंजीकरण अस्वीकृत करें</h3>
            </div>

            <p className="text-xs text-slate-600">
              क्या आप सुनिश्चित हैं कि आप <strong>{rejectModalStaff.fullName}</strong> ({rejectModalStaff.id}) का स्टाफ पंजीकरण अस्वीकृत करना चाहते हैं?
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                अस्वीकृति का कारण (Reason):
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="उदा. फोटो अस्पष्ट है अथवा आधार विवरण मेल नहीं खाता..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setRejectModalStaff(null)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                अस्वीकृत करें (Confirm)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deleteModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-red-500 p-5 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-black">स्टाफ रिकॉर्ड डिलीट करें</h3>
                <span className="text-[11px] text-red-600 font-bold block">स्थायी निष्कासन (Permanent Delete)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              क्या आप सचमुच <strong>{deleteModalStaff.fullName}</strong> (स्टाफ आईडी: <span className="font-mono text-red-700 font-bold">{deleteModalStaff.id}</span>, मोबाइल: <span className="font-mono font-bold">+91 {deleteModalStaff.mobile}</span>) का स्टाफ पंजीकरण फॉर्म डिलीट करना चाहते हैं?
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>महत्वपूर्ण सूचना:</span>
              </div>
              <p className="text-[11px] leading-tight text-red-800">
                डिलीट करने पर इस सदस्य का रिकॉर्ड डेटाबेस से स्थायी रूप से हट जाएगा और इनके मोबाइल नंबर से आई-कार्ड नहीं खुलेगा।
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setDeleteModalStaff(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                रद्द करें (Cancel)
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>हाँ, डिलीट करें (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL ISSUED I-CARD CONFIRMATION DIALOG MODAL */}
      {cancelModalStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-400 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Ban className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    जारी आई-कार्ड निरस्त / रद्द करें
                  </h3>
                  <span className="text-[11px] text-amber-800 font-bold block mt-0.5">
                    Cancel & Revoke Issued Staff I-Card
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCancelModalStaff(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Staff Summary */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-amber-200/60 pb-1.5">
                <span className="font-bold text-slate-600">स्टाफ सदस्य का नाम:</span>
                <span className="font-black text-slate-900">{cancelModalStaff.fullName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-amber-200/60 pb-1.5">
                <span className="font-bold text-slate-600">स्टाफ आईडी (Staff ID):</span>
                <span className="font-mono font-black text-amber-900">{cancelModalStaff.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-amber-200/60 pb-1.5">
                <span className="font-bold text-slate-600">पद (Designation):</span>
                <span className="font-bold text-[#8B0000]">{cancelModalStaff.designation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-600">पंजीकृत मोबाइल:</span>
                <span className="font-mono font-bold text-slate-800">+91 {cancelModalStaff.mobile}</span>
              </div>
            </div>

            {/* Quick Reason selector & custom input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">
                निरस्तीकरण का कारण चुनें अथवा लिखें (Cancellation Reason):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'सेवा / संबद्धता समाप्ति उपरांत निरस्त',
                  'अनुशासनात्मक प्रशासनिक आदेश',
                  'गलत प्रविष्टि अथवा डुप्लीकेट कार्ड',
                  'प्रशासनिक समीक्षा के उपरांत निरस्त'
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelReasonStaff(reason)}
                    className={`p-2 rounded-xl border text-left font-medium transition cursor-pointer text-[11px] ${
                      cancelReasonStaff === reason
                        ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={cancelReasonStaff}
                onChange={(e) => setCancelReasonStaff(e.target.value)}
                placeholder="विस्तृत कारण लिखें..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Warning Note */}
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>प्रभाव:</strong> इस आई-कार्ड की स्थिति 'निरस्त (Cancelled)' हो जाएगी। ऑनलाइन सत्यापन पोर्टल और क्यूआर कोड स्कैन करने पर यह पहचान पत्र अमान्य व निरस्त प्रदर्शित होगा। आप चाहें तो भविष्य में इसे पुनः बहाल कर सकते हैं।
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancelModalStaff(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                रद्द न करें (Back)
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelStaff}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Ban className="w-4 h-4" />
                <span>हाँ, आई-कार्ड निरस्त करें</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN STAFF CARD PREVIEW & PRINT MODAL */}
      {previewStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300 my-auto animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-['Cinzel',serif]">
                    स्टाफ आई-कार्ड लाइव निरीक्षण (Card Preview)
                  </h3>
                  <p className="text-xs text-blue-200">
                    {previewStaff.fullName} • ID: {previewStaff.id} • पद: {previewStaff.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewStaff(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 bg-slate-50 flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
              {/* Card Rendering Container */}
              <div className="space-y-3 flex flex-col items-center">
                {/* Side Toggle */}
                <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setPreviewSide('front')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewSide === 'front'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    आगे का भाग (Front Side)
                  </button>
                  <button
                    onClick={() => setPreviewSide('back')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewSide === 'back'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    पीछे का भाग (Back Side)
                  </button>
                </div>

                {/* The ID Card Component */}
                <div className="shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-300 bg-white">
                  <StaffIdCard
                    staff={previewStaff}
                    side={previewSide}
                    theme={previewTheme}
                    language={previewLang}
                  />
                </div>

                {/* Hidden Elements for 2-Page PDF Export */}
                <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
                  <div id="admin-staff-card-front">
                    <StaffIdCard
                      staff={previewStaff}
                      side="front"
                      theme={previewTheme}
                      language={previewLang}
                    />
                  </div>
                  <div id="admin-staff-card-back">
                    <StaffIdCard
                      staff={previewStaff}
                      side="back"
                      theme={previewTheme}
                      language={previewLang}
                    />
                  </div>
                </div>
              </div>

              {/* Controls & Quick Actions */}
              <div className="w-full lg:w-80 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <label className="text-xs font-black text-slate-700 mb-2 block">
                    कार्ड कलर थीम (Card Theme):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'maroon_gold', label: 'शाही महरून' },
                      { id: 'navy_gold', label: 'रॉयल नेवी' },
                      { id: 'emerald_gold', label: 'एमराल्ड' },
                      { id: 'royal_purple', label: 'शाही बैंगनी' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        onClick={() => setPreviewTheme(thm.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          previewTheme === thm.id
                            ? 'border-blue-900 bg-blue-50 text-blue-900 font-black ring-1 ring-blue-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {thm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-2 block">
                    भाषा (Language):
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                    {[
                      { id: 'bilingual', label: 'द्विभाषी' },
                      { id: 'hi', label: 'हिन्दी' },
                      { id: 'en', label: 'English' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setPreviewLang(l.id as any)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          previewLang === l.id
                            ? 'bg-blue-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Indicator in Preview */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="text-slate-500 font-bold">वर्तमान स्थिति:</div>
                  <div className="font-black text-slate-800 text-sm mt-0.5">
                    {previewStaff.status === 'pending'
                      ? '⏳ अनुमोदन हेतु लंबित (Pending)'
                      : previewStaff.status === 'rejected'
                      ? '❌ अस्वीकृत (Rejected)'
                      : previewStaff.status === 'cancelled'
                      ? '⛔ निरस्त व अमान्य (Cancelled / Revoked)'
                      : '✅ स्वीकृत व सक्रिय (Approved & Issued)'}
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleAdminDownloadPdf}
                    disabled={isExporting}
                    className="w-full py-2.5 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>{isExporting ? 'PDF तैयार हो रही है...' : '2-Page PDF डाउनलोड करें'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = previewSide === 'front'
                        ? document.getElementById('admin-staff-card-front')
                        : document.getElementById('admin-staff-card-back');
                      directPrintElement(el);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>सीधा प्रिंट करें</span>
                  </button>

                  {/* 📜 Staff Appointment Letter on Official Letterhead */}
                  <button
                    onClick={() => setAdminAppointmentStaff(previewStaff)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-300 transition-all hover:scale-101"
                    title="संस्था के अधिकृत लेटरहेड पर स्टाफ नियुक्ति पत्र देखें व A4 PDF डाउनलोड करें"
                  >
                    <FileText className="w-4 h-4 text-yellow-200" />
                    <span>📜 स्टाफ नियुक्ति पत्र देखें (Letterhead)</span>
                  </button>
                </div>

                {/* Administrative Decision Buttons (Approve / Cancel / Reactivate / Reject / Delete) */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    प्रशासनिक निर्णय (Admin Decision):
                  </div>
                  <div className="space-y-1.5">
                    {/* Approve button for pending registrations */}
                    {previewStaff.status === 'pending' && (
                      <button
                        onClick={() => {
                          handleApprove(previewStaff);
                          setPreviewStaff(null);
                        }}
                        className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>फॉर्म स्वीकृत करें (Approve & Issue ID)</span>
                      </button>
                    )}

                    {/* Cancel Issued I-Card button (if currently approved / active) */}
                    {(previewStaff.status === 'approved' || previewStaff.status === 'active' || previewStaff.status === 'verified') && (
                      <button
                        onClick={() => {
                          setCancelModalStaff(previewStaff);
                          setCancelReasonStaff('प्रशासनिक समीक्षा अथवा सेवा समाप्ति उपरांत पहचान पत्र निरस्त');
                        }}
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="जारी आई-कार्ड निरस्त / रद्द करें"
                      >
                        <Ban className="w-3.5 h-3.5 text-amber-700" />
                        <span>पहचान पत्र निरस्त करें (Cancel / Revoke I-Card)</span>
                      </button>
                    )}

                    {/* Reactivate Button (if cancelled or rejected) */}
                    {(previewStaff.status === 'cancelled' || previewStaff.status === 'rejected') && (
                      <button
                        onClick={() => {
                          handleApprove(previewStaff);
                          setPreviewStaff({ ...previewStaff, status: 'approved' });
                        }}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="पहचान पत्र पुनः बहाल व स्वीकृत करें"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-200" />
                        <span>पहचान पत्र पुनः बहाल व स्वीकृत करें (Reactivate)</span>
                      </button>
                    )}

                    {/* Reject Button (if pending) */}
                    {previewStaff.status === 'pending' && (
                      <button
                        onClick={() => {
                          setRejectModalStaff(previewStaff);
                          setRejectionReason('विवरण अथवा दस्तावेज अपूर्ण हैं।');
                        }}
                        className="w-full py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>फॉर्म अस्वीकृत करें (Reject)</span>
                      </button>
                    )}

                    {/* Delete Button (Permanent Delete) */}
                    <button
                      onClick={() => {
                        handleDelete(previewStaff);
                      }}
                      className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="स्टाफ रिकॉर्ड हमेशा के लिए हटाएं"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>फॉर्म हमेशा के लिए हटाएं (Permanent Delete)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📜 Staff Appointment Letter Modal (Letterhead Format) for Admin */}
      {adminAppointmentStaff && (
        <AppointmentLetterModal
          isOpen={!!adminAppointmentStaff}
          onClose={() => setAdminAppointmentStaff(null)}
          type="staff"
          staffData={{
            id: adminAppointmentStaff.id,
            fullName: adminAppointmentStaff.fullName,
            fatherOrHusbandName: adminAppointmentStaff.fatherOrHusbandName,
            relationType: adminAppointmentStaff.relationType,
            designation: adminAppointmentStaff.designation,
            department: adminAppointmentStaff.department,
            dutyLocation: adminAppointmentStaff.dutyLocation,
            mobile: adminAppointmentStaff.mobile,
            email: adminAppointmentStaff.email,
            photoUrl: adminAppointmentStaff.photoUrl,
            bloodGroup: adminAppointmentStaff.bloodGroup,
            qualification: 'Graduate',
            dateOfJoining: adminAppointmentStaff.dateOfJoining,
            address: adminAppointmentStaff.address || FOUNDATION_INFO.address
          }}
        />
      )}

      {/* 📜 Volunteer Appointment Letter Modal (Official Letterhead) for Admin */}
      {adminAppointmentVolunteer && (
        <AppointmentLetterModal
          isOpen={!!adminAppointmentVolunteer}
          onClose={() => setAdminAppointmentVolunteer(null)}
          type="volunteer"
          volunteerData={{
            id: adminAppointmentVolunteer.id,
            name: adminAppointmentVolunteer.name,
            fatherName: adminAppointmentVolunteer.fatherName,
            relationType: adminAppointmentVolunteer.relationType,
            role: adminAppointmentVolunteer.role,
            area: adminAppointmentVolunteer.areaHindi || adminAppointmentVolunteer.area,
            phone: adminAppointmentVolunteer.phone,
            photoUrl: adminAppointmentVolunteer.photoUrl,
            address: `${adminAppointmentVolunteer.wardOrVillage || 'मीरानपुर'}, ${adminAppointmentVolunteer.block || 'मोहम्मदाबाद'}, ${adminAppointmentVolunteer.district || 'गाजीपुर'}, ${adminAppointmentVolunteer.state || 'उ.प्र.'}`,
            issueDate: adminAppointmentVolunteer.joinDate
          }}
        />
      )}

      {/* 🪪 Volunteer ID Card Modal */}
      {previewVolunteerCard && (
        <SwayamSewakCardModal
          volunteer={previewVolunteerCard}
          onClose={() => setPreviewVolunteerCard(null)}
        />
      )}

      {/* 🎖️ Volunteer Honorary Service Certificate Modal */}
      {previewVolunteerCert && (
        <VolunteerCertificateModal
          volunteer={previewVolunteerCert}
          onClose={() => setPreviewVolunteerCert(null)}
        />
      )}

      {/* ❌ Volunteer Rejection Dialog Modal */}
      {rejectModalVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-red-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center font-black">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">स्वयंसेवक आवेदन अस्वीकृत करें</h3>
                <p className="text-xs text-slate-500">{rejectModalVolunteer.name} ({rejectModalVolunteer.id})</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">अस्वीकृति का कारण (Reason for Rejection):</label>
              <textarea
                value={volRejectionReason}
                onChange={(e) => setVolRejectionReason(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs border rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-hidden"
                placeholder="दस्तावेज अथवा विवरण अपूर्ण होने के कारण..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalVolunteer(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectVol}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                अस्वीकृत करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Volunteer Deletion Dialog Modal */}
      {deleteModalVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-black">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">स्वयंसेवक रिकॉर्ड हटाएं</h3>
                <p className="text-xs text-slate-500">{deleteModalVolunteer.name} ({deleteModalVolunteer.id})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              क्या आप वाकई स्वयंसेवक <strong>{deleteModalVolunteer.name}</strong> का रिकॉर्ड स्थायी रूप से हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalVolunteer(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteVol}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                स्थायी रूप से हटाएं
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
