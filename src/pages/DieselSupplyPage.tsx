import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { QuotationForm } from '../components/forms/QuotationForm';
import {
  Fuel,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Clock,
  Layers,
  ArrowDown,
} from 'lucide-react';

export const DieselSupplyPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const scrollToQuote = () => {
    const el = document.getElementById('quotation-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Fuel className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'قطاع الطاقة وتجارة الديزل بالجملة' : 'Wholesale Energy & Commercial Diesel Trade'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {t('dieselPageTitle')}
          </h1>

          <p className="text-sm sm:text-lg text-[#A6A6A6] max-w-3xl mx-auto leading-relaxed">
            {t('dieselPageSubtitle')}
          </p>

          <div className="pt-4">
            <button
              onClick={scrollToQuote}
              className="px-6 py-3 rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all inline-flex items-center gap-2"
            >
              <span>{t('navQuoteBtn')}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Products & Specifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block">
              {isRtl ? 'المواصفات الفنية والجودة' : 'Technical Specifications & Grades'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1E9]">
              {t('dieselSpecsTitle')}
            </h2>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              {t('dieselSpecsDesc')}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222] rounded-sm">
                <FileCheck2 className="w-5 h-5 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#F4F1E9]">
                    {isRtl ? 'ديزل فائق انخفاض الكبريت (Euro 5 - 10 PPM)' : 'Ultra-Low Sulfur Diesel (Euro 5 - 10 PPM)'}
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mt-1">
                    {isRtl
                      ? 'يحتوي على أقل من 10 أجزاء في المليون من الكبريت، مما يطيل عمر محركات الأساطيل ويقلل الانبعاثات الكربونية.'
                      : 'Compliant with Euro 5 benchmarks (<10 ppm sulfur), enhancing engine longevity and reducing emissions.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222] rounded-sm">
                <Layers className="w-5 h-5 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#F4F1E9]">
                    {isRtl ? 'شهادات الفحص المخبري لكل دفعة توريد' : 'Certified Batch Laboratory Reports'}
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mt-1">
                    {isRtl
                      ? 'نوفر شهادة فحص واختبار مخبري معتمدة مع كل شحنة توضح الكثافة ودرجة الوميض والرقم السيتاني لضمان الشفافية المطلقة.'
                      : 'Each delivery is accompanied by official laboratory inspection data for flash point, density, and cetane number.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#121212] border border-[#222] rounded-sm">
                <Clock className="w-5 h-5 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#F4F1E9]">
                    {isRtl ? 'إمدادات مرنة وجداول تسليم مبرمجة' : 'Flexible Scheduled Delivery Windows'}
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mt-1">
                    {isRtl
                      ? 'إمكانية الجدولة الأسبوعية أو الشهرية مع دعم التوريد الطارئ على مدار 24 ساعة للمنشآت الحيوية والمصانع.'
                      : 'Weekly or monthly supply schedules with 24/7 emergency dispatch capability for uninterrupted production.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-sm overflow-hidden border border-[#262626]">
            <img
              src="https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=1200&q=80"
              alt="Diesel Supply Infrastructure"
              className="w-full h-[450px] object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
            <div className="absolute bottom-6 start-6 end-6 p-4 bg-[#121212]/90 backdrop-blur-sm border border-[#C8A45D]/40 rounded-sm">
              <span className="text-xs font-bold text-[#E2C98A] block mb-1">
                {isRtl ? 'معايير الفحص والامتثال' : 'Compliance & Quality Standard'}
              </span>
              <p className="text-[11px] text-[#A6A6A6]">
                {isRtl
                  ? 'تخضع جميع إمدادات آر إم ستار لرقابة دورية ومعايرة إلكترونية للعدادات تضمن دقة كل لتر يتم تفريغه.'
                  : 'All RM STAR deliveries adhere to rigorous metering calibration and metrological accuracy guarantees.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Transport Fleet & Logistics Capabilities */}
      <section className="bg-[#0E0E0E] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block mb-2">
              LOGISTICS INFRASTRUCTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F1E9]">
              {t('dieselFleetTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-2 leading-relaxed">
              {t('dieselFleetDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141414] border border-[#222] p-6 rounded-sm">
              <Truck className="w-8 h-8 text-[#C8A45D] mb-4" />
              <h3 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'أسطول صهاريج متطور' : 'Modern Tanker Units'}
              </h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'صهاريج بسعات متعددة تبدأ من 12,000 لتر إلى 36,000 لتر مزودة بمضخات تفريغ هيدروليكية ذات تدفق عالي لتسريع عملية التفريغ.'
                  : 'Multi-capacity tanker fleets ranging from 12k to 36k liters equipped with high-output discharge pumps.'}
              </p>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-sm">
              <ShieldCheck className="w-8 h-8 text-[#C8A45D] mb-4" />
              <h3 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'أنظمة تتبع وتأمين رقمي' : 'Real-Time Telemetry & Seals'}
              </h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'تتبع حي لمسار الشحنات عبر الأقمار الصناعية، مع أختام إلكترونية لضمان عدم التلاعب بجودة أو كمية المنتج أثناء النقل.'
                  : 'Live GPS corridor tracking and tamper-evident electronic seals protecting product purity from terminal to client.'}
              </p>
            </div>

            <div className="bg-[#141414] border border-[#222] p-6 rounded-sm">
              <CheckCircle2 className="w-8 h-8 text-[#C8A45D] mb-4" />
              <h3 className="text-base font-bold text-[#F4F1E9] mb-2">
                {isRtl ? 'سائقون مدربون على السلامة HSE' : 'HSE Certified Operators'}
              </h3>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {isRtl
                  ? 'كوادر قيادة معتمدة وحاصلة على دورات التعامل مع المواد البترولية الخطرة وإجراءات التفريغ الآمن في المواقع الحساسة.'
                  : 'Certified drivers trained in hazardous material handling, static grounding, and emergency site discharge protocols.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Request a Quotation Form Section */}
      <section id="quotation-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] block mb-1">
            COMMERCIAL INQUIRY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9]">
            {t('quoteFormTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A8A] mt-2">
            {t('quoteFormSubtitle')}
          </p>
        </div>

        <QuotationForm />
      </section>
    </div>
  );
};
