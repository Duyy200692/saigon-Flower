import React, { useState } from 'react';
import { X, Volume2, Sparkles, MapPin, Check, Heart, Shield, Droplets, Wind, Sun } from 'lucide-react';
import { FlowerItem } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface FlowerDetailModalProps {
  flower: FlowerItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  onOrderFlower: (flower: FlowerItem) => void;
}

export const FlowerDetailModal: React.FC<FlowerDetailModalProps> = ({
  flower,
  isOpen,
  onClose,
  lang,
  onOrderFlower
}) => {
  const [selectedAnatomy, setSelectedAnatomy] = useState<string | null>(null);

  if (!isOpen || !flower) return null;

  const handlePlayChime = () => {
    soundEngine.playFlowerChime(flower.audioFrequency);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#dcd8cf] text-[#141414] rounded-xl shadow-2xl border border-[#141414]/30 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          
          {/* Header */}
          <div className="border-b border-[#141414]/15 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#141414]/60 mb-1">
              <span>SPECIMEN #{flower.indexNumber}</span>
              <span>·</span>
              <span>{lang === 'vi' ? flower.categoryLabelVi : flower.categoryLabelEn}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-fleur-title uppercase tracking-tight text-[#141414]">
              {flower.name}
            </h2>
            <p className="text-base sm:text-lg font-editorial-serif italic text-[#141414]/80 mt-1">
              {flower.latinName} — {flower.vietnameseName}
            </p>
          </div>

          {/* Media & Anatomy Interactive View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left/Top: Image with Interactive Anatomy Pins */}
            <div className="md:col-span-6 relative aspect-[3/4] bg-[#141414] rounded-lg overflow-hidden shadow-xl">
              <img
                src={flower.image}
                alt={flower.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Anatomy Hotspots */}
              {flower.anatomy.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setSelectedAnatomy(selectedAnatomy === pin.id ? null : pin.id)}
                  style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                  aria-label={pin.titleEn}
                >
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-black/90 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-lg">
                      +
                    </span>
                  </span>
                </button>
              ))}

              {/* Active Anatomy Tooltip overlay */}
              {selectedAnatomy && (
                <div className="absolute bottom-4 inset-x-4 p-3 bg-black/90 text-white text-xs rounded-lg backdrop-blur-md shadow-2xl border border-white/20 animate-fadeIn z-20">
                  {(() => {
                    const pin = flower.anatomy.find((p) => p.id === selectedAnatomy);
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

              {/* Sound trigger on image */}
              <button
                onClick={handlePlayChime}
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono flex items-center gap-1.5 hover:bg-black transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{flower.audioFrequency} Hz Tone</span>
              </button>
            </div>

            {/* Right/Bottom: Deep Dive Details */}
            <div className="md:col-span-6 space-y-6">
              
              {/* Narrative Story */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#141414]/60 mb-2">
                  {lang === 'vi' ? 'HỒ SƠ THỰC VẬT & NGHỆ THUẬT' : 'BOTANICAL MONOGRAPH'}
                </h3>
                <p className="text-sm sm:text-base font-sans leading-relaxed text-[#141414]/90">
                  {lang === 'vi' ? flower.storyVi : flower.storyEn}
                </p>
              </div>

              {/* Olfactory Scent Breakdown */}
              <div className="p-4 bg-white/50 rounded-lg border border-[#141414]/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#141414]">
                  <span>{lang === 'vi' ? 'Tầng Hương Nước Hoa' : 'Olfactory Pyramid'}</span>
                  <span className="text-[11px] font-mono text-[#141414]/60">
                    {flower.scent.intensity}/5 {lang === 'vi' ? 'Độ Tỏa' : 'Diffusion'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-[#141414]/80">
                  <p><span className="font-semibold">{lang === 'vi' ? 'Hương Đầu:' : 'Top:'}</span> {flower.scent.top}</p>
                  <p><span className="font-semibold">{lang === 'vi' ? 'Hương Giữa:' : 'Heart:'}</span> {flower.scent.heart}</p>
                  <p><span className="font-semibold">{lang === 'vi' ? 'Hương Cuối:' : 'Base:'}</span> {flower.scent.base}</p>
                </div>
              </div>

              {/* Materials & Stems Used */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#141414]/60 mb-2">
                  {lang === 'vi' ? 'CHỦNG LOẠI HOA & VẬT LIỆU CAO CẤP' : 'CURATED STEMS & COUTURE MATERIALS'}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'vi' ? flower.materialsVi : flower.materials).map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white/70 border border-[#141414]/15 rounded text-[11px] font-medium text-[#141414]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#141414]/10 pt-4">
                <div>
                  <span className="text-[#141414]/60 block font-mono text-[10px] uppercase">
                    {lang === 'vi' ? 'Kích Thước Thiết Kế' : 'Dimensions'}
                  </span>
                  <span className="font-semibold text-[#141414]">{flower.dimensions}</span>
                </div>
                <div>
                  <span className="text-[#141414]/60 block font-mono text-[10px] uppercase">
                    {lang === 'vi' ? 'Thời Điểm Mùa' : 'Seasonality'}
                  </span>
                  <span className="font-semibold text-[#141414]">{flower.seasonality}</span>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-4 bg-[#141414] text-[#dcd8cf] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-white/60 uppercase block">
                    {lang === 'vi' ? 'Giá Ước Tính Cho Thiết Kế Này' : 'Estimated Bespoke Investment'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono">
                    {flower.priceVnd.toLocaleString('vi-VN')} VND
                    <span className="text-xs font-normal text-white/70 ml-2">(~${flower.priceUsd} USD)</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOrderFlower(flower);
                  }}
                  className="px-6 py-3 rounded-full bg-[#dcd8cf] text-[#141414] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center justify-center gap-1.5 shadow-lg whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-[#141414]" />
                  <span>{lang === 'vi' ? 'Đặt Lịch Tư Vấn Mẫu Này' : 'Consult for This Design'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
