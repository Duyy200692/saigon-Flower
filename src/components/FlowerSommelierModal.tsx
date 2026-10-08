import React, { useState, useMemo } from 'react';
import { X, Sparkles, Heart, ArrowRight, RotateCcw, Compass, Eye } from 'lucide-react';
import { FlowerItem } from '../data/flowers';
import { useAtelier } from '../context/AtelierContext';

interface FlowerSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onSelectFlower: (flower: FlowerItem) => void;
  onOrderFlower: (flower: FlowerItem) => void;
}

const OCCASION_OPTIONS = [
  {
    id: 'bridal',
    titleVi: 'Lễ Cưới & Kỷ Niệm Tình Yêu',
    titleEn: 'Bridal & Romantic Milestone',
    descVi: 'Cầm tay cô dâu, lễ đính hôn hoặc kỷ niệm ngày cưới thanh khiết.',
    descEn: 'Bridal couture bouquets, engagements, and intimate anniversaries.',
    keywords: ['bridal', 'peony', 'lily', 'anemone', 'rose', 'cưới', 'tinh khôi']
  },
  {
    id: 'sculptural',
    titleVi: 'Kiến Trúc Không Gian & Triển Lãm',
    titleEn: 'Architectural & Sculptural Space',
    descVi: 'Điểm nhấn nghệ thuật đương đại cho sảnh lớn, penthouse hoặc studio.',
    descEn: 'Avant-garde botanical installations for penthouses and galleries.',
    keywords: ['sculptural', 'ikebana', 'orchid', 'protea', 'calla', 'điêu khắc']
  },
  {
    id: 'rare-stems',
    titleVi: 'Quà Tặng Đối Tác & Tuyệt Tác Quý Hiếm',
    titleEn: 'VIP Gifting & Rare Botanicals',
    descVi: 'Những giống hoa nhập khẩu quý hiếm dành tặng người trân quý.',
    descEn: 'Collector-grade imported stems for distinguished recipients.',
    keywords: ['rare-stems', 'tulip', 'ranunculus', 'gloriosa', 'quý hiếm', 'nhập khẩu']
  },
  {
    id: 'seasonal',
    titleVi: 'Chữa Lành Tâm Hồn & Thư Thái Mỗi Ngày',
    titleEn: 'Mindful Sanctuary & Seasonal Bloom',
    descVi: 'Mang hơi thở thiên nhiên theo mùa vào không gian sống cá nhân.',
    descEn: 'Restorative seasonal arrangements for daily serenity.',
    keywords: ['seasonal', 'hydrangea', 'freesia', 'sweet pea', 'mùa', 'thư thái']
  }
];

const PALETTE_OPTIONS = [
  {
    id: 'ivory',
    titleVi: 'Trắng Tinh Khôi & Kem Ngà',
    titleEn: 'Pure Ivory & Alabaster White',
    descVi: 'Thanh tao, tối giản, hương sương sớm và trà trắng nhẹ nhàng.',
    descEn: 'Minimalist purity with dewy white tea and muguet notes.',
    swatch: '#F5F3EE',
    keywords: ['trắng', 'white', 'kem', 'ivory', 'thanh khiết', 'lily', 'anemone', 'calla']
  },
  {
    id: 'blush',
    titleVi: 'Hồng Phấn & Lãng Mạn Cổ Điển',
    titleEn: 'Blush Silk & Vintage Romance',
    descVi: 'Ngọt ngào, nữ tính với nốt hương mẫu đơn, hồng cổ điển Pháp.',
    descEn: 'Soft poetic blush with damask rose and blooming peony.',
    swatch: '#E8C5C8',
    keywords: ['hồng', 'pink', 'blush', 'rose', 'peony', 'mẫu đơn', 'ngọt ngào', 'lãng mạn']
  },
  {
    id: 'crimson',
    titleVi: 'Đỏ Rượu Vang & Nồng Nàn Quyến Rũ',
    titleEn: 'Burgundy Velvet & Deep Passion',
    descVi: 'Sâu lắng, quyền lực với hương gỗ ấm, hổ phách và nhung đỏ.',
    descEn: 'Dramatic depth with warm amber, velvet petals, and spice.',
    swatch: '#6E1E2A',
    keywords: ['đỏ', 'red', 'burgundy', 'rượu', 'trầm', 'quyến rũ', 'cổ điển']
  },
  {
    id: 'botanical',
    titleVi: 'Xanh Rêu, Vàng Nắng & Tự Nhiên',
    titleEn: 'Botanical Moss & Sunlit Ochre',
    descVi: 'Phóng khoáng, nghệ thuật như một khu vườn nguyên bản.',
    descEn: 'Organic garden movement with crisp green stems and citrus.',
    swatch: '#7A8B68',
    keywords: ['xanh', 'green', 'vàng', 'cam', 'tự nhiên', 'gỗ', 'rừng', 'thanh mát']
  }
];

