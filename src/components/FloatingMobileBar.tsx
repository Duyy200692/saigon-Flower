import React from 'react';
import { Menu, Sparkles, PhoneCall, Sun, Moon } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface FloatingMobileBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenWorkshop?: () => void;
  flowerCount: number;
}

export const FloatingMobileBar: React.FC<FloatingMobileBarProps> = ({
  lang,
  setLang,
  theme,
  onToggleTheme,
  onOpenIndex,
  onOpenOrder,
  flowerCount
}) => {
  const { atelierData } = useAtelier();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
      <div
        className={`rounded-full px-3 py-2 shadow-2xl backdrop-blur-md border flex items-center justify-between transition-colors duration-300 ${
          isDark
            ? 'bg-[#181916]/95 text-[#ede9df] border-white/20'
            : 'bg-[#141414]/95 text-[#dcd8cf] border-white/20'
        }`}
      >
        {/* Index Trigger */}
        <button
          onClick={onOpenIndex}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono tracking-wider transition-colors"
        >
          <Menu className="w-3.5 h-3.5" />
          <span>INDEX ({flowerCount})</span>
        </button>

        {/* Light / Dark Mode Toggle (replaces old speaker button on mobile) */}
        <button
          onClick={onToggleTheme}
          className={`px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1 text-[11px] font-mono font-semibold ${
            isDark
              ? 'bg-amber-400 text-[#141414]'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isDark ? (lang === 'vi' ? 'Sáng' : 'Light') : (lang === 'vi' ? 'Tối' : 'Dark')}</span>
        </button>

        {/* Quick Hotline Call */}
        {atelierData.phone && (
          <a
            href={`tel:${atelierData.phone.replace(/\s+/g, '')}`}
            className="p-2 rounded-full bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
            title="Hotline Atelier"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Lang Switch */}
        <button
          onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
          className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold tracking-wider"
        >
          {lang.toUpperCase()}
        </button>

        {/* Order Consultation CTA */}
        <button
          onClick={onOpenOrder}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#dcd8cf] text-[#141414] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-white transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
        </button>
      </div>
    </div>
  );
};
