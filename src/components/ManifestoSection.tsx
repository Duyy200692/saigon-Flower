import React, { useState } from 'react';
import { Plus, Minus, MapPin, Clock, Truck, ShieldCheck, Heart } from 'lucide-react';
import { ATELIER_DATA } from '../data/flowers';
import { soundEngine } from '../utils/audio';

interface ManifestoSectionProps {
  lang: 'vi' | 'en';
  onOpenOrder: () => void;
  onOpenAtelier: () => void;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({
  lang,
  onOpenOrder,
  onOpenAtelier
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <section id="philosophy" className="max-w-2xl mx-auto px-6 my-16 text-center">
      {/* Manifesto Prose matching Image 1 layout & cadence */}
      <div className="space-y-6 text-sm sm:text-base md:text-lg font-botanical-prose text-[#141414] leading-relaxed">
        <p className="font-semibold text-xs sm:text-sm tracking-widest font-sans uppercase text-[#141414]/70">
          {lang === 'vi' ? 'SỨ MỆNH NGHỆ THUẬT' : 'THE BOTANICAL ART MANIFESTO'}
        </p>

        <p className="text-base sm:text-xl md:text-2xl font-editorial-serif italic leading-snug">
          "{lang === 'vi' 
            ? 'JU et Saigon là một góc hoa nhỏ mang sứ mệnh trao gởi yêu thương và truyền tải thông điệp đến từ hương thơm và sắc màu.'
            : 'JU et Saigon is a boutique floral atelier carrying a mission of love and soul resonance through pure fragrance and living color.'}"
        </p>

        <p className="text-sm sm:text-base font-sans tracking-wide text-[#141414]/80">
          {lang === 'vi'
            ? 'Cây cỏ và muôn hoa là nền tảng của sự sống trên trái đất, nơi con người và mọi tạo vật nương tựa vào nhau. Hoa - cấu trúc sinh sản kỳ diệu của thực vật - quyến rũ không gian bằng sắc màu rực rỡ, mật ngọt êm dịu và những cánh hoa ngát hương. Chúng chỉ nở rộ trong khoảnh khắc ngắn ngủi, biến mỗi bông hoa thành một tài nguyên vô giá của tự nhiên.'
            : 'Plants are the foundation of all life on earth, upon which humans and every other living creature depends. Habitats thrive with a diversity of plants that form complex communities, who both depend on and compete with one another in a natural symbiosis.'}
        </p>

        <p className="text-sm sm:text-base font-sans tracking-wide text-[#141414]/80">
          {lang === 'vi'
            ? 'Chúng tôi ước mong rằng những tác phẩm hoa độc bản này sẽ truyền cảm hứng để bạn tìm về sự bình yên trong tâm hồn và lắng nghe vẻ đẹp vô tận của thế giới tự nhiên.'
            : 'Flowers, the reproductive structure of many plants, seduce pollinators with their alluring colours, sweet nectar and scented petals. Yet they bloom only briefly, making flowers an expensive resource for a plant to produce.'}
        </p>

        <p className="font-editorial-serif italic text-base sm:text-lg text-[#141414] pt-2">
          {lang === 'vi' 
            ? 'Flower Your Heart, Flower Your Soul.' 
            : 'It is our wish that these flowers inspire us to look for guidance in the infinitely beautiful and intelligent natural world.'}
        </p>
      </div>

      {/* Accordion Trigger matching "Details +" from Image 1 */}
      <div className="mt-10 pt-4 border-t border-b border-[#141414]/20">
        <button
          onClick={() => {
            soundEngine.playFlowerChime(isDetailsOpen ? 432 : 528);
            setIsDetailsOpen(!isDetailsOpen);
          }}
          className="spring-press-subtle w-full py-4 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#141414] hover:opacity-75 transition-opacity"
          aria-expanded={isDetailsOpen}
        >
          <span>{lang === 'vi' ? 'CHI TIẾT VỀ ATELIER & DỊCH VỤ' : 'DETAILS & ATELIER PRACTICES'}</span>
          <span className="p-1.5 rounded-full bg-white/40 border border-[#141414]/15">
            {isDetailsOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* Expandable Frosted Glass Squircle Content Card */}
        {isDetailsOpen && (
          <div className="my-6 p-6 sm:p-8 glass-frost-card squircle-2xl border border-white/70 shadow-soft-2 text-left space-y-6 text-xs sm:text-sm animate-fadeIn">
            {/* Grid of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              <div className="space-y-2 p-4 glass-frost-pill rounded-[22px] border border-white/80 shadow-soft-1">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span>{lang === 'vi' ? 'Địa Chỉ Atelier' : 'Atelier Location'}</span>
                </div>
                <p className="text-[#141414]/80 leading-relaxed font-sans">
                  {lang === 'vi' ? ATELIER_DATA.addressVi : ATELIER_DATA.addressEn}
                </p>
                <button
                  onClick={onOpenAtelier}
                  className="text-xs font-bold underline underline-offset-4 hover:opacity-70 mt-1 inline-block text-amber-900 spring-press-subtle"
                >
                  {lang === 'vi' ? 'Xem chỉ đường & không gian →' : 'View map & space →'}
                </button>
              </div>

              <div className="space-y-2 p-4 glass-frost-pill rounded-[22px] border border-white/80 shadow-soft-1">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>{lang === 'vi' ? 'Giờ Hoạt Động' : 'Operating Hours'}</span>
                </div>
                <p className="text-[#141414]/80 font-sans">
                  {lang === 'vi' ? ATELIER_DATA.hoursVi : ATELIER_DATA.hoursEn}
                </p>
                <p className="text-[11px] text-[#141414]/60 italic font-serif-editorial">
                  {lang === 'vi' ? ATELIER_DATA.consultationNoticeVi : ATELIER_DATA.consultationNoticeEn}
                </p>
              </div>

              <div className="space-y-2 p-4 glass-frost-pill rounded-[22px] border border-white/80 shadow-soft-1">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                  <Truck className="w-4 h-4 text-amber-800" />
                  <span>{lang === 'vi' ? 'Giao Hoa Chuyên Nghiệp' : 'White-Glove Delivery'}</span>
                </div>
                <p className="text-[#141414]/80 font-sans">
                  {lang === 'vi'
                    ? 'Giao hoa bằng xe hơi máy lạnh toàn bộ TP. Hồ Chí Minh (Q.1, Q.2, Q.3, Q.7, Thủ Đức...). Đảm bảo độ tươi và dáng hoa nguyên bản.'
                    : 'Climate-controlled courier delivery across Ho Chi Minh City (D1, D2, D3, D7, Thu Duc). Preserving sculptural integrity and pristine freshness.'}
                </p>
              </div>

              <div className="space-y-2 p-4 glass-frost-pill rounded-[22px] border border-white/80 shadow-soft-1">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#141414]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'vi' ? 'Cam Kết Chất Lượng' : 'Couture Quality Guarantee'}</span>
                </div>
                <p className="text-[#141414]/80 font-sans">
                  {lang === 'vi'
                    ? '100% hoa nhập khẩu chọn lọc loại 1 từ Nhật Bản, Pháp, Hà Lan, Ecuador cùng sen trắng cung đình Việt Nam.'
                    : '100% Grade-A imported floral stems from Japan, France, Netherlands, Ecuador paired with sacred Vietnamese lotus heritage.'}
                </p>
              </div>

            </div>

            {/* Direct CTA */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  soundEngine.playFlowerChime(580);
                  onOpenOrder();
                }}
                className="spring-press px-8 py-3.5 rounded-[24px] bg-[#141414] text-[#dcd8cf] text-xs font-bold tracking-widest uppercase hover:bg-[#2e2d2a] shadow-soft-2 transition-all border border-white/10"
              >
                {lang === 'vi' ? 'Bắt Đầu Tư Vấn Ngay' : 'Start Consultation Inquiry'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
