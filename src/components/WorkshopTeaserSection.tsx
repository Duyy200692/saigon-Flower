import React, { useState } from 'react';
import { WORKSHOPS } from '../data/workshop';
import { useAtelier } from '../context/AtelierContext';
import { ArrowRight, Building2, Users, ShieldCheck } from 'lucide-react';

interface WorkshopTeaserSectionProps {
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
  onOpenWorkshopGallery: () => void;
}

export const WorkshopTeaserSection: React.FC<WorkshopTeaserSectionProps> = ({
  lang,
  theme = 'light',
  onOpenWorkshopGallery
}) => {
  const { workshops } = useAtelier();
  const primaryWorkshop = workshops[0] || WORKSHOPS[0];
  const [isLandscape, setIsLandscape] = useState(false);
  const isDark = theme === 'dark';

  const handleClick = () => {
    onOpenWorkshopGallery();
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsLandscape(naturalWidth > naturalHeight);
  };

  return (
    <section id="workshop" className="max-w-4xl mx-auto px-4 sm:px-6 my-14">
      
      {/* Editorial Top Border Divider */}
      <div
        className={`border-t pt-8 pb-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest transition-colors ${
          isDark
            ? 'border-white/15 text-[#ede9df]/60'
            : 'border-[#141414]/15 text-[#141414]/60'
        }`}
      >
        <span>JU ET SAIGON · BOTANICAL WORKSHOP</span>
        <span className={`text-[10px] font-mono tracking-wider ${isDark ? 'text-[#ede9df]/40' : 'text-[#141414]/40'}`}>
          ATELIER SALON
        </span>
      </div>

      {/* Seamless Editorial Layout directly on Landing Page Canvas */}
      <div
        onClick={handleClick}
        className="group cursor-pointer py-4 transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Typography & Narrative */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="space-y-1.5">
              <span
                className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full inline-block ${
                  isDark
                    ? 'text-amber-300 bg-amber-400/15 border border-amber-400/30'
                    : 'text-amber-800 bg-amber-100/70'
                }`}
              >
                {lang === 'vi' ? 'KHÔNG GIAN NGHỆ THUẬT TẠI VĂN PHÒNG' : 'MINDFUL ARTISTIC WORKSPACE'}
              </span>
              <h3
                className={`text-3xl sm:text-4xl lg:text-5xl font-bagerich font-normal uppercase tracking-tight leading-[0.95] transition-colors ${
                  isDark
                    ? 'text-[#ede9df] group-hover:text-amber-300'
                    : 'text-[#141414] group-hover:text-amber-900'
                }`}
              >
                {lang === 'vi' ? 'WORKSHOP CẮM HOA: THẢNH THƠI CUỐI NĂM' : 'YEAR-END CORPORATE FLORAL WORKSHOP'}
              </h3>
            </div>

            <p
              className={`text-xs sm:text-sm font-sans leading-relaxed font-light ${
                isDark ? 'text-[#ede9df]/80' : 'text-[#141414]/85'
              }`}
            >
              {lang === 'vi'
                ? 'Trải nghiệm gắn kết nhân sự tinh tế, nhẹ nhàng và trọn gói từ ý tưởng đến thực thi ngay tại văn phòng công ty bạn. Tái tạo nguồn năng lượng tươi mới sau một năm bận rộn.'
                : 'An intimate, mindful team bonding experience with end-to-end execution delivered directly to your company headquarters.'}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span
                className={`px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-sm ${
                  isDark
                    ? 'bg-white/10 text-[#ede9df] border-white/15'
                    : 'bg-white/70 text-[#141414] border-[#141414]/15'
                }`}
              >
                <Building2 className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
                <span>{lang === 'vi' ? 'Tận nơi tại Văn Phòng' : 'On-site at Office'}</span>
              </span>
              <span
                className={`px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-sm ${
                  isDark
                    ? 'bg-white/10 text-[#ede9df] border-white/15'
                    : 'bg-white/70 text-[#141414] border-[#141414]/15'
                }`}
              >
                <ShieldCheck className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                <span>{lang === 'vi' ? 'Trọn gói A–Z' : 'Turnkey Setup'}</span>
              </span>
              <span
                className={`px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-sm ${
                  isDark
                    ? 'bg-white/10 text-[#ede9df] border-white/15'
                    : 'bg-white/70 text-[#141414] border-[#141414]/15'
                }`}
              >
                <Users className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-800'}`} />
                <span>10 – 50+ Pax</span>
              </span>
            </div>

            {/* Seamless Interactive Callout */}
            <div className="pt-2">
              <span
                className={`inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider uppercase transition-colors ${
                  isDark
                    ? 'text-[#ede9df] group-hover:text-amber-300'
                    : 'text-[#141414] group-hover:text-amber-900'
                }`}
              >
                <span
                  className={`underline underline-offset-4 ${
                    isDark
                      ? 'decoration-white/40 group-hover:decoration-amber-300'
                      : 'decoration-[#141414]/40 group-hover:decoration-amber-900'
                  }`}
                >
                  {lang === 'vi' ? 'Khám phá bộ sưu tập Workshop' : 'Explore Workshop Gallery'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* Right: Auto-Adaptive Framed Artwork Preview */}
          <div className="md:col-span-5 relative">
            <div
              className={`relative w-full mx-auto md:max-w-none rounded-xl overflow-hidden shadow-2xl border bg-[#1f1e1c] transition-all duration-500 ${
                isDark ? 'border-white/20' : 'border-[#141414]/20'
              } ${
                isLandscape ? 'aspect-[4/3] max-w-[320px]' : 'aspect-[3/4] max-w-[260px]'
              }`}
            >
              <img
                src={primaryWorkshop.image}
                alt={primaryWorkshop.titleVi}
                onLoad={handleImageLoad}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-106 filter grayscale-[5%] group-hover:grayscale-0"
              />

              {/* Hover Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <p className="text-xs font-bagerich uppercase font-bold text-white tracking-widest">
                  3 BỘ WORKSHOP ĐẶC QUYỀN
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Editorial Bottom Border Divider */}
      <div className={`border-b mt-8 ${isDark ? 'border-white/15' : 'border-[#141414]/15'}`}></div>

    </section>
  );
};
