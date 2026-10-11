import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SiteSettings } from '../../types';
import { Volume2, X } from 'lucide-react';

interface AnnouncementBarProps {
  settings: SiteSettings;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings }) => {
  const { locale } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.isAnnouncementActive || dismissed) return null;

  const text = locale === 'ar' ? settings.announcementAr : settings.announcementEn;
  if (!text) return null;

  return (
    <div className="bg-gradient-to-r from-[#151515] via-[#221c10] to-[#151515] border-b border-[#C8A45D]/30 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#E2C98A] overflow-hidden">
          <Volume2 className="w-3.5 h-3.5 flex-shrink-0 text-[#C8A45D]" />
          <span className="font-medium truncate text-[#F4F1E9]">{text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#A6A6A6] hover:text-[#F4F1E9] p-0.5 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
