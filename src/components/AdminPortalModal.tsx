import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  RotateCcw,
  LogOut,
  Building,
  Sparkles,
  Search,
  FileCheck,
  Layers,
  Sliders,
  Maximize2
} from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import { FlowerItem } from '../data/flowers';
import { WorkshopItem } from '../data/workshop';
import { compressAndConvertToWebP, formatFileSize, CompressionResult } from '../utils/imageOptimizer';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const {
    flowers,
    workshops,
    atelierData,
    logoUrl,
    logout,
    addFlower,
    updateFlower,
    deleteFlower,
    updateWorkshop,
    updateAtelierData,
    updateLogoUrl,
    resetAllData
  } = useAtelier();

  const [activeTab, setActiveTab] = useState<'flowers' | 'workshops' | 'branding'>('flowers');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Flower Editing State
  const [editingFlower, setEditingFlower] = useState<FlowerItem | null>(null);
  const [isAddingFlower, setIsAddingFlower] = useState(false);
  const [flowerForm, setFlowerForm] = useState<Partial<FlowerItem>>({});
  
  // Workshop Editing State
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopItem | null>(null);
  const [workshopForm, setWorkshopForm] = useState<Partial<WorkshopItem>>({});
  
  // Branding Form State
  const [brandingForm, setBrandingForm] = useState(atelierData);
  
  // Compression status feedback
  const [compressing, setCompressing] = useState(false);
  const [lastCompression, setLastCompression] = useState<CompressionResult | null>(null);

  if (!isOpen) return null;

  // Handle Logo Upload with Auto WebP Conversion
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      updateLogoUrl(result.webpDataUrl);
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Không thể nén ảnh logo. Vui lòng thử lại.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Main Flower Image Upload with Auto WebP Conversion
  const handleFlowerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      setFlowerForm((prev) => ({
        ...prev,
        image: result.webpDataUrl,
        galleryImages: [
          { url: result.webpDataUrl, captionVi: "Góc nhìn toàn cảnh", captionEn: "Full architectural view" },
          ...(prev.galleryImages?.slice(1) || [])
        ]
      }));
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi nén ảnh. Vui lòng thử lại.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Flower Gallery Image Upload at specific index with Auto WebP Conversion
  const handleGalleryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      setFlowerForm((prev) => {
        const currentGallery = [...(prev.galleryImages || [])];
        if (currentGallery[index]) {
          currentGallery[index] = { ...currentGallery[index], url: result.webpDataUrl };
        } else {
          currentGallery[index] = {
            url: result.webpDataUrl,
            captionVi: `Góc chụp chi tiết 0${index + 1}`,
            captionEn: `Detailed angle 0${index + 1}`
          };
        }
        return { ...prev, galleryImages: currentGallery };
      });
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi nén ảnh góc chụp.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Workshop Image Upload with Auto WebP Conversion
  const handleWorkshopImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      setWorkshopForm((prev) => ({
        ...prev,
        image: result.webpDataUrl,
        galleryImages: [
          { url: result.webpDataUrl, captionVi: "Poster chính thức", captionEn: "Official visual" },
          ...(prev.galleryImages?.slice(1) || [])
        ]
      }));
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi nén ảnh workshop.');
    } finally {
      setCompressing(false);
    }
  };

  // Open Flower Editor
  const startEditFlower = (flower: FlowerItem) => {
    setEditingFlower(flower);
    setIsAddingFlower(false);
    setFlowerForm(JSON.parse(JSON.stringify(flower)));
    setLastCompression(null);
  };

  const startAddFlower = () => {
    setIsAddingFlower(true);
    setEditingFlower(null);
    setFlowerForm({
      name: "TÁC PHẨM MỚI",
      vietnameseName: "Hoa Thiết Kế Mới",
      latinName: "Botanica nova",
      category: "bridal",
      categoryLabelEn: "Bridal Haute Couture",
      categoryLabelVi: "Hoa Cưới Độc Bản",
      shortDescriptionVi: "Mô tả ngắn gọn về tác phẩm hoa.",
      shortDescriptionEn: "Bespoke floral creation.",
      storyVi: "Câu chuyện và cảm hứng sáng tạo của tác phẩm.",
      storyEn: "Creative narrative and botanical inspiration.",
      botanicalNotesVi: "Chủng loại hoa nhập khẩu và kỹ nghệ cắm.",
      botanicalNotesEn: "Curated botanical stems and artisanal technique.",
      materialsVi: ["Hoa Nhập Khẩu", "Lụa Satin Pháp"],
      materials: ["Imported Stems", "French Silk"],
      scent: {
        top: "Hương hoa cỏ tươi mát",
        heart: "Hương hoa nở rộ ngọt ngào",
        base: "Gỗ tuyết tùng trầm ấm",
        intensity: 3,
        mood: "Thanh khiết, Sang trọng"
      },
      dimensions: "30cm x 45cm",
      seasonality: "Quanh năm (Year-Round)",
      priceVnd: 3000000,
      priceUsd: 120,
      image: "/src/assets/images/juet_blush_peony_1790840758164.jpg",
      galleryImages: [
        { url: "/src/assets/images/juet_blush_peony_1790840758164.jpg", captionVi: "Góc nhìn toàn cảnh", captionEn: "Frontal view" },
        { url: "/src/assets/images/juet_peony_side_angle_1790844501746.jpg", captionVi: "Góc nghiêng nghệ thuật", captionEn: "Side angle" },
        { url: "/src/assets/images/juet_bridal_macro_pearls_1790844489242.jpg", captionVi: "Cận cảnh chi tiết cánh hoa", captionEn: "Macro detail" },
        { url: "/src/assets/images/juet_white_anemone_1790840892002.jpg", captionVi: "Chi tiết hoàn thiện", captionEn: "Finishing detail" }
      ],
      anatomy: [],
      audioFrequency: 528
    });
    setLastCompression(null);
  };

  // Save Flower
  const handleSaveFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingFlower) {
      addFlower(flowerForm as Omit<FlowerItem, 'id' | 'indexNumber'>);
    } else if (editingFlower) {
      updateFlower(editingFlower.id, flowerForm);
    }
    setEditingFlower(null);
    setIsAddingFlower(false);
  };

  // Open Workshop Editor
  const startEditWorkshop = (ws: WorkshopItem) => {
    setEditingWorkshop(ws);
    setWorkshopForm(JSON.parse(JSON.stringify(ws)));
    setLastCompression(null);
  };

  // Save Workshop
  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkshop) {
      updateWorkshop(editingWorkshop.id, workshopForm);
    }
    setEditingWorkshop(null);
  };

  // Save Branding
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateAtelierData(brandingForm);
    alert('Đã cập nhật thông tin thương hiệu thành công!');
  };

  const filteredFlowers = flowers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.vietnameseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.latinName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn">
      
      {/* Top Admin Header */}
      <header className="h-16 bg-[#181917] border-b border-white/15 px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs font-mono">
            AD
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              JU ET SAIGON · BẢNG QUẢN TRỊ ADMIN
            </h2>
            <p className="text-[10px] text-white/60 font-sans">
              Quản lý tác phẩm hoa · Dịch vụ Workshop · Thay đổi logo & thông tin thương hiệu
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('flowers');
              setEditingFlower(null);
              setIsAddingFlower(false);
            }}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'flowers' ? 'bg-amber-400 text-[#141414] font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            Tác Phẩm Hoa ({flowers.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('workshops');
              setEditingWorkshop(null);
            }}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'workshops' ? 'bg-amber-400 text-[#141414] font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            Workshop ({workshops.length})
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'branding' ? 'bg-amber-400 text-[#141414] font-bold' : 'text-white/70 hover:text-white'
            }`}
          >
            Logo & Thông Tin
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu gốc ban đầu của JU et Saigon?')) {
                resetAllData();
                alert('Đã khôi phục dữ liệu mặc định!');
              }
            }}
            className="p-2 text-xs font-mono rounded-lg border border-white/10 hover:border-amber-400/50 text-white/60 hover:text-amber-300 transition-colors"
            title="Khôi phục dữ liệu gốc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/80 text-red-200 border border-red-500/30 text-xs font-mono uppercase flex items-center gap-1 transition-all"
            title="Đăng xuất quản trị"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng Xuất</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-[#ede9df]">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* TAB 1: FLOWERS CRUD */}
          {activeTab === 'flowers' && (
            <div className="space-y-6">
              {/* If Flower Editor Form is Active */}
              {isAddingFlower || editingFlower ? (
                <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bagerich font-bold uppercase text-white">
                      {isAddingFlower ? 'THÊM TÁC PHẨM HOA MỚI' : `CHỈNH SỬA: ${flowerForm.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFlower(null);
                        setIsAddingFlower(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition-all font-mono"
                    >
                      Quay Lại Danh Sách
                    </button>
                  </div>

                  <form onSubmit={handleSaveFlower} className="space-y-6 text-xs font-sans">
                    
                    {/* Auto-Compression WebP Alert */}
                    {lastCompression && (
                      <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-center gap-3 font-mono">
                        <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold">Ảnh đã tự động nén sang định dạng .WebP thành công!</p>
                          <p className="text-[11px] opacity-80">
                            Gốc: {formatFileSize(lastCompression.originalSize)} → WebP: {formatFileSize(lastCompression.compressedSize)} (Tiết kiệm {lastCompression.compressionRatio}%) · Tỉ lệ: {lastCompression.aspectRatio} ({lastCompression.width}x{lastCompression.height}px)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Image Uploader with Auto WebP Conversion */}
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300">
                          1. ẢNH ĐẠI DIỆN CHÍNH (TỰ ĐỘNG NÉN .WEBP KHI ĐĂNG LÊN)
                        </label>
                        {compressing && (
                          <span className="text-amber-400 font-mono text-[11px] animate-pulse">
                            Đang xử lý & nén sang WebP...
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 aspect-[3/4] max-w-[160px] rounded-lg overflow-hidden border border-white/20 bg-black">
                          <img
                            src={flowerForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="sm:col-span-8 space-y-3">
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-400/60 bg-white/5 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-amber-300 mb-2" />
                            <span className="font-bold text-white text-xs">
                              Chọn ảnh từ máy tính (PNG, JPG, HEIC...)
                            </span>
                            <span className="text-[11px] text-white/60 font-mono mt-1">
                              Hệ thống sẽ tự động nén & chuyển đổi tức thì sang định dạng WebP siêu nhẹ
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFlowerImageUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-white/60 block">HOẶC DÁN ĐƯỜNG DẪN ẢNH TRỰC TIẾP:</span>
                            <input
                              type="text"
                              value={flowerForm.image || ''}
                              onChange={(e) =>
                                setFlowerForm((prev) => ({ ...prev, image: e.target.value }))
                              }
                              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4 Multi-Image Gallery Uploader */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                          2. BỘ SƯU TẬP 4 GÓC CHỤP CHI TIẾT (GALLERY 4 ẢNH .WEBP)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[0, 1, 2, 3].map((idx) => {
                            const img = flowerForm.galleryImages?.[idx];
                            return (
                              <div key={idx} className="p-2 bg-black/50 rounded-lg border border-white/10 space-y-2">
                                <div className="aspect-[3/4] rounded overflow-hidden bg-black relative group">
                                  {img?.url ? (
                                    <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                                      Góc 0{idx + 1}
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[10px] font-mono text-amber-300">
                                    Đổi ảnh .WebP
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  placeholder={`Chú thích góc 0${idx + 1}`}
                                  value={img?.captionVi || ''}
                                  onChange={(e) => {
                                    const text = e.target.value;
                                    setFlowerForm((prev) => {
                                      const current = [...(prev.galleryImages || [])];
                                      if (current[idx]) {
                                        current[idx] = { ...current[idx], captionVi: text };
                                      }
                                      return { ...prev, galleryImages: current };
                                    });
                                  }}
                                  className="w-full px-2 py-1 bg-black/60 border border-white/10 rounded text-[10px] text-white"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Basic Info Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Tên Tác Phẩm (In hoa) *</label>
                        <input
                          type="text"
                          required
                          value={flowerForm.name || ''}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Tên Tiếng Việt *</label>
                        <input
                          type="text"
                          required
                          value={flowerForm.vietnameseName || ''}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, vietnameseName: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Tên Danh Pháp La Tinh *</label>
                        <input
                          type="text"
                          required
                          value={flowerForm.latinName || ''}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, latinName: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-editorial-serif italic focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Category & Pricing */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Danh Mục Phân Loại</label>
                        <select
                          value={flowerForm.category || 'bridal'}
                          onChange={(e) =>
                            setFlowerForm((prev) => ({
                              ...prev,
                              category: e.target.value as any
                            }))
                          }
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        >
                          <option value="bridal">Hoa Cưới Độc Bản (Bridal)</option>
                          <option value="sculptural">Điêu Khắc Nghệ Thuật (Sculptural)</option>
                          <option value="rare-stems">Cành Hoa Quý Hiếm (Rare Stems)</option>
                          <option value="seasonal">Bộ Sưu Tập Mùa (Seasonal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Giá Tiền (VND) *</label>
                        <input
                          type="number"
                          required
                          value={flowerForm.priceVnd || 0}
                          onChange={(e) =>
                            setFlowerForm((prev) => ({ ...prev, priceVnd: Number(e.target.value) }))
                          }
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Giá Quy Đổi (USD)</label>
                        <input
                          type="number"
                          value={flowerForm.priceUsd || 0}
                          onChange={(e) =>
                            setFlowerForm((prev) => ({ ...prev, priceUsd: Number(e.target.value) }))
                          }
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Kích Thước</label>
                        <input
                          type="text"
                          value={flowerForm.dimensions || '30cm x 45cm'}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Narrative Story */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Câu Chuyện & Ý Nghĩa (Tiếng Việt)</label>
                        <textarea
                          rows={4}
                          value={flowerForm.storyVi || ''}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, storyVi: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white leading-relaxed focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Mô Tả Tiếng Anh (English Monograph)</label>
                        <textarea
                          rows={4}
                          value={flowerForm.storyEn || ''}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, storyEn: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white leading-relaxed focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFlower(null);
                          setIsAddingFlower(false);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
                      >
                        Hủy Bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                      >
                        <Check className="w-4 h-4" />
                        <span>Lưu Tác Phẩm</span>
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* Flower Catalog List */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm tác phẩm hoa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#1e1f1c] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={startAddFlower}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Tác Phẩm Mới</span>
                    </button>
                  </div>

                  {/* Grid of Flowers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFlowers.map((f) => (
                      <div
                        key={f.id}
                        className="bg-[#1e1f1c] rounded-xl p-3.5 border border-white/10 flex gap-3 items-center group hover:border-white/30 transition-all"
                      >
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0">
                          <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-amber-400">#{f.indexNumber}</span>
                          <h4 className="font-bagerich font-bold text-sm uppercase text-white truncate">
                            {f.name}
                          </h4>
                          <p className="text-xs text-white/70 truncate">{f.vietnameseName}</p>
                          <p className="text-xs font-mono font-bold text-white/90 mt-1">
                            {f.priceVnd.toLocaleString('vi-VN')} VND
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => startEditFlower(f)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] text-white transition-colors"
                            title="Chỉnh sửa tác phẩm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc muốn xóa tác phẩm "${f.name}"?`)) {
                                deleteFlower(f.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-300 transition-colors"
                            title="Xóa tác phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKSHOPS CRUD */}
          {activeTab === 'workshops' && (
            <div className="space-y-6">
              {editingWorkshop ? (
                <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bagerich font-bold uppercase text-white">
                      CHỈNH SỬA WORKSHOP: {workshopForm.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingWorkshop(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition-all font-mono"
                    >
                      Quay Lại
                    </button>
                  </div>

                  <form onSubmit={handleSaveWorkshop} className="space-y-6 text-xs font-sans">
                    
                    {/* Image Uploader for Workshop with Auto WebP */}
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3">
                      <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                        ẢNH POSTER WORKSHOP (TỰ ĐỘNG NÉN SANG .WEBP)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 aspect-[3/4] max-w-[160px] rounded-lg overflow-hidden border border-white/20 bg-black">
                          <img src={workshopForm.image} alt="Workshop Poster" className="w-full h-full object-cover" />
                        </div>
                        <div className="sm:col-span-8">
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-400/60 bg-white/5 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-amber-300 mb-2" />
                            <span className="font-bold text-white text-xs">
                              Chọn ảnh poster mới từ thiết bị
                            </span>
                            <span className="text-[11px] text-white/60 font-mono mt-1">
                              Tự động nén sang WebP nhẹ mượt mà
                            </span>
                            <input type="file" accept="image/*" onChange={handleWorkshopImageUpload} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Tên Tiêu Đề Bagerich *</label>
                        <input
                          type="text"
                          required
                          value={workshopForm.name || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-bagerich text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Tiêu Đề Đầy Đủ (Tiếng Việt) *</label>
                        <input
                          type="text"
                          required
                          value={workshopForm.titleVi || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, titleVi: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Đoạn Văn Triết Lý Giới Thiệu (Hiển thị ngoài trang triển lãm)</label>
                      <textarea
                        rows={3}
                        value={workshopForm.editorialQuoteVi || ''}
                        onChange={(e) => setWorkshopForm((prev) => ({ ...prev, editorialQuoteVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white leading-relaxed focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Thời Lượng</label>
                        <input
                          type="text"
                          value={workshopForm.duration || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Quy Mô Nhóm</label>
                        <input
                          type="text"
                          value={workshopForm.groupSize || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, groupSize: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Địa Điểm Tổ Chức</label>
                        <input
                          type="text"
                          value={workshopForm.locationVi || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, locationVi: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingWorkshop(null)}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
                      >
                        Hủy Bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                      >
                        <Check className="w-4 h-4" />
                        <span>Lưu Thay Đổi Workshop</span>
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {workshops.map((ws) => (
                    <div
                      key={ws.id}
                      className="bg-[#1e1f1c] rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black">
                          <img src={ws.image} alt={ws.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">#{ws.indexNumber}</span>
                        <h4 className="font-bagerich font-bold text-xl uppercase text-white leading-tight">
                          {ws.name}
                        </h4>
                        <p className="text-xs text-white/80 line-clamp-2">{ws.titleVi}</p>
                      </div>

                      <button
                        onClick={() => startEditWorkshop(ws)}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-[#141414] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Chỉnh Sửa Module Này</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BRANDING & LOGO */}
          {activeTab === 'branding' && (
            <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bagerich font-bold uppercase text-white">
                  CẤU HÌNH LOGO & THÔNG TIN ATELIER
                </h3>
                <p className="text-xs text-white/60 font-sans mt-0.5">
                  Tải logo mới dạng ảnh (tự động nén WebP) hoặc chỉnh sửa địa chỉ, hotline, Zalo và slogan
                </p>
              </div>

              {/* Logo Management Section */}
              <div className="p-5 bg-black/40 rounded-xl border border-white/10 space-y-4">
                <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                  LOGO THƯƠNG HIỆU (ẢNH WEBP HOẶC CHỮ NGHỆ THUẬT)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Current Logo Preview */}
                  <div className="w-36 h-20 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center p-2 text-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-fleur-title font-bold text-base text-white">
                        {brandingForm.name}
                      </span>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>Tải Ảnh Logo Mới (.WebP Auto)</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => updateLogoUrl(null)}
                        className="ml-3 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                      >
                        Khôi phục Logo chữ mặc định
                      </button>
                    )}
                    <p className="text-[11px] text-white/50 font-mono">
                      Khuyến nghị ảnh PNG/WebP trong suốt (kích thước ~400x120px)
                    </p>
                  </div>
                </div>
              </div>

              {/* General Info Form */}
              <form onSubmit={handleSaveBranding} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-white block mb-1">Tên Thương Hiệu (Brand Wordmark) *</label>
                    <input
                      type="text"
                      required
                      value={brandingForm.name}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-white block mb-1">Slogan Tiếng Anh (Tagline)</label>
                    <input
                      type="text"
                      value={brandingForm.tagline}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-white block mb-1">Hotline Liên Hệ *</label>
                    <input
                      type="text"
                      required
                      value={brandingForm.phone}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-white block mb-1">Link Nhóm Zalo Bloom Daily *</label>
                    <input
                      type="url"
                      required
                      value={brandingForm.website ? "https://zalo.me/g/lbzvqb973" : "https://zalo.me/g/lbzvqb973"}
                      onChange={() => {}}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-white block mb-1">Địa Chỉ Atelier (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      value={brandingForm.addressVi}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, addressVi: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-white block mb-1">Thời Gian Hoạt Động (Tiếng Việt)</label>
                    <input
                      type="text"
                      value={brandingForm.hoursVi}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, hoursVi: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-white block mb-1">Email Liên Hệ</label>
                    <input
                      type="email"
                      value={brandingForm.email}
                      onChange={(e) => setBrandingForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu Cấu Hình Thương Hiệu</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

    </div>
  );
};
