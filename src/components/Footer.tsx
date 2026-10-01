import React from 'react';
import { ArrowUp, Instagram, Facebook, Globe, PhoneCall, Mail, MapPin } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';

interface FooterProps {
  lang: 'vi' | 'en';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
  onOpenCredits: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenOrder,
  onOpenAtelier,
  onOpenCredits
}) => {
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
              JU ET SAIGON
            </h3>
            <p className="text-base sm:text-lg font-editorial-serif italic text-white/80 mt-2">
              "Flower your heart, Flower your soul."
            </p>
            <p className="text-xs font-sans text-white/60 mt-1">
              {lang === 'vi' ? ATELIER_DATA.subTaglineVi : ATELIER_DATA.subTaglineEn}
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
              {lang === 'vi' ? ATELIER_DATA.addressVi : ATELIER_DATA.addressEn}
            </p>
            <p className="text-white/60 text-[11px]">
              {lang === 'vi' ? ATELIER_DATA.hoursVi : ATELIER_DATA.hoursEn}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              DIRECT HOTLINE
            </span>
            <p className="text-sm font-bold font-mono text-white">
              {ATELIER_DATA.phoneFormatted}
            </p>
            <a
              href={`mailto:${ATELIER_DATA.email}`}
              className="hover:text-white underline block"
            >
              {ATELIER_DATA.email}
            </a>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
              SOCIAL & CHANNELS
            </span>
            <div className="space-y-1">
              <a
                href={ATELIER_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram @{ATELIER_DATA.instagram}</span>
              </a>
              <a
                href={ATELIER_DATA.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook JU et Saigon</span>
              </a>
              <a
                href="https://juinternational.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>juinternational.com</span>
              </a>
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
              <button
                onClick={onOpenCredits}
                className="w-full text-left py-1.5 px-3 rounded bg-white/5 hover:bg-white/15 text-white/80"
              >
                {lang === 'vi' ? 'Bản Quyền & Giới Thiệu →' : 'Credits & Archive →'}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 font-mono gap-4">
          <p>
            © 2026 JU et Saigon Florist. All rights reserved.
          </p>
          <p>
            Encyclopædia Botanica Digital · Flower your heart, Flower your soul
          </p>
        </div>

      </div>
    </footer>
  );
};
