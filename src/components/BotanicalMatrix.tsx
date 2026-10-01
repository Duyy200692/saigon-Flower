import React, { useState, useRef } from 'react';
import { FlowerItem } from '../data/flowers';
import { soundEngine } from '../utils/audio';
import { Sparkles, Eye } from 'lucide-react';

interface BotanicalMatrixProps {
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onSelectFlower: (flower: FlowerItem) => void;
}

export const BotanicalMatrix: React.FC<BotanicalMatrixProps> = ({
  flowers,
  lang,
  onSelectFlower
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    // Keep brief delay so user sees tap effect
    setTimeout(() => {
      setHoveredId(null);
    }, 1200);
  };

  return (
    <section id="gallery-matrix" className="max-w-4xl mx-auto px-4 sm:px-6 my-10 relative">
      
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#141414]/60 mb-3 px-1">
        <span>COLLECTION ARCHIVE ({flowers.length} SPECIMENS)</span>
      </div>

      {/* 3-column mosaic grid with generous padding to prevent card clipping on hover */}
      <div
        ref={gridRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="grid grid-cols-3 gap-1.5 sm:gap-2.5 bg-[#141414] p-2 sm:p-3 shadow-2xl rounded-xl relative overflow-visible"
      >
        {flowers.map((flower, idx) => {
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
                  ? 'z-30 scale-120 sm:scale-130 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/30'
                  : 'z-10 scale-100 rounded-sm hover:z-20'
              }`}
              style={{
                transformOrigin: 'center center',
                willChange: 'transform, box-shadow, border-radius',
              }}
            >
              {/* Inner card container for clipping image with rounded corners */}
              <div
                className={`w-full h-full overflow-hidden bg-[#1f1e1c] transition-all duration-300 ${
                  isHovered ? 'rounded-2xl' : 'rounded-sm'
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
                      ? 'bg-gradient-to-t from-black/75 via-black/20 to-black/30 opacity-100 rounded-2xl'
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

                {/* Subtle index tag top-left (visible when not hovered) */}
                <div
                  className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-[9px] font-mono text-white/90 tracking-widest transition-opacity duration-200 ${
                    isHovered ? 'opacity-0' : 'opacity-80'
                  }`}
                >
                  {flower.indexNumber}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
