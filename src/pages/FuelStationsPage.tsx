import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FuelStation } from '../types';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Check,
  Fuel,
  Sparkles,
} from 'lucide-react';

interface FuelStationsPageProps {
  stations: FuelStation[];
  setActiveTab: (tab: string) => void;
  settings?: import('../types').SiteSettings;
}

export const FuelStationsPage: React.FC<FuelStationsPageProps> = ({ stations, settings }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  const published = stations.filter((s) => s.isPublished);

  // Extract unique cities
  const cities = Array.from(
    new Set(published.map((s) => (isRtl ? s.cityAr : s.cityEn)))
  );

  const filtered = published.filter((st) => {
    const name = isRtl ? st.nameAr : st.nameEn;
    const city = isRtl ? st.cityAr : st.cityEn;
    const address = isRtl ? st.addressAr : st.addressEn;

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="relative py-16 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Fuel className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'محطات نموذجية معتمدة' : 'Official Retail Network'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {(isRtl ? settings?.stationsPageTitleAr : settings?.stationsPageTitleEn) || t('stationsTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto">
            {(isRtl ? settings?.stationsPageSubtitleAr : settings?.stationsPageSubtitleEn) || t('stationsSubtitle')}
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto pt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-[#777]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('stationsSearchPlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 bg-[#121212] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2.5 bg-[#121212] border border-[#2E2E2E] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none cursor-pointer"
            >
              <option value="all">{isRtl ? 'كافة المدن' : 'All Cities'}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Stations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1C1C1C]">
          <span className="text-xs text-[#8A8A8A] font-mono">
            {isRtl
              ? `تم العثور على ${filtered.length} محطة وقود`
              : `Found ${filtered.length} service stations`}
          </span>
          <span className="text-xs text-[#C8A45D] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'جاهزية 24 ساعة' : '24/7 Fueling Readiness'}</span>
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#101010] border border-[#202020] rounded-sm p-8">
            <Fuel className="w-10 h-10 text-[#666] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#F4F1E9]">
              {isRtl ? 'لا توجد محطات تطابق بحثك' : 'No stations match your criteria'}
            </h4>
            <p className="text-xs text-[#888] mt-1">
              {isRtl ? 'جرّب تغيير كلمات البحث أو اختيار مدينة أخرى.' : 'Try adjusting your search query or city filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((station) => (
              <div
                key={station.id}
                className="bg-[#121212] border border-[#222] hover:border-[#C8A45D]/60 rounded-sm overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={station.imageUrl}
                    alt={station.nameEn}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                  <div className="absolute top-3 end-3 px-2.5 py-1 rounded-sm bg-[#080808]/90 border border-[#C8A45D]/40 text-[#E2C98A] text-[10px] font-bold">
                    {station.openingHoursEn.includes('24/7')
                      ? t('stationsStatusOpen')
                      : (isRtl ? station.openingHoursAr : station.openingHoursEn)}
                  </div>
                  <div className="absolute bottom-3 start-4 flex items-center gap-1.5 text-xs font-semibold text-[#E2C98A]">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{isRtl ? station.cityAr : station.cityEn}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#F4F1E9] mb-2 group-hover:text-[#E2C98A] transition-colors">
                      {isRtl ? station.nameAr : station.nameEn}
                    </h3>
                    <p className="text-xs text-[#8A8A8A] leading-relaxed mb-4">
                      {isRtl ? station.addressAr : station.addressEn}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6A6A6] block">
                        {t('stationsServices')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {station.services.map((svc, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-[#C8C8C8]"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1C1C1C] flex items-center justify-between gap-2">
                    <a
                      href={station.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-sm bg-[#1A1A1A] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-semibold text-[#F4F1E9] hover:text-[#E2C98A] transition-colors flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>{t('stationsDirections')}</span>
                    </a>

                    <button
                      onClick={() => setSelectedStation(station)}
                      className="text-xs font-semibold text-[#C8A45D] hover:underline"
                    >
                      {isRtl ? 'عرض بطاقة المحطة' : 'View Card'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Station Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 bg-[#080808]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C8A45D]/50 rounded-sm max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in">
            <div className="relative h-48">
              <img
                src={selectedStation.imageUrl}
                alt={selectedStation.nameEn}
                className="w-full h-full object-cover filter brightness-90"
              />
              <button
                onClick={() => setSelectedStation(null)}
                className="absolute top-3 end-3 p-1.5 bg-[#080808]/80 text-[#F4F1E9] hover:text-[#E2C98A] rounded-sm text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C8A45D]">
                <MapPin className="w-4 h-4" />
                <span>{isRtl ? selectedStation.cityAr : selectedStation.cityEn}</span>
              </div>
              <h3 className="text-xl font-bold text-[#F4F1E9]">
                {isRtl ? selectedStation.nameAr : selectedStation.nameEn}
              </h3>
              <p className="text-xs text-[#A6A6A6]">
                {isRtl ? selectedStation.addressAr : selectedStation.addressEn}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#222]">
                <div className="flex items-center gap-2 text-xs text-[#C8C8C8]">
                  <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>
                    {isRtl ? selectedStation.openingHoursAr : selectedStation.openingHoursEn}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#C8C8C8]">
                  <Phone className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <a href={`tel:${selectedStation.contactPhone}`} className="hover:underline" dir="ltr">
                    {selectedStation.contactPhone}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#E2C98A] block mb-2">
                  {t('stationsServices')}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedStation.services.map((svc, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-[#A6A6A6]">
                      <Check className="w-3 h-3 text-[#C8A45D]" />
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <a
                  href={selectedStation.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center text-xs font-bold rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808]"
                >
                  {t('stationsDirections')}
                </a>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="px-4 py-2.5 text-xs border border-[#333] hover:border-[#666] text-[#F4F1E9] rounded-sm"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
