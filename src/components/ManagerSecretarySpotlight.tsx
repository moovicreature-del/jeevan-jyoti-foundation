import React from 'react';
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  FileText,
  Users,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface Props {
  onOpenStaff?: (tab?: 'options' | 'registration' | 'download') => void;
  onOpenVolunteerPortal?: () => void;
  onOpenDonate?: () => void;
}

export const ManagerSecretarySpotlight: React.FC<Props> = ({
  onOpenStaff,
  onOpenVolunteerPortal,
  onOpenDonate
}) => {
  const { isHindi } = useLanguage();

  const managerPhotoUrl = getOptimizedImageUrl('/uploads/manager_secretary.webp');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=918052361666&text=${encodeURIComponent(
    'नमस्ते शैलेश जी, मैं जीवन ज्योति फाउंडेशन ग़ाज़ीपुर के संबंध में जानकारी व सहयोग हेतु संपर्क कर रहा हूँ।'
  )}`;

  return (
    <section
      id="manager-secretary-spotlight"
      className="py-12 sm:py-16 bg-gradient-to-b from-white via-amber-50/50 to-amber-100/30 border-y border-amber-200/80 relative overflow-hidden"
    >
      {/* Decorative Background Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-red-200/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#8B0000] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Award className="w-4 h-4 text-amber-300" />
            <span>{isHindi ? 'आधिकारिक संस्था नेतृत्व (Executive Leadership)' : 'Official Executive Leadership'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif leading-tight">
            {isHindi ? 'संस्था प्रबंधन एवं राष्ट्रीय नेतृत्व' : 'Foundation Management & Leadership'}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2">
            {isHindi
              ? 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर के संस्थापक प्रबंधक / सचिव का संदेश एवं आधिकारिक परिचय'
              : 'Message and official introduction of the Founder Manager / Secretary of Jeevan Jyoti Foundation Ghazipur'}
          </p>
        </div>

        {/* Main Leadership Card */}
        <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Column: Manager / Secretary Portrait Photo Showcase */}
            <div className="lg:col-span-5 bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-slate-100 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-amber-200/70">
              
              {/* Photo Frame with Royal Gold Border & Drop Shadow */}
              <div className="relative group max-w-[320px] w-full">
                {/* Decorative Tricolor Top Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-t-xl shadow-xs" />

                <div className="relative bg-white p-2 rounded-b-2xl border-2 border-t-0 border-amber-400 shadow-xl overflow-hidden">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={managerPhotoUrl}
                      alt="शैलेश प्रधान - Manager / Secretary"
                      className="w-full h-full object-cover object-top transform group-hover:scale-102 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.tried) {
                          target.dataset.tried = '1';
                          target.src = getOptimizedImageUrl('/assets/aistudio/869845680_2238650036692471_2813899680013756397_n_202169ed.webp');
                        } else if (target.dataset.tried === '1') {
                          target.dataset.tried = '2';
                          target.src = getOptimizedImageUrl('/manager_secretary.webp');
                        }
                      }}
                    />

                    {/* Verified Digital Seal Watermark badge */}
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-1 rounded-lg border border-white/30 text-[10px] font-black flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'सत्यापित' : 'Verified'}</span>
                    </div>

                    {/* Official Banner Overlay Bottom Tag */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 text-white text-left">
                      <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        {FOUNDATION_INFO.nameHindi}
                      </div>
                      <div className="text-[9px] text-slate-200">
                        {isHindi ? 'ग़ाज़ीपुर (उत्तर प्रदेश) • स्थापना 2018' : 'Ghazipur (UP) • Est. 2018'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exact Title directly below the image as requested */}
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-300 shadow-sm text-center">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif leading-tight">
                    शैलेश प्रधान
                  </h3>
                  <div className="text-xs sm:text-sm font-bold text-slate-600 font-sans mt-0.5">
                    (Shailesh Pradhan)
                  </div>

                  {/* Primary Requested Text: Manager/Secretary */}
                  <div className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-xs sm:text-sm font-black tracking-wide uppercase">
                      Manager / Secretary
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#8B0000] mt-1.5">
                    {isHindi ? 'प्रबंधक / राष्ट्रीय सचिव' : 'Manager / National Secretary'}
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium mt-1">
                    जीवन ज्योति फाउंडेशन (रजि. ग़ाज़ीपुर)
                  </div>
                </div>
              </div>

              {/* Quick Contact Chips */}
              <div className="mt-5 w-full max-w-[320px] flex items-center justify-center gap-2">
                <a
                  href={`tel:${FOUNDATION_INFO.phone}`}
                  className="flex-1 py-2 px-3 bg-white hover:bg-amber-50 text-slate-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  title="सीधा कॉल करें"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{FOUNDATION_INFO.phone}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                  title="WhatsApp पर संदेश भेजें"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Mission Message, Credentials, and Official Services */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                
                {/* Leadership Message Quote */}
                <div className="relative pl-6 sm:pl-8 border-l-4 border-[#8B0000] mb-6">
                  <div className="text-3xl font-serif text-amber-300 absolute -top-4 -left-3 select-none">
                    “
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#8B0000] uppercase tracking-wide">
                    {isHindi ? 'प्रबंधक / सचिव का संदेश' : 'Message from the Manager / Secretary'}
                  </h4>
                  <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed mt-2 italic font-serif">
                    {isHindi
                      ? '“शिक्षा, स्वास्थ्य और सेवा ही हमारा मूल धर्म है। जीवन ज्योति फाउंडेशन ग़ाज़ीपुर के अंतिम पंक्ति में खड़े व्यक्ति तक निःशुल्क शिक्षा, अन्नपूर्णा भोजन और स्वास्थ्य सुविधा पहुंचाने के लिए अनवरत संकल्पित है। समाज के हर जागरूक नागरिक का सहयोग ही इस पावन यात्रा की शक्ति है।”'
                      : '“Service, Education, and Healthcare are our foremost commitments. Jeevan Jyoti Foundation remains relentlessly dedicated to providing free education, daily meals, and medical aid to the most underserved communities in Ghazipur. The collective support of society fuels this noble journey.”'}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>शैलेश प्रधान — प्रबंधक / सचिव, जीवन ज्योति फाउंडेशन</span>
                  </div>
                </div>

                {/* Key Roles & Core Responsibilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div className="text-xs font-black text-[#8B0000] flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'निःशुल्क शिक्षा विस्तार' : 'Free Evening Schools'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isHindi
                        ? 'मलिन व ग्रामीण बस्तियों के निर्धन बालकों को निःशुल्क पाठ्य सामग्री, कॉपी-किताबें एवं संध्याकालीन पाठशाला।'
                        : 'Free study material, stationery, and evening classes for underprivileged children in rural hamlets.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div className="text-xs font-black text-[#8B0000] flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isHindi ? 'अन्नपूर्णा भोजन व स्वास्थ्य' : 'Annapurna Meal & Health'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {isHindi
                        ? 'निराश्रितों को पौष्टिक पका हुआ भोजन, सूखा राशन किट एवं ग्रामीण चिकित्सा परामर्श शिविरों का संचालन।'
                        : 'Daily nutritious meals, emergency ration kits, and medical diagnosis camps in interior villages.'}
                    </p>
                  </div>
                </div>

                {/* Official Registration & Government Accreditation Strip */}
                <div className="bg-[#FFFDE7] p-4 rounded-2xl border border-yellow-300 mb-6">
                  <div className="text-xs font-black text-[#8B0000] uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>{isHindi ? 'आधिकारिक पंजीकरण एवं मान्यता' : 'Official Government Accreditation'}</span>
                    <span className="text-[10px] font-bold text-slate-600 bg-yellow-200/60 px-2 py-0.5 rounded-md">
                      ISO 9001:2015
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">संस्था पंजीकरण (Reg):</span>
                      <span className="font-mono font-black text-slate-900">{FOUNDATION_INFO.regNo}</span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">नीति आयोग दर्पण UID:</span>
                      <span className="font-mono font-black text-slate-900">{FOUNDATION_INFO.nitiAayogUid}</span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">पैन संख्या (PAN):</span>
                      <span className="font-mono font-black text-slate-900">{FOUNDATION_INFO.pan}</span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">स्थापना वर्ष:</span>
                      <span className="font-mono font-black text-slate-900">2018 (ग़ाज़ीपुर, उ.प्र.)</span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">डिजिटल पिन (DIGIPIN):</span>
                      <span className="font-mono font-black text-blue-900">{FOUNDATION_INFO.digipin}</span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-yellow-200">
                      <span className="text-[10px] text-slate-500 font-bold block">प्रबंधक / सचिव:</span>
                      <span className="font-bold text-slate-900 truncate block">शैलेश प्रधान</span>
                    </div>
                  </div>
                </div>

                {/* Office Postal Address */}
                <div className="text-xs text-slate-600 flex items-start gap-2 mb-6">
                  <MapPin className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                  <span>
                    <strong>{isHindi ? 'पंजीकृत कार्यालय:' : 'Registered Office:'}</strong>{' '}
                    {FOUNDATION_INFO.fullAddressHindi}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                {onOpenStaff && (
                  <button
                    onClick={() => onOpenStaff('options')}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-[#8B0000] border-2 border-amber-400 font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Users className="w-4 h-4 text-[#8B0000]" />
                    <span>{isHindi ? 'स्टाफ पोर्टल व नियुक्ति पत्र' : 'Staff Portal & Letters'}</span>
                  </button>
                )}

                {onOpenVolunteerPortal && (
                  <button
                    onClick={onOpenVolunteerPortal}
                    className="px-5 py-2.5 bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-300 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{isHindi ? 'स्वयंसेवक प्रमाण पत्र प्राप्त करें' : 'Get Volunteer Certificate'}</span>
                  </button>
                )}

                {onOpenDonate && (
                  <button
                    onClick={onOpenDonate}
                    className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isHindi ? 'सहयोग व दान करें' : 'Support / Donate'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ManagerSecretarySpotlight;
