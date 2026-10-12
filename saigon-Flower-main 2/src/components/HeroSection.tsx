import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import { ATELIER_DATA, FlowerItem, HeroCoverSlide } from '../data/flowers';

interface HeroSectionProps {
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenIndex: () => void;
  onOpenCredits: () => void;
  onSelectFlower?: (flower: FlowerItem) => void;
  onOrderFlower?: (flower: FlowerItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const { atelierData } = useAtelier();

  const slides: HeroCoverSlide[] =
    Array.isArray(atelierData.heroSlides) && atelierData.heroSlides.length > 0
      ? atelierData.heroSlides
      : ATELIER_DATA.heroSlides;

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Smooth horizontal touch & mouse drag swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const coverFrameRef = useRef<HTMLDivElement | null>(null);
  const wheelCooldownRef = useRef<number>(0);

  const safeIdx = activeSlideIdx < slides.length ? activeSlideIdx : 0;

  // Auto-advance slides every 6s unless hovered or dragging
  useEffect(() => {
    if (slides.length <= 1 || isPaused || isDragging) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, isDragging]);

  // Support MacBook / laptop trackpad 2-finger horizontal swipe
  useEffect(() => {
    const el = coverFrameRef.current;
    if (!el || slides.length <= 1) return;

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX > absY && absX > 18) {
        e.preventDefault();
        const now = Date.now();
        if (now - wheelCooldownRef.current < 420) return;
        wheelCooldownRef.current = now;
        setDragOffsetPx(0);
        if (e.deltaX > 0) {
          setActiveSlideIdx((prev) => (prev + 1) % slides.length);
        } else {
          setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragOffsetPx(0);
    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragOffsetPx(0);
    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
  };

  const handleSwipeStart = (clientX: number) => {
    dragStartXRef.current = clientX;
    setIsDragging(true);
    setDragOffsetPx(0);
  };

  const handleSwipeMove = (clientX: number) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const deltaX = clientX - dragStartXRef.current;
    // Subtle rubber-band resistance if dragging past first or last slide
    const isAtEdge =
      slides.length <= 1 ||
      (safeIdx === 0 && deltaX > 0) ||
      (safeIdx === slides.length - 1 && deltaX < 0);
    setDragOffsetPx(isAtEdge ? deltaX * 0.28 : deltaX);
  };

  const handleSwipeEnd = () => {
    if (!isDragging) return;
    const threshold = 40;
    if (slides.length > 1) {
      if (dragOffsetPx <= -threshold) {
        setActiveSlideIdx((prev) => (prev + 1) % slides.length);
      } else if (dragOffsetPx >= threshold) {
        setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    setIsDragging(false);
    setDragOffsetPx(0);
    dragStartXRef.current = null;
  };

  return (
    <section className="pt-8 pb-6 px-4 max-w-4xl mx-auto flex flex-col items-center">
      {/* Brand Masthead */}
      <div className="text-center space-y-1.5 mb-6">
        <h1
          className={`text-4xl sm:text-6xl md:text-7xl font-fleur-title font-normal tracking-tight uppercase leading-none select-none transition-colors ${
            isDark ? 'text-[#ede9df]' : 'text-[#141414]'
          }`}
        >
          {atelierData.name || 'JU ET SAIGON'}
        </h1>
        <p
          className={`text-sm sm:text-lg font-editorial-serif italic tracking-wide transition-colors ${
            isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/85'
          }`}
        >
          Encyclopædia Botanica Digital
        </p>
      </div>

      {/* Pure Poster Cover Frame — Fixed 16:9 Horizontal Aspect Ratio & Smooth Horizontal Swipe Track */}
      {slides.length > 0 && (
        <div
          ref={coverFrameRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragging) handleSwipeEnd();
          }}
          onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
          onTouchEnd={handleSwipeEnd}
          onTouchCancel={handleSwipeEnd}
          onMouseDown={(e) => handleSwipeStart(e.clientX)}
          onMouseMove={(e) => handleSwipeMove(e.clientX)}
          onMouseUp={handleSwipeEnd}
          className={`w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl relative group select-none touch-pan-y ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } ${
            isDark
              ? 'bg-[#171815] border-white/15'
              : 'bg-[#dcd8cf] border-[#141414]/15'
          }`}
        >
          {/* Hardware-Accelerated Horizontal Glide Track */}
          <div
            className="flex w-full h-full will-change-transform"
            style={{
              transform: `translate3d(calc(-${safeIdx * 100}% + ${dragOffsetPx}px), 0, 0)`,
              transition: isDragging
                ? 'none'
                : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="w-full h-full shrink-0 grow-0 basis-full overflow-hidden"
              >
                <img
                  src={slide.image}
                  alt={`JU et Saigon Seasonal Poster Cover ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover object-center block select-none pointer-events-none"
                />
              </div>
            ))}
          </div>

          {/* Subtle Left/Right Arrows & Dots when multiple poster slides exist */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Poster trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Poster tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm"
              >
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => {
                      setDragOffsetPx(0);
                      setActiveSlideIdx(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === safeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Poster ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Discover Kicker below Cover */}
      <div className="mt-6 pt-2 text-center">
        <p
          className={`text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase transition-colors ${
            isDark ? 'text-[#ede9df]/75' : 'text-[#141414]/80'
          }`}
        >
          {lang === 'vi' ? 'KHÁM PHÁ CÁC TÁC PHẨM HOA ĐỘC BẢN' : 'DISCOVER THE FLOWERS'}
        </p>
      </div>
    </section>
  );
};
