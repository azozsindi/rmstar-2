import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FuelStation, CarWashService, Partner, NewsArticle, SiteSettings } from '../types';
import {
  Fuel,
  Car,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  stations: FuelStation[];
  services: CarWashService[];
  partners: Partner[];
  news: NewsArticle[];
  settings: SiteSettings;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stations,
  services,
  partners,
  news,
  settings,
  setActiveTab,
}) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const publishedStations = stations.filter((s) => s.isPublished).slice(0, 3);
  const publishedServices = services.filter((s) => s.isPublished).slice(0, 3);
  const publishedPartners = partners.filter((p) => p.isPublished);
  const publishedNews = news.filter((n) => n.isPublished).slice(0, 2);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#1C1C1C]">
        {/* Cinematic Backdrop Image with Dark Luxury Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
            alt="RM STAR Energy & Industrial Petroleum Logistics"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-75 scale-105 transform animate-pulse duration-10000"
          />
          {/* Subtle Multi-Layer Luxury Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/90" />
          <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-[#080808]/50 to-[#080808]" />
          {/* Subtle gold ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C8A45D]/10 blur-[130px] rounded-full pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          {/* Gold Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818]/90 border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold mb-6 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#F4F1E9] leading-tight sm:leading-tight md:leading-tight mb-6">
            <span className="font-serif-luxury">{t('heroTitle')}</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            {t('heroDesc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('quote')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-gradient-to-r from-[#C8A45D] via-[#E2C98A] to-[#C8A45D] text-[#080808] font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(200,164,93,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('heroCtaQuote')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('diesel')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[#121212] border border-[#2E2E2E] hover:border-[#C8A45D] text-[#F4F1E9] hover:text-[#E2C98A] font-semibold text-sm transition-all cursor-pointer"
            >
              {t('heroCtaServices')}
            </button>
          </div>

          {/* Enterprise Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-[#1C1C1C]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-mono">
                {t('heroMetric1Value')}
              </div>
              <div className="text-[11px] sm:text-xs text-[#8A8A8A] mt-1 font-medium">
                {t('heroMetric1Label')}
              </div>
            </div>
            <div className="text-center border-x border-[#1C1C1C]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9] font-mono">
                {t('heroMetric2Value')}
              </div>
              <div className="text-[11px] sm:text-xs text-[#8A8A8A] mt-1 font-medium">
                {t('heroMetric2Label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E2C98A] font-mono">
                {t('heroMetric3Value')}
              </div>
              <div className="text-[11px] sm:text-xs text-[#8A8A8A] mt-1 font-medium">
                {t('heroMetric3Label')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE BUSINESS SECTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] mb-2 block">
            RM STAR PORTFOLIO
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F1E9] mb-4">
            {t('sectorsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
            {t('sectorsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sector 1: Diesel Supply */}
          <div className="group relative bg-[#121212] border border-[#202020] hover:border-[#C8A45D]/60 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
                alt="Diesel Supply"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              <div className="absolute top-4 start-4 p-2.5 rounded-sm bg-[#080808]/80 border border-[#C8A45D]/50 text-[#E2C98A]">
                <Fuel className="w-5 h-5 text-[#C8A45D]" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F4F1E9] mb-3 group-hover:text-[#E2C98A] transition-colors">
                  {t('sector1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed mb-6">
                  {t('sector1Desc')}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('diesel')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A45D] hover:text-[#E2C98A] transition-colors pt-2 border-t border-[#1C1C1C]"
              >
                <span>{t('sector1Link')}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Sector 2: Fuel Stations */}
          <div className="group relative bg-[#121212] border border-[#202020] hover:border-[#C8A45D]/60 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"
                alt="Fuel Stations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              <div className="absolute top-4 start-4 p-2.5 rounded-sm bg-[#080808]/80 border border-[#C8A45D]/50 text-[#E2C98A]">
                <Zap className="w-5 h-5 text-[#C8A45D]" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F4F1E9] mb-3 group-hover:text-[#E2C98A] transition-colors">
                  {t('sector2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed mb-6">
                  {t('sector2Desc')}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('stations')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A45D] hover:text-[#E2C98A] transition-colors pt-2 border-t border-[#1C1C1C]"
              >
                <span>{t('sector2Link')}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Sector 3: Vehicle Care & Car Wash */}
          <div className="group relative bg-[#121212] border border-[#202020] hover:border-[#C8A45D]/60 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80"
                alt="Car Wash & Detailing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              <div className="absolute top-4 start-4 p-2.5 rounded-sm bg-[#080808]/80 border border-[#C8A45D]/50 text-[#E2C98A]">
                <Car className="w-5 h-5 text-[#C8A45D]" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F4F1E9] mb-3 group-hover:text-[#E2C98A] transition-colors">
                  {t('sector3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed mb-6">
                  {t('sector3Desc')}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('carwash')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A45D] hover:text-[#E2C98A] transition-colors pt-2 border-t border-[#1C1C1C]"
              >
                <span>{t('sector3Link')}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED FUEL STATIONS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#1C1C1C]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] mb-1 block">
              NETWORK LOCATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9]">
              {t('stationsTitle')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('stations')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E2C98A] hover:text-[#C8A45D] transition-colors"
          >
            <span>{isRtl ? 'عرض كافة المحطات' : 'View All Stations'}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedStations.map((station) => (
            <div
              key={station.id}
              className="bg-[#121212] border border-[#222] rounded-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={station.imageUrl}
                  alt={station.nameEn}
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 end-3 bg-[#080808]/90 border border-[#C8A45D]/40 text-[#E2C98A] text-[10px] font-semibold px-2.5 py-1 rounded-sm">
                  {station.openingHoursEn.includes('24/7') ? t('stationsStatusOpen') : (isRtl ? station.openingHoursAr : station.openingHoursEn)}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] mb-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isRtl ? station.cityAr : station.cityEn}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#F4F1E9] mb-2">
                    {isRtl ? station.nameAr : station.nameEn}
                  </h4>
                  <p className="text-xs text-[#8A8A8A] mb-4">
                    {isRtl ? station.addressAr : station.addressEn}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
                  <a
                    href={station.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#E2C98A] hover:underline flex items-center gap-1"
                  >
                    <span>{t('stationsDirections')}</span>
                  </a>
                  <button
                    onClick={() => setActiveTab('stations')}
                    className="text-xs text-[#8A8A8A] hover:text-[#F4F1E9]"
                  >
                    {isRtl ? 'التفاصيل' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRECISION CAR WASH PREVIEW */}
      <section className="bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] mb-1 block">
                PREMIUM VEHICLE CARE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9]">
                {t('carWashTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8A8A] mt-2 max-w-2xl">
                {t('carWashSubtitle')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('carwash')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E2C98A] hover:text-[#C8A45D] transition-colors"
            >
              <span>{isRtl ? 'جميع باقات الغسيل والعناية' : 'Explore All Packages'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#141414] border border-[#242424] hover:border-[#C8A45D]/50 rounded-sm p-6 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-[#1A1A1A] border border-[#333] text-[#E2C98A] rounded-sm flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C8A45D]" />
                      <span>{srv.duration}</span>
                    </span>
                    {srv.pricePlaceholder && (
                      <span className="text-xs text-[#8A8A8A]">{srv.pricePlaceholder}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#F4F1E9] mb-2">
                    {isRtl ? srv.nameAr : srv.nameEn}
                  </h3>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed mb-6">
                    {isRtl ? srv.descriptionAr : srv.descriptionEn}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {(isRtl ? srv.featuresAr : srv.featuresEn).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#C8C8C8]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#C8A45D] flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('carwash')}
                  className="w-full py-2.5 text-center text-xs font-semibold border border-[#2E2E2E] hover:border-[#C8A45D] text-[#F4F1E9] hover:text-[#E2C98A] rounded-sm transition-colors"
                >
                  {t('carWashPackageBtn')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORPORATE VALUES & COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] mb-1 block">
            ENTERPRISE ETHOS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F1E9]">
            {t('aboutValuesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121212] border border-[#222] p-8 rounded-sm">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 flex items-center justify-center text-[#E2C98A] mb-6">
              <ShieldCheck className="w-6 h-6 text-[#C8A45D]" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F1E9] mb-3">{t('val1Title')}</h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
              {t('val1Desc')}
            </p>
          </div>

          <div className="bg-[#121212] border border-[#222] p-8 rounded-sm">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 flex items-center justify-center text-[#E2C98A] mb-6">
              <Award className="w-6 h-6 text-[#C8A45D]" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F1E9] mb-3">{t('val2Title')}</h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
              {t('val2Desc')}
            </p>
          </div>

          <div className="bg-[#121212] border border-[#222] p-8 rounded-sm">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 flex items-center justify-center text-[#E2C98A] mb-6">
              <TrendingUp className="w-6 h-6 text-[#C8A45D]" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F1E9] mb-3">{t('val3Title')}</h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
              {t('val3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED PARTNERS SHOWCASE */}
      {publishedPartners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0E0E0E] border border-[#1E1E1E] rounded-sm p-8 sm:p-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161616] border border-[#2A2A2A] rounded-full text-[11px] font-semibold text-[#C8A45D] mb-3">
                <CheckCircle className="w-3 h-3 text-[#C8A45D]" />
                <span>{t('partnersVerifiedBadge')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1E9]">
                {t('partnersTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {publishedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-[#141414] border border-[#222] p-6 rounded-sm text-center flex flex-col items-center justify-center hover:border-[#C8A45D]/40 transition-colors"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.nameEn}
                    className="w-16 h-16 object-cover rounded-sm mb-4 filter grayscale contrast-125"
                  />
                  <h4 className="text-sm font-bold text-[#F4F1E9] mb-1">
                    {isRtl ? partner.nameAr : partner.nameEn}
                  </h4>
                  <span className="text-[11px] text-[#C8A45D]">
                    {isRtl ? partner.categoryAr : partner.categoryEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. LATEST CORPORATE NEWS */}
      {publishedNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1C1C1C]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8A45D] mb-1 block">
                PRESS & INSIGHTS
              </span>
              <h2 className="text-2xl font-bold text-[#F4F1E9]">{t('newsTitle')}</h2>
            </div>
            <button
              onClick={() => setActiveTab('news')}
              className="text-xs font-bold text-[#E2C98A] hover:underline"
            >
              {isRtl ? 'عرض كافة الأخبار' : 'All News Releases'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedNews.map((article) => (
              <div
                key={article.id}
                className="bg-[#121212] border border-[#222] rounded-sm overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.titleEn}
                    className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C8A45D] uppercase tracking-wider block mb-1">
                      {article.publishedDate}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#F4F1E9] mb-2 leading-snug">
                      {isRtl ? article.titleAr : article.titleEn}
                    </h4>
                    <p className="text-xs text-[#8A8A8A] line-clamp-3 leading-relaxed mb-4">
                      {isRtl ? article.summaryAr : article.summaryEn}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs text-[#E2C98A] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('newsReadMore')}</span>
                    {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. COMMERCIAL SUPPLY CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#181818] via-[#121212] to-[#181818] border border-[#C8A45D]/40 rounded-sm p-8 sm:p-14 text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F4F1E9]">
              {isRtl ? 'هل تحتاج إلى توريد ديزل تجاري لمنشأتك أو مشروعك؟' : 'Require Commercial Bulk Diesel Supply for Your Fleet or Project?'}
            </h2>
            <p className="text-sm sm:text-base text-[#A6A6A6] leading-relaxed">
              {isRtl
                ? 'فريقنا التجاري جاهز لتقديم حلول إمداد مرنة، عقود توريد موثوقة، وأسعار تنافسية وفق أعلى المواصفات الفنية المعتمدة.'
                : 'Our commercial energy advisors formulate tailored delivery schedules, rigorous ISO fuel compliance, and competitive wholesale terms.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('quote')}
                className="px-8 py-3.5 rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(200,164,93,0.5)] transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t('heroCtaQuote')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
