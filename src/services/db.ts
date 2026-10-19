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
} from '../types';

// Default Fallback and Seed Datasets
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  // Brand & Identity
  companyNameAr: 'آر إم ستار لاستيراد وتوريد الديزل والخدمات البترولية',
  companyNameEn: 'RM STAR Diesel Import, Supply & Fuel Services',
  brandTaglineAr: 'شراكة تُبنى على الثقة',
  brandTaglineEn: 'Partnership Built on Trust',
  brandSubtitleAr: 'منظومة رائدة متخصصة في نقل وتوريد الوقود والديزل للشركات والمصانع، وتشغيل محطات الوقود ومراكز العناية بالمركبات.',
  brandSubtitleEn: 'A leading institutional energy enterprise specialized in bulk diesel logistics, model fuel stations, and advanced fleet care.',
  officialEmail: 'info@rmstar.online',
  officialPhone: '0555338893',
  officialWhatsApp: '0555338893',
  headquartersAr: 'المملكة العربية السعودية، الرياض — طريق الملك فهد، المركز المالي',
  headquartersEn: 'King Fahd Road, Financial District, Riyadh, Kingdom of Saudi Arabia',
  commercialRegistration: '1010884920',
  announcementAr: 'تعلن آر إم ستار عن توسعة أسطول ناقلات الديزل وتوفير كميات توريد تجارية للمشاريع الكبرى.',
  announcementEn: 'RM STAR announces expansion of its bulk diesel transport fleet for mega infrastructure projects.',
  isAnnouncementActive: true,

  // Homepage Hero Section
  heroBadgeAr: 'متخصصون في نقل وتوريد الوقود للشركات والمصانع',
  heroBadgeEn: 'Specialists in Commercial Fuel Transport & Supply',
  heroTitleAr: 'RM STAR — شراكة تُبنى على الثقة في نقل وتوريد الوقود',
  heroTitleEn: 'RM STAR — Partnership Built on Trust in Fuel Logistics & Supply',
  heroDescAr: 'نقل وتوريد وقود ديزل فائق الجودة للشركات، المصانع، المشروعات الكبرى، ومحطات الوقود، بأسطول صهاريج ودينات حديثة مجهزة بأعلى معايير السلامة والمعايرة الرقمية.',
  heroDescEn: 'Supplying and transporting premium diesel fuel to corporate enterprises, manufacturing plants, infrastructure projects, and stations with high-grade digital metering.',
  heroImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2560&q=95',
  heroCtaQuoteAr: 'طلب عرض أسعار توريد',
  heroCtaQuoteEn: 'Request Fuel Quotation',
  heroCtaServicesAr: 'استكشف قطاعاتنا',
  heroCtaServicesEn: 'Explore Business Sectors',

  // Metrics
  metric1Val: '99.9%',
  metric1LabelAr: 'موثوقية الإمداد ونقل الوقود',
  metric1LabelEn: 'Supply & Transport Reliability',
  metric2Val: '24/7',
  metric2LabelAr: 'جاهزية الأسطول والتوزيع',
  metric2LabelEn: 'Fleet Readiness & Dispatch',
  metric3Val: 'ISO',
  metric3LabelAr: 'معايير جودة ومطابقة معتمدة',
  metric3LabelEn: 'Certified Quality Benchmark',

  // Strategic Sectors
  sectorsTitleAr: 'قطاعات الأعمال الاستراتيجية',
  sectorsTitleEn: 'Strategic Business Sectors',
  sectorsSubtitleAr: 'نقدم حلولاً متكاملة ترتكز على الكفاءة التشغيلية وأعلى مواصفات الجودة العالمية في نقل وتوزيع الوقود',
  sectorsSubtitleEn: 'Integrated downstream energy solutions driven by operational excellence and global fuel benchmarks',
  sector1TitleAr: 'نقل وتوريد الديزل للشركات والمصانع',
  sector1TitleEn: 'Bulk Diesel Supply for Industry & Plants',
  sector1DescAr: 'إمدادات وقود ديزل متوافقة مع المواصفات القياسية، مع أسطول صهاريج ودينات نقل متخصصة لتلبية احتياجات المصانع، المقاولين، والمشروعات الحيوية.',
  sector1DescEn: 'Certified diesel fuel deliveries with dedicated commercial tanker fleets serving infrastructure and industrial plants.',
  sector2TitleAr: 'شبكة محطات الوقود',
  sector2TitleEn: 'Retail Fuel Station Network',
  sector2DescAr: 'محطات وقود عصرية مجهزة بأحدث مضخات التوزيع السريعة، ومتاجر متكاملة، ومرافق راحة متطورة لخدمة المسافرين والأساطيل.',
  sector2DescEn: 'Modern stations equipped with ultra-high-flow dispensers, 24/7 convenience stores, and premium driver amenities.',
  sector3TitleAr: 'العناية بالمركبات والمغاسل',
  sector3TitleEn: 'Vehicle Detailing & Auto Care',
  sector3DescAr: 'مراكز عناية متقدمة تقدم غسيل آلي فائق النقاء، وحماية النانو سيراميك، وتنظيفاً شاملاً يرفع من قيمة وطول عمر المركبات.',
  sector3DescEn: 'Automated touchless wash facilities, 9H nano-ceramic protection, and deep cleaning preserving vehicle condition.',
  sector1ImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
  sector2ImageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  sector3ImageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',

  // Diesel Supply Page
  dieselPageTitleAr: 'استيراد وتوريد الديزل التجاري',
  dieselPageTitleEn: 'Commercial & Wholesale Diesel Supply',
  dieselPageSubtitleAr: 'حلول توريد بلك بالجملة للمصانع، شركات النقل، المشروعات الكبرى، والمؤسسات الإنشائية',
  dieselPageSubtitleEn: 'Wholesale bulk diesel distribution for manufacturing complexes, transport fleets, and infrastructure projects',
  dieselSpecsTitleAr: 'المواصفات الفنية والجودة',
  dieselSpecsTitleEn: 'Technical Specifications & Quality Standards',
  dieselSpecsDescAr: 'ديزل منخفض الكبريت فائق الجودة مطابق للمقاييس والمواصفات المعتمدة، مع شهادات فحص دورية للمطابقة والكثافة ودرجة الوميض.',
  dieselSpecsDescEn: 'Ultra-low sulfur diesel compliant with approved statutory standards, certified with periodic laboratory assay reports.',
  dieselSpec1TitleAr: 'ديزل فائق انخفاض الكبريت (Euro 5 - 10 PPM)',
  dieselSpec1TitleEn: 'Ultra-Low Sulfur Diesel (Euro 5 - 10 PPM)',
  dieselSpec1DescAr: 'يحتوي على أقل من 10 أجزاء في المليون من الكبريت، مما يطيل عمر محركات الأساطيل ويقلل الانبعاثات الكربونية.',
  dieselSpec1DescEn: 'Less than 10 ppm sulfur content, maximizing engine longevity and minimizing exhaust emissions.',
  dieselSpec2TitleAr: 'شهادات الفحص المخبري لكل دفعة توريد',
  dieselSpec2TitleEn: 'Certified Batch Laboratory Reports',
  dieselSpec2DescAr: 'نوفر شهادة فحص واختبار مخبري معتمدة مع كل شحنة توضح الكثافة ودرجة الوميض والرقم السيتاني لضمان الشفافية المطلقة.',
  dieselSpec2DescEn: 'Official certified assay testing accompanying every dispatch measuring density, flash point, and cetane index.',
  dieselSpec3TitleAr: 'تفريغ هيدروليكي فائق الدقة بعدادات معايرة',
  dieselSpec3TitleEn: 'High-Precision Calibrated Hydraulic Metering',
  dieselSpec3DescAr: 'مضخات تفريغ متطورة وعدادات إلكترونية تضمن مطابقة الكميات المفرغة في خزانات العميل بنسبة خطأ صفرية.',
  dieselSpec3DescEn: 'Advanced high-volume pumps and digital meters ensuring precise custody transfer with zero discrepancy.',
  dieselFleetTitleAr: 'أسطول النقل والسلامة اللوجستية',
  dieselFleetTitleEn: 'Logistics Fleet & Transport Safety',
  dieselFleetDescAr: 'أسطول متكامل من الصهاريج والدينات الحديثة المجهزة بأنظمة تتبع GPS وصمامات أمان هيدروليكية لضمان وصول الشحنات في أوقاتها المحددة وبأعلى درجات الأمان.',
  dieselFleetDescEn: 'Modern tanker fleet with real-time GPS telemetry, emergency shut-off valves, and licensed professional drivers.',
  dieselSpecsImageUrl: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=1200&q=80',
  dieselFleetImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',

  // About Us Page
  aboutTitleAr: 'عن شركة آر إم ستار',
  aboutTitleEn: 'About RM STAR Enterprise',
  aboutSubtitleAr: 'ريادة في إدارة سلاسل إمداد الطاقة والخدمات البترولية',
  aboutSubtitleEn: 'Pioneering Leadership in Downstream Fuel Logistics & Station Management',
  aboutOverviewAr: 'تأسست شركة آر إم ستار لتقديم نموذج تشغيلي حديث يرتقي بقطاع استيراد وتوريد الوقود والديزل، وتطوير محطات الخدمة البترولية لتكون منصات لوجستية وخدمية متكاملة تخدم التنمية الاقتصادية والصناعية.',
  aboutOverviewEn: 'RM STAR was founded to redefine the energy distribution sector through institutional rigor, modern fuel transport fleets, and integrated service stations.',
  aboutOverview2Ar: 'نعمل وفق منظومة حوكمة صارمة تضمن الالتزام بالمواصفات القياسية، دقة الجداول الزمنية، وتوفير تجربة استثنائية لعملائنا في محطات الوقود ومراكز العناية بالمركبات.',
  aboutOverview2En: 'Guided by corporate governance, uncompromising product purity, and punctual supply chains, we power industrial development and mobility corridors.',
  aboutVisionTitleAr: 'الرؤية المؤسسية',
  aboutVisionTitleEn: 'Our Corporate Vision',
  aboutVisionDescAr: 'أن نكون الشريك الأكثر موثوقية وتميزاً في استيراد وتوريد الديزل وتشغيل محطات الوقود النموذجية ومراكز خدمة المركبات على المستوى الإقليمي.',
  aboutVisionDescEn: 'To be the most dependable and benchmarked regional partner in commercial diesel supply, model fuel stations, and advanced vehicle care.',
  aboutMissionTitleAr: 'الرسالة المؤسسية',
  aboutMissionTitleEn: 'Our Mission',
  aboutMissionDescAr: 'توفير إمدادات طاقة مستدامة ومنتجات بترولية فائقة الجودة تدعم القطاعات التنموية والصناعية، مع الالتزام بأعلى معايير السلامة والشفافية التشغيلية.',
  aboutMissionDescEn: 'Delivering secure, pure, and dependable petroleum products that fuel economic growth while maintaining highest HSE standards.',
  aboutVal1TitleAr: 'الموثوقية والالتزام',
  aboutVal1TitleEn: 'Reliability & Dedication',
  aboutVal1DescAr: 'نلتزم بالدقة الصارمة في جداول التوريد ومواصفات المنتج لضمان عدم توقف عمليات شركائنا.',
  aboutVal1DescEn: 'Uncompromising punctuality and specification consistency guaranteeing non-stop operations for partners.',
  aboutVal2TitleAr: 'السلامة والبيئة (HSE)',
  aboutVal2TitleEn: 'Safety & Environmental Stewardship',
  aboutVal2DescAr: 'نطبق أدق بروتوكولات السلامة المهنية لحماية الكوادر والمنشآت والحفاظ على البيئة.',
  aboutVal2DescEn: 'Zero-harm HSE culture safeguarding human capital, assets, and environmental ecosystems.',
  aboutVal3TitleAr: 'الشفافية والحوكمة',
  aboutVal3TitleEn: 'Transparency & Integrity',
  aboutVal3DescAr: 'بناء علاقات تجارية طويلة الأمد مبنية على النزاهة والوضوح التام في كافة تعاملاتنا.',
  aboutVal3DescEn: 'Cultivating enduring business partnerships rooted in open governance and verified reporting.',
  aboutImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',

  // Page Header Banners
  stationsPageTitleAr: 'شبكة محطات الوقود النموذجية',
  stationsPageTitleEn: 'Model Fuel Station Network',
  stationsPageSubtitleAr: 'محطات وقود مصممة لراحة عملائنا وأساطيل النقل الثقيل والخفيف بأعلى معايير السلامة العالمية',
  stationsPageSubtitleEn: 'Contemporary retail stations built for heavy fleet efficiency, driver convenience, and 24/7 service',
  carWashPageTitleAr: 'العناية الفائقة بالمركبات ومغاسل السيارات',
  carWashPageTitleEn: 'Premium Vehicle Care & Auto Detailing',
  carWashPageSubtitleAr: 'تقنيات غسيل آلي متطورة ومواد صديقة للبيئة لضمان لمعان وحماية تدوم لأساطيل الشركات والسيارات الخاصة',
  carWashPageSubtitleEn: 'Advanced automated wash technology and protective coatings for commercial fleets and private cars',
  partnersPageTitleAr: 'شركاء الأعمال والتحالفات الاستراتيجية',
  partnersPageTitleEn: 'Commercial Partners & Alliances',
  partnersPageSubtitleAr: 'نفخر بالتعاون مع كبرى الشركات الصناعية واللوجستية في المنطقة',
  partnersPageSubtitleEn: 'Proudly collaborating with leading industrial and logistics enterprises across the Kingdom',
  newsPageTitleAr: 'الأخبار والبيانات الصحفية',
  newsPageTitleEn: 'Press Releases & Company News',
  newsPageSubtitleAr: 'آخر المستجدات والإعلانات الرسمية والتوسعات التشغيلية لمنظومة آر إم ستار',
  newsPageSubtitleEn: 'Latest company announcements, fleet developments, and official corporate updates',
  careersPageTitleAr: 'المواهب والفرص الوظيفية',
  careersPageTitleEn: 'Careers & Talent Opportunities',
  careersPageSubtitleAr: 'انضم إلى فريق العمل في آر إم ستار وكن جزءاً من مسيرة التميز في قطاع الطاقة واللوجستيات',
  careersPageSubtitleEn: 'Join our growing team and shape the future of fuel distribution and downstream energy operations',
  careersEmail: 'info@rmstar.online',
  contactPageTitleAr: 'تواصل مع الإدارة العامة',
  contactPageTitleEn: 'Contact Corporate Headquarters',
  contactPageSubtitleAr: 'نسعد باستقبال استفساراتكم ومناقشة عقود التوريد والشراكات الاستراتيجية',
  contactPageSubtitleEn: 'We welcome your commercial inquiries, supply contracts, and institutional partnerships',
  contactWorkingHoursAr: 'الأحد - الخميس: 8:00 صباحاً – 5:00 مساءً (قسم الطوارئ 24/7)',
  contactWorkingHoursEn: 'Sunday - Thursday: 8:00 AM – 5:00 PM (24/7 Emergency Dispatch)',

  // Legal & Policies
  privacyTitleAr: 'سياسة الخصوصية وحماية البيانات',
  privacyTitleEn: 'Privacy & Data Protection Policy',
  privacyTextAr: 'تلتزم شركة آر إم ستار بحماية خصوصية كافة زوار موقعها وشركائها التجاريين والعملاء المؤسسيين الذين يقدمون طلبات عروض أسعار توريد الديزل أو الاستفسارات العامة. لا نقوم بمشاركة أو بيع أية بيانات تجارية أو اتصال لأطراف خارجية غير مصرح لها.',
  privacyTextEn: 'RM STAR is firmly committed to safeguarding the privacy and confidentiality of institutional clients, suppliers, and website visitors. All quotation requests and corporate correspondence are treated as proprietary business records.',
  termsTitleAr: 'الشروط والأحكام واللوائح التجارية',
  termsTitleEn: 'Terms of Service & Trade Provisions',
  termsTextAr: 'إن استخدام هذا الموقع وتقديم طلبات عروض الأسعار يمثل طلباً استعلامياً أولياً لا يُلزم أياً من الطرفين بتوريد أو شراء حتى يتم توقيع عقد تجاري رسمي معتمد يتضمن المواصفات الفنية وجدول الدفعات والتسليم.',
  termsTextEn: 'Submissions made through our quotation request forms represent commercial inquiries for preliminary calculation purposes and do not constitute a binding fuel supply commitment until a formal bilaterally executed trade agreement is finalized.',
  footerCopyrightAr: 'جميع الحقوق محفوظة لشركة آر إم ستار لاستيراد وتوريد الديزل والخدمات البترولية',
  footerCopyrightEn: 'All Rights Reserved. RM STAR Diesel Import & Fuel Services.',

  // Admin Credentials
  adminUsername: 'rmstar',
  adminPassword: 'Admin2468',

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
    websiteUrl: 'https://rmstar.online',
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
    websiteUrl: 'https://rmstar.online',
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
    websiteUrl: 'https://rmstar.online',
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

