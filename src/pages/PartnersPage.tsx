import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Partner } from '../types';
import { Handshake, ExternalLink, ShieldCheck } from 'lucide-react';

interface PartnersPageProps {
  partners: Partner[];
  setActiveTab: (tab: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ partners, setActiveTab }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const published = partners.filter((p) => p.isPublished);

  return (
    <div className="space-y-20 pb-20">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Handshake className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'التحالفات المؤسسية' : 'Strategic Alliances'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {t('partnersTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {t('partnersSubtitle')}
          </p>
        </div>
      </section>

      {/* Partners Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {published.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] border border-[#222] rounded-sm p-8 max-w-xl mx-auto">
            <ShieldCheck className="w-10 h-10 text-[#C8A45D] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#F4F1E9]">
              {isRtl ? 'جاري تحديث قائمة الشركاء المعتمدين' : 'Partner Alliance Directory Under Active Update'}
            </h4>
            <p className="text-xs text-[#8A8A8A] mt-2">
              {isRtl
                ? 'يتم إضافة وتحديث الشركاء دورياً عبر بوابة الإدارة المركزية.'
                : 'Verified enterprise relationships are maintained through our administrative portal.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {published.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#121212] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm p-8 text-center flex flex-col justify-between transition-colors group"
              >
                <div>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-sm bg-[#1A1A1A] border border-[#2C2C2C] flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={partner.logoUrl}
                      alt={partner.nameEn}
                      className="max-h-full max-w-full object-contain filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  <span className="text-[11px] font-mono text-[#C8A45D] block mb-2">
                    {isRtl ? partner.categoryAr : partner.categoryEn}
                  </span>

                  <h3 className="text-base font-bold text-[#F4F1E9] mb-3">
                    {isRtl ? partner.nameAr : partner.nameEn}
                  </h3>
                </div>

                {partner.websiteUrl && (
                  <div className="pt-4 border-t border-[#1C1C1C]">
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#E2C98A] hover:text-[#C8A45D] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{isRtl ? 'زيارة الموقع الرسمي' : 'Official Portal'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-[#101010] border border-[#222] rounded-sm max-w-xl text-center">
            <h4 className="text-sm font-bold text-[#F4F1E9] mb-1">
              {isRtl ? 'هل ترغب في بناء شراكة تجارية مع آر إم ستار؟' : 'Interested in Formulating a Strategic Alliance?'}
            </h4>
            <p className="text-xs text-[#8A8A8A] mb-4">
              {isRtl
                ? 'نرحب بالموردين، أساطيل النقل، ومزودي التقنيات البترولية لتطوير أعمال مشتركة.'
                : 'We welcome qualified bulk transporters, refinery suppliers, and technology providers.'}
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-5 py-2 text-xs font-semibold rounded-sm bg-[#1A1A1A] hover:bg-[#C8A45D] hover:text-[#080808] text-[#F4F1E9] border border-[#333] transition-colors"
            >
              {isRtl ? 'تقديم استفسار شراكة' : 'Initiate Partnership Inquiry'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
