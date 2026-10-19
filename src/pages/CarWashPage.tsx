import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CarWashBranch, CarWashService } from '../types';
import {
  Car,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Navigation,
  Sparkles,
  Shield,
  Droplets,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface CarWashPageProps {
  branches: CarWashBranch[];
  services: CarWashService[];
  setActiveTab: (tab: string) => void;
  settings?: import('../types').SiteSettings;
}

export const CarWashPage: React.FC<CarWashPageProps> = ({
  branches,
  services,
  setActiveTab,
  settings,
}) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const publishedBranches = branches.filter((b) => b.isPublished);
  const publishedServices = services.filter((s) => s.isPublished);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Car className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'مراكز العناية الفائقة والغسيل الآلي' : 'Precision Detailing & Automated Wash'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {(isRtl ? settings?.carWashPageTitleAr : settings?.carWashPageTitleEn) || t('carWashTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {(isRtl ? settings?.carWashPageSubtitleAr : settings?.carWashPageSubtitleEn) || t('carWashSubtitle')}
          </p>
        </div>
      </section>

      {/* 2. Service Packages Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block mb-2">
            PRECISION PACKAGES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1E9]">
            {isRtl ? 'باقات وحلول العناية المتطورة' : 'Vehicle Treatment & Protection Packages'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedServices.map((service, idx) => (
            <div
              key={service.id}
              className={`bg-[#121212] border rounded-sm overflow-hidden flex flex-col justify-between transition-all ${
                idx === 1
                  ? 'border-[#C8A45D] shadow-[0_0_25px_rgba(200,164,93,0.15)] relative'
                  : 'border-[#242424] hover:border-[#C8A45D]/60'
              }`}
            >
              {idx === 1 && (
                <div className="bg-[#C8A45D] text-[#080808] text-[10px] font-black uppercase tracking-widest py-1 text-center font-mono">
                  {isRtl ? 'الأكثر تميزاً وطلباً' : 'MOST POPULAR PACKAGE'}
                </div>
              )}

              {service.imageUrl && (
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={service.imageUrl}
                    alt={service.nameEn}
                    className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-[#1A1A1A] border border-[#333] text-[#E2C98A] rounded-sm flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C8A45D]" />
                      <span>{service.duration}</span>
                    </span>
                    {service.pricePlaceholder && (
                      <span className="text-xs text-[#A6A6A6]">{service.pricePlaceholder}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#F4F1E9] mb-2">
                    {isRtl ? service.nameAr : service.nameEn}
                  </h3>

                  <p className="text-xs text-[#8A8A8A] leading-relaxed mb-6">
                    {isRtl ? service.descriptionAr : service.descriptionEn}
                  </p>

                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A45D] block">
                      {isRtl ? 'مواصفات ومزايا الباقة:' : 'Package Features:'}
                    </span>
                    <ul className="space-y-2">
                      {(isRtl ? service.featuresAr : service.featuresEn).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#C8C8C8]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1C1C1C]">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-sm bg-[#1A1A1A] hover:bg-gradient-to-r hover:from-[#C8A45D] hover:to-[#E2C98A] text-[#F4F1E9] hover:text-[#080808] border border-[#2E2E2E] hover:border-transparent transition-all cursor-pointer"
                  >
                    {t('carWashPackageBtn')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tech & Eco Highlights */}
      <section className="bg-[#0E0E0E] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-[#141414] border border-[#222] rounded-sm">
              <Droplets className="w-8 h-8 text-[#C8A45D] mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'نظام إعادة تدوير المياه 85%' : '85% Water Recycling Technology'}
              </h4>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'محطات معالجة ثلاثية متقدمة تقلل استهلاك المياه وتلبي أدق اشتراطات الاستدامة البيئية.'
                  : 'Advanced multi-stage filtration recycling up to 85% of washing effluent responsibly.'}
              </p>
            </div>

            <div className="p-6 bg-[#141414] border border-[#222] rounded-sm">
              <Sparkles className="w-8 h-8 text-[#C8A45D] mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'شامبو وشمع حماية عضوي' : 'Bio-Degradable Luxury Formulas'}
              </h4>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'مركبات تنظيف أوروبية خالية من الأحماض القاسية لحماية طلاء السيارات الفاخرة وطبقات اللمعان.'
                  : 'Acid-free German engineered waxes safeguarding premium automotive clear coats.'}
              </p>
            </div>

            <div className="p-6 bg-[#141414] border border-[#222] rounded-sm">
              <Shield className="w-8 h-8 text-[#C8A45D] mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'ضمان جودة الخدمة' : 'Service Quality Guarantee'}
              </h4>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'فحص جودة دقيق بعد انتهاء كل عملية غسيل وتلميع لضمان رضا العميل التام.'
                  : 'Multi-point inspection post-detailing ensuring absolute customer satisfaction.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Branches Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-3 border-b border-[#1C1C1C]">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block mb-1">
            LOCATION DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1E9]">
            {t('carWashBranchesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedBranches.map((branch) => (
            <div
              key={branch.id}
              className="bg-[#121212] border border-[#222] rounded-sm overflow-hidden flex flex-col sm:flex-row group"
            >
              <div className="sm:w-1/2 h-52 sm:h-auto overflow-hidden">
                <img
                  src={branch.imageUrl}
                  alt={branch.nameEn}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isRtl ? branch.cityAr : branch.cityEn}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F4F1E9] mb-2">
                    {isRtl ? branch.nameAr : branch.nameEn}
                  </h3>
                  <p className="text-xs text-[#8A8A8A] mb-4">
                    {isRtl ? branch.addressAr : branch.addressEn}
                  </p>
                  <div className="space-y-1.5 text-xs text-[#A6A6A6]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>{isRtl ? branch.openingHoursAr : branch.openingHoursEn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <a href={`tel:${branch.contactPhone}`} className="hover:underline" dir="ltr">
                        {branch.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1C1C1C]">
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E2C98A] hover:text-[#C8A45D] transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{t('stationsDirections')}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Commercial Fleet Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] border border-[#262626] rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#F4F1E9]">
              {isRtl ? 'هل تدير أسطول شاحنات أو سيارات لشركتك؟' : 'Managing Commercial Fleets or Transport Rigs?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              {isRtl
                ? 'نوفر عقود غسيل وتعقيم دورية مخصصة للأساطيل بأسعار تنافسية وجداول تشغيل مسائية.'
                : 'Custom corporate fleet maintenance programs with prioritized bay lanes and tax invoicing.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('contact')}
            className="px-6 py-3 rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>{isRtl ? 'طلب عقد أساطيل' : 'Fleet Inquiry'}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </section>
    </div>
  );
};
