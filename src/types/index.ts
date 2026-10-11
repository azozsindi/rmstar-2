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
  companyNameAr: string;
  companyNameEn: string;
  officialEmail: string;
  officialPhone: string;
  officialWhatsApp: string;
  headquartersAr: string;
  headquartersEn: string;
  commercialRegistration: string;
  announcementAr: string;
  announcementEn: string;
  isAnnouncementActive: boolean;
  updatedAt: string;
}
