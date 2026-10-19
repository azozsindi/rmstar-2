import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD } from '../../context/AuthContext';
import {
  FuelStation,
  CarWashBranch,
  CarWashService,
  Partner,
  NewsArticle,
  QuotationRequest,
  ContactMessage,
  CareerPosting,
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
  saveCareer,
  removeCareer,
  updateQuotationStatus,
  removeQuotationRequest,
  updateContactMessageStatus,
  removeContactMessage,
  seedInitialFirestoreData,
  DEFAULT_SITE_SETTINGS,
} from '../../services/db';
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
  Building,
  Image as ImageIcon,
  Sparkles,
  Info,
  Briefcase,
  FileText,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  MessageSquare,
  Globe,
  Sliders,
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
  careers: CareerPosting[];
  setCareers: React.Dispatch<React.SetStateAction<CareerPosting[]>>;
  quotations: QuotationRequest[];
  setQuotations: React.Dispatch<React.SetStateAction<QuotationRequest[]>>;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  onClose: () => void;
}

type AdminTab =
  | 'overview'
  | 'company'
  | 'hero'
  | 'diesel'
  | 'about'
  | 'stations'
  | 'carwash'
  | 'partners'
  | 'news'
  | 'careers'
  | 'legal'
  | 'quotes'
  | 'messages'
  | 'system';

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
  careers,
  setCareers,
  quotations,
  setQuotations,
  messages,
  setMessages,
  onClose,
}) => {
  const { locale, t } = useLanguage();
  const { logout } = useAuth();
  const isRtl = locale === 'ar';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Editable draft of siteSettings
  const [draftSettings, setDraftSettings] = useState<SiteSettings>(settings);

  const showFeedback = (text: string, isError = false) => {
    setFeedback({ text, isError });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSaveAllSettings = async () => {
    setSavingSettings(true);
    try {
      await saveSiteSettings(draftSettings);
      setSettings(draftSettings);
      showFeedback(isRtl ? 'تم حفظ وتحديث الإعدادات بنجاح!' : 'Settings updated and saved successfully!');
    } catch {
      showFeedback(isRtl ? 'حدث خطأ أثناء الحفظ.' : 'Error saving settings.', true);
    } finally {
      setSavingSettings(false);
    }
  };

  // Metrics
  const pendingQuotes = quotations.filter((q) => q.status === 'pending').length;
  const newMessages = messages.filter((m) => m.status === 'new').length;

  // ----------------- Stations Management -----------------
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
      services: editingStation.services || ['ديزل شاحنات فائق السرعة', 'وقود 91 و 95'],
      openingHoursAr: editingStation.openingHoursAr || '24/7',
      openingHoursEn: editingStation.openingHoursEn || '24/7',
      contactPhone: editingStation.contactPhone || '0555338893',
      mapUrl: editingStation.mapUrl || 'https://maps.google.com',
      imageUrl: editingStation.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
      isPublished: editingStation.isPublished ?? true,
      createdAt: editingStation.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStation(stationToSave);
    setStations((prev) => prev.filter((s) => s.id !== id).concat(stationToSave));
    setEditingStation(null);
    showFeedback(isRtl ? 'تم حفظ المحطة بنجاح' : 'Station saved successfully');
  };

  const handleDeleteStation = async (id: string) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذه المحطة؟' : 'Delete this station?')) return;
    await removeStation(id);
    setStations((prev) => prev.filter((s) => s.id !== id));
    showFeedback(isRtl ? 'تم حذف المحطة' : 'Station deleted');
  };

  // ----------------- Branches Management -----------------
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
      openingHoursAr: editingBranch.openingHoursAr || '8:00 AM - 12:00 AM',
      openingHoursEn: editingBranch.openingHoursEn || '8:00 AM - 12:00 AM',
      contactPhone: editingBranch.contactPhone || '0555338893',
      mapUrl: editingBranch.mapUrl || 'https://maps.google.com',
      imageUrl: editingBranch.imageUrl || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
      isPublished: editingBranch.isPublished ?? true,
      createdAt: editingBranch.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCarWashBranch(branchToSave);
    setBranches((prev) => prev.filter((b) => b.id !== id).concat(branchToSave));
    setEditingBranch(null);
    showFeedback(isRtl ? 'تم حفظ فرع المغسلة بنجاح' : 'Branch saved');
  };

  const handleDeleteBranch = async (id: string) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا الفرع؟' : 'Delete this branch?')) return;
    await removeCarWashBranch(id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
    showFeedback(isRtl ? 'تم حذف الفرع' : 'Branch deleted');
  };

  // ----------------- Services Management -----------------
  const [editingService, setEditingService] = useState<Partial<CarWashService> | null>(null);
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.nameAr) return;

    const id = editingService.id || `service-${Date.now()}`;
    const serviceToSave: CarWashService = {
      id,
      nameAr: editingService.nameAr,
      nameEn: editingService.nameEn || editingService.nameAr,
      descriptionAr: editingService.descriptionAr || '',
      descriptionEn: editingService.descriptionEn || '',
      duration: editingService.duration || '15 دقيقة',
      pricePlaceholder: editingService.pricePlaceholder || 'حسب الفئة',
      featuresAr: editingService.featuresAr || ['غسيل آلي فائق النقاء'],
      featuresEn: editingService.featuresEn || ['Automated wash'],
      imageUrl: editingService.imageUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
      isPublished: editingService.isPublished ?? true,
      sortOrder: editingService.sortOrder || 1,
    };

    await saveCarWashService(serviceToSave);
    setServices((prev) => prev.filter((s) => s.id !== id).concat(serviceToSave));
    setEditingService(null);
    showFeedback(isRtl ? 'تم حفظ باقة الخدمة بنجاح' : 'Service package saved');
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذه الباقة؟' : 'Delete package?')) return;
    await removeCarWashService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  // ----------------- Partners Management -----------------
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner?.nameAr) return;

    const id = editingPartner.id || `partner-${Date.now()}`;
    const partnerToSave: Partner = {
      id,
      nameAr: editingPartner.nameAr,
      nameEn: editingPartner.nameEn || editingPartner.nameAr,
      logoUrl: editingPartner.logoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      websiteUrl: editingPartner.websiteUrl || 'https://rmstar.online',
      categoryAr: editingPartner.categoryAr || 'شريك استراتيجي',
      categoryEn: editingPartner.categoryEn || 'Strategic Partner',
      displayOrder: editingPartner.displayOrder || 1,
      isPublished: editingPartner.isPublished ?? true,
      createdAt: editingPartner.createdAt || new Date().toISOString(),
    };

    await savePartner(partnerToSave);
    setPartners((prev) => prev.filter((p) => p.id !== id).concat(partnerToSave));
    setEditingPartner(null);
    showFeedback(isRtl ? 'تم حفظ بيانات الشريك' : 'Partner saved');
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذا الشريك؟' : 'Delete partner?')) return;
    await removePartner(id);
    setPartners((prev) => prev.filter((p) => p.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  // ----------------- News Management -----------------
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null);
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews?.titleAr) return;

    const id = editingNews.id || `news-${Date.now()}`;
    const newsToSave: NewsArticle = {
      id,
      titleAr: editingNews.titleAr,
      titleEn: editingNews.titleEn || editingNews.titleAr,
      summaryAr: editingNews.summaryAr || '',
      summaryEn: editingNews.summaryEn || '',
      contentAr: editingNews.contentAr || editingNews.summaryAr || '',
      contentEn: editingNews.contentEn || editingNews.summaryEn || '',
      imageUrl: editingNews.imageUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
      publishedDate: editingNews.publishedDate || new Date().toISOString().split('T')[0],
      category: editingNews.category || 'أخبار الشركة',
      isPublished: editingNews.isPublished ?? true,
      createdAt: editingNews.createdAt || new Date().toISOString(),
    };

    await saveNewsArticle(newsToSave);
    setNews((prev) => prev.filter((n) => n.id !== id).concat(newsToSave));
    setEditingNews(null);
    showFeedback(isRtl ? 'تم حفظ الخبر بنجاح' : 'Article saved');
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذا الخبر؟' : 'Delete article?')) return;
    await removeNewsArticle(id);
    setNews((prev) => prev.filter((n) => n.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  // ----------------- Careers Management -----------------
  const [editingCareer, setEditingCareer] = useState<Partial<CareerPosting> | null>(null);
  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCareer?.titleAr) return;

    const id = editingCareer.id || `cr-${Date.now()}`;
    const careerToSave: CareerPosting = {
      id,
      titleAr: editingCareer.titleAr,
      titleEn: editingCareer.titleEn || editingCareer.titleAr,
      departmentAr: editingCareer.departmentAr || 'العمليات',
      departmentEn: editingCareer.departmentEn || 'Operations',
      locationAr: editingCareer.locationAr || 'الرياض',
      locationEn: editingCareer.locationEn || 'Riyadh',
      type: editingCareer.type || 'دوام كامل',
      descriptionAr: editingCareer.descriptionAr || '',
      descriptionEn: editingCareer.descriptionEn || '',
      isPublished: editingCareer.isPublished ?? true,
      createdAt: editingCareer.createdAt || new Date().toISOString(),
    };

    await saveCareer(careerToSave);
    setCareers((prev) => prev.filter((c) => c.id !== id).concat(careerToSave));
    setEditingCareer(null);
    showFeedback(isRtl ? 'تم حفظ الإعلان الوظيفي' : 'Career posting saved');
  };

  const handleDeleteCareer = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذه الوظيفة؟' : 'Delete career posting?')) return;
    await removeCareer(id);
    setCareers((prev) => prev.filter((c) => c.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  // ----------------- Quotes & Messages Actions -----------------
  const handleUpdateQuoteStatus = async (id: string, status: QuotationRequest['status']) => {
    await updateQuotationStatus(id, status);
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    showFeedback(isRtl ? 'تم تحديث حالة الطلب' : 'Status updated');
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذا الطلب؟' : 'Delete quote?')) return;
    await removeQuotationRequest(id);
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  const handleUpdateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    await updateContactMessageStatus(id, status);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    showFeedback(isRtl ? 'تم تحديث حالة الرسالة' : 'Status updated');
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm(isRtl ? 'حذف هذه الرسالة؟' : 'Delete message?')) return;
    await removeContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showFeedback(isRtl ? 'تم الحذف' : 'Deleted');
  };

  // ----------------- Factory Reset -----------------
  const handleFactoryReset = async () => {
    if (
      !window.confirm(
        isRtl
          ? 'تحذير: هل ترغب بإعادة تعيين كافة بيانات الموقع إلى النسخة الافتراضية الأصلية؟'
          : 'Warning: Reset all website contents to factory default state?'
      )
    )
      return;

    const res = await seedInitialFirestoreData();
    if (res.success) {
      setDraftSettings(DEFAULT_SITE_SETTINGS);
      setSettings(DEFAULT_SITE_SETTINGS);
      showFeedback(res.message);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showFeedback(res.message, true);
    }
  };

  const navMenuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: isRtl ? 'نظرة عامة' : 'Overview', icon: LayoutDashboard },
    { id: 'company', label: isRtl ? 'بيانات الشركة والهوية' : 'Company & Brand', icon: Building },
    { id: 'hero', label: isRtl ? 'الصفحة الرئيسية والهيرو' : 'Homepage & Hero', icon: Sparkles },
    { id: 'diesel', label: isRtl ? 'توريد ونقل الديزل' : 'Diesel Supply', icon: Fuel },
    { id: 'about', label: isRtl ? 'من نحن والرؤية' : 'About Us & Vision', icon: Info },
    { id: 'stations', label: isRtl ? 'محطات الوقود' : 'Fuel Stations', icon: Layers, badge: stations.length },
    { id: 'carwash', label: isRtl ? 'العناية بالمركبات والمغاسل' : 'Auto Detailing & Wash', icon: Car },
    { id: 'partners', label: isRtl ? 'شركاء الأعمال' : 'Partners', icon: Handshake, badge: partners.length },
    { id: 'news', label: isRtl ? 'الأخبار والبيانات' : 'News & Press', icon: Newspaper, badge: news.length },
    { id: 'careers', label: isRtl ? 'الشواغر والوظائف' : 'Careers', icon: Briefcase, badge: careers.length },
    { id: 'legal', label: isRtl ? 'الشروط والسياسات' : 'Legal & Policies', icon: FileText },
    { id: 'quotes', label: isRtl ? 'طلبات عروض الأسعار' : 'Quotation Requests', icon: FileSpreadsheet, badge: pendingQuotes },
    { id: 'messages', label: isRtl ? 'رسائل اتصل بنا' : 'Contact Messages', icon: Mail, badge: newMessages },
    { id: 'system', label: isRtl ? 'إدارة الدخول والنظام' : 'System & Security', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F1E9] flex flex-col font-sans selection:bg-[#C8A45D]/30" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-md border-b border-[#1F1F1F] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#181818] border border-[#C8A45D]/50 flex items-center justify-center text-[#E2C98A]">
            <Sliders className="w-4 h-4 text-[#C8A45D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-[#F4F1E9] tracking-tight">
                {isRtl ? 'لوحة تحكم آر إم ستار الشاملة' : 'RM STAR Central Control Panel'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#C8A45D] font-mono border border-[#C8A45D]/30">
                {DEFAULT_ADMIN_USERNAME} • SuperAdmin
              </span>
            </div>
            <p className="text-[11px] text-[#777] hidden sm:block">
              {isRtl ? 'تحكم كامل بنسبة 100% في جميع صفحات ونصوص وصور المنظومة' : '100% complete editing control over all site texts, images, and datasets'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Save Button */}
          <button
            onClick={handleSaveAllSettings}
            disabled={savingSettings}
            className="px-4 py-2 bg-gradient-to-r from-[#C8A45D] via-[#E2C98A] to-[#C8A45D] hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] text-[#080808] text-xs font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#080808]" />
            <span>{savingSettings ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ كافة التعديلات' : 'Save All Changes')}</span>
          </button>

          {/* View Website Button */}
          <button
            onClick={onClose}
            className="px-3.5 py-2 bg-[#161616] hover:bg-[#222] border border-[#2E2E2E] hover:border-[#C8A45D]/60 text-xs font-semibold text-[#E2C98A] rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRtl ? 'عرض الموقع' : 'View Site'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-2 bg-[#161616] hover:bg-red-950/40 border border-[#2E2E2E] hover:border-red-500/50 text-[#888] hover:text-red-400 rounded-sm transition-all cursor-pointer"
            title={isRtl ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`fixed top-16 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-sm shadow-2xl border text-xs font-medium flex items-center gap-2 animate-bounce-subtle ${
            feedback.isError
              ? 'bg-red-950/90 border-red-500 text-red-100'
              : 'bg-[#151515]/95 border-[#C8A45D] text-[#E2C98A]'
          }`}
        >
          {feedback.isError ? <AlertCircle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-[#C8A45D]" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Admin Workspace Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0A0A0A] border-b md:border-b-0 md:border-e border-[#1C1C1C] p-3 sm:p-4 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto space-x-1 md:space-x-0 md:space-y-1">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#181818] text-[#E2C98A] border-s-2 border-[#C8A45D] shadow-sm font-bold'
                    : 'text-[#888] hover:text-[#F4F1E9] hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8A45D]' : 'text-[#666]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-[#C8A45D] text-[#080808] font-bold' : 'bg-[#1E1E1E] text-[#999]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Central Content Panel */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="border-b border-[#1C1C1C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#F4F1E9]">
                    {isRtl ? 'لوحة القيادة والمؤشرات' : 'Executive Overview'}
                  </h1>
                  <p className="text-xs text-[#888] mt-1">
                    {isRtl ? 'ملخص شامل لجميع أقسام الموقع والطلبات الواردة' : 'Summary of all website sections, submissions, and status'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#141414] hover:bg-[#C8A45D] hover:text-[#080808] text-xs font-bold text-[#E2C98A] border border-[#2B2B2B] hover:border-transparent rounded-sm transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'معاينة الموقع كزائر' : 'Preview Live Site'}</span>
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('quotes')}
                  className="p-5 bg-[#101010] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-[#888] mb-2">
                    <span>{isRtl ? 'طلبات عروض الأسعار' : 'Quotation Requests'}</span>
                    <FileSpreadsheet className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-[#F4F1E9]">{quotations.length}</div>
                  <div className="text-[11px] text-[#C8A45D] mt-2">
                    {pendingQuotes} {isRtl ? 'طلب بانتظار المراجعة' : 'pending review'}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('messages')}
                  className="p-5 bg-[#101010] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-[#888] mb-2">
                    <span>{isRtl ? 'رسائل الاتصال' : 'Contact Messages'}</span>
                    <Mail className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-[#F4F1E9]">{messages.length}</div>
                  <div className="text-[11px] text-[#E2C98A] mt-2">
                    {newMessages} {isRtl ? 'رسالة جديدة' : 'new inquiries'}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('stations')}
                  className="p-5 bg-[#101010] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-[#888] mb-2">
                    <span>{isRtl ? 'محطات الوقود' : 'Fuel Stations'}</span>
                    <Layers className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-[#F4F1E9]">{stations.length}</div>
                  <div className="text-[11px] text-[#777] mt-2">
                    {stations.filter((s) => s.isPublished).length} {isRtl ? 'محطة منشورة' : 'active stations'}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('carwash')}
                  className="p-5 bg-[#101010] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-[#888] mb-2">
                    <span>{isRtl ? 'باقات المغاسل' : 'Car Wash Packages'}</span>
                    <Car className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-[#F4F1E9]">{services.length}</div>
                  <div className="text-[11px] text-[#777] mt-2">
                    {branches.length} {isRtl ? 'فروع ومراكز خدمة' : 'active service branches'}
                  </div>
                </div>
              </div>

              {/* Quick Actions Matrix */}
              <div className="bg-[#101010] border border-[#1F1F1F] rounded-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#F4F1E9] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                  <span>{isRtl ? 'روابط التعديل السريع المباشر' : 'Quick Editing Shortcuts'}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => setActiveTab('company')}
                    className="p-3 bg-[#151515] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#F4F1E9]">{isRtl ? 'بيانات الاتصال' : 'Contact Info'}</div>
                    <div className="text-[10px] text-[#777] mt-1">{draftSettings.officialPhone}</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('hero')}
                    className="p-3 bg-[#151515] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#F4F1E9]">{isRtl ? 'عنوان الهيرو' : 'Hero Title'}</div>
                    <div className="text-[10px] text-[#777] mt-1">{isRtl ? 'تعديل العنوان والصورة' : 'Edit hero and image'}</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('diesel')}
                    className="p-3 bg-[#151515] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#F4F1E9]">{isRtl ? 'مواصفات الديزل' : 'Diesel Specs'}</div>
                    <div className="text-[10px] text-[#777] mt-1">{isRtl ? 'تعديل بنود الجودة' : 'Edit quality specs'}</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className="p-3 bg-[#151515] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer"
                  >
                    <div className="font-bold text-[#F4F1E9]">{isRtl ? 'الرؤية والرسالة' : 'Vision & Mission'}</div>
                    <div className="text-[10px] text-[#777] mt-1">{isRtl ? 'تعديل نبذة من نحن' : 'Edit narrative & values'}</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY & BRAND */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'بيانات الشركة والهوية الرسمية' : 'Company & Brand Identity'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'تعديل أرقام الهواتف، البريد، العنوان، والسجل التجاري' : 'Edit corporate identifiers, contact phones, email, and address'}</p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ البيانات' : 'Save'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#101010] border border-[#222] p-6 rounded-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'اسم الشركة (عربي)' : 'Company Name (Ar)'}</label>
                  <input
                    type="text"
                    value={draftSettings.companyNameAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, companyNameAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'اسم الشركة (إنجليزي)' : 'Company Name (En)'}</label>
                  <input
                    type="text"
                    value={draftSettings.companyNameEn || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, companyNameEn: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'رقم السجل التجاري' : 'Commercial Registration'}</label>
                  <input
                    type="text"
                    value={draftSettings.commercialRegistration || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, commercialRegistration: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>
                  <input
                    type="email"
                    value={draftSettings.officialEmail || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, officialEmail: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'رقم الهاتف الرسمي' : 'Official Phone'}</label>
                  <input
                    type="text"
                    value={draftSettings.officialPhone || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, officialPhone: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'رقم الواتساب المباشر' : 'Official WhatsApp'}</label>
                  <input
                    type="text"
                    value={draftSettings.officialWhatsApp || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, officialWhatsApp: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان المقر الرئيسي (عربي)' : 'Headquarters Address (Ar)'}</label>
                  <input
                    type="text"
                    value={draftSettings.headquartersAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, headquartersAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان المقر الرئيسي (إنجليزي)' : 'Headquarters Address (En)'}</label>
                  <input
                    type="text"
                    value={draftSettings.headquartersEn || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, headquartersEn: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                  />
                </div>

                {/* Announcement Bar Settings */}
                <div className="md:col-span-2 pt-4 border-t border-[#222] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'شريط الإعلانات العاجل العلوي' : 'Top Announcement Bar'}</h4>
                      <p className="text-[11px] text-[#777]">{isRtl ? 'إظهار شريط تنبيه أعلى الموقع للعملاء' : 'Show notification ticker across the header'}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={draftSettings.isAnnouncementActive}
                        onChange={(e) => setDraftSettings({ ...draftSettings, isAnnouncementActive: e.target.checked })}
                        className="rounded border-[#333] text-[#C8A45D] focus:ring-0 w-4 h-4"
                      />
                      <span className="text-[#CCC]">{isRtl ? 'تفعيل الشريط' : 'Enable Bar'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={draftSettings.announcementAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, announcementAr: e.target.value })}
                      placeholder="نص الإعلان بالعربي..."
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                    />
                    <input
                      type="text"
                      value={draftSettings.announcementEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, announcementEn: e.target.value })}
                      placeholder="Announcement in English..."
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOMEPAGE & HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'الصفحة الرئيسية وقسم الهيرو' : 'Homepage & Hero Section'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'تعديل العنوان الترويجي، الوصف، صورة الخلفية، والعدادات' : 'Configure main banner, subtitle, background image, and stats counters'}</p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ التعديلات' : 'Save'}</span>
                </button>
              </div>

              <div className="bg-[#101010] border border-[#222] p-6 rounded-sm space-y-6">
                {/* Hero Badge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'الشارة الذهبية (عربي)' : 'Hero Badge (Ar)'}</label>
                    <input
                      type="text"
                      value={draftSettings.heroBadgeAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroBadgeAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'الشارة الذهبية (إنجليزي)' : 'Hero Badge (En)'}</label>
                    <input
                      type="text"
                      value={draftSettings.heroBadgeEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroBadgeEn: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Hero Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان الهيرو الرئيسي (عربي)' : 'Hero Title (Ar)'}</label>
                    <textarea
                      rows={2}
                      value={draftSettings.heroTitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroTitleAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان الهيرو الرئيسي (إنجليزي)' : 'Hero Title (En)'}</label>
                    <textarea
                      rows={2}
                      value={draftSettings.heroTitleEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroTitleEn: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Hero Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'نص الوصف الترويجي (عربي)' : 'Hero Description (Ar)'}</label>
                    <textarea
                      rows={3}
                      value={draftSettings.heroDescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroDescAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'نص الوصف الترويجي (إنجليزي)' : 'Hero Description (En)'}</label>
                    <textarea
                      rows={3}
                      value={draftSettings.heroDescEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroDescEn: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Hero Image URL & Preview */}
                <div className="space-y-2 pt-2 border-t border-[#222]">
                  <label className="text-xs font-bold text-[#A6A6A6] flex items-center justify-between">
                    <span>{isRtl ? 'رابط صورة خلفية الهيرو (Hero Image URL)' : 'Hero Background Image URL'}</span>
                    <span className="text-[10px] text-[#777]">{isRtl ? 'صورة شاحنة صهريج أو أسطول ديزل بجودة فائقة' : 'High quality diesel fleet or tanker truck'}</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={draftSettings.heroImageUrl || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, heroImageUrl: e.target.value })}
                      className="flex-1 bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono focus:outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                    {draftSettings.heroImageUrl && (
                      <div className="w-16 h-10 rounded-sm overflow-hidden border border-[#333] shrink-0">
                        <img src={draftSettings.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics / Counters */}
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'العدادات والأرقام الترويجية (Metrics)' : 'Promotional Stats Counters'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Metric 1 */}
                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <label className="text-[11px] font-bold text-[#999]">{isRtl ? 'العداد 1' : 'Metric 1'}</label>
                      <input
                        type="text"
                        value={draftSettings.metric1Val || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric1Val: e.target.value })}
                        placeholder="99.9%"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-mono font-bold"
                      />
                      <input
                        type="text"
                        value={draftSettings.metric1LabelAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric1LabelAr: e.target.value })}
                        placeholder="العنوان بالعربي"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>

                    {/* Metric 2 */}
                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <label className="text-[11px] font-bold text-[#999]">{isRtl ? 'العداد 2' : 'Metric 2'}</label>
                      <input
                        type="text"
                        value={draftSettings.metric2Val || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric2Val: e.target.value })}
                        placeholder="24/7"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-mono font-bold"
                      />
                      <input
                        type="text"
                        value={draftSettings.metric2LabelAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric2LabelAr: e.target.value })}
                        placeholder="العنوان بالعربي"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>

                    {/* Metric 3 */}
                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <label className="text-[11px] font-bold text-[#999]">{isRtl ? 'العداد 3' : 'Metric 3'}</label>
                      <input
                        type="text"
                        value={draftSettings.metric3Val || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric3Val: e.target.value })}
                        placeholder="ISO"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-mono font-bold"
                      />
                      <input
                        type="text"
                        value={draftSettings.metric3LabelAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, metric3LabelAr: e.target.value })}
                        placeholder="العنوان بالعربي"
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIESEL SUPPLY CMS */}
          {activeTab === 'diesel' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'صفحة وقسم استيراد وتوريد الديزل' : 'Diesel Supply Page Content'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'تعديل نصوص الصفحة، المواصفات الفنية، وبنود الأسطول' : 'Customize diesel procurement titles, technical specifications, and fleet capabilities'}</p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ التعديلات' : 'Save'}</span>
                </button>
              </div>

              <div className="bg-[#101010] border border-[#222] p-6 rounded-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان الصفحة (عربي)' : 'Page Title (Ar)'}</label>
                    <input
                      type="text"
                      value={draftSettings.dieselPageTitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselPageTitleAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان الصفحة (إنجليزي)' : 'Page Title (En)'}</label>
                    <input
                      type="text"
                      value={draftSettings.dieselPageTitleEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselPageTitleEn: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'الوصف الفرعي (عربي)' : 'Subtitle (Ar)'}</label>
                    <textarea
                      rows={2}
                      value={draftSettings.dieselPageSubtitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselPageSubtitleAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'الوصف الفرعي (إنجليزي)' : 'Subtitle (En)'}</label>
                    <textarea
                      rows={2}
                      value={draftSettings.dieselPageSubtitleEn || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselPageSubtitleEn: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono"
                    />
                  </div>
                </div>

                {/* Specifications Title */}
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'بنود المواصفات الفنية والجودة' : 'Technical Specifications'}</h4>
                  
                  {/* Spec 1 */}
                  <div className="p-4 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                    <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'البند الأول (المواصفة 1)' : 'Specification 1'}</label>
                    <input
                      type="text"
                      value={draftSettings.dieselSpec1TitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec1TitleAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#F4F1E9]"
                      placeholder="عنوان المواصفة..."
                    />
                    <textarea
                      rows={2}
                      value={draftSettings.dieselSpec1DescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec1DescAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#AAA]"
                      placeholder="تفاصيل المواصفة..."
                    />
                  </div>

                  {/* Spec 2 */}
                  <div className="p-4 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                    <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'البند الثاني (المواصفة 2)' : 'Specification 2'}</label>
                    <input
                      type="text"
                      value={draftSettings.dieselSpec2TitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec2TitleAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#F4F1E9]"
                    />
                    <textarea
                      rows={2}
                      value={draftSettings.dieselSpec2DescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec2DescAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#AAA]"
                    />
                  </div>

                  {/* Spec 3 */}
                  <div className="p-4 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                    <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'البند الثالث (المواصفة 3)' : 'Specification 3'}</label>
                    <input
                      type="text"
                      value={draftSettings.dieselSpec3TitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec3TitleAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#F4F1E9]"
                    />
                    <textarea
                      rows={2}
                      value={draftSettings.dieselSpec3DescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, dieselSpec3DescAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-1.5 text-xs text-[#AAA]"
                    />
                  </div>
                </div>

                {/* Fleet Capabilities */}
                <div className="pt-4 border-t border-[#222] space-y-3">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'أسطول النقل والسلامة اللوجستية' : 'Fleet & Logistics Capabilities'}</h4>
                  <input
                    type="text"
                    value={draftSettings.dieselFleetTitleAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, dieselFleetTitleAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    placeholder="عنوان قسم الأسطول..."
                  />
                  <textarea
                    rows={2}
                    value={draftSettings.dieselFleetDescAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, dieselFleetDescAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#AAA]"
                    placeholder="وصف إمكانيات الأسطول..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT US & VISION */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'صفحة من نحن والرؤية والرسالة' : 'About Us, Vision & Mission'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'تعديل النبذة التنفيذية، الرؤية، الرسالة، والقيم الجوهرية' : 'Edit narrative, corporate vision, mission statement, and core values'}</p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ التعديلات' : 'Save'}</span>
                </button>
              </div>

              <div className="bg-[#101010] border border-[#222] p-6 rounded-sm space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'عنوان الصفحة (عربي)' : 'Title (Ar)'}</label>
                    <input
                      type="text"
                      value={draftSettings.aboutTitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, aboutTitleAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'الوصف الفرعي (عربي)' : 'Subtitle (Ar)'}</label>
                    <input
                      type="text"
                      value={draftSettings.aboutSubtitleAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, aboutSubtitleAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>
                </div>

                {/* Executive Overview */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'النبذة التنفيذية (الفقرة الأولى)' : 'Executive Overview Paragraph 1'}</label>
                  <textarea
                    rows={3}
                    value={draftSettings.aboutOverviewAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, aboutOverviewAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'النبذة التنفيذية (الفقرة الثانية)' : 'Executive Overview Paragraph 2'}</label>
                  <textarea
                    rows={3}
                    value={draftSettings.aboutOverview2Ar || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, aboutOverview2Ar: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                  />
                </div>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#222]">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'الرؤية المؤسسية' : 'Corporate Vision'}</label>
                    <textarea
                      rows={3}
                      value={draftSettings.aboutVisionDescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, aboutVisionDescAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'الرسالة' : 'Corporate Mission'}</label>
                    <textarea
                      rows={3}
                      value={draftSettings.aboutMissionDescAr || ''}
                      onChange={(e) => setDraftSettings({ ...draftSettings, aboutMissionDescAr: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                    />
                  </div>
                </div>

                {/* Core Values 1, 2, 3 */}
                <div className="pt-2 border-t border-[#222] space-y-3">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'القيم الجوهرية الثلاث' : 'Core Values'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <input
                        type="text"
                        value={draftSettings.aboutVal1TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal1TitleAr: e.target.value })}
                        placeholder="القيمة 1..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-bold"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.aboutVal1DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal1DescAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <input
                        type="text"
                        value={draftSettings.aboutVal2TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal2TitleAr: e.target.value })}
                        placeholder="القيمة 2..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-bold"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.aboutVal2DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal2DescAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <input
                        type="text"
                        value={draftSettings.aboutVal3TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal3TitleAr: e.target.value })}
                        placeholder="القيمة 3..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-xs text-[#E2C98A] font-bold"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.aboutVal3DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, aboutVal3DescAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-2 py-1 text-[11px] text-[#CCC]"
                      />
                    </div>
                  </div>
                </div>

                {/* About Image URL */}
                <div className="space-y-1.5 pt-2 border-t border-[#222]">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'رابط صورة قسم من نحن' : 'About Image URL'}</label>
                  <input
                    type="text"
                    value={draftSettings.aboutImageUrl || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, aboutImageUrl: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FUEL STATIONS */}
          {activeTab === 'stations' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'إدارة محطات الوقود النموذجية' : 'Fuel Stations Management'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'إضافة محطة جديدة، تعديل الخدمات، الخرائط، وإخفاء/إظهار المحطات' : 'Add, edit, remove, and manage retail fuel station network'}</p>
                </div>
                <button
                  onClick={() =>
                    setEditingStation({
                      nameAr: '',
                      nameEn: '',
                      cityAr: 'الرياض',
                      cityEn: 'Riyadh',
                      addressAr: '',
                      services: ['ديزل شاحنات فائق السرعة', 'وقود 91 و 95'],
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة محطة جديدة' : 'Add Station'}</span>
                </button>
              </div>

              {/* Station Edit Modal */}
              {editingStation && (
                <div className="p-6 bg-[#121212] border border-[#C8A45D]/60 rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222] pb-3">
                    <h3 className="text-sm font-bold text-[#E2C98A]">
                      {editingStation.id ? (isRtl ? 'تعديل بيانات المحطة' : 'Edit Station') : (isRtl ? 'إضافة محطة جديدة' : 'Add Station')}
                    </h3>
                    <button onClick={() => setEditingStation(null)} className="text-[#888] hover:text-[#FFF]">✕</button>
                  </div>
                  <form onSubmit={handleSaveStation} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'اسم المحطة (عربي)' : 'Station Name (Ar)'}</label>
                        <input
                          type="text"
                          required
                          value={editingStation.nameAr || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, nameAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'اسم المحطة (إنجليزي)' : 'Station Name (En)'}</label>
                        <input
                          type="text"
                          value={editingStation.nameEn || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, nameEn: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'المدينة (عربي)' : 'City (Ar)'}</label>
                        <input
                          type="text"
                          required
                          value={editingStation.cityAr || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, cityAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رقم هاتف المحطة' : 'Station Phone'}</label>
                        <input
                          type="text"
                          value={editingStation.contactPhone || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, contactPhone: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'العنوان والموقع (عربي)' : 'Address (Ar)'}</label>
                        <input
                          type="text"
                          value={editingStation.addressAr || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, addressAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رابط خريطة Google' : 'Google Maps URL'}</label>
                        <input
                          type="text"
                          value={editingStation.mapUrl || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, mapUrl: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رابط صورة المحطة' : 'Image URL'}</label>
                        <input
                          type="text"
                          value={editingStation.imageUrl || ''}
                          onChange={(e) => setEditingStation({ ...editingStation, imageUrl: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editingStation.isPublished ?? true}
                          onChange={(e) => setEditingStation({ ...editingStation, isPublished: e.target.checked })}
                          className="rounded text-[#C8A45D]"
                        />
                        <span>{isRtl ? 'منشور ومرئي للزوار' : 'Published'}</span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingStation(null)}
                          className="px-4 py-2 bg-[#222] hover:bg-[#333] text-xs font-bold rounded"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#C8A45D] hover:bg-[#E2C98A] text-[#080808] text-xs font-bold rounded"
                        >
                          {isRtl ? 'حفظ المحطة' : 'Save Station'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Stations List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stations.map((st) => (
                  <div key={st.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm flex items-start gap-4">
                    <img src={st.imageUrl} alt={st.nameAr} className="w-20 h-20 object-cover rounded-sm border border-[#2B2B2B] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[#F4F1E9] truncate">{st.nameAr}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${st.isPublished ? 'bg-emerald-950/60 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                          {st.isPublished ? (isRtl ? 'منشور' : 'Active') : (isRtl ? 'مخفي' : 'Hidden')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#888] mt-1">{st.cityAr} — {st.addressAr}</p>
                      <div className="text-[10px] text-[#C8A45D] mt-2 font-mono">{st.contactPhone}</div>

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#1C1C1C]">
                        <button
                          onClick={() => setEditingStation(st)}
                          className="text-xs text-[#E2C98A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStation(st.id)}
                          className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer ms-3"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CAR WASH & SERVICES */}
          {activeTab === 'carwash' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'مراكز العناية بالمركبات ومغاسل السيارات' : 'Auto Care & Wash Management'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'إدارة باقات الغسيل والنانو سيراميك وفروع الخدمة' : 'Manage wash service packages, detailing, and service branch hubs'}</p>
                </div>
              </div>

              {/* Services Packages CRUD */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                    <span>{isRtl ? 'باقات وخدمات الغسيل' : 'Service Packages'}</span>
                  </h3>
                  <button
                    onClick={() =>
                      setEditingService({
                        nameAr: '',
                        nameEn: '',
                        descriptionAr: '',
                        duration: '15 دقيقة',
                        pricePlaceholder: 'حسب الفئة',
                        featuresAr: ['غسيل آلي متكامل'],
                        isPublished: true,
                        sortOrder: services.length + 1,
                      })
                    }
                    className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#C8A45D] hover:text-[#080808] text-xs font-bold text-[#E2C98A] border border-[#333] rounded transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إضافة باقة جديدة' : 'Add Package'}</span>
                  </button>
                </div>

                {editingService && (
                  <form onSubmit={handleSaveService} className="p-4 bg-[#121212] border border-[#C8A45D]/50 rounded-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'اسم الباقة (عربي)' : 'Package Name'}</label>
                        <input
                          type="text"
                          required
                          value={editingService.nameAr || ''}
                          onChange={(e) => setEditingService({ ...editingService, nameAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'المدة التقديرية' : 'Duration'}</label>
                        <input
                          type="text"
                          value={editingService.duration || ''}
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'الوصف (عربي)' : 'Description'}</label>
                        <textarea
                          rows={2}
                          value={editingService.descriptionAr || ''}
                          onChange={(e) => setEditingService({ ...editingService, descriptionAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رابط صورة الباقة' : 'Image URL'}</label>
                        <input
                          type="text"
                          value={editingService.imageUrl || ''}
                          onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setEditingService(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded">
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded">
                        {isRtl ? 'حفظ الباقة' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm space-y-2">
                      <h4 className="font-bold text-xs text-[#F4F1E9]">{srv.nameAr}</h4>
                      <p className="text-[11px] text-[#888] line-clamp-2">{srv.descriptionAr}</p>
                      <div className="text-[10px] text-[#C8A45D]">{srv.duration}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                        <button onClick={() => setEditingService(srv)} className="text-xs text-[#E2C98A] cursor-pointer">{isRtl ? 'تعديل' : 'Edit'}</button>
                        <button onClick={() => handleDeleteService(srv.id)} className="text-xs text-red-400 cursor-pointer">{isRtl ? 'حذف' : 'Delete'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branches CRUD */}
              <div className="space-y-4 pt-6 border-t border-[#1C1C1C]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#C8A45D]" />
                    <span>{isRtl ? 'فروع ومراكز الخدمة' : 'Service Branches'}</span>
                  </h3>
                  <button
                    onClick={() =>
                      setEditingBranch({
                        nameAr: '',
                        cityAr: 'الرياض',
                        addressAr: '',
                        openingHoursAr: '8:00 AM - 12:00 AM',
                        isPublished: true,
                      })
                    }
                    className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#C8A45D] hover:text-[#080808] text-xs font-bold text-[#E2C98A] border border-[#333] rounded transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إضافة فرع جديد' : 'Add Branch'}</span>
                  </button>
                </div>

                {editingBranch && (
                  <form onSubmit={handleSaveBranch} className="p-4 bg-[#121212] border border-[#C8A45D]/50 rounded-sm space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'اسم المركز (عربي)' : 'Branch Name'}</label>
                        <input
                          type="text"
                          required
                          value={editingBranch.nameAr || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, nameAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'المدينة' : 'City'}</label>
                        <input
                          type="text"
                          required
                          value={editingBranch.cityAr || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, cityAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'العنوان' : 'Address'}</label>
                        <input
                          type="text"
                          value={editingBranch.addressAr || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, addressAr: e.target.value })}
                          className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setEditingBranch(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded">
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded">
                        {isRtl ? 'حفظ الفرع' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {branches.map((br) => (
                    <div key={br.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xs text-[#F4F1E9]">{br.nameAr}</h4>
                        <p className="text-[11px] text-[#888]">{br.cityAr} — {br.addressAr}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingBranch(br)} className="text-xs text-[#E2C98A] cursor-pointer">{isRtl ? 'تعديل' : 'Edit'}</button>
                        <button onClick={() => handleDeleteBranch(br.id)} className="text-xs text-red-400 cursor-pointer">{isRtl ? 'حذف' : 'Delete'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PARTNERS */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'شركاء الأعمال والتحالفات' : 'Commercial Partners'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'إضافة وتعديل وحذف شعارات وأسماء الشركاء' : 'Manage corporate partner logos, titles, and links'}</p>
                </div>
                <button
                  onClick={() =>
                    setEditingPartner({
                      nameAr: '',
                      nameEn: '',
                      categoryAr: 'شريك استراتيجي',
                      websiteUrl: 'https://rmstar.online',
                      displayOrder: partners.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة شريك جديد' : 'Add Partner'}</span>
                </button>
              </div>

              {editingPartner && (
                <form onSubmit={handleSavePartner} className="p-4 bg-[#121212] border border-[#C8A45D]/50 rounded-sm space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'اسم الشريك (عربي)' : 'Partner Name (Ar)'}</label>
                      <input
                        type="text"
                        required
                        value={editingPartner.nameAr || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, nameAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'التصنيف (عربي)' : 'Category'}</label>
                      <input
                        type="text"
                        value={editingPartner.categoryAr || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, categoryAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رابط الشعار أو الصورة (Logo URL)' : 'Logo Image URL'}</label>
                      <input
                        type="text"
                        value={editingPartner.logoUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingPartner(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded">
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded">
                      {isRtl ? 'حفظ الشريك' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners.map((prt) => (
                  <div key={prt.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={prt.logoUrl} alt={prt.nameAr} className="w-12 h-12 object-cover rounded border border-[#222]" />
                      <div>
                        <h4 className="font-bold text-xs text-[#F4F1E9]">{prt.nameAr}</h4>
                        <p className="text-[10px] text-[#888]">{prt.categoryAr}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPartner(prt)} className="text-xs text-[#E2C98A] cursor-pointer">{isRtl ? 'تعديل' : 'Edit'}</button>
                      <button onClick={() => handleDeletePartner(prt.id)} className="text-xs text-red-400 cursor-pointer">{isRtl ? 'حذف' : 'Delete'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: NEWS & PRESS */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'الأخبار والبيانات الصحفية' : 'News & Press Releases'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'إضافة مقالات وتوسعات الشركة ونشرها' : 'Publish corporate developments, media releases, and operational news'}</p>
                </div>
                <button
                  onClick={() =>
                    setEditingNews({
                      titleAr: '',
                      summaryAr: '',
                      contentAr: '',
                      category: 'توسعات وعمليات',
                      publishedDate: new Date().toISOString().split('T')[0],
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة خبر جديد' : 'New Article'}</span>
                </button>
              </div>

              {editingNews && (
                <form onSubmit={handleSaveNews} className="p-4 bg-[#121212] border border-[#C8A45D]/50 rounded-sm space-y-3">
                  <div>
                    <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'عنوان الخبر (عربي)' : 'Title'}</label>
                    <input
                      type="text"
                      required
                      value={editingNews.titleAr || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, titleAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'الموجز / الملخص' : 'Summary'}</label>
                    <textarea
                      rows={2}
                      value={editingNews.summaryAr || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, summaryAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'نص الخبر الكامل' : 'Full Content'}</label>
                    <textarea
                      rows={4}
                      value={editingNews.contentAr || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, contentAr: e.target.value })}
                      className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'التصنيف' : 'Category'}</label>
                      <input
                        type="text"
                        value={editingNews.category || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'رابط الصورة' : 'Image URL'}</label>
                      <input
                        type="text"
                        value={editingNews.imageUrl || ''}
                        onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF] font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingNews(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded">
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded">
                      {isRtl ? 'حفظ ونشر' : 'Save & Publish'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#F4F1E9]">{item.titleAr}</h4>
                      <p className="text-[11px] text-[#888] mt-1 line-clamp-2">{item.summaryAr}</p>
                      <div className="text-[10px] text-[#C8A45D] mt-2">{item.category} • {item.publishedDate}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingNews(item)} className="text-xs text-[#E2C98A] cursor-pointer">{isRtl ? 'تعديل' : 'Edit'}</button>
                      <button onClick={() => handleDeleteNews(item.id)} className="text-xs text-red-400 cursor-pointer ms-2">{isRtl ? 'حذف' : 'Delete'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: CAREERS */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'إدارة الوظائف والفرص المهنية' : 'Careers & Job Postings'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'إضافة وتعديل الشواغر الوظيفية وبريد التقديم' : 'Manage published roles, departments, and applicant recipient email'}</p>
                </div>
                <button
                  onClick={() =>
                    setEditingCareer({
                      titleAr: '',
                      departmentAr: 'العمليات اللوجستية',
                      locationAr: 'الرياض',
                      type: 'دوام كامل',
                      descriptionAr: '',
                      isPublished: true,
                    })
                  }
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة شاغر جديد' : 'Add Role'}</span>
                </button>
              </div>

              {editingCareer && (
                <form onSubmit={handleSaveCareer} className="p-4 bg-[#121212] border border-[#C8A45D]/50 rounded-sm space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'المسمى الوظيفي (عربي)' : 'Role Title'}</label>
                      <input
                        type="text"
                        required
                        value={editingCareer.titleAr || ''}
                        onChange={(e) => setEditingCareer({ ...editingCareer, titleAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'القسم / الإدارة' : 'Department'}</label>
                      <input
                        type="text"
                        value={editingCareer.departmentAr || ''}
                        onChange={(e) => setEditingCareer({ ...editingCareer, departmentAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'الموقع / المدينة' : 'Location'}</label>
                      <input
                        type="text"
                        value={editingCareer.locationAr || ''}
                        onChange={(e) => setEditingCareer({ ...editingCareer, locationAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'نوع الدوام' : 'Type'}</label>
                      <input
                        type="text"
                        value={editingCareer.type || ''}
                        onChange={(e) => setEditingCareer({ ...editingCareer, type: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-[#AAA] block mb-1">{isRtl ? 'الوصف الوظيفي والمهام' : 'Job Description'}</label>
                      <textarea
                        rows={3}
                        value={editingCareer.descriptionAr || ''}
                        onChange={(e) => setEditingCareer({ ...editingCareer, descriptionAr: e.target.value })}
                        className="w-full bg-[#181818] border border-[#333] rounded px-3 py-2 text-xs text-[#FFF]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditingCareer(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded">
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded">
                      {isRtl ? 'حفظ الشاغر' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {careers.map((cr) => (
                  <div key={cr.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#F4F1E9]">{cr.titleAr}</h4>
                      <p className="text-[11px] text-[#888] mt-1">{cr.descriptionAr}</p>
                      <div className="text-[10px] text-[#C8A45D] mt-2">{cr.departmentAr} • {cr.locationAr} • {cr.type}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingCareer(cr)} className="text-xs text-[#E2C98A] cursor-pointer">{isRtl ? 'تعديل' : 'Edit'}</button>
                      <button onClick={() => handleDeleteCareer(cr.id)} className="text-xs text-red-400 cursor-pointer ms-2">{isRtl ? 'حذف' : 'Delete'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: LEGAL & POLICIES */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'الصفحات القانونية والسياسات' : 'Legal & Policies CMS'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'تعديل سياسة الخصوصية والشروط والأحكام' : 'Customize Privacy Policy, Terms of Service, and Copyright notes'}</p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  className="px-4 py-2 bg-[#C8A45D] text-[#080808] font-bold text-xs rounded-sm hover:bg-[#E2C98A] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ السياسات' : 'Save'}</span>
                </button>
              </div>

              <div className="bg-[#101010] border border-[#222] p-6 rounded-sm space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'نص سياسة الخصوصية الكامل (Privacy Policy)' : 'Privacy Policy Text'}</label>
                  <textarea
                    rows={6}
                    value={draftSettings.privacyTextAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, privacyTextAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] leading-relaxed"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-[#222]">
                  <label className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'نص الشروط والأحكام الكامل (Terms of Service)' : 'Terms of Service Text'}</label>
                  <textarea
                    rows={6}
                    value={draftSettings.termsTextAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, termsTextAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] leading-relaxed"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-[#222]">
                  <label className="text-xs font-bold text-[#A6A6A6]">{isRtl ? 'سطر حقوق الملكية في تذييل الموقع (Footer Copyright)' : 'Footer Copyright'}</label>
                  <input
                    type="text"
                    value={draftSettings.footerCopyrightAr || ''}
                    onChange={(e) => setDraftSettings({ ...draftSettings, footerCopyrightAr: e.target.value })}
                    className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: QUOTATIONS */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'طلبات عروض أسعار توريد الديزل' : 'Diesel Quotation Submissions'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'متابعة طلبات الشركات والمصانع وتغيير حالتها' : 'Track incoming procurement requests from industrial clients'}</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#181818] text-[#C8A45D] border border-[#333]">
                  {quotations.length} {isRtl ? 'طلب مسجل' : 'records'}
                </span>
              </div>

              {quotations.length === 0 ? (
                <div className="text-center py-16 bg-[#101010] border border-[#222] rounded-sm text-[#888] text-sm">
                  {isRtl ? 'لا توجد طلبات عروض أسعار مسجلة حتى الآن.' : 'No quotation requests submitted yet.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {quotations.map((q) => (
                    <div key={q.id} className="p-5 bg-[#101010] border border-[#222] rounded-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#F4F1E9]">{q.companyName}</span>
                          <span className="text-xs text-[#777]">({q.contactName})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as QuotationRequest['status'])}
                            className="bg-[#181818] border border-[#333] text-[11px] text-[#E2C98A] rounded px-2 py-1 font-bold"
                          >
                            <option value="pending">{isRtl ? 'قيد المراجعة' : 'Pending'}</option>
                            <option value="reviewing">{isRtl ? 'جاري الفحص' : 'Reviewing'}</option>
                            <option value="contacted">{isRtl ? 'تم التواصل' : 'Contacted'}</option>
                            <option value="archived">{isRtl ? 'مؤرشف' : 'Archived'}</option>
                          </select>
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            className="p-1 text-[#888] hover:text-red-400 cursor-pointer"
                            title={isRtl ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-[#1C1C1C]">
                        <div>
                          <span className="text-[#666] block text-[10px]">{isRtl ? 'المنتج والكمية:' : 'Product & Qty:'}</span>
                          <span className="text-[#C8A45D] font-mono font-bold">{q.productRequested} ({q.quantity} {q.unit})</span>
                        </div>
                        <div>
                          <span className="text-[#666] block text-[10px]">{isRtl ? 'رقم الهاتف:' : 'Phone:'}</span>
                          <a href={`tel:${q.telephoneNumber}`} className="text-[#CCC] hover:underline font-mono">{q.telephoneNumber}</a>
                        </div>
                        <div>
                          <span className="text-[#666] block text-[10px]">{isRtl ? 'البريد:' : 'Email:'}</span>
                          <a href={`mailto:${q.businessEmail}`} className="text-[#CCC] hover:underline font-mono">{q.businessEmail}</a>
                        </div>
                        <div>
                          <span className="text-[#666] block text-[10px]">{isRtl ? 'المدينة:' : 'City:'}</span>
                          <span className="text-[#CCC]">{q.city || 'غير محدد'}</span>
                        </div>
                      </div>

                      {q.additionalRequirements && (
                        <div className="p-2.5 bg-[#141414] rounded text-[11px] text-[#AAA] border border-[#222]">
                          <span className="text-[#777] block text-[10px] mb-0.5">{isRtl ? 'ملاحظات العميل:' : 'Client Notes:'}</span>
                          {q.additionalRequirements}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 13: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'رسائل نموذج اتصل بنا' : 'Contact Inquiries'}</h2>
                  <p className="text-xs text-[#888]">{isRtl ? 'الاستفسارات والرسائل الواردة من عملاء وزوار الموقع' : 'Review incoming visitor messages and contact requests'}</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#181818] text-[#C8A45D] border border-[#333]">
                  {messages.length} {isRtl ? 'رسالة' : 'messages'}
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 bg-[#101010] border border-[#222] rounded-sm text-[#888] text-sm">
                  {isRtl ? 'لا توجد رسائل اتصال جديدة.' : 'No messages received.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="p-5 bg-[#101010] border border-[#222] rounded-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-[#F4F1E9]">{m.subject}</h4>
                          <span className="text-xs text-[#777]">{m.fullName} • {m.email} {m.phone ? `• ${m.phone}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={m.status}
                            onChange={(e) => handleUpdateMessageStatus(m.id, e.target.value as ContactMessage['status'])}
                            className="bg-[#181818] border border-[#333] text-[11px] text-[#E2C98A] rounded px-2 py-1 font-bold"
                          >
                            <option value="new">{isRtl ? 'جديدة' : 'New'}</option>
                            <option value="read">{isRtl ? 'مقروءة' : 'Read'}</option>
                            <option value="replied">{isRtl ? 'تم الرد' : 'Replied'}</option>
                            <option value="archived">{isRtl ? 'مؤرشفة' : 'Archived'}</option>
                          </select>
                          <button onClick={() => handleDeleteMessage(m.id)} className="p-1 text-[#888] hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#141414] rounded text-xs text-[#CCC] border border-[#222] leading-relaxed">
                        {m.message}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#666] pt-1 font-mono">
                        <span>{new Date(m.createdAt).toLocaleString()}</span>
                        <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="text-[#C8A45D] hover:underline flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'الرد عبر البريد' : 'Reply via Email'}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 14: SYSTEM & CREDENTIALS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="border-b border-[#1C1C1C] pb-3">
                <h2 className="text-xl font-black text-[#F4F1E9]">{isRtl ? 'إعدادات النظام وأمان لوحة التحكم' : 'System Security & Access Credentials'}</h2>
                <p className="text-xs text-[#888]">{isRtl ? 'بيانات الدخول المصرح بها واستعادة البيانات الافتراضية' : 'Manage master credentials and restore initial seed data'}</p>
              </div>

              {/* Master Credentials Box */}
              <div className="p-6 bg-[#101010] border border-[#222] rounded-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E2C98A]">
                  <KeyRound className="w-4 h-4 text-[#C8A45D]" />
                  <span>{isRtl ? 'بيانات الدخول إلى لوحة التحكم' : 'Master Control Panel Credentials'}</span>
                </div>
                <p className="text-xs text-[#888] leading-relaxed">
                  {isRtl
                    ? 'وفقاً لطلبك، تم إلغاء جميع أنواع تسجيل الدخول الأخرى وتعيين اسم المستخدم وكلمة المرور المحددة حصرياً:'
                    : 'All third-party auth providers have been removed in favor of direct credentials:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A6A6A6]">{isRtl ? 'اسم المستخدم (Username)' : 'Username'}</label>
                    <input
                      type="text"
                      value={draftSettings.adminUsername || DEFAULT_ADMIN_USERNAME}
                      onChange={(e) => setDraftSettings({ ...draftSettings, adminUsername: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#A6A6A6]">{isRtl ? 'كلمة المرور (Password)' : 'Password'}</label>
                    <input
                      type="text"
                      value={draftSettings.adminPassword || DEFAULT_ADMIN_PASSWORD}
                      onChange={(e) => setDraftSettings({ ...draftSettings, adminPassword: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-sm px-3 py-2 text-xs text-[#F4F1E9] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveAllSettings}
                    className="px-4 py-2 bg-[#C8A45D] hover:bg-[#E2C98A] text-[#080808] font-bold text-xs rounded-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تحديث وحفظ بيانات الدخول' : 'Update Credentials'}</span>
                  </button>
                </div>
              </div>

              {/* Factory Defaults Reset */}
              <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-sm space-y-3">
                <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{isRtl ? 'استعادة البيانات الافتراضية للشركة (Reset)' : 'Factory Reset'}</span>
                </h4>
                <p className="text-xs text-[#AAA] leading-relaxed">
                  {isRtl
                    ? 'في حال رغبتك بالرجوع إلى البيانات الأساسية المصممة لشركة آر إم ستار (المحطات، باقات المغاسل، الأرقام الرسمية، المقالات، والمحتوى)، اضغط على الزر أدناه.'
                    : 'Resets all settings, fuel stations, and car wash branches back to original seed defaults.'}
                </p>
                <button
                  onClick={handleFactoryReset}
                  className="px-4 py-2 bg-red-900/40 hover:bg-red-800/80 border border-red-500/50 text-red-200 text-xs font-bold rounded-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'استعادة البيانات الافتراضية الآن' : 'Restore Defaults Now'}</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
