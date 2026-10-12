import React from 'react';
import { FlowerItem } from '../data/flowers';
import { Sparkles, ArrowRight, Eye, Volume2 } from 'lucide-react';
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
  const handleItemClick = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    onInspectFlower(flower);
  };

  return (
    <section
      id="botanical-monographs"
      className="w-full bg-[#26282a] text-[#f2efe9] py-24 sm:py-32 my-16 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-32 sm:space-y-40">
        
        {flowers.map((flower, idx) => {
          // Alternating rhythm matching Image 1:
          // Even (0, 2, 4): Text Left, Image Right
          // Odd (1, 3, 5): Image Left, Text Right
          const isTextLeft = idx % 2 === 0;

          return (
            <article
              key={flower.id}
              id={flower.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center group cursor-pointer"
              onClick={() => handleItemClick(flower)}
            >
              
              {/* Text Block */}
              <div
                className={`space-y-4 sm:space-y-6 ${
                  isTextLeft
                    ? 'md:col-span-5 md:order-1'
                    : 'md:col-span-5 md:order-2 md:pl-4'
                }`}
              >
                {/* Title in Bagerich Font matching Image 1 */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bagerich font-normal uppercase tracking-tight text-white leading-[0.92] group-hover:text-amber-200 transition-colors">
                  {flower.name}
                </h2>

                {/* Narrative Description matching Image 1 */}
                <p className="text-xs sm:text-sm font-sans text-[#d0cdca] leading-relaxed max-w-md">
                  {lang === 'vi' ? flower.storyVi : flower.storyEn}
                </p>

                {/* Subtitle / Specimen kicker */}
                <div className="pt-2 flex items-center gap-3 text-xs font-mono text-white/50 tracking-wider uppercase">
                  <span>SPECIMEN #{flower.indexNumber}</span>
                  <span>·</span>
                  <span className="text-amber-300 group-hover:underline">
                    {lang === 'vi' ? 'Xem chi tiết & 4 ảnh (3:4) →' : 'Click to inspect (3:4) →'}
                  </span>
                </div>
              </div>

              {/* Monumental 3:4 Image Block matching Image 1 */}
              <div
                className={`w-full ${
                  isTextLeft
                    ? 'md:col-span-7 md:order-2'
                    : 'md:col-span-7 md:order-1'
                }`}
              >
                <div className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-none overflow-hidden bg-[#18191a] shadow-2xl transition-transform duration-500 group-hover:scale-102">
                  <img
                    src={flower.image}
                    alt={flower.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                    loading="lazy"
                  />

                  {/* Subtle dark vignette on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                  {/* Corner Index Tag */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white tracking-widest uppercase">
                    #{flower.indexNumber}
                  </div>
                </div>
              </div>

            </article>
          );
        })}

      </div>
    </section>
  );
};
