import React, { useState, useEffect } from 'react';
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
  theme = 'light',
  onSelectFlower
}) => {
  const isDark = theme === 'dark';
  const { atelierData, flowers } = useAtelier();

  const slides: HeroCoverSlide[] =
    Array.isArray(atelierData.heroSlides) && atelierData.heroSlides.length > 0
      ? atelierData.heroSlides
      : ATELIER_DATA.heroSlides;

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIdx = activeSlideIdx < slides.length ? activeSlideIdx : 0;
  const currentSlide = slides[safeIdx] || slides[0];

  const linkedFlower = flowers.find((f) => f.id === currentSlide?.linkedFlowerId);

  // Auto-advance slides every 6s unless hovered
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
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
          JU ET SAIGON
        </h1>
        <p
          className={`text-sm sm:text-lg font-editorial-serif italic tracking-wide transition-colors ${
            isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/85'
          }`}
        >
          Encyclopædia Botanica Digital
        </p>
      </div>

      {/* Pure Poster Cover Frame — Fixed 16:9 Standard Horizontal Aspect Ratio */}
      {currentSlide && (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => {
            if (linkedFlower && onSelectFlower) {
              onSelectFlower(linkedFlower);
            }
          }}
          className={`w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl relative group transition-all duration-500 ${
            linkedFlower ? 'cursor-pointer' : ''
          } ${
            isDark
              ? 'bg-[#171815] border-white/15'
              : 'bg-[#dcd8cf] border-[#141414]/15'
          }`}
        >
          <img
            key={currentSlide.id + currentSlide.image}
            src={currentSlide.image}
            alt="JU et Saigon Seasonal Poster Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center block animate-fadeIn"
          />

          {/* Subtle Left/Right Arrows & Dots ONLY on hover when multiple poster slides exist */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Poster trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Poster tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm"
              >
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
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
