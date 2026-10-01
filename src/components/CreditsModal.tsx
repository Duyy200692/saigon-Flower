import React from 'react';
import { X, Heart, ExternalLink } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const CreditsModal: React.FC<CreditsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#dcd8cf] text-[#141414] rounded-xl shadow-2xl border border-[#141414]/30 overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          aria-label="Close credits"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="border-b border-[#141414]/15 pb-3">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#141414]/60 block mb-1">
            PUBLICATION & CURATION
          </span>
          <h3 className="text-2xl font-fleur-title uppercase tracking-wide">
            CREDITS & ARCHIVE
          </h3>
        </div>

        {/* Text */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-[#141414]/90">
          <div>
            <span className="font-bold uppercase block tracking-wider text-[#141414]">
              FLORAL ATELIER & BOTANICAL ART:
            </span>
            <p className="mt-0.5">
              JU et Saigon (Lầu 1 - 31 Nguyễn Trãi, Q.1, TP. Hồ Chí Minh)
            </p>
          </div>

          <div>
            <span className="font-bold uppercase block tracking-wider text-[#141414]">
              UI / UX ARCHITECTURE:
            </span>
            <p className="mt-0.5 font-editorial-serif italic text-sm">
              Encyclopædia Botanica Digital — inspired by the iconic editorial botanical aesthetic of Ondrej Zunka ("The Fleur").
            </p>
          </div>

          <div>
            <span className="font-bold uppercase block tracking-wider text-[#141414]">
              BOTANICAL SOUND SYNTHESIS:
            </span>
            <p className="mt-0.5">
              Ambient Saigon Rain & 432Hz / 528Hz Solfeggio harmonic frequencies generated via Web Audio API.
            </p>
          </div>

          <div>
            <span className="font-bold uppercase block tracking-wider text-[#141414]">
              TAGLINE:
            </span>
            <p className="mt-0.5 font-serif-editorial italic text-base">
              "Flower your heart, Flower your soul."
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[#141414]/15 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#141414] text-[#dcd8cf] text-xs font-bold uppercase tracking-widest hover:bg-[#2c2a27] transition-all"
          >
            {lang === 'vi' ? 'Đóng Bảng Thông Tin' : 'Close Credits'}
          </button>
        </div>

      </div>
    </div>
  );
};
