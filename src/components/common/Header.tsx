import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from './Logo';
import { Globe, Menu, X, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAdmin }) => {
  const { locale, toggleLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'diesel', label: t('navDiesel') },
    { id: 'stations', label: t('navStations') },
    { id: 'carwash', label: t('navCarWash') },
    { id: 'about', label: t('navAbout') },
    { id: 'partners', label: t('navPartners') },
    { id: 'news', label: t('navNews') },
    { id: 'contact', label: t('navContact') },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => handleNavClick('home')}
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs xl:text-sm font-medium rounded-sm transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#E2C98A]'
                      : 'text-[#A6A6A6] hover:text-[#F4F1E9] hover:bg-[#151515]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#C8A45D] rounded-full shadow-[0_0_8px_#C8A45D]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Lang Switcher, Admin Button, Quote CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border border-[#262626] text-[#F4F1E9] hover:border-[#C8A45D] hover:text-[#E2C98A] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Admin Portal Gateway */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#A6A6A6] hover:text-[#E2C98A] hover:bg-[#151515] rounded-sm transition-colors"
              title={t('navAdmin')}
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Request Quotation Primary CTA */}
            <button
              onClick={() => handleNavClick('quote')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] hover:shadow-[0_0_15px_rgba(200,164,93,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t('navQuoteBtn')}</span>
              {locale === 'ar' ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="p-1.5 text-xs border border-[#262626] rounded-sm text-[#E2C98A]"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F4F1E9] hover:bg-[#151515] rounded-sm focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#C8A45D]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#1C1C1C] bg-[#0E0E0E] px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-start px-3 py-2.5 text-sm font-medium rounded-sm ${
                activeTab === item.id
                  ? 'bg-[#1C1C1C] text-[#E2C98A] border-r-2 rtl:border-r-2 ltr:border-l-2 border-[#C8A45D]'
                  : 'text-[#A6A6A6] hover:text-[#F4F1E9] hover:bg-[#141414]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-[#222] flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('quote')}
              className="w-full py-2.5 text-center text-sm font-semibold rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808]"
            >
              {t('navQuoteBtn')}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#A6A6A6] hover:text-[#E2C98A] border border-[#222] rounded-sm"
            >
              <Shield className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>{t('navAdmin')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
