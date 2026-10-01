import React from 'react';
import { X, MapPin, PhoneCall, Mail, Instagram, Globe, Clock, Sparkles, Navigation, Heart } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';

interface AtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  onOpenOrder: () => void;
}

export const AtelierModal: React.FC<AtelierModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#dcd8cf] text-[#141414] rounded-xl shadow-2xl border border-[#141414]/30 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          aria-label="Close atelier modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          
          {/* Header */}
          <div className="border-b border-[#141414]/15 pb-4">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#141414]/60 block mb-1">
              HAUTE COUTURE BOTANICAL STUDIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-fleur-title uppercase tracking-tight text-[#141414]">
              JU ET SAIGON ATELIER
            </h2>
            <p className="text-base font-editorial-serif italic text-[#141414]/80 mt-1">
              "Flower your heart, Flower your soul."
            </p>
          </div>

          {/* Studio Story & Manifesto */}
          <div className="space-y-4 text-xs sm:text-sm font-sans text-[#141414]/90 leading-relaxed">
            <p>
              {lang === 'vi'
                ? 'Tọa lạc tại không gian yên tĩnh trên Lầu 1, số 31 Nguyễn Trãi, Quận 1 - trung tâm nhộn nhịp của Sài Gòn, JU et Saigon là nơi hội tụ của tình yêu hoa nghệ thuật và kỹ nghệ cắm hoa đương đại. Chúng tôi tin rằng mỗi đóa hoa đều mang trong mình một linh hồn và câu chuyện riêng biệt, truyền tải rung động cảm xúc từ trái tim đến trái tim.'
                : 'Nestled on the 1st Floor of 31 Nguyen Trai Street in District 1 — the vibrant cultural core of Ho Chi Minh City — JU et Saigon is a sanctuary for contemporary botanical couture. We believe that each flower carries its own living soul and resonant frequency, translating deep emotions into timeless sculptural elegance.'}
            </p>
          </div>

          {/* Atelier Contact & Visiting Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Address */}
            <div className="p-4 bg-white/60 rounded-lg border border-[#141414]/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                <MapPin className="w-4 h-4 text-[#141414]" />
                <span>{lang === 'vi' ? 'Địa Chỉ Studio' : 'Atelier Address'}</span>
              </div>
              <p className="text-[#141414]/80 font-sans">
                {lang === 'vi' ? ATELIER_DATA.addressVi : ATELIER_DATA.addressEn}
              </p>
              <a
                href="https://maps.google.com/?q=31+Nguyen+Trai+Ben+Thanh+District+1+Ho+Chi+Minh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline underline-offset-4 text-[#141414] hover:opacity-75 pt-1"
              >
                <Navigation className="w-3 h-3" />
                <span>{lang === 'vi' ? 'Mở Google Maps' : 'Open in Google Maps'}</span>
              </a>
            </div>

            {/* Hours */}
            <div className="p-4 bg-white/60 rounded-lg border border-[#141414]/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                <Clock className="w-4 h-4 text-[#141414]" />
                <span>{lang === 'vi' ? 'Giờ Mở Cửa' : 'Hours'}</span>
              </div>
              <p className="text-[#141414]/80 font-sans">
                {lang === 'vi' ? ATELIER_DATA.hoursVi : ATELIER_DATA.hoursEn}
              </p>
              <p className="text-[11px] text-[#141414]/60 italic font-serif-editorial">
                {lang === 'vi' ? ATELIER_DATA.consultationNoticeVi : ATELIER_DATA.consultationNoticeEn}
              </p>
            </div>

            {/* Phone & Hotline */}
            <div className="p-4 bg-white/60 rounded-lg border border-[#141414]/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                <PhoneCall className="w-4 h-4 text-[#141414]" />
                <span>{lang === 'vi' ? 'Hotline & Zalo' : 'Hotline & Direct Call'}</span>
              </div>
              <a
                href={`tel:${ATELIER_DATA.phone.replace(/\s+/g, '')}`}
                className="text-sm font-bold font-mono text-[#141414] hover:underline block"
              >
                {ATELIER_DATA.phoneFormatted}
              </a>
              <span className="text-[11px] text-[#141414]/60">
                {lang === 'vi' ? 'Tư vấn trực tiếp 24/7' : 'Available 24/7 for urgent consultations'}
              </span>
            </div>

            {/* Email & Digital Channels */}
            <div className="p-4 bg-white/60 rounded-lg border border-[#141414]/10 space-y-1.5">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                <Globe className="w-4 h-4 text-[#141414]" />
                <span>{lang === 'vi' ? 'Kênh Trực Tuyến' : 'Digital Atelier'}</span>
              </div>
              <div className="space-y-1">
                <a
                  href={`mailto:${ATELIER_DATA.email}`}
                  className="flex items-center gap-1.5 text-[#141414] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{ATELIER_DATA.email}</span>
                </a>
                <a
                  href={ATELIER_DATA.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#141414] hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{ATELIER_DATA.instagram}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#141414]/15">
            <button
              onClick={() => {
                onClose();
                onOpenOrder();
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#141414] text-[#dcd8cf] text-xs font-bold tracking-widest uppercase hover:bg-[#2e2d2a] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{lang === 'vi' ? 'Đặt Lịch Hẹn Tại Atelier' : 'Schedule Atelier Visit'}</span>
            </button>

            <a
              href={`tel:${ATELIER_DATA.phone.replace(/\s+/g, '')}`}
              className="text-xs font-bold uppercase tracking-wider text-[#141414] hover:underline"
            >
              {lang === 'vi' ? `Gọi Ngay: ${ATELIER_DATA.phoneFormatted}` : `Call ${ATELIER_DATA.phoneFormatted}`}
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
