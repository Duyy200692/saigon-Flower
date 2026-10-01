import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Sparkles,
  Share2,
  Check,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(2480);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset slide index when opening a new workshop
  useEffect(() => {
    setCurrentSlide(0);
    setIsCaptionExpanded(false);
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

  // Double tap to like
  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    setShowHeartPop(true);
    soundEngine.playFlowerChime(720);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  const handleToggleLike = () => {
    setIsLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      if (next) soundEngine.playFlowerChime(640);
      return next;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${workshop.titleVi} · JU et Saigon`,
        text: workshop.editorialQuoteVi,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      {/* Instagram Card Container */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-[#121212] text-[#f5f5f5] rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto flex flex-col font-sans">
        
        {/* Instagram Header Bar */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#121212] z-20">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300">
              <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                <span className="text-xs font-bold text-amber-300 font-mono">JU</span>
              </div>
            </div>

            {/* Handle & Verified Badge */}
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs font-bold text-white tracking-wide">juetsaigon</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#0095F6] flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </span>
                <span className="text-[11px] text-white/50">•</span>
                <span className="text-[11px] text-[#0095F6] font-semibold cursor-pointer hover:underline">
                  {lang === 'vi' ? 'Theo dõi' : 'Follow'}
                </span>
              </div>
              <p className="text-[10px] text-white/60 font-mono mt-0.5">
                JU et Saigon · Botanical Atelier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Instagram viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instagram Media Stage (Swipeable Photo Carousel) */}
        <div
          className={`relative w-full overflow-hidden bg-black flex items-center justify-center select-none ${
            isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleTap}
        >
          {/* Main Photo */}
          <img
            key={activeImage.url + currentSlide}
            src={activeImage.url}
            alt={activeImage.captionVi}
            onLoad={handleImageLoad}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300 animate-fadeIn"
          />

          {/* Instagram Heart Pop Animation on Double Tap */}
          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl opacity-90" />
            </div>
          )}

          {/* Left Arrow Button */}
          {totalSlides > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white/90 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Right Arrow Button */}
          {totalSlides > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white/90 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Instagram Slide Counter Badge (e.g. 1/4) */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-medium text-white/90">
            {currentSlide + 1}/{totalSlides}
          </div>
        </div>

        {/* Instagram Action Bar & Dot Indicators */}
        <div className="p-3.5 space-y-2.5 bg-[#121212]">
          
          <div className="flex items-center justify-between">
            {/* Left Icons: Heart, Comment, Share */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleLike}
                className="transition-transform active:scale-125 hover:opacity-80"
                aria-label="Like photo"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                  }`}
                />
              </button>

              <a
                href={workshop.zaloCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="Tham gia cộng đồng Zalo"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </a>

              <button
                onClick={handleShare}
                className="hover:opacity-80 transition-opacity text-white"
                title="Chia sẻ"
              >
                {isCopied ? <Check className="w-6 h-6 text-emerald-400" /> : <Send className="w-6 h-6" />}
              </button>
            </div>

            {/* Center Carousel Dot Indicators (• • • •) */}
            {totalSlides > 1 && (
              <div className="flex items-center gap-1.5">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-full transition-all ${
                      currentSlide === idx
                        ? 'w-2 h-2 bg-[#0095F6] scale-110 shadow-sm'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Right: Bookmark Save Icon */}
            <button
              onClick={() => setIsSaved((s) => !s)}
              className="hover:opacity-80 transition-opacity"
              aria-label="Save post"
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  isSaved ? 'text-white fill-white' : 'text-white'
                }`}
              />
            </button>
          </div>

          {/* Likes Counter */}
          <div className="text-xs font-bold text-white tracking-wide">
            {likesCount.toLocaleString('vi-VN')} {lang === 'vi' ? 'lượt thích' : 'likes'}
          </div>

          {/* Clean Instagram Caption */}
          <div className="text-xs text-white/90 leading-relaxed font-normal">
            <span className="font-bold text-white mr-1.5">juetsaigon</span>
            <span>
              {isCaptionExpanded
                ? workshop.fullContentVi.join(' ')
                : workshop.editorialQuoteVi}
            </span>

            {workshop.fullContentVi && workshop.fullContentVi.length > 1 && (
              <button
                onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                className="text-white/50 text-[11px] font-medium ml-1.5 hover:text-white"
              >
                {isCaptionExpanded ? (lang === 'vi' ? 'thu gọn' : 'less') : (lang === 'vi' ? '...thêm' : '...more')}
              </button>
            )}
          </div>

          {/* Direct Fast Action Link */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/50">📍 31 Nguyễn Trãi, Q.1</span>
            <a
              href={workshop.zaloCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0095F6] font-bold hover:underline flex items-center gap-1"
            >
              <span>Zalo Bloom Daily</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
