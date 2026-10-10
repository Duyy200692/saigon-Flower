import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Heart } from 'lucide-react';
import { FlowerItem, BOTANICAL_CATEGORIES } from '../data/flowers';
import { computeFlowerMarketTrends } from '../data/inventoryAndTrends';
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
  const { atelierData, wishlistIds, orders, toggleWishlist, isInWishlist } = useAtelier();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isDark = theme === 'dark';

  const trendMetricsMap = useMemo(() => {
    const metrics = computeFlowerMarketTrends(flowers, orders, wishlistIds);
    const map: Record<string, (typeof metrics)[number]> = {};
    metrics.forEach((m) => {
      map[m.flower.id] = m;
    });
    return map;
  }, [flowers, orders, wishlistIds]);

  // Filtering by Category & Search
  const filteredFlowers = useMemo(() => {
    return flowers.filter((flower) => {
      // 1. Category Filter
      const matchCategory =
        selectedCategory === 'all' ||
        flower.category === selectedCategory ||
        flower.categoryLabelEn.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        flower.categoryLabelVi.toLowerCase().includes(selectedCategory.toLowerCase());

      // 2. Search Filter
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

      return matchCategory && matchSearch;
    });
  }, [flowers, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleFlowerClick = (flower: FlowerItem) => {
    onSelectFlower(flower);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
  };

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn font-sans transition-colors duration-300 ${
        isDark ? 'bg-black/85' : 'bg-[#dcd8cf]/95'
      }`}
    >
      
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
              {flowers.length} Tác Phẩm Độc Bản
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
        className={`backdrop-blur-2xl border-b px-4 sm:px-8 py-3 flex-shrink-0 space-y-2.5 z-10 transition-colors ${
          isDark
            ? 'bg-[#141513]/95 border-white/10 text-white'
            : 'bg-[#dcd8cf]/95 border-[#141414]/10 text-[#141414]'
        }`}
      >
        {/* Categories + Results Counter */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x py-1">
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

          <div className={`hidden lg:flex items-center gap-3 text-xs font-mono shrink-0 ml-auto ${isDark ? 'text-white/50' : 'text-[#141414]/60'}`}>
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
                  ? 'Không có tác phẩm hoa nào phù hợp với danh mục hiện tại.'
                  : 'No botanical specimens match the current filter selection.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
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
                return (
                  <div
                    key={flower.id}
                    onClick={() => handleFlowerClick(flower)}
                    className={`group rounded-[28px] sm:rounded-[34px] p-2.5 sm:p-3 border transition-all duration-300 cursor-pointer flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
                      isDark
                        ? 'bg-[#181916] border-white/15 hover:border-amber-400/60 text-white'
                        : 'bg-[#dcd8cf] border-[#141414]/15 hover:border-[#141414]/50 text-[#141414]'
                    }`}
                  >
                    {/* Image Stage */}
                    <div
                      className={`relative aspect-[3/4] rounded-[22px] sm:rounded-[26px] overflow-hidden ${
                        isDark ? 'bg-black' : 'bg-[#dcd8cf]'
                      }`}
                    >
                      <img
                        src={flower.image}
                        alt={flower.name}
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out object-cover object-center"
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
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest block truncate ${
                            isDark ? 'text-amber-400/80' : 'text-amber-900'
                          }`}
                        >
                          {flower.categoryLabelVi || flower.category}
                        </span>
                        {trendMetricsMap[flower.id]?.trendBadgeVi && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-500 font-mono text-[9px] font-bold shrink-0">
                            {lang === 'vi'
                              ? trendMetricsMap[flower.id].trendBadgeVi
                              : trendMetricsMap[flower.id].trendBadgeEn}
                          </span>
                        )}
                      </div>
                        
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
            : 'bg-[#dcd8cf] border-[#141414]/15 text-[#141414]/70'
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
