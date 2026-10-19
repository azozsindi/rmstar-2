export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface FuelStation {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  services: string[];
  openingHoursAr: string;
  openingHoursEn: string;
  contactPhone: string;
  mapUrl: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarWashBranch {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  openingHoursAr: string;
  openingHoursEn: string;
  contactPhone: string;
  mapUrl: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarWashService {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  duration: string;
  pricePlaceholder?: string;
  featuresAr: string[];
  featuresEn: string[];
  imageUrl?: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface Partner {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string;
  websiteUrl: string;
  categoryAr?: string;
  categoryEn?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  imageUrl: string;
  publishedDate: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export interface QuotationRequest {
  id: string;
  contactName: string;
  companyName: string;
  businessEmail: string;
  telephoneNumber: string;
  country: string;
  city: string;
  productRequested: string;
  quantity: string;
  unit: string;
  additionalRequirements: string;
  status: 'pending' | 'reviewing' | 'contacted' | 'archived';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface CareerPosting {
  id: string;
  titleAr: string;
  titleEn: string;
  departmentAr: string;
  departmentEn: string;
  locationAr: string;
  locationEn: string;
  type: string;
  descriptionAr: string;
  descriptionEn: string;
  isPublished: boolean;
  createdAt: string;
}

export interface SiteSettings {
  // Brand & Identity
  companyNameAr: string;
  companyNameEn: string;
  brandTaglineAr?: string;
  brandTaglineEn?: string;
  brandSubtitleAr?: string;
  brandSubtitleEn?: string;
  officialEmail: string;
  officialPhone: string;
  officialWhatsApp: string;
  headquartersAr: string;
  headquartersEn: string;
  commercialRegistration: string;
  announcementAr: string;
  announcementEn: string;
  isAnnouncementActive: boolean;

  // Homepage Hero Section
  heroBadgeAr?: string;
  heroBadgeEn?: string;
  heroTitleAr?: string;
  heroTitleEn?: string;
  heroDescAr?: string;
  heroDescEn?: string;
  heroImageUrl?: string;
  heroCtaQuoteAr?: string;
  heroCtaQuoteEn?: string;
  heroCtaServicesAr?: string;
  heroCtaServicesEn?: string;

  // Homepage Metrics & Statistics
  metric1Val?: string;
  metric1LabelAr?: string;
  metric1LabelEn?: string;
  metric2Val?: string;
  metric2LabelAr?: string;
  metric2LabelEn?: string;
  metric3Val?: string;
  metric3LabelAr?: string;
  metric3LabelEn?: string;

  // Homepage Strategic Sectors
  sectorsTitleAr?: string;
  sectorsTitleEn?: string;
  sectorsSubtitleAr?: string;
  sectorsSubtitleEn?: string;
  sector1TitleAr?: string;
  sector1TitleEn?: string;
  sector1DescAr?: string;
  sector1DescEn?: string;
  sector2TitleAr?: string;
  sector2TitleEn?: string;
  sector2DescAr?: string;
  sector2DescEn?: string;
  sector3TitleAr?: string;
  sector3TitleEn?: string;
  sector3DescAr?: string;
  sector3DescEn?: string;
  sector1ImageUrl?: string;
  sector2ImageUrl?: string;
  sector3ImageUrl?: string;

  // Diesel Supply Page
  dieselPageTitleAr?: string;
  dieselPageTitleEn?: string;
  dieselPageSubtitleAr?: string;
  dieselPageSubtitleEn?: string;
  dieselSpecsTitleAr?: string;
  dieselSpecsTitleEn?: string;
  dieselSpecsDescAr?: string;
  dieselSpecsDescEn?: string;
  dieselSpec1TitleAr?: string;
  dieselSpec1TitleEn?: string;
  dieselSpec1DescAr?: string;
  dieselSpec1DescEn?: string;
  dieselSpec2TitleAr?: string;
  dieselSpec2TitleEn?: string;
  dieselSpec2DescAr?: string;
  dieselSpec2DescEn?: string;
  dieselSpec3TitleAr?: string;
  dieselSpec3TitleEn?: string;
  dieselSpec3DescAr?: string;
  dieselSpec3DescEn?: string;
  dieselFleetTitleAr?: string;
  dieselFleetTitleEn?: string;
  dieselFleetDescAr?: string;
  dieselFleetDescEn?: string;
  dieselSpecsImageUrl?: string;
  dieselFleetImageUrl?: string;

  // About Us Page
  aboutTitleAr?: string;
  aboutTitleEn?: string;
  aboutSubtitleAr?: string;
  aboutSubtitleEn?: string;
  aboutOverviewAr?: string;
  aboutOverviewEn?: string;
  aboutOverview2Ar?: string;
  aboutOverview2En?: string;
  aboutVisionTitleAr?: string;
  aboutVisionTitleEn?: string;
  aboutVisionDescAr?: string;
  aboutVisionDescEn?: string;
  aboutMissionTitleAr?: string;
  aboutMissionTitleEn?: string;
  aboutMissionDescAr?: string;
  aboutMissionDescEn?: string;
  aboutVal1TitleAr?: string;
  aboutVal1TitleEn?: string;
  aboutVal1DescAr?: string;
  aboutVal1DescEn?: string;
  aboutVal2TitleAr?: string;
  aboutVal2TitleEn?: string;
  aboutVal2DescAr?: string;
  aboutVal2DescEn?: string;
  aboutVal3TitleAr?: string;
  aboutVal3TitleEn?: string;
  aboutVal3DescAr?: string;
  aboutVal3DescEn?: string;
  aboutImageUrl?: string;

  // Page Header Banners & Titles
  stationsPageTitleAr?: string;
  stationsPageTitleEn?: string;
  stationsPageSubtitleAr?: string;
  stationsPageSubtitleEn?: string;
  carWashPageTitleAr?: string;
  carWashPageTitleEn?: string;
  carWashPageSubtitleAr?: string;
  carWashPageSubtitleEn?: string;
  partnersPageTitleAr?: string;
  partnersPageTitleEn?: string;
  partnersPageSubtitleAr?: string;
  partnersPageSubtitleEn?: string;
  newsPageTitleAr?: string;
  newsPageTitleEn?: string;
  newsPageSubtitleAr?: string;
  newsPageSubtitleEn?: string;
  careersPageTitleAr?: string;
  careersPageTitleEn?: string;
  careersPageSubtitleAr?: string;
  careersPageSubtitleEn?: string;
  careersEmail?: string;
  contactPageTitleAr?: string;
  contactPageTitleEn?: string;
  contactPageSubtitleAr?: string;
  contactPageSubtitleEn?: string;
  contactWorkingHoursAr?: string;
  contactWorkingHoursEn?: string;

  // Legal & Compliance
  privacyTitleAr?: string;
  privacyTitleEn?: string;
  privacyTextAr?: string;
  privacyTextEn?: string;
  termsTitleAr?: string;
  termsTitleEn?: string;
  termsTextAr?: string;
  termsTextEn?: string;
  footerCopyrightAr?: string;
  footerCopyrightEn?: string;

  // Admin Credentials
  adminUsername?: string;
  adminPassword?: string;

  updatedAt: string;
}

