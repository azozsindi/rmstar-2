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
import { ImageUploadField } from '../../components/common/ImageUploadField';
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
import { Logo } from '../../components/common/Logo';

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
  | 'images'
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

  interface NavGroup {
    title: string;
    items: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[];
  }

  const navGroups: NavGroup[] = [
    {
      title: isRtl ? 'المؤشرات والوسائط' : 'Overview & Media',
      items: [
        { id: 'overview', label: isRtl ? 'نظرة عامة والتوجيه السريع' : 'Overview & Jump Map', icon: LayoutDashboard },
        { id: 'images', label: isRtl ? 'معرض وتحكم جميع الصور' : 'All Site Images & Sliders', icon: ImageIcon },
      ],
    },
    {
      title: isRtl ? 'قطاعات الأعمال والشرائح' : 'Business & Services',
      items: [
        { id: 'hero', label: isRtl ? 'الرئيسية وشرائح القطاعات' : 'Homepage & Sectors', icon: Sparkles },
        { id: 'carwash', label: isRtl ? 'باقات وشرائح المغاسل' : 'Car Wash Packages', icon: Car, badge: services.length },
        { id: 'stations', label: isRtl ? 'محطات الوقود' : 'Fuel Stations', icon: Layers, badge: stations.length },
        { id: 'diesel', label: isRtl ? 'توريد ونقل الديزل' : 'Diesel Supply', icon: Fuel },
      ],
    },
    {
      title: isRtl ? 'المحتوى المؤسسي' : 'Corporate Identity',
      items: [
        { id: 'company', label: isRtl ? 'بيانات الشركة والهوية' : 'Company & Brand', icon: Building },
        { id: 'about', label: isRtl ? 'من نحن والرؤية' : 'About Us & Vision', icon: Info },
        { id: 'partners', label: isRtl ? 'شركاء الأعمال' : 'Partners', icon: Handshake, badge: partners.length },
        { id: 'news', label: isRtl ? 'الأخبار والبيانات' : 'News & Press', icon: Newspaper, badge: news.length },
        { id: 'careers', label: isRtl ? 'الشواغر والوظائف' : 'Careers', icon: Briefcase, badge: careers.length },
        { id: 'legal', label: isRtl ? 'الشروط والسياسات' : 'Legal & Policies', icon: FileText },
      ],
    },
    {
      title: isRtl ? 'المعاملات والتواصل' : 'Inquiries & Leads',
      items: [
        { id: 'quotes', label: isRtl ? 'طلبات عروض الأسعار' : 'Quotation Requests', icon: FileSpreadsheet, badge: pendingQuotes },
        { id: 'messages', label: isRtl ? 'رسائل اتصل بنا' : 'Contact Messages', icon: Mail, badge: newMessages },
      ],
    },
    {
      title: isRtl ? 'الأمان والإدارة' : 'System & Security',
      items: [
        { id: 'system', label: isRtl ? 'إدارة الدخول والنظام' : 'System & Security', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F1E9] flex flex-col font-sans selection:bg-[#C8A45D]/30" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-md border-b border-[#1F1F1F] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" settings={draftSettings} showSubtitle={false} className="hidden sm:flex border-e border-[#222] pe-4 me-1" />
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
        <aside className="w-full md:w-64 bg-[#0A0A0A] border-b md:border-b-0 md:border-e border-[#1C1C1C] p-3 sm:p-4 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto space-x-1 md:space-x-0 md:space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1 shrink-0 md:w-full">
              <div className="hidden md:block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C8A45D]/80 border-b border-[#181818] mb-1">
                {group.title}
              </div>
              <div className="flex flex-row md:flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all cursor-pointer shrink-0 ${
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
              </div>
            </div>
          ))}
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

              {/* Quick Actions Matrix - Full Site Navigator */}
              <div className="bg-[#101010] border border-[#1F1F1F] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#F4F1E9] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'خريطة التوجيه السريع — أين تتوجه لتعديل أي عنصر' : 'Quick Site Navigation Map'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777] mt-0.5">
                      {isRtl ? 'اضغط مباشرة على أي قسم للوصول الفوري وتعديل بياناته وصوره' : 'Click on any card to jump directly to its editing panel'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => setActiveTab('images')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#C8A45D]/40 hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-[#E2C98A] font-bold">
                      <ImageIcon className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'معرض وتحكم جميع الصور' : 'All Site Images'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'تعديل كافة صور الموقع في شاشة واحدة' : 'Control all website images in one place'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('carwash')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Car className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'باقات وشرائح المغاسل' : 'Car Wash Packages'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'تعديل شرائح باقات العناية والصور' : 'Edit service packages, features & slides'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('hero')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'الرئيسية والقطاعات الثلاثة' : 'Hero & 3 Sectors'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'عنوان الهيرو، العدادات، وشرائح القطاعات' : 'Hero title, stats & sector cards'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('diesel')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Fuel className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'توريد ونقل الديزل' : 'Diesel Supply'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'المواصفات الفنية، الأسطول، والصور' : 'Quality specs, fleet and imagery'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('stations')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Layers className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'شبكة محطات الوقود' : 'Fuel Stations'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'إضافة وتعديل المحطات والخرائط' : 'Manage stations, services & locations'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('company')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Building className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'بيانات الشركة والاتصال' : 'Company & Contact'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'أرقام الهاتف، الواتساب، وشريط الإعلان' : 'Phones, WhatsApp & announcement ticker'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('about')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Info className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'من نحن والرؤية' : 'About Us & Vision'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'الرسالة، القيم المؤسسية، وصورة الصرح' : 'Mission, corporate values & photo'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('system')}
                    className="p-3.5 bg-[#161616] hover:bg-[#1E1E1E] border border-[#282828] hover:border-[#C8A45D] rounded-sm text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#F4F1E9] font-bold group-hover:text-[#E2C98A]">
                      <Settings className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'أمان النظام وبيانات الدخول' : 'Security & Login'}</span>
                    </div>
                    <div className="text-[11px] text-[#888] mt-1.5">{isRtl ? 'تعديل اسم المستخدم وكلمة المرور' : 'Update admin username & password'}</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ALL SITE IMAGES & SLIDERS MASTER CONTROL */}
          {activeTab === 'images' && (
            <div className="space-y-8">
              <div className="border-b border-[#1C1C1C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#F4F1E9] flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-[#C8A45D]" />
                    <span>{isRtl ? 'معرض وتحكم جميع صور وشرائح الموقع' : 'All Site Images & Sliders Master Control'}</span>
                  </h2>
                  <p className="text-xs text-[#888] mt-1">
                    {isRtl
                      ? 'تحكم شامل وتعديل فوري لجميع صور الموقع، خلفيات الهيرو، شرائح القطاعات، باقات المغاسل، ومحطات الوقود مع معاينة مباشرة.'
                      : 'Comprehensive visual center to review and update all website images, hero backdrops, sector slides, and packages.'}
                  </p>
                </div>
                <button
                  onClick={handleSaveAllSettings}
                  disabled={savingSettings}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-xs rounded-sm hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ كافة الصور' : 'Save All Images')}</span>
                </button>
              </div>

              {/* 0. Website Logo & Brand Emblem */}
              <div className="bg-[#101010] border border-[#C8A45D]/40 rounded-sm p-6 space-y-4 shadow-[0_4px_20px_rgba(200,164,93,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F1F1F] pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'شعار وهوية الموقع (Website Logo & Identity)' : 'Website Logo & Brand Graphics'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'رفع وتغيير شعار الشركة مباشرة من ألبوم/استوديو الصور بهاتفك أو حاسوبك — يتم تطبيقه فوراً في الهيدر والفوتر ولوحة التحكم' : 'Upload company logo image directly from device photo library or studio'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#181818] text-[#C8A45D] font-mono rounded border border-[#C8A45D]/30 w-fit">
                    {isRtl ? 'مباشر من الاستوديو (PNG / SVG / JPG)' : 'Direct from Studio'}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <ImageUploadField
                      label={isRtl ? 'صورة الشعار (رفع مباشر من الاستوديو أو إدخال رابط)' : 'Logo Image (Upload from studio)'}
                      value={draftSettings.logoImageUrl || ''}
                      onChange={(val) => {
                        setDraftSettings((prev) => ({ ...prev, logoImageUrl: val }));
                        showFeedback(isRtl ? 'تم تحديث الشعار من الاستوديو! اضغط حفظ في الأعلى للاعتماد' : 'Logo updated! Click Save Changes above.');
                      }}
                      aspectRatio="landscape"
                      placeholderText={isRtl ? 'اضغط لاختيار الشعار من الاستوديو / ألبوم الصور' : 'Select logo image from studio library'}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#888]">
                          {isRtl ? 'اسم البراند النصي بجانب الشعار' : 'Brand Text Label'}
                        </label>
                        <input
                          type="text"
                          value={draftSettings.logoText || ''}
                          onChange={(e) => setDraftSettings({ ...draftSettings, logoText: e.target.value })}
                          placeholder="RM STAR"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-1.5 text-xs text-[#F4F1E9] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#888]">
                          {isRtl ? 'الوصف الفرعي للشعار' : 'Logo Subtitle'}
                        </label>
                        <input
                          type="text"
                          value={draftSettings.logoSubtitle || ''}
                          onChange={(e) => setDraftSettings({ ...draftSettings, logoSubtitle: e.target.value })}
                          placeholder="Energy • Stations • Care"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-1.5 text-xs text-[#F4F1E9] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#252525] rounded-sm p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                      <span className="text-[11px] font-bold text-[#AAA] flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>{isRtl ? 'معاينة حية للشعار الحالي' : 'Live Logo Preview'}</span>
                      </span>
                      {draftSettings.logoImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDraftSettings((prev) => ({ ...prev, logoImageUrl: '' }));
                            showFeedback(isRtl ? 'تمت العودة لنجمة آر إم ستار الهندسية الافتراضية' : 'Restored default geometric star logo');
                          }}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          {isRtl ? 'استعادة الشعار الافتراضي' : 'Reset to default'}
                        </button>
                      )}
                    </div>

                    <div className="bg-[#121212] border border-[#1E1E1E] rounded p-4 flex flex-col items-center justify-center min-h-[110px] space-y-2">
                      <Logo size="lg" settings={draftSettings} />
                    </div>

                    <div className="text-[10px] text-[#777] leading-relaxed">
                      {isRtl
                        ? 'إذا رفعت صورة شعار جديدة ستظهر مباشرة في أعلى وأسفل كافة صفحات الموقع ولوحة التحكم. إذا فرّغت الصورة، سيعود تلقائياً الشعار الذهبي الهندسي الأيقوني.'
                        : 'Uploaded image renders across header, footer, and admin header. Clearing the image restores default geometric emblem.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Hero Backdrop Image */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '1. صورة خلفية واجهة الهيرو الرئيسية (Hero Background)' : '1. Hero Main Background Image'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'الصورة الكبرى في أعلى الصفحة الرئيسية — يمكنك اختيار صورة مباشرة من الاستوديو أو ألبوم الصور بهاتفك' : 'Main hero visual depicting premium commercial fuel tanker fleet'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#181818] text-[#C8A45D] font-mono rounded border border-[#C8A45D]/30">
                    2560 x 1440 px
                  </span>
                </div>

                <ImageUploadField
                  label={isRtl ? 'صورة الهيرو الرئيسية (رفع من الاستوديو / الجهاز)' : 'Main Hero Image (Upload from studio)'}
                  value={draftSettings.heroImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2560&q=95'}
                  onChange={(val) => {
                    setDraftSettings((prev) => ({ ...prev, heroImageUrl: val }));
                    showFeedback(isRtl ? 'تم تحديث صورة الهيرو من الاستوديو! اضغط حفظ في الأعلى للتأكيد' : 'Hero image updated! Click save to persist.');
                  }}
                  aspectRatio="banner"
                  placeholderText={isRtl ? 'اضغط لاختيار صورة الهيرو من استوديو الصور بالهاتف أو جهازك' : 'Select hero image from photo gallery'}
                />

                {/* Presets */}
                <div className="pt-2 border-t border-[#1C1C1C]">
                  <span className="text-[11px] text-[#888] block mb-1.5">{isRtl ? 'نماذج مقترحة سريعة بجودة 4K فائقة الوضوح (اضغط للتطبيق الفوري):' : 'Suggested Ultra-HD presets (click to apply):'}</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDraftSettings({ ...draftSettings, heroImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2560&q=95' })}
                      className="px-2.5 py-1 text-[10px] bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] hover:border-[#C8A45D] text-[#CCC] hover:text-[#E2C98A] rounded-sm transition-all cursor-pointer"
                    >
                      {isRtl ? 'صهريج ديزل فائق (شاحنة أوروبية معتمدة)' : 'Heavy Diesel Tanker'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftSettings({ ...draftSettings, heroImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2560&q=95' })}
                      className="px-2.5 py-1 text-[10px] bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] hover:border-[#C8A45D] text-[#CCC] hover:text-[#E2C98A] rounded-sm transition-all cursor-pointer"
                    >
                      {isRtl ? 'شاحنات نقل لوجستي سريعة' : 'Fleet Logistics'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftSettings({ ...draftSettings, heroImageUrl: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=2560&q=95' })}
                      className="px-2.5 py-1 text-[10px] bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] hover:border-[#C8A45D] text-[#CCC] hover:text-[#E2C98A] rounded-sm transition-all cursor-pointer"
                    >
                      {isRtl ? 'بنية تحتية لتوزيع الوقود' : 'Terminal Distribution'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Three Strategic Sectors Images (Homepage) */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-6">
                <div className="border-b border-[#1F1F1F] pb-3">
                  <h3 className="text-sm font-bold text-[#E2C98A]">{isRtl ? '2. صور شرائح قطاعات الأعمال الثلاثة (الصفحة الرئيسية)' : '2. Core Business Sectors Images'}</h3>
                  <p className="text-[11px] text-[#777]">{isRtl ? 'الشرائح المعروضة في قسم قطاعات آر إم ستار الاستراتيجية — رفع صور من الاستوديو' : 'Cards shown in RM STAR strategic portfolio section'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sector 1: Diesel */}
                  <ImageUploadField
                    label={isRtl ? 'قطاع 1: نقل وتوريد الديزل' : 'Sector 1: Diesel Logistics'}
                    value={draftSettings.sector1ImageUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, sector1ImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة قطاع الديزل!' : 'Diesel sector image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة من الاستوديو لقطاع الديزل' : 'Select diesel image from photo library'}
                  />

                  {/* Sector 2: Stations */}
                  <ImageUploadField
                    label={isRtl ? 'قطاع 2: شبكة محطات الوقود' : 'Sector 2: Retail Stations'}
                    value={draftSettings.sector2ImageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, sector2ImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة قطاع المحطات!' : 'Stations sector image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة من الاستوديو لمحطات الوقود' : 'Select station image from photo library'}
                  />

                  {/* Sector 3: Car Wash */}
                  <ImageUploadField
                    label={isRtl ? 'قطاع 3: العناية بالمركبات والمغاسل' : 'Sector 3: Auto Detailing'}
                    value={draftSettings.sector3ImageUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, sector3ImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة قطاع المغاسل!' : 'Carwash sector image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة من الاستوديو لمراكز المغاسل' : 'Select auto detailing image from photo library'}
                  />
                </div>
              </div>

              {/* 3. Car Wash Services / Packages Slides */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '3. صور شرائح باقات العناية بالمركبات ومغاسل السيارات' : '3. Car Wash Packages Slides Images'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'الشرائح المعروضة في الصفحة الرئيسية وقسم المغاسل — يمكنك تغيير صورة كل باقة مباشرة برفع صورة من الاستوديو' : 'Visuals displayed on the homepage car wash packages slider'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('carwash')}
                    className="text-xs font-bold text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إدارة تفاصيل الباقات كاملة &larr;' : 'Manage Full Packages &rarr;'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {services.map((srv) => (
                    <div key={srv.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F1E9] truncate max-w-[180px]">{isRtl ? srv.nameAr : srv.nameEn}</span>
                        <span className="text-[10px] text-[#C8A45D] font-mono">{srv.duration}</span>
                      </div>
                      <ImageUploadField
                        label={isRtl ? `صورة: ${srv.nameAr}` : `Photo: ${srv.nameEn}`}
                        value={srv.imageUrl || 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'}
                        onChange={async (newUrl) => {
                          const updated = { ...srv, imageUrl: newUrl };
                          setServices((prev) =>
                            prev.map((item) => (item.id === srv.id ? updated : item))
                          );
                          await saveCarWashService(updated);
                          showFeedback(isRtl ? `تم تحديث وحفظ صورة "${srv.nameAr}" من الاستوديو!` : 'Package image updated from gallery!');
                        }}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة الباقة من الاستوديو' : 'Select package photo from photo library'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Diesel Supply & About Images */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-6">
                <div className="border-b border-[#1F1F1F] pb-3">
                  <h3 className="text-sm font-bold text-[#E2C98A]">{isRtl ? '4. صور صفحات توريد الديزل ومن نحن' : '4. Diesel Supply & About Page Visuals'}</h3>
                  <p className="text-[11px] text-[#777]">{isRtl ? 'صور البنية التحتية، أسطول النقل، والصرح المؤسسي — رفع مباشر من الاستوديو' : 'Infrastructure, logistics fleet and headquarters visuals'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Diesel Specs */}
                  <ImageUploadField
                    label={isRtl ? 'صورة المواصفات الفنية للديزل' : 'Diesel Specs Visual'}
                    value={draftSettings.dieselSpecsImageUrl || 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=1200&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, dieselSpecsImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة مواصفات الديزل!' : 'Diesel specs image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة المواصفات من الاستوديو' : 'Select specs image from library'}
                  />

                  {/* Diesel Fleet */}
                  <ImageUploadField
                    label={isRtl ? 'صورة أسطول الصهاريج والنقل' : 'Fleet Logistics Visual'}
                    value={draftSettings.dieselFleetImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, dieselFleetImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة أسطول الديزل!' : 'Diesel fleet image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة الأسطول من الاستوديو' : 'Select fleet image from library'}
                  />

                  {/* About Page Image */}
                  <ImageUploadField
                    label={isRtl ? 'صورة صفحة من نحن والرؤية' : 'About Us Narrative Visual'}
                    value={draftSettings.aboutImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
                    onChange={(val) => {
                      setDraftSettings((prev) => ({ ...prev, aboutImageUrl: val }));
                      showFeedback(isRtl ? 'تم تحديث صورة من نحن!' : 'About image updated!');
                    }}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة من نحن من الاستوديو' : 'Select about image from library'}
                  />
                </div>
              </div>

              {/* 5. Fuel Stations Gallery */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '5. صور شبكة محطات الوقود' : '5. Fuel Stations Network Photos'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'تعديل الصور المعروضة لبطاقات ومواقع محطات الوقود — يمكنك استبدال أي صورة من الاستوديو مباشرة' : 'Update imagery displayed across the fuel station cards'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('stations')}
                    className="text-xs font-bold text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إدارة المحطات كاملة &larr;' : 'Manage Stations &rarr;'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {stations.map((st) => (
                    <div key={st.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F1E9] truncate max-w-[180px]">{isRtl ? st.nameAr : st.nameEn}</span>
                        <span className="text-[10px] text-[#888]">{isRtl ? st.cityAr : st.cityEn}</span>
                      </div>
                      <ImageUploadField
                        label={isRtl ? `صورة: ${st.nameAr}` : `Photo: ${st.nameEn}`}
                        value={st.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'}
                        onChange={async (newUrl) => {
                          const updated = { ...st, imageUrl: newUrl };
                          setStations((prev) =>
                            prev.map((item) => (item.id === st.id ? updated : item))
                          );
                          await saveStation(updated);
                          showFeedback(isRtl ? `تم تحديث صورة محطة "${st.nameAr}" من الاستوديو وحفظها بنجاح!` : 'Station photo updated from gallery!');
                        }}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة المحطة من الاستوديو' : 'Select station photo from photo library'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Car Wash Branches Gallery */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '6. صور فروع ومراكز المغاسل' : '6. Car Wash Branches Photos'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'تعديل الصور المعروضة لمراكز وفروع المغاسل والعناية بالمركبات من الاستوديو' : 'Update branches imagery from photo library'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('carwash')}
                    className="text-xs font-bold text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إدارة الفروع &larr;' : 'Manage Branches &rarr;'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {branches.map((br) => (
                    <div key={br.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F1E9] truncate max-w-[180px]">{isRtl ? br.nameAr : br.nameEn}</span>
                        <span className="text-[10px] text-[#888]">{isRtl ? br.cityAr : br.cityEn}</span>
                      </div>
                      <ImageUploadField
                        label={isRtl ? `صورة فرع: ${br.nameAr}` : `Branch: ${br.nameEn}`}
                        value={br.imageUrl || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80'}
                        onChange={async (newUrl) => {
                          const updated = { ...br, imageUrl: newUrl };
                          setBranches((prev) =>
                            prev.map((item) => (item.id === br.id ? updated : item))
                          );
                          await saveCarWashBranch(updated);
                          showFeedback(isRtl ? `تم تحديث صورة الفرع "${br.nameAr}" من الاستوديو!` : 'Branch photo updated from gallery!');
                        }}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة الفرع من الاستوديو' : 'Select branch photo from library'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Strategic Partners Logos */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '7. شعارات وصور الشركاء' : '7. Strategic Partner Logos'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'تحديث شعارات الشركاء برفع الشعار أو الصورة مباشرة من الاستوديو' : 'Update partner logos from photo library'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('partners')}
                    className="text-xs font-bold text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إدارة الشركاء &larr;' : 'Manage Partners &rarr;'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {partners.map((prt) => (
                    <div key={prt.id} className="bg-[#141414] border border-[#262626] rounded-sm p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F1E9] truncate max-w-[140px]">{isRtl ? prt.nameAr : prt.nameEn}</span>
                      </div>
                      <ImageUploadField
                        label={isRtl ? `شعار: ${prt.nameAr}` : `Logo: ${prt.nameEn}`}
                        value={prt.logoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'}
                        onChange={async (newUrl) => {
                          const updated = { ...prt, logoUrl: newUrl };
                          setPartners((prev) =>
                            prev.map((item) => (item.id === prt.id ? updated : item))
                          );
                          await savePartner(updated);
                          showFeedback(isRtl ? `تم تحديث شعار "${prt.nameAr}" من الاستوديو!` : 'Partner logo updated!');
                        }}
                        aspectRatio="square"
                        placeholderText={isRtl ? 'اختر الشعار من الاستوديو' : 'Select logo from library'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. News Articles Images */}
              <div className="bg-[#101010] border border-[#222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? '8. صور مقالات وأخبار الشركة' : '8. News & Press Articles Images'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'تحديث الصور المصاحبة للأخبار والتوسعات برفع صورة مباشرة من الاستوديو' : 'Update news article imagery from photo library'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs font-bold text-[#C8A45D] hover:underline cursor-pointer"
                  >
                    {isRtl ? 'إدارة الأخبار &larr;' : 'Manage News &rarr;'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {news.map((item) => (
                    <div key={item.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F4F1E9] truncate max-w-[200px]">{isRtl ? item.titleAr : item.titleEn}</span>
                      </div>
                      <ImageUploadField
                        label={isRtl ? `صورة المقال` : `Article Visual`}
                        value={item.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'}
                        onChange={async (newUrl) => {
                          const updated = { ...item, imageUrl: newUrl };
                          setNews((prev) =>
                            prev.map((n) => (n.id === item.id ? updated : n))
                          );
                          await saveNewsArticle(updated);
                          showFeedback(isRtl ? `تم تحديث صورة الخبر من الاستوديو!` : 'Article image updated!');
                        }}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة المقال من الاستوديو' : 'Select article photo from library'}
                      />
                    </div>
                  ))}
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

              {/* Website Logo & Visual Identity */}
              <div className="bg-[#101010] border border-[#C8A45D]/40 rounded-sm p-6 space-y-4 shadow-[0_4px_20px_rgba(200,164,93,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F1F1F] pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#E2C98A] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                      <span>{isRtl ? 'شعار وهوية الموقع (Website Logo & Identity)' : 'Website Logo & Brand Graphics'}</span>
                    </h3>
                    <p className="text-[11px] text-[#777]">
                      {isRtl ? 'يمكنك رفع شعار جديد من ألبوم/استوديو الصور بهاتفك أو حاسوبك في أي وقت — التعديل فوري وشامل لكافة صفحات الموقع' : 'Upload and replace the official brand logo from device library'}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#181818] text-[#C8A45D] font-mono rounded border border-[#C8A45D]/30 w-fit">
                    {isRtl ? 'رفع مباشر من الاستوديو' : 'Direct Photo Upload'}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <ImageUploadField
                      label={isRtl ? 'صورة الشعار (رفع مباشر من الاستوديو أو إدخال رابط)' : 'Logo Image (Upload from studio)'}
                      value={draftSettings.logoImageUrl || ''}
                      onChange={(val) => {
                        setDraftSettings((prev) => ({ ...prev, logoImageUrl: val }));
                        showFeedback(isRtl ? 'تم تحديث الشعار من الاستوديو! اضغط حفظ في الأعلى للاعتماد' : 'Logo updated! Click Save Changes above.');
                      }}
                      aspectRatio="landscape"
                      placeholderText={isRtl ? 'اضغط لاختيار الشعار من الاستوديو / ألبوم الصور' : 'Select logo image from studio library'}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#888]">
                          {isRtl ? 'اسم البراند النصي بجانب الشعار' : 'Brand Text Label'}
                        </label>
                        <input
                          type="text"
                          value={draftSettings.logoText || ''}
                          onChange={(e) => setDraftSettings({ ...draftSettings, logoText: e.target.value })}
                          placeholder="RM STAR"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-1.5 text-xs text-[#F4F1E9] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#888]">
                          {isRtl ? 'الوصف الفرعي للشعار' : 'Logo Subtitle'}
                        </label>
                        <input
                          type="text"
                          value={draftSettings.logoSubtitle || ''}
                          onChange={(e) => setDraftSettings({ ...draftSettings, logoSubtitle: e.target.value })}
                          placeholder="Energy • Stations • Care"
                          className="w-full bg-[#161616] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm px-3 py-1.5 text-xs text-[#F4F1E9] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#252525] rounded-sm p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                      <span className="text-[11px] font-bold text-[#AAA] flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#C8A45D]" />
                        <span>{isRtl ? 'معاينة حية للشعار الحالي' : 'Live Logo Preview'}</span>
                      </span>
                      {draftSettings.logoImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDraftSettings((prev) => ({ ...prev, logoImageUrl: '' }));
                            showFeedback(isRtl ? 'تمت العودة لنجمة آر إم ستار الهندسية الافتراضية' : 'Restored default geometric star logo');
                          }}
                          className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                        >
                          {isRtl ? 'استعادة الشعار الافتراضي' : 'Reset to default'}
                        </button>
                      )}
                    </div>

                    <div className="bg-[#121212] border border-[#1E1E1E] rounded p-4 flex flex-col items-center justify-center min-h-[110px] space-y-2">
                      <Logo size="lg" settings={draftSettings} />
                    </div>

                    <div className="text-[10px] text-[#777] leading-relaxed">
                      {isRtl
                        ? 'إذا رفعت صورة شعار جديدة ستظهر مباشرة في أعلى وأسفل كافة صفحات الموقع ولوحة التحكم. إذا فرّغت الصورة، سيعود تلقائياً الشعار الذهبي الهندسي الأيقوني.'
                        : 'Uploaded image renders across header, footer, and admin header. Clearing the image restores default geometric emblem.'}
                    </div>
                  </div>
                </div>
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
                <div className="pt-2 border-t border-[#222]">
                  <ImageUploadField
                    label={isRtl ? 'صورة خلفية الهيرو الرئيسية (رفع من الاستوديو أو الجهاز)' : 'Hero Background Image'}
                    value={draftSettings.heroImageUrl || ''}
                    onChange={(val) => setDraftSettings({ ...draftSettings, heroImageUrl: val })}
                    aspectRatio="banner"
                    placeholderText={isRtl ? 'اختر صورة الهيرو من استوديو هاتفك أو جهازك' : 'Select hero image from studio'}
                  />
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

                {/* Strategic Sectors Editor in Hero Tab */}
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'شرائح قطاعات الأعمال الاستراتيجية الثلاثة (الصفحة الرئيسية)' : 'Three Strategic Business Sectors Cards'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sector 1 */}
                    <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <span className="text-xs font-bold text-[#F4F1E9] block">{isRtl ? 'القطاع 1: الديزل' : 'Sector 1: Diesel'}</span>
                      <input
                        type="text"
                        value={draftSettings.sector1TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector1TitleAr: e.target.value })}
                        placeholder="عنوان القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#F4F1E9]"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.sector1DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector1DescAr: e.target.value })}
                        placeholder="وصف القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#AAA]"
                      />
                      <ImageUploadField
                        label={isRtl ? 'صورة القطاع 1' : 'Sector 1 Photo'}
                        value={draftSettings.sector1ImageUrl || ''}
                        onChange={(val) => setDraftSettings({ ...draftSettings, sector1ImageUrl: val })}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة من الاستوديو' : 'Pick from studio'}
                        compact
                      />
                    </div>
                    {/* Sector 2 */}
                    <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <span className="text-xs font-bold text-[#F4F1E9] block">{isRtl ? 'القطاع 2: المحطات' : 'Sector 2: Stations'}</span>
                      <input
                        type="text"
                        value={draftSettings.sector2TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector2TitleAr: e.target.value })}
                        placeholder="عنوان القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#F4F1E9]"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.sector2DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector2DescAr: e.target.value })}
                        placeholder="وصف القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#AAA]"
                      />
                      <ImageUploadField
                        label={isRtl ? 'صورة القطاع 2' : 'Sector 2 Photo'}
                        value={draftSettings.sector2ImageUrl || ''}
                        onChange={(val) => setDraftSettings({ ...draftSettings, sector2ImageUrl: val })}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة من الاستوديو' : 'Pick from studio'}
                        compact
                      />
                    </div>
                    {/* Sector 3 */}
                    <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-sm space-y-2">
                      <span className="text-xs font-bold text-[#F4F1E9] block">{isRtl ? 'القطاع 3: المغاسل' : 'Sector 3: Car Wash'}</span>
                      <input
                        type="text"
                        value={draftSettings.sector3TitleAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector3TitleAr: e.target.value })}
                        placeholder="عنوان القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#F4F1E9]"
                      />
                      <textarea
                        rows={2}
                        value={draftSettings.sector3DescAr || ''}
                        onChange={(e) => setDraftSettings({ ...draftSettings, sector3DescAr: e.target.value })}
                        placeholder="وصف القطاع..."
                        className="w-full bg-[#181818] border border-[#333] rounded px-2.5 py-1.5 text-xs text-[#AAA]"
                      />
                      <ImageUploadField
                        label={isRtl ? 'صورة القطاع 3' : 'Sector 3 Photo'}
                        value={draftSettings.sector3ImageUrl || ''}
                        onChange={(val) => setDraftSettings({ ...draftSettings, sector3ImageUrl: val })}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة من الاستوديو' : 'Pick from studio'}
                        compact
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

                {/* Diesel Images */}
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <h4 className="text-xs font-bold text-[#E2C98A]">{isRtl ? 'صور صفحة توريد ونقل الديزل (رفع من الاستوديو أو الجهاز)' : 'Diesel Page Images'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField
                      label={isRtl ? 'صورة المواصفات الفنية والبنية التحتية' : 'Specs & Infrastructure Image'}
                      value={draftSettings.dieselSpecsImageUrl || ''}
                      onChange={(val) => setDraftSettings({ ...draftSettings, dieselSpecsImageUrl: val })}
                      aspectRatio="landscape"
                      placeholderText={isRtl ? 'اختر صورة المواصفات من الاستوديو' : 'Pick specs photo'}
                    />
                    <ImageUploadField
                      label={isRtl ? 'صورة أسطول النقل والصهاريج' : 'Logistics Fleet Image'}
                      value={draftSettings.dieselFleetImageUrl || ''}
                      onChange={(val) => setDraftSettings({ ...draftSettings, dieselFleetImageUrl: val })}
                      aspectRatio="landscape"
                      placeholderText={isRtl ? 'اختر صورة الأسطول من الاستوديو' : 'Pick fleet photo'}
                    />
                  </div>
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

                {/* About Image */}
                <div className="pt-2 border-t border-[#222]">
                  <ImageUploadField
                    label={isRtl ? 'صورة قسم من نحن والرؤية المؤسسية (رفع من الاستوديو أو الجهاز)' : 'About Us Section Visual'}
                    value={draftSettings.aboutImageUrl || ''}
                    onChange={(val) => setDraftSettings({ ...draftSettings, aboutImageUrl: val })}
                    aspectRatio="landscape"
                    placeholderText={isRtl ? 'اختر صورة من نحن من استوديو هاتفك أو جهازك' : 'Select about visual from photo library'}
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
                        <ImageUploadField
                          label={isRtl ? 'صورة المحطة (رفع من الاستوديو أو الجهاز)' : 'Station Photo'}
                          value={editingStation.imageUrl || ''}
                          onChange={(val) => setEditingStation({ ...editingStation, imageUrl: val })}
                          aspectRatio="landscape"
                          placeholderText={isRtl ? 'اختر صورة المحطة من استوديو هاتفك' : 'Select station photo from gallery'}
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
                        <ImageUploadField
                          label={isRtl ? 'صورة باقة الخدمة (رفع من الاستوديو أو الجهاز)' : 'Service Package Photo'}
                          value={editingService.imageUrl || ''}
                          onChange={(val) => setEditingService({ ...editingService, imageUrl: val })}
                          aspectRatio="landscape"
                          placeholderText={isRtl ? 'اختر صورة الباقة من استوديو هاتفك' : 'Select package photo from gallery'}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setEditingService(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded cursor-pointer">
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded cursor-pointer">
                        {isRtl ? 'حفظ الباقة' : 'Save'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-4 bg-[#101010] border border-[#222] rounded-sm space-y-2.5">
                      {srv.imageUrl && (
                        <div className="h-28 rounded-sm overflow-hidden border border-[#2B2B2B]">
                          <img src={srv.imageUrl} alt={srv.nameAr} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#F4F1E9] truncate">{srv.nameAr}</h4>
                        <span className="text-[10px] text-[#C8A45D] font-mono">{srv.duration}</span>
                      </div>
                      <p className="text-[11px] text-[#888] line-clamp-2">{srv.descriptionAr}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                        <button onClick={() => setEditingService(srv)} className="text-xs text-[#E2C98A] flex items-center gap-1 cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button onClick={() => handleDeleteService(srv.id)} className="text-xs text-red-400 flex items-center gap-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'حذف' : 'Delete'}</span>
                        </button>
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
                      <div className="sm:col-span-2">
                        <ImageUploadField
                          label={isRtl ? 'صورة المركز أو الفرع (رفع من الاستوديو أو الجهاز)' : 'Branch Photo'}
                          value={editingBranch.imageUrl || ''}
                          onChange={(val) => setEditingBranch({ ...editingBranch, imageUrl: val })}
                          aspectRatio="landscape"
                          placeholderText={isRtl ? 'اختر صورة الفرع من استوديو هاتفك' : 'Select branch photo from gallery'}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setEditingBranch(null)} className="px-3 py-1.5 bg-[#222] text-xs font-bold rounded cursor-pointer">
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#C8A45D] text-[#080808] text-xs font-bold rounded cursor-pointer">
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
                      <ImageUploadField
                        label={isRtl ? 'شعار أو صورة الشريك (رفع من الاستوديو أو الجهاز)' : 'Partner Logo'}
                        value={editingPartner.logoUrl || ''}
                        onChange={(val) => setEditingPartner({ ...editingPartner, logoUrl: val })}
                        aspectRatio="square"
                        placeholderText={isRtl ? 'اختر الشعار من استوديو هاتفك أو جهازك' : 'Select logo from photo library'}
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
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label={isRtl ? 'صورة المقال أو الخبر (رفع من الاستوديو أو الجهاز)' : 'Article Image'}
                        value={editingNews.imageUrl || ''}
                        onChange={(val) => setEditingNews({ ...editingNews, imageUrl: val })}
                        aspectRatio="landscape"
                        placeholderText={isRtl ? 'اختر صورة المقال من استوديو هاتفك أو جهازك' : 'Select article photo from gallery'}
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
