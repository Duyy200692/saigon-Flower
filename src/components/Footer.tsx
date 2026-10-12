import React from 'react';
import { ArrowUp, Instagram, Facebook, Globe, MessageCircle } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface FooterProps {
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  onOpenCredits: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  theme = 'light',
  onOpenOrder,
  onOpenAtelier,
  onOpenCredits,
  onOpenAdmin
}) => {
  const { atelierData, logoUrl, logoWhiteUrl } = useAtelier();
  const isDark = theme === 'dark';
  const footerLogoSrc = isDark ? (logoWhiteUrl || logoUrl) : (logoUrl || logoWhiteUrl);
  const shouldInvertFooterLogo = isDark && !logoWhiteUrl && Boolean(logoUrl);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`pt-16 pb-24 md:pb-16 border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#141414] text-[#dcd8cf] border-white/15'
          : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Top Tier */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12 transition-colors ${
            isDark ? 'border-white/15' : 'border-[#141414]/15'
          }`}
        >
          <div>
            {footerLogoSrc ? (
              <img
                src={footerLogoSrc}
                alt={atelierData.name || 'JU ET SAIGON'}
                className={`h-12 sm:h-14 w-auto max-w-[240px] object-contain object-left mb-3 ${
                  shouldInvertFooterLogo ? 'brightness-0 invert' : ''
                }`}
              />
            ) : (
              <h3
                className={`text-3xl sm:text-5xl font-fleur-title uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-[#141414]'
                }`}
              >
                {atelierData.name || 'JU ET SAIGON'}
              </h3>
            )}
            <p
              className={`text-base sm:text-lg font-editorial-serif italic mt-2 ${
                isDark ? 'text-white/80' : 'text-[#141414]/80'
              }`}
            >
              "{atelierData.tagline || 'Flower your heart, Flower your soul.'}"
            </p>
            <p
              className={`text-xs font-sans mt-1 ${
                isDark ? 'text-white/60' : 'text-[#141414]/65'
              }`}
            >
              {lang === 'vi' ? atelierData.subTaglineVi : atelierData.subTaglineEn}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className={`self-start md:self-auto px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-2 ${
              isDark
                ? 'border-white/30 text-white hover:border-white hover:bg-white hover:text-black'
                : 'border-[#141414]/30 text-[#141414] hover:border-[#141414] hover:bg-[#141414] hover:text-[#dcd8cf]'
            }`}
          >
            <span>{lang === 'vi' ? 'LÊN ĐẦU TRANG' : 'BACK TO TOP'}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Tier: Contact & Links */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs font-sans ${
            isDark ? 'text-white/80' : 'text-[#141414]/85'
          }`}
        >
          
          <div className="space-y-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest block ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            >
              ATELIER SAIGON
            </span>
            <p className="leading-relaxed">
              {lang === 'vi' ? atelierData.addressVi : atelierData.addressEn}
            </p>
            <p className={`text-[11px] ${isDark ? 'text-white/60' : 'text-[#141414]/65'}`}>
              {lang === 'vi' ? atelierData.hoursVi : atelierData.hoursEn}
            </p>
          </div>

          <div className="space-y-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest block ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            >
              DIRECT HOTLINE
            </span>
            <p className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-[#141414]'}`}>
              {atelierData.phoneFormatted || atelierData.phone}
            </p>
            <a
              href={`mailto:${atelierData.email}`}
              className={`underline block ${isDark ? 'hover:text-white' : 'hover:text-[#141414]'}`}
            >
              {atelierData.email}
            </a>
          </div>

          <div className="space-y-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest block ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            >
              SOCIAL & CHANNELS
            </span>
            <div className="space-y-1.5">
              {atelierData.instagramUrl && (
                <a
                  href={atelierData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark ? 'hover:text-white' : 'hover:text-[#141414]'
                  }`}
                >
                  <Instagram className={`w-3.5 h-3.5 ${isDark ? 'text-pink-400' : 'text-pink-700'}`} />
                  <span>Instagram @{atelierData.instagram || 'juetsaigon'}</span>
                </a>
              )}
              {atelierData.facebookUrl && (
                <a
                  href={atelierData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark ? 'hover:text-white' : 'hover:text-[#141414]'
                  }`}
                >
                  <Facebook className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-700'}`} />
                  <span>Facebook {atelierData.facebookName || 'JU et Saigon'}</span>
                </a>
              )}
              {atelierData.zaloUrl && (
                <a
                  href={atelierData.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'hover:text-white text-cyan-300'
                      : 'hover:text-[#141414] text-cyan-900 font-medium'
                  }`}
                >
                  <MessageCircle className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                  <span>Zalo Group / Hotline</span>
                </a>
              )}
              {atelierData.tiktokUrl && (
                <a
                  href={atelierData.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark ? 'hover:text-white' : 'hover:text-[#141414]'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 flex items-center justify-center font-mono font-bold text-[10px] ${
                      isDark ? 'text-purple-400' : 'text-purple-700'
                    }`}
                  >
                    ♪
                  </span>
                  <span>TikTok @{atelierData.instagram || 'juetsaigon'}</span>
                </a>
              )}
              {atelierData.website && (
                <a
                  href={atelierData.websiteUrl || (atelierData.website.startsWith('http') ? atelierData.website : `https://${atelierData.website}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 transition-colors ${
                    isDark ? 'hover:text-white' : 'hover:text-[#141414]'
                  }`}
                >
                  <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
                  <span>{atelierData.website}</span>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest block ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            >
              ACTIONS
            </span>
            <div className="space-y-2">
              <button
                onClick={onOpenOrder}
                className={`w-full text-left py-1.5 px-3 rounded font-medium transition-colors ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-[#141414]/10 hover:bg-[#141414]/20 text-[#141414]'
                }`}
              >
                {lang === 'vi' ? 'Đặt Lịch Tư Vấn Hoa →' : 'Book Consultation →'}
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className={`w-full text-left py-1.5 px-3 rounded font-mono text-[11px] border transition-colors ${
                    isDark
                      ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border-amber-800/30 font-semibold'
                  }`}
                >
                  {lang === 'vi' ? '⚙️ Quản Trị Viên (Admin) →' : '⚙️ Admin Portal →'}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono gap-4 ${
            isDark ? 'border-white/10 text-white/50' : 'border-[#141414]/15 text-[#141414]/60'
          }`}
        >
          <p>
            © 2026 {atelierData.name || 'JU et Saigon Florist'}. All rights reserved.
          </p>
          <p>
            Encyclopædia Botanica Digital · Flower your heart, Flower your soul
          </p>
        </div>

      </div>
    </footer>
  );
};