export const DEFAULT_CAREERS: CareerPosting[] = [
  {
    id: 'cr-01',
    titleAr: 'مدير عمليات أسطول النقل البترولي',
    titleEn: 'Petroleum Fleet Operations Manager',
    departmentAr: 'العمليات واللوجستيات',
    departmentEn: 'Operations & Logistics',
    locationAr: 'الرياض، المملكة العربية السعودية',
    locationEn: 'Riyadh, Saudi Arabia',
    type: 'دوام كامل • Full-Time',
    descriptionAr: 'الإشراف على جدولة مسارات صهاريج نقل الديزل، متابعة أنظمة السلامة وتطبيق لوائح النقل البري المعتمدة.',
    descriptionEn: 'Lead logistics routing for bulk fuel tanker fleets, supervising telemetry dispatch and strict HSE compliance.',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cr-02',
    titleAr: 'مستشار مبيعات وتوريد كبار العملاء (B2B)',
    titleEn: 'Key Account Sales Specialist (B2B Fuel)',
    departmentAr: 'المبيعات التجارية',
    departmentEn: 'Commercial Sales',
    locationAr: 'الدمام / الجبيل الصناعية',
    locationEn: 'Dammam / Jubail Industrial',
    type: 'دوام كامل • Full-Time',
    descriptionAr: 'تطوير عقود توريد الديزل مع المصانع والمقاولين وشركات البنية التحتية، وإدارة المحافظ التجارية.',
    descriptionEn: 'Originate and service wholesale diesel supply contracts with manufacturing, marine, and construction accounts.',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cr-03',
    titleAr: 'مشرف جودة وسلامة بيئية (HSE Lead)',
    titleEn: 'HSE & Petroleum Quality Compliance Lead',
    departmentAr: 'الجودة والسلامة المهنية',
    departmentEn: 'Quality & HSE',
    locationAr: 'جدة / الميناء',
    locationEn: 'Jeddah / Port Corridor',
    type: 'دوام كامل • Full-Time',
    descriptionAr: 'مراقبة إجراءات السلامة أثناء تفريغ وشحن المواد البترولية في المحطات ونقاط التوريد، والتأكد من شهادات المطابقة.',
    descriptionEn: 'Enforce stringent hazard controls during petroleum discharge, tank inspections, and batch verification.',
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
  const merged = { ...DEFAULT_SITE_SETTINGS, ...cached };

  // Always enforce official credentials and clean phone/email
  if (merged.officialEmail === 'info@rmstar.com' || !merged.officialEmail) {
    merged.officialEmail = 'info@rmstar.online';
  }
  if (merged.officialPhone === '+966 11 456 7890' || !merged.officialPhone) {
    merged.officialPhone = '0555338893';
  }
  if (merged.officialWhatsApp === '+966 50 123 4567' || !merged.officialWhatsApp) {
    merged.officialWhatsApp = '0555338893';
  }

  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Partial<SiteSettings>;
      const combined: SiteSettings = { ...DEFAULT_SITE_SETTINGS, ...data };
      setCached('siteSettings', combined);
      return combined;
    }
  } catch {
    // fallback to merged
  }
  return merged;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const updated = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  setCached('siteSettings', updated);

  try {
    await setDoc(doc(db, 'siteSettings', 'global'), updated);
  } catch (error) {
    console.warn('Firestore settings write note:', error);
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
  const current = await getStations();
  const updated = current.filter((s) => s.id !== station.id).concat(station);
  setCached('stations', updated);

  try {
    await setDoc(doc(db, 'stations', station.id), {
      ...station,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Firestore station write note:', error);
  }
}

export async function removeStation(stationId: string): Promise<void> {
  const current = await getStations();
  const updated = current.filter((s) => s.id !== stationId);
  setCached('stations', updated);

  try {
    await deleteDoc(doc(db, 'stations', stationId));
  } catch (error) {
    console.warn('Firestore station delete note:', error);
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
  const current = await getCarWashBranches();
  const updated = current.filter((b) => b.id !== branch.id).concat(branch);
  setCached('branches', updated);

  try {
    await setDoc(doc(db, 'carWashBranches', branch.id), {
      ...branch,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Firestore branch write note:', error);
  }
}

export async function removeCarWashBranch(branchId: string): Promise<void> {
  const current = await getCarWashBranches();
  const updated = current.filter((b) => b.id !== branchId);
  setCached('branches', updated);

  try {
    await deleteDoc(doc(db, 'carWashBranches', branchId));
  } catch (error) {
    console.warn('Firestore branch delete note:', error);
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
  const current = await getCarWashServices();
  const updated = current.filter((s) => s.id !== service.id).concat(service);
  setCached('services', updated);

  try {
    await setDoc(doc(db, 'carWashServices', service.id), service);
  } catch (error) {
    console.warn('Firestore service write note:', error);
  }
}

export async function removeCarWashService(serviceId: string): Promise<void> {
  const current = await getCarWashServices();
  const updated = current.filter((s) => s.id !== serviceId);
  setCached('services', updated);

  try {
    await deleteDoc(doc(db, 'carWashServices', serviceId));
  } catch (error) {
    console.warn('Firestore service delete note:', error);
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
  const current = await getPartners();
  const updated = current.filter((p) => p.id !== partner.id).concat(partner);
  setCached('partners', updated);

  try {
    await setDoc(doc(db, 'partners', partner.id), partner);
  } catch (error) {
    console.warn('Firestore partner write note:', error);
  }
}

export async function removePartner(partnerId: string): Promise<void> {
  const current = await getPartners();
  const updated = current.filter((p) => p.id !== partnerId);
  setCached('partners', updated);

  try {
    await deleteDoc(doc(db, 'partners', partnerId));
  } catch (error) {
    console.warn('Firestore partner delete note:', error);
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
  const current = await getNewsArticles();
  const updated = current.filter((n) => n.id !== article.id).concat(article);
  setCached('news', updated);

  try {
    await setDoc(doc(db, 'news', article.id), article);
  } catch (error) {
    console.warn('Firestore news write note:', error);
  }
}

export async function removeNewsArticle(articleId: string): Promise<void> {
  const current = await getNewsArticles();
  const updated = current.filter((n) => n.id !== articleId);
  setCached('news', updated);

  try {
    await deleteDoc(doc(db, 'news', articleId));
  } catch (error) {
    console.warn('Firestore news delete note:', error);
  }
}

// ----------------- Careers -----------------
export async function getCareers(): Promise<CareerPosting[]> {
  const cached = getCached<CareerPosting[]>('careers', DEFAULT_CAREERS);
  try {
    const colRef = collection(db, 'careers');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CareerPosting));
      setCached('careers', list);
      return list;
    }
  } catch {
    // fallback
  }
  return cached;
}

export async function saveCareer(career: CareerPosting): Promise<void> {
  const current = await getCareers();
  const updated = current.filter((c) => c.id !== career.id).concat(career);
  setCached('careers', updated);

  try {
    await setDoc(doc(db, 'careers', career.id), career);
  } catch (error) {
    console.warn('Firestore career write note:', error);
  }
}

export async function removeCareer(careerId: string): Promise<void> {
  const current = await getCareers();
  const updated = current.filter((c) => c.id !== careerId);
  setCached('careers', updated);

  try {
    await deleteDoc(doc(db, 'careers', careerId));
  } catch (error) {
    console.warn('Firestore career delete note:', error);
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

  const existing = getCached<QuotationRequest[]>('quotations', []);
  setCached('quotations', [record, ...existing]);

  try {
    await setDoc(doc(db, 'quotationRequests', id), record);
  } catch (error) {
    console.warn('Firestore quote write note:', error);
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
    // fallback to cached
  }
  return cached;
}

export async function updateQuotationStatus(
  id: string,
  status: QuotationRequest['status']
): Promise<void> {
  const cached = getCached<QuotationRequest[]>('quotations', []);
  const updated = cached.map((q) => (q.id === id ? { ...q, status } : q));
  setCached('quotations', updated);

  try {
    await updateDoc(doc(db, 'quotationRequests', id), { status });
  } catch (err) {
    console.warn('Firestore quote update note:', err);
  }
}

export async function removeQuotationRequest(id: string): Promise<void> {
  const cached = getCached<QuotationRequest[]>('quotations', []);
  const updated = cached.filter((q) => q.id !== id);
  setCached('quotations', updated);

  try {
    await deleteDoc(doc(db, 'quotationRequests', id));
  } catch (err) {
    console.warn('Firestore quote delete note:', err);
  }
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

  const existing = getCached<ContactMessage[]>('contactMessages', []);
  setCached('contactMessages', [record, ...existing]);

  try {
    await setDoc(doc(db, 'contactMessages', id), record);
  } catch (error) {
    console.warn('Firestore contact message note:', error);
  }

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
  const cached = getCached<ContactMessage[]>('contactMessages', []);
  const updated = cached.map((m) => (m.id === id ? { ...m, status } : m));
  setCached('contactMessages', updated);

  try {
    await updateDoc(doc(db, 'contactMessages', id), { status });
  } catch (err) {
    console.warn('Firestore contact update note:', err);
  }
}

export async function removeContactMessage(id: string): Promise<void> {
  const cached = getCached<ContactMessage[]>('contactMessages', []);
  const updated = cached.filter((m) => m.id !== id);
  setCached('contactMessages', updated);

  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (err) {
    console.warn('Firestore contact delete note:', err);
  }
}

// ----------------- Seeder & Data Management -----------------
export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  try {
    setCached('siteSettings', DEFAULT_SITE_SETTINGS);
    setCached('stations', DEFAULT_STATIONS);
    setCached('branches', DEFAULT_BRANCHES);
    setCached('services', DEFAULT_SERVICES);
    setCached('partners', DEFAULT_PARTNERS);
    setCached('news', DEFAULT_NEWS);
    setCached('careers', DEFAULT_CAREERS);

    try {
      await setDoc(doc(db, 'siteSettings', 'global'), DEFAULT_SITE_SETTINGS);
      for (const st of DEFAULT_STATIONS) await setDoc(doc(db, 'stations', st.id), st);
      for (const br of DEFAULT_BRANCHES) await setDoc(doc(db, 'carWashBranches', br.id), br);
      for (const srv of DEFAULT_SERVICES) await setDoc(doc(db, 'carWashServices', srv.id), srv);
      for (const prt of DEFAULT_PARTNERS) await setDoc(doc(db, 'partners', prt.id), prt);
      for (const nw of DEFAULT_NEWS) await setDoc(doc(db, 'news', nw.id), nw);
      for (const cr of DEFAULT_CAREERS) await setDoc(doc(db, 'careers', cr.id), cr);
    } catch {
      // ignore firestore sync warning
    }

    return { success: true, message: 'تمت استعادة وتعيين كافة بيانات المنظومة الافتراضية بنجاح!' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: `تعذر إتمام العملية: ${msg}` };
  }
}
