import { BespokeOrder, ORDER_WORKFLOW_STAGES } from '../context/AtelierContext';
import { convertVndToUsd, getUsdExchangeRate } from './currency';

export interface InvoiceBrandOptions {
  atelierName?: string;
  phone?: string;
  address?: string;
  email?: string;
  website?: string;
  lang?: 'vi' | 'en';
}

const OCCASION_LABELS: Record<string, { vi: string; en: string }> = {
  anniversary: { vi: 'Kỷ niệm / Tình yêu', en: 'Anniversary & Romance' },
  birthday: { vi: 'Chúc mừng sinh nhật', en: 'Birthday Celebration' },
  bridal: { vi: 'Hoa cưới Cầm tay / Lễ cưới', en: 'Bridal & Wedding' },
  vip_gratitude: { vi: 'Tri ân Đối tác VIP', en: 'VIP & Corporate Gratitude' },
  grand_opening: { vi: 'Khai trương / Sự kiện', en: 'Grand Opening & Event' },
  editorial: { vi: 'Thiết kế Không gian / Nghệ thuật', en: 'Spatial & Editorial Styling' },
  sympathy: { vi: 'Chia buồn / Thành kính', en: 'Sympathy & Remembrance' }
};

export function formatOccasionLabel(occasion: string, lang: 'vi' | 'en' = 'vi'): string {
  const found = OCCASION_LABELS[occasion];
  if (found) return lang === 'vi' ? found.vi : found.en;
  return occasion;
}

export function formatSubstitutionPolicy(
  policy?: BespokeOrder['substitutionPolicy'],
  lang: 'vi' | 'en' = 'vi'
): string {
  if (policy === 'strict_confirm') {
    return lang === 'vi'
      ? 'Gọi xác nhận trước mọi thay đổi'
      : 'Confirm before any substitution';
  }
  if (policy === 'designer_choice') {
    return lang === 'vi'
      ? 'Trao quyền sáng tạo cho Nghệ nhân'
      : 'Florist creative carte blanche';
  }
  return lang === 'vi'
    ? 'Cho phép thay hoa phụ tương đương theo mùa'
    : 'Allow seasonal equivalent stems';
}

/**
 * Generates the formatted plain-text order bill for Zalo / Clipboard
 */
export function buildOrderSummaryText(
  order: BespokeOrder,
  options: InvoiceBrandOptions = {}
): string {
  const brandName = options.atelierName || 'JU et Saigon';
  const usdRate = getUsdExchangeRate();
  const usdAmount = convertVndToUsd(order.budgetVnd, usdRate);
  const createdDateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : new Date().toLocaleString('vi-VN');

  const stageMeta = ORDER_WORKFLOW_STAGES.find((s) => s.id === order.status);
  const stageText = stageMeta ? stageMeta.labelVi : '1. Tiếp Nhận & Tư Vấn';

  const lines: string[] = [
    `╔══════════════════════════════╗`,
    `   PHIẾU XÁC NHẬN ĐẶT HOA — ${brandName.toUpperCase()}`,
    `╚══════════════════════════════╝`,
    `• Mã đơn hàng: ${order.orderCode}`,
    `• Thời gian tạo: ${createdDateStr}`,
    `• Trạng thái: ${stageText}`,
    `──────────────────────────────`,
    `👤 THÔNG TIN KHÁCH HÀNG & GIAO NHẬN:`,
    `• Khách hàng: ${order.customerName}`,
    `• Số điện thoại: ${order.customerPhone}`,
    ...(order.customerEmail ? [`• Email: ${order.customerEmail}`] : []),
    `• Khu vực giao: ${order.district}, TP.HCM`,
    `• Ngày giao hẹn: ${order.deliveryDate}${order.deliveryTimeSlot ? ` (${order.deliveryTimeSlot})` : ''}`,
    `• Dịp tặng: ${formatOccasionLabel(order.occasion, 'vi')}`,
    `──────────────────────────────`,
    `🌿 CHI TIẾT TÁC PHẨM HOA:`,
    `• Mẫu hoa: ${order.flowerName}`,
    ...(order.moodboardItems && order.moodboardItems.length > 0
      ? [`• Moodboard đính kèm: ${order.moodboardItems.join(', ')}`]
      : []),
    `• Ngân sách: ${order.budgetVnd.toLocaleString('vi-VN')} VND (~$${usdAmount.toLocaleString('en-US')} USD)`,
    `• Chính sách hoa: ${formatSubstitutionPolicy(order.substitutionPolicy, 'vi')}`
  ];

  if (order.giftCard?.enabled && order.giftCard.message) {
    lines.push(
      `──────────────────────────────`,
      `💌 THIỆP ĐÓNG DẤU SÁP (WAX-SEAL CARD):`,
      `• Người nhận: ${order.giftCard.recipient || order.customerName}`,
      `• Lời nhắn: "${order.giftCard.message}"`,
      `• Người gửi: ${order.giftCard.sender || order.customerName}`,
      `• Kiểu giấy & Sáp: Giấy ${order.giftCard.paperStyle} · Sáp ${order.giftCard.waxColor}`
    );
  }

  if (order.notes && order.notes.trim()) {
    lines.push(`──────────────────────────────`, `📝 GHI CHÚ RIÊNG: ${order.notes.trim()}`);
  }

  lines.push(
    `──────────────────────────────`,
    `Cảm ơn Quý khách! Vui lòng nhấn "Gửi" tin nhắn này để Nghệ nhân ${brandName} xác nhận đơn ngay.`
  );

  return lines.join('\n');
}

