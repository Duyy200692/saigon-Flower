import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Pin, Heart, Maximize2, Minimize2 } from 'lucide-react';
import { FlowerItem, BOTANICAL_CATEGORIES, BOTANICAL_SEASONS } from '../data/flowers';
import { useAtelier } from '../context/AtelierContext';

interface CollectionCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowers: FlowerItem[];
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onSelectFlower: (flower: FlowerItem) => void;
}

export const CollectionCatalogModal: React.FC<CollectionCatalogModalProps> = ({
  isOpen,
  onClose,
  flowers,
  lang,
  theme = 'light',
  onSelectFlower
}) => {
  const { atelierData, wishlistIds, toggleWishlist, isInWishlist } = useAtelier();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [gridFitMode, setGridFitMode] = useState<'cover' | 'contain'>('cover');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isDark = theme === 'dark';

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

      // 3. Pinned & Wishlist filter
      const matchPinned = !showPinnedOnly || flower.pinnedToLanding !== false;
      const matchWishlist = !showWishlistOnly || wishlistIds.includes(flower.id);

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

      return matchCategory && matchSeason && matchPinned && matchWishlist && matchSearch;
    });
  }, [flowers, selectedCategory, selectedSeason, showPinnedOnly, showWishlistOnly, wishlistIds, searchQuery]);

  if (!isOpen) return null;

  const handleFlowerClick = (flower: FlowerItem) => {
    onSelectFlower(flower);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
  };

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeason(seasonId);
  };

  const pinnedCount = flowers.filter((f) => f.pinnedToLanding !== false).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn font-sans">
      
      {/* Top Header Bar */}
      <header
        className={`h-18 backdrop-blur-2xl border-b px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-20 transition-colors ${
          isDark
            ? 'bg-[#181917]/95 border-white/15 text-white'
            : 'bg-[#dcd8cf]/95 border-[#141414]/15 text-[#141414]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                  : 'text-amber-900 bg-amber-500/15 border-amber-700/25'
              }`}
            >
              JU ET SAIGON · ARCHIVE
            </span>
            <span className={`text-xs font-mono hidden sm:inline-block ${isDark ? 'text-white/50' : 'text-[#141414]/60'}`}>
              {flowers.length} Tác Phẩm Độc Bản · {pinnedCount} Ghim Landing Page
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bagerich uppercase tracking-wider mt-0.5">
            {lang === 'vi' ? 'BỘ SƯU TẬP HOA & MÙA (COLLECTION ARCHIVE)' : 'BOTANICAL COLLECTION & SEASONS'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-64">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            />
            <input
              type="text"
              placeholder={lang === 'vi' ? 'Tìm hoa, mùa, nốt hương...' : 'Search species, season...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-4 py-1.5 border rounded-[20px] text-xs font-mono focus:outline-none backdrop-blur-xl ${
                isDark
                  ? 'bg-black/40 border-white/20 text-white placeholder-white/40 focus:border-amber-400'
                  : 'bg-white/70 border-[#141414]/20 text-[#141414] placeholder-[#141414]/45 focus:border-[#141414]'
              }`}
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`p-2 px-3 rounded-full transition-colors flex items-center gap-1.5 text-xs font-mono uppercase border ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                : 'bg-[#141414] hover:bg-[#2b2a28] text-[#dcd8cf] border-[#141414]'
            }`}
            aria-label="Close collection modal"
          >
            <span className="hidden sm:inline">{lang === 'vi' ? 'Đóng' : 'Close'}</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter Toolbar Bar */}
      <div
        className={`backdrop-blur-2xl border-b px-4 sm:px-8 py-3.5 flex-shrink-0 space-y-3 z-10 transition-colors ${
          isDark
            ? 'bg-[#141513]/95 border-white/10 text-white'
            : 'bg-[#e6e2da]/95 border-[#141414]/10 text-[#141414]'
        }`}
      >
        {/* Row 1: Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <span
            className={`text-[11px] font-mono uppercase tracking-wider flex-shrink-0 flex items-center gap-1 font-bold ${
              isDark ? 'text-amber-300' : 'text-amber-900'
            }`}
          >
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

            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-1.5 rounded-[20px] text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? isDark
                      ? 'bg-amber-400 text-[#141414] font-bold border-amber-400 shadow-md'
                      : 'bg-[#141414] text-[#dcd8cf] font-bold border-[#141414] shadow-md'
                    : isDark
                      ? 'bg-white/10 text-white/80 hover:bg-white/20 border-white/15 hover:text-white'
                      : 'bg-white/70 text-[#141414]/80 hover:bg-white border-[#141414]/15 hover:text-[#141414]'
                }`}
              >
                <span>{lang === 'vi' ? cat.labelVi : cat.labelEn}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? isDark
                        ? 'bg-black/20 text-[#141414] font-bold'
                        : 'bg-white/20 text-[#dcd8cf] font-bold'
                      : isDark
                        ? 'bg-black/40 text-white/60'
                        : 'bg-black/10 text-[#141414]/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Seasonality + Pinned Landing Quick Filter */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className={`text-[11px] font-mono uppercase tracking-wider flex-shrink-0 ${isDark ? 'text-white/50' : 'text-[#141414]/60'}`}>
              {lang === 'vi' ? 'LỌC THEO MÙA:' : 'BY SEASON:'}
            </span>

            {BOTANICAL_SEASONS.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonChange(season.id)}
                className={`px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border ${
                  selectedSeason === season.id
                    ? isDark
                      ? 'bg-white/25 text-white border-white/50 font-bold shadow-sm'
                      : 'bg-[#141414] text-[#dcd8cf] border-[#141414] font-bold shadow-sm'
                    : isDark
                      ? 'bg-transparent text-white/60 hover:text-white border-white/10 hover:border-white/25'
                      : 'bg-white/50 text-[#141414]/70 hover:text-[#141414] border-[#141414]/15'
                }`}
              >
                {lang === 'vi' ? season.labelVi : season.labelEn}
              </button>
            ))}

            {/* Quick Toggle: Ghim Landing Page */}
            <button
              onClick={() => setShowPinnedOnly((prev) => !prev)}
              className={`px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                showPinnedOnly
                  ? isDark
                    ? 'bg-amber-400/25 text-amber-300 border-amber-400/60 font-bold shadow-sm'
                    : 'bg-amber-500/20 text-amber-950 border-amber-700/50 font-bold shadow-sm'
                  : isDark
                    ? 'bg-transparent text-white/60 hover:text-amber-300 border-white/10 hover:border-amber-400/30'
                    : 'bg-white/50 text-[#141414]/70 hover:text-amber-900 border-[#141414]/15'
              }`}
              title="Chỉ hiển thị các tác phẩm đang được ghim tại trang chủ"
            >
              <Pin className={`w-3 h-3 ${showPinnedOnly ? 'fill-current' : ''}`} />
              <span>{lang === 'vi' ? `Ghim Trang Chủ (${pinnedCount})` : `Pinned Landing (${pinnedCount})`}</span>
            </button>

            {/* Quick Toggle: Moodboard Yêu Thích */}
            <button
              onClick={() => setShowWishlistOnly((prev) => !prev)}
              className={`px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                showWishlistOnly
                  ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-sm'
                  : isDark
                    ? 'bg-transparent text-white/60 hover:text-rose-300 border-white/10 hover:border-rose-400/30'
                    : 'bg-white/50 text-[#141414]/70 hover:text-rose-700 border-[#141414]/15'
              }`}
              title="Hiển thị các tác phẩm đã lưu trong Moodboard Yêu Thích"
            >
              <Heart className={`w-3 h-3 ${showWishlistOnly ? 'fill-current' : ''}`} />
              <span>Moodboard ({wishlistIds.length})</span>
            </button>

            {/* Quick Toggle: Khung Hình Tỉ Lệ Gốc vs Lấp Đầy */}
            <button
              onClick={() => setGridFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'))}
              className={`px-3.5 py-1 rounded-[18px] text-[11px] font-mono whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                gridFitMode === 'contain'
                  ? isDark
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/60 font-bold shadow-sm'
                    : 'bg-[#141414] text-[#dcd8cf] border-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'bg-transparent text-white/60 hover:text-white border-white/10'
                    : 'bg-white/50 text-[#141414]/70 hover:text-[#141414] border-[#141414]/15'
              }`}
              title="Chuyển đổi giữa Lấp Đầy Khung 3:4 và Vừa Khung Tỉ Lệ Gốc"
            >
              {gridFitMode === 'cover' ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>{lang === 'vi' ? 'Khung: Lấp Đầy 3:4' : 'Frame: 3:4 Fill'}</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>{lang === 'vi' ? 'Khung: Tỉ Lệ Gốc' : 'Frame: Original Fit'}</span>
                </>
              )}
            </button>
          </div>

          {/* Results Counter */}
          <div className={`flex items-center gap-3 text-xs font-mono ml-auto ${isDark ? 'text-white/50' : 'text-[#141414]/60'}`}>
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
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-white/40' : 'text-[#141414]/50'
              }`}
            />
            <input
              type="text"
              placeholder={lang === 'vi' ? 'Tìm hoa, mùi hương, mùa...' : 'Search species, season...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-4 py-2 border rounded-[22px] text-xs font-mono focus:outline-none backdrop-blur-xl ${
                isDark
                  ? 'bg-black/50 border-white/20 text-white placeholder-white/40 focus:border-amber-400'
                  : 'bg-white/80 border-[#141414]/20 text-[#141414] placeholder-[#141414]/45 focus:border-[#141414]'
              }`}
            />
          </div>
        </div>

      </div>

      {/* Main Content Area (Visual Grid of Floral Specimens) */}
      <main
        className={`flex-1 overflow-y-auto p-4 sm:p-8 transition-colors ${
          isDark ? 'bg-[#0e0f0d]' : 'bg-[#dcd8cf]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          
          {filteredFlowers.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className={`text-lg font-serif-editorial italic ${isDark ? 'text-white/60' : 'text-[#141414]/70'}`}>
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
                className="px-5 py-2.5 rounded-[18px] bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider"
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
                    className={`group rounded-[28px] sm:rounded-[34px] p-2.5 sm:p-3 border transition-all duration-300 cursor-pointer flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
                      isDark
                        ? 'bg-[#181916] border-white/15 hover:border-amber-400/60 text-white'
                        : 'bg-[#e8e4dc] border-[#141414]/15 hover:border-[#141414]/50 text-[#141414]'
                    }`}
                  >
                    {/* Image Stage */}
                    <div className="relative aspect-[3/4] bg-black rounded-[22px] sm:rounded-[26px] overflow-hidden">
                      {gridFitMode === 'contain' && (
                        <img
                          src={flower.image}
                          alt=""
                          aria-hidden="true"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover scale-115 blur-xl opacity-45 pointer-events-none"
                        />
                      )}
                      <img
                        src={flower.image}
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className={`relative z-10 w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out ${
                          gridFitMode === 'contain' ? 'object-contain p-1.5' : 'object-cover object-center'
                        }`}
                        loading="lazy"
                      />

                      {/* Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                      {/* Specimen Index Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-xl bg-black/60 border border-white/20 text-[10px] font-mono text-white/95 shadow-sm">
                        #{flower.indexNumber}
                      </div>

                      {/* Moodboard Heart Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(flower.id);
                        }}
                        className={`absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-md ${
                          isInWishlist(flower.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-black/60 text-white/90 hover:bg-black border border-white/20'
                        }`}
                        title={lang === 'vi' ? 'Lưu vào Moodboard Yêu Thích' : 'Save to Moodboard'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isInWishlist(flower.id) ? 'fill-current' : ''}`} />
                      </button>

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
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest block truncate ${
                            isDark ? 'text-amber-400/80' : 'text-amber-900'
                          }`}
                        >
                          {flower.categoryLabelVi || flower.category}
                        </span>
                        
                        <h4
                          className={`font-bagerich font-medium text-sm sm:text-base uppercase tracking-tight transition-colors line-clamp-1 mt-0.5 ${
                            isDark
                              ? 'text-white group-hover:text-amber-300'
                              : 'text-[#141414] group-hover:text-amber-900'
                          }`}
                        >
                          {flower.name}
                        </h4>

                        <p className={`text-xs font-sans line-clamp-1 mt-0.5 ${isDark ? 'text-white/70' : 'text-[#141414]/70'}`}>
                          {flower.vietnameseName}
                        </p>
                      </div>

                      <div
                        className={`pt-2 border-t flex items-center justify-between text-xs font-mono ${
                          isDark ? 'border-white/10' : 'border-[#141414]/10'
                        }`}
                      >
                        <span className={`text-[11px] truncate mr-2 ${isDark ? 'text-white/50' : 'text-[#141414]/60'}`}>
                          {flower.scent?.mood || 'Hương thơm tự nhiên'}
                        </span>
                        <span className={`font-bold flex-shrink-0 ${isDark ? 'text-amber-300' : 'text-[#141414]'}`}>
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
      <footer
        className={`h-12 border-t px-4 sm:px-8 flex items-center justify-between text-xs font-mono flex-shrink-0 ${
          isDark
            ? 'bg-[#141513] border-white/10 text-white/50'
            : 'bg-[#e6e2da] border-[#141414]/15 text-[#141414]/70'
        }`}
      >
        <span className="truncate mr-2">
          {atelierData.name || 'JU ET SAIGON'} · {lang === 'vi' ? atelierData.addressVi : atelierData.addressEn}
        </span>
        <span className={`shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-900 font-bold'}`}>
          Hotline: {atelierData.phoneFormatted || atelierData.phone}
        </span>
      </footer>

    </div>
  );
};
