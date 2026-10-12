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
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 z-40 md:hidden pointer-events-auto">
      <div
        className={`max-w-md mx-auto rounded-full p-1.5 backdrop-blur-xl border overflow-hidden flex items-center justify-between gap-1 transition-all duration-300 ${
          isDark
            ? 'bg-[#181916]/95 text-[#ede9df] border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.5)]'
            : 'bg-[#dcd8cf]/95 text-[#141414] border-[#141414]/20 shadow-[0_12px_32px_rgba(20,20,20,0.18)]'
        }`}
      >
        {/* Index Trigger */}
        <button
          type="button"
          onClick={onOpenIndex}
          className={`h-9 flex-1 min-w-0 flex items-center justify-center gap-1 px-2 rounded-full active:scale-95 text-[10px] font-mono font-medium tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-[#141414]/10 hover:bg-[#141414]/20 text-[#141414]'
          }`}
        >
          <Menu className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">INDEX ({flowerCount})</span>
        </button>

        {/* Flower Sommelier Quick Trigger */}
        {onOpenSommelier && (
          <button
            type="button"
            onClick={onOpenSommelier}
            className={`h-9 flex-1 min-w-0 px-2 rounded-full border active:scale-95 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isDark
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 hover:bg-amber-400/25'
                : 'bg-amber-500/15 text-amber-950 border-amber-800/30 hover:bg-amber-500/25'
            }`}
            title={lang === 'vi' ? 'Trợ lý chọn hoa Sommelier' : 'Flower Sommelier'}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Gu Hoa</span>
          </button>
        )}

        {/* Workshop Quick Trigger on Mobile */}
        {onOpenWorkshop && (
          <button
            type="button"
            onClick={onOpenWorkshop}
            className={`h-9 flex-1 min-w-0 px-2 rounded-full active:scale-95 text-[10px] font-mono font-medium uppercase tracking-wider flex items-center justify-center transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-[#141414]/10 text-[#141414] hover:bg-[#141414]/20'
            }`}
          >
            <span className="truncate">Workshop</span>
          </button>
        )}

        {/* Moodboard Heart Trigger */}
        {onOpenMoodboard && (
          <button
            type="button"
            onClick={onOpenMoodboard}
            className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center gap-0.5 text-[10px] font-mono active:scale-95 transition-all duration-200 cursor-pointer ${
              wishlistIds.length > 0
                ? 'bg-rose-500 text-white font-bold'
                : isDark
                  ? 'bg-white/10 text-white/90 hover:bg-white/20'
                  : 'bg-[#141414]/10 text-[#141414] hover:bg-[#141414]/20'
            }`}
            title="Moodboard"
          >
            <Heart className={`w-3.5 h-3.5 shrink-0 ${wishlistIds.length > 0 ? 'fill-current' : ''}`} />
            {wishlistIds.length > 0 && <span>{wishlistIds.length}</span>}
          </button>
        )}

        {/* Order Consultation CTA */}
        <button
          type="button"
          onClick={onOpenOrder}
          className={`h-9 flex-1 min-w-0 flex items-center justify-center gap-1 px-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer ${
            isDark
              ? 'bg-[#dcd8cf] text-[#141414] hover:bg-white'
              : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
          }`}
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate">{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
        </button>
      </div>
    </div>
  );
};
