import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-[#222] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A45D] mb-2">
          <Shield className="w-4 h-4" />
          <span>RM STAR CORPORATE GOVERNANCE</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#F4F1E9]">
          {t('footerPrivacy')}
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-2 font-mono">
          Last Updated: October 2026
        </p>
      </div>

      <div className="prose prose-invert text-xs sm:text-sm text-[#A6A6A6] space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '1. الالتزام بالخصوصية وحماية البيانات' : '1. Commitment to Privacy & Confidentiality'}
          </h3>
          <p>
            {isRtl
              ? 'تلتزم شركة آر إم ستار بحماية خصوصية كافة زوار موقعها وشركائها التجاريين والعملاء المؤسسيين الذين يقدمون طلبات عروض أسعار توريد الديزل أو الاستفسارات العامة. لا نقوم بمشاركة أو بيع أية بيانات تجارية أو اتصال لأطراف خارجية غير مصرح لها.'
              : 'RM STAR is firmly committed to safeguarding the privacy and confidentiality of institutional clients, suppliers, and website visitors. All quotation requests and corporate correspondence are treated as proprietary business records.'}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '2. البيانات التي يتم جمعها' : '2. Categories of Information Collected'}
          </h3>
          <p>
            {isRtl
              ? 'يقتصر جمع البيانات على المعلومات اللازمة لتقديم عروض الأسعار التجارية وتوثيق عقود التوريد، بما في ذلك: الاسم، اسم المنشأة، البريد الإلكتروني للعمل، رقم الهاتف، والكميات المطلوبة.'
              : 'Data collected via our digital portal is strictly limited to authorized representative contact details, enterprise registration identifiers, delivery destination coordinates, and fuel volume requirements.'}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#F4F1E9]">
            {isRtl ? '3. أمن وحماية المعلومات' : '3. Security Controls & Data Protection'}
          </h3>
          <p>
            {isRtl
              ? 'تُخزن كافة السجلات والطلبات في بيئة سحابية آمنة ومشفرة عبر قواعد بيانات محمية بقواعد صارمة تمنع الوصول غير المصرح به.'
              : 'All commercial submissions and inquiries are processed in an encrypted database architecture enforcing zero-trust access controls and hardened server-side authorization.'}
          </p>
        </section>
      </div>
    </div>
  );
};
