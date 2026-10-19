/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { HomePage } from './pages/HomePage';
import { DieselSupplyPage } from './pages/DieselSupplyPage';
import { FuelStationsPage } from './pages/FuelStationsPage';
import { CarWashPage } from './pages/CarWashPage';
import { AboutPage } from './pages/AboutPage';
import { PartnersPage } from './pages/PartnersPage';
import { NewsPage } from './pages/NewsPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { QuotationForm } from './components/forms/QuotationForm';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLoginModal } from './pages/admin/AdminLoginModal';
import { MessageCircle } from 'lucide-react';
import {
  SiteSettings,
  FuelStation,
  CarWashBranch,
  CarWashService,
  Partner,
  NewsArticle,
  CareerPosting,
  QuotationRequest,
  ContactMessage,
} from './types';
import {
  getSiteSettings,
  getStations,
  getCarWashBranches,
  getCarWashServices,
  getPartners,
  getNewsArticles,
  getCareers,
  getQuotationRequests,
  getContactMessages,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_STATIONS,
  DEFAULT_BRANCHES,
  DEFAULT_SERVICES,
  DEFAULT_PARTNERS,
  DEFAULT_NEWS,
  DEFAULT_CAREERS,
} from './services/db';
import { testConnection } from './firebase/config';

const MainContent: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Corporate data states
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [stations, setStations] = useState<FuelStation[]>(DEFAULT_STATIONS);
  const [branches, setBranches] = useState<CarWashBranch[]>(DEFAULT_BRANCHES);
  const [services, setServices] = useState<CarWashService[]>(DEFAULT_SERVICES);
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [news, setNews] = useState<NewsArticle[]>(DEFAULT_NEWS);
  const [careers, setCareers] = useState<CareerPosting[]>(DEFAULT_CAREERS);
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load and sync from Firestore & localStorage
  useEffect(() => {
    async function loadData() {
      // 1. Connection check
      testConnection();

      // 2. Fetch datasets
      try {
        const s = await getSiteSettings();
        if (s) setSettings(s);
      } catch {
        // use fallback
      }

      try {
        const st = await getStations();
        if (st && st.length) setStations(st);
      } catch {
        // use fallback
      }

      try {
        const br = await getCarWashBranches();
        if (br && br.length) setBranches(br);
      } catch {
        // use fallback
      }

      try {
        const sv = await getCarWashServices();
        if (sv && sv.length) setServices(sv);
      } catch {
        // use fallback
      }

      try {
        const pr = await getPartners();
        if (pr && pr.length) setPartners(pr);
      } catch {
        // use fallback
      }

      try {
        const nw = await getNewsArticles();
        if (nw && nw.length) setNews(nw);
      } catch {
        // use fallback
      }

      try {
        const cr = await getCareers();
        if (cr && cr.length) setCareers(cr);
      } catch {
        // use fallback
      }

      try {
        const qr = await getQuotationRequests();
        setQuotations(qr);
      } catch {
        // ignore
      }

      try {
        const ms = await getContactMessages();
        setMessages(ms);
      } catch {
        // ignore
      }
    }

    loadData();
  }, []);

  // Listen to URL hash for #adminrm access (e.g. https://www.rmstar.online#adminrm)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#adminrm' || hash === '#/adminrm') {
        if (isAdmin) {
          setActiveTab('admin');
        } else {
          setIsAdminModalOpen(true);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Optional keyboard shortcut: Alt + A or Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        window.location.hash = 'adminrm';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdmin]);

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    const hash = window.location.hash.toLowerCase();
    if (hash === '#adminrm' || hash === '#/adminrm') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminModalOpen(false);
    setActiveTab('admin');
  };

  const handleCloseAdminDashboard = () => {
    setActiveTab('home');
    const hash = window.location.hash.toLowerCase();
    if (hash === '#adminrm' || hash === '#/adminrm') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // If in admin mode and user is authorized, display the full admin CMS
  if (activeTab === 'admin' && isAdmin) {
    return (
      <AdminDashboard
        settings={settings}
        setSettings={setSettings}
        stations={stations}
        setStations={setStations}
        branches={branches}
        setBranches={setBranches}
        services={services}
        setServices={setServices}
        partners={partners}
        setPartners={setPartners}
        news={news}
        setNews={setNews}
        careers={careers}
        setCareers={setCareers}
        quotations={quotations}
        setQuotations={setQuotations}
        messages={messages}
        setMessages={setMessages}
        onClose={handleCloseAdminDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F1E9] flex flex-col selection:bg-[#C8A45D]/30 selection:text-[#E2C98A]">
      {/* Top Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* Main Luxury Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            stations={stations}
            services={services}
            partners={partners}
            news={news}
            settings={settings}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'diesel' && <DieselSupplyPage settings={settings} />}

        {activeTab === 'stations' && (
          <FuelStationsPage stations={stations} setActiveTab={setActiveTab} settings={settings} />
        )}

        {activeTab === 'carwash' && (
          <CarWashPage
            branches={branches}
            services={services}
            setActiveTab={setActiveTab}
            settings={settings}
          />
        )}

        {activeTab === 'about' && <AboutPage settings={settings} />}

        {activeTab === 'partners' && (
          <PartnersPage partners={partners} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'news' && <NewsPage news={news} />}

        {activeTab === 'careers' && <CareersPage careers={careers} settings={settings} />}

        {activeTab === 'contact' && <ContactPage settings={settings} />}

        {activeTab === 'quote' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D]">
                COMMERCIAL PROCUREMENT
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F4F1E9]">
                {t('quoteFormTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-xl mx-auto">
                {t('quoteFormSubtitle')}
              </p>
            </div>
            <QuotationForm />
          </div>
        )}

        {activeTab === 'privacy' && <PrivacyPolicyPage settings={settings} />}

        {activeTab === 'terms' && <TermsPage settings={settings} />}
      </main>

      {/* Corporate Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Login Dialog - Access via https://www.rmstar.online#adminrm */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Floating Instant WhatsApp Channel */}
      <a
        href={`https://wa.me/${
          settings.officialWhatsApp.replace(/[^0-9]/g, '').startsWith('05')
            ? '966' + settings.officialWhatsApp.replace(/[^0-9]/g, '').substring(1)
            : settings.officialWhatsApp.replace(/[^0-9]/g, '')
        }?text=${encodeURIComponent(
          'السلام عليكم، أود الاستفسار عن طلب وتوريد كميات وقود ديزل تجاري من شركة آر إم ستار.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Fuel Support"
        className="fixed bottom-6 end-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.7)] transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold px-0 group-hover:px-2">
          {t('contactWhatsAppBtn')}
        </span>
      </a>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
