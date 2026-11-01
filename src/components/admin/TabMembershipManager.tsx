// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB MEMBERSHIP MANAGER (ADMIN HUB)
// संस्था सदस्यता आवेदन समीक्षा, UTR सत्यापन, अनुमोदन एवं लेटरहेड प्रमाण पत्र
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Crown,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  Phone,
  Calendar,
  CreditCard,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink,
  Printer,
  ChevronRight,
  ShieldCheck,
  X,
  FileSpreadsheet
} from 'lucide-react';
import {
  NgoMemberRecord,
  MembershipType,
  OFFICIAL_MEMBERSHIP_PLANS
} from '../../types/membership';
import {
  getAllMembers,
  approveMembership,
  rejectMembership,
  deleteMember,
  applyForMembership,
  generateMembershipId
} from '../../services/membershipService';
import { MembershipLetterheadCertificate } from '../membership/MembershipLetterheadCertificate';

export const TabMembershipManager: React.FC = () => {
  const [members, setMembers] = useState<NgoMemberRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<NgoMemberRecord | null>(null);
  const [certificateMember, setCertificateMember] = useState<NgoMemberRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customMembershipId, setCustomMembershipId] = useState('');

  // Load records
  const loadRecords = () => {
    try {
      const all = getAllMembers();
      setMembers(all);
    } catch {
      setMembers([]);
    }
  };

  useEffect(() => {
    loadRecords();
    const handleUpdate = () => loadRecords();
    window.addEventListener('jjf-membership-updated', handleUpdate);
    return () => window.removeEventListener('jjf-membership-updated', handleUpdate);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter((m) => m.status === 'pending').length;
    const approved = members.filter((m) => m.status === 'approved').length;
    const totalFees = members
      .filter((m) => m.status === 'approved')
      .reduce((sum, m) => sum + (m.paymentAmount || 0), 0);
    return { total, pending, approved, totalFees };
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (planFilter !== 'all' && m.membershipType !== planFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (m.fullName || '').toLowerCase().includes(q);
        const matchesPhone = (m.phone || '').includes(q);
        const matchesId = (m.id || '').toLowerCase().includes(q) || (m.applicationNo || '').toLowerCase().includes(q);
        const matchesUtr = (m.transactionRef || '').toLowerCase().includes(q);
        const matchesCity = (m.district || '').toLowerCase().includes(q) || (m.address || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId && !matchesUtr && !matchesCity) {
          return false;
        }
      }
      return true;
    });
  }, [members, statusFilter, planFilter, searchQuery]);

  // Handle Approve
  const handleApprove = async (member: NgoMemberRecord) => {
    if (!window.confirm(`क्या आप ${member.fullName} (${member.planNameHindi}) की सदस्यता को स्वीकृत करना चाहते हैं?`)) {
      return;
    }
    setIsProcessing(true);
    try {
      const assignedId = customMembershipId.trim() || undefined;
      const approved = await approveMembership(
        member.id || member.applicationNo,
        'Super Admin',
        'admin_master',
        {
          customMembershipId: assignedId,
          customValidTill: member.membershipType === 'life' || member.membershipType === 'patron' ? 'आजीवन (Lifetime)' : undefined
        }
      );
      if (approved) {
        setSelectedMember(null);
        setCustomMembershipId('');
        loadRecords();
        alert(`✅ सदस्यता सफलतापूर्वक स्वीकृत की गई!\nसदस्यता आईडी: ${approved.id}\nआधिकारिक लेटरहेड प्रमाण पत्र जारी कर दिया गया है।`);
      }
    } catch (e: any) {
      alert(`स्वीकृति में त्रुटि हुई: ${e.message || 'पुनः प्रयास करें।'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reject
  const handleReject = async (member: NgoMemberRecord) => {
    const reason = prompt('अस्वीकृति का कारण दर्ज करें (जैसे: अमान्य UTR / भुगतान प्राप्त नहीं हुआ):', 'अमान्य UTR या अधूरा भुगतान विवरण');
    if (!reason) return;
    setIsProcessing(true);
    try {
      await rejectMembership(member.id || member.applicationNo, reason, 'Super Admin');
      setSelectedMember(null);
      loadRecords();
      alert(`सदस्यता आवेदन अस्वीकृत कर दिया गया है।`);
    } catch {
      alert('त्रुटि हुई।');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Delete
  const handleDelete = async (member: NgoMemberRecord) => {
    if (!window.confirm(`चेतावनी: क्या आप ${member.fullName} का रिकॉर्ड स्थायी रूप से हटाना चाहते हैं?`)) {
      return;
    }
    try {
      await deleteMember(member.id || member.applicationNo);
      setSelectedMember(null);
      loadRecords();
    } catch {
      alert('हटाने में त्रुटि।');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (members.length === 0) {
      alert('एक्सपोर्ट के लिए कोई रिकॉर्ड उपलब्ध नहीं है।');
      return;
    }
    const headers = ['सदस्यता ID', 'आवेदन क्र.', 'नाम', 'पिता/पति', 'फोन', 'श्रेणी', 'शुल्क (₹)', 'UTR / लेनदेन', 'स्थिति', 'आवेदन तिथि', 'पता'];
    const rows = members.map((m) => [
      `"${m.id || 'N/A'}"`,
      `"${m.applicationNo || 'N/A'}"`,
      `"${m.fullName}"`,
      `"${m.fatherOrHusbandName || ''}"`,
      `"${m.phone}"`,
      `"${m.planNameHindi}"`,
      m.paymentAmount,
      `"${m.transactionRef || 'N/A'}"`,
      `"${m.status}"`,
      `"${m.appliedAt ? new Date(m.appliedAt).toLocaleDateString('hi-IN') : ''}"`,
      `"${m.address || ''}, ${m.district || ''}, ${m.state || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JJF_NGO_MEMBERSHIP_REGISTER_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 rounded-3xl p-6 text-white shadow-xl border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 fill-blue-950" />
            <span>NGO Membership Management</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>संस्था सदस्यता प्रबंधन एवं अनुमोदन पोर्टल</span>
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl">
            ऑनलाइन सदस्यता आवेदन, शुल्क व UTR सत्यापन, प्रशासनिक अनुमोदन एवं आधिकारिक A4 लेटरहेड प्रमाण पत्र जारीकरण।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="पूरी सदस्य सूची CSV एक्सेल फाइल में डाउनलोड करें"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV एक्सपोर्ट</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-blue-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया सदस्य जोड़ें</span>
          </button>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">कुल आवेदन</span>
            <Crown className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-1">सभी 5 श्रेणियों में पंजीकृत</div>
        </div>

        <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-xs relative overflow-hidden">
          {stats.pending > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          )}
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-xs font-black">पेंडिंग अप्रूवल</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">{stats.pending}</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">
            {stats.pending > 0 ? '⚠️ UTR व भुगतान सत्यापन प्रतीक्षारत' : 'सभी आवेदन निपटाए जा चुके हैं'}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-300 shadow-xs">
          <div className="flex items-center justify-between text-emerald-900 mb-2">
            <span className="text-xs font-bold">स्वीकृत सक्रिय सदस्य</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">{stats.approved}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">प्रमाण पत्र जारी एवं वैध</div>
        </div>

        <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-indigo-200 mb-2">
            <span className="text-xs font-bold">कुल सदस्यता शुल्क</span>
            <CreditCard className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            ₹{stats.totalFees.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-200 mt-1">स्वीकृत सदस्यों से प्राप्त राशि</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, मोबाइल, ID या UTR से खोजें..."
            className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 bg-slate-50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              सभी ({members.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'pending'
                  ? 'bg-amber-400 text-blue-950 shadow-xs font-black'
                  : 'text-amber-800'
              }`}
            >
              ⏳ पेंडिंग ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              ✅ स्वीकृत ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'rejected' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              अस्वीकृत
            </button>
          </div>

          {/* Plan Filter Dropdown */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-100 text-slate-800 rounded-xl border border-slate-300 focus:outline-none"
          >
            <option value="all">सभी योजनाएं (All Plans)</option>
            {OFFICIAL_MEMBERSHIP_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titleHindi} (₹{p.amount})
              </option>
            ))}
          </select>

          <button
            onClick={loadRecords}
            className="p-2 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="रिफ्रेश करें"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MEMBERS TABLE / LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Crown className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <div className="text-base font-bold text-slate-700">कोई सदस्यता रिकॉर्ड नहीं मिला</div>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery ? 'सर्च क्वेरी बदलें या फ़िल्टर रीसेट करें।' : 'अभी तक कोई सदस्यता आवेदन दर्ज नहीं हुआ है।'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">सदस्य विवरण</th>
                  <th className="py-3 px-4">सदस्यता श्रेणी</th>
                  <th className="py-3 px-4">भुगतान व UTR</th>
                  <th className="py-3 px-4">स्थिति</th>
                  <th className="py-3 px-4">सदस्यता ID / आवेदन</th>
                  <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredMembers.map((m) => (
                  <tr key={m.id || m.applicationNo} className="hover:bg-slate-50/80 transition-colors">
                    {/* Member Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-900 text-amber-300 font-black text-sm">
                              {(m.fullName || 'M').charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm">{m.fullName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>📞 {m.phone}</span>
                            {m.district && <span>• {m.district}</span>}
                          </div>
                          {m.fatherOrHusbandName && (
                            <div className="text-[10px] text-slate-400">आ./पति: {m.fatherOrHusbandName}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Plan Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-blue-950">{m.planNameHindi}</div>
                      <div className="text-[11px] text-amber-700 font-black">
                        ₹{m.paymentAmount} ({m.validTill || 'वैध'})
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-800">
                        {m.transactionRef ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            UTR: {m.transactionRef}
                          </span>
                        ) : (
                          <span className="text-slate-400">UTR दर्ज नहीं</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {m.appliedAt ? new Date(m.appliedAt).toLocaleDateString('hi-IN') : 'N/A'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {m.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>स्वीकृत</span>
                        </span>
                      )}
                      {m.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>समीक्षाधीन</span>
                        </span>
                      )}
                      {m.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>अस्वीकृत</span>
                        </span>
                      )}
                    </td>

                    {/* Membership ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {m.id && !m.id.includes('APP') ? (
                        <span className="bg-blue-50 text-blue-900 px-2 py-1 rounded-lg border border-blue-200">
                          {m.id}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">{m.applicationNo || m.id}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Review / Details Modal */}
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setCustomMembershipId(m.id?.startsWith('JJF-MEM-20') && !m.id.includes('APP') ? m.id : generateMembershipId());
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-lg text-xs border border-blue-200 flex items-center gap-1 cursor-pointer"
                          title="समीक्षा व विवरण देखें"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>समीक्षा</span>
                        </button>

                        {/* View Certificate (if approved) */}
                        {m.status === 'approved' && (
                          <button
                            onClick={() => setCertificateMember(m)}
                            className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black rounded-lg text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                            title="लेटरहेड प्रमाण पत्र देखें व प्रिंट करें"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>प्रमाण पत्र</span>
                          </button>
                        )}

                        {/* Direct Delete */}
                        <button
                          onClick={() => handleDelete(m)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="रिकॉर्ड हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REVIEW & APPROVAL DETAIL MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-lg text-white">सदस्यता आवेदन समीक्षा एवं UTR सत्यापन</h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
              {/* Member Profile Banner */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border-2 border-amber-400 shadow-sm">
                  {selectedMember.photoUrl ? (
                    <img src={selectedMember.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-amber-300 font-black text-2xl">
                      {(selectedMember.fullName || 'M').charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-slate-900 text-base">{selectedMember.fullName}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    पिता / पति: <span className="font-bold text-slate-800">{selectedMember.fatherOrHusbandName || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md font-bold">
                      📞 {selectedMember.phone}
                    </span>
                    {selectedMember.email && (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md">
                        ✉️ {selectedMember.email}
                      </span>
                    )}
                    {selectedMember.bloodGroup && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md font-bold">
                        🩸 {selectedMember.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid of Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">चयनित योजना</span>
                  <span className="font-black text-blue-950 text-sm block mt-0.5">{selectedMember.planNameHindi}</span>
                  <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
                    शुल्क: ₹{selectedMember.paymentAmount} ({selectedMember.validTill || 'वैध'})
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">भुगतान UTR व संदर्भ</span>
                  <span className="font-mono font-black text-amber-950 text-sm block mt-0.5">
                    {selectedMember.transactionRef || 'दर्ज नहीं है'}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    माध्यम: {selectedMember.paymentMode || 'UPI QR'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">जन्म तिथि व लिंग</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">
                    {selectedMember.dob || 'N/A'} • {selectedMember.gender === 'male' ? 'पुरुष' : selectedMember.gender === 'female' ? 'महिला' : 'अन्य'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">व्यवसाय व आवेदन क्रमांक</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">
                    {selectedMember.occupation || 'N/A'} • {selectedMember.applicationNo || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Address & ID Proof */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">स्थाई पता</span>
                <p className="font-medium text-slate-800 text-xs">
                  {selectedMember.address ? `${selectedMember.address}, ` : ''}
                  {selectedMember.district ? `${selectedMember.district}, ` : ''}
                  {selectedMember.state || 'उत्तर प्रदेश'} {selectedMember.pincode ? `- ${selectedMember.pincode}` : ''}
                </p>
                {selectedMember.idProofNumber && (
                  <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 mt-2">
                    पहचान पत्र ({selectedMember.idProofType || 'Aadhaar'}): <span className="font-mono font-bold text-slate-800">{selectedMember.idProofNumber}</span>
                  </div>
                )}
              </div>

              {/* Membership ID Assignment (Editable) */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <label className="block text-xs font-black text-blue-950">
                  आवंटित सदस्यता संख्या (Membership ID):
                </label>
                <input
                  type="text"
                  value={customMembershipId}
                  onChange={(e) => setCustomMembershipId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-blue-300 font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="JJF-MEM-2026-XXX"
                />
                <p className="text-[10px] text-blue-700">
                  स्वीकृति पर यह आईडी प्रमाण पत्र, सत्यापन QR एवं रजिस्ट्री में दर्ज होगी।
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleReject(selectedMember)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  अस्वीकृत करें (Reject)
                </button>

                <div className="flex items-center gap-2">
                  {selectedMember.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCertificateMember(selectedMember);
                        setSelectedMember(null);
                      }}
                      className="px-4 py-2 bg-slate-900 text-amber-300 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>प्रमाण पत्र देखें</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedMember)}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedMember.status === 'approved' ? 'आईडी अपडेट करें' : 'स्वीकार व अनुमोदित करें'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MANUALLY MODAL (ADMIN ISSUE) */}
      {showAddModal && (
        <ManualAddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            loadRecords();
          }}
        />
      )}

      {/* OFFICIAL LETTERHEAD CERTIFICATE PREVIEW MODAL */}
      {certificateMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-amber-400/40 p-4 relative my-6">
            <button
              onClick={() => setCertificateMember(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <MembershipLetterheadCertificate
              member={certificateMember}
              onClose={() => setCertificateMember(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ADMIN MANUAL MEMBER ADDITION FORM
// ============================================================================

interface ManualAddMemberModalProps {
  onClose: () => void;
  onAdded: () => void;
}

const ManualAddMemberModal: React.FC<ManualAddMemberModalProps> = ({ onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherOrHusbandName: '',
    relationType: 'Father' as const,
    phone: '',
    email: '',
    gender: 'male' as const,
    dob: '1990-01-01',
    bloodGroup: 'B+',
    occupation: 'समाजसेवी',
    address: 'ग़ाज़ीपुर',
    district: 'ग़ाज़ीपुर',
    state: 'उत्तर प्रदेश',
    pincode: '233001',
    membershipType: 'life' as MembershipType,
    paymentAmount: 5100,
    transactionRef: 'ADMIN-OFFICIAL-DIRECT',
    paymentMode: 'bank_transfer' as const,
    paymentDate: new Date().toISOString().split('T')[0],
    idProofType: 'aadhaar' as const,
    idProofNumber: 'XXXX-XXXX-0000',
    photoUrl: ''
  });

  const handlePlanChange = (planId: MembershipType) => {
    const plan = OFFICIAL_MEMBERSHIP_PLANS.find((p) => p.id === planId);
    setFormData((prev) => ({
      ...prev,
      membershipType: planId,
      paymentAmount: plan?.amount || 5100
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert('कृपया नाम और मोबाइल नंबर भरें।');
      return;
    }

    try {
      const selectedPlan = OFFICIAL_MEMBERSHIP_PLANS.find((p) => p.id === formData.membershipType) || OFFICIAL_MEMBERSHIP_PLANS[0];
      const record = await applyForMembership({
        ...formData,
        planNameHindi: selectedPlan.titleHindi,
        planNameEnglish: selectedPlan.titleEnglish
      });
      if (record) {
        await approveMembership(
          record.id || record.applicationNo,
          'Super Admin Direct',
          'admin_direct',
          {
            customValidTill: formData.membershipType === 'life' || formData.membershipType === 'patron' ? 'आजीवन (Lifetime)' : undefined
          }
        );
        alert(`✅ सदस्य ${formData.fullName} को सफलतापूर्वक जोड़ दिया गया है और प्रमाण पत्र जारी हो गया है!`);
        onAdded();
      }
    } catch (err: any) {
      alert(`सदस्य जोड़ने में त्रुटि: ${err.message || 'पुनः प्रयास करें।'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="bg-gradient-to-r from-blue-950 to-indigo-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-base text-white">एडमिन द्वारा सीधा सदस्य जोड़ें (Direct Membership)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">सदस्यता योजना चुनें *</label>
            <select
              value={formData.membershipType}
              onChange={(e) => handlePlanChange(e.target.value as MembershipType)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold text-slate-800"
            >
              {OFFICIAL_MEMBERSHIP_PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titleHindi} — ₹{p.amount} ({p.validityHindi})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold"
                placeholder="श्री/सुश्री/डॉ..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">पिता या पति का नाम</label>
              <input
                type="text"
                value={formData.fatherOrHusbandName}
                onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">मोबाइल नंबर (10 अंक) *</label>
              <input
                type="tel"
                required
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-mono font-bold"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">व्यवसाय / पद (Occupation)</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300"
                placeholder="समाजसेवी, शिक्षक, उद्योगपति..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ज़िला (District)</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">प्राप्त शुल्क (₹)</label>
              <input
                type="number"
                value={formData.paymentAmount}
                onChange={(e) => setFormData({ ...formData, paymentAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 font-black text-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">पूर्ण पता</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300"
              placeholder="ग्राम/मोहल्ला, पोस्ट, थाना..."
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md cursor-pointer"
            >
              स्वीकृत कर प्रमाण पत्र जारी करें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
