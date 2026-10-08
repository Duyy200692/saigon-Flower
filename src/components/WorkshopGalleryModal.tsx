import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { WorkshopItem } from '../data/workshop';
import { useAtelier } from '../context/AtelierContext';

interface WorkshopGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onSelectWorkshop: (workshop: WorkshopItem) => void;
}

export const WorkshopGalleryModal: React.FC<WorkshopGalleryModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onSelectWorkshop
}) => {
  const { workshops, atelierData } = useAtelier();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleTileClick = (ws: WorkshopItem) => {
    onSelectWorkshop(ws);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-[#141513] text-[#ede9df]' : 'bg-[#dcd8cf] text-[#141414]'
      }`}
    >
      {/* Top Fixed Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md border-b px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-[#181917]/95 border-white/10 text-white'
            : 'bg-[#dcd8cf]/95 border-[#141414]/15 text-[#141414]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`text-[11px] sm:text-xs font-mono tracking-widest uppercase truncate ${
              isDark ? 'text-white/75' : 'text-[#141414]/75'
            }`}
          >
            JU ET SAIGON · WORKSHOP BOTANICA
          </span>
        </div>

        <button
          onClick={onClose}
          className={`min-h-[40px] px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-mono uppercase border ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              : 'bg-[#141414] hover:bg-[#2b2a28] text-[#dcd8cf] border-[#141414]'
          }`}
          aria-label="Close workshop gallery"
        >
          <span>{lang === 'vi' ? 'Đóng' : 'Close'}</span>
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Editorial Canvas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-20 space-y-16 sm:space-y-32">
        {workshops.map((ws, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={ws.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center"
            >
              {isEven ? (
                <>
                  {/* Left Text Column */}
                  <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-left order-2 lg:order-1">
                    <div className="space-y-1.5">
                      <span
                        className={`text-[10px] font-mono tracking-widest uppercase block font-semibold ${
                          isDark ? 'text-amber-400' : 'text-amber-900'
                        }`}
                      >
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2
                        className={`text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight leading-none ${
                          isDark ? 'text-white' : 'text-[#141414]'
                        }`}
                      >
                        {ws.name}
                      </h2>
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-sans leading-relaxed ${
                        isDark ? 'text-white/80 font-light' : 'text-[#141414]/85'
                      }`}
                    >
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div
                      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono ${
                        isDark ? 'text-white/60' : 'text-[#141414]/70'
                      }`}
                    >
                      <span>{ws.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ws.groupSize}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-bold tabular-nums ${isDark ? 'text-amber-300' : 'text-[#141414]'}`}>
                        {ws.pricePerPaxVnd.toLocaleString('vi-VN')} VND / pax
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className={`min-h-[44px] inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider group transition-colors ${
                          isDark
                            ? 'text-amber-300 hover:text-white'
                            : 'text-amber-950 hover:text-[#141414]'
                        }`}
                      >
                        <span className="underline underline-offset-4 font-bold">
                          {lang === 'vi'
                            ? 'XEM CHI TIẾT BỘ WORKSHOP & HÌNH ẢNH →'
                            : 'VIEW WORKSHOP DOSSIER & PHOTOS →'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right Image Column */}
                  <div
                    onClick={() => handleTileClick(ws)}
                    className={`lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl order-1 lg:order-2 border ${
                      isDark ? 'bg-black border-white/15' : 'bg-[#dcd8cf] border-[#141414]/15'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden relative">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                        <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 uppercase">
                          #{ws.indexNumber} · {ws.latinMonographName}
                        </span>
                        <p className="text-base sm:text-lg font-bagerich font-bold text-white uppercase mt-1">
                          {lang === 'vi' ? ws.titleVi : ws.titleEn}
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
                    className={`lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl order-1 border ${
                      isDark ? 'bg-black border-white/15' : 'bg-[#dcd8cf] border-[#141414]/15'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden relative">
                      <img
                        src={ws.image}
                        alt={ws.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                        <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 uppercase">
                          #{ws.indexNumber} · {ws.latinMonographName}
                        </span>
                        <p className="text-base sm:text-lg font-bagerich font-bold text-white uppercase mt-1">
                          {lang === 'vi' ? ws.titleVi : ws.titleEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Text Column */}
                  <div className="lg:col-span-5 space-y-4 sm:space-y-5 text-left order-2">
                    <div className="space-y-1.5">
                      <span
                        className={`text-[10px] font-mono tracking-widest uppercase block font-semibold ${
                          isDark ? 'text-amber-400' : 'text-amber-900'
                        }`}
                      >
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2
                        className={`text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight leading-none ${
                          isDark ? 'text-white' : 'text-[#141414]'
                        }`}
                      >
                        {ws.name}
                      </h2>
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-sans leading-relaxed ${
                        isDark ? 'text-white/80 font-light' : 'text-[#141414]/85'
                      }`}
                    >
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div
                      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono ${
                        isDark ? 'text-white/60' : 'text-[#141414]/70'
                      }`}
                    >
                      <span>{ws.duration}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ws.groupSize}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-bold tabular-nums ${isDark ? 'text-amber-300' : 'text-[#141414]'}`}>
                        {ws.pricePerPaxVnd.toLocaleString('vi-VN')} VND / pax
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className={`min-h-[44px] inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider group transition-colors ${
                          isDark
                            ? 'text-amber-300 hover:text-white'
                            : 'text-amber-950 hover:text-[#141414]'
                        }`}
                      >
                        <span className="underline underline-offset-4 font-bold">
                          {lang === 'vi'
                            ? 'XEM CHI TIẾT BỘ WORKSHOP & HÌNH ẢNH →'
                            : 'VIEW WORKSHOP DOSSIER & PHOTOS →'}
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
        <div
          className={`pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono ${
            isDark ? 'border-white/10 text-white/70' : 'border-[#141414]/15 text-[#141414]/80'
          }`}
        >
          <div className="text-center sm:text-left space-y-1">
            <span className={`font-bold block text-sm ${isDark ? 'text-white' : 'text-[#141414]'}`}>
              {atelierData.name || 'JU et Saigon'} — {atelierData.tagline || 'Flower Your Heart, Flower Your Soul'}
            </span>
            <span>
              {lang === 'vi' ? atelierData.addressVi : atelierData.addressEn} · Hotline:{' '}
              {atelierData.phoneFormatted || atelierData.phone}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <a
              href={atelierData.zaloUrl || 'https://zalo.me/g/lbzvqb973'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Tham Gia Zalo Bloom Daily' : 'Join Zalo Community'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
