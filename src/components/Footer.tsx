import React from 'react';
import { ArrowUp, Instagram, Facebook, Globe, MessageCircle } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface FooterProps {
  lang: 'vi' | 'en';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  onOpenCredits: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenOrder,
  onOpenAtelier,
  onOpenCredits,
  onOpenAdmin
}) => {
  const { atelierData } = useAtelier();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141414] text-[#dcd8cf] pt-16 pb-24 md:pb-16 border-t border-[#141414]">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/15 pb-12">
          <div>
            <h3 className="text-3xl sm:text-5xl font-fleur-title uppercase tracking-wider text-white">
              {atelierData.name || 'JU ET SAIGON'}
            </h3>
            <p className="text-base sm:text-lg font-editorial-serif italic text-white/80 mt-2">
              "{atelierData.tagline || 'Flower your heart, Flower your soul.'}"
            </p>
            <p className="text-xs font-sans text-white/60 mt-1">
              {lang === 'vi' ? atelierData.subTaglineVi : atelierData.subTaglineEn}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start md:self-auto px-4 py-2 rounded-full border border-white/30 text-xs font-semibold uppercase tracking-widest hover:border-white hover:bg-white hover:text-black transition-all flex items-center gap-2"
          >
            <span>{lang === 'vi' ? 'LÊN ĐẦU TRANG' : 'BACK TO TOP'}</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Middle Tier: Contact & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs font-sans text-white/80">
          
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              ATELIER SAIGON
            </span>
            <p className="leading-relaxed">
              {lang === 'vi' ? atelierData.addressVi : atelierData.addressEn}
            </p>
            <p className="text-white/60 text-[11px]">
              {lang === 'vi' ? atelierData.hoursVi : atelierData.hoursEn}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              DIRECT HOTLINE
            </span>
            <p className="text-sm font-bold font-mono text-white">
              {atelierData.phoneFormatted || atelierData.phone}
            </p>
            <a
              href={`mailto:${atelierData.email}`}
              className="hover:text-white underline block"
            >
              {atelierData.email}
            </a>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              SOCIAL & CHANNELS
            </span>
            <div className="space-y-1.5">
              {atelierData.instagramUrl && (
                <a
                  href={atelierData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram @{atelierData.instagram || 'juetsaigon'}</span>
                </a>
              )}
              {atelierData.facebookUrl && (
                <a
                  href={atelierData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facebook {atelierData.facebookName || 'JU et Saigon'}</span>
                </a>
              )}
              {atelierData.zaloUrl && (
                <a
                  href={atelierData.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 text-cyan-300 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zalo Group / Hotline</span>
                </a>
              )}
              {atelierData.tiktokUrl && (
                <a
                  href={atelierData.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-mono font-bold text-[10px] text-purple-400">♪</span>
                  <span>TikTok @{atelierData.instagram || 'juetsaigon'}</span>
                </a>
              )}
              {atelierData.website && (
                <a
                  href={atelierData.websiteUrl || (atelierData.website.startsWith('http') ? atelierData.website : `https://${atelierData.website}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>{atelierData.website}</span>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              ACTIONS
            </span>
            <div className="space-y-2">
              <button
                onClick={onOpenOrder}
                className="w-full text-left py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 text-white font-medium"
              >
                {lang === 'vi' ? 'Đặt Lịch Tư Vấn Hoa →' : 'Book Consultation →'}
              </button>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="w-full text-left py-1.5 px-3 rounded bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-[11px] border border-amber-400/30"
                >
                  {lang === 'vi' ? '⚙️ Quản Trị Viên (Admin) →' : '⚙️ Admin Portal →'}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 font-mono gap-4">
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
