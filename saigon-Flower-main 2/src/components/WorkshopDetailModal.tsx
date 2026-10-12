import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { WorkshopItem } from '../data/workshop';
import { useAtelier, WorkshopBooking } from '../context/AtelierContext';
import { useTrackpadGallery } from '../hooks/useTrackpadGallery';

interface WorkshopDetailModalProps {
  workshop: WorkshopItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
}

export const WorkshopDetailModal: React.FC<WorkshopDetailModalProps> = ({
  workshop,
  isOpen,
  onClose,
  lang,
  theme = 'light'
}) => {
  const { createWorkshopBooking, atelierData } = useAtelier();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const isDark = theme === 'dark';

  // Booking form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [participantsCount, setParticipantsCount] = useState(10);
  const [preferredDate, setPreferredDate] = useState('');
  const [locationType, setLocationType] = useState('Tại Atelier JU et Saigon (31 Nguyễn Trãi, Q.1)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<WorkshopBooking | null>(null);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const validGallery = Array.isArray(workshop?.galleryImages)
    ? workshop.galleryImages.filter((g) => g && typeof g.url === 'string' && g.url.trim().length > 0)
    : [];
  const gallery =
    validGallery.length > 0
      ? validGallery
      : [
          {
            url: workshop?.image || '',
            captionVi: workshop?.titleVi || 'Bó hoa nghệ thuật',
            captionEn: workshop?.titleEn || 'Artistic bouquet'
          }
        ];
  const totalSlides = Math.max(1, gallery.length);
  const safeSlide = currentSlide < gallery.length ? currentSlide : 0;
  const activeImage = gallery[safeSlide] || gallery[0] || {
    url: workshop?.image || '',
    captionVi: 'Bó hoa nghệ thuật',
    captionEn: 'Artistic bouquet'
  };

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // MacBook Trackpad 2-finger swipe navigation
  const {
    containerRef: wsTrackpadRef,
    dragOffset
  } = useTrackpadGallery<HTMLDivElement>({
    totalItems: totalSlides,
    currentIndex: safeSlide,
    onNext: handleNext,
    onPrev: handlePrev,
    threshold: 36,
    cooldownMs: 320,
    enabled: isOpen && !showBookingForm
  });

  useEffect(() => {
    setCurrentSlide(0);
    setShowBookingForm(false);
    setCreatedBooking(null);
  }, [workshop?.id, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showBookingForm) return;
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
  }, [isOpen, workshop, showBookingForm, handleNext, handlePrev, onClose]);

  if (!isOpen || !workshop) return null;

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const saved = await createWorkshopBooking({
        workshopId: workshop.id,
        workshopName: `${workshop.name} — ${workshop.titleVi}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        companyName: companyName.trim(),
        participantsCount: Number(participantsCount) || 1,
        preferredDate: preferredDate || 'Linh hoạt',
        locationType,
        notes: notes.trim()
      });
      setCreatedBooking(saved);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = isDark
    ? 'w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-[#ede9df] placeholder-white/40 focus:outline-none focus:border-amber-300 text-xs'
    : 'w-full px-3.5 py-2.5 bg-white/85 border border-[#141414]/20 rounded-xl text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:border-[#141414] text-xs';

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none overflow-y-auto ${
        isDark ? 'bg-black/92 text-white' : 'bg-[#dcd8cf]/95 text-[#141414]'
      }`}
    >
      {/* Top Floating Clean Bar */}
      <div
        className={`w-full max-w-4xl mx-auto flex items-center justify-between border-b pb-3 shrink-0 ${
          isDark ? 'border-white/10 text-white' : 'border-[#141414]/15 text-[#141414]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`text-xs font-mono tracking-widest uppercase font-semibold truncate ${
              isDark ? 'text-amber-300' : 'text-amber-900'
            }`}
          >
            #{workshop.indexNumber} · {workshop.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBookingForm(!showBookingForm)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all ${
              showBookingForm
                ? 'bg-amber-400 text-[#141414]'
                : isDark
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-black'
                  : 'bg-[#141414] text-amber-300 hover:bg-black'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {showBookingForm
                ? lang === 'vi'
                  ? 'Xem Ảnh Workshop'
                  : 'View Photos'
                : lang === 'vi'
                  ? 'Đăng Ký Lịch Workshop'
                  : 'Book Workshop'}
            </span>
          </button>

          <button
            onClick={onClose}
            className={`spring-press min-h-[38px] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-mono uppercase border backdrop-blur-xl ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                : 'bg-[#141414] hover:bg-[#2c2a27] text-[#dcd8cf] border-[#141414]'
            }`}
            aria-label="Close photo viewer"
          >
            <span>{lang === 'vi' ? 'Đóng' : 'Close'}</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="flex-1 flex items-center justify-center py-3 sm:py-4 relative my-auto w-full max-w-3xl mx-auto">
        {showBookingForm ? (
          <div
            className={`w-full rounded-[28px] p-5 sm:p-8 border shadow-2xl animate-fadeIn select-text ${
              isDark
                ? 'bg-[#161715] border-white/15 text-[#ede9df]'
                : 'bg-[#dcd8cf] border-[#141414]/15 text-[#141414]'
            }`}
          >
            {createdBooking ? (
              <div className="text-center space-y-5 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 font-mono text-xs font-bold">
                  MÃ ĐĂNG KÝ: {createdBooking.bookingCode}
                </span>
                <h3 className="text-2xl font-fleur-title uppercase">
                  {lang === 'vi'
                    ? 'ĐÃ GHI NHẬN ĐĂNG KÝ WORKSHOP'
                    : 'WORKSHOP REGISTRATION RECEIVED'}
                </h3>
                <p className="text-xs opacity-80 max-w-md mx-auto leading-relaxed">
                  {lang === 'vi'
                    ? `Cảm ơn ${createdBooking.customerName}! Thông tin đăng ký "${workshop.name}" (${createdBooking.participantsCount} khách) đã được lưu vào hệ thống Quản trị của ${atelierData.name}.`
                    : `Thank you ${createdBooking.customerName}! Your booking for "${workshop.name}" has been synced with our team.`}
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {workshop.zaloCommunityUrl && (
                    <a
                      href={workshop.zaloCommunityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[42px] px-5 py-2.5 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{lang === 'vi' ? 'Tham Gia Nhóm Zalo Workshop' : 'Join Zalo Group'}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="min-h-[42px] px-5 py-2.5 rounded-full border border-current/25 text-xs font-mono uppercase"
                  >
                    {lang === 'vi' ? 'Quay Lại Xem Ảnh' : 'Back to Gallery'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border-b border-current/10 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                    BOTANICAL WORKSHOP REGISTRATION · {workshop.duration}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-fleur-title uppercase mt-0.5">
                    {lang === 'vi' ? workshop.titleVi : workshop.titleEn}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">
                      {lang === 'vi' ? 'Họ và Tên Người Đăng Ký *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'Jane Doe'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">
                      {lang === 'vi' ? 'Số Điện Thoại (Zalo) *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="090 936 80 80"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">
                      {lang === 'vi' ? 'Tên Doanh Nghiệp / Nhóm (Nếu có)' : 'Company / Group Name'}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={lang === 'vi' ? 'VD: Công ty ABC / Nhóm bạn' : 'Optional'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-semibold flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 opacity-60" />
                      <span>{lang === 'vi' ? 'Số Lượng Học Viên (Pax)' : 'Participants (Pax)'}</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={participantsCount}
                      onChange={(e) => setParticipantsCount(Number(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">
                      {lang === 'vi' ? 'Ngày Tổ Chức Dự Kiến' : 'Preferred Date'}
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">
                      {lang === 'vi' ? 'Địa Điểm Tổ Chức' : 'Location Preference'}
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Tại Atelier JU et Saigon (31 Nguyễn Trãi, Q.1)" className="text-black">
                        Tại Atelier JU et Saigon (31 Nguyễn Trãi, Q.1)
                      </option>
                      <option value="Tận nơi tại Văn phòng / Sự kiện đối tác" className="text-black">
                        Tận nơi tại Văn phòng / Sự kiện đối tác
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    {lang === 'vi' ? 'Yêu cầu chủ đề màu sắc / Ghi chú thêm' : 'Special Requests'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      lang === 'vi'
                        ? 'Ví dụ: Tone màu thương hiệu công ty, cần xuất hóa đơn VAT...'
                        : 'Brand colors, invoice requirements...'
                    }
                    className={inputClass}
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto min-h-[44px] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg ${
                      isDark
                        ? 'bg-amber-400 text-[#141414] hover:bg-amber-300'
                        : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Đang Lưu...'
                        : lang === 'vi'
                          ? 'Xác Nhận Đăng Ký Workshop'
                          : 'Confirm Registration'}
                    </span>
                  </button>

                  {workshop.zaloCommunityUrl && (
                    <a
                      href={workshop.zaloCommunityUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Zalo Workshop</span>
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        ) : (
          <div
            ref={wsTrackpadRef}
            className={`relative w-full mx-auto rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-soft-3 border transition-all duration-300 flex items-center justify-center will-change-transform ${
              isDark ? 'bg-black border-white/20' : 'bg-[#dcd8cf] border-[#141414]/20'
            } ${
              isLandscape ? 'max-w-3xl aspect-[4/3]' : 'max-w-md sm:max-w-lg aspect-[3/4]'
            }`}
            style={{
              transform: dragOffset ? `translateX(${dragOffset}px)` : undefined,
              transition: dragOffset ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Ambient Blurred Backdrop for Uncropped Mode in Dark Theme */}
            {isDark && fitMode === 'contain' && (
              <img
                src={activeImage.url}
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45 pointer-events-none"
              />
            )}

            {/* Main High-Res Photo */}
            <img
              key={activeImage.url + safeSlide}
              src={activeImage.url}
              alt={activeImage.captionVi}
              onLoad={handleImageLoad}
              referrerPolicy="no-referrer"
              className={`relative z-10 w-full h-full transition-all duration-300 animate-fadeIn ${
                fitMode === 'contain'
                  ? 'object-contain p-2'
                  : 'object-cover object-center'
              }`}
            />

            {/* Fit / Fill Frame Toggle Button */}
            <button
              type="button"
              onClick={() => setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'))}
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full backdrop-blur-2xl bg-black/65 hover:bg-black/85 border border-white/20 text-[10px] font-mono uppercase tracking-widest text-white/95 flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {fitMode === 'cover' ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{lang === 'vi' ? 'Vừa Khung Gốc' : 'Fit Original'}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'vi' ? 'Lấp Đầy Khung' : 'Fill Frame'}</span>
                </>
              )}
            </button>

            {/* Left Arrow Button */}
            {totalSlides > 1 && (
              <button
                onClick={handlePrev}
                className="spring-press absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white/95 backdrop-blur-2xl border border-white/20 transition-all flex items-center justify-center shadow-soft-2 hover:scale-110 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Arrow Button */}
            {totalSlides > 1 && (
              <button
                onClick={handleNext}
                className="spring-press absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white/95 backdrop-blur-2xl border border-white/20 transition-all flex items-center justify-center shadow-soft-2 hover:scale-110 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Slide Index Badge Top Right */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-2xl bg-black/65 border border-white/20 text-xs font-mono text-white/90 tracking-widest shadow-md">
              {safeSlide + 1}/{totalSlides}
            </div>

            {/* Caption Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm font-sans text-white/95 truncate">
                {lang === 'vi' ? activeImage.captionVi : activeImage.captionEn}
              </p>
              <button
                type="button"
                onClick={() => setShowBookingForm(true)}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#141414] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Đăng Ký Ngay' : 'Book Now'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Dots */}
      {!showBookingForm && (
        <div className="w-full max-w-xl mx-auto space-y-1.5 text-center pt-1 shrink-0">
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2.5 py-1">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`rounded-full transition-all ${
                    safeSlide === idx
                      ? isDark
                        ? 'w-3 h-3 bg-amber-300 scale-110 shadow-sm'
                        : 'w-3 h-3 bg-[#141414] scale-110 shadow-sm'
                      : isDark
                        ? 'w-2 h-2 bg-white/30 hover:bg-white/60'
                        : 'w-2 h-2 bg-[#141414]/30 hover:bg-[#141414]/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
