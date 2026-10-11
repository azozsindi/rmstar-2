import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from './Logo';
import { SiteSettings } from '../../types';
import { Mail, Phone, MapPin, ShieldCheck, FileText, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActiveTab, onOpenAdmin }) => {
  const { locale, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    scrollToTop();
  };

  return (
    <footer className="bg-[#050505] border-t border-[#1C1C1C] text-[#A6A6A6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A1A1A]">
          {/* Brand & Corporate Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => handleNav('home')}>
              <Logo size="md" />
            </div>
            <p className="text-sm leading-relaxed text-[#A6A6A6] max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#E2C98A]">
              <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
              <span>{t('footerCr')} {settings.commercialRegistration || '1010884920'}</span>
            </div>
          </div>

          {/* Business Sectors */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F4F1E9] border-b border-[#222] pb-2">
              {t('footerSectors')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('diesel')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navDiesel')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('stations')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navStations')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('carwash')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navCarWash')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('quote')}
                  className="hover:text-[#E2C98A] transition-colors text-[#C8A45D]"
                >
                  {t('navQuoteBtn')}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F4F1E9] border-b border-[#222] pb-2">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('partners')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navPartners')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('news')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navNews')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('careers')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navCareers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {t('navContact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Headquarters */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F4F1E9] border-b border-[#222] pb-2">
              {t('contactInfoHq')}
            </h4>
            <div className="space-y-2.5 text-xs text-[#8A8A8A]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#C8A45D] flex-shrink-0" />
                <span>
                  {locale === 'ar' ? settings.headquartersAr : settings.headquartersEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8A45D] flex-shrink-0" />
                <a
                  href={`mailto:${settings.officialEmail}`}
                  className="hover:text-[#E2C98A] transition-colors"
                >
                  {settings.officialEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8A45D] flex-shrink-0" />
                <a
                  href={`tel:${settings.officialPhone}`}
                  className="hover:text-[#E2C98A] transition-colors"
                  dir="ltr"
                >
                  {settings.officialPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Policies & Admin Entry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-center sm:text-start">
            <p>
              {t('footerRights')} {new Date().getFullYear()} — {locale === 'ar' ? settings.companyNameAr : settings.companyNameEn}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-[#E2C98A] transition-colors"
            >
              {t('footerPrivacy')}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-[#E2C98A] transition-colors"
            >
              {t('footerTerms')}
            </button>
            <span>&bull;</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[#666] hover:text-[#C8A45D] transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>CMS</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-sm bg-[#151515] hover:bg-[#222] text-[#E2C98A] transition-colors"
              title="Back to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
