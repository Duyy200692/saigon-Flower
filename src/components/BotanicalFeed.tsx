import React from 'react';
import { FlowerItem } from '../data/flowers';
import { Volume2, Sparkles, Eye, Info, Check, Share2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BotanicalFeedProps {
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onInspectFlower: (flower: FlowerItem) => void;
  onOrderFlower: (flower: FlowerItem) => void;
}

export const BotanicalFeed: React.FC<BotanicalFeedProps> = ({
  flowers,
  lang,
  onInspectFlower,
  onOrderFlower
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handlePlayChime = (frequency: number) => {
    soundEngine.playFlowerChime(frequency);
  };

  const handleShare = (flower: FlowerItem) => {
    if (navigator.share) {
      navigator.share({
        title: `${flower.name} · JU et Saigon`,
        text: lang === 'vi' ? flower.vietnameseName : flower.shortDescriptionEn,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/#${flower.id}`);
      setCopiedId(flower.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="botanical-monographs" className="max-w-2xl mx-auto px-4 sm:px-6 space-y-24 my-20">
      {flowers.map((flower) => (
        <article
          key={flower.id}
          id={flower.id}
          className="scroll-mt-24 flex flex-col items-center text-left border-b border-[#141414]/15 pb-20 last:border-b-0"
        >
          {/* Giant Portrait Photo matching Image 1 */}
          <div className="w-full relative group overflow-hidden bg-[#1f1e1c] shadow-2xl">
            <div className="aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden">
              <img
                src={flower.image}
                alt={flower.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Quick interactive utility badge overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => handlePlayChime(flower.audioFrequency)}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors"
                title="Play harmonic tone"
                aria-label="Play harmonic tone"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onInspectFlower(flower)}
                className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider hover:bg-black transition-colors flex items-center gap-1.5"
                title="Inspect Anatomy"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Giải Phẫu' : 'Anatomy'}</span>
              </button>
            </div>

            {/* Index label bottom-left */}
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-md text-white font-mono text-xs tracking-widest uppercase">
              SPECIMEN #{flower.indexNumber} · {flower.category.toUpperCase()}
            </div>
          </div>

          {/* Monumental Display Title matching THE FLEUR uppercase custom styling */}
          <div className="w-full mt-8 mb-4">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-fleur-title font-normal tracking-tight text-[#141414] uppercase leading-none">
              {flower.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-[#141414]/70 font-editorial-serif italic">
              <span>{flower.latinName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans font-medium">{flower.vietnameseName}</span>
            </div>
          </div>

          {/* Deep Narrative Prose matching Image 1 cadence */}
          <div className="w-full space-y-4 text-sm sm:text-base font-sans text-[#141414]/90 leading-relaxed">
            <p>
              {lang === 'vi' ? flower.storyVi : flower.storyEn}
            </p>

            {/* Botanical Composition & Scent Breakdown */}
            <div className="pt-4 border-t border-[#141414]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="bg-[#141414]/5 p-3 rounded-lg border border-[#141414]/10">
                <span className="font-bold tracking-wider uppercase text-[#141414] block mb-1">
                  {lang === 'vi' ? 'Hương Thơm Độc Bản:' : 'Olfactory Profile:'}
                </span>
                <p className="text-[#141414]/80">
                  <span className="font-semibold">{flower.scent.mood}</span> (Độ tỏa hương: {flower.scent.intensity}/5)
                </p>
                <p className="text-[#141414]/70 mt-1 italic font-serif-editorial">
                  {flower.scent.top} → {flower.scent.heart} → {flower.scent.base}
                </p>
              </div>

              <div className="bg-[#141414]/5 p-3 rounded-lg border border-[#141414]/10">
                <span className="font-bold tracking-wider uppercase text-[#141414] block mb-1">
                  {lang === 'vi' ? 'Quy Cách & Ước Tính:' : 'Curation & Spec:'}
                </span>
                <p className="text-[#141414]/80 font-mono">
                  {flower.dimensions} · {flower.seasonality}
                </p>
                <p className="text-[#141414] font-bold mt-1 text-sm">
                  {flower.priceVnd.toLocaleString('vi-VN')} VND <span className="text-xs font-normal text-[#141414]/60">(~${flower.priceUsd} USD)</span>
                </p>
              </div>
            </div>

            {/* Actions for this flower */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOrderFlower(flower)}
                  className="px-5 py-2.5 rounded-full bg-[#141414] text-[#dcd8cf] text-xs font-bold tracking-wider uppercase hover:bg-[#2c2a27] transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Đặt Thiết Kế Mẫu Này' : 'Order This Creation'}</span>
                </button>

                <button
                  onClick={() => onInspectFlower(flower)}
                  className="px-4 py-2.5 rounded-full border border-[#141414]/30 hover:border-[#141414] text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Xem Chi Tiết' : 'Deep Dive'}</span>
                </button>
              </div>

              <button
                onClick={() => handleShare(flower)}
                className="p-2.5 rounded-full border border-[#141414]/20 hover:border-[#141414] text-[#141414] transition-colors"
                title="Share this flower"
              >
                {copiedId === flower.id ? (
                  <Check className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};
