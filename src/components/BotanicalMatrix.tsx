import React, { useState, useRef } from 'react';
import { FlowerItem } from '../data/flowers';
import { ArrowRight, Heart, Maximize2, Minimize2 } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface BotanicalMatrixProps {
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onSelectFlower: (flower: FlowerItem) => void;
  onOpenCollection?: () => void;
}

export const BotanicalMatrix: React.FC<BotanicalMatrixProps> = ({
  flowers,
  lang,
  theme = 'light',
  onSelectFlower,
  onOpenCollection
}) => {
  const { toggleWishlist, isInWishlist } = useAtelier();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [gridFitMode, setGridFitMode] = useState<'cover' | 'contain'>('cover');
  const gridRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Filter pinned flowers for landing page (default 12 items)
  const pinnedFlowers = flowers.filter((f) => f.pinnedToLanding !== false);
  const displayFlowers = pinnedFlowers.length > 0 ? pinnedFlowers : flowers.slice(0, 12);

  const handleTileClick = (flower: FlowerItem) => {
    onSelectFlower(flower);
  };

  const handleMouseEnter = (flower: FlowerItem) => {
    setHoveredId(flower.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  // Touch slide gesture support for mobile (silent)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const tile = target?.closest('[data-flower-id]');
    if (tile) {
      const flowerId = tile.getAttribute('data-flower-id');
      if (flowerId && flowerId !== hoveredId) {
        setHoveredId(flowerId);
      }
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setHoveredId(null);
    }, 1200);
  };

  return (
    <section id="gallery-matrix" className="max-w-4xl mx-auto px-4 sm:px-6 my-10 relative overflow-x-clip">
      
      <div
        className={`flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-widest mb-3 px-1 transition-colors ${
          isDark ? 'text-[#ede9df]/65' : 'text-[#141414]/60'
        }`}
      >
        <span>COLLECTION ARCHIVE · NỔI BẬT ({displayFlowers.length} SPECIMENS)</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGridFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'))}
            className={`px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              gridFitMode === 'contain'
                ? isDark
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 font-bold'
                  : 'bg-[#141414] border-[#141414] text-[#dcd8cf] font-bold'
                : isDark
                  ? 'border-white/15 hover:border-white/35 text-[#ede9df]/75'
                  : 'border-[#141414]/20 hover:border-[#141414]/45 text-[#141414]/75'
            }`}
            title={
              gridFitMode === 'cover'
                ? 'Chuyển sang hiển thị Vừa Khung Gốc (giữ nguyên tỉ lệ ảnh gốc bên ngoài)'
                : 'Chuyển sang Lấp Đầy Khung 3:4 đồng bộ'
            }
          >
            {gridFitMode === 'cover' ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>{lang === 'vi' ? 'Tỉ Lệ: Lấp Đầy 3:4' : 'Frame: 3:4 Fill'}</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>{lang === 'vi' ? 'Tỉ Lệ: Nguyên Bản' : 'Frame: Original Fit'}</span>
              </>
            )}
          </button>

          {onOpenCollection && (
            <button
              onClick={onOpenCollection}
              className={`transition-colors underline underline-offset-4 flex items-center gap-1 font-semibold ${
                isDark ? 'hover:text-white' : 'hover:text-[#141414]'
              }`}
            >
              <span>{lang === 'vi' ? `Xem Tất Cả (${flowers.length})` : `View All (${flowers.length})`}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>

      {/* 3-column mosaic grid matching classic editorial atelier */}
      <div
        ref={gridRef}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`grid grid-cols-3 gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border shadow-2xl relative overflow-visible transition-colors duration-300 ${
          isDark
            ? 'bg-[#171815] border-white/15'
            : 'bg-[#151513] border-white/10'
        }`}
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
                className={`relative w-full h-full overflow-hidden bg-[#1f1e1c] transition-all duration-300 ${
                  isHovered ? 'rounded-xl' : 'rounded-lg'
                }`}
              >
                {/* Ambient Blur Backdrop when viewing uncropped external aspect ratios */}
                {gridFitMode === 'contain' && (
                  <img
                    src={flower.image}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover scale-115 blur-xl opacity-45 pointer-events-none"
                  />
                )}

                {/* Image */}
                <img
                  src={flower.image}
                  alt={flower.name}
                  referrerPolicy="no-referrer"
                  className={`relative z-10 w-full h-full transition-all duration-500 ease-out ${
                    gridFitMode === 'contain' ? 'object-contain p-1' : 'object-cover object-center'
                  } ${
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

                {/* Central Callout Overlay */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center text-white transition-all duration-300 ${
                    isHovered
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1 drop-shadow">
                    #{flower.indexNumber}
                  </span>

                  <h3 className="text-base sm:text-xl font-bagerich font-medium text-white tracking-wide leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {flower.name}
                  </h3>

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

                {/* Quick Wishlist Heart button top-right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(flower.id);
                  }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-20 ${
                    isInWishlist(flower.id)
                      ? 'bg-rose-500 text-white opacity-100 shadow-md'
                      : isHovered
                        ? 'bg-black/70 text-white/90 hover:bg-black opacity-100'
                        : 'opacity-0 pointer-events-none'
                  }`}
                  title={lang === 'vi' ? 'Lưu vào Moodboard Yêu Thích' : 'Save to Moodboard'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(flower.id) ? 'fill-current' : ''}`} />
                </button>
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
            className={`px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
              isDark
                ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
                : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#282725]'
            }`}
          >
            <span>{lang === 'vi' ? `Xem Toàn Bộ Bộ Sưu Tập (${flowers.length} Mẫu)` : `View Complete Archive (${flowers.length} Specimens)`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </section>
  );
};
