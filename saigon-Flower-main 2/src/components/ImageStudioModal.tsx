import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Check,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  Sparkles,
  Sun,
  Contrast,
  RefreshCw,
  Maximize2,
  Minimize2,
  Crop,
  Sliders
} from 'lucide-react';
import { CompressionResult, formatFileSize } from '../utils/imageOptimizer';

export type AspectRatioPreset = '3:4' | '4:5' | '1:1' | '4:3' | '16:9' | 'original';
export type FrameFitMode = 'crop' | 'blur-pad' | 'cream-pad' | 'dark-pad';

interface ImageStudioModalProps {
  isOpen: boolean;
  imageSource: string | null;
  title?: string;
  defaultAspectRatio?: AspectRatioPreset;
  theme?: 'light' | 'dark';
  onClose: () => void;
  onApply: (result: CompressionResult) => void;
}

const ASPECT_PRESETS: {
  id: AspectRatioPreset;
  labelVi: string;
  descVi: string;
  ratio: number | null; // width / height
  targetW: number;
  targetH: number;
}[] = [
  { id: '3:4', labelVi: '3:4 Chuẩn JU', descVi: 'Khung triển lãm dọc', ratio: 3 / 4, targetW: 840, targetH: 1120 },
  { id: '4:5', labelVi: '4:5 Chân Dung', descVi: 'Chuẩn Instagram / Editorial', ratio: 4 / 5, targetW: 880, targetH: 1100 },
  { id: '1:1', labelVi: '1:1 Vuông', descVi: 'Khung vuông cân đối', ratio: 1, targetW: 1000, targetH: 1000 },
  { id: '4:3', labelVi: '4:3 Ngang', descVi: 'Khung ngang классик', ratio: 4 / 3, targetW: 1120, targetH: 840 },
  { id: '16:9', labelVi: '16:9 Rộng', descVi: 'Banner ngang toàn cảnh', ratio: 16 / 9, targetW: 1200, targetH: 675 },
  { id: 'original', labelVi: 'Tỉ Lệ Gốc', descVi: 'Giữ nguyên khung gốc', ratio: null, targetW: 1100, targetH: 1100 }
];

