import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base tracking-widest',
    md: 'text-xl tracking-widest',
    lg: 'text-3xl tracking-widest',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] tracking-widest',
    lg: 'text-xs tracking-widest',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Star Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(200,164,93,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Diamond Boundary */}
          <rect
            x="50"
            y="5"
            width="63.64"
            height="63.64"
            transform="rotate(45 50 5)"
            stroke="#C8A45D"
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* Core Geometric 8-Pointed Star Facets */}
          {/* Top Point */}
          <path d="M50 8 L57 38 L50 48 L43 38 Z" fill="url(#goldGradient1)" />
          {/* Bottom Point */}
          <path d="M50 92 L57 62 L50 52 L43 62 Z" fill="url(#goldGradient2)" />
          {/* Right Point */}
          <path d="M92 50 L62 57 L52 50 L62 43 Z" fill="url(#goldGradient1)" />
          {/* Left Point */}
          <path d="M8 50 L38 57 L48 50 L38 43 Z" fill="url(#goldGradient2)" />

          {/* Diagonal Facets */}
          <path d="M80 20 L58 42 L50 50 L65 35 Z" fill="#E2C98A" fillOpacity="0.85" />
          <path d="M20 80 L42 58 L50 50 L35 65 Z" fill="#C8A45D" fillOpacity="0.85" />
          <path d="M80 80 L58 58 L50 50 L65 65 Z" fill="#9F792B" fillOpacity="0.9" />
          <path d="M20 20 L42 42 L50 50 L35 35 Z" fill="#F4F1E9" fillOpacity="0.95" />

          {/* Central Precious Core */}
          <circle cx="50" cy="50" r="4.5" fill="#F4F1E9" />

          <defs>
            <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4F1E9" />
              <stop offset="50%" stopColor="#E2C98A" />
              <stop offset="100%" stopColor="#C8A45D" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8A45D" />
              <stop offset="50%" stopColor="#9F792B" />
              <stop offset="100%" stopColor="#080808" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Corporate Typographic Branding */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 font-bold font-serif-luxury leading-none">
          <span className={`text-[#F4F1E9] font-extrabold ${textSizes[size]}`}>RM</span>
          <span className={`gold-gradient-text font-black ${textSizes[size]}`}>STAR</span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[#A6A6A6] uppercase font-medium mt-0.5 leading-tight ${subtitleSizes[size]}`}
          >
            Energy &bull; Stations &bull; Care
          </span>
        )}
      </div>
    </div>
  );
};
