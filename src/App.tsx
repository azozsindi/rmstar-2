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
import {
  SiteSettings,
  FuelStation,
  CarWashBranch,
  CarWashService,
  Partner,
  NewsArticle,
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
  getQuotationRequests,
  getContactMessages,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_STATIONS,
  DEFAULT_BRANCHES,
  DEFAULT_SERVICES,
  DEFAULT_PARTNERS,
  DEFAULT_NEWS,
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
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Load and sync from Firestore
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

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminModalOpen(false);
    setActiveTab('admin');
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
        quotations={quotations}
        setQuotations={setQuotations}
        messages={messages}
        setMessages={setMessages}
        onClose={() => setActiveTab('home')}
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

        {activeTab === 'diesel' && <DieselSupplyPage />}

        {activeTab === 'stations' && (
          <FuelStationsPage stations={stations} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'carwash' && (
          <CarWashPage
            branches={branches}
            services={services}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'partners' && (
          <PartnersPage partners={partners} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'news' && <NewsPage news={news} />}

        {activeTab === 'careers' && <CareersPage />}

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

        {activeTab === 'privacy' && <PrivacyPolicyPage />}

        {activeTab === 'terms' && <TermsPage />}
      </main>

      {/* Corporate Footer */}
      <Footer
        settings={settings}
        setActiveTab={setActiveTab}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