/**
 * Copies text to clipboard with fallback for iframe / mobile Safari environments
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below if Clipboard API is blocked by iframe permissions
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Helper to wrap text lines on HTML5 Canvas
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : [''];
}

/**
 * Renders a high-resolution Atelier Order Bill / Invoice onto an HTML5 Canvas and returns a PNG Data URL
 */
export async function generateOrderBillDataUrl(
  order: BespokeOrder,
  options: InvoiceBrandOptions = {}
): Promise<string> {
  const brandName = (options.atelierName || 'JU et Saigon').toUpperCase();
  const brandPhone = options.phone || '090 936 8080';
  const brandAddress = options.address || 'Dist. 1, Saigon, Vietnam';
  const usdRate = getUsdExchangeRate();
  const usdAmount = convertVndToUsd(order.budgetVnd, usdRate);

  const width = 1000;
  const hasCard = Boolean(order.giftCard?.enabled && order.giftCard?.message);
  const hasNotes = Boolean(order.notes && order.notes.trim());
  const height = 1280 + (hasCard ? 230 : 0) + (hasNotes ? 110 : 0);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // 1. Archival Parchment Paper Background
  ctx.fillStyle = '#f6f2e9';
  ctx.fillRect(0, 0, width, height);

  // Subtle inner editorial double-frame border
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = 'rgba(20, 20, 20, 0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  let y = 105;

  // 2. Top Kicker & Brand Header
  ctx.fillStyle = 'rgba(20, 20, 20, 0.6)';
  ctx.font = '600 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ATELIER BOTANIQUE · HAUTE COUTURE FLORAL RECEIPT', width / 2, y);

  y += 52;
  ctx.fillStyle = '#141414';
  ctx.font = 'bold 44px Georgia, "Times New Roman", serif';
  ctx.fillText(brandName, width / 2, y);

  y += 30;
  ctx.fillStyle = 'rgba(20, 20, 20, 0.68)';
  ctx.font = '500 16px sans-serif';
  ctx.fillText(`${brandAddress}  ·  Hotline / Zalo: ${brandPhone}`, width / 2, y);

  // Horizontal ornamental divider
  y += 30;
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, y);
  ctx.lineTo(width - 80, y);
  ctx.stroke();

  // 3. Order Code & Timestamp Highlight Box
  y += 28;
  ctx.fillStyle = '#141414';
  ctx.fillRect(80, y, width - 160, 96);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('MÃ ĐƠN HÀNG / ORDER CODE', 110, y + 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px monospace';
  ctx.fillText(order.orderCode, 110, y + 74);

  const createdDateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : new Date().toLocaleString('vi-VN');

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '500 14px monospace';
  ctx.fillText(`NGÀY LẬP PHIẾU: ${createdDateStr}`, width - 110, y + 36);

  const stageMeta = ORDER_WORKFLOW_STAGES.find((s) => s.id === order.status);
  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(
    `TRẠNG THÁI: ${(stageMeta ? stageMeta.labelVi : '1. Tiếp Nhận').toUpperCase()}`,
    width - 110,
    y + 72
  );

  y += 136;

  // 4. Section 1: Customer & Delivery Details
  ctx.textAlign = 'left';
  ctx.fillStyle = '#141414';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('01. THÔNG TIN KHÁCH HÀNG & LỊCH GIAO HOA', 80, y);

  y += 14;
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, y);
  ctx.lineTo(width - 80, y);
  ctx.stroke();

  const drawRow = (label: string, value: string | undefined, rowY: number, highlight = false) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(20, 20, 20, 0.62)';
    ctx.font = '600 17px sans-serif';
    ctx.fillText(label, 80, rowY);

    ctx.textAlign = 'right';
    ctx.fillStyle = highlight ? '#b45309' : '#141414';
    ctx.font = highlight ? 'bold 19px monospace' : 'bold 18px sans-serif';
    const wrapped = wrapCanvasText(ctx, value || '—', 520);
    wrapped.forEach((line, idx) => {
      ctx.fillText(line, width - 80, rowY + idx * 24);
    });
    return rowY + Math.max(1, wrapped.length) * 28 + 16;
  };

  y += 38;
  y = drawRow('Khách hàng đặt hoa (Client):', order.customerName, y);
  y = drawRow('Số điện thoại liên hệ (Phone):', order.customerPhone, y);
  if (order.customerEmail) {
    y = drawRow('Email:', order.customerEmail, y);
  }
  y = drawRow('Khu vực giao nhận (Area):', `${order.district}, TP. Hồ Chí Minh`, y);
  y = drawRow(
    'Thời gian giao hẹn (Schedule):',
    `${order.deliveryDate} · ${order.deliveryTimeSlot || 'Theo lịch hẹn'}`,
    y
  );
  y = drawRow('Dịp tặng / Sự kiện (Occasion):', formatOccasionLabel(order.occasion, 'vi'), y);

  // 5. Section 2: Floral Specification & Budget
  y += 20;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#141414';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('02. CHI TIẾT TÁC PHẨM & NGÂN SÁCH (SPECIFICATION)', 80, y);

  y += 14;
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, y);
  ctx.lineTo(width - 80, y);
  ctx.stroke();

  y += 38;
  y = drawRow('Tác phẩm hoa (Floral Piece):', order.flowerName, y);
  if (order.moodboardItems && order.moodboardItems.length > 0) {
    y = drawRow('Moodboard đính kèm:', order.moodboardItems.join(', '), y);
  }
  y = drawRow(
    'Chính sách phối hoa theo mùa:',
    formatSubstitutionPolicy(order.substitutionPolicy, 'vi'),
    y
  );

  // Total Price Box
  y += 8;
  ctx.fillStyle = 'rgba(20, 20, 20, 0.06)';
  ctx.fillRect(80, y, width - 160, 86);
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, y, width - 160, 86);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#141414';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('TỔNG NGÂN SÁCH DỰ KIẾN (EST. TOTAL):', 104, y + 50);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#141414';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(
    `${order.budgetVnd.toLocaleString('vi-VN')} VND`,
    width - 104,
    y + 42
  );
  ctx.fillStyle = 'rgba(20, 20, 20, 0.65)';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(
    `(~$${usdAmount.toLocaleString('en-US')} USD · Tỷ giá ${usdRate.toLocaleString('vi-VN')}đ)`,
    width - 104,
    y + 68
  );

  y += 126;

  // 6. Optional Wax-Seal Gift Card Box
  if (hasCard && order.giftCard) {
    ctx.fillStyle = '#efe9dc';
    ctx.fillRect(80, y, width - 160, 190);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, y, width - 160, 190);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(
      `03. THIỆP ĐÓNG DẤU SÁP THỦ CÔNG (PAPER: ${order.giftCard.paperStyle.toUpperCase()} · WAX: ${order.giftCard.waxColor.toUpperCase()})`,
      104,
      y + 32
    );

    ctx.fillStyle = '#141414';
    ctx.font = 'bold 17px Georgia, serif';
    ctx.fillText(
      `To: ${order.giftCard.recipient || order.customerName}`,
      104,
      y + 64
    );

    ctx.font = 'italic 18px Georgia, serif';
    const cardLines = wrapCanvasText(ctx, `"${order.giftCard.message}"`, width - 310);
    cardLines.slice(0, 3).forEach((line, idx) => {
      ctx.fillText(line, 104, y + 96 + idx * 24);
    });

    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText(
      `From: ${order.giftCard.sender || order.customerName}`,
      104,
      y + 168
    );

    // Draw Wax Seal Stamp Circle
    const sealX = width - 145;
    const sealY = y + 115;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 36, 0, Math.PI * 2);
    ctx.fillStyle =
      order.giftCard.waxColor === 'gold'
        ? '#d97706'
        : order.giftCard.waxColor === 'moss'
          ? '#2e442b'
          : order.giftCard.waxColor === 'bronze'
            ? '#78350f'
            : '#881337';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#fde68a';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText('JU', sealX, sealY + 6);

    y += 220;
  }

  // 7. Optional Customer Notes
  if (hasNotes) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#141414';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('GHI CHÚ ĐẶC BIỆT TỪ KHÁCH HÀNG:', 80, y);

    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.font = '16px sans-serif';
    const noteLines = wrapCanvasText(ctx, (order.notes || '').trim(), width - 160);
    noteLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, 80, y + 28 + idx * 24);
    });
    y += 88;
  }

  // 8. Footer Barcode & Verification Note
  const footerY = height - 125;
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  // Simulated decorative archival barcode
  const barStartX = width / 2 - 110;
  ctx.fillStyle = '#141414';
  for (let i = 0; i < 44; i++) {
    const bw = i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2;
    ctx.fillRect(barStartX + i * 5, footerY + 18, bw, 26);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(20, 20, 20, 0.65)';
  ctx.font = '500 14px sans-serif';
  ctx.fillText(
    `Phiếu xác nhận điện tử chính thức từ hệ thống ${brandName} · Tra cứu tiến độ đơn tại website bằng mã ${order.orderCode}`,
    width / 2,
    footerY + 66
  );

  return canvas.toDataURL('image/png');
}

