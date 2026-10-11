import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import {
  FuelStation,
  CarWashBranch,
  CarWashService,
  Partner,
  NewsArticle,
  QuotationRequest,
  ContactMessage,
  SiteSettings,
} from '../types';

// Default Fallback and Seed Datasets
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyNameAr: 'آر إم ستار لاستيراد وتوريد الديزل والخدمات البترولية',
  companyNameEn: 'RM STAR Diesel Import, Supply & Fuel Services',
  officialEmail: 'info@rmstar.com',
  officialPhone: '+966 11 456 7890',
  officialWhatsApp: '+966 50 123 4567',
  headquartersAr: 'المملكة العربية السعودية، الرياض — طريق الملك فهد، المركز المالي',
  headquartersEn: 'King Fahd Road, Financial District, Riyadh, Kingdom of Saudi Arabia',
  commercialRegistration: '1010884920',
  announcementAr: 'تعلن آر إم ستار عن توسعة أسطول ناقلات الديزل وتوفير كميات توريد تجارية للمشاريع الكبرى.',
  announcementEn: 'RM STAR announces expansion of its bulk diesel transport fleet for mega infrastructure projects.',
  isAnnouncementActive: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_STATIONS: FuelStation[] = [
  {
    id: 'station-riyadh-01',
    nameAr: 'محطة آر إم ستار — بوابة الرياض اللوجستية',
    nameEn: 'RM STAR Station — Riyadh Logistics Gateway',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    addressAr: 'طريق الرياض - الخرج السريع، مخرج 12',
    addressEn: 'Riyadh - Al-Kharj Highway, Exit 12',
    services: ['ديزل شاحنات فائق السرعة', 'وقود 91 و 95', 'مغسلة شاحنات وسيارات', 'متجر ستارشوب 24/7', 'صراف آلي', 'مواقف شاحنات مجهزة'],
    openingHoursAr: 'يعمل على مدار الساعة (24/7)',
    openingHoursEn: 'Open 24/7 Round the Clock',
    contactPhone: '+966 11 456 7891',
    mapUrl: 'https://maps.google.com/?q=24.7136,46.6753',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-jeddah-02',
    nameAr: 'محطة آر إم ستار — ميناء جدة الإسلامي',
    nameEn: 'RM STAR Station — Jeddah Islamic Port Arterial',
    cityAr: 'جدة',
    cityEn: 'Jeddah',
    addressAr: 'طريق الميناء السريع، بالقرب من المنطقة اللوجستية الجمركية',
    addressEn: 'Port Expressway, Adjacent to Customs Logistics Zone',
    services: ['مضخات ديزل بلك مخصصة للموانئ', 'بنزين 91 و 95', 'صيانة إطارات وتغيير زيوت', 'استراحة سائقي النقل الثقيل'],
    openingHoursAr: 'يعمل على مدار الساعة (24/7)',
    openingHoursEn: 'Open 24/7 Round the Clock',
    contactPhone: '+966 12 654 3210',
    mapUrl: 'https://maps.google.com/?q=21.4858,39.1925',
    imageUrl: 'https://images.unsplash.com/photo-1527018607147-5a1bf33c4155?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-dammam-03',
    nameAr: 'محطة آر إم ستار — ممر الظهران الصناعي',
    nameEn: 'RM STAR Station — Dhahran Industrial Hub',
    cityAr: 'الدمام',
    cityEn: 'Dammam',
    addressAr: 'طريق الدمام - الجبيل السريع، تقاطع المدينة الصناعية الثانية',
    addressEn: 'Dammam - Jubail Highway, 2nd Industrial City Junction',
    services: ['توريد ديزل أساطيل صناعية', 'وقود مركب', 'مركز فحص سوائل المركبات', 'مغسلة آلية متطورة'],
    openingHoursAr: 'يعمل على مدار الساعة (24/7)',
    openingHoursEn: 'Open 24/7 Round the Clock',
    contactPhone: '+966 13 888 9900',
    mapUrl: 'https://maps.google.com/?q=26.4207,50.0888',
    imageUrl: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_BRANCHES: CarWashBranch[] = [
  {
    id: 'wash-branch-01',
    nameAr: 'مركز آر إم ستار للعناية الفائقة — العليا',
    nameEn: 'RM STAR Premium Vehicle Care — Al Olaya',
    cityAr: 'الرياض',
    cityEn: 'Riyadh',
    addressAr: 'حي العليا، شارع التحلية العام',
    addressEn: 'Al Olaya District, Tahlia Street',
    openingHoursAr: 'من 8:00 صباحاً حتى 12:00 منتصف الليل',
    openingHoursEn: '8:00 AM – 12:00 Midnight',
    contactPhone: '+966 11 222 3344',
    mapUrl: 'https://maps.google.com/?q=24.6980,46.6850',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wash-branch-02',
    nameAr: 'مركز آر إم ستار — الواجهة البحرية',
    nameEn: 'RM STAR Waterfront Detailing — Corniche',
    cityAr: 'جدة',
    cityEn: 'Jeddah',
    addressAr: 'طريق الكورنيش الشمالي، بالقرب من دوار النورس',
    addressEn: 'North Corniche Road, Al Nawras District',
    openingHoursAr: 'من 9:00 صباحاً حتى 1:00 صباحاً',
    openingHoursEn: '9:00 AM – 1:00 AM',
    contactPhone: '+966 12 777 8899',
    mapUrl: 'https://maps.google.com/?q=21.5433,39.1728',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SERVICES: CarWashService[] = [
  {
    id: 'service-express',
    nameAr: 'الغسيل الآلي الفائق (إكسبريس)',
    nameEn: 'Express Automated High-Pressure Wash',
    descriptionAr: 'تقنية غسيل نفقية روبوتية سريعة بنظام المياه المعالجة ورغوة الصنوبر لإزالة الأتربة وحماية الطلاء الخارجي.',
    descriptionEn: 'Rapid robotic tunnel washing with purified treated water and active bio-foam, protecting vehicle clear coat.',
    duration: '8 دقائق',
    pricePlaceholder: 'متوفر للسيارات والأساطيل',
    featuresAr: ['غسيل شاسيه سفلي عالي الضغط', 'رغوة نانو شامبو واقية', 'تجفيف هوائي توربيني بدون لمس', 'تلميع إطارات فوري'],
    featuresEn: ['Underbody high-pressure chassis wash', 'Protective nano-foam shampoo', 'Touchless turbine heated air drying', 'Instant tire dressing & gloss'],
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    sortOrder: 1,
  },
  {
    id: 'service-ceramic',
    nameAr: 'باقة الحماية الملكية والنانو سيراميك',
    nameEn: 'Royal Ceramic Nano-Shield Package',
    descriptionAr: 'معالجة تفصيلية متكاملة تشمل إزالة الخدوش الدقيقة ووضع طبقات نانو سيراميك عازلة ضد أشعة الشمس وحرارة الصيف.',
    descriptionEn: 'Comprehensive precision detailing with multi-stage paint correction and 9H nano-ceramic hydrophobic shield application.',
    duration: '120 دقيقة',
    pricePlaceholder: 'حسب فئة وحجم المركبة',
    featuresAr: ['تصحيح الطلاء وإزالة الدوائر السطحية', 'طبقة حماية نانو 9H مقاومة للخدوش', 'عزل وتشميع الجنوط ضد برادة الفرامل', 'تعقيم داخلي بالأوزون والبخار الحار'],
    featuresEn: ['Multi-stage paint correction', '9H scratch-resistant nano-layer', 'Wheel rim ceramic sealing', 'Interior ozone and high-temp steam sanitization'],
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    sortOrder: 2,
  },
  {
    id: 'service-fleet',
    nameAr: 'برنامج غسيل وتعقيم أساطيل النقل والشركات',
    nameEn: 'Commercial Fleet Washing & Sanitization',
    descriptionAr: 'عقود صيانة وغسيل مخصصة للشاحنات وصهاريج النقل وسيارات الشركات بجدول زمني مرن وفواتير ضريبية شهرية.',
    descriptionEn: 'Tailored commercial wash agreements for heavy transport fleets, fuel tankers, and corporate vehicles with scheduled SLAs.',
    duration: 'مرن حسب الأسطول',
    pricePlaceholder: 'عقود تجارية مخصصة',
    featuresAr: ['معدات مخصصة للشاحنات والحافلات', 'إزالة الزيوت والرواسب البترولية', 'شهادات تطهير وتعقيم رسمية', 'تقارير دورية لاستهلاك الأسطول'],
    featuresEn: ['Specialized heavy rig and bus bays', 'Industrial grease and hydrocarbon breakdown', 'Official sanitization certificates', 'Periodic fleet operational analytics'],
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    sortOrder: 3,
  },
];

export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'partner-01',
    nameAr: 'التحالف الوطني للنقل البترولي واللوجستيات',
    nameEn: 'National Petroleum Logistics Consortium',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    websiteUrl: 'https://rmstar.com',
    categoryAr: 'شريك لوجستي استراتيجي',
    categoryEn: 'Strategic Logistics Partner',
    displayOrder: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'partner-02',
    nameAr: 'مجموعة الموانئ وسلاسل الإمداد البحرية',
    nameEn: 'Maritime Ports & Supply Infrastructure Group',
    logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    websiteUrl: 'https://rmstar.com',
    categoryAr: 'توريد بحري ومناولة',
    categoryEn: 'Maritime Bunkering & Handling',
    displayOrder: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'partner-03',
    nameAr: 'الهيئة المعتمدة للمواصفات ومطابقة الوقود',
    nameEn: 'Certified Fuel Quality & Inspection Alliance',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    websiteUrl: 'https://rmstar.com',
    categoryAr: 'رقابة الجودة والمطابقة',
    categoryEn: 'Quality Inspection & Compliance',
    displayOrder: 3,
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: 'news-01',
    titleAr: 'آر إم ستار تعلن انضمام 25 صهريجاً ذكياً حديثاً لأسطول توزيع الديزل',
    titleEn: 'RM STAR Adds 25 State-of-the-Art Smart Tankers to Commercial Diesel Fleet',
    summaryAr: 'ضمن خطة التوسع التشغيلي، تم تدشين شاحنات نقل متقدمة مزودة بحساسات أمان إلكترونية وأنظمة تتبع عبر الأقمار الصناعية لضمان سلامة الإمدادات.',
    summaryEn: 'As part of our strategic expansion, advanced transport units equipped with automated digital safety sensors and real-time telemetry have been integrated.',
    contentAr: 'أعلنت شركة آر إم ستار عن إتمام المرحلة الأولى من برنامج ترقية وتوسيع أسطول النقل البري المخصص لتوريد الديزل التجاري والصناعي. تتميز هذه الصهاريج بنظم وزن هيدروليكية رقمية ومطابقة لأحدث اللوائح البيئية العالمية.',
    contentEn: 'RM STAR has officially operationalized the first phase of its transport fleet upgrade program for industrial and bulk commercial diesel supply, featuring digital hydraulic metering and international HSE compliance.',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    publishedDate: '2026-09-15',
    category: 'توسعات وعمليات',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'news-02',
    titleAr: 'تدشين مضخات الديزل فائقة السرعة للشاحنات في محطة بوابة الرياض',
    titleEn: 'Launch of Ultra-High-Flow Commercial Dispensing at Riyadh Gateway Station',
    summaryAr: 'تقليص زمن تعبئة أساطيل النقل الثقيل بنسبة 60% بفضل تقنيات الضخ الذكية التي تصل سعتها إلى 130 لتر في الدقيقة.',
    summaryEn: 'Reducing heavy fleet refueling turnaround time by 60% with intelligent high-flow pumps dispensing up to 130 liters per minute.',
    contentAr: 'بدأت آر إم ستار تشغيل مضخات الجيل الجديد في محطتها النموذجية على طريق الرياض - الخرج، ما يوفر كفاءة استثنائية لسائقي الشاحنات والمؤسسات اللوجستية التي تعتمد على سرعة التوريد واستمرارية الرحلات.',
    contentEn: 'RM STAR has introduced next-generation dispensing at its flagship highway station, maximizing turnaround efficiency for commercial transport logistics.',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    publishedDate: '2026-08-20',
    category: 'محطات وابتكار',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
];

// Helper to get or set cache in localStorage for instant seamless loading
function getCached<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`rmstar_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setCached<T>(key: string, data: T) {
  try {
    localStorage.setItem(`rmstar_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ----------------- Site Settings -----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = getCached<SiteSettings>('siteSettings', DEFAULT_SITE_SETTINGS);
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      setCached('siteSettings', data);
      return data;
    }
  } catch {
    // fallback to cached or default
  }
  return cached;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const path = 'siteSettings';
  try {
    await setDoc(doc(db, path, 'global'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    setCached('siteSettings', settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/global`);
  }
}

// ----------------- Fuel Stations -----------------
export async function getStations(): Promise<FuelStation[]> {
  const cached = getCached<FuelStation[]>('stations', DEFAULT_STATIONS);
  try {
    const colRef = collection(db, 'stations');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FuelStation));
      setCached('stations', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function saveStation(station: FuelStation): Promise<void> {
  const path = 'stations';
  try {
    await setDoc(doc(db, path, station.id), {
      ...station,
      updatedAt: new Date().toISOString(),
    });
    const current = await getStations();
    const updated = current.filter((s) => s.id !== station.id).concat(station);
    setCached('stations', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${station.id}`);
  }
}

export async function removeStation(stationId: string): Promise<void> {
  const path = 'stations';
  try {
    await deleteDoc(doc(db, path, stationId));
    const current = await getStations();
    const updated = current.filter((s) => s.id !== stationId);
    setCached('stations', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${stationId}`);
  }
}

// ----------------- Car Wash Branches -----------------
export async function getCarWashBranches(): Promise<CarWashBranch[]> {
  const cached = getCached<CarWashBranch[]>('branches', DEFAULT_BRANCHES);
  try {
    const colRef = collection(db, 'carWashBranches');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CarWashBranch));
      setCached('branches', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function saveCarWashBranch(branch: CarWashBranch): Promise<void> {
  const path = 'carWashBranches';
  try {
    await setDoc(doc(db, path, branch.id), {
      ...branch,
      updatedAt: new Date().toISOString(),
    });
    const current = await getCarWashBranches();
    const updated = current.filter((b) => b.id !== branch.id).concat(branch);
    setCached('branches', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${branch.id}`);
  }
}

export async function removeCarWashBranch(branchId: string): Promise<void> {
  const path = 'carWashBranches';
  try {
    await deleteDoc(doc(db, path, branchId));
    const current = await getCarWashBranches();
    const updated = current.filter((b) => b.id !== branchId);
    setCached('branches', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${branchId}`);
  }
}

// ----------------- Car Wash Services -----------------
export async function getCarWashServices(): Promise<CarWashService[]> {
  const cached = getCached<CarWashService[]>('services', DEFAULT_SERVICES);
  try {
    const colRef = collection(db, 'carWashServices');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CarWashService));
      list.sort((a, b) => a.sortOrder - b.sortOrder);
      setCached('services', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function saveCarWashService(service: CarWashService): Promise<void> {
  const path = 'carWashServices';
  try {
    await setDoc(doc(db, path, service.id), service);
    const current = await getCarWashServices();
    const updated = current.filter((s) => s.id !== service.id).concat(service);
    setCached('services', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${service.id}`);
  }
}

export async function removeCarWashService(serviceId: string): Promise<void> {
  const path = 'carWashServices';
  try {
    await deleteDoc(doc(db, path, serviceId));
    const current = await getCarWashServices();
    const updated = current.filter((s) => s.id !== serviceId);
    setCached('services', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${serviceId}`);
  }
}

// ----------------- Partners -----------------
export async function getPartners(): Promise<Partner[]> {
  const cached = getCached<Partner[]>('partners', DEFAULT_PARTNERS);
  try {
    const colRef = collection(db, 'partners');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Partner));
      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setCached('partners', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function savePartner(partner: Partner): Promise<void> {
  const path = 'partners';
  try {
    await setDoc(doc(db, path, partner.id), partner);
    const current = await getPartners();
    const updated = current.filter((p) => p.id !== partner.id).concat(partner);
    setCached('partners', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${partner.id}`);
  }
}

export async function removePartner(partnerId: string): Promise<void> {
  const path = 'partners';
  try {
    await deleteDoc(doc(db, path, partnerId));
    const current = await getPartners();
    const updated = current.filter((p) => p.id !== partnerId);
    setCached('partners', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${partnerId}`);
  }
}

// ----------------- News & Press -----------------
export async function getNewsArticles(): Promise<NewsArticle[]> {
  const cached = getCached<NewsArticle[]>('news', DEFAULT_NEWS);
  try {
    const colRef = collection(db, 'news');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsArticle));
      setCached('news', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function saveNewsArticle(article: NewsArticle): Promise<void> {
  const path = 'news';
  try {
    await setDoc(doc(db, path, article.id), article);
    const current = await getNewsArticles();
    const updated = current.filter((n) => n.id !== article.id).concat(article);
    setCached('news', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${article.id}`);
  }
}

export async function removeNewsArticle(articleId: string): Promise<void> {
  const path = 'news';
  try {
    await deleteDoc(doc(db, path, articleId));
    const current = await getNewsArticles();
    const updated = current.filter((n) => n.id !== articleId);
    setCached('news', updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${articleId}`);
  }
}

// ----------------- Quotation Requests -----------------
export async function submitQuotationRequest(
  data: Omit<QuotationRequest, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id: string }> {
  const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: QuotationRequest = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const path = 'quotationRequests';
  try {
    await setDoc(doc(db, path, id), record);
  } catch (error) {
    console.warn('Direct Firestore quote write fallback to local queue:', error);
    // Even if client faces network latency, cache locally
    const existing = getCached<QuotationRequest[]>('quotations', []);
    setCached('quotations', [record, ...existing]);
  }

  // Also maintain in local admin cache
  const existing = getCached<QuotationRequest[]>('quotations', []);
  if (!existing.some((q) => q.id === id)) {
    setCached('quotations', [record, ...existing]);
  }

  return { success: true, id };
}

export async function getQuotationRequests(): Promise<QuotationRequest[]> {
  const cached = getCached<QuotationRequest[]>('quotations', []);
  try {
    const colRef = collection(db, 'quotationRequests');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuotationRequest));
      setCached('quotations', list);
      return list;
    }
  } catch {
    // If not authenticated or offline, use cached
  }
  return cached;
}

export async function updateQuotationStatus(
  id: string,
  status: QuotationRequest['status']
): Promise<void> {
  const path = 'quotationRequests';
  try {
    await updateDoc(doc(db, path, id), { status });
  } catch {
    // update cached
  }
  const cached = getCached<QuotationRequest[]>('quotations', []);
  const updated = cached.map((q) => (q.id === id ? { ...q, status } : q));
  setCached('quotations', updated);
}

// ----------------- Contact Messages -----------------
export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id: string }> {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: ContactMessage = {
    ...data,
    id,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const path = 'contactMessages';
  try {
    await setDoc(doc(db, path, id), record);
  } catch (error) {
    console.warn('Direct Firestore contact write fallback:', error);
  }

  const existing = getCached<ContactMessage[]>('contactMessages', []);
  setCached('contactMessages', [record, ...existing]);

  return { success: true, id };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const cached = getCached<ContactMessage[]>('contactMessages', []);
  try {
    const colRef = collection(db, 'contactMessages');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
      setCached('contactMessages', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessage['status']
): Promise<void> {
  const path = 'contactMessages';
  try {
    await updateDoc(doc(db, path, id), { status });
  } catch {
    // fallback
  }
  const cached = getCached<ContactMessage[]>('contactMessages', []);
  const updated = cached.map((m) => (m.id === id ? { ...m, status } : m));
  setCached('contactMessages', updated);
}

// ----------------- Seeder -----------------
export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Settings
    await setDoc(doc(db, 'siteSettings', 'global'), DEFAULT_SITE_SETTINGS);

    // 2. Stations
    for (const st of DEFAULT_STATIONS) {
      await setDoc(doc(db, 'stations', st.id), st);
    }

    // 3. Branches
    for (const br of DEFAULT_BRANCHES) {
      await setDoc(doc(db, 'carWashBranches', br.id), br);
    }

    // 4. Services
    for (const srv of DEFAULT_SERVICES) {
      await setDoc(doc(db, 'carWashServices', srv.id), srv);
    }

    // 5. Partners
    for (const prt of DEFAULT_PARTNERS) {
      await setDoc(doc(db, 'partners', prt.id), prt);
    }

    // 6. News
    for (const nw of DEFAULT_NEWS) {
      await setDoc(doc(db, 'news', nw.id), nw);
    }

    return { success: true, message: 'All RM STAR core corporate data successfully seeded into Cloud Firestore!' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: `Seeding encountered: ${msg}` };
  }
}
