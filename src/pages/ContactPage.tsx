import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettings } from '../types';
import { ContactForm } from '../components/forms/ContactForm';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const cleanWhatsApp = settings.officialWhatsApp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-20 pb-20">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'قنوات التواصل المباشر' : 'Direct Corporate Channels'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {t('contactTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {t('contactSubtitle')}
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Official Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-6">
              <h3 className="text-base font-bold text-[#F4F1E9] border-b border-[#222] pb-3">
                {isRtl ? 'معلومات الإدارة العامة' : 'Corporate Headquarters Details'}
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4F1E9] block mb-0.5">
                      {t('contactInfoHq')}
                    </span>
                    <span className="text-[#8A8A8A] leading-relaxed">
                      {isRtl ? settings.headquartersAr : settings.headquartersEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4F1E9] block mb-0.5">
                      {t('contactInfoEmail')}
                    </span>
                    <a
                      href={`mailto:${settings.officialEmail}`}
                      className="text-[#E2C98A] hover:underline"
                    >
                      {settings.officialEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4F1E9] block mb-0.5">
                      {t('contactInfoPhone')}
                    </span>
                    <a
                      href={`tel:${settings.officialPhone}`}
                      className="text-[#E2C98A] hover:underline"
                      dir="ltr"
                    >
                      {settings.officialPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F4F1E9] block mb-0.5">
                      {isRtl ? 'ساعات العمل الرسمية:' : 'Corporate Working Hours:'}
                    </span>
                    <span className="text-[#8A8A8A]">
                      {isRtl
                        ? 'الأحد — الخميس: 8:00 صباحاً – 5:00 مساءً'
                        : 'Sunday – Thursday: 8:00 AM – 5:00 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-sm bg-[#18321d] hover:bg-[#1e3f24] border border-[#2e6d3a] text-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('contactWhatsAppBtn')}</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#101010] border border-[#222] rounded-sm flex items-center gap-3 text-xs text-[#8A8A8A]">
              <ShieldCheck className="w-5 h-5 text-[#C8A45D] flex-shrink-0" />
              <span>
                {t('footerCr')} {settings.commercialRegistration}
              </span>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};
