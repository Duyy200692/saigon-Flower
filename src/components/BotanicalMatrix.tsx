import React from 'react';
import { FlowerItem } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface BotanicalMatrixProps {
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onSelectFlower: (flower: FlowerItem) => void;
}

export const BotanicalMatrix: React.FC<BotanicalMatrixProps> = ({
  flowers,
  lang,
  onSelectFlower
}) => {
  const handleTileClick = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    onSelectFlower(flower);
  };

  return (
    <section id="gallery-matrix" className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
      {/* 3-column mosaic grid matching Image 1 */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-[#141414] p-1 sm:p-2 shadow-2xl">
        {flowers.map((flower, idx) => (
          <div
            key={flower.id}
            onClick={() => handleTileClick(flower)}
            className="group relative aspect-[3/4] overflow-hidden bg-[#1f1e1c] cursor-pointer"
          >
            {/* Image */}
            <img
              src={flower.image}
              alt={flower.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108 filter grayscale-[15%] group-hover:grayscale-0"
              loading={idx < 6 ? 'eager' : 'lazy'}
            />

            {/* Hover overlay with minimal typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3 text-white">
              <span className="text-[9px] tracking-widest text-white/70 font-mono">
                #{flower.indexNumber}
              </span>
              <p className="text-[10px] sm:text-xs font-serif-editorial font-bold uppercase tracking-wider line-clamp-1">
                {flower.name}
              </p>
              <p className="text-[9px] sm:text-[10px] text-white/80 font-light truncate">
                {lang === 'vi' ? flower.vietnameseName : flower.shortDescriptionEn}
              </p>
            </div>

            {/* Subtle index tag top-left */}
            <div className="absolute top-1.5 left-1.5 px-1 py-0.5 bg-black/40 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono text-white/80 tracking-tighter opacity-70 group-hover:opacity-0 transition-opacity">
              {flower.indexNumber}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
