import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, ChevronLeft, ChevronRight, Share2, Check, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Heart } from 'lucide-react';
import { FlowerItem, FLOWERS } from '../data/flowers';
import { getSmartAlternativeFlowers } from '../data/inventoryAndTrends';
import { useAtelier } from '../context/AtelierContext';
import { formatTitleCase, formatDisplayUppercase } from '../utils/textFormatter';
import { useTrackpadGallery } from '../hooks/useTrackpadGallery';

interface FlowerDetailModalProps {
  flower: FlowerItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOrderFlower: (flower: FlowerItem) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const FlowerDetailModal: React.FC<FlowerDetailModalProps> = ({
  flower,
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onOrderFlower,
  onNext,
  onPrev
}) => {
  const { flowers, toggleWishlist, isInWishlist } = useAtelier();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAnatomy, setSelectedAnatomy] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'story' | 'scent' | 'materials'>('story');
  const [isCopied, setIsCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [imageFitMode, setImageFitMode] = useState<'cover' | 'contain'>('cover');
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanningLightbox, setIsPanningLightbox] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  // Touch swipe state for mobile gallery navigation
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isDark = theme === 'dark';

  const totalCount = flowers.length || FLOWERS.length;
  const validGallery = Array.isArray(flower?.galleryImages)
    ? flower.galleryImages.filter((g) => g && typeof g.url === 'string' && g.url.trim().length > 0)
    : [];
  const gallery =
    validGallery.length > 0
      ? validGallery
      : [
          { url: flower?.image || '', captionVi: 'Góc nhìn toàn cảnh', captionEn: 'Full architectural view' },
          { url: flower?.image || '', captionVi: 'Cận cảnh chi tiết', captionEn: 'Macro texture detail' },
          { url: flower?.image || '', captionVi: 'Bối cảnh không gian', captionEn: 'Ambient interior styling' },
          { url: flower?.image || '', captionVi: 'Dáng cành độc bản', captionEn: 'Sculptural profile angle' }
        ];

  const safeImageIndex = selectedImageIndex < gallery.length ? selectedImageIndex : 0;
  const currentImage = gallery[safeImageIndex] || gallery[0];

  const handlePrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const handleNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  // MacBook Trackpad 2-finger horizontal swipe navigation
  const {
    containerRef: imageTrackpadRef,
    dragOffset
  } = useTrackpadGallery<HTMLDivElement>({
    totalItems: gallery.length,
    currentIndex: safeImageIndex,
    onNext: handleNextImage,
    onPrev: handlePrevImage,
    threshold: 36,
    cooldownMs: 320,
    enabled: isOpen && !isLightboxOpen
  });

  // Lightbox container ref for MacBook Trackpad pinch-to-zoom & two-finger pan (MUST be declared before any early return)
  const lightboxContainerRef = useRef<HTMLDivElement>(null);