/**
 * Triggers download of the generated PNG Order Bill
 */
export async function downloadOrderBillPng(
  order: BespokeOrder,
  options: InvoiceBrandOptions = {}
): Promise<string> {
  const dataUrl = await generateOrderBillDataUrl(order, options);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `Phieu-Dat-Hoa-${order.orderCode}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return dataUrl;
}

/**
 * Generates a refined, customer-ready QC Photo Approval message for Zalo
 */
export function buildQcApprovalMessageText(
  order: BespokeOrder,
  options: InvoiceBrandOptions = {}
): string {
  const brandName = options.atelierName || 'JU et Saigon';
  const hotline = options.phone || '090 969 26 25';

  const lines: string[] = [
    `🌸 [${brandName.toUpperCase()} — NGHIỆM THU TÁC PHẨM HOA TƯƠI]`,
    `Dạ ${brandName} xin gửi Anh/Chị ${order.customerName} thông tin nghiệm thu tác phẩm hoa vừa hoàn thiện tại xưởng ạ:`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `• Mã đơn hàng: ${order.orderCode}`,
    `• Tác phẩm: ${order.flowerName}`,
    ...(order.assignedFlorist ? [`• Nghệ nhân chế tác: ${order.assignedFlorist}`] : []),
    `• Lịch giao dự kiến: ${order.deliveryDate} (${order.deliveryTimeSlot || '08:30 – 11:30'})`,
    `• Khu vực giao: ${order.district}`
  ];

  if (order.giftCard?.enabled) {
    lines.push(
      `• Thiệp đóng dấu sáp: Gửi "${order.giftCard.recipient || '—'}" — Nội dung: "${order.giftCard.message}"`
    );
  }

  if (order.adminNote && order.adminNote.trim()) {
    lines.push(`• Ghi chú từ tiệm: ${order.adminNote.trim()}`);
  }

  lines.push(
    `━━━━━━━━━━━━━━━━━━━━`,
    `📸 Dạ Anh/Chị xem qua hình ảnh thực tế tác phẩm tiệm gửi kèm bên dưới nhé ạ.`,
    `Nếu Anh/Chị đã ưng ý form dáng & sắc độ hoa, Anh/Chị nhắn xác nhận để ${brandName} tiến hành bọc giữ ẩm gốc hoa và đặt xe giao đi đúng giờ hẹn ạ!`,
    `☎ Hotline hỗ trợ: ${hotline}`
  );

  return lines.join('\n');
}

/**
 * Downloads a dataURL / image URL directly to the user's device
 */
export function downloadDataUrlImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies a base64 / dataURL image (e.g. WebP or JPEG QC photo) into the system clipboard as PNG
 * so the shop admin can press Ctrl+V / Paste directly into Zalo chat!
 */
export async function copyDataUrlImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      return false;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 800;
    canvas.height = img.naturalHeight || img.height || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);

    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    );
    if (!pngBlob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': pngBlob
      })
    ]);
    return true;
  } catch {
    return false;
  }
}

