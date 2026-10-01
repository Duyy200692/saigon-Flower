import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { FlowerItem, BOTANICAL_CATEGORIES } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface IndexSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onSelectFlower: (flower: FlowerItem) => void;
}

export const IndexSlideOver: React.FC<IndexSlideOverProps> = ({
  isOpen,
  onClose,
  flowers,
  lang,
  onSelectFlower
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFlowers = useMemo(() => {
    return flowers.filter((flower) => {
      const matchCategory = activeCategory === 'all' || flower.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        flower.name.toLowerCase().includes(q) ||
        flower.vietnameseName.toLowerCase().includes(q) ||
        flower.latinName.toLowerCase().includes(q) ||
        flower.materials.some((m) => m.toLowerCase().includes(q)) ||
        flower.materialsVi.some((m) => m.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [flowers, activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleItemClick = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    onSelectFlower(flower);
    onClose();
    
    // Smooth scroll to the monograph element
    const el = document.getElementById(flower.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#dcd8cf] text-[#141414] border-l border-[#141414]/20 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#141414]/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/60 block">
                ATELIER CATALOGUE
              </span>
              <h3 className="text-xl font-fleur-title font-bold uppercase tracking-wider">
                INDEX BOTANICA
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#141414]/10 transition-colors"
              aria-label="Close index"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-[#141414]/10 bg-[#dcd8cf]/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#141414]/50" />
              <input
                type="text"
                placeholder={lang === 'vi' ? 'Tìm theo tên hoa, mùi hương, nguyên liệu...' : 'Search species, scent, stems...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/70 border border-[#141414]/20 rounded-lg text-xs font-sans placeholder-[#141414]/40 focus:outline-none focus:border-[#141414] transition-colors"
              />
            </div>

            {/* Category Filter Pills (Functional interactive buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
              {BOTANICAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#141414] text-[#dcd8cf] shadow-sm'
                      : 'bg-white/40 text-[#141414]/70 hover:bg-white/80'
                  }`}
                >
                  {lang === 'vi' ? cat.labelVi : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Flowers List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredFlowers.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#141414]/60 font-serif-editorial italic">
                {lang === 'vi' ? 'Không tìm thấy tác phẩm phù hợp' : 'No botanical specimens found'}
              </div>
            ) : (
              filteredFlowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => handleItemClick(flower)}
                  className="group p-3 rounded-lg border border-[#141414]/10 hover:border-[#141414] bg-white/40 hover:bg-white/90 transition-all cursor-pointer flex items-center gap-3.5"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-[#141414]">
                    <img
                      src={flower.image}
                      alt={flower.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#141414]/50">
                        #{flower.indexNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#141414]/70 truncate">
                        {flower.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif-editorial font-bold text-[#141414] uppercase tracking-wide truncate">
                      {flower.name}
                    </h4>
                    <p className="text-xs text-[#141414]/70 truncate">
                      {lang === 'vi' ? flower.vietnameseName : flower.latinName}
                    </p>
                  </div>

                  {/* Price & Jump */}
                  <div className="text-right flex-shrink-0 flex items-center gap-1">
                    <span className="text-[11px] font-bold font-mono text-[#141414]">
                      {(flower.priceVnd / 1000000).toFixed(1)}M
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#141414]/40 group-hover:text-[#141414] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer of Drawer */}
          <div className="p-4 border-t border-[#141414]/15 bg-[#dcd8cf] text-center text-xs font-mono text-[#141414]/70">
            {lang === 'vi' 
              ? `Hiển thị ${filteredFlowers.length} / ${flowers.length} Tác Phẩm · JU et Saigon`
              : `Showing ${filteredFlowers.length} of ${flowers.length} Specimens · JU et Saigon`}
          </div>

        </div>
      </div>
    </div>
  );
};
