/**
 * Image Compression & WebP Conversion Utility
 * Automatically compresses uploaded images, clipboard images, or external URLs
 * and converts them to .webp format while preserving natural aspect ratio
 * and staying well within Firestore document size limits.
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

/**
 * Checks if a pasted URL is a Facebook HTML webpage URL (e.g. facebook.com/photo?fbid=...)
 * rather than a direct image resource (e.g. scontent.*.fbcdn.net/...).
 */
export function isFacebookWebpageUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    (trimmed.includes('facebook.com/') || trimmed.includes('fb.com/') || trimmed.includes('fb.watch/')) &&
    !trimmed.includes('fbcdn.net') &&
    !trimmed.includes('lookaside.fbsbx.com')
  ) {
    return true;
  }
  return false;
}

/**
 * Checks if a URL is a temporary Facebook CDN image URL (fbcdn.net)
 */
export function isFacebookCdnUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.includes('fbcdn.net') || trimmed.includes('scontent');
}

export async function compressAndConvertToWebP(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0.1 to 1.0 (default 0.82)
  } = {}
): Promise<CompressionResult> {
  const { maxWidth = 1100, maxHeight = 1100, quality = 0.82 } = options;

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
        let webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Ensure single image stays under ~140KB for Firestore 1MB safety (5 images max per doc)
        let currentQuality = quality;
        while (webpDataUrl.length > 185000 && currentQuality > 0.45) {
          currentQuality -= 0.1;
          webpDataUrl = canvas.toDataURL('image/webp', currentQuality);
        }

        // Calculate compressed size in bytes from base64
        const stringLength = webpDataUrl.length - 'data:image/webp;base64,'.length;
        const compressedSizeBytes = Math.round((stringLength * 3) / 4);

        const originalSize = file.size || compressedSizeBytes;
        const savingsPercent = Math.max(
          0,
          Math.round(((originalSize - compressedSizeBytes) / originalSize) * 100)
        );

        resolve({
          webpDataUrl,
          originalFileName: (file.name ? file.name.replace(/\.[^/.]+$/, '') : 'image') + '.webp',
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

/**
 * Fetches an external image URL (such as Facebook CDN scontent.*.fbcdn.net or any image URL)
 * and converts it into a permanent, compressed .WebP Data URL so it never expires or breaks.
 */
export async function convertUrlToWebP(
  imageUrl: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<CompressionResult> {
  const cleanUrl = imageUrl.trim();
  if (!cleanUrl) {
    throw new Error('Đường dẫn ảnh trống');
  }

  if (isFacebookWebpageUrl(cleanUrl)) {
    throw new Error(
      'Đây là link trang bài viết Facebook, không phải link file ảnh trực tiếp. Hãy nhấp chuột phải vào ảnh trên Facebook chọn "Sao chép hình ảnh" (Copy Image) rồi bấm Ctrl+V vào đây, hoặc chọn "Sao chép địa chỉ hình ảnh" (Copy image address).'
    );
  }

  // Strategy 1: Direct fetch with no-referrer
  try {
    const response = await fetch(cleanUrl, {
      referrerPolicy: 'no-referrer',
      mode: 'cors'
    });
    if (response.ok) {
      const blob = await response.blob();
      if (blob.type.startsWith('image/') || blob.size > 500) {
        const file = new File([blob], 'external-image.jpg', {
          type: blob.type.startsWith('image/') ? blob.type : 'image/jpeg'
        });
        return await compressAndConvertToWebP(file, options);
      }
    }
  } catch {
    // Proceed to fallback proxy if direct CORS fetch is blocked
  }

  // Strategy 2: Fetch via global image proxy (wsrv.nl) to bypass CORS / Referer restrictions
  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&w=${options.maxWidth || 1100}&q=85`;
  const proxyRes = await fetch(proxyUrl, { referrerPolicy: 'no-referrer' });
  if (!proxyRes.ok) {
    throw new Error(
      'Không thể tải ảnh từ đường dẫn này (có thể ảnh ở chế độ Riêng tư trên Facebook hoặc đường dẫn không phải là ảnh). Hãy bấm chuột phải vào ảnh trên Facebook -> chọn "Sao chép hình ảnh" -> rồi nhấn Ctrl+V vào khung tải ảnh!'
    );
  }
  const blob = await proxyRes.blob();
  const file = new File([blob], 'cloud-image.webp', { type: 'image/webp' });
  return await compressAndConvertToWebP(file, options);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
