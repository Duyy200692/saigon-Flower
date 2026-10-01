import React from 'react';
import { ArrowRight, Instagram, PhoneCall, Sparkles } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';

interface ActionLinksProps {
  lang: 'vi' | 'en';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
}

export const ActionLinks: React.FC<ActionLinksProps> = ({
  lang,
  onOpenOrder,
  onOpenAtelier
}) => {
  return (
    <div className="max-w-md mx-auto my-10 px-4 flex flex-col items-center gap-3">
      {/* Primary Black Pill Button matching Image 1 */}
      <a
        href={ATELIER_DATA.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs py-3.5 px-6 rounded-full bg-[#141414] text-[#f7f5f0] text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-[#2e2d2a] hover:shadow-xl group"
      >
        <Instagram className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
        <span>JU ET SAIGON ON INSTAGRAM</span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </a>

      {/* Secondary Pill Link matching Image 1 */}
      <button
        onClick={onOpenOrder}
        className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#141414] hover:text-[#141414]/70 flex items-center gap-2 py-2 transition-colors group"
      >
        <span>
          {lang === 'vi' ? 'ĐẶT LỊCH TƯ VẤN HOA HAUTE COUTURE' : 'BESPOKE FLORAL CONSULTATION'}
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </button>

      {/* Tertiary Atelier Direct Hotline */}
      <a
        href={`tel:${ATELIER_DATA.phone.replace(/\s+/g, '')}`}
        className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#141414]/60 hover:text-[#141414] flex items-center gap-1.5 transition-colors"
      >
        <PhoneCall className="w-3 h-3" />
        <span>HOTLINE / ATELIER: {ATELIER_DATA.phoneFormatted}</span>
      </a>
    </div>
  );
};
