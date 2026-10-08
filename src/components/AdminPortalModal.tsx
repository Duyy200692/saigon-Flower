import React, { useState, useEffect } from 'react';
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
  Pin,
  Instagram,
  Facebook,
  Globe,
  MessageCircle,
  ExternalLink,
  Share2,
  Link2,
  AtSign,
  Cloud,
  RefreshCw,
  Database,
  ShieldCheck,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Crop,
  Type
} from 'lucide-react';
import { useAtelier } from '../context/AtelierContext';
import { FlowerItem } from '../data/flowers';
import { WorkshopItem } from '../data/workshop';
import {
  compressAndConvertToWebP,
  convertUrlToWebP,
  isFacebookWebpageUrl,
  isFacebookCdnUrl,
  formatFileSize,
  CompressionResult
} from '../utils/imageOptimizer';
import {
  formatDisplayUppercase,
  formatTitleCase,
  formatBotanicalLatin,
  formatProseNFC
} from '../utils/textFormatter';
import { ImageStudioModal, AspectRatioPreset } from './ImageStudioModal';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'light',
  onToggleTheme
}) => {
  const isDark = theme === 'dark';
  const {
    flowers,
    workshops,
    atelierData,
    logoUrl,
    logoWhiteUrl,
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
    updateLogoWhiteUrl,
    adminPassword,
    changeAdminPassword,
    orders,
    workshopBookings,
    updateOrderStatus,
    deleteOrder,
    updateWorkshopBookingStatus,
    deleteWorkshopBooking,
    isCloudConnected,
    isSyncing,
    syncAllToCloud,
    resetAllData
  } = useAtelier();

  const [activeTab, setActiveTab] = useState<'flowers' | 'workshops' | 'orders' | 'branding' | 'security'>('flowers');
  const [crmSubTab, setCrmSubTab] = useState<'floral_orders' | 'workshop_bookings'>('floral_orders');
  const [adminNoteDrafts, setAdminNoteDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Security / Password State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passChangeMsg, setPassChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);
  
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

  useEffect(() => {
    if (isOpen) {
      setBrandingForm(atelierData);
    }
  }, [isOpen, atelierData]);
  
  // Compression status feedback
  const [compressing, setCompressing] = useState(false);
  const [lastCompression, setLastCompression] = useState<CompressionResult | null>(null);
  const [imageUrlWarning, setImageUrlWarning] = useState<string | null>(null);

  // Interactive Image Framing Studio state
  const [autoOpenStudioOnUpload, setAutoOpenStudioOnUpload] = useState<boolean>(true);
  const [studioState, setStudioState] = useState<{
    isOpen: boolean;
    imageSource: string | null;
    title: string;
    defaultAspectRatio: AspectRatioPreset;
    onApply: (result: CompressionResult) => void;
  }>({
    isOpen: false,
    imageSource: null,
    title: '',
    defaultAspectRatio: '3:4',
    onApply: () => {}
  });

  const openImageStudio = (
    imageSource: string | undefined | null,
    title: string,
    onApply: (result: CompressionResult) => void,
    defaultAspectRatio: AspectRatioPreset = '3:4'
  ) => {
    if (!imageSource) return;
    setStudioState({
      isOpen: true,
      imageSource,
      title,
      defaultAspectRatio,
      onApply
    });
  };

  if (!isOpen) return null;

  // Helper to apply main flower image and optionally open ImageStudioModal
  const applyFlowerMainImageResult = (result: CompressionResult, shouldOpenStudio = autoOpenStudioOnUpload) => {
    setFlowerForm((prev) => ({
      ...prev,
      image: result.webpDataUrl,
      galleryImages: [
        {
          url: result.webpDataUrl,
          captionVi: prev.galleryImages?.[0]?.captionVi || 'Góc nhìn toàn cảnh',
          captionEn: prev.galleryImages?.[0]?.captionEn || 'Full architectural view'
        },
        ...(prev.galleryImages?.slice(1) || [])
      ]
    }));
    setLastCompression(result);

    if (shouldOpenStudio) {
      openImageStudio(
        result.webpDataUrl,
        'Căn Chỉnh Khung Hình: Ảnh Đại Diện Chính',
        (framedRes) => {
          setFlowerForm((prev) => ({
            ...prev,
            image: framedRes.webpDataUrl,
            galleryImages: [
              {
                url: framedRes.webpDataUrl,
                captionVi: prev.galleryImages?.[0]?.captionVi || 'Góc nhìn toàn cảnh',
                captionEn: prev.galleryImages?.[0]?.captionEn || 'Full architectural view'
              },
              ...(prev.galleryImages?.slice(1) || [])
            ]
          }));
          setLastCompression(framedRes);
        },
        '3:4'
      );
    }
  };

  // Helper to apply flower gallery angle image and optionally open ImageStudioModal
  const applyFlowerGalleryImageResult = (
    index: number,
    result: CompressionResult,
    shouldOpenStudio = autoOpenStudioOnUpload
  ) => {
    const updateAtSlot = (res: CompressionResult) => {
      setFlowerForm((prev) => {
        const currentGallery = [...(prev.galleryImages || [])];
        while (currentGallery.length <= index) {
          currentGallery.push({
            url: '',
            captionVi: `Góc chụp chi tiết 0${currentGallery.length + 1}`,
            captionEn: `Detailed angle 0${currentGallery.length + 1}`
          });
        }
        currentGallery[index] = {
          ...currentGallery[index],
          url: res.webpDataUrl
        };
        return {
          ...prev,
          ...(index === 0 ? { image: res.webpDataUrl } : {}),
          galleryImages: currentGallery
        };
      });
      setLastCompression(res);
    };

    updateAtSlot(result);

    if (shouldOpenStudio) {
      openImageStudio(
        result.webpDataUrl,
        `Căn Chỉnh Khung Hình: Góc Chụp 0${index + 1}`,
        (framedRes) => updateAtSlot(framedRes),
        '3:4'
      );
    }
  };

  // Helper to apply main workshop image and optionally open ImageStudioModal
  const applyWorkshopMainImageResult = (result: CompressionResult, shouldOpenStudio = autoOpenStudioOnUpload) => {
    const updateMainWs = (res: CompressionResult) => {
      setWorkshopForm((prev) => ({
        ...prev,
        image: res.webpDataUrl,
        galleryImages: [
          {
            url: res.webpDataUrl,
            captionVi: prev.galleryImages?.[0]?.captionVi || 'Poster chính thức',
            captionEn: prev.galleryImages?.[0]?.captionEn || 'Official visual'
          },
          ...(prev.galleryImages?.slice(1) || [])
        ]
      }));
      setLastCompression(res);
    };

    updateMainWs(result);

    if (shouldOpenStudio) {
      openImageStudio(
        result.webpDataUrl,
        'Căn Chỉnh Khung Hình: Poster Workshop',
        (framedRes) => updateMainWs(framedRes),
        '3:4'
      );
    }
  };

  // Helper to apply workshop gallery angle image and optionally open ImageStudioModal
  const applyWorkshopGalleryImageResult = (
    idx: number,
    result: CompressionResult,
    shouldOpenStudio = autoOpenStudioOnUpload
  ) => {
    const updateWsSlot = (res: CompressionResult) => {
      setWorkshopForm((prev) => {
        const currentGallery = [...(prev.galleryImages || [])];
        while (currentGallery.length <= idx) {
          currentGallery.push({
            url: '',
            captionVi: `Góc ảnh #${currentGallery.length + 1}`,
            captionEn: `Angle photo #${currentGallery.length + 1}`
          });
        }
        currentGallery[idx] = {
          ...currentGallery[idx],
          url: res.webpDataUrl,
          captionVi: currentGallery[idx]?.captionVi || `Góc ảnh #${idx + 1}`,
          captionEn: currentGallery[idx]?.captionEn || `Angle photo #${idx + 1}`
        };
        return {
          ...prev,
          ...(idx === 0 ? { image: res.webpDataUrl } : {}),
          galleryImages: currentGallery
        };
      });
      setLastCompression(res);
    };

    updateWsSlot(result);

    if (shouldOpenStudio) {
      openImageStudio(
        result.webpDataUrl,
        `Căn Chỉnh Khung Hình: Góc Ảnh Workshop #${idx + 1}`,
        (framedRes) => updateWsSlot(framedRes),
        '3:4'
      );
    }
  };

  // Handle Clipboard Paste (Ctrl+V) for Flower Image
  const handleFlowerPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;
        try {
          setCompressing(true);
          setImageUrlWarning(null);
          const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
          applyFlowerMainImageResult(result);
        } catch (err) {
          console.error(err);
          setImageUrlWarning('Không thể xử lý ảnh từ bộ nhớ tạm.');
        } finally {
          setCompressing(false);
        }
        return;
      }
    }
  };

  // Convert Pasted Flower URL to Permanent WebP
  const handleConvertFlowerUrl = async (urlToConvert?: string) => {
    const targetUrl = (urlToConvert ?? flowerForm.image ?? '').trim();
    if (!targetUrl || targetUrl.startsWith('data:image/') || targetUrl.startsWith('/src/')) return;

    try {
      setCompressing(true);
      setImageUrlWarning(null);
      const result = await convertUrlToWebP(targetUrl, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyFlowerMainImageResult(result);
    } catch (err: any) {
      setImageUrlWarning(err?.message || 'Không thể tải ảnh từ đường dẫn này.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Clipboard Paste (Ctrl+V) for Workshop Image
  const handleWorkshopPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;
        try {
          setCompressing(true);
          setImageUrlWarning(null);
          const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
          applyWorkshopMainImageResult(result);
        } catch (err) {
          console.error(err);
          setImageUrlWarning('Không thể xử lý ảnh từ bộ nhớ tạm.');
        } finally {
          setCompressing(false);
        }
        return;
      }
    }
  };

  // Convert Pasted Workshop URL to Permanent WebP
  const handleConvertWorkshopUrl = async (urlToConvert?: string) => {
    const targetUrl = (urlToConvert ?? workshopForm.image ?? '').trim();
    if (!targetUrl || targetUrl.startsWith('data:image/') || targetUrl.startsWith('/src/')) return;

    try {
      setCompressing(true);
      setImageUrlWarning(null);
      const result = await convertUrlToWebP(targetUrl, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyWorkshopMainImageResult(result);
    } catch (err: any) {
      setImageUrlWarning(err?.message || 'Không thể tải ảnh từ đường dẫn này.');
    } finally {
      setCompressing(false);
    }
  };

  // Convert Pasted Flower Gallery Angle URL to Permanent WebP
  const handleConvertGalleryUrl = async (index: number, urlToConvert?: string) => {
    const targetUrl = (urlToConvert ?? flowerForm.galleryImages?.[index]?.url ?? '').trim();
    if (!targetUrl || targetUrl.startsWith('data:image/') || targetUrl.startsWith('/src/')) return;

    try {
      setCompressing(true);
      setImageUrlWarning(null);
      const result = await convertUrlToWebP(targetUrl, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyFlowerGalleryImageResult(index, result);
    } catch (err: any) {
      setImageUrlWarning(err?.message || 'Không thể tải ảnh góc chụp từ đường dẫn này.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Clipboard Paste (Ctrl+V) for a specific Flower Gallery Angle slot
  const handleGalleryPaste = async (index: number, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        if (!file) continue;
        try {
          setCompressing(true);
          setImageUrlWarning(null);
          const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
          applyFlowerGalleryImageResult(index, result);
        } catch (err) {
          console.error(err);
          setImageUrlWarning('Không thể xử lý ảnh từ bộ nhớ tạm.');
        } finally {
          setCompressing(false);
        }
        return;
      }
    }
  };

  // Convert Pasted Workshop Gallery Angle URL to Permanent WebP
  const handleConvertWorkshopGalleryUrl = async (idx: number, urlToConvert?: string) => {
    const targetUrl = (urlToConvert ?? workshopForm.galleryImages?.[idx]?.url ?? '').trim();
    if (!targetUrl || targetUrl.startsWith('data:image/') || targetUrl.startsWith('/src/')) return;

    try {
      setCompressing(true);
      setImageUrlWarning(null);
      const result = await convertUrlToWebP(targetUrl, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyWorkshopGalleryImageResult(idx, result);
    } catch (err: any) {
      setImageUrlWarning(err?.message || 'Không thể tải ảnh góc chụp workshop từ đường dẫn này.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Clipboard Paste (Ctrl+V) for a specific Workshop Gallery Angle slot
  const handleWorkshopGalleryPaste = async (idx: number, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        if (!file) continue;
        try {
          setCompressing(true);
          setImageUrlWarning(null);
          const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
          applyWorkshopGalleryImageResult(idx, result);
        } catch (err) {
          console.error(err);
          setImageUrlWarning('Không thể xử lý ảnh từ bộ nhớ tạm.');
        } finally {
          setCompressing(false);
        }
        return;
      }
    }
  };

  // Handle Logo Đen (Light Mode) Upload with Auto WebP Conversion
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
      alert('Không thể nén ảnh Logo Đen. Vui lòng thử lại.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Logo Trắng (Dark Mode) Upload with Auto WebP Conversion
  const handleLogoWhiteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressing(true);
      const result = await compressAndConvertToWebP(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      updateLogoWhiteUrl(result.webpDataUrl);
      setLastCompression(result);
    } catch (err) {
      console.error(err);
      alert('Không thể nén ảnh Logo Trắng. Vui lòng thử lại.');
    } finally {
      setCompressing(false);
    }
  };

  // Handle Clipboard Paste (Ctrl+V) for Logo Đen or Logo Trắng
  const handleLogoPaste = async (variant: 'dark' | 'white', e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;
        try {
          setCompressing(true);
          const result = await compressAndConvertToWebP(file, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
          if (variant === 'dark') {
            updateLogoUrl(result.webpDataUrl);
          } else {
            updateLogoWhiteUrl(result.webpDataUrl);
          }
          setLastCompression(result);
        } catch (err) {
          console.error(err);
        } finally {
          setCompressing(false);
        }
        return;
      }
    }
  };

  // Convert Pasted Logo URL to Permanent WebP
  const handleConvertLogoUrl = async (variant: 'dark' | 'white', urlToConvert?: string | null) => {
    const targetUrl = (urlToConvert ?? '').trim();
    if (!targetUrl || targetUrl.startsWith('data:image/') || targetUrl.startsWith('/src/')) return;

    try {
      setCompressing(true);
      const result = await convertUrlToWebP(targetUrl, { maxWidth: 600, maxHeight: 600, quality: 0.9 });
      if (variant === 'dark') {
        updateLogoUrl(result.webpDataUrl);
      } else {
        updateLogoWhiteUrl(result.webpDataUrl);
      }
      setLastCompression(result);
    } catch (err: any) {
      alert(err?.message || 'Không thể tải logo từ đường dẫn này.');
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
      setImageUrlWarning(null);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyFlowerMainImageResult(result);
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
      setImageUrlWarning(null);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyFlowerGalleryImageResult(index, result);
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
      setImageUrlWarning(null);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyWorkshopMainImageResult(result);
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
      setImageUrlWarning(null);
      const result = await compressAndConvertToWebP(file, { maxWidth: 1100, maxHeight: 1100, quality: 0.82 });
      applyWorkshopGalleryImageResult(idx, result);
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
    <div
      className={`fixed inset-0 z-60 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn transition-colors duration-300 ${
        isDark
          ? 'bg-[#0f100e]/95 text-[#ede9df] admin-theme-dark'
          : 'bg-[#dcd8cf] text-[#141414] admin-theme-light'
      }`}
    >
      
      {/* Top Admin Header (Responsive: Shows 4 Navigation Tabs + Light/Dark Toggle on BOTH Mobile & Desktop) */}
      <header
        className={`border-b px-3 sm:px-8 py-2.5 sm:py-3 flex flex-col gap-2.5 flex-shrink-0 transition-colors duration-300 ${
          isDark
            ? 'bg-[#181917] border-white/15 text-white'
            : 'bg-[#e8e4dc] border-[#141414]/15 text-[#141414]'
        }`}
      >
        {/* Top Row: Brand Badge + Desktop Tabs + Action Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                isDark
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'bg-[#141414] text-amber-300'
              }`}
            >
              AD
            </div>
            <div className="min-w-0">
              <h2
                className={`text-xs sm:text-sm font-bold font-mono uppercase tracking-wider truncate ${
                  isDark ? 'text-white' : 'text-[#141414]'
                }`}
              >
                JU ET SAIGON · BẢNG QUẢN TRỊ ADMIN
              </h2>
              <p
                className={`hidden sm:block text-[10px] font-sans truncate ${
                  isDark ? 'text-white/60' : 'text-[#141414]/65'
                }`}
              >
                Quản lý tác phẩm hoa · Dịch vụ Workshop · Thay đổi logo & thông tin thương hiệu
              </p>
            </div>
          </div>

          {/* Desktop Tab Navigation (lg and up) */}
          <div
            className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border text-xs font-medium shrink-0 ${
              isDark
                ? 'bg-black/40 border-white/10'
                : 'bg-[#dcd8cf] border-[#141414]/15'
            }`}
          >
            <button
              onClick={() => {
                setActiveTab('flowers');
                setEditingFlower(null);
                setIsAddingFlower(false);
              }}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'flowers'
                  ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-[#141414]/75 hover:text-[#141414] hover:bg-white/60'
              }`}
            >
              Tác Phẩm Hoa ({flowers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('workshops');
                setEditingWorkshop(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'workshops'
                  ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-[#141414]/75 hover:text-[#141414] hover:bg-white/60'
              }`}
            >
              Workshop ({workshops.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-[#141414]/75 hover:text-[#141414] hover:bg-white/60'
              }`}
            >
              <span>Đơn Hàng & Lịch Hẹn ({orders.length + workshopBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'branding'
                  ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-[#141414]/75 hover:text-[#141414] hover:bg-white/60'
              }`}
            >
              Logo, Thông Tin & Social
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                  : isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-[#141414]/75 hover:text-[#141414] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo Mật & Mật Khẩu</span>
            </button>
          </div>

          {/* Actions (Includes Light/Dark Mode Toggle, Cloud Sync, Reset, Logout, Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Light / Dark Mode Switcher inside Admin */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                  isDark
                    ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
                    : 'bg-white text-[#141414] border-[#141414]/20 hover:bg-[#141414] hover:text-[#f7f5f0]'
                }`}
                title={
                  isDark
                    ? 'Đang ở nền Tối (Dark Mode) — Bấm để chuyển sang nền Sáng (Light Mode)'
                    : 'Đang ở nền Sáng (Light Mode) — Bấm để chuyển sang nền Tối (Dark Mode)'
                }
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Cloud Sync Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await syncAllToCloud();
                  alert('Đã đồng bộ toàn bộ tác phẩm hoa, workshop & cấu hình lên Firebase Firestore thành công!');
                } catch (e) {
                  console.error(e);
                  alert('Đang gửi dữ liệu lên Firebase Firestore...');
                }
              }}
              disabled={isSyncing}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono uppercase flex items-center gap-1.5 transition-all shadow-sm ${
                isCloudConnected
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-emerald-600/15 text-emerald-900 border-emerald-600/35 hover:bg-emerald-600/25 font-bold'
                  : isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-amber-500/20 text-amber-900 border-amber-600/35 hover:bg-amber-500/30 font-bold'
              }`}
              title="Đồng bộ dữ liệu lên Firebase Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Đang đồng bộ...' : isCloudConnected ? 'Cloud Online' : 'Đồng Bộ Firebase'}
              </span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu gốc ban đầu của JU et Saigon?')) {
                  resetAllData();
                  alert('Đã khôi phục dữ liệu mặc định!');
                }
              }}
              className={`p-2 text-xs font-mono rounded-lg border transition-colors ${
                isDark
                  ? 'border-white/10 hover:border-amber-400/50 text-white/60 hover:text-amber-300'
                  : 'border-[#141414]/15 bg-white/60 hover:bg-white text-[#141414]/70 hover:text-[#141414]'
              }`}
              title="Khôi phục dữ liệu gốc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono uppercase flex items-center gap-1 transition-all ${
                isDark
                  ? 'bg-red-900/40 hover:bg-red-900/80 text-red-200 border-red-500/30'
                  : 'bg-red-600/10 hover:bg-red-600 text-red-800 hover:text-white border-red-600/25 font-bold'
              }`}
              title="Đăng xuất quản trị"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-[#141414]/10 hover:bg-[#141414]/20 text-[#141414]'
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Tab Navigation Bar (Visible on screens < lg so mobile users see all 5 tabs clearly) */}
        <div
          className={`lg:hidden grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 rounded-xl border text-[11px] sm:text-xs font-medium ${
            isDark
              ? 'bg-black/50 border-white/15'
              : 'bg-[#dcd8cf] border-[#141414]/15'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('flowers');
              setEditingFlower(null);
              setIsAddingFlower(false);
            }}
            className={`px-2.5 py-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'flowers'
                ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                : isDark
                  ? 'text-white/80 hover:text-white bg-white/5'
                  : 'text-[#141414]/80 hover:text-[#141414] bg-white/60'
            }`}
          >
            Tác Phẩm Hoa ({flowers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('workshops');
              setEditingWorkshop(null);
              setIsAddingWorkshop(false);
            }}
            className={`px-2.5 py-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'workshops'
                ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                : isDark
                  ? 'text-white/80 hover:text-white bg-white/5'
                  : 'text-[#141414]/80 hover:text-[#141414] bg-white/60'
            }`}
          >
            Workshop ({workshops.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-2.5 py-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                : isDark
                  ? 'text-white/80 hover:text-white bg-white/5'
                  : 'text-[#141414]/80 hover:text-[#141414] bg-white/60'
            }`}
          >
            Đơn Hàng ({orders.length + workshopBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-2.5 py-2 rounded-lg transition-all text-center truncate ${
              activeTab === 'branding'
                ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                : isDark
                  ? 'text-white/80 hover:text-white bg-white/5'
                  : 'text-[#141414]/80 hover:text-[#141414] bg-white/60'
            }`}
          >
            Logo, Thông Tin & Social
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-2 rounded-lg transition-all flex items-center justify-center gap-1 truncate ${
              activeTab === 'security'
                ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                : isDark
                  ? 'text-white/80 hover:text-white bg-white/5'
                  : 'text-[#141414]/80 hover:text-[#141414] bg-white/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bảo Mật & Mật Khẩu</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDark ? 'text-[#ede9df]' : 'text-[#141414]'}`}>
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
                    <div
                      onPaste={handleFlowerPaste}
                      className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300">
                          1. ẢNH ĐẠI DIỆN CHÍNH (HỖ TRỢ TẢI FILE, DÁN CTRL+V TỪ FACEBOOK, HOẶC LINK ẢNH)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-[11px] font-mono text-white/80 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoOpenStudioOnUpload}
                              onChange={(e) => setAutoOpenStudioOnUpload(e.target.checked)}
                              className="accent-amber-400 rounded cursor-pointer"
                            />
                            <span>Tự mở khung căn chỉnh tỉ lệ khi tải ảnh</span>
                          </label>
                          {compressing && (
                            <span className="text-amber-400 font-mono text-[11px] animate-pulse">
                              Đang xử lý & nén sang WebP...
                            </span>
                          )}
                        </div>
                      </div>

                      {imageUrlWarning && (
                        <div className="p-3 bg-amber-950/80 border border-amber-400/50 rounded-xl text-amber-200 flex items-start gap-2.5 text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-amber-300">{imageUrlWarning}</p>
                            <p className="text-[11px] text-white/80">
                              💡 <strong>Mẹo lấy ảnh từ Facebook không bao giờ lỗi:</strong> Nhấp chuột phải vào ảnh trên Facebook ➔ Chọn <strong>"Sao chép hình ảnh" (Copy image)</strong> ➔ Quay lại khung này và bấm <strong>Ctrl + V</strong>!
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 space-y-2">
                          <div className="aspect-[3/4] max-w-[160px] rounded-lg overflow-hidden border border-white/20 bg-black relative group">
                            <img
                              src={flowerForm.image}
                              alt="Preview"
                              referrerPolicy="no-referrer"
                              onError={() => {
                                if (flowerForm.image && !flowerForm.image.startsWith('data:')) {
                                  setImageUrlWarning(
                                    isFacebookWebpageUrl(flowerForm.image)
                                      ? 'Bạn đang dán link trang bài viết Facebook (không phải link file ảnh).'
                                      : 'Link ảnh bị chặn hiển thị hoặc đã hết hạn chữ ký bảo mật.'
                                  );
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                            {flowerForm.image && (
                              <button
                                type="button"
                                onClick={() =>
                                  openImageStudio(
                                    flowerForm.image,
                                    'Căn Chỉnh Khung Hình: Ảnh Đại Diện Chính',
                                    (res) => {
                                      setFlowerForm((prev) => ({
                                        ...prev,
                                        image: res.webpDataUrl,
                                        galleryImages: [
                                          {
                                            url: res.webpDataUrl,
                                            captionVi: prev.galleryImages?.[0]?.captionVi || 'Góc nhìn toàn cảnh',
                                            captionEn: prev.galleryImages?.[0]?.captionEn || 'Full architectural view'
                                          },
                                          ...(prev.galleryImages?.slice(1) || [])
                                        ]
                                      }));
                                      setLastCompression(res);
                                    },
                                    '3:4'
                                  )
                                }
                                className="absolute inset-x-1.5 bottom-1.5 py-1.5 px-2 rounded-md bg-amber-400 text-[#141414] font-mono text-[10px] font-bold uppercase flex items-center justify-center gap-1 shadow-lg hover:bg-amber-300 transition-all"
                              >
                                <Crop className="w-3 h-3" />
                                <span>Chỉnh Khung Hình</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-8 space-y-3">
                          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-400/60 bg-white/5 cursor-pointer transition-colors text-center">
                            <Upload className="w-6 h-6 text-amber-300 mb-1.5" />
                            <span className="font-bold text-white text-xs">
                              Chọn ảnh từ máy tính HOẶC bấm Ctrl + V để dán ảnh vừa Copy từ Facebook
                            </span>
                            <span className="text-[11px] text-white/60 font-mono mt-1">
                              Tự động nén & chuyển đổi tức thì sang định dạng .WebP lưu vĩnh viễn trên Firebase
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFlowerImageUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-white/60">
                                HOẶC DÁN ĐỊA CHỈ ẢNH TRỰC TIẾP (COPY IMAGE ADDRESS):
                              </span>
                              {flowerForm.image &&
                                !flowerForm.image.startsWith('data:image/') &&
                                !flowerForm.image.startsWith('/src/') && (
                                  <button
                                    type="button"
                                    disabled={compressing}
                                    onClick={() => handleConvertFlowerUrl(flowerForm.image)}
                                    className="px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[10px] font-bold transition-all"
                                  >
                                    ⚡ Chuyển Link này sang .WebP vĩnh viễn
                                  </button>
                                )}
                            </div>
                            <input
                              type="text"
                              placeholder="Dán link ảnh trực tiếp hoặc nhấn Ctrl+V để dán hình ảnh..."
                              value={flowerForm.image || ''}
                              onPaste={handleFlowerPaste}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (isFacebookWebpageUrl(val)) {
                                  setImageUrlWarning(
                                    'Đây là link trang bài viết Facebook (facebook.com/photo...), không phải file ảnh trực tiếp.'
                                  );
                                } else if (isFacebookCdnUrl(val)) {
                                  setImageUrlWarning(
                                    'Link ảnh Facebook (fbcdn.net) sẽ tự hết hạn sau vài ngày. Hãy bấm nút "⚡ Chuyển Link này sang .WebP vĩnh viễn" bên trên để lưu ảnh vĩnh viễn!'
                                  );
                                } else {
                                  setImageUrlWarning(null);
                                }
                                setFlowerForm((prev) => ({
                                  ...prev,
                                  image: val,
                                  galleryImages: [
                                    {
                                      url: val,
                                      captionVi: prev.galleryImages?.[0]?.captionVi || 'Góc nhìn toàn cảnh',
                                      captionEn: prev.galleryImages?.[0]?.captionEn || 'Full architectural view'
                                    },
                                    ...(prev.galleryImages?.slice(1) || [])
                                  ]
                                }));
                              }}
                              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4 Multi-Image Gallery Uploader */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                            2. BỘ SƯU TẬP 4 GÓC CHỤP CHI TIẾT (TẢI FILE MÁY HOẶC DÁN LINK FACEBOOK / CTRL+V CHO TỪNG GÓC)
                          </label>
                          <span className="text-[10px] font-mono text-white/50">
                            Không có ảnh gốc trên máy? Dán link ảnh Facebook hoặc bấm Ctrl+V vào từng ô góc chụp bên dưới
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {[0, 1, 2, 3].map((idx) => {
                            const img = flowerForm.galleryImages?.[idx];
                            const hasExternalUrl =
                              img?.url &&
                              !img.url.startsWith('data:image/') &&
                              !img.url.startsWith('/src/');
                            return (
                              <div
                                key={idx}
                                onPaste={(e) => handleGalleryPaste(idx, e)}
                                className="p-2.5 bg-black/50 rounded-xl border border-white/15 space-y-2"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/90">
                                  <span className="font-bold">GÓC CHỤP 0{idx + 1}</span>
                                  <label className="cursor-pointer px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-colors">
                                    + File máy
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black relative group border border-white/10">
                                  {img?.url ? (
                                    <img
                                      src={img.url}
                                      alt={`Gallery ${idx}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                                      Góc 0{idx + 1}
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-mono text-amber-300 text-center p-2">
                                    <Upload className="w-4 h-4 mb-1" />
                                    <span>Chọn file từ máy hoặc bấm Ctrl+V</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                  {img?.url && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openImageStudio(
                                          img.url,
                                          `Căn Chỉnh Khung Hình: Góc Chụp 0${idx + 1}`,
                                          (res) => {
                                            setFlowerForm((prev) => {
                                              const current = [...(prev.galleryImages || [])];
                                              while (current.length <= idx) {
                                                current.push({
                                                  url: '',
                                                  captionVi: `Góc chụp 0${current.length + 1}`,
                                                  captionEn: `Angle 0${current.length + 1}`
                                                });
                                              }
                                              current[idx] = { ...current[idx], url: res.webpDataUrl };
                                              return {
                                                ...prev,
                                                ...(idx === 0 ? { image: res.webpDataUrl } : {}),
                                                galleryImages: current
                                              };
                                            });
                                            setLastCompression(res);
                                          },
                                          '3:4'
                                        );
                                      }}
                                      className="absolute bottom-1.5 inset-x-1.5 z-10 py-1 px-2 rounded bg-amber-400/95 hover:bg-amber-300 text-[#141414] font-mono text-[9px] font-bold uppercase flex items-center justify-center gap-1 shadow"
                                    >
                                      <Crop className="w-2.5 h-2.5" />
                                      <span>Chỉnh Khung Góc 0{idx + 1}</span>
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-amber-300/80 block uppercase">
                                    🔗 Link ảnh góc 0{idx + 1} (Facebook / Web):
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={`Dán link ảnh hoặc Ctrl+V góc 0${idx + 1}...`}
                                    value={img?.url || ''}
                                    onPaste={(e) => handleGalleryPaste(idx, e)}
                                    onChange={(e) => {
                                      const urlVal = e.target.value;
                                      if (isFacebookWebpageUrl(urlVal)) {
                                        setImageUrlWarning(
                                          `Góc 0${idx + 1}: Đây là link bài viết Facebook, không phải link file ảnh trực tiếp.`
                                        );
                                      }
                                      setFlowerForm((prev) => {
                                        const current = [...(prev.galleryImages || [])];
                                        while (current.length <= idx) {
                                          current.push({
                                            url: '',
                                            captionVi: `Góc chụp 0${current.length + 1}`,
                                            captionEn: `Angle 0${current.length + 1}`
                                          });
                                        }
                                        current[idx] = { ...current[idx], url: urlVal };
                                        return {
                                          ...prev,
                                          ...(idx === 0 ? { image: urlVal } : {}),
                                          galleryImages: current
                                        };
                                      });
                                    }}
                                    className="w-full px-2 py-1.5 bg-black/70 border border-white/15 rounded text-[10px] text-white font-mono focus:border-amber-400 focus:outline-none"
                                  />
                                  {hasExternalUrl && (
                                    <button
                                      type="button"
                                      disabled={compressing}
                                      onClick={() => handleConvertGalleryUrl(idx, img?.url)}
                                      className="w-full py-1 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[10px] font-bold transition-all"
                                    >
                                      ⚡ Nạp & Nén Link sang .WebP
                                    </button>
                                  )}
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono text-white/50 block uppercase mb-0.5">
                                    Chú thích góc 0{idx + 1}:
                                  </label>
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
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Basic Info Fields with Automatic Title Case / Uppercase Synchronization */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5" />
                          <span>Định Danh & Tự Động Chuẩn Hóa Chữ Hoa / Chữ Thường Theo Tiêu Đề</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFlowerForm((prev) => ({
                              ...prev,
                              name: formatDisplayUppercase(prev.name),
                              vietnameseName: formatTitleCase(prev.vietnameseName),
                              latinName: formatBotanicalLatin(prev.latinName),
                              storyVi: formatProseNFC(prev.storyVi),
                              storyEn: formatProseNFC(prev.storyEn)
                            }))
                          }
                          className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-[#141414] border border-amber-400/40 font-mono text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>✨ Chuẩn Hóa Tự Động Tên & Tiêu Đề</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tên Tác Phẩm (Tự động In Hoa) *
                          </label>
                          <input
                            type="text"
                            required
                            value={flowerForm.name || ''}
                            onChange={(e) => setFlowerForm((prev) => ({ ...prev, name: e.target.value }))}
                            onBlur={(e) =>
                              setFlowerForm((prev) => ({ ...prev, name: formatDisplayUppercase(e.target.value) }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-bagerich focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tên Tiếng Việt (Tự động Hoa Đầu Từ) *
                          </label>
                          <input
                            type="text"
                            required
                            value={flowerForm.vietnameseName || ''}
                            onChange={(e) => setFlowerForm((prev) => ({ ...prev, vietnameseName: e.target.value }))}
                            onBlur={(e) =>
                              setFlowerForm((prev) => ({
                                ...prev,
                                vietnameseName: formatTitleCase(e.target.value)
                              }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tên Danh Pháp La Tinh (Chuẩn Thực Vật) *
                          </label>
                          <input
                            type="text"
                            required
                            value={flowerForm.latinName || ''}
                            onChange={(e) => setFlowerForm((prev) => ({ ...prev, latinName: e.target.value }))}
                            onBlur={(e) =>
                              setFlowerForm((prev) => ({
                                ...prev,
                                latinName: formatBotanicalLatin(e.target.value)
                              }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-editorial-serif italic focus:border-amber-400 focus:outline-none"
                          />
                        </div>
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
                    <div
                      onPaste={handleWorkshopPaste}
                      className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                          1. ẢNH POSTER ĐẠI DIỆN WORKSHOP (HỖ TRỢ TẢI FILE, CTRL+V TỪ FACEBOOK, HOẶC LINK ẢNH)
                        </label>
                        {compressing && (
                          <span className="text-amber-400 font-mono text-[11px] animate-pulse">
                            Đang xử lý & nén ảnh sang WebP...
                          </span>
                        )}
                      </div>

                      {imageUrlWarning && (
                        <div className="p-3 bg-amber-950/80 border border-amber-400/50 rounded-xl text-amber-200 flex items-start gap-2.5 text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-amber-300">{imageUrlWarning}</p>
                            <p className="text-[11px] text-white/80">
                              💡 <strong>Mẹo lấy ảnh từ Facebook:</strong> Nhấp chuột phải vào ảnh trên Facebook ➔ Chọn <strong>"Sao chép hình ảnh" (Copy image)</strong> ➔ Quay lại khung này và bấm <strong>Ctrl + V</strong>!
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 aspect-[3/4] max-w-[160px] rounded-lg overflow-hidden border border-white/20 bg-black relative group">
                          <img
                            src={workshopForm.image}
                            alt="Workshop Poster"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {workshopForm.image && (
                            <button
                              type="button"
                              onClick={() =>
                                openImageStudio(
                                  workshopForm.image,
                                  'Căn Chỉnh Khung Hình: Poster Workshop',
                                  (res) => {
                                    setWorkshopForm((prev) => ({
                                      ...prev,
                                      image: res.webpDataUrl,
                                      galleryImages: [
                                        {
                                          url: res.webpDataUrl,
                                          captionVi: prev.galleryImages?.[0]?.captionVi || 'Poster chính thức',
                                          captionEn: prev.galleryImages?.[0]?.captionEn || 'Official visual'
                                        },
                                        ...(prev.galleryImages?.slice(1) || [])
                                      ]
                                    }));
                                    setLastCompression(res);
                                  },
                                  '3:4'
                                )
                              }
                              className="absolute inset-x-1.5 bottom-1.5 py-1.5 px-2 rounded-md bg-amber-400 text-[#141414] font-mono text-[10px] font-bold uppercase flex items-center justify-center gap-1 shadow-lg hover:bg-amber-300 transition-all"
                            >
                              <Crop className="w-3 h-3" />
                              <span>Chỉnh Khung Hình</span>
                            </button>
                          )}
                        </div>
                        <div className="sm:col-span-8 space-y-3">
                          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-400/60 bg-white/5 cursor-pointer transition-colors text-center">
                            <Upload className="w-6 h-6 text-amber-300 mb-1.5" />
                            <span className="font-bold text-white text-xs">
                              Chọn ảnh từ thiết bị HOẶC bấm Ctrl + V để dán ảnh vừa Copy từ Facebook
                            </span>
                            <span className="text-[11px] text-white/60 font-mono mt-1">
                              Tự động nén sang .WebP lưu vĩnh viễn trên Firebase
                            </span>
                            <input type="file" accept="image/*" onChange={handleWorkshopImageUpload} className="hidden" />
                          </label>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-white/60 block">
                                HOẶC DÁN ĐỊA CHỈ ẢNH TRỰC TIẾP:
                              </span>
                              {workshopForm.image &&
                                !workshopForm.image.startsWith('data:image/') &&
                                !workshopForm.image.startsWith('/src/') && (
                                  <button
                                    type="button"
                                    disabled={compressing}
                                    onClick={() => handleConvertWorkshopUrl(workshopForm.image)}
                                    className="px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[10px] font-bold transition-all"
                                  >
                                    ⚡ Chuyển Link này sang .WebP vĩnh viễn
                                  </button>
                                )}
                            </div>
                            <input
                              type="text"
                              value={workshopForm.image || ''}
                              onPaste={handleWorkshopPaste}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (isFacebookWebpageUrl(val)) {
                                  setImageUrlWarning(
                                    'Đây là link trang bài viết Facebook, không phải link file ảnh trực tiếp.'
                                  );
                                } else if (isFacebookCdnUrl(val)) {
                                  setImageUrlWarning(
                                    'Link ảnh Facebook (fbcdn.net) sẽ tự hết hạn sau vài ngày. Hãy bấm nút "⚡ Chuyển Link này sang .WebP vĩnh viễn" để lưu vĩnh viễn!'
                                  );
                                } else {
                                  setImageUrlWarning(null);
                                }
                                setWorkshopForm((prev) => ({
                                  ...prev,
                                  image: val,
                                  galleryImages: [
                                    {
                                      url: val,
                                      captionVi: prev.galleryImages?.[0]?.captionVi || 'Poster chính thức',
                                      captionEn: prev.galleryImages?.[0]?.captionEn || 'Official visual'
                                    },
                                    ...(prev.galleryImages?.slice(1) || [])
                                  ]
                                }));
                              }}
                              className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4 Multi-Image Gallery for Horizontal Slider */}
                      <div className="pt-4 border-t border-white/10 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                            2. BỘ 4 ẢNH GÓC CHỤP WORKSHOP (TẢI FILE MÁY HOẶC DÁN LINK FACEBOOK / CTRL+V CHO TỪNG GÓC)
                          </label>
                          <span className="text-[10px] font-mono text-white/50">
                            Hỗ trợ dán link trực tiếp từ Facebook hoặc bấm Ctrl+V cho từng góc chụp
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {[0, 1, 2, 3].map((idx) => {
                            const img = workshopForm.galleryImages?.[idx];
                            const hasExternalUrl =
                              img?.url &&
                              !img.url.startsWith('data:image/') &&
                              !img.url.startsWith('/src/');
                            return (
                              <div
                                key={idx}
                                onPaste={(e) => handleWorkshopGalleryPaste(idx, e)}
                                className="p-2.5 bg-black/50 rounded-xl border border-white/15 space-y-2"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/90">
                                  <span className="font-bold">GÓC ẢNH #{idx + 1}</span>
                                  <label className="cursor-pointer px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-colors">
                                    + File máy
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleWorkshopGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black relative group border border-white/10">
                                  {img?.url ? (
                                    <img
                                      src={img.url}
                                      alt={`Gallery ${idx}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-mono">
                                      Trống
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-mono text-center p-2">
                                    <Upload className="w-4 h-4 mb-1 text-amber-300" />
                                    <span>Chọn file máy hoặc Ctrl+V</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleWorkshopGalleryImageUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>
                                  {img?.url && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openImageStudio(
                                          img.url,
                                          `Căn Chỉnh Khung Hình: Góc Ảnh Workshop #${idx + 1}`,
                                          (res) => {
                                            setWorkshopForm((prev) => {
                                              const current = [...(prev.galleryImages || [])];
                                              while (current.length <= idx) {
                                                current.push({ url: '', captionVi: '', captionEn: '' });
                                              }
                                              current[idx] = { ...current[idx], url: res.webpDataUrl };
                                              return {
                                                ...prev,
                                                ...(idx === 0 ? { image: res.webpDataUrl } : {}),
                                                galleryImages: current
                                              };
                                            });
                                            setLastCompression(res);
                                          },
                                          '3:4'
                                        );
                                      }}
                                      className="absolute bottom-1.5 inset-x-1.5 z-10 py-1 px-2 rounded bg-amber-400/95 hover:bg-amber-300 text-[#141414] font-mono text-[9px] font-bold uppercase flex items-center justify-center gap-1 shadow"
                                    >
                                      <Crop className="w-2.5 h-2.5" />
                                      <span>Chỉnh Khung #{idx + 1}</span>
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-amber-300/80 block uppercase">
                                    🔗 Link ảnh góc #{idx + 1} (Facebook / Web):
                                  </label>
                                  <input
                                    type="text"
                                    placeholder={`Dán link ảnh góc #${idx + 1}...`}
                                    value={img?.url || ''}
                                    onPaste={(e) => handleWorkshopGalleryPaste(idx, e)}
                                    onChange={(e) => {
                                      const urlVal = e.target.value;
                                      setWorkshopForm((prev) => {
                                        const current = [...(prev.galleryImages || [])];
                                        while (current.length <= idx) {
                                          current.push({ url: '', captionVi: '', captionEn: '' });
                                        }
                                        current[idx] = { ...current[idx], url: urlVal };
                                        return {
                                          ...prev,
                                          ...(idx === 0 ? { image: urlVal } : {}),
                                          galleryImages: current
                                        };
                                      });
                                    }}
                                    className="w-full px-2 py-1.5 bg-black/70 border border-white/15 rounded text-[10px] text-white font-mono focus:border-amber-400 focus:outline-none"
                                  />
                                  {hasExternalUrl && (
                                    <button
                                      type="button"
                                      disabled={compressing}
                                      onClick={() => handleConvertWorkshopGalleryUrl(idx, img?.url)}
                                      className="w-full py-1 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[10px] font-bold transition-all"
                                    >
                                      ⚡ Nạp & Nén Link sang .WebP
                                    </button>
                                  )}
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

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                          <Type className="w-3.5 h-3.5" />
                          <span>Tiêu Đề Workshop & Tự Động Chuẩn Hóa Chữ Hoa / Chữ Thường</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setWorkshopForm((prev) => ({
                              ...prev,
                              name: formatDisplayUppercase(prev.name),
                              latinMonographName: formatTitleCase(prev.latinMonographName),
                              titleVi: formatTitleCase(prev.titleVi),
                              subtitleVi: formatProseNFC(prev.subtitleVi),
                              editorialQuoteVi: formatProseNFC(prev.editorialQuoteVi)
                            }))
                          }
                          className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-[#141414] border border-amber-400/40 font-mono text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>✨ Chuẩn Hóa Tự Động Tên & Tiêu Đề</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tên Tiêu Đề Chính (Tự động In Hoa) *
                          </label>
                          <input
                            type="text"
                            required
                            value={workshopForm.name || ''}
                            onChange={(e) => setWorkshopForm((prev) => ({ ...prev, name: e.target.value }))}
                            onBlur={(e) =>
                              setWorkshopForm((prev) => ({ ...prev, name: formatDisplayUppercase(e.target.value) }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-bagerich text-sm focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tên Phụ Monograph (Tự động Hoa Đầu Từ) *
                          </label>
                          <input
                            type="text"
                            required
                            value={workshopForm.latinMonographName || ''}
                            onChange={(e) =>
                              setWorkshopForm((prev) => ({ ...prev, latinMonographName: e.target.value }))
                            }
                            onBlur={(e) =>
                              setWorkshopForm((prev) => ({
                                ...prev,
                                latinMonographName: formatTitleCase(e.target.value)
                              }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-white block mb-1">
                            Tiêu Đề Đầy Đủ Tiếng Việt (Hoa Đầu Từ) *
                          </label>
                          <input
                            type="text"
                            required
                            value={workshopForm.titleVi || ''}
                            onChange={(e) => setWorkshopForm((prev) => ({ ...prev, titleVi: e.target.value }))}
                            onBlur={(e) =>
                              setWorkshopForm((prev) => ({ ...prev, titleVi: formatTitleCase(e.target.value) }))
                            }
                            className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                          />
                        </div>
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

          {/* TAB 3: BRANDING & SOCIAL CHANNELS */}
          {activeTab === 'branding' && (
            <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bagerich font-bold uppercase text-white">
                  CẤU HÌNH LOGO, THÔNG TIN & SOCIAL CHANNELS
                </h3>
                <p className="text-xs text-white/60 font-sans mt-0.5">
                  Quản lý nhận diện thương hiệu, thông tin liên hệ và toàn bộ hệ thống kênh mạng xã hội & truyền thông của JU et Saigon
                </p>
              </div>

              {/* 1. Dual Logo Management Section (Logo Đen cho Light Mode & Logo Trắng cho Dark Mode) */}
              <div className="p-5 bg-black/40 rounded-xl border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                      1. HỆ THỐNG 2 LOGO THƯƠNG HIỆU TỰ ĐỘNG THEO CHẾ ĐỘ (LOGO ĐEN & LOGO TRẮNG)
                    </label>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      Hệ thống tự động nhận diện chế độ giao diện để hiển thị <strong>Logo Đen</strong> khi ở nền Sáng (Light Mode) và <strong>Logo Trắng</strong> khi ở nền Tối (Dark Mode).
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 shrink-0 self-start sm:self-auto">
                    TỰ ĐỘNG NHẬN DIỆN LIGHT / DARK MODE
                  </span>
                </div>

                {lastCompression && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 flex items-center gap-3 font-mono text-xs">
                    <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      Đã tự động nén Logo sang .WebP ({formatFileSize(lastCompression.originalSize)} → {formatFileSize(lastCompression.compressedSize)}, tiết kiệm {lastCompression.compressionRatio}%)
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* SLOT 1: LOGO ĐEN (LIGHT MODE) */}
                  <div
                    onPaste={(e) => handleLogoPaste('dark', e)}
                    className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                          ☀️ PHẦN 1: LOGO ĐEN (CHẾ ĐỘ LIGHT MODE)
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dcd8cf] text-[#141414] font-bold">
                          Nền Sáng
                        </span>
                      </div>

                      {/* Preview on Light Mode Background */}
                      <div className="w-full h-24 rounded-xl border border-[#141414]/20 bg-[#dcd8cf] flex items-center justify-center p-3 text-center overflow-hidden relative shadow-inner">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Logo Đen (Light Mode)"
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="font-fleur-title font-bold text-lg text-[#141414] uppercase tracking-wider">
                            {brandingForm.name || 'JU ET SAIGON'}
                          </span>
                        )}
                        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-[#141414]/50">
                          Xem trước trên nền Light Mode
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>Tải Ảnh Logo Đen (.WebP)</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>

                        {logoUrl && (
                          <button
                            type="button"
                            onClick={() => updateLogoUrl(null)}
                            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-200 border border-red-500/30 text-xs font-mono transition-colors"
                          >
                            Xóa Logo Đen
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Direct Link / Ctrl+V Input for Logo Đen */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-white/60 uppercase">
                          Hoặc dán Link ảnh / bấm Ctrl+V:
                        </label>
                        {logoUrl && !logoUrl.startsWith('data:image/') && !logoUrl.startsWith('/src/') && (
                          <button
                            type="button"
                            disabled={compressing}
                            onClick={() => handleConvertLogoUrl('dark', logoUrl)}
                            className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[9px] font-bold transition-all"
                          >
                            ⚡ Chuyển sang .WebP
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Dán link Logo Đen hoặc nhấn Ctrl+V..."
                        value={logoUrl || ''}
                        onPaste={(e) => handleLogoPaste('dark', e)}
                        onChange={(e) => updateLogoUrl(e.target.value || null)}
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* SLOT 2: LOGO TRẮNG (DARK MODE) */}
                  <div
                    onPaste={(e) => handleLogoPaste('white', e)}
                    className="p-4 rounded-xl bg-white/5 border border-white/15 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                          🌙 PHẦN 2: LOGO TRẮNG (CHẾ ĐỘ DARK MODE)
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0f100e] text-[#ede9df] border border-white/20 font-bold">
                          Nền Tối
                        </span>
                      </div>

                      {/* Preview on Dark Mode Background (Always stays dark so White Logo is visible) */}
                      <div className="admin-keep-dark w-full h-24 rounded-xl border border-white/20 bg-[#0f100e] flex items-center justify-center p-3 text-center overflow-hidden relative shadow-inner">
                        {logoWhiteUrl ? (
                          <img
                            src={logoWhiteUrl}
                            alt="Logo Trắng (Dark Mode)"
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Logo Tự Động Đảo Trắng"
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain brightness-0 invert opacity-90"
                          />
                        ) : (
                          <span className="font-fleur-title font-bold text-lg text-[#ede9df] uppercase tracking-wider">
                            {brandingForm.name || 'JU ET SAIGON'}
                          </span>
                        )}
                        <span className="absolute bottom-1 right-2 text-[9px] font-mono text-white/40">
                          {logoWhiteUrl
                            ? 'Đang dùng Logo Trắng riêng'
                            : logoUrl
                              ? 'Tự động chuyển trắng từ Logo Đen'
                              : 'Xem trước trên nền Dark Mode'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#ede9df] text-[#141414] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors text-center">
                          <Upload className="w-3.5 h-3.5 shrink-0" />
                          <span>Tải Ảnh Logo Trắng (.WebP)</span>
                          <input type="file" accept="image/*" onChange={handleLogoWhiteUpload} className="hidden" />
                        </label>

                        {logoWhiteUrl && (
                          <button
                            type="button"
                            onClick={() => updateLogoWhiteUrl(null)}
                            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-800 text-red-200 border border-red-500/30 text-xs font-mono transition-colors"
                          >
                            Xóa Logo Trắng
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Direct Link / Ctrl+V Input for Logo Trắng */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono text-white/60 uppercase">
                          Hoặc dán Link ảnh / bấm Ctrl+V:
                        </label>
                        {logoWhiteUrl && !logoWhiteUrl.startsWith('data:image/') && !logoWhiteUrl.startsWith('/src/') && (
                          <button
                            type="button"
                            disabled={compressing}
                            onClick={() => handleConvertLogoUrl('white', logoWhiteUrl)}
                            className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-mono text-[9px] font-bold transition-all"
                          >
                            ⚡ Chuyển sang .WebP
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Dán link Logo Trắng hoặc nhấn Ctrl+V..."
                        value={logoWhiteUrl || ''}
                        onPaste={(e) => handleLogoPaste('white', e)}
                        onChange={(e) => updateLogoWhiteUrl(e.target.value || null)}
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                </div>

                <p className="text-[11px] text-white/50 font-mono">
                  💡 Khuyến nghị sử dụng file PNG hoặc WebP nền trong suốt (kích thước khoảng 400x120px). Khi chuyển đổi qua lại giữa <strong>Sáng (Light)</strong> và <strong>Tối (Dark)</strong>, hệ thống sẽ tự động thay đổi giữa 2 bản Logo này.
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveBranding} className="space-y-8 text-xs font-sans">

                {/* 2. General Brand & Atelier Info */}
                <div className="p-5 bg-black/40 rounded-xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <label className="font-mono uppercase text-[11px] font-bold text-amber-300 block">
                      2. THÔNG TIN THƯƠNG HIỆU & ATELIER
                    </label>
                    <span className="text-[10px] font-mono text-white/40">LIÊN HỆ & ĐỊA ĐIỂM</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-white block mb-1">Tên Thương Hiệu (Brand Wordmark) *</label>
                      <input
                        type="text"
                        required
                        value={brandingForm.name || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        placeholder="JU et Saigon"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Slogan Tiếng Anh (Tagline)</label>
                      <input
                        type="text"
                        value={brandingForm.tagline || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, tagline: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        placeholder="Flower your heart, Flower your soul"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Hotline Gọi Trực Tiếp (Dùng cho tel: link) *</label>
                      <input
                        type="text"
                        required
                        value={brandingForm.phone || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        placeholder="090 936 80 80"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Hotline Định Dạng Hiển Thị (Phone Formatted) *</label>
                      <input
                        type="text"
                        required
                        value={brandingForm.phoneFormatted || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, phoneFormatted: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        placeholder="0909 368 080"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Email Liên Hệ Chính Thức *</label>
                      <input
                        type="email"
                        required
                        value={brandingForm.email || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none"
                        placeholder="juetsaigon@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-white block mb-1">Thời Gian Hoạt Động (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={brandingForm.hoursVi || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, hoursVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        placeholder="Thứ Hai – Chủ Nhật: 08:30 – 20:30"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-white block mb-1">Địa Chỉ Atelier (Tiếng Việt) *</label>
                      <input
                        type="text"
                        required
                        value={brandingForm.addressVi || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, addressVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        placeholder="Lầu 1 - 31 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-white block mb-1">Giới Thiệu Ngắn (Sub-tagline Tiếng Việt)</label>
                      <textarea
                        rows={2}
                        value={brandingForm.subTaglineVi || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, subTaglineVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none resize-none"
                        placeholder="Góc hoa nhỏ mang sứ mệnh trao gởi yêu thương..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-white block mb-1">Lưu Ý Đặt Lịch Tư Vấn (Tiếng Việt)</label>
                      <input
                        type="text"
                        value={brandingForm.consultationNoticeVi || ''}
                        onChange={(e) => setBrandingForm((prev) => ({ ...prev, consultationNoticeVi: e.target.value }))}
                        className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                        placeholder="Vui lòng đặt lịch hẹn trước 24h đối với hoa cưới Haute Couture..."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Dedicated SOCIAL & CHANNELS Section */}
                <div className="p-5 bg-gradient-to-br from-[#23211d] to-[#1a1b18] rounded-xl border border-amber-400/30 shadow-lg space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-amber-300" />
                      <label className="font-mono uppercase text-[12px] font-bold text-amber-300 block">
                        3. MỤC CHỈNH SỬA SOCIAL & CHANNELS (MẠNG XÃ HỘI & KÊNH KẾT NỐI)
                      </label>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300/80 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                      TỰ ĐỘNG ĐỒNG BỘ FOOTER & ATELIER
                    </span>
                  </div>

                  <p className="text-[11px] text-white/60">
                    Cập nhật đường dẫn các kênh mạng xã hội, hotline Zalo, TikTok và website chính thức. Các đường dẫn này sẽ hiển thị trực tiếp ở phần <strong>SOCIAL & CHANNELS</strong> cuối chân trang và các nút liên hệ.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Instagram */}
                    <div className="p-4 bg-black/40 rounded-xl border border-pink-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-pink-400">
                          <Instagram className="w-4 h-4" />
                          <span>INSTAGRAM ATELIER</span>
                        </div>
                        {brandingForm.instagramUrl && (
                          <a
                            href={brandingForm.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-pink-300 hover:underline flex items-center gap-1"
                          >
                            <span>Thử link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Tên tài khoản (Handle)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-white/40 font-mono text-xs">@</span>
                            <input
                              type="text"
                              value={brandingForm.instagram || ''}
                              onChange={(e) => setBrandingForm((prev) => ({ ...prev, instagram: e.target.value.replace(/^@/, '') }))}
                              className="w-full pl-7 pr-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none text-xs"
                              placeholder="juetsaigon"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Đường dẫn đầy đủ (URL)</label>
                          <input
                            type="url"
                            value={brandingForm.instagramUrl || ''}
                            onChange={(e) => setBrandingForm((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-pink-400 focus:outline-none text-xs"
                            placeholder="https://instagram.com/juetsaigon"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="p-4 bg-black/40 rounded-xl border border-blue-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-blue-400">
                          <Facebook className="w-4 h-4" />
                          <span>FACEBOOK FANPAGE</span>
                        </div>
                        {brandingForm.facebookUrl && (
                          <a
                            href={brandingForm.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-blue-300 hover:underline flex items-center gap-1"
                          >
                            <span>Thử link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Tên hiển thị Fanpage</label>
                          <input
                            type="text"
                            value={brandingForm.facebookName || ''}
                            onChange={(e) => setBrandingForm((prev) => ({ ...prev, facebookName: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white focus:border-blue-400 focus:outline-none text-xs"
                            placeholder="JU et Saigon"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Đường dẫn Fanpage (URL)</label>
                          <input
                            type="url"
                            value={brandingForm.facebookUrl || ''}
                            onChange={(e) => setBrandingForm((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-blue-400 focus:outline-none text-xs"
                            placeholder="https://www.facebook.com/juetsaigon/"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Zalo */}
                    <div className="p-4 bg-black/40 rounded-xl border border-cyan-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-cyan-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>ZALO CSKH & BLOOM DAILY</span>
                        </div>
                        {brandingForm.zaloUrl && (
                          <a
                            href={brandingForm.zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-cyan-300 hover:underline flex items-center gap-1"
                          >
                            <span>Thử link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] text-white/70 block mb-0.5">Đường dẫn Nhóm Zalo hoặc Zalo Chat (URL)</label>
                        <input
                          type="url"
                          value={brandingForm.zaloUrl || ''}
                          onChange={(e) => setBrandingForm((prev) => ({ ...prev, zaloUrl: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-cyan-400 focus:outline-none text-xs"
                          placeholder="https://zalo.me/g/lbzvqb973"
                        />
                        <p className="text-[10px] text-white/40 mt-1 font-mono">
                          Hỗ trợ link nhóm Zalo (zalo.me/g/...) hoặc link số điện thoại (zalo.me/0909368080)
                        </p>
                      </div>
                    </div>

                    {/* TikTok */}
                    <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-purple-400">
                          <span className="font-mono font-bold text-sm">♪</span>
                          <span>TIKTOK ATELIER</span>
                        </div>
                        {brandingForm.tiktokUrl && (
                          <a
                            href={brandingForm.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-purple-300 hover:underline flex items-center gap-1"
                          >
                            <span>Thử link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] text-white/70 block mb-0.5">Đường dẫn kênh TikTok (URL)</label>
                        <input
                          type="url"
                          value={brandingForm.tiktokUrl || ''}
                          onChange={(e) => setBrandingForm((prev) => ({ ...prev, tiktokUrl: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-purple-400 focus:outline-none text-xs"
                          placeholder="https://www.tiktok.com/@juetsaigon"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20 space-y-3 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <Globe className="w-4 h-4" />
                          <span>WEBSITE & HỆ THỐNG TRỰC TUYẾN</span>
                        </div>
                        {(brandingForm.websiteUrl || brandingForm.website) && (
                          <a
                            href={brandingForm.websiteUrl || `https://${brandingForm.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <span>Thử link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Tên miền hiển thị (Domain text)</label>
                          <input
                            type="text"
                            value={brandingForm.website || ''}
                            onChange={(e) => setBrandingForm((prev) => ({ ...prev, website: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                            placeholder="juinternational.com"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-white/70 block mb-0.5">Đường dẫn Website đầy đủ (URL)</label>
                          <input
                            type="url"
                            value={brandingForm.websiteUrl || ''}
                            onChange={(e) => setBrandingForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                            className="w-full px-3 py-1.5 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                            placeholder="https://juinternational.com"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Live Preview Strip */}
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-2">
                      XEM TRƯỚC HIỂN THỊ CHÂN TRANG (FOOTER PREVIEW):
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {brandingForm.instagramUrl && (
                        <span className="px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-mono flex items-center gap-1 text-pink-300 border border-pink-400/20">
                          <Instagram className="w-3 h-3" />
                          <span>@{brandingForm.instagram || 'juetsaigon'}</span>
                        </span>
                      )}
                      {brandingForm.facebookUrl && (
                        <span className="px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-mono flex items-center gap-1 text-blue-300 border border-blue-400/20">
                          <Facebook className="w-3 h-3" />
                          <span>{brandingForm.facebookName || 'Facebook Fanpage'}</span>
                        </span>
                      )}
                      {brandingForm.zaloUrl && (
                        <span className="px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-mono flex items-center gap-1 text-cyan-300 border border-cyan-400/20">
                          <MessageCircle className="w-3 h-3" />
                          <span>Zalo CSKH</span>
                        </span>
                      )}
                      {brandingForm.tiktokUrl && (
                        <span className="px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-mono flex items-center gap-1 text-purple-300 border border-purple-400/20">
                          <span>♪</span>
                          <span>TikTok</span>
                        </span>
                      )}
                      {brandingForm.website && (
                        <span className="px-2.5 py-1 bg-white/10 rounded-md text-[11px] font-mono flex items-center gap-1 text-amber-300 border border-amber-400/20">
                          <Globe className="w-3 h-3" />
                          <span>{brandingForm.website}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50 font-mono">
                    * Mọi thay đổi sẽ được lưu vào cơ sở dữ liệu và đồng bộ tức thời trên toàn trang.
                  </span>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform hover:scale-102"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu Cấu Hình Thương Hiệu & Social Channels</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ATELIER CRM — BESPOKE ORDERS & WORKSHOP BOOKINGS */}
          {activeTab === 'orders' && (
            <div className="bg-[#1e1f1c] rounded-2xl p-4 sm:p-6 border border-white/15 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bagerich font-bold uppercase text-white">
                    TRUNG TÂM QUẢN TRỊ ĐƠN HÀNG & LỊCH HẸN (ATELIER CRM)
                  </h3>
                  <p className="text-xs text-white/60 font-sans mt-0.5">
                    Đồng bộ thời gian thực từ Firebase Firestore · Quản lý đơn đặt hoa, thiệp đóng dấu sáp và lịch đăng ký Workshop
                  </p>
                </div>

                {/* Sub-tab switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/15 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCrmSubTab('floral_orders')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      crmSubTab === 'floral_orders'
                        ? 'bg-amber-400 text-[#141414] font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Đơn Đặt Hoa ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrmSubTab('workshop_bookings')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      crmSubTab === 'workshop_bookings'
                        ? 'bg-amber-400 text-[#141414] font-bold'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Đăng Ký Workshop ({workshopBookings.length})
                  </button>
                </div>
              </div>

              {crmSubTab === 'floral_orders' ? (
                orders.length === 0 ? (
                  <div className="py-16 text-center space-y-2 text-white/60">
                    <p className="text-sm font-mono uppercase">Chưa có đơn đặt hoa nào trên hệ thống</p>
                    <p className="text-xs">
                      Khi khách hàng gửi yêu cầu tư vấn hoặc thiết kế thiệp đóng dấu sáp, đơn hàng sẽ tự động xuất hiện tại đây.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const noteDraft =
                        adminNoteDrafts[ord.id] !== undefined
                          ? adminNoteDrafts[ord.id]
                          : ord.adminNote || '';
                      return (
                        <div
                          key={ord.id}
                          className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/15 space-y-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#141414] font-mono text-xs font-bold">
                                  {ord.orderCode}
                                </span>
                                <span className="text-xs font-mono text-white/50">
                                  {new Date(ord.createdAt).toLocaleString('vi-VN')}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-white">
                                {ord.customerName} —{' '}
                                <a
                                  href={`tel:${ord.customerPhone.replace(/\s+/g, '')}`}
                                  className="text-amber-300 underline"
                                >
                                  {ord.customerPhone}
                                </a>
                              </h4>
                              <p className="text-xs text-white/80">
                                <strong>Tác phẩm:</strong> {ord.flowerName} ·{' '}
                                <strong>Ngân sách:</strong> {ord.budgetVnd.toLocaleString('vi-VN')} VND
                              </p>
                              <p className="text-xs text-white/70">
                                <strong>Khu vực giao:</strong> {ord.district} ·{' '}
                                <strong>Ngày nhận:</strong> {ord.deliveryDate} ·{' '}
                                <strong>Dịp:</strong> {ord.occasion}
                              </p>
                            </div>

                            {/* Status Controls */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {(
                                [
                                  { id: 'pending', label: '1. Tiếp Nhận' },
                                  { id: 'crafting', label: '2. Đang Cắm Hoa' },
                                  { id: 'delivering', label: '3. Đang Giao' },
                                  { id: 'completed', label: '4. Hoàn Tất' },
                                  { id: 'cancelled', label: 'Hủy' }
                                ] as const
                              ).map((st) => (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, st.id)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all border ${
                                    ord.status === st.id
                                      ? 'bg-amber-400 text-[#141414] border-amber-400 font-bold shadow'
                                      : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/15'
                                  }`}
                                >
                                  {st.label}
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Xóa đơn hàng ${ord.orderCode}?`)) {
                                    deleteOrder(ord.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/50 text-red-300 border border-red-500/30 hover:bg-red-900"
                                title="Xóa đơn hàng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Moodboard items if included */}
                          {ord.moodboardItems && ord.moodboardItems.length > 0 && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-400/25 text-xs text-rose-200">
                              <span className="font-mono font-bold uppercase text-[10px] block mb-1">
                                Danh sách Moodboard khách đã chọn ({ord.moodboardItems.length} mẫu):
                              </span>
                              <p>{ord.moodboardItems.join(' · ')}</p>
                            </div>
                          )}

                          {/* Customer Notes */}
                          {ord.notes && (
                            <div className="text-xs text-white/85 bg-white/5 p-3 rounded-lg border border-white/10">
                              <span className="font-mono text-[10px] uppercase text-white/50 block mb-0.5">
                                Ghi chú của khách hàng:
                              </span>
                              <p>{ord.notes}</p>
                            </div>
                          )}

                          {/* Bespoke Wax-Seal Greeting Card Details */}
                          {ord.giftCard?.enabled && (
                            <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs space-y-1.5">
                              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-amber-300 font-bold">
                                <span>✉ THIỆP ĐÓNG DẤU SÁP ĐI KÈM HOA</span>
                                <span>
                                  Giấy: {ord.giftCard.paperStyle.toUpperCase()} · Sáp:{' '}
                                  {ord.giftCard.waxColor.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-white">
                                <strong>Người nhận:</strong> {ord.giftCard.recipient || '—'} ·{' '}
                                <strong>Người gửi:</strong> {ord.giftCard.sender || ord.customerName}
                              </p>
                              <p className="italic text-amber-100 bg-black/30 p-2.5 rounded-lg border border-white/10">
                                "{ord.giftCard.message}"
                              </p>
                            </div>
                          )}

                          {/* Admin Note & Zalo Quick Action */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="Ghi chú tiến độ cho khách xem khi tra cứu đơn (VD: Đã tuyển chọn mẫu đơn Hà Lan, giao lúc 14h)..."
                              value={noteDraft}
                              onChange={(e) =>
                                setAdminNoteDrafts((prev) => ({
                                  ...prev,
                                  [ord.id]: e.target.value
                                }))
                              }
                              className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-xs text-white font-sans focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, ord.status, noteDraft)}
                              className="px-4 py-2 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-black text-white text-xs font-mono font-bold transition-colors shrink-0"
                            >
                              Lưu Ghi Chú
                            </button>
                            <a
                              href={`https://zalo.me/${ord.customerPhone.replace(/\s+/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg bg-[#0068FF] text-white text-xs font-mono font-bold text-center shrink-0"
                            >
                              Chat Zalo Khách
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : workshopBookings.length === 0 ? (
                <div className="py-16 text-center space-y-2 text-white/60">
                  <p className="text-sm font-mono uppercase">Chưa có đăng ký Workshop nào</p>
                  <p className="text-xs">
                    Khi khách hàng hoặc doanh nghiệp đăng ký lịch Workshop, thông tin sẽ hiển thị tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workshopBookings.map((bk) => (
                    <div
                      key={bk.id}
                      className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/15 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#141414] font-mono text-xs font-bold">
                              {bk.bookingCode}
                            </span>
                            <span className="text-xs font-mono text-white/50">
                              {new Date(bk.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">
                            {bk.customerName}{' '}
                            {bk.companyName ? `(${bk.companyName})` : ''} —{' '}
                            <a
                              href={`tel:${bk.customerPhone.replace(/\s+/g, '')}`}
                              className="text-amber-300 underline"
                            >
                              {bk.customerPhone}
                            </a>
                          </h4>
                          <p className="text-xs text-white/85">
                            <strong>Chủ đề:</strong> {bk.workshopName} ·{' '}
                            <strong>Số lượng:</strong> {bk.participantsCount} Pax
                          </p>
                          <p className="text-xs text-white/70">
                            <strong>Ngày dự kiến:</strong> {bk.preferredDate} ·{' '}
                            <strong>Địa điểm:</strong> {bk.locationType}
                          </p>
                          {bk.notes && (
                            <p className="text-xs text-amber-200/90 pt-1">
                              <strong>Ghi chú:</strong> {bk.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {(
                            [
                              { id: 'pending', label: 'Chờ Xác Nhận' },
                              { id: 'confirmed', label: 'Đã Xác Nhận Lịch' },
                              { id: 'completed', label: 'Hoàn Tất' },
                              { id: 'cancelled', label: 'Hủy' }
                            ] as const
                          ).map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => updateWorkshopBookingStatus(bk.id, st.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all border ${
                                bk.status === st.id
                                  ? 'bg-amber-400 text-[#141414] border-amber-400 font-bold'
                                  : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/15'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Xóa đăng ký ${bk.bookingCode}?`)) {
                                deleteWorkshopBooking(bk.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/50 text-red-300 border border-red-500/30 hover:bg-red-900"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECURITY & ADMIN PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-[#1e1f1c] rounded-2xl p-6 border border-white/15 space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bagerich font-bold uppercase text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>QUẢN TRỊ BẢO MẬT & ĐỔI MẬT KHẨU ADMIN</span>
                  </h3>
                  <p className="text-xs text-white/60 font-sans mt-0.5">
                    Quản lý và cập nhật mật khẩu đăng nhập an toàn cho quản trị viên Atelier
                  </p>
                </div>
              </div>

              {/* Status Info Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-amber-500/20 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
                    <Shield className="w-4 h-4" />
                    <span>THÔNG TIN XÁC THỰC QUẢN TRỊ</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                      <span className="text-white/60">Tài khoản quản trị:</span>
                      <span className="font-mono text-white font-bold">Admin (JU et Saigon Atelier)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                      <span className="text-white/60">Trạng thái đám mây:</span>
                      <span className="font-mono text-emerald-400 flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>Đã kết nối bảo mật</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-white/60">Mật khẩu đang sử dụng:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {showPass ? (adminPassword || '••••••••') : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="p-1 hover:text-amber-300 text-white/60 transition-colors"
                          title={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>HƯỚNG DẪN BẢO MẬT</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4 font-sans leading-relaxed">
                      <li>Nên đặt mật khẩu từ 8 ký tự trở lên bao gồm cả chữ và số.</li>
                      <li>Sau khi đổi, mật khẩu mới sẽ có hiệu lực ngay lập tức cho các lần đăng nhập tiếp theo.</li>
                      <li>Bạn cũng có thể thay đổi mật khẩu trực tiếp trong cơ sở dữ liệu Firebase.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="p-5 bg-[#141513] rounded-xl border border-white/15 space-y-5">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
                  <Key className="w-4 h-4" />
                  <span>BIỂU MẪU ĐỔI MẬT KHẨU MỚI</span>
                </div>

                {passChangeMsg && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      passChangeMsg.isError
                        ? 'bg-red-500/15 border-red-500/40 text-red-300'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {passChangeMsg.isError ? (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{passChangeMsg.text}</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPassChangeMsg(null);
                    if (newPassInput !== confirmPassInput) {
                      setPassChangeMsg({ text: 'Mật khẩu xác nhận không khớp.', isError: true });
                      return;
                    }
                    if (newPassInput.length < 6) {
                      setPassChangeMsg({ text: 'Mật khẩu mới phải có tối thiểu 6 ký tự.', isError: true });
                      return;
                    }
                    setIsSubmittingPass(true);
                    const res = await changeAdminPassword(currentPassInput, newPassInput);
                    setIsSubmittingPass(false);
                    if (res.success) {
                      setPassChangeMsg({ text: res.message, isError: false });
                      setCurrentPassInput('');
                      setNewPassInput('');
                      setConfirmPassInput('');
                    } else {
                      setPassChangeMsg({ text: res.message, isError: true });
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] text-white/70 block mb-1">Mật khẩu hiện tại</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-white/70 block mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-white/70 block mb-1">Xác nhận mật khẩu mới</label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono focus:border-amber-400 focus:outline-none text-xs"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 font-mono"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPass ? 'Ẩn ký tự mật khẩu' : 'Hiển thị ký tự mật khẩu'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingPass}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform hover:scale-102 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSubmittingPass ? 'Đang lưu lên Firebase...' : 'Lưu & Đổi Mật Khẩu Admin'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Interactive Image Framing & WebP Studio Modal */}
      <ImageStudioModal
        isOpen={studioState.isOpen}
        imageSource={studioState.imageSource}
        title={studioState.title}
        defaultAspectRatio={studioState.defaultAspectRatio}
        theme={theme}
        onClose={() => setStudioState((prev) => ({ ...prev, isOpen: false }))}
        onApply={studioState.onApply}
      />

    </div>
  );
};
