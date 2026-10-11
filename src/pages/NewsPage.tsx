import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NewsArticle } from '../types';
import { Newspaper, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

interface NewsPageProps {
  news: NewsArticle[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ news }) => {
  const { locale, t } = useLanguage();
  const isRtl = locale === 'ar';

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const published = news.filter((n) => n.isPublished);

  return (
    <div className="space-y-20 pb-20">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-[#141414] to-[#080808] border-b border-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] text-xs font-semibold">
            <Newspaper className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{isRtl ? 'المركز الإعلامي' : 'Media Center'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#F4F1E9] tracking-tight">
            {t('newsTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-2xl mx-auto leading-relaxed">
            {t('newsSubtitle')}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {published.map((item) => (
            <div
              key={item.id}
              className="bg-[#121212] border border-[#222] hover:border-[#C8A45D]/50 rounded-sm overflow-hidden flex flex-col justify-between transition-colors group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.titleEn}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 start-3 px-2.5 py-1 bg-[#080808]/90 border border-[#C8A45D]/40 text-[#E2C98A] text-[10px] font-semibold rounded-sm">
                  {item.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] font-mono mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{item.publishedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F4F1E9] mb-3 group-hover:text-[#E2C98A] transition-colors leading-snug">
                    {isRtl ? item.titleAr : item.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed line-clamp-3">
                    {isRtl ? item.summaryAr : item.summaryEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1C1C1C]">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A45D] hover:text-[#E2C98A] transition-colors cursor-pointer"
                  >
                    <span>{t('newsReadMore')}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[#080808]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#C8A45D]/50 rounded-sm max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div className="flex items-center gap-2 text-xs text-[#C8A45D]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedArticle.publishedDate}</span>
                <span>&bull;</span>
                <span>{selectedArticle.category}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 hover:text-[#E2C98A] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="h-60 rounded-sm overflow-hidden">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.titleEn}
                className="w-full h-full object-cover filter brightness-90"
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1E9] leading-snug">
              {isRtl ? selectedArticle.titleAr : selectedArticle.titleEn}
            </h2>

            <div className="text-xs sm:text-sm text-[#A6A6A6] leading-relaxed space-y-4">
              <p className="font-semibold text-[#F4F1E9]">
                {isRtl ? selectedArticle.summaryAr : selectedArticle.summaryEn}
              </p>
              <p>
                {isRtl ? selectedArticle.contentAr : selectedArticle.contentEn}
              </p>
            </div>

            <div className="pt-4 border-t border-[#222] text-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-semibold rounded-sm bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-[#F4F1E9]"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