  // Reset selected image when flower changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedAnatomy(null);
    setImageFitMode('cover');
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
  }, [flower?.id]);

  // Keyboard navigation for previous/next
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && onNext && !isLightboxOpen) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev && !isLightboxOpen) {
        onPrev();
      } else if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose, isLightboxOpen]);

  // Lightbox wheel / trackpad zoom & pan listener (MUST be declared before any early return)
  useEffect(() => {
    const el = lightboxContainerRef.current;
    if (!el || !isOpen || !isLightboxOpen) return;

    let panCooldown = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Trackpad pinch-to-zoom (ctrlKey is true when pinching on Mac trackpad)
      if (e.ctrlKey) {
        setLightboxZoom((prev) => {
          const delta = -e.deltaY * 0.012;
          const next = Math.max(1, Math.min(3.5, +(prev + delta).toFixed(2)));
          if (next <= 1.05) {
            setLightboxPan({ x: 0, y: 0 });
            return 1;
          }
          return next;
        });
        return;
      }

      // If zoomed in: 2 fingers pan the image smoothly
      if (lightboxZoom > 1.05) {
        setLightboxPan((prev) => {
          const maxPan = 350 * (lightboxZoom - 1);
          const nextX = Math.max(-maxPan, Math.min(maxPan, prev.x - e.deltaX * 0.85));
          const nextY = Math.max(-maxPan, Math.min(maxPan, prev.y - e.deltaY * 0.85));
          return { x: nextX, y: nextY };
        });
        return;
      }

      // If at 1x zoom and swiping horizontally: switch image
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX > absY && absX > 25) {
        const now = Date.now();
        if (now - panCooldown < 320) return;
        panCooldown = now;
        if (e.deltaX > 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isOpen, isLightboxOpen, lightboxZoom, handleNextImage, handlePrevImage]);

  // Auto-detect image natural aspect ratio (Landscape 4:3 vs Portrait 3:4)
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsLandscape(naturalWidth > naturalHeight);
  };

  if (!isOpen || !flower) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNextImage();
    } else if (distance < -45) {
      handlePrevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${flower.name} · JU et Saigon`,
        text: lang === 'vi' ? flower.vietnameseName : flower.shortDescriptionEn,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#${flower.id}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn ${
        isDark ? 'bg-black/85' : 'bg-[#dcd8cf]/90'
      }`}
    >
      
      {/* Modal Container with Continuous Curves & Layered Depth */}
      <div
        className={`relative w-full max-w-5xl rounded-[32px] sm:rounded-[40px] shadow-2xl border overflow-hidden my-auto max-h-[96vh] flex flex-col transition-colors duration-300 ${
          isDark
            ? 'bg-[#151614] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* Top Floating Action Bar */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b backdrop-blur-2xl flex items-center justify-between z-20 ${
            isDark
              ? 'border-white/15 bg-[#151614]/90'
              : 'border-[#141414]/15 bg-[#dcd8cf]/90'
          }`}
        >
          {/* Navigation Controls (< Prev | Next >) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {onPrev && (
              <button
                onClick={onPrev}
                className={`p-1.5 sm:px-3.5 sm:py-1 rounded-[18px] border transition-all flex items-center gap-1 text-xs font-mono uppercase ${
                  isDark
                    ? 'border-white/20 hover:border-white hover:bg-white hover:text-[#141414]'
                    : 'border-[#141414]/20 hover:border-[#141414] hover:bg-[#141414] hover:text-[#dcd8cf]'
                }`}
                title="Previous Flower (Arrow Left)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'vi' ? 'Trước' : 'Prev'}</span>
              </button>
            )}

            <div
              className={`text-xs font-mono px-2.5 py-1 rounded-[14px] border ${
                isDark
                  ? 'text-[#ede9df]/80 bg-white/5 border-white/10'
                  : 'text-[#141414]/80 bg-black/5 border-black/5'
              }`}
            >
              SPECIMEN <span className={`font-bold ${isDark ? 'text-white' : 'text-[#141414]'}`}>{flower.indexNumber}</span> / {totalCount}
            </div>

            {onNext && (
              <button
                onClick={onNext}
                className={`p-1.5 sm:px-3.5 sm:py-1 rounded-[18px] border transition-all flex items-center gap-1 text-xs font-mono uppercase ${
                  isDark
                    ? 'border-white/20 hover:border-white hover:bg-white hover:text-[#141414]'
                    : 'border-[#141414]/20 hover:border-[#141414] hover:bg-[#141414] hover:text-[#dcd8cf]'
                }`}
                title="Next Flower (Arrow Right)"
              >
                <span className="hidden sm:inline">{lang === 'vi' ? 'Tiếp' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Icons: Wishlist Heart, Share & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(flower.id)}
              className={`px-3 py-1.5 rounded-[18px] border transition-all flex items-center gap-1.5 text-xs font-mono ${
                isInWishlist(flower.id)
                  ? 'bg-rose-500 border-rose-500 text-white font-bold shadow-sm'
                  : isDark
                    ? 'border-white/20 hover:border-white text-[#ede9df]'
                    : 'border-[#141414]/20 hover:border-[#141414] text-[#141414]'
              }`}
              title={lang === 'vi' ? 'Lưu vào Moodboard Yêu Thích' : 'Save to Moodboard'}
            >
              <Heart className={`w-3.5 h-3.5 ${isInWishlist(flower.id) ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">
                {isInWishlist(flower.id)
                  ? lang === 'vi'
                    ? 'Đã Lưu'
                    : 'Saved'
                  : 'Moodboard'}
              </span>
            </button>

            <button
              onClick={handleShare}
              className={`p-2 rounded-[18px] border transition-all ${
                isDark
                  ? 'border-white/20 hover:border-white text-[#ede9df]'
                  : 'border-[#141414]/20 hover:border-[#141414] text-[#141414]'
              }`}
              title="Share"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-[18px] transition-all ml-1 shadow-sm ${
                isDark
                  ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2e2d2a]'
              }`}
              aria-label="Close detail modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="overflow-y-auto no-scrollbar overscroll-contain flex-1 p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Main Grid: Auto-Adaptive Aspect Ratio Gallery on Left & Details on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Auto-detected Aspect Ratio Multi-Image Gallery */}
            <div className="lg:col-span-6 space-y-3">
              
              {/* Main Adaptive Image Frame with Trackpad & Swipe Gestures */}
              <div
                ref={imageTrackpadRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full mx-auto rounded-[26px] sm:rounded-[34px] overflow-hidden shadow-2xl border group transition-all duration-500 will-change-transform ${
                  isDark ? 'bg-[#181716] border-white/15' : 'bg-[#dcd8cf] border-[#141414]/20'
                } ${
                  isLandscape ? 'aspect-[4/3] max-w-lg' : 'aspect-[3/4] max-w-md'
                }`}
                style={{
                  transform: dragOffset ? `translateX(${dragOffset}px)` : undefined,
                  transition: dragOffset ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Blurred ambient backdrop when in 'contain' (Vừa Khung) mode */}
                {imageFitMode === 'contain' && (
                  <img
                    src={currentImage.url}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55 pointer-events-none"
                  />
                )}

                <img
                  key={currentImage.url + safeImageIndex}
                  src={currentImage.url}
                  alt={`${flower.name} - ${currentImage.captionEn}`}
                  onLoad={handleImageLoad}
                  referrerPolicy="no-referrer"
                  className={`relative z-0 w-full h-full transition-transform duration-500 group-hover:scale-103 animate-fadeIn ${
                    imageFitMode === 'contain' ? 'object-contain p-2' : 'object-cover object-center'
                  }`}
                />

                {/* Left / Right Gallery Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md opacity-80 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md opacity-80 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Top Right Controls: Fit/Fill Toggle & Lightbox Zoom Trigger */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFitMode((m) => (m === 'cover' ? 'contain' : 'cover'));
                    }}
                    className="px-2.5 py-1.5 rounded-full bg-black/65 hover:bg-black text-white backdrop-blur-md transition-all text-[10px] font-mono uppercase flex items-center gap-1 border border-white/15"
                    title={
                      imageFitMode === 'cover'
                        ? 'Chuyển sang Vừa Khung (Hiển thị 100% ảnh gốc không cắt)'
                        : 'Chuyển sang Đầy Khung (Lấp kín khung chuẩn)'
                    }
                  >
                    <Minimize2 className="w-3 h-3 text-amber-300" />
                    <span>{imageFitMode === 'cover' ? (lang === 'vi' ? 'Vừa Khung' : 'Fit') : (lang === 'vi' ? 'Đầy Khung' : 'Fill')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLightboxZoom(1);
                      setLightboxPan({ x: 0, y: 0 });
                      setIsLightboxOpen(true);
                    }}
                    className="p-2 rounded-full bg-black/65 hover:bg-black text-white backdrop-blur-md transition-all border border-white/15"
                    title="Phóng to toàn màn hình"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Anatomy Hotspots (shown on primary image) */}
                {safeImageIndex === 0 && (flower.anatomy || []).map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedAnatomy(selectedAnatomy === pin.id ? null : pin.id)}
                    style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    aria-label={pin.titleEn}
                  >
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-black/90 border-2 border-white text-[11px] font-bold text-white items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        +
                      </span>
                    </span>
                  </button>
                ))}

                {/* Hotspot details overlay */}
                {selectedAnatomy && (
                  <div className="absolute bottom-12 inset-x-4 p-3.5 bg-black/90 text-white text-xs rounded-xl backdrop-blur-md shadow-2xl border border-white/20 animate-fadeIn z-20">
                    {(() => {
                      const pin = (flower.anatomy || []).find((p) => p.id === selectedAnatomy);
                      if (!pin) return null;
                      return (
                        <div>
                          <div className="flex items-center justify-between font-bold text-sm text-amber-200">
                            <span>{lang === 'vi' ? pin.titleVi : pin.titleEn}</span>
                            <button
                              onClick={() => setSelectedAnatomy(null)}
                              className="text-white/60 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="mt-1 text-white/90 text-xs font-sans leading-relaxed">
                            {lang === 'vi' ? pin.descriptionVi : pin.descriptionEn}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Bottom Gallery Image Caption & Clean Counter */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white flex items-center justify-between text-[11px] font-sans">
                  <span className="truncate pr-2 text-white/90 font-medium">
                    {lang === 'vi' ? currentImage.captionVi : currentImage.captionEn}
                  </span>
                  <span className="flex-shrink-0 font-mono text-[10px] bg-black/50 px-2 py-0.5 rounded text-white/80">
                    {safeImageIndex + 1} / {gallery.length}
                  </span>
                </div>
              </div>

              {/* Adaptive Thumbnail Strip */}
              <div
                className={`grid gap-2 pt-1 mx-auto ${
                  isLandscape ? 'grid-cols-4 max-w-lg' : 'grid-cols-4 max-w-md'
                }`}
              >
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setSelectedAnatomy(null);
                    }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      isDark ? 'bg-[#141414]' : 'bg-[#dcd8cf]'
                    } ${
                      isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]'
                    } ${
                      safeImageIndex === idx
                        ? isDark
                          ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20 scale-102'
                          : 'border-[#141414] shadow-md ring-2 ring-black/20 scale-102'
                        : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-[9px] font-mono text-white rounded">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* Right Column: Title, Tabbed Info & Pricing/Order */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Header Titles in Bagerich Font */}
              <div className={`border-b pb-4 ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-mono tracking-widest uppercase block ${
                      isDark ? 'text-amber-300/80' : 'text-[#141414]/60'
                    }`}
                  >
                    {lang === 'vi' ? flower.categoryLabelVi : flower.categoryLabelEn}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      flower.availabilityStatus === 'seasonal_out'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/35'
                        : flower.availabilityStatus === 'preorder_24h'
                          ? 'bg-amber-400/20 text-amber-500 border-amber-400/40'
                          : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/35'
                    }`}
                  >
                    {flower.availabilityStatus === 'seasonal_out'
                      ? lang === 'vi'
                        ? '○ Tạm hết mùa · Xem gợi ý tương đồng'
                        : '○ Seasonal Out'
                      : flower.availabilityStatus === 'preorder_24h'
                        ? lang === 'vi'
                          ? '◐ Đặt trước 24h'
                          : '◐ 24h Pre-order'
                        : lang === 'vi'
                          ? '● Sẵn hoa trong ngày'
                          : '● Ready Today'}
                  </span>
                </div>
                <h2
                  className={`text-2xl sm:text-4xl font-bagerich font-normal uppercase tracking-tight leading-[1.15] ${
                    isDark ? 'text-white' : 'text-[#141414]'
                  }`}
                >
                  {formatDisplayUppercase(flower.name)}
                </h2>
                <p
                  className={`text-sm sm:text-base font-editorial-serif italic mt-1.5 ${
                    isDark ? 'text-[#ede9df]/75' : 'text-[#141414]/80'
                  }`}
                >
                  {flower.latinName} —{' '}
                  <span className={`font-sans not-italic font-semibold ${isDark ? 'text-white' : 'text-[#141414]'}`}>
                    {formatTitleCase(flower.vietnameseName)}
                  </span>
                </p>
              </div>

              {/* Information Tabs (Overview / Scent / Stems) */}
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/50 border-[#141414]/10'
                }`}
              >
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'story'
                      ? isDark
                        ? 'bg-[#ede9df] text-[#141414] shadow-sm'
                        : 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                      : isDark
                        ? 'text-[#ede9df]/70 hover:text-white'
                        : 'text-[#141414]/70 hover:text-[#141414]'
                  }`}
                >
                  {lang === 'vi' ? 'Câu Chuyện' : 'Monograph'}
                </button>
                <button
                  onClick={() => setActiveTab('scent')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'scent'
                      ? isDark
                        ? 'bg-[#ede9df] text-[#141414] shadow-sm'
                        : 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                      : isDark
                        ? 'text-[#ede9df]/70 hover:text-white'
                        : 'text-[#141414]/70 hover:text-[#141414]'
                  }`}
                >
                  {lang === 'vi' ? 'Hương Thơm' : 'Scent'}
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'materials'
                      ? isDark
                        ? 'bg-[#ede9df] text-[#141414] shadow-sm'
                        : 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                      : isDark
                        ? 'text-[#ede9df]/70 hover:text-white'
                        : 'text-[#141414]/70 hover:text-[#141414]'
                  }`}
                >
                  {lang === 'vi' ? 'Chủng Loại' : 'Specs'}
                </button>
              </div>

              {/* Tab Content Panels */}
              {activeTab === 'story' && (
                <div className="space-y-3.5 animate-fadeIn text-xs sm:text-sm">
                  <p className={`font-sans leading-relaxed ${isDark ? 'text-[#ede9df]/90' : 'text-[#141414]/90'}`}>
                    {lang === 'vi' ? flower.storyVi : flower.storyEn}
                  </p>
                  <p
                    className={`font-sans italic border-l-2 pl-3 py-0.5 ${
                      isDark
                        ? 'text-[#ede9df]/70 border-white/30'
                        : 'text-[#141414]/70 border-[#141414]/30'
                    }`}
                  >
                    {lang === 'vi' ? flower.shortDescriptionVi : flower.shortDescriptionEn}
                  </p>
                </div>
              )}

              {activeTab === 'scent' && (
                <div
                  className={`p-3.5 rounded-xl border space-y-2.5 animate-fadeIn text-xs ${
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/70 border-[#141414]/10'
                  }`}
                >
                  <div className={`flex items-center justify-between font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#141414]'}`}>
                    <span>{lang === 'vi' ? 'Tháp Tầng Hương' : 'Olfactory Pyramid'}</span>
                    <span
                      className={`font-mono px-2 py-0.5 rounded text-[11px] ${
                        isDark
                          ? 'text-amber-300 bg-amber-400/15'
                          : 'text-amber-800 bg-amber-50'
                      }`}
                    >
                      {flower.scent.intensity}/5 {lang === 'vi' ? 'Độ Lan Tỏa' : 'Diffusion'}
                    </span>
                  </div>
                  <div className={`space-y-1.5 ${isDark ? 'text-[#ede9df]/85' : 'text-[#141414]/85'}`}>
                    <div className={`p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-[#141414]'}`}>{lang === 'vi' ? 'Hương Đầu (Top):' : 'Top:'}</span>
                      <span>{flower.scent.top}</span>
                    </div>
                    <div className={`p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-[#141414]'}`}>{lang === 'vi' ? 'Hương Giữa (Heart):' : 'Heart:'}</span>
                      <span>{flower.scent.heart}</span>
                    </div>
                    <div className={`p-2 rounded ${isDark ? 'bg-white/5' : 'bg-white/60'}`}>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-[#141414]'}`}>{lang === 'vi' ? 'Hương Cuối (Base):' : 'Base:'}</span>
                      <span>{flower.scent.base}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3 animate-fadeIn text-xs">
                  <div>
                    <h4
                      className={`font-mono uppercase tracking-widest mb-1.5 text-[11px] ${
                        isDark ? 'text-[#ede9df]/60' : 'text-[#141414]/60'
                      }`}
                    >
                      {lang === 'vi' ? 'HOA NHẬP KHẨU & PHỤ KIỆN CAO CẤP' : 'CURATED BOTANICAL STEMS'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'vi' ? flower.materialsVi : flower.materials).map((mat, i) => (
                        <span
                          key={i}
                          className={`px-2.5 py-1 border rounded-md font-medium ${
                            isDark
                              ? 'bg-white/10 border-white/15 text-[#ede9df]'
                              : 'bg-white/80 border-[#141414]/15 text-[#141414]'
                          }`}
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className={`p-2.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
                      <span className={`block font-mono text-[10px] uppercase ${isDark ? 'text-[#ede9df]/60' : 'text-[#141414]/60'}`}>
                        {lang === 'vi' ? 'Kích Thước' : 'Dimensions'}
                      </span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-[#141414]'}`}>{flower.dimensions}</span>
                    </div>
                    <div className={`p-2.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-white/50'}`}>
                      <span className={`block font-mono text-[10px] uppercase ${isDark ? 'text-[#ede9df]/60' : 'text-[#141414]/60'}`}>
                        {lang === 'vi' ? 'Thời Điểm Hoa Tươi' : 'Seasonality'}
                      </span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-[#141414]'}`}>{flower.seasonality}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order & Pricing Callout Card (Sticky on mobile for effortless thumb reach) */}
              <div
                className={`sticky bottom-0 z-20 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xl border backdrop-blur-xl ${
                  isDark
                    ? 'bg-[#20221e]/95 text-[#ede9df] border-white/15'
                    : 'bg-[#dcd8cf]/95 text-[#141414] border-[#141414]/15'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono uppercase block ${isDark ? 'text-white/60' : 'text-[#141414]/65'}`}>
                    {lang === 'vi' ? 'Giá Ước Tính Thiết Kế' : 'Estimated Investment'}
                  </span>
                  <div className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${isDark ? 'text-white' : 'text-[#141414]'}`}>
                    {(flower.priceVnd || 0).toLocaleString('vi-VN')} VND
                    <span className={`text-xs font-normal ml-1.5 hidden sm:inline ${isDark ? 'text-white/60' : 'text-[#141414]/65'}`}>
                      (~${flower.priceUsd || 0} USD)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOrderFlower(flower);
                  }}
                  className={`min-h-[44px] px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg whitespace-nowrap ${
                    isDark
                      ? 'bg-[#dcd8cf] text-[#141414] hover:bg-white'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Đặt Mẫu Này' : 'Order Specimen'}</span>
                </button>
              </div>

              {/* Smart Alternative Recommendations (Especially helpful when out of season or pre-order) */}
              {(() => {
                const alternatives = getSmartAlternativeFlowers(flower, flowers, 3);
                if (alternatives.length === 0) return null;
                return (
                  <div
                    className={`p-3.5 rounded-2xl border space-y-2.5 ${
                      flower.availabilityStatus === 'seasonal_out'
                        ? isDark
                          ? 'bg-amber-400/10 border-amber-400/35'
                          : 'bg-amber-500/10 border-amber-700/30'
                        : isDark
                          ? 'bg-white/5 border-white/10'
                          : 'bg-white/55 border-[#141414]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                      <span>
                        {flower.availabilityStatus === 'seasonal_out'
                          ? lang === 'vi'
                            ? '✦ MẪU ĐANG TẠM HẾT MÙA — GỢI Ý MẪU TƯƠNG ĐỒNG SẴN HOA HÔM NAY:'
                            : '✦ SEASONAL OUT — READY-TODAY SIMILAR SPECIMENS:'
                          : lang === 'vi'
                            ? '✦ GỢI Ý TÁC PHẨM CÙNG CẢM XÚC SẴN HOA TRONG NGÀY:'
                            : '✦ SIMILAR SPECIMENS AVAILABLE TODAY:'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {alternatives.map((alt) => (
                        <button
                          key={alt.flower.id}
                          type="button"
                          onClick={() => {
                            onClose();
                            onOrderFlower(alt.flower);
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isDark
                              ? 'bg-black/40 border-white/15 hover:border-amber-400'
                              : 'bg-white/85 border-[#141414]/15 hover:border-[#141414]'
                          }`}
                        >
                          <img
                            src={alt.flower.image}
                            alt={alt.flower.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-emerald-500 font-bold block">
                              ● {alt.matchScore}% tương đồng
                            </span>
                            <span className="text-xs font-bold truncate block">
                              {alt.flower.name}
                            </span>
                            <span className="text-[10px] font-mono opacity-75 block">
                              {(alt.flower.priceVnd || 0).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox with Interactive Zoom & Pan */}
      {isLightboxOpen && (
        <div
          className={`fixed inset-0 z-60 flex flex-col items-center justify-center p-4 animate-fadeIn select-none ${
            isDark ? 'bg-black/95 text-white' : 'bg-[#dcd8cf]/98 text-[#141414]'
          }`}
        >
          {/* Top Zoom & Close Controls */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-20 max-w-4xl mx-auto">
            <div
              className={`flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-full border text-xs font-mono ${
                isDark
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'bg-[#141414] border-[#141414] text-[#dcd8cf]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setLightboxZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)));
                  if (lightboxZoom <= 1.5) setLightboxPan({ x: 0, y: 0 });
                }}
                className="p-1 hover:text-amber-300 transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="min-w-[44px] text-center font-bold text-amber-300">
                {Math.round(lightboxZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))}
                className="p-1 hover:text-amber-300 transition-colors"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {lightboxZoom > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setLightboxZoom(1);
                    setLightboxPan({ x: 0, y: 0 });
                  }}
                  className="p-1 hover:text-amber-300 transition-colors border-l border-white/20 pl-2"
                  title="Đặt lại 100%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className={`p-2.5 rounded-full transition-colors border ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  : 'bg-[#141414] hover:bg-black text-[#dcd8cf] border-[#141414]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            onPointerDown={(e) => {
              if (lightboxZoom <= 1) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              setIsPanningLightbox(true);
              panStartRef.current = {
                x: e.clientX,
                y: e.clientY,
                panX: lightboxPan.x,
                panY: lightboxPan.y
              };
            }}
            onPointerMove={(e) => {
              if (!isPanningLightbox || !panStartRef.current) return;
              const dx = e.clientX - panStartRef.current.x;
              const dy = e.clientY - panStartRef.current.y;
              setLightboxPan({
                x: panStartRef.current.panX + dx,
                y: panStartRef.current.panY + dy
              });
            }}
            onPointerUp={(e) => {
              if (isPanningLightbox) {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setIsPanningLightbox(false);
                panStartRef.current = null;
              }
            }}
            onDoubleClick={() => {
              if (lightboxZoom > 1) {
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
              } else {
                setLightboxZoom(2);
              }
            }}
            ref={lightboxContainerRef}
            className={`relative w-full max-w-4xl h-[75vh] rounded-2xl overflow-hidden shadow-2xl border flex items-center justify-center touch-none ${
              isDark ? 'bg-black/60 border-white/10' : 'bg-[#dcd8cf] border-[#141414]/15'
            } ${
              lightboxZoom > 1 ? (isPanningLightbox ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
          >
            <img
              src={currentImage.url}
              alt={currentImage.captionEn}
              referrerPolicy="no-referrer"
              style={{
                transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxZoom})`,
                transition: isPanningLightbox ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
            />
            <button
              onClick={(e) => {
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
                handlePrevImage(e);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/15"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                setLightboxZoom(1);
                setLightboxPan({ x: 0, y: 0 });
                handleNextImage(e);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/15"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 text-center text-sm font-sans space-y-0.5">
            <p className="font-semibold">{lang === 'vi' ? currentImage.captionVi : currentImage.captionEn}</p>
            <p className="text-xs font-mono opacity-60">
              {safeImageIndex + 1} / {gallery.length}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
