import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkshopItem } from '../data/workshop';
import { soundEngine } from '../utils/audio';

interface WorkshopDetailModalProps {
  workshop: WorkshopItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const WorkshopDetailModal: React.FC<WorkshopDetailModalProps> = ({
  workshop,
  isOpen,
  onClose,
  lang
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset slide index when opening
  useEffect(() => {
    setCurrentSlide(0);
  }, [workshop?.id, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, workshop]);

  if (!isOpen || !workshop) return null;

  const gallery = workshop.galleryImages || [
    { url: workshop.image, captionVi: "Bó hoa nghệ thuật", captionEn: "Artistic bouquet" }
  ];
  const totalSlides = gallery.length;
  const activeImage = gallery[currentSlide] || gallery[0];

  const handleNext = () => {
    soundEngine.playFlowerChime(580);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    soundEngine.playFlowerChime(480);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsLandscape(naturalWidth > naturalHeight);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none">
      
      {/* Top Floating Clean Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between text-white border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest uppercase text-amber-300">
            #{workshop.indexNumber} · {workshop.name}
          </span>
        </div>

        <button
          onClick={onClose}
          className="spring-press p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-mono uppercase border border-white/15 backdrop-blur-xl"
          aria-label="Close photo viewer"
        >
          <span className="hidden sm:inline">{lang === 'vi' ? 'Đóng' : 'Close'}</span>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage (Pure Photo Slider Card) */}
      <div className="flex-1 flex items-center justify-center py-4 relative my-auto">
        <div
          className={`relative w-full mx-auto rounded-[28px] sm:rounded-[36px] overflow-hidden bg-black shadow-soft-3 border border-white/20 transition-all duration-300 flex items-center justify-center ${
            isLandscape ? 'max-w-3xl aspect-[4/3]' : 'max-w-md sm:max-w-lg aspect-[3/4]'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main High-Res Photo */}
          <img
            key={activeImage.url + currentSlide}
            src={activeImage.url}
            alt={activeImage.captionVi}
            onLoad={handleImageLoad}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300 animate-fadeIn"
          />

          {/* Left Arrow Button */}
          {totalSlides > 1 && (
            <button
              onClick={handlePrev}
              className="spring-press absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 hover:bg-black/85 text-white/90 backdrop-blur-2xl border border-white/20 transition-all flex items-center justify-center shadow-soft-2 hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {totalSlides > 1 && (
            <button
              onClick={handleNext}
              className="spring-press absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 hover:bg-black/85 text-white/90 backdrop-blur-2xl border border-white/20 transition-all flex items-center justify-center shadow-soft-2 hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Slide Index Badge Top Right (matching 1/4 badge) */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-2xl bg-black/65 border border-white/20 text-xs font-mono text-white/90 tracking-widest shadow-md">
            {currentSlide + 1}/{totalSlides}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Dots & Minimal Caption */}
      <div className="w-full max-w-xl mx-auto space-y-2 text-center pt-2">
        {/* Horizontal Dot Indicators */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playFlowerChime(528);
                  setCurrentSlide(idx);
                }}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? 'w-2.5 h-2.5 bg-amber-300 scale-110 shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
