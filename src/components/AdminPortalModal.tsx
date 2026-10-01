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
  Maximize2,
  Pin
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
    togglePinFlower,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
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
  const [isAddingWorkshop, setIsAddingWorkshop] = useState(false);
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

  // Handle Workshop Gallery Image Upload (4 Angles)
  const handleWorkshopGalleryImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
      setWorkshopForm((prev) => {
        const currentGallery = [...(prev.galleryImages || [])];
        while (currentGallery.length <= idx) {
          currentGallery.push({ url: '', captionVi: '', captionEn: '' });
        }
        currentGallery[idx] = {
          url: result.webpDataUrl,
          captionVi: currentGallery[idx]?.captionVi || `Góc ảnh #${idx + 1}`,
          captionEn: currentGallery[idx]?.captionEn || `Angle photo #${idx + 1}`
        };
        return { ...prev, galleryImages: currentGallery };
      });
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi nén ảnh góc chụp workshop.');
    } finally {
      setCompressing(false);
    }
  };

  // Open Flower Editor
  const startEditFlower = (flower: FlowerItem) => {
    setEditingFlower(flower);
    setIsAddingFlower(false);
    setFlowerForm({
      ...JSON.parse(JSON.stringify(flower)),
      pinnedToLanding: flower.pinnedToLanding !== false
    });
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
      pinnedToLanding: true,
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
    setIsAddingWorkshop(false);
    setWorkshopForm(JSON.parse(JSON.stringify(ws)));
    setLastCompression(null);
  };

  const startAddWorkshop = () => {
    setIsAddingWorkshop(true);
    setEditingWorkshop(null);
    setWorkshopForm({
      name: "BOUQUET SALON",
      latinMonographName: "Atelier Botanica Nova",
      titleVi: "WORKSHOP CẮM HOA NGHỆ THUẬT: SẮC MÀU THIÊN NHIÊN",
      titleEn: "BESPOKE BOTANICAL FLORAL WORKSHOP",
      subtitleVi: "Trải nghiệm mới mẻ · Gắn kết tự nhiên · Thảnh thơi tuyệt đối",
      subtitleEn: "A mindful sensory floral journey",
      editorialQuoteVi: "Một buổi chiều đắm mình cùng hoa lá giúp tái tạo nguồn năng lượng tươi mới sau chuỗi ngày bận rộn.",
      editorialQuoteEn: "An afternoon immersed in blooming stems restores vitality and cultivates harmony.",
      descriptionVi: "Trọn gói từ ý tưởng đến thực thi hoa tươi nhập khẩu và dụng cụ chuyên nghiệp.",
      descriptionEn: "Turnkey setup delivered directly with imported stems.",
      fullContentVi: [
        "Một buổi workshop cắm hoa nghệ thuật mang lại trải nghiệm tinh tế, nhẹ nhàng và dễ dàng thực hiện ngay tại văn phòng hoặc không gian chỉ định.",
        "Mọi khâu từ ý tưởng đến thực thi đều được JU đảm nhận trọn gói, giúp người tham gia hoàn toàn thảnh thơi.",
        "Khép lại ngày bận rộn bằng những khoảnh khắc thư thả và ngập tràn cảm hứng cùng cỏ hoa."
      ],
      fullContentEn: [
        "An artisanal floral workshop offers an intimate, mindful experience.",
        "Every single step from materials to facilitation is fully managed by JU et Saigon.",
        "Conclude your busy week with inspiring, restorative memories."
      ],
      highlightsVi: [
        "Trọn gói từ A-Z (hoa tươi nhập khẩu, kéo đồng, bình gốm, tạp dề linen)",
        "Tổ chức linh hoạt ngay tại văn phòng công ty hoặc tại Atelier JU et Saigon",
        "Có giảng viên hướng dẫn chuyên môn và hỗ trợ từng học viên"
      ],
      highlightsEn: [
        "All-inclusive turnkey setup",
        "Flexible location at your office or JU Atelier"
      ],
      duration: "1.5 – 2.0 Giờ",
      groupSize: "10 – 50+ Pax",
      locationVi: "Tận nơi tại Văn phòng đối tác hoặc Lầu 1, 31 Nguyễn Trãi, Q.1",
      locationEn: "On-site at partner office or Atelier 31 Nguyen Trai, D.1",
      pricePerPaxVnd: 750000,
      pricePerPaxUsd: 30,
      zaloCommunityUrl: "https://zalo.me/g/juetsaigon",
      hotline: "090 936 80 80",
      image: "/src/assets/images/juet_workshop_hero_1790840742512.jpg",
      galleryImages: [
        { url: "/src/assets/images/juet_workshop_hero_1790840742512.jpg", captionVi: "Toàn cảnh workshop", captionEn: "Overview" },
        { url: "/src/assets/images/juet_workshop_ranunculus_1790840772583.jpg", captionVi: "Học viên trải nghiệm cắm hoa", captionEn: "Hands-on experience" },
        { url: "/src/assets/images/juet_workshop_peony_1790840786968.jpg", captionVi: "Tác phẩm hoàn thiện", captionEn: "Finished floral piece" },
        { url: "/src/assets/images/juet_workshop_autumn_1790840801831.jpg", captionVi: "Không gian workshop ấm áp", captionEn: "Warm atelier ambiance" }
      ]
    });
    setLastCompression(null);
  };

  // Save Workshop
  const handleSaveWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingWorkshop) {
      addWorkshop(workshopForm as Omit<WorkshopItem, 'id' | 'indexNumber'>);
      alert('Đã thêm workshop mới thành công!');
    } else if (editingWorkshop) {
      updateWorkshop(editingWorkshop.id, workshopForm);
      alert('Đã cập nhật workshop thành công!');
    }
    setEditingWorkshop(null);
    setIsAddingWorkshop(false);
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

                    {/* Landing Page Pin Feature Card */}
                    <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-bold text-amber-300 text-sm flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={flowerForm.pinnedToLanding !== false}
                            onChange={(e) => setFlowerForm((prev) => ({ ...prev, pinnedToLanding: e.target.checked }))}
                            className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5 font-mono uppercase tracking-wide">
                            <Pin className="w-3.5 h-3.5 fill-amber-300" />
                            Ghim tác phẩm lên Landing Page (Lưới 12 sản phẩm nổi bật)
                          </span>
                        </label>
                        <p className="text-[11px] text-white/70 pl-6">
                          Khi bật, hệ thống sẽ đưa tác phẩm vào lưới 12 tuyệt tác tiêu biểu tại trang chủ. Toàn bộ các tác phẩm khác vẫn hiển thị đầy đủ trong "Bộ Sưu Tập" theo từng mùa và danh mục.
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                        flowerForm.pinnedToLanding !== false ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/40'
                      }`}>
                        {flowerForm.pinnedToLanding !== false ? 'Đang Ghim' : 'Không Ghim'}
                      </span>
                    </div>

                    {/* Category & Pricing & Seasonality */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
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
                        <label className="font-bold text-white block mb-1">Mùa Trong Năm (Season)</label>
                        <input
                          type="text"
                          placeholder="VD: Quanh năm, Mùa Xuân, Mùa Thu..."
                          value={flowerForm.seasonality || 'Quanh năm (Year-Round)'}
                          onChange={(e) => setFlowerForm((prev) => ({ ...prev, seasonality: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                        />
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

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300">
                        <Pin className="w-3.5 h-3.5 fill-amber-300" />
                        <span>Đang ghim: {flowers.filter(f => f.pinnedToLanding !== false).length} tác phẩm</span>
                      </div>

                      <button
                        onClick={startAddFlower}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Tác Phẩm Mới</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid of Flowers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFlowers.map((f) => {
                      const isPinned = f.pinnedToLanding !== false;

                      return (
                        <div
                          key={f.id}
                          className="bg-[#1e1f1c] rounded-xl p-3.5 border border-white/10 flex gap-3 items-center group hover:border-white/30 transition-all relative overflow-hidden"
                        >
                          <div className="w-16 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                            <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                            {isPinned && (
                              <div className="absolute top-1 left-1 bg-amber-400 text-black p-0.5 rounded shadow">
                                <Pin className="w-2.5 h-2.5 fill-black" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-amber-400">#{f.indexNumber}</span>
                              {isPinned && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                  Ghim Landing
                                </span>
                              )}
                            </div>
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
                              type="button"
                              onClick={() => togglePinFlower(f.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                isPinned
                                  ? 'bg-amber-400 text-[#141414] hover:bg-amber-300 shadow-sm'
                                  : 'bg-white/5 hover:bg-white/20 text-white/40 hover:text-white'
                              }`}
                              title={isPinned ? "Bỏ ghim khỏi Landing Page" : "Ghim lên Landing Page"}
                            >
                              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                            </button>
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKSHOPS CRUD */}
          {activeTab === 'workshops' && (
            <div className="space-y-6">
              {(editingWorkshop || isAddingWorkshop) ? (
                <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block">
                        {isAddingWorkshop ? 'MODULE WORKSHOP MỚI' : `CHỈNH SỬA WORKSHOP #${workshopForm.indexNumber || '01'}`}
                      </span>
                      <h3 className="text-xl font-bagerich font-bold uppercase text-white mt-0.5">
                        {isAddingWorkshop ? 'THÊM WORKSHOP MỚI VÀO BỘ SƯU TẬP' : `CHỈNH SỬA: ${workshopForm.name}`}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWorkshop(null);
                        setIsAddingWorkshop(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-xs hover:bg-white/20 transition-all font-mono text-white"
                    >
                      Quay Lại
                    </button>
                  </div>

                  <form onSubmit={handleSaveWorkshop} className="space-y-6 text-xs font-sans">
                    
                    {/* Auto-Compression WebP Alert */}
                    {lastCompression && (
                      <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-center gap-3 font-mono">
                        <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold">Ảnh workshop đã tự động nén sang .WebP thành công!</p>
                          <p className="text-[11px] opacity-80">
                            Gốc: {formatFileSize(lastCompression.originalSize)} → WebP: {formatFileSize(lastCompression.compressedSize)} (Tiết kiệm {lastCompression.compressionRatio}%)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Image Uploader for Workshop with Auto WebP */}
                    <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                          1. ẢNH POSTER ĐẠI DIỆN WORKSHOP (TỰ ĐỘNG NÉN SANG .WEBP)
                        </label>
                        {compressing && (
                          <span className="text-amber-400 font-mono text-[11px] animate-pulse">
                            Đang xử lý & nén ảnh sang WebP...
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 aspect-[3/4] max-w-[160px] rounded-lg overflow-hidden border border-white/20 bg-black">
                          <img src={workshopForm.image} alt="Workshop Poster" className="w-full h-full object-cover" />
                        </div>
                        <div className="sm:col-span-8 space-y-3">
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-400/60 bg-white/5 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-amber-300 mb-2" />
                            <span className="font-bold text-white text-xs">
                              Chọn ảnh poster mới từ thiết bị
                            </span>
                            <span className="text-[11px] text-white/60 font-mono mt-1">
                              Tự động nén sang WebP tối ưu tốc độ tải trang
                            </span>
                            <input type="file" accept="image/*" onChange={handleWorkshopImageUpload} className="hidden" />
                          </label>

                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-white/60 block">HOẶC DÁN ĐƯỜNG DẪN ẢNH:</span>
                            <input
                              type="text"
                              value={workshopForm.image || ''}
                              onChange={(e) =>
                                setWorkshopForm((prev) => ({ ...prev, image: e.target.value }))
                              }
                              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4 Multi-Image Gallery for Horizontal Slider */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                          2. BỘ 4 ẢNH TRƯỢT NGANG CHI TIẾT (GALLERY SLIDER 4 GÓC CHỤP)
                        </label>
                        <p className="text-[11px] text-white/60">
                          Khách hàng có thể trượt ngang vuốt xem 4 góc ảnh này khi bấm vào workshop.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[0, 1, 2, 3].map((idx) => {
                            const img = workshopForm.galleryImages?.[idx];
                            return (
                              <div key={idx} className="p-2 bg-black/50 rounded-lg border border-white/10 space-y-2">
                                <div className="aspect-[3/4] rounded overflow-hidden bg-black relative group">
                                  {img?.url ? (
                                    <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-mono">
                                      Trống
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[11px] font-mono">
                                    <Upload className="w-4 h-4 mb-1 text-amber-300" />
                                    <span>Thay ảnh</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleWorkshopGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  placeholder={`Chú thích góc #${idx + 1}`}
                                  value={img?.captionVi || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setWorkshopForm((prev) => {
                                      const current = [...(prev.galleryImages || [])];
                                      while (current.length <= idx) {
                                        current.push({ url: '', captionVi: '', captionEn: '' });
                                      }
                                      current[idx] = { ...current[idx], captionVi: val };
                                      return { ...prev, galleryImages: current };
                                    });
                                  }}
                                  className="w-full px-2 py-1 bg-black/70 border border-white/10 rounded text-[11px] text-white font-mono"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Tên Tiêu Đề Bagerich (In hoa) *</label>
                        <input
                          type="text"
                          required
                          value={workshopForm.name || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-bagerich text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Tên Phụ Latin / Monograph *</label>
                        <input
                          type="text"
                          required
                          value={workshopForm.latinMonographName || ''}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, latinMonographName: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
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
                      <label className="font-bold text-white block mb-1">Dòng Trích Dẫn / Thông Điệp Ngắn (Subtitle)</label>
                      <input
                        type="text"
                        value={workshopForm.subtitleVi || ''}
                        onChange={(e) => setWorkshopForm((prev) => ({ ...prev, subtitleVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Đoạn Văn Triết Lý Giới Thiệu (Hiển thị ngoài trang triển lãm) *</label>
                      <textarea
                        rows={3}
                        required
                        value={workshopForm.editorialQuoteVi || ''}
                        onChange={(e) => setWorkshopForm((prev) => ({ ...prev, editorialQuoteVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white leading-relaxed focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Thời Lượng</label>
                        <input
                          type="text"
                          value={workshopForm.duration || '1.5 – 2.0 Giờ'}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Quy Mô Nhóm</label>
                        <input
                          type="text"
                          value={workshopForm.groupSize || '10 – 50+ Pax'}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, groupSize: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Chi Phí Dự Kiến / Pax (VND)</label>
                        <input
                          type="number"
                          value={workshopForm.pricePerPaxVnd || 750000}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, pricePerPaxVnd: Number(e.target.value) }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Địa Điểm Tổ Chức</label>
                        <input
                          type="text"
                          value={workshopForm.locationVi || 'Tận nơi tại Văn phòng đối tác hoặc Atelier JU'}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, locationVi: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-white block mb-1">Link Tham Gia Nhóm Zalo</label>
                        <input
                          type="url"
                          value={workshopForm.zaloCommunityUrl || 'https://zalo.me/g/juetsaigon'}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, zaloCommunityUrl: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-white block mb-1">Hotline Tư Vấn Workshop</label>
                        <input
                          type="text"
                          value={workshopForm.hotline || '090 936 80 80'}
                          onChange={(e) => setWorkshopForm((prev) => ({ ...prev, hotline: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWorkshop(null);
                          setIsAddingWorkshop(false);
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
                        <span>{isAddingWorkshop ? 'Tạo Workshop Mới' : 'Lưu Thay Đổi Workshop'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Workshop Management Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#1e1f1c] rounded-2xl border border-white/10">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 block">
                        JU ET SAIGON · WORKSHOP BOTANICA
                      </span>
                      <h3 className="text-lg font-bagerich font-bold uppercase text-white mt-0.5">
                        DANH SÁCH WORKSHOP ĐANG HOẠT ĐỘNG ({workshops.length} MODULES)
                      </h3>
                      <p className="text-xs text-white/60">
                        Thêm mới hoặc chỉnh sửa các chương trình workshop cắm hoa dành cho doanh nghiệp
                      </p>
                    </div>

                    <button
                      onClick={startAddWorkshop}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Workshop Mới</span>
                    </button>
                  </div>

                  {/* Workshop Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workshops.map((ws) => (
                      <div
                        key={ws.id}
                        className="bg-[#1e1f1c] rounded-2xl p-5 border border-white/10 space-y-4 flex flex-col justify-between group hover:border-amber-400/40 transition-all shadow-lg"
                      >
                        <div className="space-y-3">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black relative">
                            <img src={ws.image} alt={ws.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono text-amber-300 font-bold">
                              #{ws.indexNumber}
                            </div>
                            {ws.galleryImages && ws.galleryImages.length > 0 && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-mono text-white/90">
                                {ws.galleryImages.length} Góc Ảnh
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block truncate">
                              {ws.latinMonographName}
                            </span>
                            <h4 className="font-bagerich font-bold text-xl uppercase text-white leading-tight mt-0.5 truncate">
                              {ws.name}
                            </h4>
                          </div>

                          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                            {ws.titleVi}
                          </p>

                          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-white/60">
                            <div>
                              <span className="text-white/40 block text-[9px]">THỜI LƯỢNG</span>
                              <span className="text-white font-medium">{ws.duration}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block text-[9px]">QUY MÔ</span>
                              <span className="text-white font-medium">{ws.groupSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => startEditWorkshop(ws)}
                            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-[#141414] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Chỉnh Sửa</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (workshops.length <= 1) {
                                alert('Hệ thống cần tối thiểu 1 workshop trong danh mục!');
                                return;
                              }
                              if (window.confirm(`Bạn có chắc muốn xóa workshop "${ws.name}"?`)) {
                                deleteWorkshop(ws.id);
                              }
                            }}
                            className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-300 transition-colors"
                            title="Xóa workshop này"
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
