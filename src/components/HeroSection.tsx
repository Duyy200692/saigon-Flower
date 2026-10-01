import React from 'react';
import { FlowerItem } from '../data/flowers';

interface HeroSectionProps {
  lang: 'vi' | 'en';
  onOpenIndex: () => void;
  onOpenCredits: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenIndex,
  onOpenCredits
}) => {
  return (
    <section className="pt-10 pb-8 px-4 text-center max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Editorial Nav Row matching Image 1 */}
      <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#141414]/80 pb-6 border-b border-[#141414]/15 mb-10">
        <span className="text-left font-bold tracking-widest">
          JUETSAIGON.COM
        </span>
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenIndex}
            className="hover:underline tracking-widest underline-offset-4"
          >
            INDEX
          </button>
          <button
            onClick={onOpenCredits}
            className="hover:underline tracking-widest underline-offset-4"
          >
            CREDITS
          </button>
        </div>
      </div>

      {/* Main Monumental Title matching THE FLEUR typography */}
      <div className="space-y-3 mb-6">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-fleur-title font-normal tracking-tight text-[#141414] uppercase leading-none select-none">
          JU ET SAIGON
        </h1>
        <p className="text-lg sm:text-2xl font-editorial-serif italic text-[#141414]/90 tracking-wide">
          Encyclopædia Botanica Digital
        </p>
      </div>

      {/* Discover Kicker */}
      <div className="mt-4 pt-4">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#141414]/80 uppercase">
          {lang === 'vi' ? 'KHÁM PHÁ CÁC TÁC PHẨM HOA ĐỘC BẢN' : 'DISCOVER THE FLOWERS'}
        </p>
      </div>
    </section>
  );
};
