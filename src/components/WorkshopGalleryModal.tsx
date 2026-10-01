import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { WorkshopItem } from '../data/workshop';
import { useAtelier } from '../context/AtelierContext';
import { soundEngine } from '../utils/audio';

interface WorkshopGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  onSelectWorkshop: (workshop: WorkshopItem) => void;
}

export const WorkshopGalleryModal: React.FC<WorkshopGalleryModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectWorkshop
}) => {
  const { workshops } = useAtelier();

  if (!isOpen) return null;

  const handleTileClick = (ws: WorkshopItem) => {
    soundEngine.playFlowerChime(528);
    onSelectWorkshop(ws);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141513] text-[#ede9df] animate-fadeIn">
      
      {/* Top Fixed Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-[#181917]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest uppercase text-white/70">
            JU ET SAIGON · WORKSHOP BOTANICA
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            {lang === 'vi' ? 'DỊCH VỤ TRỌN GÓI CHO DOANH NGHIỆP' : 'ALL-INCLUSIVE CORPORATE SALON'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 text-xs font-mono uppercase"
          aria-label="Close workshop gallery"
        >
          <span className="hidden sm:inline">{lang === 'vi' ? 'Đóng' : 'Close'}</span>
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Editorial Canvas matching user's exact uploaded image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24 space-y-24 sm:space-y-36">
        
        {workshops.map((ws, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={ws.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* If isEven: Text on Left (Col 1-5), Image on Right (Col 6-12) */}
              {isEven ? (
                <>
                  {/* Left Text Column */}
                  <div className="lg:col-span-5 space-y-5 text-left order-2 lg:order-1">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block">
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight text-white leading-none">
                        {ws.name}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed font-light">
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div className="pt-3">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white group transition-colors"
                      >
                        <span className="underline underline-offset-4 font-bold">
                          {lang === 'vi' ? 'XEM CHI TIẾT BỘ WORKSHOP & HÌNH ẢNH →' : 'VIEW WORKSHOP DOSSIER & PHOTOS →'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right Image Column */}
                  <div
                    onClick={() => handleTileClick(ws)}
                    className="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl order-1 lg:order-2"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden relative">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-xs font-mono tracking-widest text-amber-300 uppercase">
                          {lang === 'vi' ? 'BẤM ĐỂ XEM CHI TIẾT BỘ WORKSHOP & BÁO GIÁ' : 'CLICK TO VIEW WORKSHOP DOSSIER & PRICING'}
                        </span>
                        <p className="text-lg font-bagerich font-bold text-white uppercase mt-1">
                          {ws.titleVi}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Left Image Column */}
                  <div
                    onClick={() => handleTileClick(ws)}
                    className="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl order-1"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden relative">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-xs font-mono tracking-widest text-amber-300 uppercase">
                          {lang === 'vi' ? 'BẤM ĐỂ XEM CHI TIẾT BỘ WORKSHOP & BÁO GIÁ' : 'CLICK TO VIEW WORKSHOP DOSSIER & PRICING'}
                        </span>
                        <p className="text-lg font-bagerich font-bold text-white uppercase mt-1">
                          {ws.titleVi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Text Column */}
                  <div className="lg:col-span-5 space-y-5 text-left order-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block">
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight text-white leading-none">
                        {ws.name}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed font-light">
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div className="pt-3">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white group transition-colors"
                      >
                        <span className="underline underline-offset-4 font-bold">
                          {lang === 'vi' ? 'XEM CHI TIẾT BỘ WORKSHOP & HÌNH ẢNH →' : 'VIEW WORKSHOP DOSSIER & PHOTOS →'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Bottom Fast Contact Banner */}
        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono">
          <div className="text-white/70 text-center sm:text-left space-y-1">
            <span className="text-white font-bold block text-sm">JU et Saigon — Flower Your Heart, Flower Your Soul</span>
            <span>📍 Lầu 1- 31 Nguyễn Trãi, Phường Bến Thành, Quận 1 · Hotline: 090 936 80 80</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://zalo.me/g/lbzvqb973"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tham Gia Zalo Bloom Daily</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
