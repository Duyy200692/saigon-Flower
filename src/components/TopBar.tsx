import React from 'react';
import { Volume2, VolumeX, Menu, Sparkles, PhoneCall } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';

interface TopBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  flowerCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  setLang,
  isAudioPlaying,
  onToggleAudio,
  onOpenIndex,
  onOpenOrder,
  onOpenAtelier,
  flowerCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#dcd8cf]/95 backdrop-blur-md border-b border-[#141414]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark in display face */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-lg md:text-xl font-bold tracking-wider font-fleur-title text-[#141414] hover:opacity-80 transition-opacity uppercase"
          >
            {ATELIER_DATA.name}
          </a>
          <span className="hidden sm:inline-block text-[11px] tracking-widest text-[#141414]/60 uppercase">
            {lang === 'vi' ? 'Sài Gòn · 2026' : 'Saigon · 2026'}
          </span>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-[#141414]/75">
          <a href="#gallery-matrix" className="hover:text-[#141414] transition-colors">
            {lang === 'vi' ? 'Bộ Sưu Tập' : 'Gallery Matrix'}
          </a>
          <a href="#philosophy" className="hover:text-[#141414] transition-colors">
            {lang === 'vi' ? 'Triết Lý Hoa' : 'Philosophy'}
          </a>
          <a href="#botanical-monographs" className="hover:text-[#141414] transition-colors">
            {lang === 'vi' ? 'Hồ Sơ Thực Vật' : 'Monographs'}
          </a>
          <button
            onClick={onOpenAtelier}
            className="hover:text-[#141414] transition-colors text-left"
          >
            {lang === 'vi' ? 'Atelier Q.1' : 'Atelier D1'}
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Index Trigger */}
          <button
            onClick={onOpenIndex}
            className="px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-full border border-[#141414]/25 hover:border-[#141414] hover:bg-[#141414] hover:text-[#dcd8cf] transition-all flex items-center gap-1.5"
            title="Open Botanical Index"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>INDEX ({flowerCount})</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-full border transition-all ${
              isAudioPlaying
                ? 'bg-[#141414] text-[#dcd8cf] border-[#141414]'
                : 'border-[#141414]/25 text-[#141414] hover:border-[#141414]'
            }`}
            title={isAudioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Rain & Resonance'}
            aria-label="Toggle ambient sound"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center text-[11px] font-bold border border-[#141414]/25 rounded-full p-0.5">
            <button
              onClick={() => setLang('vi')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                lang === 'vi' ? 'bg-[#141414] text-[#dcd8cf]' : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                lang === 'en' ? 'bg-[#141414] text-[#dcd8cf]' : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Bespoke Order CTA */}
          <button
            onClick={onOpenOrder}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#dcd8cf] bg-[#141414] rounded-full hover:bg-[#2c2b28] transition-all whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Đặt Hoa' : 'Bespoke Order'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
