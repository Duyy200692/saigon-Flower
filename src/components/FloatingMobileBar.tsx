import React from 'react';
import { Layers, Sparkles, Volume2, VolumeX, PhoneCall, Palette } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface FloatingMobileBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenWorkshop?: () => void;
  flowerCount: number;
}

export const FloatingMobileBar: React.FC<FloatingMobileBarProps> = ({
  lang,
  setLang,
  isAudioPlaying,
  onToggleAudio,
  onOpenIndex,
  onOpenOrder,
  onOpenWorkshop,
  flowerCount
}) => {
  const handleIndexClick = () => {
    soundEngine.playFlowerChime(432);
    onOpenIndex();
  };

  const handleWorkshopClick = () => {
    soundEngine.playFlowerChime(528);
    if (onOpenWorkshop) {
      onOpenWorkshop();
    }
  };

  const handleAudioClick = () => {
    soundEngine.playFlowerChime(480);
    onToggleAudio();
  };

  const handleLangToggle = () => {
    soundEngine.playFlowerChime(640);
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const handleOrderClick = () => {
    soundEngine.playFlowerChime(580);
    onOpenOrder();
  };

  return (
    <div className="fixed bottom-3 inset-x-2 sm:inset-x-6 z-40 md:hidden pointer-events-none">
      {/* Continuous Curves / Squircle Frosted Glass Floating Dock */}
      <nav
        aria-label="Mobile quick actions"
        className="pointer-events-auto max-w-lg mx-auto glass-frost-dock squircle-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1 shadow-soft-floating border border-white/20 select-none backdrop-blur-2xl"
      >
        
        {/* Collection Archive / Index Trigger with Squircle Curve */}
        <button
          onClick={handleIndexClick}
          className="spring-press flex items-center gap-1.5 px-3 py-2 rounded-[22px] bg-white/12 hover:bg-white/22 active:bg-white/28 text-white/95 text-[11px] font-mono tracking-wider border border-white/15 min-h-[42px]"
          aria-label="Open collection catalog"
        >
          <Layers className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-semibold whitespace-nowrap">{lang === 'vi' ? 'BỘ SƯU TẬP' : 'ARCHIVE'}</span>
          <span className="text-[10px] bg-amber-400/25 text-amber-300 px-1.5 py-0.5 rounded-full font-mono font-bold leading-none">
            {flowerCount}
          </span>
        </button>

        {/* Workshop Quick Access Tab (Squircle) */}
        {onOpenWorkshop && (
          <button
            onClick={handleWorkshopClick}
            className="spring-press flex items-center gap-1 px-2.5 py-2 rounded-[20px] bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/90 text-[11px] font-mono tracking-wider border border-white/10 min-h-[42px]"
            title="Workshop Cắm Hoa"
            aria-label="Open workshop catalog"
          >
            <Palette className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-medium whitespace-nowrap hidden min-[380px]:inline">WS</span>
          </button>
        )}

        {/* Ambient Soundscape Toggle */}
        <button
          onClick={handleAudioClick}
          className={`spring-press relative p-2.5 rounded-[20px] border transition-all flex items-center justify-center min-h-[42px] min-w-[42px] ${
            isAudioPlaying
              ? 'bg-amber-400 text-[#141414] border-amber-300 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white/10 text-white/80 hover:text-white border-white/10'
          }`}
          title={isAudioPlaying ? 'Mute ambient sound' : 'Play ambient soundscape'}
          aria-label="Toggle ambient soundscape"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
            </>
          ) : (
            <VolumeX className="w-4 h-4 opacity-65" />
          )}
        </button>

        {/* Language Switcher Squircle Pill */}
        <button
          onClick={handleLangToggle}
          className="spring-press px-2.5 py-2 rounded-[20px] bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/90 text-[11px] font-mono font-bold tracking-widest border border-white/10 min-h-[42px] min-w-[36px]"
          aria-label="Switch language"
        >
          {lang.toUpperCase()}
        </button>

        {/* Quick Call Hotline */}
        <a
          href={`tel:${ATELIER_DATA.phone.replace(/\s+/g, '')}`}
          className="spring-press p-2.5 rounded-[20px] bg-white/10 hover:bg-white/20 active:bg-white/25 text-amber-300 border border-white/10 flex items-center justify-center min-h-[42px] min-w-[40px]"
          title="Hotline tư vấn"
          aria-label="Call atelier hotline"
        >
          <PhoneCall className="w-3.5 h-3.5" />
        </a>

        {/* Order Consultation CTA Button with Continuous Squircle Curve */}
        <button
          onClick={handleOrderClick}
          className="spring-press flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-[22px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-[#141414] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 border border-amber-200/60 min-h-[42px] shrink-0"
          aria-label="Order bespoke consultation"
        >
          <Sparkles className="w-3.5 h-3.5 fill-[#141414] shrink-0" />
          <span className="whitespace-nowrap">{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
        </button>

      </nav>
    </div>
  );
};
