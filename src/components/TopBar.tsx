import React from 'react';
import { Volume2, VolumeX, Menu, Sparkles, Shield } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import { soundEngine } from '../utils/audio';

interface TopBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  onOpenWorkshop?: () => void;
  onOpenAdmin: () => void;
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
  onOpenWorkshop,
  onOpenAdmin,
  flowerCount
}) => {
  const { atelierData, logoUrl, isAdmin } = useAtelier();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#dcd8cf]/85 border-b border-white/60 shadow-soft-1 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Custom Logo or Brand Wordmark in display face */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity spring-press-subtle"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={atelierData.name}
                className="h-8 sm:h-9 max-w-[180px] object-contain"
              />
            ) : (
              <span className="text-lg md:text-xl font-bold tracking-wider font-fleur-title text-[#141414] uppercase">
                {atelierData.name}
              </span>
            )}
          </a>
          <span className="hidden sm:inline-block text-[11px] tracking-widest text-[#141414]/60 uppercase font-mono">
            {lang === 'vi' ? 'Sài Gòn' : 'Saigon'}
          </span>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-widest uppercase text-[#141414]/75">
          <button
            onClick={() => {
              soundEngine.playFlowerChime(432);
              onOpenIndex();
            }}
            className="hover:text-[#141414] transition-colors text-left spring-press-subtle"
          >
            {lang === 'vi' ? 'Bộ Sưu Tập' : 'Collection Archive'}
          </button>
          {onOpenWorkshop ? (
            <button
              onClick={() => {
                soundEngine.playFlowerChime(528);
                onOpenWorkshop();
              }}
              className="hover:text-[#141414] transition-colors text-amber-900 font-bold spring-press-subtle"
            >
              {lang === 'vi' ? 'Workshop Cắm Hoa' : 'Workshop'}
            </button>
          ) : (
            <a href="#workshop" className="hover:text-[#141414] transition-colors text-amber-900 font-bold spring-press-subtle">
              {lang === 'vi' ? 'Workshop Cắm Hoa' : 'Workshop'}
            </a>
          )}
          <a href="#philosophy" className="hover:text-[#141414] transition-colors spring-press-subtle">
            {lang === 'vi' ? 'Triết Lý Hoa' : 'Philosophy'}
          </a>
        </nav>

        {/* Zone 3: Primary Actions & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`spring-press p-2 rounded-[20px] border transition-all flex items-center gap-1.5 text-[10px] font-mono uppercase shadow-sm ${
              isAdmin
                ? 'bg-amber-400 text-[#141414] border-amber-500 font-bold'
                : 'glass-frost-pill border-white/80 text-[#141414]/70 hover:text-[#141414]'
            }`}
            title="Quản Trị Admin"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isAdmin ? 'ADMIN ACTIVE' : 'ADMIN'}</span>
          </button>

          {/* Index Trigger */}
          <button
            onClick={() => {
              soundEngine.playFlowerChime(432);
              onOpenIndex();
            }}
            className="spring-press px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider uppercase rounded-[20px] border border-white/80 glass-frost-pill text-[#141414] transition-all flex items-center gap-1.5 shadow-sm hover:border-[#141414]/30"
            title="Open Botanical Index"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>INDEX ({flowerCount})</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playFlowerChime(528);
              onToggleAudio();
            }}
            className={`spring-press p-2 rounded-[20px] border transition-all ${
              isAudioPlaying
                ? 'bg-[#141414] text-[#dcd8cf] border-[#141414] shadow-sm'
                : 'glass-frost-pill border-white/80 text-[#141414] hover:bg-white/90'
            }`}
            title={isAudioPlaying ? 'Mute Ambient Soundscape' : 'Play Ambient Soundscape'}
            aria-label="Toggle ambient sound"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center text-[11px] font-bold border border-white/80 glass-frost-pill rounded-[20px] p-0.5 shadow-sm">
            <button
              onClick={() => {
                soundEngine.playFlowerChime(640);
                setLang('vi');
              }}
              className={`spring-press-subtle px-2 py-0.5 rounded-[16px] transition-all ${
                lang === 'vi' ? 'bg-[#141414] text-[#dcd8cf] shadow-sm' : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => {
                soundEngine.playFlowerChime(640);
                setLang('en');
              }}
              className={`spring-press-subtle px-2 py-0.5 rounded-[16px] transition-all ${
                lang === 'en' ? 'bg-[#141414] text-[#dcd8cf] shadow-sm' : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Bespoke Order CTA */}
          <button
            onClick={() => {
              soundEngine.playFlowerChime(580);
              onOpenOrder();
            }}
            className="spring-press hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#dcd8cf] bg-[#141414] rounded-[22px] hover:bg-[#2c2b28] shadow-md transition-all whitespace-nowrap border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'vi' ? 'Đặt Hoa' : 'Bespoke Order'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