const BUDGET_OPTIONS = [
  {
    id: 'refined',
    titleVi: 'Tinh Tế (Từ 2.0M – 3.5M VND)',
    titleEn: 'Refined Petite (2.0M – 3.5M VND)',
    min: 0,
    max: 3600000
  },
  {
    id: 'couture',
    titleVi: 'Haute Couture (Từ 3.5M – 5.5M VND)',
    titleEn: 'Haute Couture (3.5M – 5.5M VND)',
    min: 3400000,
    max: 5600000
  },
  {
    id: 'statement',
    titleVi: 'Độc Bản Triển Lãm (Trên 5.0M VND)',
    titleEn: 'Grand Statement (5.0M+ VND)',
    min: 4800000,
    max: 99999999
  },
  {
    id: 'all',
    titleVi: 'Mọi Ngân Sách (Ưu Tiên Độ Hợp Gu)',
    titleEn: 'All Tiers (Prioritize Aesthetic Match)',
    min: 0,
    max: 99999999
  }
];

export const FlowerSommelierModal: React.FC<FlowerSommelierModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onSelectFlower,
  onOrderFlower
}) => {
  const { flowers, toggleWishlist, isInWishlist } = useAtelier();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('bridal');
  const [selectedPalette, setSelectedPalette] = useState<string>('ivory');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  const recommendations = useMemo(() => {
    const occObj = OCCASION_OPTIONS.find((o) => o.id === selectedOccasion) || OCCASION_OPTIONS[0];
    const palObj = PALETTE_OPTIONS.find((p) => p.id === selectedPalette) || PALETTE_OPTIONS[0];
    const budObj = BUDGET_OPTIONS.find((b) => b.id === selectedBudget) || BUDGET_OPTIONS[3];

    const scored = flowers.map((flower) => {
      let score = 68;
      const reasonVi: string[] = [];
      const reasonEn: string[] = [];

      // 1. Category / Occasion match
      if (flower.category === occObj.id) {
        score += 16;
        reasonVi.push(`Thuộc dòng ${flower.categoryLabelVi}`);
        reasonEn.push(`Curated in ${flower.categoryLabelEn}`);
      } else {
        const textBlob = `${flower.name} ${flower.vietnameseName} ${flower.storyVi} ${flower.shortDescriptionVi}`.toLowerCase();
        if (occObj.keywords.some((kw) => textBlob.includes(kw))) {
          score += 10;
          reasonVi.push('Đồng điệu với dịp & không gian bạn chọn');
          reasonEn.push('Harmonizes with your selected occasion');
        }
      }

      // 2. Palette & Scent match
      const scentAndStory = `${flower.storyVi} ${flower.storyEn} ${flower.scent.top} ${flower.scent.heart} ${flower.scent.base} ${flower.scent.mood} ${flower.materialsVi.join(' ')}`.toLowerCase();
      const matchedPaletteKw = palObj.keywords.filter((kw) => scentAndStory.includes(kw));
      if (matchedPaletteKw.length > 0) {
        score += Math.min(12, matchedPaletteKw.length * 5);
        reasonVi.push(`Nốt hương "${flower.scent.mood}" hợp gu thẩm mỹ`);
        reasonEn.push(`Olfactory mood "${flower.scent.mood}" matches palette`);
      }

      // 3. Budget match
      if (flower.priceVnd >= budObj.min && flower.priceVnd <= budObj.max) {
        score += 6;
        reasonVi.push('Phù hợp mức ngân sách dự kiến');
        reasonEn.push('Within your preferred investment range');
      }

      const finalScore = Math.min(99, score);
      return {
        flower,
        score: finalScore,
        reasonTextVi:
          reasonVi.length > 0
            ? reasonVi.join(' · ')
            : `Tác phẩm điêu khắc nổi bật với tầng hương ${flower.scent.heart}`,
        reasonTextEn:
          reasonEn.length > 0
            ? reasonEn.join(' · ')
            : `Signature botanical creation with ${flower.scent.heart}`
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [flowers, selectedOccasion, selectedPalette, selectedBudget]);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl rounded-[28px] sm:rounded-[38px] shadow-2xl border overflow-hidden my-auto max-h-[94vh] flex flex-col transition-colors duration-300 ${
          isDark
            ? 'bg-[#141513] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-white/60'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`px-5 sm:px-8 py-4 border-b flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-white/15 bg-[#181917]' : 'border-[#141414]/15 bg-[#e6e2da]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-[#141414] text-amber-300'
              }`}
            >
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span
                className={`text-[10px] font-mono uppercase tracking-widest block ${
                  isDark ? 'text-amber-300' : 'text-amber-900 font-bold'
                }`}
              >
                THE FLOWER SOMMELIER · CỐ VẤN THỰC VẬT HỌC
              </span>
              <h2 className="text-base sm:text-xl font-bagerich uppercase tracking-wide truncate">
                {lang === 'vi'
                  ? 'TƯ VẤN CHỌN HOA THEO CẢM XÚC & NỐT HƯƠNG'
                  : 'BESPOKE BOTANICAL & OLFACTORY ADVISOR'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-[#141414]/10 hover:bg-[#141414]/20 text-[#141414]'
            }`}
            aria-label="Close Sommelier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div
          className={`px-5 sm:px-8 py-2.5 border-b flex items-center justify-between text-[11px] font-mono ${
            isDark ? 'bg-black/30 border-white/10 text-white/60' : 'bg-white/40 border-[#141414]/10 text-[#141414]/70'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`${step === 1 ? (isDark ? 'text-amber-300 font-bold' : 'text-[#141414] font-bold') : ''}`}
            >
              01. {lang === 'vi' ? 'Dịp & Không Gian' : 'Occasion'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`${step === 2 ? (isDark ? 'text-amber-300 font-bold' : 'text-[#141414] font-bold') : ''}`}
            >
              02. {lang === 'vi' ? 'Sắc Độ & Hương' : 'Palette & Scent'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`${step === 3 ? (isDark ? 'text-amber-300 font-bold' : 'text-[#141414] font-bold') : ''}`}
            >
              03. {lang === 'vi' ? 'Ngân Sách' : 'Investment'}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setStep(4)}
              className={`${step === 4 ? (isDark ? 'text-amber-300 font-bold' : 'text-[#141414] font-bold') : ''}`}
            >
              04. {lang === 'vi' ? 'Tuyệt Tác Đề Xuất' : 'Curated Match'}
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                  {lang === 'vi' ? 'BƯỚC 1 / 3' : 'STEP 1 OF 3'}
                </span>
                <h3 className="text-xl sm:text-2xl font-fleur-title uppercase mt-1">
                  {lang === 'vi'
                    ? 'BẠN ĐANG TÌM KIẾM TÁC PHẨM HOA CHO DỊP NÀO?'
                    : 'WHAT MOMENT OR SPACE ARE WE CURATING FOR?'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {OCCASION_OPTIONS.map((opt) => {
                  const isSelected = selectedOccasion === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedOccasion(opt.id);
                        setStep(2);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg'
                            : 'bg-[#141414] border-[#141414] text-[#dcd8cf] shadow-lg'
                          : isDark
                            ? 'bg-white/5 border-white/15 hover:border-white/40 text-[#ede9df]'
                            : 'bg-white/70 border-[#141414]/15 hover:border-[#141414] text-[#141414]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm sm:text-base">
                          {lang === 'vi' ? opt.titleVi : opt.titleEn}
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0 opacity-70" />
                      </div>
                      <p className="text-xs opacity-75 leading-relaxed">
                        {lang === 'vi' ? opt.descVi : opt.descEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                  {lang === 'vi' ? 'BƯỚC 2 / 3' : 'STEP 2 OF 3'}
                </span>
                <h3 className="text-xl sm:text-2xl font-fleur-title uppercase mt-1">
                  {lang === 'vi'
                    ? 'SẮC ĐỘ MÀU & TẦNG HƯƠNG BẠN YÊU THÍCH?'
                    : 'WHICH COLOR PALETTE & OLFACTORY MOOD RESONATES WITH YOU?'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PALETTE_OPTIONS.map((opt) => {
                  const isSelected = selectedPalette === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedPalette(opt.id);
                        setStep(3);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg'
                            : 'bg-[#141414] border-[#141414] text-[#dcd8cf] shadow-lg'
                          : isDark
                            ? 'bg-white/5 border-white/15 hover:border-white/40 text-[#ede9df]'
                            : 'bg-white/70 border-[#141414]/15 hover:border-[#141414] text-[#141414]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full border border-black/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: opt.swatch }}
                        />
                        <span className="font-bold text-sm sm:text-base flex-1">
                          {lang === 'vi' ? opt.titleVi : opt.titleEn}
                        </span>
                      </div>
                      <p className="text-xs opacity-75 leading-relaxed">
                        {lang === 'vi' ? opt.descVi : opt.descEn}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono uppercase underline underline-offset-4 opacity-70 hover:opacity-100"
                >
                  ← {lang === 'vi' ? 'Quay lại Bước 1' : 'Back to Step 1'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                  {lang === 'vi' ? 'BƯỚC 3 / 3' : 'STEP 3 OF 3'}
                </span>
                <h3 className="text-xl sm:text-2xl font-fleur-title uppercase mt-1">
                  {lang === 'vi'
                    ? 'MỨC NGÂN SÁCH ĐẦU TƯ DỰ KIẾN CỦA BẠN?'
                    : 'SELECT YOUR PREFERRED INVESTMENT TIER'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = selectedBudget === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedBudget(opt.id);
                        setStep(4);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? isDark
                            ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg'
                            : 'bg-[#141414] border-[#141414] text-[#dcd8cf] shadow-lg'
                          : isDark
                            ? 'bg-white/5 border-white/15 hover:border-white/40 text-[#ede9df]'
                            : 'bg-white/70 border-[#141414]/15 hover:border-[#141414] text-[#141414]'
                      }`}
                    >
                      <span className="font-bold text-sm">
                        {lang === 'vi' ? opt.titleVi : opt.titleEn}
                      </span>
                      <Sparkles className="w-4 h-4 shrink-0 opacity-75" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-mono uppercase underline underline-offset-4 opacity-70 hover:opacity-100"
                >
                  ← {lang === 'vi' ? 'Quay lại Bước 2' : 'Back to Step 2'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-current/15">
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest block ${
                      isDark ? 'text-amber-300' : 'text-amber-900 font-bold'
                    }`}
                  >
                    {lang === 'vi'
                      ? 'KẾT QUẢ TUYỂN CHỌN BỞI FLOWER SOMMELIER'
                      : 'BESPOKE CURATION RESULTS'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-fleur-title uppercase">
                    {lang === 'vi'
                      ? '3 TUYỆT TÁC ĐỒNG ĐIỆU NHẤT VỚI BẠN'
                      : 'TOP 3 SPECIMENS MATCHING YOUR SENSORY PROFILE'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className={`self-start sm:self-auto px-3.5 py-1.5 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'border-white/20 hover:bg-white/10 text-white'
                      : 'border-[#141414]/20 hover:bg-white text-[#141414]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Chọn Lại Gu Hoa' : 'Retake Quiz'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map(({ flower, score, reasonTextVi, reasonTextEn }, idx) => {
                  const saved = isInWishlist(flower.id);
                  return (
                    <div
                      key={flower.id}
                      className={`rounded-2xl p-3.5 border flex flex-col justify-between gap-3 transition-all ${
                        isDark
                          ? 'bg-[#1c1d1a] border-white/15 hover:border-amber-400/50'
                          : 'bg-white/80 border-[#141414]/15 hover:border-[#141414]'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-black">
                          <img
                            src={flower.image}
                            alt={flower.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/75 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                            {idx === 0 ? '★ BEST MATCH' : `#0${idx + 1}`} · {score}%
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(flower.id)}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                              saved
                                ? 'bg-rose-500 text-white shadow-md'
                                : 'bg-black/60 text-white hover:bg-black'
                            }`}
                            title={lang === 'vi' ? 'Lưu vào Moodboard' : 'Save to Moodboard'}
                          >
                            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono opacity-60 uppercase">
                            #{flower.indexNumber} · {flower.seasonality}
                          </span>
                          <h4 className="font-bagerich text-base uppercase tracking-wide mt-0.5 truncate">
                            {flower.name}
                          </h4>
                          <p className="text-xs opacity-75 truncate">{flower.vietnameseName}</p>
                        </div>

                        <p
                          className={`text-[11px] leading-relaxed p-2.5 rounded-xl border ${
                            isDark
                              ? 'bg-black/40 border-white/10 text-amber-200/90'
                              : 'bg-[#e8e4dc] border-[#141414]/10 text-[#141414]/85'
                          }`}
                        >
                          {lang === 'vi' ? reasonTextVi : reasonTextEn}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-current/10">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="opacity-65">{lang === 'vi' ? 'Giá thiết kế:' : 'Price:'}</span>
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
                            className={`min-h-[38px] px-2.5 py-1.5 rounded-xl border text-[11px] font-mono uppercase flex items-center justify-center gap-1 transition-colors ${
                              isDark
                                ? 'border-white/20 hover:bg-white/10 text-white'
                                : 'border-[#141414]/20 hover:bg-white text-[#141414]'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{lang === 'vi' ? 'Chi Tiết' : 'Inspect'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOrderFlower(flower);
                            }}
                            className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase flex items-center justify-center gap-1 transition-colors ${
                              isDark
                                ? 'bg-amber-400 text-[#141414] hover:bg-amber-300'
                                : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
