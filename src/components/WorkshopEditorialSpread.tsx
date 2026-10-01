import React from 'react';
import { WorkshopItem, WORKSHOPS } from '../data/workshop';
import { ArrowRight, Sparkles, MessageSquare, PhoneCall } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WorkshopEditorialSpreadProps {
  workshops?: WorkshopItem[];
  lang: 'vi' | 'en';
  onOpenDetail: (workshop: WorkshopItem) => void;
}

export const WorkshopEditorialSpread: React.FC<WorkshopEditorialSpreadProps> = ({
  workshops = WORKSHOPS,
  lang,
  onOpenDetail
}) => {
  const handleTileClick = (ws: WorkshopItem) => {
    soundEngine.playFlowerChime(528);
    onOpenDetail(ws);
  };

  return (
    <section id="workshop" className="w-full bg-[#1c1d1a] text-[#ede9df] py-20 px-4 sm:px-6 lg:px-12 my-12 border-y border-[#2e2f2b]">
      <div className="max-w-6xl mx-auto space-y-24 sm:space-y-32">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-mono tracking-widest uppercase text-white/60">
          <span>JU ET SAIGON · WORKSHOP BOTANICA</span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'DỊCH VỤ WORKSHOP DOANH NGHIỆP TRỌN GÓI' : 'CORPORATE WORKSHOP SERIES'}</span>
          </span>
        </div>

        {/* Alternating Zig-Zag Layout matching User's Reference Screenshot */}
        {workshops.map((ws, idx) => {
          // Even rows: Text on Left, Image on Right
          // Odd rows: Image on Left, Text on Right
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
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight text-white leading-none">
                        {ws.name}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed font-light">
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white group transition-colors"
                      >
                        <span className="underline underline-offset-4 font-semibold">
                          {lang === 'vi' ? 'Xem chi tiết bộ workshop & hình ảnh' : 'Click to learn more & view gallery'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-xs font-mono tracking-widest text-amber-300 uppercase">
                          {lang === 'vi' ? 'BẤM ĐỂ MỞ 4 ẢNH TỈ LỆ 3:4 & THÔNG TIN CHI TIẾT' : 'CLICK TO VIEW 4 PHOTOS & DOSSIER'}
                        </span>
                        <p className="text-base font-bagerich font-bold text-white uppercase mt-1">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-xs font-mono tracking-widest text-amber-300 uppercase">
                          {lang === 'vi' ? 'BẤM ĐỂ MỞ 4 ẢNH TỈ LỆ 3:4 & THÔNG TIN CHI TIẾT' : 'CLICK TO VIEW 4 PHOTOS & DOSSIER'}
                        </span>
                        <p className="text-base font-bagerich font-bold text-white uppercase mt-1">
                          {ws.titleVi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Text Column */}
                  <div className="lg:col-span-5 space-y-5 text-left order-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                        #{ws.indexNumber} · {ws.latinMonographName.toUpperCase()}
                      </span>
                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight text-white leading-none">
                        {ws.name}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed font-light">
                      {lang === 'vi' ? ws.editorialQuoteVi : ws.editorialQuoteEn}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => handleTileClick(ws)}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white group transition-colors"
                      >
                        <span className="underline underline-offset-4 font-semibold">
                          {lang === 'vi' ? 'Xem chi tiết bộ workshop & hình ảnh' : 'Click to learn more & view gallery'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Bottom Fast Action Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-white/70 text-center sm:text-left">
            <span className="text-white font-bold block">JU et Saigon — Flower Your Heart, Flower Your Soul</span>
            <span>📍 Lầu 1- 31 Nguyễn Trãi, Phường Bến Thành, Quận 1 · Hotline 090 936 80 80</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://zalo.me/g/lbzvqb973"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Zalo Bloom Daily</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
