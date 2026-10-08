import React from 'react';
import { Menu, Sparkles, Shield, Sun, Moon, Heart, Compass } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface TopBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  onOpenWorkshop?: () => void;
  onOpenSommelier?: () => void;
  onOpenMoodboard?: () => void;
  onOpenAdmin: () => void;
  flowerCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  setLang,
  theme,
  onToggleTheme,
  onOpenIndex,
  onOpenOrder,
  onOpenWorkshop,
  onOpenSommelier,
  onOpenMoodboard,
  onOpenAdmin,
  flowerCount
}) => {
  const { atelierData, logoUrl, logoWhiteUrl, isAdmin, wishlistIds, orders, workshopBookings } = useAtelier();
  const isDark = theme === 'dark';
  const pendingCount =
    orders.filter((o) => o.status === 'pending').length +
    workshopBookings.filter((b) => b.status === 'pending').length;

  // Automatic theme-aware logo resolution:
  // - Dark mode prefers logoWhiteUrl; if only logoUrl (black logo) is uploaded, auto-invert it to white so it's always visible.
  // - Light mode prefers logoUrl (black logo); if only logoWhiteUrl is uploaded, auto-darken it.
  const activeLogoSrc = isDark ? (logoWhiteUrl || logoUrl) : (logoUrl || logoWhiteUrl);
  const shouldInvertToWhite = isDark && !logoWhiteUrl && Boolean(logoUrl);
  const shouldDarkenToBlack = !isDark && !logoUrl && Boolean(logoWhiteUrl);

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#0f100e]/90 border-white/15 text-[#ede9df]'
          : 'bg-[#dcd8cf]/90 border-[#141414]/15 text-[#141414]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Zone 1: Custom Logo or Brand Wordmark in display face (Auto switches between Black Logo & White Logo by theme) */}
        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial pr-2">
          <a
            href="#"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity min-w-0"
          >
            {activeLogoSrc ? (
              <img
                src={activeLogoSrc}
                alt={atelierData.name}
                className={`h-8 sm:h-9 w-auto max-w-[135px] xs:max-w-[155px] sm:max-w-[190px] object-contain object-left shrink-0 transition-all duration-300 ${
                  shouldInvertToWhite
                    ? 'brightness-0 invert'
                    : shouldDarkenToBlack
                      ? 'brightness-0'
                      : ''
                }`}
              />
            ) : (
              <span
                className={`text-base sm:text-xl font-bold tracking-wider font-fleur-title uppercase truncate ${
                  isDark ? 'text-[#ede9df]' : 'text-[#141414]'
                }`}
              >
                {atelierData.name}
              </span>
            )}
          </a>
          <span
            className={`hidden lg:inline-block text-[11px] tracking-widest uppercase font-mono shrink-0 ${
              isDark ? 'text-[#ede9df]/55' : 'text-[#141414]/60'
            }`}
          >
            {lang === 'vi' ? 'Sài Gòn' : 'Saigon'}
          </span>
        </div>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-3.5 lg:gap-7 text-xs font-semibold tracking-widest uppercase ${
            isDark ? 'text-[#ede9df]/75' : 'text-[#141414]/75'
          }`}
        >
          <button
            onClick={onOpenIndex}
            className={`transition-colors text-left ${
              isDark ? 'hover:text-white' : 'hover:text-[#141414]'
            }`}
          >
            {lang === 'vi' ? 'Bộ Sưu Tập' : 'Collection Archive'}
          </button>
          {onOpenWorkshop ? (
            <button
              onClick={onOpenWorkshop}
              className={`transition-colors font-bold ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-900 hover:text-[#141414]'
              }`}
            >
              {lang === 'vi' ? 'Workshop Cắm Hoa' : 'Workshop'}
            </button>
          ) : (
            <a
              href="#workshop"
              className={`transition-colors font-bold ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-900 hover:text-[#141414]'
              }`}
            >
              {lang === 'vi' ? 'Workshop Cắm Hoa' : 'Workshop'}
            </a>
          )}
          {onOpenSommelier && (
            <button
              onClick={onOpenSommelier}
              className={`transition-colors flex items-center gap-1 ${
                isDark ? 'hover:text-amber-300' : 'hover:text-[#141414]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Cố Vấn Hoa (Sommelier)' : 'Sommelier'}</span>
            </button>
          )}
          <a
            href="#philosophy"
            className={`transition-colors ${
              isDark ? 'hover:text-white' : 'hover:text-[#141414]'
            }`}
          >
            {lang === 'vi' ? 'Triết Lý Hoa' : 'Philosophy'}
          </a>
        </nav>

        {/* Zone 3: Primary Actions & Utility Controls (Compact & never crowding logo on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Moodboard / Wishlist Trigger */}
          {onOpenMoodboard && (
            <button
              onClick={onOpenMoodboard}
              className={`relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all flex items-center gap-1 text-[11px] font-mono shadow-sm ${
                wishlistIds.length > 0
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 font-bold'
                  : isDark
                    ? 'border-white/15 bg-white/10 hover:bg-white/20 text-[#ede9df]'
                    : 'border-[#141414]/15 bg-white/60 hover:bg-white text-[#141414]'
              }`}
              title={lang === 'vi' ? 'Bộ sưu tập yêu thích (Moodboard)' : 'Personal Moodboard'}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlistIds.length > 0 ? 'fill-current text-rose-500' : ''}`} />
              {wishlistIds.length > 0 && <span>{wishlistIds.length}</span>}
            </button>
          )}

          {/* Index Trigger (Desktop/Tablet - Mobile uses FloatingMobileBar) */}
          <button
            onClick={onOpenIndex}
            className={`hidden sm:flex px-3.5 py-1.5 text-xs font-mono font-medium tracking-wider uppercase rounded-full border transition-all items-center gap-1.5 shadow-sm ${
              isDark
                ? 'border-white/15 bg-white/10 hover:bg-white/20 text-[#ede9df]'
                : 'border-[#141414]/15 bg-white/60 hover:bg-white text-[#141414] hover:border-[#141414]/30'
            }`}
            title="Open Botanical Index"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>INDEX ({flowerCount})</span>
          </button>

          {/* Light / Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase shadow-sm ${
              isDark
                ? 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-300'
                : 'bg-white/70 hover:bg-white border-[#141414]/15 text-[#141414]'
            }`}
            title={
              isDark
                ? lang === 'vi'
                  ? 'Chuyển sang Giao diện Sáng (Light Mode)'
                  : 'Switch to Light Mode'
                : lang === 'vi'
                  ? 'Chuyển sang Giao diện Tối (Dark Mode)'
                  : 'Switch to Dark Mode'
            }
            aria-label="Toggle color theme"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'vi' ? 'Sáng' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#141414]" />
                <span>{lang === 'vi' ? 'Tối' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <div
            className={`flex items-center text-[10px] sm:text-[11px] font-bold border rounded-full p-0.5 shadow-sm ${
              isDark
                ? 'border-white/15 bg-white/10'
                : 'border-[#141414]/15 bg-white/60'
            }`}
          >
            <button
              onClick={() => setLang('vi')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all ${
                lang === 'vi'
                  ? isDark
                    ? 'bg-[#ede9df] text-[#141414] shadow-sm'
                    : 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                  : isDark
                    ? 'text-[#ede9df]/70 hover:text-white'
                    : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all ${
                lang === 'en'
                  ? isDark
                    ? 'bg-[#ede9df] text-[#141414] shadow-sm'
                    : 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                  : isDark
                    ? 'text-[#ede9df]/70 hover:text-white'
                    : 'text-[#141414]/70 hover:text-[#141414]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Bespoke Order CTA (Desktop/Tablet) */}
          <button
            onClick={onOpenOrder}
            className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full shadow-md transition-all whitespace-nowrap ${
              isDark
                ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
                : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2c2b28]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-amber-600' : 'text-amber-300'}`} />
            <span>{lang === 'vi' ? 'Đặt Hoa' : 'Bespoke Order'}</span>
          </button>

          {/* Admin Portal Button (Far right, discreet & clean so it never overlaps the brand logo) */}
          <button
            onClick={onOpenAdmin}
            className={`relative p-1.5 sm:p-2 rounded-full border transition-all flex items-center gap-1.5 text-[10px] font-mono uppercase shadow-sm ${
              isAdmin
                ? 'bg-amber-400 text-[#141414] border-amber-500 font-bold'
                : isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/15 text-[#ede9df]/70 hover:text-white'
                  : 'bg-white/60 hover:bg-white border-[#141414]/15 text-[#141414]/70 hover:text-[#141414]'
            }`}
            title="Quản Trị Admin"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isAdmin ? 'ADMIN ACTIVE' : 'ADMIN'}</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
