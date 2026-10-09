import React from 'react';
import { X, Heart, Trash2, Sparkles, Eye, Compass } from 'lucide-react';
import { FlowerItem } from '../data/flowers';
import { useAtelier } from '../context/AtelierContext';

interface MoodboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onSelectFlower: (flower: FlowerItem) => void;
  onOrderFlower: (flower: FlowerItem) => void;
  onConsultMoodboard: () => void;
  onOpenSommelier?: () => void;
}

export const MoodboardModal: React.FC<MoodboardModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onSelectFlower,
  onOrderFlower,
  onConsultMoodboard,
  onOpenSommelier
}) => {
  const { flowers, wishlistIds, toggleWishlist, clearWishlist } = useAtelier();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const savedFlowers = flowers.filter((f) => wishlistIds.includes(f.id));

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden backdrop-blur-2xl flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-black/85' : 'bg-[#dcd8cf]/90'
      }`}
    >
      <div
        className={`relative w-full max-w-4xl rounded-[28px] sm:rounded-[38px] shadow-2xl border overflow-hidden my-auto max-h-[94vh] flex flex-col transition-colors duration-300 ${
          isDark
            ? 'bg-[#141513] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 sm:px-8 py-4 border-b flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-white/15 bg-[#181917]' : 'border-[#141414]/15 bg-[#dcd8cf]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest block ${
                  isDark ? 'text-amber-300' : 'text-amber-900 font-bold'
                }`}
              >
                PERSONAL BOTANICAL MOODBOARD · {savedFlowers.length} SPECIMENS
              </span>
              <h2 className="text-base sm:text-xl font-bagerich uppercase tracking-wide truncate">
                {lang === 'vi'
                  ? 'BỘ SƯU TẬP YÊU THÍCH & SO SÁNH MẪU HOA'
                  : 'CURATED WISHLIST & SPECIMEN COMPARISON'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedFlowers.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-1 transition-colors ${
                  isDark
                    ? 'border-white/15 text-white/70 hover:text-rose-300 hover:border-rose-400/40'
                    : 'border-[#141414]/15 text-[#141414]/70 hover:text-rose-700'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'vi' ? 'Xóa Tất Cả' : 'Clear All'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-[#141414]/10 hover:bg-[#141414]/20 text-[#141414]'
              }`}
              aria-label="Close Moodboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 overflow-y-auto no-scrollbar overscroll-contain flex-1">
          {savedFlowers.length === 0 ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-fleur-title uppercase">
                {lang === 'vi'
                  ? 'CHƯA CÓ TÁC PHẨM NÀO TRONG MOODBOARD'
                  : 'YOUR BOTANICAL MOODBOARD IS EMPTY'}
              </h3>
              <p className="text-xs opacity-75 leading-relaxed">
                {lang === 'vi'
                  ? 'Hãy bấm vào biểu tượng trái tim trên các tác phẩm hoa bạn yêu thích để lưu lại, so sánh tầng hương và gửi cho Nghệ nhân tư vấn cùng lúc.'
                  : 'Tap the heart icon on any floral specimen to curate your personal moodboard, compare olfactory notes, and request a tailored consultation.'}
              </p>
              {onOpenSommelier && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSommelier();
                  }}
                  className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg ${
                    isDark
                      ? 'bg-amber-400 text-[#141414] hover:bg-amber-300'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Mở Trợ Lý Chọn Hoa Sommelier' : 'Try Flower Sommelier'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedFlowers.map((flower) => (
                  <div
                    key={flower.id}
                    className={`rounded-2xl p-3.5 border flex flex-col justify-between gap-3 transition-all ${
                      isDark
                        ? 'bg-[#1c1d1a] border-white/15'
                        : 'bg-white/80 border-[#141414]/15'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden ${
                          isDark ? 'bg-black' : 'bg-[#dcd8cf]'
                        }`}
                      >
                        <img
                          src={flower.image}
                          alt={flower.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono">
                          #{flower.indexNumber}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(flower.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                          title={lang === 'vi' ? 'Bỏ lưu' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase opacity-65">
                          {lang === 'vi' ? flower.categoryLabelVi : flower.categoryLabelEn}
                        </span>
                        <h4 className="font-bagerich text-base uppercase truncate mt-0.5">
                          {flower.name}
                        </h4>
                        <p className="text-xs opacity-75 truncate">{flower.vietnameseName}</p>
                      </div>

                      {/* Side-by-side comparison specs */}
                      <div
                        className={`p-2.5 rounded-xl text-[11px] space-y-1 border ${
                          isDark ? 'bg-black/40 border-white/10' : 'bg-[#e8e4dc] border-[#141414]/10'
                        }`}
                      >
                        <div className="flex justify-between gap-2">
                          <span className="opacity-60">{lang === 'vi' ? 'Cảm xúc hương:' : 'Mood:'}</span>
                          <span className="font-medium text-right truncate">{flower.scent.mood}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="opacity-60">{lang === 'vi' ? 'Kích thước:' : 'Size:'}</span>
                          <span className="font-mono">{flower.dimensions}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="opacity-60">{lang === 'vi' ? 'Mùa hoa:' : 'Season:'}</span>
                          <span className="truncate">{flower.seasonality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-current/10">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="opacity-65">{lang === 'vi' ? 'Giá ước tính:' : 'Price:'}</span>
                        <span className="font-bold tabular-nums">
                          {flower.priceVnd.toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectFlower(flower);
                          }}
                          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl border text-[11px] font-mono uppercase flex items-center justify-center gap-1 ${
                            isDark
                              ? 'border-white/20 hover:bg-white/10 text-white'
                              : 'border-[#141414]/20 hover:bg-white text-[#141414]'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'vi' ? 'Chi Tiết' : 'View'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOrderFlower(flower);
                          }}
                          className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase flex items-center justify-center gap-1 ${
                            isDark
                              ? 'bg-white/15 hover:bg-white/25 text-white'
                              : 'bg-[#141414] hover:bg-black text-[#dcd8cf]'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{lang === 'vi' ? 'Đặt Riêng' : 'Order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer CTA when items exist */}
        {savedFlowers.length > 0 && (
          <div
            className={`px-5 sm:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 ${
              isDark ? 'bg-[#181917] border-white/15' : 'bg-[#dcd8cf] border-[#141414]/15'
            }`}
          >
            <div className="text-xs">
              <span className="font-semibold">
                {lang === 'vi'
                  ? `Đã chọn ${savedFlowers.length} tác phẩm trong Moodboard cá nhân`
                  : `${savedFlowers.length} specimens curated in your Moodboard`}
              </span>
              <p className="text-[11px] opacity-70">
                {lang === 'vi'
                  ? 'Gửi toàn bộ danh sách này để Nghệ nhân tư vấn phối hoa cho bạn.'
                  : 'Send your entire moodboard to our florists for bespoke consultation.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onConsultMoodboard();
              }}
              className={`w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                isDark
                  ? 'bg-amber-400 text-[#141414] hover:bg-amber-300'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'vi'
                  ? `Tư Vấn Đặt Hoa Theo Moodboard (${savedFlowers.length})`
                  : `Consult With Moodboard (${savedFlowers.length})`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
