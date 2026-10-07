import React from 'react';

interface HeroSectionProps {
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenIndex: () => void;
  onOpenCredits: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  theme = 'light',
  onOpenIndex
}) => {
  const isDark = theme === 'dark';

  return (
    <section className="pt-10 pb-8 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Editorial Nav Row */}
      <div
        className={`w-full flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-widest uppercase pb-6 border-b mb-10 transition-colors ${
          isDark
            ? 'text-[#ede9df]/75 border-white/15'
            : 'text-[#141414]/80 border-[#141414]/15'
        }`}
      >
        <span className="text-left font-bold tracking-widest">
          JUETSAIGON.COM
        </span>
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenIndex}
            className={`transition-colors underline underline-offset-4 tracking-widest font-mono text-[11px] ${
              isDark ? 'hover:text-white' : 'hover:text-[#141414]'
            }`}
          >
            INDEX
          </button>
        </div>
      </div>

      {/* Main Monumental Title */}
      <div className="space-y-3 mb-6">
        <h1
          className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-fleur-title font-normal tracking-tight uppercase leading-none select-none transition-colors ${
            isDark ? 'text-[#ede9df]' : 'text-[#141414]'
          }`}
        >
          JU ET SAIGON
        </h1>
        <p
          className={`text-lg sm:text-2xl font-editorial-serif italic tracking-wide transition-colors ${
            isDark ? 'text-[#ede9df]/85' : 'text-[#141414]/90'
          }`}
        >
          Encyclopædia Botanica Digital
        </p>
      </div>

      {/* Discover Kicker */}
      <div className="mt-4 pt-4">
        <p
          className={`text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase transition-colors ${
            isDark ? 'text-[#ede9df]/75' : 'text-[#141414]/80'
          }`}
        >
          {lang === 'vi' ? 'KHÁM PHÁ CÁC TÁC PHẨM HOA ĐỘC BẢN' : 'DISCOVER THE FLOWERS'}
        </p>
      </div>
    </section>
  );
};
