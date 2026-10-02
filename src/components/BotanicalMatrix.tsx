import React, { useState, useRef } from 'react';
import { FlowerItem } from '../data/flowers';
import { soundEngine } from '../utils/audio';
import { ArrowRight } from 'lucide-react';

interface BotanicalMatrixProps {
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onSelectFlower: (flower: FlowerItem) => void;
  onOpenCollection?: () => void;
}

export const BotanicalMatrix: React.FC<BotanicalMatrixProps> = ({
  flowers,
  lang,
  onSelectFlower,
  onOpenCollection
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter pinned flowers for landing page (default 12 items)
  const pinnedFlowers = flowers.filter((f) => f.pinnedToLanding !== false);
  const displayFlowers = pinnedFlowers.length > 0 ? pinnedFlowers : flowers.slice(0, 12);

  const handleTileClick = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    onSelectFlower(flower);
  };

  const handleMouseEnter = (flower: FlowerItem) => {
    setHoveredId(flower.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  // Touch slide gesture support for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const tile = target?.closest('[data-flower-id]');
    if (tile) {
      const flowerId = tile.getAttribute('data-flower-id');
      if (flowerId && flowerId !== hoveredId) {
        setHoveredId(flowerId);
        const flower = flowers.find((f) => f.id === flowerId);
        if (flower) {
          soundEngine.playFlowerChime(flower.audioFrequency * 1.2);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setHoveredId(null);
    }, 1200);
  };

  return (
    <section id="gallery-matrix" className="max-w-4xl mx-auto px-4 sm:px-6 my-10 relative">
      
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#141414]/60 mb-3 px-1">
        <span>COLLECTION ARCHIVE · NỔI BẬT ({displayFlowers.length} SPECIMENS)</span>
        {onOpenCollection && (
          <button
            onClick={onOpenCollection}
            className="hover:text-[#141414] transition-colors underline underline-offset-4 flex items-center gap-1 font-semibold"
          >
            <span>{lang === 'vi' ? `Xem Tất Cả (${flowers.length})` : `View All (${flowers.length})`}</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* 3-column mosaic grid matching classic editorial atelier */}
      <div
        ref={gridRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#151513] p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl relative overflow-visible"
      >
        {displayFlowers.map((flower, idx) => {
          const isHovered = hoveredId === flower.id;

          return (
            <div
              key={flower.id}
              data-flower-id={flower.id}
              onClick={() => handleTileClick(flower)}
              onMouseEnter={() => handleMouseEnter(flower)}
              onMouseLeave={handleMouseLeave}
              className={`group relative aspect-[3/4] cursor-pointer transition-all duration-300 ease-out select-none ${
                isHovered
                  ? 'z-30 scale-110 sm:scale-120 rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] ring-1 ring-white/50'
                  : 'z-10 scale-100 rounded-lg hover:z-20'
              }`}
              style={{
                transformOrigin: 'center center',
                willChange: 'transform, box-shadow',
              }}
            >
              {/* Inner card container for clipping image */}
              <div
                className={`w-full h-full overflow-hidden bg-[#1f1e1c] transition-all duration-300 ${
                  isHovered ? 'rounded-xl' : 'rounded-lg'
                }`}
              >
                {/* Image */}
                <img
                  src={flower.image}
                  alt={flower.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center transition-all duration-500 ease-out ${
                    isHovered
                      ? 'scale-105 filter grayscale-0 brightness-95'
                      : 'scale-100 filter grayscale-[10%]'
                  }`}
                  loading={idx < 6 ? 'eager' : 'lazy'}
                />

                {/* Subtle dark vignette on hover */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isHovered
                      ? 'bg-gradient-to-t from-black/85 via-black/30 to-black/35 opacity-100'
                      : 'opacity-0'
                  }`}
                />

                {/* Central Callout Overlay matching user's reference image */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center text-white transition-all duration-300 ${
                    isHovered
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Specimen Index Number */}
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1 drop-shadow">
                    #{flower.indexNumber}
                  </span>

                  {/* Centered Main Title */}
                  <h3 className="text-base sm:text-xl font-bagerich font-medium text-white tracking-wide leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {flower.name}
                  </h3>

                  {/* Centered Subtitle */}
                  <p className="text-xs sm:text-sm font-sans text-white/95 mt-1.5 font-normal tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {lang === 'vi' ? 'Bấm để xem chi tiết' : 'Click to learn more'}
                  </p>

                  <span className="text-[10px] font-serif-editorial italic text-white/80 mt-1 drop-shadow">
                    {lang === 'vi' ? flower.vietnameseName : flower.latinName}
                  </span>
                </div>

                {/* Index tag top-left */}
                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[9px] font-mono text-white/90 tracking-widest transition-opacity duration-200 ${
                    isHovered ? 'opacity-0' : 'opacity-90'
                  }`}
                >
                  {flower.indexNumber}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button to open full collection archive */}
      {onOpenCollection && flowers.length > displayFlowers.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onOpenCollection}
            className="px-6 py-3 rounded-full bg-[#141414] text-[#dcd8cf] hover:bg-[#282725] text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
          >
            <span>{lang === 'vi' ? `Xem Toàn Bộ Bộ Sưu Tập (${flowers.length} Mẫu)` : `View Complete Archive (${flowers.length} Specimens)`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </section>
  );
};
