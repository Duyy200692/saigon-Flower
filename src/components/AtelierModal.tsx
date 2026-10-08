import React from 'react';
import { X, MapPin, PhoneCall, Mail, Instagram, Globe, Clock, Sparkles, Navigation, Facebook, MessageCircle } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';

interface AtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenOrder: () => void;
}

export const AtelierModal: React.FC<AtelierModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onOpenOrder
}) => {
  const { atelierData } = useAtelier();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const cardClass = isDark
    ? 'p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5'
    : 'p-4 bg-white/60 rounded-2xl border border-[#141414]/10 space-y-1.5';

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-black/80' : 'bg-[#dcd8cf]/90'
      }`}
    >
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors duration-300 ${
          isDark
            ? 'bg-[#151614] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/30'
        }`}
      >
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
          <div className={`border-b pb-4 pr-10 ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}>
            <span className={`text-[10px] font-mono tracking-widest uppercase block mb-1 ${isDark ? 'text-amber-300/80' : 'text-[#141414]/60'}`}>
              HAUTE COUTURE BOTANICAL STUDIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-fleur-title uppercase tracking-wider">
              {atelierData.name || 'JU ET SAIGON'}
            </h2>
            <p className={`text-sm font-editorial-serif italic mt-1 ${isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/80'}`}>
              "{atelierData.tagline || 'Flower your heart, Flower your soul.'}"
            </p>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
            {/* Address */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <MapPin className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-[#141414]'}`} />
                <span>{lang === 'vi' ? 'Địa Chỉ Studio' : 'Atelier Address'}</span>
              </div>
              <p className={`font-sans ${isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/80'}`}>
                {lang === 'vi' ? atelierData.addressVi : atelierData.addressEn}
              </p>
              <a
                href="https://maps.google.com/?q=31+Nguyen+Trai+Ben+Thanh+District+1+Ho+Chi+Minh"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:opacity-75 pt-1 ${
                  isDark ? 'text-amber-300' : 'text-[#141414]'
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>{lang === 'vi' ? 'Mở Google Maps' : 'Open in Google Maps'}</span>
              </a>
            </div>

            {/* Hours */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Clock className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-[#141414]'}`} />
                <span>{lang === 'vi' ? 'Giờ Mở Cửa' : 'Hours'}</span>
              </div>
              <p className={`font-sans ${isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/80'}`}>
                {lang === 'vi' ? atelierData.hoursVi : atelierData.hoursEn}
              </p>
              <p className={`text-[11px] italic font-serif-editorial ${isDark ? 'text-[#ede9df]/60' : 'text-[#141414]/60'}`}>
                {lang === 'vi' ? atelierData.consultationNoticeVi : atelierData.consultationNoticeEn}
              </p>
            </div>

            {/* Phone & Hotline */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <PhoneCall className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-[#141414]'}`} />
                <span>{lang === 'vi' ? 'Hotline & Liên Hệ' : 'Hotline & Direct Call'}</span>
              </div>
              <a
                href={`tel:${atelierData.phone?.replace(/\s+/g, '')}`}
                className="text-sm font-bold font-mono hover:underline block"
              >
                {atelierData.phoneFormatted || atelierData.phone}
              </a>
              <span className={`text-[11px] ${isDark ? 'text-[#ede9df]/60' : 'text-[#141414]/60'}`}>
                {lang === 'vi' ? 'Tư vấn trực tiếp 24/7' : 'Available 24/7 for urgent consultations'}
              </span>
            </div>

            {/* Email & Digital Channels */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Globe className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-[#141414]'}`} />
                <span>{lang === 'vi' ? 'Kênh Trực Tuyến & Mạng Xã Hội' : 'Digital & Social Channels'}</span>
              </div>
              <div className="space-y-1.5">
                <a
                  href={`mailto:${atelierData.email}`}
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{atelierData.email}</span>
                </a>
                {atelierData.instagramUrl && (
                  <a
                    href={atelierData.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{atelierData.instagram || 'juetsaigon'}</span>
                  </a>
                )}
                {atelierData.facebookUrl && (
                  <a
                    href={atelierData.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    <span>{atelierData.facebookName || 'Facebook Fanpage'}</span>
                  </a>
                )}
                {atelierData.zaloUrl && (
                  <a
                    href={atelierData.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <MessageCircle className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
                    <span>Zalo Official / Nhóm CSKH</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className={`pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}>
            <button
              onClick={() => {
                onClose();
                onOpenOrder();
              }}
              className={`w-full sm:w-auto min-h-[44px] px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                isDark
                  ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2e2d2a]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-600' : 'text-amber-300'}`} />
              <span>{lang === 'vi' ? 'Đặt Lịch Hẹn Tại Atelier' : 'Schedule Atelier Visit'}</span>
            </button>

            <a
              href={`tel:${atelierData.phone?.replace(/\s+/g, '')}`}
              className="text-xs font-bold uppercase tracking-wider hover:underline"
            >
              {lang === 'vi' ? `Gọi Ngay: ${atelierData.phoneFormatted || atelierData.phone}` : `Call ${atelierData.phoneFormatted || atelierData.phone}`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
