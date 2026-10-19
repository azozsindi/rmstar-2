import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CareerPosting, SiteSettings } from '../types';
import { DEFAULT_CAREERS } from '../services/db';
import { Briefcase, MapPin, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CareersPageProps {
  careers?: CareerPosting[];
  settings?: SiteSettings;
}

export const CareersPage: React.FC<CareersPageProps> = ({ careers = DEFAULT_CAREERS, settings }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const [appliedRole, setAppliedRole] = useState<string | null>(null);

  const publishedRoles = careers.filter((c) => c.isPublished);

  const title = (isRtl ? settings?.careersPageTitleAr : settings?.careersPageTitleEn) || t('careersTitle');
  const subtitle = (isRtl ? settings?.careersPageSubtitleAr : settings?.careersPageSubtitleEn) || t('careersSubtitle');
  const officialCareersEmail = settings?.careersEmail || settings?.officialEmail || 'info@rmstar.online';

  return (
    <div className="space-y-20 pb-20">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'المواهب والفرص الوظيفية' : 'Talent & Opportunities'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Roles List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {appliedRole && (
          <div className="p-4 bg-[#141414] border border-[#C8A45D]/40 rounded-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-[#E2C98A]">
              <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0" />
              <span>
                {isRtl
                  ? `تم استلام اهتمامك بوظيفة "${appliedRole}". يرجى إرسال سيرتك الذاتية إلى ${officialCareersEmail} مع ذكر مسمى الوظيفة.`
                  : `Interest noted for "${appliedRole}". Please email your CV to ${officialCareersEmail} with the role title in subject.`}
              </span>
            </div>
            <button
              onClick={() => setAppliedRole(null)}
              className="text-xs text-[#8A8A8A] hover:text-[#F4F1E9] ms-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-4">
          {publishedRoles.length === 0 ? (
            <div className="text-center py-12 bg-[#121212] border border-[#222] rounded-sm text-[#888] text-sm">
              {isRtl ? 'لا توجد شواغر معلنة حالياً. يمكنك إرسال سيرتك الذاتية للاحتفاظ بها في بنك المواهب.' : 'No open vacancies at this moment. You may email your CV to our talent database.'}
            </div>
          ) : (
            publishedRoles.map((role) => (
              <div
                key={role.id}
                className="bg-[#121212] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#C8A45D] font-mono">
                    <span>{isRtl ? role.departmentAr : role.departmentEn}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-[#8A8A8A]">
                      <MapPin className="w-3 h-3 text-[#C8A45D]" />
                      {isRtl ? role.locationAr : role.locationEn}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-[#8A8A8A]">
                      <Clock className="w-3 h-3 text-[#C8A45D]" />
                      {role.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F4F1E9]">
                    {isRtl ? role.titleAr : role.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                    {isRtl ? role.descriptionAr : role.descriptionEn}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => setAppliedRole(isRtl ? role.titleAr : role.titleEn)}
                    className="w-full md:w-auto px-6 py-2.5 rounded-sm bg-[#1A1A1A] hover:bg-[#C8A45D] hover:text-[#080808] border border-[#2E2E2E] hover:border-transparent text-xs font-bold text-[#F4F1E9] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t('careersApplyBtn')}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
