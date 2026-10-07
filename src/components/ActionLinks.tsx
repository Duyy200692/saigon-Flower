import React from 'react';
import { ArrowRight, Instagram, PhoneCall } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface ActionLinksProps {
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
}

export const ActionLinks: React.FC<ActionLinksProps> = ({
  lang,
  theme = 'light',
  onOpenOrder,
}) => {
  const { atelierData } = useAtelier();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-md mx-auto my-10 px-4 flex flex-col items-center gap-3">
      {/* Primary Pill Button */}
      {atelierData.instagramUrl && (
        <a
          href={atelierData.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full max-w-xs py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:shadow-xl group ${
            isDark
              ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
              : 'bg-[#141414] text-[#f7f5f0] hover:bg-[#2e2d2a]'
          }`}
        >
          <Instagram className="w-4 h-4 opacity-80 group-hover:scale-110 transition-transform" />
          <span>{atelierData.name?.toUpperCase() || 'JU ET SAIGON'} ON INSTAGRAM</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      )}

      {/* Secondary Link */}
      <button
        onClick={onOpenOrder}
        className={`text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-2 py-2 transition-colors group ${
          isDark
            ? 'text-[#ede9df] hover:text-amber-300'
            : 'text-[#141414] hover:text-[#141414]/70'
        }`}
      >
        <span>
          {lang === 'vi' ? 'ĐẶT LỊCH TƯ VẤN HOA HAUTE COUTURE' : 'BESPOKE FLORAL CONSULTATION'}
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </button>

      {/* Tertiary Atelier Direct Hotline */}
      <a
        href={`tel:${atelierData.phone?.replace(/\s+/g, '')}`}
        className={`text-[11px] sm:text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors ${
          isDark
            ? 'text-[#ede9df]/60 hover:text-[#ede9df]'
            : 'text-[#141414]/60 hover:text-[#141414]'
        }`}
      >
        <PhoneCall className="w-3 h-3" />
        <span>HOTLINE / ATELIER: {atelierData.phoneFormatted || atelierData.phone}</span>
      </a>
    </div>
  );
};
