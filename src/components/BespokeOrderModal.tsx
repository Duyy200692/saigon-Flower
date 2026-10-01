import React, { useState } from 'react';
import { X, Sparkles, PhoneCall, Send, CheckCircle2, Calendar, MapPin, User, Mail, MessageSquare } from 'lucide-react';
import { FlowerItem, ATELIER_DATA } from '../data/flowers';

interface BespokeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFlower: FlowerItem | null;
  lang: 'vi' | 'en';
}

export const BespokeOrderModal: React.FC<BespokeOrderModalProps> = ({
  isOpen,
  onClose,
  selectedFlower,
  lang
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState(selectedFlower?.category === 'bridal' ? 'bridal' : 'anniversary');
  const [date, setDate] = useState('');
  const [district, setDistrict] = useState('Quận 1');
  const [budget, setBudget] = useState(selectedFlower ? selectedFlower.priceVnd : 3500000);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSendZalo = () => {
    const flowerText = selectedFlower ? `Mẫu: ${selectedFlower.name} (${selectedFlower.vietnameseName})` : 'Thiết kế hoa may đo riêng';
    const message = encodeURIComponent(
      `Chào JU et Saigon! Tôi muốn tư vấn đặt hoa:\n- Khách hàng: ${name || 'Quý khách'}\n- Số điện thoại: ${phone}\n- ${flowerText}\n- Dịp: ${occasion}\n- Ngày giao: ${date || 'Sớm nhất'}\n- Địa chỉ/Khu vực: ${district}, TP.HCM\n- Ngân sách: ${(budget).toLocaleString('vi-VN')} VND\n- Ghi chú: ${notes}`
    );
    window.open(`https://zalo.me/0909368080?text=${message}`, '_blank');
  };

  const handleSendEmail = () => {
    const flowerText = selectedFlower ? `[${selectedFlower.name}]` : '[Bespoke Floral Request]';
    const subject = encodeURIComponent(`JU et Saigon — Yêu cầu tư vấn hoa ${flowerText} từ ${name || 'Khách hàng'}`);
    const body = encodeURIComponent(
      `Kính gửi Atelier JU et Saigon,\n\nTôi muốn đặt lịch tư vấn hoa với thông tin sau:\n- Họ tên: ${name}\n- Số điện thoại: ${phone}\n- Email: ${email}\n- Mẫu hoa quan tâm: ${selectedFlower ? selectedFlower.name + ' (' + selectedFlower.vietnameseName + ')' : 'Thiết kế riêng theo yêu cầu'}\n- Dịp tặng/Sự kiện: ${occasion}\n- Ngày cần hoa: ${date}\n- Khu vực giao hoa: ${district}, TP.HCM\n- Ngân sách dự kiến: ${(budget).toLocaleString('vi-VN')} VND\n- Lời nhắn gửi / Thiệp: ${notes}\n\nXin cảm ơn Atelier!`
    );
    window.location.href = `mailto:${ATELIER_DATA.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#dcd8cf] text-[#141414] rounded-xl shadow-2xl border border-[#141414]/30 overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#141414] text-[#dcd8cf] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-fleur-title uppercase tracking-wide">
                {lang === 'vi' ? 'ĐÃ TIẾP NHẬN YÊU CẦU' : 'REQUEST RECEIVED'}
              </h3>
              <p className="text-sm font-sans text-[#141414]/80 max-w-md mx-auto">
                {lang === 'vi'
                  ? `Cảm ơn bạn ${name || ''}! Nghệ nhân hoa của JU et Saigon tại Lầu 1, 31 Nguyễn Trãi, Q.1 sẽ liên hệ với bạn trong vòng 15-30 phút.`
                  : `Thank you ${name || ''}! JU et Saigon atelier in District 1 will connect with you within 15-30 minutes.`}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleSendZalo}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0068FF] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Mở Chat Zalo (090 936 80 80)' : 'Chat Zalo / WhatsApp'}</span>
              </button>

              <a
                href={`tel:${ATELIER_DATA.phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#141414] text-[#dcd8cf] text-xs font-bold uppercase tracking-wider hover:bg-[#2c2a27] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Gọi Ngay: 090 936 80 80' : 'Call Atelier Directly'}</span>
              </a>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="text-xs font-bold uppercase tracking-widest text-[#141414]/60 hover:text-[#141414] underline underline-offset-4"
              >
                {lang === 'vi' ? 'Quay lại bộ sưu tập hoa' : 'Back to Botanical Gallery'}
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Modal Title */}
            <div className="border-b border-[#141414]/15 pb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#141414]/60 block mb-1">
                ATELIER JU ET SAIGON · QUẬN 1
              </span>
              <h3 className="text-2xl sm:text-3xl font-fleur-title uppercase tracking-wide">
                {lang === 'vi' ? 'ĐẶT LỊCH TƯ VẤN HOA HAUTE COUTURE' : 'BESPOKE FLORAL CONSULTATION'}
              </h3>
              <p className="text-xs font-sans text-[#141414]/70 mt-1">
                {selectedFlower 
                  ? (lang === 'vi' ? `Bạn đang chọn tác phẩm: ${selectedFlower.name} (${selectedFlower.vietnameseName})` : `Selected Specimen: ${selectedFlower.name}`)
                  : (lang === 'vi' ? 'Thiết kế hoa may đo theo phong cách & cảm xúc riêng của bạn.' : 'Tailored bespoke floral creation designed exclusively for your event.')}
              </p>
            </div>

            {/* Selected Flower Capsule Banner */}
            {selectedFlower && (
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-[#141414]/15">
                <img
                  src={selectedFlower.image}
                  alt={selectedFlower.name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase font-serif-editorial truncate text-[#141414]">
                    {selectedFlower.name}
                  </h4>
                  <p className="text-[11px] text-[#141414]/70 truncate">
                    {lang === 'vi' ? selectedFlower.vietnameseName : selectedFlower.latinName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-[#141414]">
                    {selectedFlower.priceVnd.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#141414]/60" />
                  <span>{lang === 'vi' ? 'Họ và Tên' : 'Full Name'} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'Jane Doe'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-[#141414]/60" />
                  <span>{lang === 'vi' ? 'Số Điện Thoại (Zalo)' : 'Phone Number'} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="090 936 80 80"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              {/* Occasion */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider block">
                  {lang === 'vi' ? 'Dịp Sử Dụng / Sự Kiện' : 'Occasion'}
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
                >
                  <option value="bridal">{lang === 'vi' ? 'Hoa Cưới Cô Dâu (Bridal Bouquet)' : 'Bridal Bouquet & Wedding'}</option>
                  <option value="anniversary">{lang === 'vi' ? 'Sinh Nhật & Kỷ Niệm (Anniversary)' : 'Anniversary & Birthday'}</option>
                  <option value="exhibition">{lang === 'vi' ? 'Triển Lãm & Không Gian Nghệ Thuật' : 'Exhibition & Space Decor'}</option>
                  <option value="corporate">{lang === 'vi' ? 'Quà Tặng Doanh Nghiệp / Đối Tác' : 'VIP Corporate Gifting'}</option>
                  <option value="custom">{lang === 'vi' ? 'Thiết Kế Độc Bản Theo Yêu Cầu' : 'Bespoke Custom Theme'}</option>
                </select>
              </div>

              {/* Delivery District */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#141414]/60" />
                  <span>{lang === 'vi' ? 'Khu Vực Nhận Hoa (TP.HCM)' : 'Delivery Area (Saigon)'}</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
                >
                  <option value="Quận 1">Quận 1 (Atelier JU et Saigon)</option>
                  <option value="Quận 2 (Thảo Điền / An Phú)">Quận 2 (Thảo Điền / An Phú)</option>
                  <option value="Quận 3">Quận 3</option>
                  <option value="Quận 7 (Phú Mỹ Hưng)">Quận 7 (Phú Mỹ Hưng)</option>
                  <option value="Bình Thạnh">Quận Bình Thạnh</option>
                  <option value="Phú Nhuận">Quận Phú Nhuận</option>
                  <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                  <option value="Các quận khác">Các quận khác tại TP.HCM</option>
                </select>
              </div>

              {/* Event Date */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#141414]/60" />
                  <span>{lang === 'vi' ? 'Ngày Nhận Hoa Dự Kiến' : 'Preferred Date'}</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
                />
              </div>

              {/* Budget Range */}
              <div className="space-y-1">
                <label className="font-semibold text-[#141414] uppercase tracking-wider block">
                  {lang === 'vi' ? 'Ngân Sách Dự Kiến:' : 'Budget Guide:'}{' '}
                  <span className="font-mono font-bold text-[#141414]">
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
                  className="w-full accent-[#141414]"
                />
                <div className="flex justify-between text-[10px] text-[#141414]/60 font-mono">
                  <span>2.0M</span>
                  <span>7.5M</span>
                  <span>15.0M+</span>
                </div>
              </div>

            </div>

            {/* Custom Notes */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#141414] uppercase tracking-wider block">
                {lang === 'vi' ? 'Ý Tưởng Riêng Hoặc Lời Chúc Kèm Thiệp' : 'Bespoke Concept & Personalized Greeting Note'}
              </label>
              <textarea
                rows={3}
                placeholder={lang === 'vi' ? 'Ví dụ: Tông màu trắng kem sang trọng, đính kèm thiệp chúc mừng sinh nhật, giao lúc 10h sáng...' : 'Specific flowers desired, color palette, card greeting message...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white/80 border border-[#141414]/20 rounded-md focus:outline-none focus:border-[#141414]"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#141414] text-[#dcd8cf] text-xs font-bold tracking-widest uppercase hover:bg-[#2c2a27] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{lang === 'vi' ? 'Xác Nhận Đặt Tư Vấn' : 'Submit Consultation Request'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendZalo}
                  className="px-4 py-2.5 rounded-full bg-[#0068FF] text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Zalo 090 936 80 80
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="px-4 py-2.5 rounded-full border border-[#141414]/30 hover:border-[#141414] text-[#141414] text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  Email Atelier
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
