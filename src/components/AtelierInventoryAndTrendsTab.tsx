import React, { useState, useMemo } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Sparkles,
  Calendar,
  Flame,
  Pin,
  RefreshCw,
  ArrowUpRight,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import {
  SupplyItem,
  SupplyCategory,
  SUPPLY_CATEGORIES,
  MONTHLY_MARKET_FORECASTS,
  analyzeSupplyInventory,
  computeFlowerMarketTrends
} from '../data/inventoryAndTrends';

export const AtelierInventoryAndTrendsTab: React.FC = () => {
  const {
    supplies,
    flowers,
    orders,
    wishlistIds,
    addSupply,
    updateSupply,
    adjustSupplyStock,
    deleteSupply,
    updateFlower,
    togglePinFlower
  } = useAtelier();

  const [subTab, setSubTab] = useState<'inventory' | 'market_trends'>('inventory');
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedCategory, setSelectedCategory] = useState<SupplyCategory | 'all'>('all');
  const [showRestockOnly, setShowRestockOnly] = useState<boolean>(false);

  // Add / Edit Supply Form State
  const [isAddingSupply, setIsAddingSupply] = useState<boolean>(false);
  const [editingSupplyId, setEditingSupplyId] = useState<string | null>(null);
  const [supplyForm, setSupplyForm] = useState<{
    sku: string;
    nameVi: string;
    nameEn: string;
    category: SupplyCategory;
    unit: string;
    currentStock: number;
    minThreshold: number;
    unitCostVnd: number;
    peakBoostFactor: number;
    supplierNote: string;
  }>({
    sku: 'VES-04',
    nameVi: '',
    nameEn: '',
    category: 'vessels',
    unit: 'Chiếc',
    currentStock: 10,
    minThreshold: 8,
    unitCostVnd: 150000,
    peakBoostFactor: 2.0,
    supplierNote: ''
  });

  // Analyze inventory against selected month's peak multiplier
  const inventoryReport = useMemo(
    () => analyzeSupplyInventory(supplies, selectedMonth),
    [supplies, selectedMonth]
  );

  // Compute market trends & flower heat scores
  const flowerTrends = useMemo(
    () => computeFlowerMarketTrends(flowers, orders, wishlistIds, selectedMonth),
    [flowers, orders, wishlistIds, selectedMonth]
  );

  const totalInventoryValueVnd = useMemo(
    () =>
      supplies.reduce(
        (sum, item) => sum + (item.currentStock || 0) * (item.unitCostVnd || 0),
        0
      ),
    [supplies]
  );

  const filteredAnalysis = useMemo(() => {
    return inventoryReport.itemsAnalysis.filter((entry) => {
      const matchCat =
        selectedCategory === 'all' || entry.item.category === selectedCategory;
      const matchRestock = !showRestockOnly || entry.status !== 'healthy';
      return matchCat && matchRestock;
    });
  }, [inventoryReport.itemsAnalysis, selectedCategory, showRestockOnly]);

  const handleOpenAddSupply = () => {
    const nextNum = String(supplies.length + 1).padStart(2, '0');
    setEditingSupplyId(null);
    setSupplyForm({
      sku: `SUP-${nextNum}`,
      nameVi: '',
      nameEn: '',
      category: 'vessels',
      unit: 'Chiếc',
      currentStock: 12,
      minThreshold: 8,
      unitCostVnd: 150000,
      peakBoostFactor: 2.2,
      supplierNote: ''
    });
    setIsAddingSupply(true);
  };

  const handleOpenEditSupply = (item: SupplyItem) => {
    setEditingSupplyId(item.id);
    setSupplyForm({
      sku: item.sku,
      nameVi: item.nameVi,
      nameEn: item.nameEn || item.nameVi,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minThreshold: item.minThreshold,
      unitCostVnd: item.unitCostVnd,
      peakBoostFactor: item.peakBoostFactor || 2.0,
      supplierNote: item.supplierNote || ''
    });
    setIsAddingSupply(true);
  };

  const handleSaveSupplyForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyForm.nameVi.trim()) return;

    if (editingSupplyId) {
      await updateSupply(editingSupplyId, {
        ...supplyForm,
        nameVi: supplyForm.nameVi.trim(),
        nameEn: (supplyForm.nameEn || supplyForm.nameVi).trim()
      });
    } else {
      await addSupply({
        ...supplyForm,
        nameVi: supplyForm.nameVi.trim(),
        nameEn: (supplyForm.nameEn || supplyForm.nameVi).trim()
      });
    }

    setIsAddingSupply(false);
    setEditingSupplyId(null);
  };

  const handleBulkRestockAll = async () => {
    const itemsToRestock = inventoryReport.itemsAnalysis.filter(
      (x) => x.suggestedOrderQty > 0
    );
    for (const entry of itemsToRestock) {
      await updateSupply(entry.item.id, {
        currentStock: entry.item.currentStock + entry.suggestedOrderQty
      });
    }
  };

  const activeForecast = inventoryReport.forecast;

  return (
    <div className="bg-[#1e1f1c] rounded-2xl p-4 sm:p-6 border border-white/15 space-y-6 animate-fadeIn">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] uppercase font-bold">
              ATELIER ERP & MARKET INTELLIGENCE
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bagerich font-bold uppercase text-white mt-1">
            KHO DỤNG CỤ NGÀNH HOA & DỰ BÁO XU HƯỚNG THỊ TRƯỜNG
          </h3>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Quản lý tồn kho bình gốm, phụ liệu, sáp đóng dấu · Tự động gợi ý nhập hàng tháng cao điểm & phân tích mẫu hoa đang Hot
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/15 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setSubTab('inventory')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              subTab === 'inventory'
                ? 'bg-amber-400 text-[#141414] font-bold shadow'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Kho Dụng Cụ & Gợi Ý Nhập Hàng ({supplies.length})</span>
            {inventoryReport.criticalCount + inventoryReport.peakWarningCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  subTab === 'inventory'
                    ? 'bg-black/20 text-[#141414]'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {inventoryReport.criticalCount + inventoryReport.peakWarningCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('market_trends')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              subTab === 'market_trends'
                ? 'bg-amber-400 text-[#141414] font-bold shadow'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mẫu Hoa Đang Hot & Dự Báo Thị Trường</span>
          </button>
        </div>
      </div>

      {/* GLOBAL MONTH / SEASON HORIZON SELECTOR BAR */}
      <div className="p-4 rounded-xl bg-black/45 border border-amber-400/25 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-mono font-bold uppercase text-amber-300">
              CHỌN THÁNG MỤC TIÊU ĐỂ DỰ BÁO ĐỊNH MỨC KHO & XU HƯỚNG HOA:
            </span>
          </div>
          <span className="text-[11px] font-mono text-white/60">
            Hệ số nhân nhu cầu tháng {selectedMonth}:{' '}
            <strong className="text-amber-300">x{activeForecast.demandMultiplier.toFixed(1)}</strong> (
            {activeForecast.peakEventTitleVi})
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {MONTHLY_MARKET_FORECASTS.map((m) => {
            const isSelected = selectedMonth === m.month;
            const isCurrentRealMonth = new Date().getMonth() + 1 === m.month;
            return (
              <button
                key={m.month}
                type="button"
                onClick={() => setSelectedMonth(m.month)}
                className={`p-2 rounded-lg border text-center font-mono transition-all relative ${
                  isSelected
                    ? 'bg-amber-400 text-[#141414] border-amber-300 font-bold shadow-md'
                    : m.demandLevel === 'extreme'
                      ? 'bg-rose-500/10 text-rose-200 border-rose-400/30 hover:bg-rose-500/20'
                      : 'bg-white/5 text-white/75 border-white/10 hover:bg-white/15'
                }`}
              >
                <span className="text-[11px] block font-bold">Tháng {m.month}</span>
                <span className="text-[9px] block opacity-80">x{m.demandMultiplier}</span>
                {isCurrentRealMonth && (
                  <span
                    className={`mt-0.5 inline-block px-1 rounded text-[8px] uppercase ${
                      isSelected ? 'bg-black/20 text-black' : 'bg-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    Hiện tại
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          SUB-TAB 1: ATELIER INVENTORY & PEAK RESTOCK ENGINE
      ===================================================================== */}
      {subTab === 'inventory' && (
        <div className="space-y-6">
          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono uppercase text-white/55 block">
                TỔNG DANH MỤC VẬT TƯ & DỤNG CỤ
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {supplies.length} <span className="text-xs font-normal text-white/60">mã SKU</span>
              </div>
              <p className="text-[11px] text-white/50">
                Giá trị tồn kho: {totalInventoryValueVnd.toLocaleString('vi-VN')} VND
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">
                CẢNH BÁO SẮP HẾT (DƯỚI ĐỊNH MỨC)
              </span>
              <div className="text-2xl font-mono font-bold text-rose-300">
                {inventoryReport.criticalCount}{' '}
                <span className="text-xs font-normal text-rose-200/75">vật tư cần nhập ngay</span>
              </div>
              <p className="text-[11px] text-rose-200/70">
                Số lượng hiện tại thấp hơn định mức tối thiểu ngày thường
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                CẦN NHẬP ĐÓN CAO ĐIỂM THÁNG {selectedMonth}
              </span>
              <div className="text-2xl font-mono font-bold text-amber-300">
                {inventoryReport.peakWarningCount}{' '}
                <span className="text-xs font-normal text-amber-200/75">vật tư thiếu hụt mùa lễ</span>
              </div>
              <p className="text-[11px] text-amber-200/70 truncate">
                {activeForecast.peakEventTitleVi} (x{activeForecast.demandMultiplier})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block">
                  DỰ TOÁN NHẬP BỔ SUNG ĐỀ XUẤT
                </span>
                <div className="text-lg font-mono font-bold text-emerald-200 mt-0.5">
                  {inventoryReport.totalSuggestedRestockVnd.toLocaleString('vi-VN')} VND
                </div>
              </div>
              {inventoryReport.totalSuggestedRestockVnd > 0 ? (
                <button
                  type="button"
                  onClick={handleBulkRestockAll}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#141414] font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Nhập Đủ Toàn Bộ Đề Xuất</span>
                </button>
              ) : (
                <span className="text-[11px] text-emerald-300 font-mono">
                  ✓ Kho đã đạt chuẩn an toàn mùa lễ
                </span>
              )}
            </div>
          </div>

          {/* Add / Edit Supply Form Modal Panel */}
          {isAddingSupply && (
            <form
              onSubmit={handleSaveSupplyForm}
              className="p-5 rounded-xl bg-black/60 border border-amber-400/40 space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-mono text-xs font-bold uppercase text-amber-300">
                  {editingSupplyId
                    ? `CHỈNH SỬA VẬT TƯ: ${supplyForm.nameVi}`
                    : 'THÊM VẬT TƯ / DỤNG CỤ NGÀNH HOA MỚI VÀO KHO'}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSupply(false);
                    setEditingSupplyId(null);
                  }}
                  className="text-xs font-mono text-white/60 hover:text-white"
                >
                  Đóng [X]
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Mã SKU Vật Tư *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplyForm.sku}
                    onChange={(e) => setSupplyForm({ ...supplyForm, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                    placeholder="VD: VES-05"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Tên Vật Tư / Dụng Cụ (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplyForm.nameVi}
                    onChange={(e) => setSupplyForm({ ...supplyForm, nameVi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                    placeholder="VD: Bình Gốm Đá Ong Thủ Công Cỡ Lớn"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Phân Nhóm Kho *
                  </label>
                  <select
                    value={supplyForm.category}
                    onChange={(e) =>
                      setSupplyForm({
                        ...supplyForm,
                        category: e.target.value as SupplyCategory
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                  >
                    <option value="vessels">1. Bình, Giỏ & Hộp Hoa</option>
                    <option value="packaging">2. Giấy Gói, Ruy Băng & Sáp</option>
                    <option value="conditioning">3. Dưỡng Hoa & Dụng Cụ Xưởng</option>
                    <option value="stems">4. Hoa & Lá Chủ Đạo Dự Trữ</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Đơn Vị Tính *
                  </label>
                  <input
                    type="text"
                    required
                    value={supplyForm.unit}
                    onChange={(e) => setSupplyForm({ ...supplyForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                    placeholder="Chiếc / Hộp / Cuộn / Bó"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Đơn Giá Nhập Ước Tính (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={supplyForm.unitCostVnd}
                    onChange={(e) =>
                      setSupplyForm({ ...supplyForm, unitCostVnd: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Số Lượng Tồn Hiện Tại *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={supplyForm.currentStock}
                    onChange={(e) =>
                      setSupplyForm({ ...supplyForm, currentStock: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Ngưỡng Cảnh Báo Tối Thiểu (Ngày Thường) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={supplyForm.minThreshold}
                    onChange={(e) =>
                      setSupplyForm({ ...supplyForm, minThreshold: Number(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Hệ Số Tăng Trưởng Mùa Lễ (1.5x – 3.5x)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={supplyForm.peakBoostFactor}
                    onChange={(e) =>
                      setSupplyForm({
                        ...supplyForm,
                        peakBoostFactor: Number(e.target.value) || 2.0
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[11px] font-mono text-white/70 block mb-1">
                    Ghi Chú Nhà Cung Cấp / Quy Cách Bảo Quản
                  </label>
                  <input
                    type="text"
                    value={supplyForm.supplierNote}
                    onChange={(e) =>
                      setSupplyForm({ ...supplyForm, supplierNote: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white"
                    placeholder="VD: Nhập tại chợ hoa Đầm Sen / Xưởng gốm Thủ Đức, thời gian đặt trước 3 ngày..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSupply(false);
                    setEditingSupplyId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-mono"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#141414] font-mono text-xs font-bold"
                >
                  {editingSupplyId ? 'Cập Nhật Vật Tư' : 'Lưu Vật Tư Vào Kho'}
                </button>
              </div>
            </form>
          )}

          {/* Category Filter Pills & Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {SUPPLY_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      isSelected
                        ? 'bg-amber-400 text-[#141414] border-amber-300 font-bold'
                        : 'bg-white/5 text-white/75 border-white/10 hover:bg-white/15'
                    }`}
                  >
                    {cat.labelVi}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowRestockOnly((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-1 ${
                  showRestockOnly
                    ? 'bg-rose-500 text-white border-rose-400 font-bold'
                    : 'bg-white/5 text-rose-300 border-rose-400/30 hover:bg-rose-500/15'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Chỉ hiện mục cần nhập hàng</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenAddSupply}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-mono text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Dụng Cụ / Vật Tư Mới</span>
            </button>
          </div>

          {/* Supplies List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnalysis.map((entry) => {
              const { item, normalMin, peakAdjustedMin, status, suggestedOrderQty, estimatedRestockCostVnd } =
                entry;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3.5 ${
                    status === 'critical'
                      ? 'bg-rose-950/25 border-rose-500/45'
                      : status === 'peak_warning'
                        ? 'bg-amber-950/20 border-amber-400/40'
                        : 'bg-black/40 border-white/15'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-[10px] font-bold">
                          {item.sku}
                        </span>
                        {status === 'critical' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>CẦN NHẬP GẤP (DƯỚI MỨC TỐI THIỂU)</span>
                          </span>
                        )}
                        {status === 'peak_warning' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#141414] font-mono text-[10px] font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>GỢI Ý NHẬP ĐÓN CAO ĐIỂM THÁNG {selectedMonth}</span>
                          </span>
                        )}
                        {status === 'healthy' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ĐỦ ĐỊNH MỨC MÙA LỄ</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditSupply(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white"
                          title="Chỉnh sửa vật tư"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Xóa vật tư "${item.nameVi}" khỏi kho?`)) {
                              deleteSupply(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300"
                          title="Xóa vật tư"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{item.nameVi}</h4>

                    {item.supplierNote && (
                      <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                        {item.supplierNote}
                      </p>
                    )}
                  </div>

                  {/* Stock Metrics & Restock Suggestion Box */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-2.5 rounded-lg border border-white/10 font-mono">
                      <div>
                        <span className="text-[9px] uppercase text-white/50 block">Tồn hiện tại</span>
                        <span
                          className={`text-base font-bold ${
                            status === 'critical'
                              ? 'text-rose-400'
                              : status === 'peak_warning'
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                          }`}
                        >
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-white/50 block">
                          Tối thiểu thường
                        </span>
                        <span className="text-xs font-bold text-white/85">
                          {normalMin} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-amber-300/80 block">
                          Định mức T{selectedMonth}
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          {peakAdjustedMin} {item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quick +/- Stock Adjustment & 1-Click Restock */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => adjustSupplyStock(item.id, -1)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-0.5"
                          title="Xuất 1 đơn vị"
                        >
                          <Minus className="w-3 h-3" />
                          <span>1</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustSupplyStock(item.id, 1)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-0.5"
                          title="Nhập thêm 1 đơn vị"
                        >
                          <Plus className="w-3 h-3" />
                          <span>1</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustSupplyStock(item.id, 5)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 font-mono text-xs font-bold"
                          title="Nhập nhanh 5 đơn vị"
                        >
                          +5
                        </button>
                      </div>

                      {suggestedOrderQty > 0 && (
                        <button
                          type="button"
                          onClick={() => adjustSupplyStock(item.id, suggestedOrderQty)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#141414] font-mono text-[11px] font-bold flex items-center gap-1 shadow transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>
                            Nhập đề xuất +{suggestedOrderQty} {item.unit} (~
                            {(estimatedRestockCostVnd / 1000).toFixed(0)}k)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 2: MARKET TRENDS & UPCOMING DEMAND INTELLIGENCE
      ===================================================================== */}
      {subTab === 'market_trends' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Market Forecast Hero Card for Selected Month */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-black/60 to-black/80 border border-amber-400/35">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-[#141414] font-mono text-[10px] font-bold uppercase">
                  DỰ BÁO THỊ TRƯỜNG · {activeForecast.seasonLabelVi}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200 font-mono text-[10px] border border-amber-400/30">
                  Cao điểm: {activeForecast.peakDates}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bagerich text-white uppercase">
                {activeForecast.monthNameVi}
              </h4>

              <p className="text-xs sm:text-sm text-white/85 font-sans leading-relaxed">
                {activeForecast.marketForecastSummaryVi}
              </p>

              <div className="p-3.5 rounded-xl bg-black/45 border border-white/10 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-amber-300 block">
                  CHIẾN LƯỢC VẬN HÀNH & NHẬP HÀNG KHUYẾN NGHỊ:
                </span>
                <ul className="space-y-1.5 text-xs text-white/85 list-disc pl-4">
                  {activeForecast.actionableAdviceVi.map((adv, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right 5 cols: Seasonal Bloom Radar & Color Trend */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-black/50 p-4 rounded-xl border border-white/10">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-300">
                    🌸 RADAR HOA CHÍNH VỤ ĐẸP NHẤT THÁNG {selectedMonth}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">
                  Các dòng hoa đạt độ nở chuẩn nhất, bền nước và tối ưu chi phí nhập trong tháng:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeForecast.keyBloomsInSeasonVi.map((bloom, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/35 text-emerald-200 text-xs font-medium"
                    >
                      {bloom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-300 block font-bold">
                  TÔNG MÀU & CẢM XÚC THỊ TRƯỜNG ĐANG CHUỘNG:
                </span>
                <p className="text-xs text-white font-medium">
                  {activeForecast.colorPaletteTrendVi}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {activeForecast.trendingMoods.map((mood) => (
                    <span
                      key={mood}
                      className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] uppercase font-bold"
                    >
                      #{mood}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Live Ranking of Hot & Trending Specimens */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-mono font-bold uppercase text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>
                    BẢNG XẾP HẠNG TÁC PHẨM HOA ĐANG HOT & ĐÚNG MÙA ({flowerTrends.length} MẪU)
                  </span>
                </h4>
                <p className="text-xs text-white/60">
                  Chấm điểm tự động theo thời gian thực dựa trên: Số đơn đặt hàng + Lượt lưu Moodboard + Độ khớp mùa lễ Tháng {selectedMonth}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {flowerTrends.map((metric, rankIdx) => {
                const { flower, heatScore, orderCount, wishlistsaved, trendBadgeVi, trendType } =
                  metric;
                const avail = flower.availabilityStatus || 'ready_today';

                return (
                  <div
                    key={flower.id}
                    className="p-3.5 rounded-xl bg-black/45 border border-white/15 flex items-center gap-3.5 justify-between hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-black">
                        <img
                          src={flower.image}
                          alt={flower.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-amber-300 font-mono text-[9px] font-bold">
                          #{rankIdx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
                            Heat: {heatScore}/99
                          </span>
                          {trendBadgeVi && (
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                                trendType === 'hot'
                                  ? 'bg-rose-500 text-white'
                                  : trendType === 'seasonal'
                                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                                    : 'bg-amber-400 text-[#141414]'
                              }`}
                            >
                              {trendBadgeVi}
                            </span>
                          )}
                        </div>

                        <h5 className="text-sm font-bold text-white truncate">
                          {flower.name} — {flower.vietnameseName}
                        </h5>

                        <p className="text-[11px] text-white/65 font-mono">
                          {(flower.priceVnd || 0).toLocaleString('vi-VN')}đ · {orderCount} đơn đặt
                          {wishlistsaved ? ' · ♥ Đang trong Moodboard' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Controls on Trending Card */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <select
                        value={avail}
                        onChange={(e) =>
                          updateFlower(flower.id, {
                            availabilityStatus: e.target.value as
                              | 'ready_today'
                              | 'preorder_24h'
                              | 'seasonal_out'
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border cursor-pointer ${
                          avail === 'ready_today'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : avail === 'preorder_24h'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        }`}
                      >
                        <option value="ready_today" className="bg-[#141414] text-emerald-300">
                          ● Sẵn hoa hôm nay
                        </option>
                        <option value="preorder_24h" className="bg-[#141414] text-amber-300">
                          ◐ Đặt trước 24h
                        </option>
                        <option value="seasonal_out" className="bg-[#141414] text-rose-300">
                          ○ Tạm hết mùa
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() => togglePinFlower(flower.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 border transition-all ${
                          flower.pinnedToLanding !== false
                            ? 'bg-amber-400 text-[#141414] border-amber-300 font-bold'
                            : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/15'
                        }`}
                      >
                        <Pin className="w-3 h-3" />
                        <span>
                          {flower.pinnedToLanding !== false ? 'Đang Ghim Kệ Chính' : 'Ghim Lên Kệ'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