const FIT_MODES: {
  id: FrameFitMode;
  labelVi: string;
  descVi: string;
}[] = [
  {
    id: 'crop',
    labelVi: 'Lấp Đầy & Kéo Chọn Tâm (Crop)',
    descVi: 'Lấp kín khung hình, kéo ảnh để chọn góc đẹp nhất'
  },
  {
    id: 'blur-pad',
    labelVi: 'Vừa Khung + Nền Mờ Nghệ Thuật',
    descVi: 'Giữ 100% ảnh gốc, tự tạo nền mờ đồng màu ở viền'
  },
  {
    id: 'cream-pad',
    labelVi: 'Vừa Khung + Viền Kem Atelier',
    descVi: 'Giữ 100% ảnh gốc trên nền giấy mỹ thuật #dcd8cf'
  },
  {
    id: 'dark-pad',
    labelVi: 'Vừa Khung + Viền Đen Bảo Tàng',
    descVi: 'Giữ 100% ảnh gốc trên nền đen tuyền #141414'
  }
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  imageSource,
  title = 'Căn Chỉnh Khung Hình & Tối Ưu Ảnh (.WebP)',
  defaultAspectRatio = '3:4',
  theme = 'dark',
  onClose,
  onApply
}) => {
  const isDark = theme === 'dark';

  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Framing & Transform Controls
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>(defaultAspectRatio);
  const [fitMode, setFitMode] = useState<FrameFitMode>('crop');
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0); // -100 to +100
  const [panY, setPanY] = useState<number>(0); // -100 to +100
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Botanical Light & Color Grading
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);

  // Dragging state for interactive pan on canvas
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  // Load image safely with CORS support
  useEffect(() => {
    if (!isOpen || !imageSource) return;

    setLoadingImg(true);
    setLoadError(null);
    setAspectPreset(defaultAspectRatio);
    setFitMode('crop');
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);

    let isCancelled = false;

    const loadImageElement = (src: string, useProxyFallback = false) => {
      const img = new Image();
      if (!src.startsWith('data:') && !src.startsWith('/src/')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => {
        if (isCancelled) return;
        setLoadedImg(img);
        setLoadingImg(false);
      };

      img.onerror = () => {
        if (isCancelled) return;
        if (!useProxyFallback && !src.startsWith('data:') && !src.startsWith('/src/')) {
          const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(src)}&output=webp&w=1200&q=88`;
          loadImageElement(proxyUrl, true);
        } else {
          setLoadingImg(false);
          setLoadError('Không thể tải hình ảnh này để chỉnh khung. Hãy kiểm tra lại đường dẫn hoặc dán ảnh bằng Ctrl+V.');
        }
      };

      img.src = src;
    };

    loadImageElement(imageSource);

    return () => {
      isCancelled = true;
    };
  }, [isOpen, imageSource, defaultAspectRatio]);

  // Compute output canvas dimensions based on selected preset and rotation
  const getTargetDimensions = useCallback(() => {
    if (!loadedImg) return { width: 840, height: 1120, ratioLabel: '3:4' };

    const isRotated90 = rotation % 180 !== 0;
    const srcW = isRotated90 ? loadedImg.naturalHeight : loadedImg.naturalWidth;
    const srcH = isRotated90 ? loadedImg.naturalWidth : loadedImg.naturalHeight;

    const preset = ASPECT_PRESETS.find((p) => p.id === aspectPreset) || ASPECT_PRESETS[0];

    if (preset.id === 'original' || !preset.ratio) {
      const maxDim = 1100;
      let w = srcW;
      let h = srcH;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const r = w / h;
      const label = r > 1.15 ? '4:3' : r < 0.85 ? '3:4' : '1:1';
      return { width: w, height: h, ratioLabel: label };
    }

    return {
      width: preset.targetW,
      height: preset.targetH,
      ratioLabel: preset.id
    };
  }, [loadedImg, aspectPreset, rotation]);

  // Render live preview onto canvas
  const renderToCanvas = useCallback(
    (canvas: HTMLCanvasElement, drawGridOverlay: boolean) => {
      if (!loadedImg) return;
      const { width: targetW, height: targetH } = getTargetDimensions();

      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear & Fill background according to fitMode
      ctx.clearRect(0, 0, targetW, targetH);

      if (fitMode === 'cream-pad') {
        ctx.fillStyle = '#dcd8cf';
        ctx.fillRect(0, 0, targetW, targetH);
      } else if (fitMode === 'dark-pad' || fitMode === 'crop') {
        ctx.fillStyle = '#141414';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      // Create an offscreen rotated/flipped source canvas so pan/zoom math is intuitive
      const isRotated90 = rotation % 180 !== 0;
      const srcW = isRotated90 ? loadedImg.naturalHeight : loadedImg.naturalWidth;
      const srcH = isRotated90 ? loadedImg.naturalWidth : loadedImg.naturalHeight;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = srcW;
      offCanvas.height = srcH;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      offCtx.save();
      offCtx.translate(srcW / 2, srcH / 2);
      offCtx.rotate((rotation * Math.PI) / 180);
      if (flipH) {
        offCtx.scale(-1, 1);
      }
      if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
        offCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      }
      offCtx.drawImage(
        loadedImg,
        -loadedImg.naturalWidth / 2,
        -loadedImg.naturalHeight / 2,
        loadedImg.naturalWidth,
        loadedImg.naturalHeight
      );
      offCtx.restore();

      // If blur-pad mode, draw a blurred cover backdrop first
      if (fitMode === 'blur-pad') {
        ctx.save();
        const coverScale = Math.max(targetW / srcW, targetH / srcH) * 1.15;
        const bgW = srcW * coverScale;
        const bgH = srcH * coverScale;
        ctx.filter = 'blur(32px) brightness(75%)';
        ctx.drawImage(offCanvas, (targetW - bgW) / 2, (targetH - bgH) / 2, bgW, bgH);
        ctx.restore();
      }

      // Calculate foreground image placement
      if (fitMode === 'crop') {
        // Cover scale + zoom
        const baseScale = Math.max(targetW / srcW, targetH / srcH);
        const finalScale = baseScale * zoom;
        const drawW = srcW * finalScale;
        const drawH = srcH * finalScale;

        // Maximum pan range in pixels
        const maxOffsetX = Math.max(0, (drawW - targetW) / 2);
        const maxOffsetY = Math.max(0, (drawH - targetH) / 2);

        const offsetX = (panX / 100) * maxOffsetX;
        const offsetY = (panY / 100) * maxOffsetY;

        const x = (targetW - drawW) / 2 + offsetX;
        const y = (targetH - drawH) / 2 + offsetY;

        ctx.drawImage(offCanvas, x, y, drawW, drawH);
      } else {
        // Fit mode (contain) with optional zoom & pan
        const paddingFactor = fitMode === 'cream-pad' || fitMode === 'dark-pad' ? 0.92 : 1.0;
        const baseScale = Math.min((targetW * paddingFactor) / srcW, (targetH * paddingFactor) / srcH);
        const finalScale = baseScale * zoom;
        const drawW = srcW * finalScale;
        const drawH = srcH * finalScale;

        const maxOffsetX = Math.max(targetW * 0.25, Math.abs(targetW - drawW) / 2);
        const maxOffsetY = Math.max(targetH * 0.25, Math.abs(targetH - drawH) / 2);

        const offsetX = (panX / 100) * maxOffsetX;
        const offsetY = (panY / 100) * maxOffsetY;

        const x = (targetW - drawW) / 2 + offsetX;
        const y = (targetH - drawH) / 2 + offsetY;

        // Subtle drop shadow in pad modes
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 8;
        ctx.drawImage(offCanvas, x, y, drawW, drawH);
        ctx.restore();
      }

      // Optional Rule-of-Thirds Grid Overlay (only for interactive preview, never exported)
      if (drawGridOverlay && showGrid) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.lineWidth = 1.5;

        // Vertical thirds
        ctx.beginPath();
        ctx.moveTo(targetW / 3, 0);
        ctx.lineTo(targetW / 3, targetH);
        ctx.moveTo((targetW * 2) / 3, 0);
        ctx.lineTo((targetW * 2) / 3, targetH);
        // Horizontal thirds
        ctx.moveTo(0, targetH / 3);
        ctx.lineTo(targetW, targetH / 3);
        ctx.moveTo(0, (targetH * 2) / 3);
        ctx.lineTo(targetW, (targetH * 2) / 3);
        ctx.stroke();

        // Center crosshair
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
        ctx.beginPath();
        ctx.arc(targetW / 2, targetH / 2, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    },
    [loadedImg, getTargetDimensions, fitMode, rotation, flipH, brightness, contrast, saturation, zoom, panX, panY, showGrid]
  );

  useEffect(() => {
    if (previewCanvasRef.current && loadedImg) {
      renderToCanvas(previewCanvasRef.current, true);
    }
  }, [renderToCanvas, loadedImg]);

  if (!isOpen || !imageSource) return null;

  // Interactive Pointer / Touch Dragging on Preview Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX,
      panY
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Sensitivity scales smoothly
    const sensitivity = 0.45;
    const nextPanX = Math.max(-100, Math.min(100, Math.round(dragStartRef.current.panX + dx * sensitivity)));
    const nextPanY = Math.max(-100, Math.min(100, Math.round(dragStartRef.current.panY + dy * sensitivity)));
    setPanX(nextPanX);
    setPanY(nextPanY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  const handleResetAll = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const handleExportAndApply = () => {
    if (!loadedImg) return;
    setExporting(true);

    try {
      const exportCanvas = document.createElement('canvas');
      renderToCanvas(exportCanvas, false); // False = Do NOT draw rule-of-thirds grid on final image!

      let quality = 0.8;
      let webpDataUrl = exportCanvas.toDataURL('image/webp', quality);

      // Keep under ~115KB base64 (~85KB binary) for strict Firestore 1MB document safety
      while (webpDataUrl.length > 115000 && quality > 0.35) {
        quality -= 0.08;
        webpDataUrl = exportCanvas.toDataURL('image/webp', quality);
      }

      const stringLength = webpDataUrl.length - 'data:image/webp;base64,'.length;
      const compressedSizeBytes = Math.round((stringLength * 3) / 4);
      const estimatedOriginalBytes = Math.max(compressedSizeBytes, loadedImg.naturalWidth * loadedImg.naturalHeight * 0.4);
      const savingsPercent = Math.max(
        5,
        Math.round(((estimatedOriginalBytes - compressedSizeBytes) / estimatedOriginalBytes) * 100)
      );

      const { width, height, ratioLabel } = getTargetDimensions();

      onApply({
        webpDataUrl,
        originalFileName: 'atelier-framed.webp',
        originalSize: Math.round(estimatedOriginalBytes),
        compressedSize: compressedSizeBytes,
        compressionRatio: savingsPercent,
        width,
        height,
        aspectRatio: ratioLabel
      });
      onClose();
    } catch (err) {
      console.error(err);
      setLoadError('Không thể xuất ảnh WebP. Hãy thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const origW = loadedImg?.naturalWidth || 0;
  const origH = loadedImg?.naturalHeight || 0;
  const origRatioNum = origH > 0 ? origW / origH : 0.75;
  const isRatioDifferent = Math.abs(origRatioNum - 0.75) > 0.06;

  return (
    <div className="fixed inset-0 z-80 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] ${
          isDark
            ? 'bg-[#141513] text-[#ede9df] border-white/15'
            : 'bg-[#f4f1ea] text-[#141414] border-[#141414]/20'
        }`}
      >
        {/* Top Studio Bar */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#1b1c19] border-white/10' : 'bg-[#e8e4dc] border-[#141414]/15'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-[#141414] flex items-center justify-center shrink-0 shadow">
              <Crop className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                ATELIER IMAGE FRAMING & WEBP STUDIO
              </span>
              <h3 className="text-sm sm:text-base font-bagerich font-bold uppercase truncate">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetAll}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
                isDark
                  ? 'bg-white/5 hover:bg-white/15 border-white/15 text-white/80'
                  : 'bg-white hover:bg-[#141414] hover:text-white border-[#141414]/20 text-[#141414]'
              }`}
              title="Đặt lại mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đặt Lại</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-[#141414]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loadingImg ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-sm font-mono">Đang tải hình ảnh vào Studio căn chỉnh khung...</p>
            </div>
          ) : loadError ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <p className="text-sm text-red-400 font-medium">{loadError}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#141414] font-bold text-xs uppercase"
              >
                Đóng
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Canvas Viewport */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Move className="w-3.5 h-3.5" />
                    <span>Kéo trực tiếp trên ảnh để di chuyển vị trí tâm</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                      showGrid
                        ? 'bg-amber-400 text-[#141414] border-amber-400 font-bold'
                        : 'bg-white/5 border-white/15 opacity-70'
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span>Lưới 1/3</span>
                  </button>
                </div>

                {/* Interactive Canvas Container */}
                <div className="relative w-full min-h-[340px] sm:min-h-[420px] rounded-2xl bg-[#0b0c0a] border border-white/15 flex items-center justify-center p-3 overflow-hidden shadow-inner select-none">
                  <canvas
                    ref={previewCanvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className={`max-h-[380px] sm:max-h-[440px] w-auto max-w-full rounded-lg shadow-2xl touch-none transition-shadow ${
                      isDragging ? 'cursor-grabbing ring-2 ring-amber-400' : 'cursor-grab'
                    }`}
                  />

                  {/* Original vs Target Dimension Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-[10px] font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 text-white/90 backdrop-blur-md border border-white/10">
                      Ảnh gốc: {origW}×{origH}px
                      {isRatioDifferent ? ' (Khác tỉ lệ 3:4)' : ' (Chuẩn 3:4)'}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-400/90 text-[#141414] font-bold backdrop-blur-md">
                      Khung xuất: {getTargetDimensions().width}×{getTargetDimensions().height}px ({getTargetDimensions().ratioLabel})
                    </span>
                  </div>
                </div>

                {/* Quick 9-Point Focal Alignment Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono">
                  <span className="opacity-70">Căn tâm nhanh:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPanX(0);
                        setPanY(80);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] transition-colors"
                    >
                      Lấy Đỉnh Hoa (Trên)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPanX(0);
                        setPanY(0);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] transition-colors"
                    >
                      Chính Giữa (Tâm)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPanX(0);
                        setPanY(-80);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] transition-colors"
                    >
                      Lấy Bình/Gốc (Dưới)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Framing Controls, Fit Modes & Color Grading */}
              <div className="lg:col-span-6 space-y-5 text-xs">
                {/* 1. Target Aspect Ratio Presets */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                  <label className="font-mono uppercase text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>1. Chọn Tỉ Lệ Khung Hình Mong Muốn</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {ASPECT_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAspectPreset(preset.id)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          aspectPreset === preset.id
                            ? 'bg-amber-400 text-[#141414] border-amber-400 font-bold shadow-md'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                        }`}
                      >
                        <span className="font-mono text-xs block font-bold">{preset.id === 'original' ? 'GỐC' : preset.id}</span>
                        <span className="text-[9px] block opacity-80 truncate mt-0.5">{preset.labelVi}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fit Mode when Aspect Ratio Differs */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5">
                  <label className="font-mono uppercase text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>2. Chế Độ Xử Lý Khi Ảnh Bên Ngoài Khác Tỉ Lệ Khung</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FIT_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setFitMode(mode.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          fitMode === mode.id
                            ? 'bg-amber-400 text-[#141414] border-amber-400 font-bold shadow-md'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/85'
                        }`}
                      >
                        <div className="text-xs font-bold">{mode.labelVi}</div>
                        <div className={`text-[10px] mt-0.5 ${fitMode === mode.id ? 'text-[#141414]/80' : 'text-white/55'}`}>
                          {mode.descVi}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Zoom, Pan Sliders & Rotate/Flip */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono uppercase text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>3. Phóng To, Dịch Chuyển Tâm & Xoay Ảnh</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] flex items-center gap-1 font-mono text-[10px] transition-colors"
                        title="Xoay trái 90 độ"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>-90°</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-[#141414] flex items-center gap-1 font-mono text-[10px] transition-colors"
                        title="Xoay phải 90 độ"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>+90°</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipH((f) => !f)}
                        className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono text-[10px] transition-colors ${
                          flipH ? 'bg-amber-400 text-[#141414] font-bold' : 'bg-white/10 hover:bg-white/20'
                        }`}
                        title="Lật ngang"
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>Lật</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Phóng to / Thu nhỏ (Zoom):</span>
                      <span className="text-amber-300 font-bold">{Math.round(zoom * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ZoomOut className="w-3.5 h-3.5 opacity-60" />
                      <input
                        type="range"
                        min={fitMode === 'crop' ? 1.0 : 0.6}
                        max={3.0}
                        step={0.02}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                      <ZoomIn className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </div>

                  {/* Pan X & Pan Y Fine Sliders */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>Dịch Ngang (X):</span>
                        <span>{panX}%</span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={panX}
                        onChange={(e) => setPanX(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>Dịch Dọc (Y):</span>
                        <span>{panY}%</span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={panY}
                        onChange={(e) => setPanY(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Botanical Light & Color Grading */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-mono uppercase text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>4. Tinh Chỉnh Ánh Sáng & Sắc Độ Hoa</span>
                    </label>
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setBrightness(106);
                          setContrast(105);
                          setSaturation(108);
                        }}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400 hover:text-[#141414] transition-colors"
                      >
                        ✨ Tươi Sáng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBrightness(96);
                          setContrast(112);
                          setSaturation(94);
                        }}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400 hover:text-[#141414] transition-colors"
                      >
                        🌙 Điện Ảnh
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Độ sáng:</span>
                        <span>{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={70}
                        max={130}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Tương phản:</span>
                        <span>{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={70}
                        max={130}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Độ tươi màu:</span>
                        <span>{saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={140}
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-[#1b1c19] border-white/10' : 'bg-[#e8e4dc] border-[#141414]/15'
          }`}
        >
          <p className="text-[11px] font-mono opacity-75 text-center sm:text-left">
            Ảnh sau khi căn chỉnh sẽ tự động xuất sang chuẩn <strong>.WebP siêu nhẹ</strong> và lưu vĩnh viễn trên Firebase Firestore.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              disabled={loadingImg || exporting || !loadedImg}
              onClick={handleExportAndApply}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#141414] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{exporting ? 'Đang xuất WebP...' : 'Áp Dụng Khung Hình & Lưu (.WebP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
