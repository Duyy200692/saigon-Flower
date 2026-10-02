import React from 'react';
import { Menu, Volume2, VolumeX, Sparkles, PhoneCall } from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import { soundEngine } from '../utils/audio';

interface FloatingMobileBarProps {
  lang: 'vi' | 'en';
  setLang: (lang: 'vi' | 'en') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenIndex: () => void;
  onOpenOrder: () => void;
  onOpenWorkshop?: () => void;
  flowerCount: number;
}

export const FloatingMobileBar: React.FC<FloatingMobileBarProps> = ({
  lang,
  setLang,
  isAudioPlaying,
  onToggleAudio,
  onOpenIndex,
  onOpenOrder,
  flowerCount
}) => {
  const { atelierData } = useAtelier();

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 md:hidden">
      <div className="bg-[#141414]/95 text-[#dcd8cf] rounded-full px-3 py-2 shadow-2xl backdrop-blur-md border border-white/20 flex items-center justify-between">
        
        {/* Index Trigger */}
        <button
          onClick={() => {
            soundEngine.playFlowerChime(432);
            onOpenIndex();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono tracking-wider transition-colors"
        >
          <Menu className="w-3.5 h-3.5" />
          <span>INDEX ({flowerCount})</span>
        </button>

        {/* Ambient Audio Toggle */}
        <button
          onClick={() => {
            soundEngine.playFlowerChime(480);
            onToggleAudio();
          }}
          className={`p-2 rounded-full transition-colors ${
            isAudioPlaying ? 'bg-amber-400 text-[#141414]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title="Toggle Sound"
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 opacity-70" />}
        </button>

        {/* Quick Hotline Call */}
        {atelierData.phone && (
          <a
            href={`tel:${atelierData.phone.replace(/\s+/g, '')}`}
            className="p-2 rounded-full bg-white/10 text-amber-300 hover:bg-white/20 transition-colors"
            title="Hotline Atelier"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Lang Switch */}
        <button
          onClick={() => {
            soundEngine.playFlowerChime(640);
            setLang(lang === 'vi' ? 'en' : 'vi');
          }}
          className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold tracking-wider"
        >
          {lang.toUpperCase()}
        </button>

        {/* Order Consultation CTA */}
        <button
          onClick={() => {
            soundEngine.playFlowerChime(580);
            onOpenOrder();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#dcd8cf] text-[#141414] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-white transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Đặt Hoa' : 'Order'}</span>
        </button>

      </div>
    </div>
  );
};
