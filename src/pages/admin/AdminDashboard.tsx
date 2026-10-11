import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  FuelStation,
  CarWashBranch,
  CarWashService,
  Partner,
  NewsArticle,
  QuotationRequest,
  ContactMessage,
  SiteSettings,
} from '../../types';
import {
  saveSiteSettings,
  saveStation,
  removeStation,
  saveCarWashBranch,
  removeCarWashBranch,
  saveCarWashService,
  removeCarWashService,
  savePartner,
  removePartner,
  saveNewsArticle,
  removeNewsArticle,
  updateQuotationStatus,
  updateContactMessageStatus,
  seedInitialFirestoreData,
} from '../../services/db';
import { testConnection } from '../../firebase/config';
import {
  LayoutDashboard,
  Fuel,
  Car,
  Layers,
  Handshake,
  Newspaper,
  Mail,
  FileSpreadsheet,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Database,
  RefreshCw,
  AlertCircle,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardProps {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
  stations: FuelStation[];
  setStations: React.Dispatch<React.SetStateAction<FuelStation[]>>;
  branches: CarWashBranch[];
  setBranches: React.Dispatch<React.SetStateAction<CarWashBranch[]>>;
  services: CarWashService[];
  setServices: React.Dispatch<React.SetStateAction<CarWashService[]>>;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  quotations: QuotationRequest[];
  setQuotations: React.Dispatch<React.SetStateAction<QuotationRequest[]>>;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  setSettings,
  stations,
  setStations,
  branches,
  setBranches,
  services,
  setServices,
  partners,
  setPartners,
  news,
  setNews,
  quotations,
  setQuotations,
  messages,
  setMessages,
  onClose,
}) => {
  const { locale, t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const isRtl = locale === 'ar';

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'quotes' | 'messages' | 'stations' | 'branches' | 'services' | 'partners' | 'news' | 'settings' | 'system'
  >('overview');

  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [dbStatus, setDbStatus] = useState<string>('Connected & Ready');
  const [testingConnection, setTestingConnection] = useState(false);

  const showFeedback = (text: string, isError = false) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Metrics
  const pendingQuotes = quotations.filter((q) => q.status === 'pending').length;
  const newMessages = messages.filter((m) => m.status === 'new').length;
  const publishedStationsCount = stations.filter((s) => s.isPublished).length;
  const publishedBranchesCount = branches.filter((b) => b.isPublished).length;
  const publishedPartnersCount = partners.filter((p) => p.isPublished).length;

  // ----------------- Stations State & Handlers -----------------
  const [editingStation, setEditingStation] = useState<Partial<FuelStation> | null>(null);

  const handleSaveStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation?.nameAr || !editingStation?.cityAr) return;

    const id = editingStation.id || `station-${Date.now()}`;
    const stationToSave: FuelStation = {
      id,
      nameAr: editingStation.nameAr,
      nameEn: editingStation.nameEn || editingStation.nameAr,
      cityAr: editingStation.cityAr,
      cityEn: editingStation.cityEn || editingStation.cityAr,
      addressAr: editingStation.addressAr || '',
      addressEn: editingStation.addressEn || '',
      services: editingStation.services || ['ديزل عالي السرعة', 'وقود 91 و 95'],
      openingHoursAr: editingStation.openingHoursAr || '24/7',
      openingHoursEn: editingStation.openingHoursEn || '24/7',
      contactPhone: editingStation.contactPhone || '+966 11 000 0000',
      mapUrl: editingStation.mapUrl || 'https://maps.google.com',
      imageUrl: editingStation.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
      isPublished: editingStation.isPublished ?? true,
      createdAt: editingStation.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveStation(stationToSave);
      setStations((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        return idx >= 0 ? prev.map((s) => (s.id === id ? stationToSave : s)) : [stationToSave, ...prev];
      });
      setEditingStation(null);
      showFeedback('Fuel Station record updated successfully in Firestore.');
    } catch {
      showFeedback('Error saving station record.', true);
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this station?')) return;
    try {
      await removeStation(id);
      setStations((prev) => prev.filter((s) => s.id !== id));
      showFeedback('Station removed successfully.');
    } catch {
      showFeedback('Error deleting station.', true);
    }
  };

  // ----------------- Branches Handlers -----------------
  const [editingBranch, setEditingBranch] = useState<Partial<CarWashBranch> | null>(null);

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch?.nameAr || !editingBranch?.cityAr) return;

    const id = editingBranch.id || `branch-${Date.now()}`;
    const branchToSave: CarWashBranch = {
      id,
      nameAr: editingBranch.nameAr,
      nameEn: editingBranch.nameEn || editingBranch.nameAr,
      cityAr: editingBranch.cityAr,
      cityEn: editingBranch.cityEn || editingBranch.cityAr,
      addressAr: editingBranch.addressAr || '',
      addressEn: editingBranch.addressEn || '',
      openingHoursAr: editingBranch.openingHoursAr || '8:00 AM – 12:00 Midnight',
      openingHoursEn: editingBranch.openingHoursEn || '8:00 AM – 12:00 Midnight',
      contactPhone: editingBranch.contactPhone || '+966 11 000 0000',
      mapUrl: editingBranch.mapUrl || 'https://maps.google.com',
      imageUrl: editingBranch.imageUrl || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
      isPublished: editingBranch.isPublished ?? true,
      createdAt: editingBranch.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCarWashBranch(branchToSave);
      setBranches((prev) => {
        const idx = prev.findIndex((b) => b.id === id);
        return idx >= 0 ? prev.map((b) => (b.id === id ? branchToSave : b)) : [branchToSave, ...prev];
      });
      setEditingBranch(null);
      showFeedback('Car wash branch saved successfully.');
    } catch {
      showFeedback('Error saving branch.', true);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await removeCarWashBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
      showFeedback('Branch deleted successfully.');
    } catch {
      showFeedback('Error deleting branch.', true);
    }
  };

  // ----------------- Services Handlers -----------------
  const [editingService, setEditingService] = useState<Partial<CarWashService> | null>(null);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.nameAr) return;

    const id = editingService.id || `srv-${Date.now()}`;
    const srvToSave: CarWashService = {
      id,
      nameAr: editingService.nameAr,
      nameEn: editingService.nameEn || editingService.nameAr,
      descriptionAr: editingService.descriptionAr || '',
      descriptionEn: editingService.descriptionEn || '',
      duration: editingService.duration || '15 mins',
      pricePlaceholder: editingService.pricePlaceholder || 'Contact for quote',
      featuresAr: editingService.featuresAr || ['تنظيف شامل', 'حماية طلاء'],
      featuresEn: editingService.featuresEn || ['Complete cleaning', 'Paint protection'],
      imageUrl: editingService.imageUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
      isPublished: editingService.isPublished ?? true,
      sortOrder: editingService.sortOrder ?? (services.length + 1),
    };

    try {
      await saveCarWashService(srvToSave);
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        return idx >= 0 ? prev.map((s) => (s.id === id ? srvToSave : s)) : [...prev, srvToSave];
      });
      setEditingService(null);
      showFeedback('Service package saved successfully.');
    } catch {
      showFeedback('Error saving service.', true);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await removeCarWashService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showFeedback('Service removed.');
    } catch {
      showFeedback('Error deleting service.', true);
    }
  };

  // ----------------- Partners Handlers -----------------
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner?.nameAr) return;

    const id = editingPartner.id || `partner-${Date.now()}`;
    const pToSave: Partner = {
      id,
      nameAr: editingPartner.nameAr,
      nameEn: editingPartner.nameEn || editingPartner.nameAr,
      logoUrl: editingPartner.logoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      websiteUrl: editingPartner.websiteUrl || 'https://rmstar.com',
      categoryAr: editingPartner.categoryAr || 'شريك استراتيجي',
      categoryEn: editingPartner.categoryEn || 'Strategic Partner',
      displayOrder: editingPartner.displayOrder ?? (partners.length + 1),
      isPublished: editingPartner.isPublished ?? true,
      createdAt: editingPartner.createdAt || new Date().toISOString(),
    };

    try {
      await savePartner(pToSave);
      setPartners((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        return idx >= 0 ? prev.map((p) => (p.id === id ? pToSave : p)) : [...prev, pToSave];
      });
      setEditingPartner(null);
      showFeedback('Partner record updated in Firestore.');
    } catch {
      showFeedback('Error saving partner.', true);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      await removePartner(id);
      setPartners((prev) => prev.filter((p) => p.id !== id));
      showFeedback('Partner deleted.');
    } catch {
      showFeedback('Error deleting partner.', true);
    }
  };

  // ----------------- News Handlers -----------------
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null);

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.titleAr) return;

    const id = editingNews.id || `news-${Date.now()}`;
    const nToSave: NewsArticle = {
      id,
      titleAr: editingNews.titleAr,
      titleEn: editingNews.titleEn || editingNews.titleAr,
      summaryAr: editingNews.summaryAr || '',
      summaryEn: editingNews.summaryEn || '',
      contentAr: editingNews.contentAr || editingNews.summaryAr || '',
      contentEn: editingNews.contentEn || editingNews.summaryEn || '',
      imageUrl: editingNews.imageUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      publishedDate: editingNews.publishedDate || new Date().toISOString().split('T')[0],
      category: editingNews.category || 'توسعات',
      isPublished: editingNews.isPublished ?? true,
      createdAt: editingNews.createdAt || new Date().toISOString(),
    };

    try {
      await saveNewsArticle(nToSave);
      setNews((prev) => {
        const idx = prev.findIndex((n) => n.id === id);
        return idx >= 0 ? prev.map((n) => (n.id === id ? nToSave : n)) : [nToSave, ...prev];
      });
      setEditingNews(null);
      showFeedback('News release published successfully.');
    } catch {
      showFeedback('Error saving news article.', true);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await removeNewsArticle(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      showFeedback('Article deleted.');
    } catch {
      showFeedback('Error deleting article.', true);
    }
  };

  // ----------------- Settings Handlers -----------------
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSiteSettings(tempSettings);
      setSettings(tempSettings);
      showFeedback('Company Site Settings successfully updated in Cloud Firestore.');
    } catch {
      showFeedback('Error saving site settings.', true);
    }
  };

  // ----------------- Seeder & Diagnostics -----------------
  const handleSeedData = async () => {
    if (!confirm('This will populate Cloud Firestore with default corporate RM STAR datasets (stations, branches, services, partners, news, settings). Continue?')) return;
    const res = await seedInitialFirestoreData();
    if (res.success) {
      showFeedback(res.message);
    } else {
      showFeedback(res.message, true);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const ok = await testConnection();
    setDbStatus(ok ? 'Direct Cloud Firestore Link Active' : 'Offline / Restricted Rules');
    setTestingConnection(false);
  };

  const handleStatusChangeQuote = async (id: string, status: QuotationRequest['status']) => {
    await updateQuotationStatus(id, status);
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    showFeedback(`Quotation request updated to ${status}.`);
  };

  const handleStatusChangeMsg = async (id: string, status: ContactMessage['status']) => {
    await updateContactMessageStatus(id, status);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    showFeedback(`Contact message updated to ${status}.`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F1E9] flex flex-col">
      {/* Top Admin Navbar */}
      <div className="bg-[#101010] border-b border-[#202020] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#181818] border border-[#C8A45D]/40 text-[#E2C98A] rounded-sm">
            <LayoutDashboard className="w-5 h-5 text-[#C8A45D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#F4F1E9]">{t('adminTitle')}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#1A1A1A] border border-[#333] text-[#E2C98A]">
                SUPERADMIN
              </span>
            </div>
            <span className="text-xs text-[#8A8A8A] block">
              {currentUser?.email || 'AzozSindi23@gmail.com'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-sm bg-[#181818] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#F4F1E9] transition-colors"
          >
            {isRtl ? 'العودة للموقع العام' : 'Exit to Public Site'}
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-xs font-semibold text-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('adminLogout')}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between ${
            feedback.isError ? 'bg-red-950/80 border-b border-red-800 text-red-200' : 'bg-emerald-950/80 border-b border-emerald-800 text-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0D0D0D] border-b md:border-b-0 md:border-e border-[#1C1C1C] p-4 flex-shrink-0 space-y-1">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'overview' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabOverview')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('quotes')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'quotes' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-4 h-4 text-[#C8A45D]" />
              <span>{t('adminTabQuotes')}</span>
            </div>
            {pendingQuotes > 0 && (
              <span className="px-1.5 py-0.2 bg-[#C8A45D] text-[#080808] font-mono text-[10px] rounded-full font-bold">
                {pendingQuotes}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('messages')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'messages' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#C8A45D]" />
              <span>{t('adminTabMessages')}</span>
            </div>
            {newMessages > 0 && (
              <span className="px-1.5 py-0.2 bg-[#E2C98A] text-[#080808] font-mono text-[10px] rounded-full font-bold">
                {newMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('stations')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'stations' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Fuel className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabStations')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('branches')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'branches' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Car className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabBranches')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('services')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'services' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabServices')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('partners')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'partners' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Handshake className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabPartners')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('news')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'news' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Newspaper className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabNews')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'settings' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabSettings')}</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('system')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-sm transition-colors text-start ${
              activeAdminTab === 'system' ? 'bg-[#1C1C1C] text-[#E2C98A] border-s-2 border-[#C8A45D]' : 'text-[#8A8A8A] hover:text-[#F4F1E9] hover:bg-[#141414]'
            }`}
          >
            <Database className="w-4 h-4 text-[#C8A45D]" />
            <span>{t('adminTabSystem')}</span>
          </button>
        </aside>

        {/* Tab Content Display Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-[#F4F1E9] mb-1">{t('adminTabOverview')}</h2>
                <p className="text-xs text-[#8A8A8A]">
                  {isRtl
                    ? 'لوحة المؤشرات التشغيلية والطلبات التجارية الواردة'
                    : 'Real-time operational indicators and inbound commercial inquiries'}
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#121212] border border-[#222] p-5 rounded-sm">
                  <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-2">
                    <span>{t('adminTabQuotes')}</span>
                    <FileSpreadsheet className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F4F1E9]">{quotations.length}</div>
                  <span className="text-[11px] text-[#C8A45D] font-mono mt-1 block">
                    {pendingQuotes} {t('adminStatusPending')}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#222] p-5 rounded-sm">
                  <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-2">
                    <span>{t('adminTabMessages')}</span>
                    <Mail className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F4F1E9]">{messages.length}</div>
                  <span className="text-[11px] text-[#E2C98A] font-mono mt-1 block">
                    {newMessages} {t('adminStatusNew')}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#222] p-5 rounded-sm">
                  <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-2">
                    <span>{t('adminTabStations')}</span>
                    <Fuel className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F4F1E9]">{stations.length}</div>
                  <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                    {publishedStationsCount} {t('adminPublish')}ed
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#222] p-5 rounded-sm">
                  <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-2">
                    <span>{t('adminTabBranches')}</span>
                    <Car className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-2xl font-bold text-[#F4F1E9]">{branches.length}</div>
                  <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                    {publishedBranchesCount} {t('adminPublish')}ed
                  </span>
                </div>
              </div>

              {/* Recent Quotation Requests Preview */}
              <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <h3 className="text-sm font-bold text-[#F4F1E9]">
                    {isRtl ? 'أحدث طلبات عروض أسعار الديزل' : 'Recent B2B Diesel Quotation Requests'}
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('quotes')}
                    className="text-xs text-[#C8A45D] hover:underline"
                  >
                    {isRtl ? 'عرض الكل' : 'View All'}
                  </button>
                </div>

                {quotations.length === 0 ? (
                  <p className="text-xs text-[#777] text-center py-6">
                    {isRtl ? 'لا توجد طلبات عروض أسعار حتى الآن.' : 'No quotation requests registered yet.'}
                  </p>
                ) : (
                  <div className="divide-y divide-[#1C1C1C] text-xs">
                    {quotations.slice(0, 4).map((q) => (
                      <div key={q.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-[#F4F1E9]">{q.companyName}</div>
                          <div className="text-[#8A8A8A]">{q.contactName} &bull; {q.telephoneNumber}</div>
                        </div>
                        <div className="text-end">
                          <span className="font-mono text-[#E2C98A] font-semibold">{q.quantity} {q.unit}</span>
                          <div className="text-[10px] text-[#A6A6A6]">{q.city}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: QUOTATIONS MANAGER */}
          {activeAdminTab === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabQuotes')}</h2>
                <p className="text-xs text-[#8A8A8A]">
                  {isRtl
                    ? 'مراجعة وتحديث حالة طلبات التوريد التجاري المقدمة عبر الموقع'
                    : 'Manage wholesale commercial supply quotation requests'}
                </p>
              </div>

              {quotations.length === 0 ? (
                <div className="text-center py-16 bg-[#121212] border border-[#222] rounded-sm p-6 text-xs text-[#8A8A8A]">
                  No quotations submitted yet. When users submit the commercial quote form, records will appear here securely.
                </div>
              ) : (
                <div className="space-y-4">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="bg-[#121212] border border-[#222] p-5 rounded-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C1C1C] pb-3">
                        <div>
                          <div className="text-base font-bold text-[#F4F1E9]">{q.companyName}</div>
                          <span className="text-xs text-[#8A8A8A] font-mono">{q.id} &bull; {q.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={q.status}
                            onChange={(e) =>
                              handleStatusChangeQuote(q.id, e.target.value as QuotationRequest['status'])
                            }
                            className="text-xs px-2.5 py-1 bg-[#1A1A1A] border border-[#333] text-[#E2C98A] rounded-sm outline-none"
                          >
                            <option value="pending">{t('adminStatusPending')}</option>
                            <option value="reviewing">{t('adminStatusReviewing')}</option>
                            <option value="contacted">{t('adminStatusContacted')}</option>
                            <option value="archived">{t('adminStatusArchived')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[#666] block">{t('quoteFullName')}:</span>
                          <span className="text-[#F4F1E9] font-medium">{q.contactName}</span>
                        </div>
                        <div>
                          <span className="text-[#666] block">{t('quoteEmail')}:</span>
                          <a href={`mailto:${q.businessEmail}`} className="text-[#E2C98A] hover:underline">
                            {q.businessEmail}
                          </a>
                        </div>
                        <div>
                          <span className="text-[#666] block">{t('quotePhone')}:</span>
                          <a href={`tel:${q.telephoneNumber}`} className="text-[#E2C98A] hover:underline" dir="ltr">
                            {q.telephoneNumber}
                          </a>
                        </div>
                        <div>
                          <span className="text-[#666] block">{t('quoteCity')}:</span>
                          <span className="text-[#F4F1E9]">{q.city}, {q.country}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#161616] border border-[#252525] rounded-sm text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#C8A45D] font-semibold">{q.productRequested}</span>
                          <span className="font-mono text-[#F4F1E9] font-bold">
                            {q.quantity} {q.unit}
                          </span>
                        </div>
                        {q.additionalRequirements && (
                          <p className="text-[#8A8A8A] mt-2 italic">"{q.additionalRequirements}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES */}
          {activeAdminTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabMessages')}</h2>
                <p className="text-xs text-[#8A8A8A]">
                  {isRtl ? 'رسائل واستفسارات الزوار الواردة' : 'General inquiries and correspondence'}
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 bg-[#121212] border border-[#222] rounded-sm p-6 text-xs text-[#8A8A8A]">
                  No messages submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="bg-[#121212] border border-[#222] p-5 rounded-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-2">
                        <div>
                          <span className="text-sm font-bold text-[#F4F1E9]">{m.subject}</span>
                          <span className="text-xs text-[#8A8A8A] block font-mono">{m.fullName} &bull; {m.createdAt.split('T')[0]}</span>
                        </div>
                        <select
                          value={m.status}
                          onChange={(e) =>
                            handleStatusChangeMsg(m.id, e.target.value as ContactMessage['status'])
                          }
                          className="text-xs px-2.5 py-1 bg-[#1A1A1A] border border-[#333] text-[#E2C98A] rounded-sm outline-none"
                        >
                          <option value="new">{t('adminStatusNew')}</option>
                          <option value="read">{t('adminStatusRead')}</option>
                          <option value="replied">{t('adminStatusReplied')}</option>
                          <option value="archived">{t('adminStatusArchived')}</option>
                        </select>
                      </div>

                      <p className="text-xs text-[#A6A6A6] leading-relaxed bg-[#161616] p-3 rounded-sm">
                        {m.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-[#8A8A8A]">
                        <span>Email: <a href={`mailto:${m.email}`} className="text-[#E2C98A] hover:underline">{m.email}</a></span>
                        {m.phone && <span>Phone: <a href={`tel:${m.phone}`} className="text-[#E2C98A] hover:underline" dir="ltr">{m.phone}</a></span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FUEL STATIONS CRUD */}
          {activeAdminTab === 'stations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabStations')}</h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {isRtl ? 'إضافة وتعديل وحذف محطات الوقود والديزل' : 'Create, edit and manage fuel station directory'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingStation({
                      nameAr: '',
                      nameEn: '',
                      cityAr: 'الرياض',
                      cityEn: 'Riyadh',
                      addressAr: '',
                      addressEn: '',
                      openingHoursAr: 'يعمل على مدار الساعة (24/7)',
                      openingHoursEn: 'Open 24/7 Round the Clock',
                      contactPhone: '+966 11 000 0000',
                      mapUrl: 'https://maps.google.com',
                      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
                      services: ['ديزل شاحنات فائق السرعة', 'وقود 91 و 95', 'متجر ستارشوب 24/7'],
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('adminCreate')}</span>
                </button>
              </div>

              {/* Station Form Modal/Inline */}
              {editingStation && (
                <form
                  onSubmit={handleSaveStation}
                  className="bg-[#121212] border border-[#C8A45D]/50 p-6 rounded-sm space-y-4"
                >
                  <h3 className="text-sm font-bold text-[#E2C98A]">
                    {editingStation.id ? 'Edit Station' : 'Add New Fuel Station'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Station Name (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingStation.nameAr || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                        placeholder="محطة آر إم ستار — بوابة الرياض"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Station Name (English)</label>
                      <input
                        type="text"
                        value={editingStation.nameEn || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                        placeholder="RM STAR Station — Riyadh Gateway"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A6A6A6] mb-1">City (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingStation.cityAr || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, cityAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">City (English)</label>
                      <input
                        type="text"
                        value={editingStation.cityEn || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, cityEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#A6A6A6] mb-1">Address (Arabic)</label>
                      <input
                        type="text"
                        value={editingStation.addressAr || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, addressAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Photo Image URL</label>
                      <input
                        type="text"
                        value={editingStation.imageUrl || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Google Maps Direction URL</label>
                      <input
                        type="text"
                        value={editingStation.mapUrl || ''}
                        onChange={(e) => setEditingStation({ ...editingStation, mapUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="station-pub"
                      checked={editingStation.isPublished ?? true}
                      onChange={(e) => setEditingStation({ ...editingStation, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-[#C8A45D]"
                    />
                    <label htmlFor="station-pub" className="text-xs text-[#F4F1E9] cursor-pointer">
                      Published & Visible on Public Website
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                    >
                      {t('adminSave')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStation(null)}
                      className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#FFF] text-xs rounded-sm"
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </form>
              )}

              {/* Station Listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((st) => (
                  <div key={st.id} className="bg-[#121212] border border-[#222] p-4 rounded-sm flex gap-4">
                    <img
                      src={st.imageUrl}
                      alt={st.nameEn}
                      className="w-24 h-24 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#C8A45D] font-mono">{st.cityAr} / {st.cityEn}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${st.isPublished ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
                            {st.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F4F1E9] mt-0.5">{st.nameAr}</h4>
                        <p className="text-[11px] text-[#888] line-clamp-1">{st.addressAr}</p>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-[#1C1C1C]">
                        <button
                          onClick={() => setEditingStation(st)}
                          className="text-xs text-[#E2C98A] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStation(st.id)}
                          className="text-xs text-red-400 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t('adminDelete')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAR WASH BRANCHES */}
          {activeAdminTab === 'branches' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabBranches')}</h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {isRtl ? 'إدارة مراكز وفروع العناية بالمركبات والغسيل' : 'Manage automated car wash and detailing facilities'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingBranch({
                      nameAr: '',
                      nameEn: '',
                      cityAr: 'الرياض',
                      cityEn: 'Riyadh',
                      addressAr: '',
                      addressEn: '',
                      openingHoursAr: '8:00 ص – 12:00 منتصف الليل',
                      openingHoursEn: '8:00 AM – 12:00 Midnight',
                      contactPhone: '+966 11 000 0000',
                      mapUrl: 'https://maps.google.com',
                      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('adminCreate')}</span>
                </button>
              </div>

              {editingBranch && (
                <form
                  onSubmit={handleSaveBranch}
                  className="bg-[#121212] border border-[#C8A45D]/50 p-6 rounded-sm space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-[#E2C98A]">Add / Edit Branch</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Branch Name (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingBranch.nameAr || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Branch Name (English)</label>
                      <input
                        type="text"
                        value={editingBranch.nameEn || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">City (Arabic)</label>
                      <input
                        type="text"
                        value={editingBranch.cityAr || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, cityAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">City (English)</label>
                      <input
                        type="text"
                        value={editingBranch.cityEn || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, cityEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                    >
                      {t('adminSave')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBranch(null)}
                      className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#FFF] text-xs rounded-sm"
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((b) => (
                  <div key={b.id} className="bg-[#121212] border border-[#222] p-4 rounded-sm flex gap-4">
                    <img
                      src={b.imageUrl}
                      alt={b.nameEn}
                      className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#F4F1E9]">{b.nameAr}</h4>
                        <span className="text-xs text-[#C8A45D]">{b.cityAr} &bull; {b.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-[#1C1C1C]">
                        <button
                          onClick={() => setEditingBranch(b)}
                          className="text-xs text-[#E2C98A] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(b.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeAdminTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabServices')}</h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {isRtl ? 'باقات وتفاصيل خدمات الغسيل والتلميع' : 'Service tiers, duration and specifications'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingService({
                      nameAr: '',
                      nameEn: '',
                      descriptionAr: '',
                      descriptionEn: '',
                      duration: '15 دقيقة',
                      pricePlaceholder: 'متاح للسيارات والأساطيل',
                      featuresAr: ['غسيل عالي الضغط', 'رغوة نانو شامبو'],
                      featuresEn: ['High pressure wash', 'Nano foam shampoo'],
                      isPublished: true,
                      sortOrder: services.length + 1,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('adminCreate')}</span>
                </button>
              </div>

              {editingService && (
                <form
                  onSubmit={handleSaveService}
                  className="bg-[#121212] border border-[#C8A45D]/50 p-6 rounded-sm space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-[#E2C98A]">Add / Edit Service Tier</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Service Title (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingService.nameAr || ''}
                        onChange={(e) => setEditingService({ ...editingService, nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Service Title (English)</label>
                      <input
                        type="text"
                        value={editingService.nameEn || ''}
                        onChange={(e) => setEditingService({ ...editingService, nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Duration</label>
                      <input
                        type="text"
                        value={editingService.duration || ''}
                        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Price / Note</label>
                      <input
                        type="text"
                        value={editingService.pricePlaceholder || ''}
                        onChange={(e) => setEditingService({ ...editingService, pricePlaceholder: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                    >
                      {t('adminSave')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#FFF] text-xs rounded-sm"
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-[#121212] border border-[#222] p-5 rounded-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#888] mb-1">
                        <span>{srv.duration}</span>
                        <span className="text-[#C8A45D]">{srv.pricePlaceholder}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F4F1E9] mb-2">{srv.nameAr}</h4>
                      <p className="text-xs text-[#888] line-clamp-2 mb-3">{srv.descriptionAr}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-[#1C1C1C]">
                      <button
                        onClick={() => setEditingService(srv)}
                        className="text-xs text-[#E2C98A] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PARTNERS */}
          {activeAdminTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabPartners')}</h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {isRtl ? 'إدارة الشركاء الرسميين والتحالفات' : 'Corporate partners, logo URLs and affiliations'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingPartner({
                      nameAr: '',
                      nameEn: '',
                      categoryAr: 'شريك استراتيجي',
                      categoryEn: 'Strategic Partner',
                      logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
                      websiteUrl: 'https://rmstar.com',
                      displayOrder: partners.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('adminCreate')}</span>
                </button>
              </div>

              {editingPartner && (
                <form
                  onSubmit={handleSavePartner}
                  className="bg-[#121212] border border-[#C8A45D]/50 p-6 rounded-sm space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-[#E2C98A]">Add / Edit Partner</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Partner Name (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingPartner.nameAr || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Partner Name (English)</label>
                      <input
                        type="text"
                        value={editingPartner.nameEn || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Logo URL</label>
                      <input
                        type="text"
                        value={editingPartner.logoUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Website URL</label>
                      <input
                        type="text"
                        value={editingPartner.websiteUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, websiteUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                    >
                      {t('adminSave')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPartner(null)}
                      className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#FFF] text-xs rounded-sm"
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {partners.map((prt) => (
                  <div key={prt.id} className="bg-[#121212] border border-[#222] p-5 rounded-sm text-center flex flex-col justify-between">
                    <div>
                      <img
                        src={prt.logoUrl}
                        alt={prt.nameEn}
                        className="w-16 h-16 object-contain mx-auto mb-3 filter grayscale contrast-125"
                      />
                      <h4 className="text-sm font-bold text-[#F4F1E9]">{prt.nameAr}</h4>
                      <span className="text-xs text-[#C8A45D]">{prt.categoryAr}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#1C1C1C] mt-3">
                      <button
                        onClick={() => setEditingPartner(prt)}
                        className="text-xs text-[#E2C98A] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePartner(prt.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: NEWS */}
          {activeAdminTab === 'news' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabNews')}</h2>
                  <p className="text-xs text-[#8A8A8A]">
                    {isRtl ? 'نشر وإدارة الأخبار والبيانات الصحفية' : 'Publish and manage press releases'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingNews({
                      titleAr: '',
                      titleEn: '',
                      summaryAr: '',
                      summaryEn: '',
                      contentAr: '',
                      contentEn: '',
                      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
                      category: 'توسعات',
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('adminCreate')}</span>
                </button>
              </div>

              {editingNews && (
                <form
                  onSubmit={handleSaveNews}
                  className="bg-[#121212] border border-[#C8A45D]/50 p-6 rounded-sm space-y-4 text-xs"
                >
                  <h3 className="text-sm font-bold text-[#E2C98A]">Add / Edit News Article</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Headline (Arabic) *</label>
                      <input
                        type="text"
                        required
                        value={editingNews.titleAr || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, titleAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Headline (English)</label>
                      <input
                        type="text"
                        value={editingNews.titleEn || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, titleEn: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Summary (Arabic)</label>
                      <textarea
                        rows={2}
                        value={editingNews.summaryAr || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, summaryAr: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A6A6A6] mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingNews.imageUrl || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                    >
                      {t('adminSave')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#FFF] text-xs rounded-sm"
                    >
                      {t('adminCancel')}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="bg-[#121212] border border-[#222] p-4 rounded-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-[#C8A45D] font-mono">{item.publishedDate} &bull; {item.category}</span>
                        <h4 className="text-sm font-bold text-[#F4F1E9]">{item.titleAr}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="text-xs text-[#E2C98A] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SITE SETTINGS & BRANDING */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabSettings')}</h2>
                <p className="text-xs text-[#8A8A8A]">
                  {isRtl ? 'تعديل بيانات الشركة الرسمية، وسائل الاتصال، وشريط الإعلانات' : 'Manage corporate registration, phone numbers and top announcement'}
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Company Legal Name (Arabic)</label>
                    <input
                      type="text"
                      value={tempSettings.companyNameAr}
                      onChange={(e) => setTempSettings({ ...tempSettings, companyNameAr: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Company Legal Name (English)</label>
                    <input
                      type="text"
                      value={tempSettings.companyNameEn}
                      onChange={(e) => setTempSettings({ ...tempSettings, companyNameEn: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Commercial Registration Number (السجل التجاري)</label>
                    <input
                      type="text"
                      value={tempSettings.commercialRegistration}
                      onChange={(e) => setTempSettings({ ...tempSettings, commercialRegistration: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Official Corporate Email</label>
                    <input
                      type="email"
                      value={tempSettings.officialEmail}
                      onChange={(e) => setTempSettings({ ...tempSettings, officialEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Official Telephone</label>
                    <input
                      type="text"
                      value={tempSettings.officialPhone}
                      onChange={(e) => setTempSettings({ ...tempSettings, officialPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A6A6A6] mb-1">Official WhatsApp</label>
                    <input
                      type="text"
                      value={tempSettings.officialWhatsApp}
                      onChange={(e) => setTempSettings({ ...tempSettings, officialWhatsApp: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                      dir="ltr"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#A6A6A6] mb-1">Headquarters Address (Arabic)</label>
                    <input
                      type="text"
                      value={tempSettings.headquartersAr}
                      onChange={(e) => setTempSettings({ ...tempSettings, headquartersAr: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#A6A6A6] mb-1">Announcement Banner (Arabic)</label>
                    <input
                      type="text"
                      value={tempSettings.announcementAr}
                      onChange={(e) => setTempSettings({ ...tempSettings, announcementAr: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#A6A6A6] mb-1">Announcement Banner (English)</label>
                    <input
                      type="text"
                      value={tempSettings.announcementEn}
                      onChange={(e) => setTempSettings({ ...tempSettings, announcementEn: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-[#333] rounded-sm text-sm text-[#F4F1E9]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ann-active"
                      checked={tempSettings.isAnnouncementActive}
                      onChange={(e) => setTempSettings({ ...tempSettings, isAnnouncementActive: e.target.checked })}
                      className="w-4 h-4 accent-[#C8A45D]"
                    />
                    <label htmlFor="ann-active" className="text-xs text-[#F4F1E9] cursor-pointer">
                      Activate Top Announcement Banner on Live Website
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-xs rounded-sm hover:opacity-90"
                  >
                    {t('adminSave')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 10: SYSTEM DIAGNOSTICS & SEED */}
          {activeAdminTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminTabSystem')}</h2>
                <p className="text-xs text-[#8A8A8A]">
                  {isRtl ? 'تشخيص الاتصال بقاعدة بيانات Firestore وأدوات التهيئة' : 'Cloud Firestore connection testing and data provisioning'}
                </p>
              </div>

              <div className="bg-[#121212] border border-[#222] p-6 rounded-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold text-[#F4F1E9]">Database Health & Connectivity</h3>
                <div className="flex items-center justify-between p-3 bg-[#181818] rounded-sm border border-[#2E2E2E]">
                  <div>
                    <span className="text-[#888] block text-[11px]">Firestore Status:</span>
                    <span className="text-sm font-mono text-[#E2C98A] font-bold">{dbStatus}</span>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="px-3 py-1.5 bg-[#252525] hover:bg-[#333] text-xs font-semibold rounded-sm text-[#F4F1E9] flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                    <span>Run Connection Test</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#222] space-y-3">
                  <h4 className="text-xs font-bold text-[#E2C98A]">Initialize Corporate Datasets</h4>
                  <p className="text-[#8A8A8A] leading-relaxed">
                    Click the button below to populate the provisioned Cloud Firestore collections with complete, authentic corporate records for stations, car wash centers, service tiers, partners, and settings.
                  </p>
                  <button
                    onClick={handleSeedData}
                    className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#E2C98A] text-[#080808] font-bold rounded-sm transition-colors cursor-pointer"
                  >
                    {t('adminSeedNotice')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
