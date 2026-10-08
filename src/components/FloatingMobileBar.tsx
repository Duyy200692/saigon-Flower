import React from 'react';
import { Menu, Sparkles, Sun, Moon, Heart, Compass } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface FloatingMobileBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenWorkshop?: () => void;
  onOpenSommelier?: () => void;
  onOpenMoodboard?: () => void;
  flowerCount: number;
}

export const FloatingMobileBar: React.FC<FloatingMobileBarProps> = ({
  lang,
  theme,
  onToggleTheme,
  onOpenIndex,
  onOpenOrder,
  onOpenWorkshop,
  onOpenSommelier,
  onOpenMoodboard,
  flowerCount
}) => {
  const { wishlistIds } = useAtelier();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-3 inset-x-2 z-40 md:hidden">
      <div
        className={`rounded-full px-2 py-1.5 shadow-2xl backdrop-blur-md border flex items-center justify-between gap-1 transition-colors duration-300 ${
          isDark
            ? 'bg-[#181916]/95 text-[#ede9df] border-white/20'
            : 'bg-[#141414]/95 text-[#dcd8cf] border-white/20'
        }`}
      >
        {/* Index Trigger */}
        <button
          onClick={onOpenIndex}
          className="min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono tracking-wider transition-colors whitespace-nowrap"
        >
          <Menu className="w-3.5 h-3.5" />
          <span>INDEX ({flowerCount})</span>
        </button>

        {/* Flower Sommelier Quick Trigger */}
        {onOpenSommelier && (
          <button
            onClick={onOpenSommelier}
            className="min-h-[38px] px-2.5 py-1.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 hover:bg-amber-400/25 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors whitespace-nowrap"
            title={lang === 'vi' ? 'Trợ lý chọn hoa Sommelier' : 'Flower Sommelier'}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Gu Hoa</span>
          </button>
        )}

        {/* Workshop Quick Trigger on Mobile */}
        {onOpenWorkshop && (
          <button
            onClick={onOpenWorkshop}
            className="min-h-[38px] px-2 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 text-[10px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Workshop
          </button>
        )}

        {/* Moodboard Heart Trigger */}
        {onOpenMoodboard && (
          <button
            onClick={onOpenMoodboard}
            className={`min-h-[38px] min-w-[38px] px-2 rounded-full flex items-center justify-center gap-1 text-[10px] font-mono transition-colors ${
              wishlistIds.length > 0
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
            title="Moodboard"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistIds.length > 0 ? 'fill-current' : ''}`} />
            {wishlistIds.length > 0 && <span>{wishlistIds.length}</span>}
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className={`min-h-[38px] min-w-[38px] px-2 rounded-full transition-colors flex items-center justify-center ${
            isDark
              ? 'bg-amber-400 text-[#141414]'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Order Consultation CTA */}
        <button
          onClick={onOpenOrder}
          className="min-h-[38px] flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#dcd8cf] text-[#141414] font-bold text-[10px] uppercase tracking-wider shadow-md hover:bg-white transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
        </button>
      </div>
    </div>
  );
};
