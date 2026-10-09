import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  MessageSquare,
  Feather,
  Search,
  Package,
  Clock,
  Truck,
  Heart,
  Droplets,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { FlowerItem } from '../data/flowers';
import {
  useAtelier,
  WaxSealGiftCard,
  BespokeOrder,
  ORDER_WORKFLOW_STAGES
} from '../context/AtelierContext';

interface BespokeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFlower: FlowerItem | null;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
}

const POETIC_CARD_TEMPLATES = [
  {
    labelVi: 'Kỷ Niệm Tình Yêu',
    labelEn: 'Romantic Anniversary',
    textVi:
      'Gửi người thương, mỗi đóa hoa nở rộ như những tháng ngày dịu dàng chúng mình đi qua. Chúc tình yêu của chúng ta luôn ngát hương và thuần khiết.',
    textEn:
      'Every blooming petal mirrors the tender moments we share. May our love remain timeless and ever-fragrant.'
  },
  {
    labelVi: 'Chúc Mừng Sinh Nhật',
    labelEn: 'Birthday Blessing',
    textVi:
      'Chúc bạn một tuổi mới rực rỡ, bình yên và ngập tràn cảm hứng như khu vườn buổi sớm tại Sài Gòn.',
    textEn:
      'Wishing you a luminous new year filled with serenity, grace, and the quiet beauty of blooming stems.'
  },
  {
    labelVi: 'Tri Ân & Trân Trọng',
    labelEn: 'Heartfelt Gratitude',
    textVi:
      'Cảm ơn sự đồng hành và những giá trị tốt đẹp bạn đã trao gửi. Chúc bạn luôn thịnh vượng và an nhiên.',
    textEn:
      'With deepest appreciation for your trust and grace. Wishing you continued harmony and prosperity.'
  }
];

