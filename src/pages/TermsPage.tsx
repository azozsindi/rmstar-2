import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-[#222] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A45D] mb-2">
          <FileText className="w-4 h-4" />
          <span>RM STAR COMMERCIAL TRADE PROVISIONS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#F4F1E9]">
          {t('footerTerms')}
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-2 font-mono">
          Last Updated: October 2026
        </p>
      </div>

      <div className="prose prose-invert text-xs sm:text-sm text-[#A6A6A6] space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '1. نطاق الاستخدام والعروض التجارية' : '1. Scope of Use & Commercial Inquiries'}
          </h3>
          <p>
            {isRtl
              ? 'إن استخدام هذا الموقع وتقديم طلبات عروض الأسعار يمثل طلباً استعلامياً أولياً لا يُلزم أياً من الطرفين بتوريد أو شراء حتى يتم توقيع عقد تجاري رسمي معتمد يتضمن المواصفات الفنية وجدول الدفعات.'
              : 'Submissions made through our quotation request forms represent commercial inquiries for preliminary calculation purposes and do not constitute a binding fuel supply commitment until a formal bilaterally executed trade agreement is finalized.'}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '2. مطابقة المنتجات واللوائح النظامية' : '2. Product Specifications & Regulatory Compliance'}
          </h3>
          <p>
            {isRtl
              ? 'تخضع كافة مبيعات الديزل والخدمات البترولية للأنظمة واللوائح والأسعار المعتمدة من الجهات التنظيمية المختصة في المملكة العربية السعودية.'
              : 'All fuel distribution, handling, and logistics operations strictly adhere to statutory petroleum industry regulations, health, safety, and metrological oversight authorities.'}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '3. حقوق الملكية الفكرية والعلامة التجارية' : '3. Proprietary Intellectual Property'}
          </h3>
          <p>
            {isRtl
              ? 'العلامة التجارية "RM STAR"، الشعار الهندسي، وكافة المواد النصية والتصاميم الواردة في هذا الموقع هي ملكية حصرية لشركة آر إم ستار ويحظر استخدامها دون إذن كتابي مسبق.'
              : 'The RM STAR trademark, geometric star emblem, and corporate design assets are protected proprietary intellectual property.'}
          </p>
        </section>
      </div>
    </div>
  );
};
