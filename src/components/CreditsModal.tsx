import React from 'react';
import { X } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
}

export const CreditsModal: React.FC<CreditsModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light'
}) => {
  const { atelierData } = useAtelier();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const boxClass = isDark
    ? 'p-3.5 bg-white/5 rounded-[20px] border border-white/10'
    : 'p-3.5 glass-frost-pill rounded-[20px] border border-white/80 shadow-soft-1';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-lg squircle-2xl rounded-[32px] sm:rounded-[36px] shadow-soft-3 border overflow-hidden p-6 sm:p-8 space-y-6 transition-colors duration-300 ${
          isDark
            ? 'bg-[#151614] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-white/60'
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="spring-press absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors backdrop-blur-xl border border-white/20 shadow-sm"
          aria-label="Close credits"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className={`border-b pb-3 pr-10 ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}>
          <span className={`text-[10px] font-mono tracking-widest uppercase block mb-1 ${isDark ? 'text-amber-300/80' : 'text-[#141414]/60'}`}>
            PUBLICATION & CURATION
          </span>
          <h3 className="text-2xl font-fleur-title uppercase tracking-wide">
            CREDITS & ARCHIVE
          </h3>
        </div>

        {/* Text */}
        <div className={`space-y-4 text-xs font-sans leading-relaxed ${isDark ? 'text-[#ede9df]/90' : 'text-[#141414]/90'}`}>
          <div className={boxClass}>
            <span className="font-bold uppercase block tracking-wider">
              FLORAL ATELIER & BOTANICAL ART:
            </span>
            <p className="mt-0.5">
              {atelierData.name || 'JU et Saigon'} ({lang === 'vi' ? atelierData.addressVi : atelierData.addressEn})
            </p>
          </div>

          <div className={boxClass}>
            <span className="font-bold uppercase block tracking-wider">
              UI / UX ARCHITECTURE:
            </span>
            <p className="mt-0.5 font-editorial-serif italic text-sm">
              Encyclopædia Botanica Digital — Haute Couture Botanical Portfolio & Curation System.
            </p>
          </div>

          <div className={boxClass}>
            <span className="font-bold uppercase block tracking-wider">
              TAGLINE:
            </span>
            <p className="mt-0.5 font-serif-editorial italic text-base">
              "{atelierData.tagline || 'Flower your heart, Flower your soul.'}"
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className={`pt-4 border-t text-center ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}>
          <button
            onClick={onClose}
            className={`spring-press min-h-[44px] px-7 py-3 rounded-[22px] text-xs font-bold uppercase tracking-widest transition-all shadow-soft-2 border ${
              isDark
                ? 'bg-[#ede9df] text-[#141414] hover:bg-white border-white/20'
                : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2c2a27] border-white/10'
            }`}
          >
            {lang === 'vi' ? 'Đóng Bảng Thông Tin' : 'Close Credits'}
          </button>
        </div>
      </div>
    </div>
  );
};