export const BespokeOrderModal: React.FC<BespokeOrderModalProps> = ({
  isOpen,
  onClose,
  selectedFlower,
  lang,
  theme = 'light'
}) => {
  const { atelierData, flowers, wishlistIds, orders, createOrder } = useAtelier();
  const isDark = theme === 'dark';

  const [modeTab, setModeTab] = useState<'order' | 'track'>('order');

  // Customer Order State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState(
    selectedFlower?.category === 'bridal' ? 'bridal' : 'anniversary'
  );
  const [date, setDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('08:30 – 11:30 (Sáng)');
  const [district, setDistrict] = useState('Quận 1');
  const [budget, setBudget] = useState(selectedFlower ? selectedFlower.priceVnd : 3500000);
  const [notes, setNotes] = useState('');
  const [attachMoodboard, setAttachMoodboard] = useState(true);

  // Hạng mục 3: Bespoke Wax-Seal Card Studio State
  const [giftCard, setGiftCard] = useState<WaxSealGiftCard>({
    enabled: false,
    recipient: '',
    sender: '',
    message: '',
    paperStyle: 'parchment',
    fontStyle: 'serif',
    waxColor: 'crimson'
  });

  // Submission & Live Tracking State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<BespokeOrder | null>(null);
  const [trackQuery, setTrackQuery] = useState('');

  useEffect(() => {
    if (selectedFlower) {
      setBudget(selectedFlower.priceVnd);
      setOccasion(selectedFlower.category === 'bridal' ? 'bridal' : 'anniversary');
    }
  }, [selectedFlower]);

  if (!isOpen) return null;

  const cleanPhone = (atelierData.phone || '0909368080').replace(/\s+/g, '');
  const moodboardFlowers = flowers.filter((f) => wishlistIds.includes(f.id));

  // Keep createdOrder synced with real-time Firestore updates if Admin updates status while modal is open
  const liveOrder = createdOrder
    ? orders.find((o) => o.id === createdOrder.id) || createdOrder
    : null;

  // Filtered orders for tracking lookup
  const trackedOrders = trackQuery.trim()
    ? orders.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
          o.customerPhone.replace(/\s+/g, '').includes(trackQuery.trim().replace(/\s+/g, ''))
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const moodboardNames =
        attachMoodboard && moodboardFlowers.length > 0
          ? moodboardFlowers.map((f) => `${f.name} (${f.vietnameseName})`)
          : [];

      const savedOrder = await createOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        flowerId: selectedFlower?.id || '',
        flowerName: selectedFlower
          ? `${selectedFlower.name} (${selectedFlower.vietnameseName})`
          : moodboardNames.length > 0
            ? `Moodboard (${moodboardNames.length} mẫu)`
            : 'Thiết kế hoa Haute Couture theo yêu cầu',
        flowerImage: selectedFlower?.image || moodboardFlowers[0]?.image || '',
        moodboardItems: moodboardNames,
        occasion,
        deliveryDate: date || 'Sớm nhất',
        deliveryTimeSlot,
        district,
        budgetVnd: budget,
        notes: notes.trim(),
        giftCard: giftCard.enabled ? giftCard : undefined
      });
      setCreatedOrder(savedOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendZalo = (orderRef?: BespokeOrder | null) => {
    const targetOrder = orderRef || liveOrder;
    const flowerText = selectedFlower
      ? `Mẫu: ${selectedFlower.name} (${selectedFlower.vietnameseName})`
      : moodboardFlowers.length > 0
        ? `Moodboard yêu thích: ${moodboardFlowers.map((f) => f.name).join(', ')}`
        : 'Thiết kế hoa may đo riêng';
    const cardSummary =
      giftCard.enabled && giftCard.message
        ? `\n- Thiệp đóng dấu sáp gửi "${giftCard.recipient || 'Người thương'}": "${giftCard.message}" (Ký tên: ${giftCard.sender || name})`
        : '';
    const codeText = targetOrder ? `\n- Mã đơn hệ thống: ${targetOrder.orderCode}` : '';

    const message = encodeURIComponent(
      `Chào ${atelierData.name || 'JU et Saigon'}! Tôi muốn xác nhận tư vấn đặt hoa:${codeText}\n- Khách hàng: ${name || targetOrder?.customerName || 'Quý khách'}\n- Số điện thoại: ${phone || targetOrder?.customerPhone}\n- ${flowerText}\n- Dịp: ${occasion}\n- Ngày giao: ${date || targetOrder?.deliveryDate || 'Sớm nhất'} (${deliveryTimeSlot || targetOrder?.deliveryTimeSlot || 'Theo lịch hẹn'})\n- Khu vực: ${district}, TP.HCM\n- Ngân sách: ${budget.toLocaleString('vi-VN')} VND${cardSummary}\n- Ghi chú: ${notes}`
    );
    const link = document.createElement('a');
    link.href = `https://zalo.me/${cleanPhone}?text=${message}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = () => {
    const flowerText = selectedFlower ? `[${selectedFlower.name}]` : '[Bespoke Floral Request]';
    const subject = encodeURIComponent(
      `${atelierData.name || 'JU et Saigon'} — Yêu cầu tư vấn hoa ${flowerText} từ ${name || 'Khách hàng'}`
    );
    const body = encodeURIComponent(
      `Kính gửi Atelier ${atelierData.name || 'JU et Saigon'},\n\nTôi muốn đặt lịch tư vấn hoa với thông tin sau:\n- Họ tên: ${name}\n- Số điện thoại: ${phone}\n- Mẫu hoa quan tâm: ${selectedFlower ? selectedFlower.name + ' (' + selectedFlower.vietnameseName + ')' : 'Thiết kế riêng theo yêu cầu'}\n- Dịp tặng/Sự kiện: ${occasion}\n- Ngày cần hoa: ${date}\n- Khu vực giao hoa: ${district}, TP.HCM\n- Ngân sách dự kiến: ${budget.toLocaleString('vi-VN')} VND\n- Lời nhắn gửi / Thiệp: ${giftCard.enabled ? giftCard.message : notes}\n\nXin cảm ơn Atelier!`
    );
    window.location.href = `mailto:${atelierData.email}?subject=${subject}&body=${body}`;
  };

  const inputClass = isDark
    ? 'w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-[#ede9df] placeholder-white/40 focus:outline-none focus:border-amber-300'
    : 'w-full px-3.5 py-2.5 bg-white/85 border border-[#141414]/20 rounded-xl text-[#141414] placeholder-[#141414]/40 focus:outline-none focus:border-[#141414]';

  // Helper to render Wax Seal Color
  const getWaxSealColors = (color: WaxSealGiftCard['waxColor']) => {
    switch (color) {
      case 'gold':
        return 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 text-[#141414] border-amber-200';
      case 'bronze':
        return 'bg-gradient-to-br from-[#c08a5b] via-[#8c5830] to-[#593418] text-amber-100 border-[#d6a77a]';
      case 'moss':
        return 'bg-gradient-to-br from-[#4f6b4a] via-[#2e442b] to-[#1a2918] text-emerald-100 border-[#75946f]';
      case 'crimson':
      default:
        return 'bg-gradient-to-br from-[#a82431] via-[#7a131d] to-[#4a080f] text-amber-200 border-[#c94a56]';
    }
  };

  const getPaperClasses = (paper: WaxSealGiftCard['paperStyle']) => {
    switch (paper) {
      case 'noir':
        return 'bg-[#181816] text-[#ede9df] border-amber-400/30';
      case 'blush':
        return 'bg-[#f4e6e4] text-[#2e1d1d] border-[#d9b8b4]';
      case 'parchment':
      default:
        return 'bg-[#f6f2e9] text-[#1c1a17] border-[#d6cebe]';
    }
  };

  const renderStatusSteps = (ord: BespokeOrder) => {
    const status = ord.status;
    const steps = [
      { id: 'pending', labelVi: '1. Tiếp Nhận', labelEn: '1. Received', icon: CheckCircle2 },
      { id: 'conditioning', labelVi: '2. Dưỡng Hoa', labelEn: '2. Conditioning', icon: Droplets },
      { id: 'crafting', labelVi: '3. Chế Tác & Sáp', labelEn: '3. Crafting', icon: Sparkles },
      { id: 'quality_check', labelVi: '4. Nghiệm Thu Ảnh', labelEn: '4. Photo QC', icon: Camera },
      { id: 'delivering', labelVi: '5. Đang Giao', labelEn: '5. In Transit', icon: Truck },
      { id: 'completed', labelVi: '6. Hoàn Tất', labelEn: '6. Delivered', icon: Package }
    ] as const;

    const activeIdx = steps.findIndex((s) => s.id === status);
    const activeStageMeta = ORDER_WORKFLOW_STAGES.find((s) => s.id === status);
    const checklist = ord.workflowChecklist;

    return (
      <div className="space-y-3 pt-2">
        {status === 'cancelled' ? (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono text-center font-bold">
            {lang === 'vi' ? 'Đơn hàng đã tạm dừng / hủy bỏ' : 'Order Cancelled'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isDone = activeIdx >= idx;
                const isCurrent = activeIdx === idx;
                return (
                  <div
                    key={st.id}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                      isCurrent
                        ? isDark
                          ? 'bg-amber-400 text-[#141414] border-amber-300 font-bold shadow-md ring-2 ring-amber-400/30'
                          : 'bg-[#141414] text-amber-300 border-[#141414] font-bold shadow-md'
                        : isDone
                          ? isDark
                            ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                            : 'bg-emerald-950/10 border-emerald-800/30 text-emerald-900'
                          : isDark
                            ? 'bg-white/5 border-white/10 text-white/40'
                            : 'bg-white/50 border-[#141414]/10 text-[#141414]/45'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono font-bold leading-tight">
                      {lang === 'vi' ? st.labelVi : st.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {activeStageMeta && (
              <div
                className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-[#141414]/10'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase opacity-65 block">
                    {lang === 'vi' ? 'CÔNG ĐOẠN HIỆN TẠI TẠI XƯỞNG:' : 'CURRENT ATELIER STAGE:'}
                  </span>
                  <p className="font-semibold">
                    {lang === 'vi' ? activeStageMeta.descVi : activeStageMeta.descEn}
                  </p>
                </div>
                {ord.assignedFlorist && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-[10px] font-mono font-bold shrink-0">
                    {lang === 'vi' ? `Nghệ nhân: ${ord.assignedFlorist}` : `Florist: ${ord.assignedFlorist}`}
                  </span>
                )}
              </div>
            )}

            {/* Operational Checklist Badges */}
            {checklist && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  { key: 'stemsConditioned', labelVi: 'Tuyển & dưỡng hoa', labelEn: 'Stems Conditioned' },
                  { key: 'vesselPrepared', labelVi: 'Chuẩn bị cốt/bình', labelEn: 'Vessel Ready' },
                  { key: 'arrangementCrafted', labelVi: 'Hoàn thiện cắm hoa', labelEn: 'Crafted' },
                  ...(ord.giftCard?.enabled
                    ? [{ key: 'waxSealCardAttached', labelVi: 'Thiệp đóng dấu sáp', labelEn: 'Wax-Seal Card' }]
                    : []),
                  { key: 'qcPhotoUploaded', labelVi: 'Nghiệm thu hình ảnh', labelEn: 'Photo QC' },
                  { key: 'hydrationWrapped', labelVi: 'Bọc giữ ẩm & Care Tag', labelEn: 'Hydration Wrapped' }
                ].map((item) => {
                  const checked = Boolean(
                    checklist[item.key as keyof typeof checklist]
                  );
                  return (
                    <span
                      key={item.key}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono border flex items-center gap-1 ${
                        checked
                          ? isDark
                            ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                            : 'bg-emerald-900/10 border-emerald-800/30 text-emerald-900 font-semibold'
                          : 'border-current/15 opacity-45'
                      }`}
                    >
                      <span>{checked ? '✓' : '○'}</span>
                      <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Pre-Delivery QC Photo if uploaded by Florist */}
            {ord.finishedPhotoUrl && (
              <div
                className={`p-3.5 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-amber-400/10 border-amber-400/30' : 'bg-white border-[#141414]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {lang === 'vi'
                        ? 'ẢNH NGHIỆM THU TÁC PHẨM THỰC TẾ TẠI XƯỞNG'
                        : 'PRE-DELIVERY FINISHED ARRANGEMENT PHOTO'}
                    </span>
                  </span>
                  <span className="opacity-70">{ord.orderCode}</span>
                </div>
                <div className="w-full max-h-72 rounded-xl overflow-hidden bg-black/20 border border-current/10 flex items-center justify-center">
                  <img
                    src={ord.finishedPhotoUrl}
                    alt={ord.flowerName || 'Finished floral piece'}
                    className="w-full max-h-72 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Sequential Workflow History Log */}
            {ord.workflowHistory && ord.workflowHistory.length > 0 && (
              <div className="pt-1 space-y-1">
                <span className="text-[10px] font-mono uppercase opacity-55 block">
                  {lang === 'vi' ? 'NHẬT KÝ TRÌNH TỰ VẬN HÀNH:' : 'WORKFLOW TIMELINE LOG:'}
                </span>
                <div className="space-y-1">
                  {ord.workflowHistory.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] font-mono opacity-80 py-0.5 border-b border-current/5 last:border-none"
                    >
                      <span>• {log.note || log.stage}</span>
                      <span className="opacity-60 text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}{' '}
                        {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden backdrop-blur-2xl flex items-center justify-center p-2.5 sm:p-6 animate-fadeIn transition-colors duration-300 ${
        isDark ? 'bg-black/80' : 'bg-[#dcd8cf]/90'
      }`}
    >
      <div
        className={`relative w-full max-w-3xl squircle-2xl rounded-[28px] sm:rounded-[38px] shadow-soft-3 border overflow-hidden my-auto max-h-[95vh] flex flex-col transition-colors duration-300 ${
          isDark
            ? 'bg-[#151614] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* Top Header & Mode Switcher */}
        <div
          className={`px-5 sm:px-8 py-4 border-b flex items-center justify-between gap-2 flex-shrink-0 ${
            isDark ? 'border-white/15 bg-[#181917]' : 'border-[#141414]/15 bg-[#dcd8cf]'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setModeTab('order');
                setCreatedOrder(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase transition-all ${
                modeTab === 'order'
                  ? isDark
                    ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                    : 'bg-[#141414] text-[#dcd8cf] font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {lang === 'vi' ? 'Đặt Tư Vấn & Thiệp Sáp' : 'Bespoke Order & Card'}
            </button>

            <button
              type="button"
              onClick={() => setModeTab('track')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase flex items-center gap-1.5 transition-all ${
                modeTab === 'track'
                  ? isDark
                    ? 'bg-amber-400 text-[#141414] font-bold shadow-sm'
                    : 'bg-[#141414] text-[#dcd8cf] font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Tra Cứu Đơn Hàng' : 'Track Order'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] rounded-full bg-black/60 text-white hover:bg-black transition-colors flex items-center justify-center border border-white/20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar overscroll-contain flex-1">
          {modeTab === 'track' ? (
            /* ORDER TRACKING TAB */
            <div className="p-5 sm:p-8 space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 block">
                  REAL-TIME ATELIER CONCIERGE TRACKING
                </span>
                <h3 className="text-2xl font-fleur-title uppercase mt-0.5">
                  {lang === 'vi'
                    ? 'TRA CỨU TIẾN ĐỘ ĐƠN HOA CỦA BẠN'
                    : 'TRACK YOUR BESPOKE FLORAL ORDER'}
                </h3>
                <p className="text-xs opacity-75 mt-1">
                  {lang === 'vi'
                    ? 'Nhập Mã đơn hàng (VD: JU-0810-...) hoặc Số điện thoại đặt hoa để xem trạng thái thực tế từ Atelier.'
                    : 'Enter your Order Code (e.g., JU-0810-...) or Phone Number to check live status.'}
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder={
                    lang === 'vi'
                      ? 'Nhập mã đơn JU-... hoặc số điện thoại của bạn...'
                      : 'Enter Order Code JU-... or phone number...'
                  }
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className={`${inputClass} pl-10 font-mono text-xs`}
                />
              </div>

              {trackQuery.trim() === '' ? (
                <div className="p-8 rounded-2xl border border-current/10 text-center text-xs opacity-65">
                  {lang === 'vi'
                    ? 'Vui lòng nhập số điện thoại hoặc mã đơn hàng để hiển thị tiến độ.'
                    : 'Please enter your phone number or order code above.'}
                </div>
              ) : trackedOrders.length === 0 ? (
                <div className="p-8 rounded-2xl border border-current/10 text-center text-xs opacity-75">
                  {lang === 'vi'
                    ? 'Không tìm thấy đơn hàng khớp với thông tin vừa nhập.'
                    : 'No matching order found.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {trackedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                        isDark ? 'bg-white/5 border-white/15' : 'bg-white/80 border-[#141414]/15'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-current/10">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-amber-400 bg-black/75 px-2.5 py-0.5 rounded-full">
                            {ord.orderCode}
                          </span>
                          <h4 className="font-bold text-sm mt-1.5">{ord.flowerName}</h4>
                        </div>
                        <div className="text-right text-xs font-mono">
                          <span className="block font-bold">
                            {ord.budgetVnd.toLocaleString('vi-VN')} VND
                          </span>
                          <span className="text-[10px] opacity-60">
                            {lang === 'vi' ? 'Giao tại:' : 'Area:'} {ord.district} · {ord.deliveryDate}
                            {ord.deliveryTimeSlot ? ` (${ord.deliveryTimeSlot})` : ''}
                          </span>
                        </div>
                      </div>

                      {renderStatusSteps(ord)}

                      {ord.adminNote && (
                        <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs">
                          <span className="font-mono font-bold uppercase text-[10px] block mb-0.5">
                            {lang === 'vi' ? 'Ghi chú từ Nghệ nhân JU et Saigon:' : 'Note from Atelier:'}
                          </span>
                          <p>{ord.adminNote}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : liveOrder ? (
            /* CONFIRMATION & LIVE RECEIPT STATE */
            <div className="p-6 sm:p-10 space-y-6 animate-fadeIn">
              <div className="text-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#141414] text-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 font-mono text-xs font-bold">
                  MÃ ĐƠN HÀNG: {liveOrder.orderCode}
                </span>

                <h3 className="text-2xl sm:text-3xl font-fleur-title uppercase tracking-wide">
                  {lang === 'vi'
                    ? 'ĐÃ LƯU ĐƠN HÀNG LÊN HỆ THỐNG ATELIER'
                    : 'BESPOKE ORDER CONFIRMED & SYNCED'}
                </h3>
                <p
                  className={`text-xs sm:text-sm font-sans max-w-lg mx-auto ${
                    isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/80'
                  }`}
                >
                  {lang === 'vi'
                    ? `Cảm ơn ${liveOrder.customerName}! Yêu cầu đặt hoa của bạn đã được đồng bộ trực tiếp tới Bảng Quản Trị của ${atelierData.name || 'JU et Saigon'}. Nghệ nhân sẽ liên hệ qua số ${liveOrder.customerPhone} trong 15–30 phút.`
                    : `Thank you ${liveOrder.customerName}! Your bespoke request (${liveOrder.orderCode}) is now live with our florists.`}
                </p>
              </div>

              {/* Live 4-step Order Tracker */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-white/5 border-white/15' : 'bg-white/75 border-[#141414]/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'vi' ? 'Trạng thái đơn hàng thời gian thực' : 'Real-Time Order Status'}
                    </span>
                  </span>
                  <span className="opacity-70">{liveOrder.flowerName}</span>
                </div>
                {renderStatusSteps(liveOrder)}
              </div>

              {/* Preview Wax Seal Card if enabled */}
              {liveOrder.giftCard?.enabled && (
                <div
                  className={`p-5 rounded-2xl border relative ${getPaperClasses(
                    liveOrder.giftCard.paperStyle
                  )}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase opacity-60 mb-2">
                    <span>BESPOKE BOTANICAL GREETING CARD</span>
                    <span>JU ET SAIGON WAX SEAL</span>
                  </div>
                  <p className="text-xs font-bold mb-1">
                    Dear {liveOrder.giftCard.recipient || liveOrder.customerName},
                  </p>
                  <p className="text-xs sm:text-sm italic leading-relaxed my-2">
                    "{liveOrder.giftCard.message}"
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/10">
                    <span className="text-xs font-semibold">
                      With love, {liveOrder.giftCard.sender || liveOrder.customerName}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full border-2 shadow-md flex items-center justify-center font-fleur-title text-[10px] font-bold ${getWaxSealColors(
                        liveOrder.giftCard.waxColor
                      )}`}
                    >
                      JU
                    </div>
                  </div>
                </div>
              )}

              {/* Quick action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleSendZalo(liveOrder)}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? `Gửi Kèm Qua Zalo (${atelierData.phoneFormatted || atelierData.phone})`
                      : 'Connect via Zalo'}
                  </span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className={`w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                    isDark
                      ? 'bg-[#ede9df] text-[#141414] hover:bg-white'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2c2a27]'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>
                    {lang === 'vi'
                      ? `Gọi Hotline: ${atelierData.phoneFormatted || atelierData.phone}`
                      : 'Call Atelier Directly'}
                  </span>
                </a>
              </div>
            </div>
          ) : (
            /* BESPOKE ORDER + WAX-SEAL CARD STUDIO FORM */
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
              <div>
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase block mb-1 ${
                    isDark ? 'text-amber-300/80' : 'text-[#141414]/60'
                  }`}
                >
                  ATELIER {atelierData.name?.toUpperCase() || 'JU ET SAIGON'} · QUẬN 1
                </span>
                <h3 className="text-2xl sm:text-3xl font-fleur-title uppercase tracking-wide">
                  {lang === 'vi'
                    ? 'ĐẶT LỊCH TƯ VẤN HOA & THIỆP ĐÓNG DẤU SÁP'
                    : 'BESPOKE FLORAL CONSULTATION & WAX-SEAL CARD'}
                </h3>
              </div>

              {/* Selected Flower Capsule Banner */}
              {selectedFlower && (
                <div
                  className={`flex items-center gap-3 p-3.5 rounded-[22px] border shadow-soft-1 ${
                    isDark ? 'bg-white/5 border-white/15' : 'glass-frost-pill border-white/80'
                  }`}
                >
                  <img
                    src={selectedFlower.image}
                    alt={selectedFlower.name}
                    className="w-12 h-12 rounded-[16px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs font-bold uppercase font-serif-editorial truncate ${
                        isDark ? 'text-white' : 'text-[#141414]'
                      }`}
                    >
                      {selectedFlower.name}
                    </h4>
                    <p
                      className={`text-[11px] truncate ${
                        isDark ? 'text-[#ede9df]/70' : 'text-[#141414]/70'
                      }`}
                    >
                      {lang === 'vi' ? selectedFlower.vietnameseName : selectedFlower.latinName}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`text-xs font-bold font-mono tabular-nums block ${
                        isDark ? 'text-amber-300' : 'text-[#141414]'
                      }`}
                    >
                      {selectedFlower.priceVnd.toLocaleString('vi-VN')} đ
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        selectedFlower.availabilityStatus === 'seasonal_out'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : selectedFlower.availabilityStatus === 'preorder_24h'
                            ? 'bg-amber-400/20 text-amber-500 border border-amber-400/40'
                            : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                      }`}
                    >
                      {selectedFlower.availabilityStatus === 'seasonal_out'
                        ? lang === 'vi'
                          ? 'Hết mùa · Cần tư vấn mẫu tương đương'
                          : 'Seasonal Out'
                        : selectedFlower.availabilityStatus === 'preorder_24h'
                          ? lang === 'vi'
                            ? 'Đặt trước 24h (Haute Couture)'
                            : '24h Pre-order'
                          : lang === 'vi'
                            ? 'Sẵn hoa tươi trong ngày'
                            : 'Available Today'}
                    </span>
                  </div>
                </div>
              )}

              {/* 6-Stage Atelier Craftsmanship Pipeline Overview Strip */}
              <div
                className={`p-3 rounded-2xl border text-[11px] flex flex-wrap items-center justify-between gap-2 ${
                  isDark ? 'bg-white/5 border-white/10 text-white/75' : 'bg-white/60 border-[#141414]/10 text-[#141414]/80'
                }`}
              >
                <span className="font-mono uppercase font-bold text-[10px]">
                  {lang === 'vi' ? 'QUY TRÌNH 6 BƯỚC CHUẨN ATELIER:' : '6-STAGE ATELIER WORKFLOW:'}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span>1. Tiếp nhận</span>
                  <span className="opacity-40">→</span>
                  <span>2. Dưỡng hoa</span>
                  <span className="opacity-40">→</span>
                  <span>3. Chế tác & Thiệp sáp</span>
                  <span className="opacity-40">→</span>
                  <span>4. Chụp ảnh nghiệm thu</span>
                  <span className="opacity-40">→</span>
                  <span>5. Đóng gói giữ ẩm</span>
                  <span className="opacity-40">→</span>
                  <span>6. Trao tận tay</span>
                </div>
              </div>

              {/* Attach Moodboard items checkbox if user has saved items */}
              {moodboardFlowers.length > 0 && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isDark
                      ? 'bg-rose-500/10 border-rose-400/30 text-rose-200'
                      : 'bg-rose-500/10 border-rose-800/20 text-[#141414]'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attachMoodboard}
                      onChange={(e) => setAttachMoodboard(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                    <span className="font-medium flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>
                        {lang === 'vi'
                          ? `Đính kèm ${moodboardFlowers.length} mẫu hoa từ Moodboard Yêu Thích của bạn`
                          : `Include ${moodboardFlowers.length} saved specimens from your Moodboard`}
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5 opacity-60" />
                    <span>{lang === 'vi' ? 'Họ và Tên Quý Khách' : 'Full Name'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'Jane Doe'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 opacity-60" />
                    <span>{lang === 'vi' ? 'Số Điện Thoại (Zalo)' : 'Phone Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={atelierData.phoneFormatted || '090 936 80 80'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider block">
                    {lang === 'vi' ? 'Dịp Sử Dụng / Sự Kiện' : 'Occasion'}
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className={inputClass}
                  >
                    <option value="bridal" className="text-black">
                      {lang === 'vi' ? 'Hoa Cưới Cô Dâu (Bridal Bouquet)' : 'Bridal Bouquet & Wedding'}
                    </option>
                    <option value="anniversary" className="text-black">
                      {lang === 'vi' ? 'Sinh Nhật & Kỷ Niệm (Anniversary)' : 'Anniversary & Birthday'}
                    </option>
                    <option value="exhibition" className="text-black">
                      {lang === 'vi' ? 'Triển Lãm & Không Gian Nghệ Thuật' : 'Exhibition & Space Decor'}
                    </option>
                    <option value="corporate" className="text-black">
                      {lang === 'vi' ? 'Quà Tặng Doanh Nghiệp / Đối Tác' : 'VIP Corporate Gifting'}
                    </option>
                    <option value="custom" className="text-black">
                      {lang === 'vi' ? 'Thiết Kế Độc Bản Theo Yêu Cầu' : 'Bespoke Custom Theme'}
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 opacity-60" />
                    <span>{lang === 'vi' ? 'Khu Vực Nhận Hoa (TP.HCM)' : 'Delivery Area (Saigon)'}</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Quận 1" className="text-black">
                      Quận 1 (Atelier JU et Saigon)
                    </option>
                    <option value="Quận 2 (Thảo Điền / An Phú)" className="text-black">
                      Quận 2 (Thảo Điền / An Phú)
                    </option>
                    <option value="Quận 3" className="text-black">
                      Quận 3
                    </option>
                    <option value="Quận 7 (Phú Mỹ Hưng)" className="text-black">
                      Quận 7 (Phú Mỹ Hưng)
                    </option>
                    <option value="Bình Thạnh" className="text-black">
                      Quận Bình Thạnh
                    </option>
                    <option value="Phú Nhuận" className="text-black">
                      Quận Phú Nhuận
                    </option>
                    <option value="TP. Thủ Đức" className="text-black">
                      TP. Thủ Đức
                    </option>
                    <option value="Các quận khác" className="text-black">
                      Các quận khác tại TP.HCM
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 opacity-60" />
                    <span>{lang === 'vi' ? 'Ngày Nhận Hoa Dự Kiến' : 'Preferred Date'}</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span>{lang === 'vi' ? 'Khung Giờ Nhận Hoa (Time Slot)' : 'Delivery Time Window'}</span>
                  </label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className={inputClass}
                  >
                    <option value="08:30 – 11:30 (Sáng)" className="text-black">
                      {lang === 'vi' ? '08:30 – 11:30 (Khung Giờ Sáng)' : '08:30 – 11:30 AM (Morning)'}
                    </option>
                    <option value="11:30 – 14:30 (Trưa)" className="text-black">
                      {lang === 'vi' ? '11:30 – 14:30 (Khung Giờ Trưa)' : '11:30 AM – 02:30 PM (Midday)'}
                    </option>
                    <option value="14:30 – 17:30 (Chiều)" className="text-black">
                      {lang === 'vi' ? '14:30 – 17:30 (Khung Giờ Chiều)' : '02:30 – 05:30 PM (Afternoon)'}
                    </option>
                    <option value="17:30 – 20:30 (Tối)" className="text-black">
                      {lang === 'vi' ? '17:30 – 20:30 (Khung Giờ Tối)' : '05:30 – 08:30 PM (Evening)'}
                    </option>
                    <option value="Giao Gấp (Express 2h - 3h)" className="text-black">
                      {lang === 'vi' ? '⚡ Giao Gấp Trong 2h – 3h (Express)' : '⚡ Express Delivery (2-3h)'}
                    </option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold uppercase tracking-wider block">
                    {lang === 'vi' ? 'Ngân Sách Dự Kiến:' : 'Budget Guide:'}{' '}
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        isDark ? 'text-amber-300' : 'text-[#141414]'
                      }`}
                    >
                      {budget.toLocaleString('vi-VN')} đ
                    </span>
                  </label>
                  <input
                    type="range"
                    min="2000000"
                    max="15000000"
                    step="500000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className={`w-full ${isDark ? 'accent-amber-400' : 'accent-[#141414]'}`}
                  />
                  <div
                    className={`flex justify-between text-[10px] font-mono ${
                      isDark ? 'text-white/50' : 'text-[#141414]/60'
                    }`}
                  >
                    <span>2.0M</span>
                    <span>7.5M</span>
                    <span>15.0M+</span>
                  </div>
                </div>
              </div>

              {/* HẠNG MỤC 3: BESPOKE WAX-SEAL GREETING CARD STUDIO */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border space-y-4 transition-all ${
                  isDark
                    ? 'bg-white/5 border-amber-400/30'
                    : 'bg-white/65 border-[#141414]/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={giftCard.enabled}
                      onChange={(e) =>
                        setGiftCard((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                      <Feather className="w-4 h-4 text-amber-500" />
                      <span>
                        {lang === 'vi'
                          ? 'Đính Kèm Thiệp Nghệ Thuật Đóng Dấu Sáp (Miễn Phí)'
                          : 'Include Bespoke Wax-Seal Greeting Card (Complimentary)'}
                      </span>
                    </span>
                  </label>
                </div>

                {giftCard.enabled && (
                  <div className="space-y-4 pt-2 border-t border-current/10 animate-fadeIn text-xs">
                    {/* Quick Poetic Templates */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase opacity-65 mr-1">
                        {lang === 'vi' ? 'Gợi ý lời chúc:' : 'Templates:'}
                      </span>
                      {POETIC_CARD_TEMPLATES.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setGiftCard((prev) => ({
                              ...prev,
                              message: lang === 'vi' ? tpl.textVi : tpl.textEn
                            }))
                          }
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono border transition-colors ${
                            isDark
                              ? 'border-white/20 hover:bg-white/15 text-amber-200'
                              : 'border-[#141414]/20 hover:bg-white text-[#141414]'
                          }`}
                        >
                          + {lang === 'vi' ? tpl.labelVi : tpl.labelEn}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">
                          {lang === 'vi' ? 'Người nhận trên thiệp (Dear...)' : 'Recipient Name'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'vi' ? 'VD: Em yêu / Mẹ kính yêu...' : 'e.g., My Dearest'}
                          value={giftCard.recipient}
                          onChange={(e) =>
                            setGiftCard((prev) => ({ ...prev, recipient: e.target.value }))
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold block mb-1">
                          {lang === 'vi' ? 'Chữ ký người gửi (From...)' : 'Sender Signature'}
                        </label>
                        <input
                          type="text"
                          placeholder={name || (lang === 'vi' ? 'Tên của bạn' : 'Your Name')}
                          value={giftCard.sender}
                          onChange={(e) =>
                            setGiftCard((prev) => ({ ...prev, sender: e.target.value }))
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold block mb-1">
                        {lang === 'vi' ? 'Thông điệp trên thiệp' : 'Card Message'}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={
                          lang === 'vi'
                            ? 'Nhập lời chúc chân thành của bạn...'
                            : 'Write your heartfelt message...'
                        }
                        value={giftCard.message}
                        onChange={(e) =>
                          setGiftCard((prev) => ({ ...prev, message: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* Paper & Wax Seal Customizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase opacity-70 block mb-1.5">
                          {lang === 'vi' ? 'Chất liệu giấy mỹ thuật:' : 'Artisanal Paper:'}
                        </label>
                        <div className="flex gap-1.5">
                          {[
                            { id: 'parchment', labelVi: 'Giấy Dó Kem', labelEn: 'Parchment' },
                            { id: 'noir', labelVi: 'Đen Tuyền', labelEn: 'Obsidian' },
                            { id: 'blush', labelVi: 'Hồng Cổ Điển', labelEn: 'Blush' }
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() =>
                                setGiftCard((prev) => ({
                                  ...prev,
                                  paperStyle: p.id as WaxSealGiftCard['paperStyle']
                                }))
                              }
                              className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono transition-all ${
                                giftCard.paperStyle === p.id
                                  ? 'border-amber-500 font-bold ring-1 ring-amber-500/40'
                                  : 'border-current/15 opacity-70'
                              }`}
                            >
                              {lang === 'vi' ? p.labelVi : p.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase opacity-70 block mb-1.5">
                          {lang === 'vi' ? 'Màu dấu sáp đóng tay:' : 'Botanical Wax Seal:'}
                        </label>
                        <div className="flex gap-1.5">
                          {[
                            { id: 'crimson', labelVi: 'Đỏ Rượu', labelEn: 'Crimson' },
                            { id: 'gold', labelVi: 'Vàng Kim', labelEn: 'Gold' },
                            { id: 'bronze', labelVi: 'Đồng Cổ', labelEn: 'Bronze' },
                            { id: 'moss', labelVi: 'Xanh Rêu', labelEn: 'Moss' }
                          ].map((w) => (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() =>
                                setGiftCard((prev) => ({
                                  ...prev,
                                  waxColor: w.id as WaxSealGiftCard['waxColor']
                                }))
                              }
                              className={`flex-1 py-1.5 px-1.5 rounded-lg border text-[10px] font-mono transition-all ${
                                giftCard.waxColor === w.id
                                  ? 'border-amber-500 font-bold ring-1 ring-amber-500/40'
                                  : 'border-current/15 opacity-70'
                              }`}
                            >
                              {lang === 'vi' ? w.labelVi : w.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Wax-Seal Card Preview */}
                    <div
                      className={`p-5 rounded-2xl border shadow-inner transition-all ${getPaperClasses(
                        giftCard.paperStyle
                      )}`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest opacity-55 mb-2">
                        <span>JU ET SAIGON · HAUTE COUTURE CARD PREVIEW</span>
                        <span>HAND-SEALED ATELIER EDITION</span>
                      </div>
                      <p className="text-xs font-semibold">
                        {giftCard.recipient
                          ? `${lang === 'vi' ? 'Thân gửi' : 'Dearest'} ${giftCard.recipient},`
                          : lang === 'vi'
                            ? 'Thân gửi Người thương,'
                            : 'Dearest,'}
                      </p>
                      <p className="text-sm font-editorial-serif italic leading-relaxed my-3 min-h-[36px]">
                        "
                        {giftCard.message ||
                          (lang === 'vi'
                            ? 'Những cánh hoa tươi thắm nhất từ JU et Saigon thay lời chúc tốt đẹp gửi đến bạn...'
                            : 'May these curated blooms bring timeless beauty to your day...')}
                        "
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-current/10">
                        <span className="text-xs font-mono">
                          — {giftCard.sender || name || 'JU et Saigon'}
                        </span>
                        <div
                          className={`w-11 h-11 rounded-full border-2 shadow-lg flex flex-col items-center justify-center font-fleur-title leading-none select-none ${getWaxSealColors(
                            giftCard.waxColor
                          )}`}
                          title="Botanical Wax Seal"
                        >
                          <span className="text-[11px] font-bold tracking-wider">JU</span>
                          <span className="text-[7px] font-mono tracking-tighter opacity-80">
                            SAIGON
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Notes */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold uppercase tracking-wider block">
                  {lang === 'vi'
                    ? 'Ghi Chú Thiết Kế Hoa & Giờ Giao Mong Muốn'
                    : 'Bespoke Concept & Delivery Timing Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    lang === 'vi'
                      ? 'Ví dụ: Tông màu trắng kem sang trọng, giao lúc 10h sáng...'
                      : 'Specific flowers desired, color palette, delivery time...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputClass} rounded-[18px]`}
                />
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`spring-press w-full sm:w-auto min-h-[46px] px-8 py-3.5 rounded-[22px] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-soft-2 border ${
                    isDark
                      ? 'bg-amber-400 text-[#141414] hover:bg-amber-300 border-amber-300'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-[#2c2a27] border-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? lang === 'vi'
                        ? 'Đang Lưu Đơn Hàng...'
                        : 'Saving Order...'
                      : lang === 'vi'
                        ? 'Xác Nhận Đặt Hoa & Lưu Hệ Thống'
                        : 'Confirm & Save Bespoke Order'}
                  </span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSendZalo()}
                    className="spring-press flex-1 sm:flex-initial min-h-[42px] px-4 py-2.5 rounded-[18px] bg-[#0068FF] text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Zalo {atelierData.phoneFormatted || atelierData.phone}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className={`spring-press flex-1 sm:flex-initial min-h-[42px] px-4 py-2.5 rounded-[18px] border text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      isDark
                        ? 'border-white/25 hover:border-white text-[#ede9df] bg-white/5'
                        : 'border-[#141414]/25 hover:border-[#141414] text-[#141414] glass-frost-pill'
                    }`}
                  >
                    Email Atelier
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
