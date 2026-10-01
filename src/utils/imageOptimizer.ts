/**
 * Image Compression & WebP Conversion Utility
 * Automatically compresses uploaded images and converts them to .webp format
 * preserving natural aspect ratio and reducing payload size significantly.
 */

export interface CompressionResult {
  webpDataUrl: string;
  originalFileName: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  compressionRatio: number; // percentage saved
  width: number;
  height: number;
  aspectRatio: string; // e.g. "3:4" or "4:3"
}

export async function compressAndConvertToWebP(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.1 to 1.0 (default 0.85)
  } = {}
): Promise<CompressionResult> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Calculate aspect ratio label
        const ratio = width / height;
        let aspectRatioLabel = '1:1';
        if (ratio > 1.2) {
          aspectRatioLabel = '4:3';
        } else if (ratio < 0.85) {
          aspectRatioLabel = '3:4';
        }

        // Scale down if dimensions exceed bounds while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Image smoothing for high fidelity
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Calculate compressed size in bytes from base64
        const stringLength = webpDataUrl.length - 'data:image/webp;base64,'.length;
        const compressedSizeBytes = Math.round((stringLength * 3) / 4);

        const originalSize = file.size;
        const savingsPercent = Math.max(
          0,
          Math.round(((originalSize - compressedSizeBytes) / originalSize) * 100)
        );

        resolve({
          webpDataUrl,
          originalFileName: file.name.replace(/\.[^/.]+$/, '') + '.webp',
          originalSize,
          compressedSize: compressedSizeBytes,
          compressionRatio: savingsPercent,
          width,
          height,
          aspectRatio: aspectRatioLabel
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image file'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
