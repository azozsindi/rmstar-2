import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { Shield, Eye, Target, Award, CheckCircle, Sparkles } from 'lucide-react';

interface AboutPageProps {
  settings?: SiteSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const title = (isRtl ? settings?.aboutTitleAr : settings?.aboutTitleEn) || t('aboutTitle');
  const subtitle = (isRtl ? settings?.aboutSubtitleAr : settings?.aboutSubtitleEn) || t('aboutSubtitle');

  const overview1 = (isRtl ? settings?.aboutOverviewAr : settings?.aboutOverviewEn) || (isRtl
    ? 'تأسست شركة آر إم ستار لتقديم نموذج تشغيلي حديث يرتقي بقطاع استيراد وتوريد الوقود والديزل، وتطوير محطات الخدمة البترولية لتكون منصات لوجستية وخدمية متكاملة تخدم التنمية الاقتصادية والصناعية.'
    : 'RM STAR was established to introduce an institutional standard in bulk fuel import, commercial distribution, and modern service station infrastructure, catering to industrial conglomerates and commercial transport corridors.');

  const overview2 = (isRtl ? settings?.aboutOverview2Ar : settings?.aboutOverview2En) || (isRtl
    ? 'نعمل وفق منظومة حوكمة صارمة تضمن الالتزام بالمواصفات القياسية، دقة الجداول الزمنية، وتوفير تجربة استثنائية لعملائنا في محطات الوقود ومراكز العناية بالمركبات.'
    : 'Our operations are anchored on strict governance, chemical compliance, and delivery punctuality, creating dependable value for institutional partners and road users alike.');

  const visionTitle = (isRtl ? settings?.aboutVisionTitleAr : settings?.aboutVisionTitleEn) || t('aboutVisionTitle');
  const visionDesc = (isRtl ? settings?.aboutVisionDescAr : settings?.aboutVisionDescEn) || t('aboutVisionDesc');

  const missionTitle = (isRtl ? settings?.aboutMissionTitleAr : settings?.aboutMissionTitleEn) || t('aboutMissionTitle');
  const missionDesc = (isRtl ? settings?.aboutMissionDescAr : settings?.aboutMissionDescEn) || t('aboutMissionDesc');

  const val1Title = (isRtl ? settings?.aboutVal1TitleAr : settings?.aboutVal1TitleEn) || t('val1Title');
  const val1Desc = (isRtl ? settings?.aboutVal1DescAr : settings?.aboutVal1DescEn) || t('val1Desc');

  const val2Title = (isRtl ? settings?.aboutVal2TitleAr : settings?.aboutVal2TitleEn) || t('val2Title');
  const val2Desc = (isRtl ? settings?.aboutVal2DescAr : settings?.aboutVal2DescEn) || t('val2Desc');

  const val3Title = (isRtl ? settings?.aboutVal3TitleAr : settings?.aboutVal3TitleEn) || t('val3Title');
  const val3Desc = (isRtl ? settings?.aboutVal3DescAr : settings?.aboutVal3DescEn) || t('val3Desc');

  const aboutImage = settings?.aboutImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'الهوية والرسالة المؤسسية' : 'Corporate Identity & Vision'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>

      {/* 2. Executive Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block">
              {isRtl ? 'نبذة عن المنظومة' : 'Executive Overview'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9] leading-snug">
              {isRtl
                ? 'آر إم ستار: شريك استراتيجي في سلاسل إمداد الطاقة والخدمات المساندة'
                : 'RM STAR: Strategic Energy Supply Chains & Integrated Downstream Operations'}
            </h2>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              {overview1}
            </p>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              {overview2}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-[#E2C98A]">
                <CheckCircle className="w-4 h-4 text-[#C8A45D]" />
                <span>{isRtl ? 'إمدادات وقود موثوقة' : 'Certified Fuel Integrity'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#E2C98A]">
                <CheckCircle className="w-4 h-4 text-[#C8A45D]" />
                <span>{isRtl ? 'محطات نموذجية ذكية' : 'Model Retail Stations'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#E2C98A]">
                <CheckCircle className="w-4 h-4 text-[#C8A45D]" />
                <span>{isRtl ? 'حلول بيئية مستدامة' : 'HSE Compliance'}</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-sm overflow-hidden border border-[#242424]">
            <img
              src={aboutImage}
              alt="Corporate Headquarters & Energy Architecture"
              className="w-full h-[400px] object-cover filter brightness-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Cards */}
      <section className="bg-[#0E0E0E] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#141414] border border-[#242424] p-8 rounded-sm space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 flex items-center justify-center text-[#E2C98A]">
                <Eye className="w-6 h-6 text-[#C8A45D]" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F1E9]">
                {visionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                {visionDesc}
              </p>
            </div>

            <div className="bg-[#141414] border border-[#242424] p-8 rounded-sm space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 flex items-center justify-center text-[#E2C98A]">
                <Target className="w-6 h-6 text-[#C8A45D]" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F1E9]">
                {missionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
                {missionDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block mb-2">
            CORE PILLARS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9]">
            {t('aboutValuesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-3">
            <Award className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="text-base font-bold text-[#F4F1E9]">
              {val1Title}
            </h4>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              {val1Desc}
            </p>
          </div>

          <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-3">
            <Shield className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="text-base font-bold text-[#F4F1E9]">
              {val2Title}
            </h4>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              {val2Desc}
            </p>
          </div>

          <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-3">
            <Sparkles className="w-6 h-6 text-[#C8A45D]" />
            <h4 className="text-base font-bold text-[#F4F1E9]">
              {val3Title}
            </h4>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              {val3Desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
