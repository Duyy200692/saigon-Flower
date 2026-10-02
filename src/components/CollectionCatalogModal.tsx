import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Pin, Sparkles, ChevronRight, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { FlowerItem, BOTANICAL_CATEGORIES, BOTANICAL_SEASONS } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface CollectionCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  onSelectFlower: (flower: FlowerItem) => void;
}

export const CollectionCatalogModal: React.FC<CollectionCatalogModalProps> = ({
  isOpen,
  onClose,
  flowers,
  lang,
  onSelectFlower
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Multi-tier filtering
  const filteredFlowers = useMemo(() => {
    return flowers.filter((flower) => {
      // 1. Category Filter
      const matchCategory =
        selectedCategory === 'all' ||
        flower.category === selectedCategory ||
        flower.categoryLabelEn.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        flower.categoryLabelVi.toLowerCase().includes(selectedCategory.toLowerCase());

      // 2. Season Filter
      let matchSeason = true;
      if (selectedSeason !== 'all') {
        const seasonLower = (flower.seasonality || '').toLowerCase();
        if (selectedSeason === 'spring') matchSeason = seasonLower.includes('spring') || seasonLower.includes('xuân');
        else if (selectedSeason === 'summer') matchSeason = seasonLower.includes('summer') || seasonLower.includes('hạ');
        else if (selectedSeason === 'autumn') matchSeason = seasonLower.includes('autumn') || seasonLower.includes('thu');
        else if (selectedSeason === 'winter') matchSeason = seasonLower.includes('winter') || seasonLower.includes('đông');
        else if (selectedSeason === 'year-round') matchSeason = seasonLower.includes('year-round') || seasonLower.includes('quanh năm');
      }

      // 3. Pinned filter
      const matchPinned = !showPinnedOnly || flower.pinnedToLanding !== false;

      // 4. Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        flower.name.toLowerCase().includes(q) ||
        flower.vietnameseName.toLowerCase().includes(q) ||
        flower.latinName.toLowerCase().includes(q) ||
        (flower.seasonality && flower.seasonality.toLowerCase().includes(q)) ||
        flower.materials.some((m) => m.toLowerCase().includes(q)) ||
        flower.materialsVi.some((m) => m.toLowerCase().includes(q)) ||
        flower.scent.mood.toLowerCase().includes(q);

      return matchCategory && matchSeason && matchPinned && matchSearch;
    });
  }, [flowers, selectedCategory, selectedSeason, showPinnedOnly, searchQuery]);

  if (!isOpen) return null;

  const handleFlowerClick = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    onSelectFlower(flower);
  };

  const handleCategoryChange = (catId: string) => {
    soundEngine.playFlowerChime(432);
    setSelectedCategory(catId);
  };

  const handleSeasonChange = (seasonId: string) => {
    soundEngine.playFlowerChime(528);
    setSelectedSeason(seasonId);
  };

  const pinnedCount = flowers.filter((f) => f.pinnedToLanding !== false).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn font-sans">
      
      {/* Top Header Bar with Frosted Glass & Squircle */}
      <header className="h-18 bg-[#181917]/90 backdrop-blur-2xl border-b border-white/15 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              JU ET SAIGON · ARCHIVE
            </span>
            <span className="text-xs text-white/50 font-mono hidden sm:inline-block">
              {flowers.length} Tác Phẩm Độc Bản · 12 Ghim Landing Page
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bagerich uppercase tracking-wider text-white mt-0.5">
            {lang === 'vi' ? 'BỘ SƯU TẬP HOA & MÙA (COLLECTION ARCHIVE)' : 'BOTANICAL COLLECTION & SEASONS'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'vi' ? 'Tìm hoa, mùa, nốt hương...' : 'Search species, season...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-black/40 border border-white/20 rounded-[20px] text-white text-xs font-mono placeholder-white/40 focus:outline-none focus:border-amber-400 backdrop-blur-xl"
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="spring-press p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-mono uppercase border border-white/10"
            aria-label="Close collection modal"
          >
            <span className="hidden sm:inline">{lang === 'vi' ? 'Đóng' : 'Close'}</span>
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Filter Toolbar Bar (Multi-Category + Seasonal Pills) */}
      <div className="bg-[#141513]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex-shrink-0 space-y-3 z-10">
        
        {/* Row 1: Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex-shrink-0 flex items-center gap-1 font-bold">
            <Filter className="w-3 h-3" />
            <span>{lang === 'vi' ? 'DANH MỤC:' : 'CATEGORY:'}</span>
          </span>

          {BOTANICAL_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? flowers.length
                : flowers.filter(
                    (f) =>
                      f.category === cat.id ||
                      f.categoryLabelEn.toLowerCase().includes(cat.id.toLowerCase())
                  ).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`spring-press-subtle px-4 py-1.5 rounded-[20px] text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-[#141414] font-bold border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/15 hover:text-white backdrop-blur-md'
                }`}
              >
                <span>{lang === 'vi' ? cat.labelVi : cat.labelEn}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-black/20 text-[#141414] font-bold' : 'bg-black/40 text-white/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Seasonality + Pinned Landing Quick Filter */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex-shrink-0">
              {lang === 'vi' ? 'LỌC THEO MÙA:' : 'BY SEASON:'}
            </span>

            {BOTANICAL_SEASONS.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonChange(season.id)}
                className={`spring-press-subtle px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border ${
                  selectedSeason === season.id
                    ? 'bg-white/25 text-white border-white/50 font-bold shadow-sm backdrop-blur-md'
                    : 'bg-transparent text-white/60 hover:text-white border-white/10 hover:border-white/25'
                }`}
              >
                {lang === 'vi' ? season.labelVi : season.labelEn}
              </button>
            ))}

            {/* Quick Toggle: Ghim Landing Page */}
            <button
              onClick={() => {
                soundEngine.playFlowerChime(640);
                setShowPinnedOnly((prev) => !prev);
              }}
              className={`spring-press-subtle px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                showPinnedOnly
                  ? 'bg-amber-400/25 text-amber-300 border-amber-400/60 font-bold shadow-sm backdrop-blur-md'
                  : 'bg-transparent text-white/60 hover:text-amber-300 border-white/10 hover:border-amber-400/30'
              }`}
              title="Chỉ hiển thị các tác phẩm đang được ghim tại trang chủ"
            >
              <Pin className={`w-3 h-3 ${showPinnedOnly ? 'fill-amber-300' : ''}`} />
              <span>{lang === 'vi' ? `Ghim Trang Chủ (${pinnedCount})` : `Pinned Landing (${pinnedCount})`}</span>
            </button>
          </div>

          {/* Results Counter & Mobile Search */}
          <div className="flex items-center gap-3 text-xs font-mono text-white/50 ml-auto">
            <span>
              {lang === 'vi'
                ? `Hiển thị ${filteredFlowers.length} / ${flowers.length} tác phẩm`
                : `Showing ${filteredFlowers.length} of ${flowers.length}`}
            </span>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pt-1">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'vi' ? 'Tìm hoa, mùi hương, mùa...' : 'Search species, season...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-black/50 border border-white/20 rounded-[22px] text-white text-xs font-mono placeholder-white/40 focus:outline-none focus:border-amber-400 backdrop-blur-xl"
            />
          </div>
        </div>

      </div>

      {/* Main Content Area (Visual Grid of Floral Specimens) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0e0f0d]">
        <div className="max-w-7xl mx-auto">
          
          {filteredFlowers.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-lg font-serif-editorial italic text-white/60">
                {lang === 'vi'
                  ? 'Không có tác phẩm hoa nào phù hợp với bộ lọc mùa & danh mục hiện tại.'
                  : 'No botanical specimens match the current filter selection.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSeason('all');
                  setShowPinnedOnly(false);
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-[18px] bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider spring-press"
              >
                {lang === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredFlowers.map((flower) => {
                const isPinned = flower.pinnedToLanding !== false;

                return (
                  <div
                    key={flower.id}
                    onClick={() => handleFlowerClick(flower)}
                    className="spring-card group glass-frost-dark rounded-[28px] sm:rounded-[34px] p-2.5 sm:p-3 border border-white/15 hover:border-amber-400/60 transition-all duration-300 cursor-pointer flex flex-col shadow-soft-2 hover:shadow-soft-3 hover:-translate-y-1 active:scale-[0.97]"
                  >
                    {/* Image Stage with Continuous Curve Squircle Container */}
                    <div className="relative aspect-[3/4] bg-black rounded-[22px] sm:rounded-[26px] overflow-hidden">
                      <img
                        src={flower.image}
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                      {/* Specimen Index Badge in Frosted Glass */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-xl bg-black/60 border border-white/20 text-[10px] font-mono text-white/95 shadow-sm">
                        #{flower.indexNumber}
                      </div>

                      {/* Pinned to Landing Page Badge */}
                      {isPinned && (
                        <div
                          className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-mono font-bold flex items-center gap-1 shadow-md"
                          title="Tác phẩm đang được ghim tại trang chủ"
                        >
                          <Pin className="w-2.5 h-2.5 fill-black" />
                          <span>GHIM LANDING</span>
                        </div>
                      )}

                      {/* Seasonality Tag bottom right */}
                      {flower.seasonality && (
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-xl bg-black/75 text-[10px] font-mono text-amber-300 border border-white/15 shadow-sm">
                          {flower.seasonality}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block truncate">
                          {flower.categoryLabelVi || flower.category}
                        </span>
                        
                        <h4 className="font-bagerich font-medium text-sm sm:text-base uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors line-clamp-1 mt-0.5">
                          {flower.name}
                        </h4>

                        <p className="text-xs text-white/70 font-sans line-clamp-1 mt-0.5">
                          {flower.vietnameseName}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-white/50 text-[11px] truncate mr-2">
                          {flower.scent?.mood || 'Hương thơm tự nhiên'}
                        </span>
                        <span className="text-amber-300 font-bold flex-shrink-0">
                          {(flower.priceVnd / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Footer Info */}
      <footer className="h-12 bg-[#141513] border-t border-white/10 px-4 sm:px-8 flex items-center justify-between text-xs font-mono text-white/50 flex-shrink-0">
        <span>
          JU ET SAIGON · Lầu 1, 31 Nguyễn Trãi, Q.1, TP.HCM
        </span>
        <span className="text-amber-400">
          Hotline: 090 936 80 80
        </span>
      </footer>

    </div>
  );
};
