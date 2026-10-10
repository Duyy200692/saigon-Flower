import { BUNDLED_ASSETS } from '../utils/assetResolver';

export interface WorkshopItem {
  id: string;
  indexNumber: string;
  name: string;
  latinMonographName: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  editorialQuoteVi: string;
  editorialQuoteEn: string;
  descriptionVi: string;
  descriptionEn: string;
  fullContentVi: string[];
  fullContentEn: string[];
  highlightsVi: string[];
  highlightsEn: string[];
  duration: string;
  groupSize: string;
  locationVi: string;
  locationEn: string;
  pricePerPaxVnd: number;
  pricePerPaxUsd: number;
  zaloCommunityUrl: string;
  hotline: string;
  image: string;
  galleryImages: {
    url: string;
    captionVi: string;
    captionEn: string;
  }[];
}

export const WORKSHOPS: WorkshopItem[] = [
  {
    id: "corporate-year-end-workshop",
    indexNumber: "01",
    name: "FLUFFUS FLORALIA",
    latinMonographName: "Workshop Cắm Hoa Cuối Năm",
    titleVi: "WORKSHOP CẮM HOA: THẢNH THƠI CUỐI NĂM TẠI VĂN PHÒNG",
    titleEn: "IN-OFFICE CORPORATE FLORAL SALON & YEAR-END REJUVENATION",
    subtitleVi: "Trải nghiệm mới mẻ · Gắn kết tự nhiên · Thảnh thơi tuyệt đối",
    subtitleEn: "A mindful sensory journey bringing sculptural botanical art directly into your corporate workspace.",
    editorialQuoteVi: "Những tháng cuối năm luôn mang theo nhịp điệu hối hả với các mục tiêu cần hoàn thành. Sự kiện hay team building để gắn kết nhân sự luôn khiến doanh nghiệp trăn trở vì lịch trình bận rộn. Thay vì những chuyến đi xa hay các hình thức quen thuộc, một buổi workshop cắm hoa nghệ thuật sẽ mang lại trải nghiệm tinh tế, nhẹ nhàng và dễ dàng thực hiện ngay tại văn phòng.",
    editorialQuoteEn: "The closing months of the year always bring a fast-paced tempo of deadlines and milestones. Rather than distant retreats, an artisanal in-office floral workshop delivers effortless elegance, natural connection, and complete rejuvenation.",
    descriptionVi: "Mọi khâu từ ý tưởng đến thực thi đều được JU đảm nhận trọn gói, giúp bộ phận nhân sự hoàn toàn thảnh thơi mà không cần bận tâm lo lắng. Một buổi chiều cuối năm thả lòng cùng cỏ hoa sẽ tái tạo nguồn năng lượng tươi mới.",
    descriptionEn: "Every step from concept to execution is fully handled by JU et Saigon, granting HR teams total peace of mind while revitalizing team members.",
    fullContentVi: [
      "Những tháng cuối năm luôn mang theo nhịp điệu hối hả với các mục tiêu cần hoàn thành. Sự kiện hay team building để gắn kết nhân sự luôn khiến doanh nghiệp trăn trở vì lịch trình bận rộn. Thay vì những chuyến đi xa hay các hình thức quen thuộc, một buổi workshop cắm hoa nghệ thuật sẽ mang lại trải nghiệm tinh tế, nhẹ nhàng và dễ dàng thực hiện ngay tại văn phòng.",
      "💖 Mọi khâu từ ý tưởng đến thực thi đều được JU đảm nhận trọn gói, giúp bộ phận nhân sự hoàn toàn thảnh thơi mà không cần bận tâm lo lắng. Một buổi chiều cuối năm thả lòng cùng cỏ hoa sẽ tái tạo nguồn năng lượng tươi mới và mang đến những giá trị thiết thực.",
      "Khép lại một năm bận rộn bằng những khoảnh khắc thư thả và ngập tràn cảm hứng. Nhắn cho JU để cùng thiết kế một hoạt động gắn kết thật riêng biệt dành cho doanh nghiệp bạn nhé!"
    ],
    fullContentEn: [
      "The closing months of the year always bring a fast-paced tempo of deadlines and milestone targets. Organizing meaningful team-building sessions often challenges HR teams due to compressed schedules. Rather than conventional travel, an artisanal floral workshop offers an intimate, mindful experience hosted seamlessly right inside your office.",
      "💖 Every single step — from curated floral selection, tools, styling to on-site facilitation — is fully managed by JU et Saigon. HR and leadership can relax completely with zero logistical stress. An afternoon immersed in blooming stems restores vitality and cultivates authentic interpersonal harmony.",
      "Conclude a bustling year with inspiring, restorative memories. Connect with JU et Saigon to co-create a tailored corporate botanical salon for your team!"
    ],
    highlightsVi: [
      "Trọn gói từ A-Z (hoa tươi nhập khẩu, kéo đồng, bình gốm, tạp dề linen, thiệp viết tay)",
      "Tổ chức linh hoạt ngay tại văn phòng công ty hoặc tại Atelier Lầu 1, 31 Nguyễn Trãi, Q.1",
      "Nghệ nhân hoa JU et Saigon hướng dẫn kỹ thuật tạo hình & cảm thụ thẩm mỹ",
      "Mỗi thành viên mang về thành phẩm hoa nghệ thuật cao cấp do chính tay mình hoàn thiện",
      "Chụp ảnh tư liệu & hỗ trợ thiết kế concept thương hiệu riêng cho doanh nghiệp"
    ],
    highlightsEn: [
      "All-inclusive turnkey setup (premium imported blooms, brass shears, ceramic vessels, linen aprons, greeting cards)",
      "Flexible venue: On-site at your company headquarters or private session at JU Atelier (D1, HCMC)",
      "Step-by-step guidance on structural composition, colour harmony, and olfactory appreciation",
      "Every participant takes home their own luxury floral creation",
      "Professional photographic documentation & custom corporate branding integration"
    ],
    duration: "2.5 – 3.0 Giờ (Hours)",
    groupSize: "10 – 50+ Thành viên (Pax)",
    locationVi: "Trực tiếp tại Văn Phòng Công Ty (Toàn TP.HCM) hoặc Studio Lầu 1 - 31 Nguyễn Trãi, Q.1",
    locationEn: "On-site at Client Office (Across HCMC) or JU et Saigon Atelier (D1)",
    pricePerPaxVnd: 850000,
    pricePerPaxUsd: 35,
    zaloCommunityUrl: "https://zalo.me/g/lbzvqb973",
    hotline: "090 936 80 80",
    image: BUNDLED_ASSETS.workshopOfficeTerracotta,
    galleryImages: [
      {
        url: BUNDLED_ASSETS.workshopOfficeTerracotta,
        captionVi: "Bó hoa tông màu cam đất ấm áp đặc quyền cuối năm",
        captionEn: "Official workshop visual: Warm terracotta & caramel rose bouquet"
      },
      {
        url: BUNDLED_ASSETS.workshopTableFlatlay,
        captionVi: "Bàn chuẩn bị dụng cụ, hoa tươi nhập khẩu & bình gốm nghệ thuật",
        captionEn: "Artisanal workshop workstation setup with shears and ceramic vases"
      },
      {
        url: BUNDLED_ASSETS.workshopTeamBonding,
        captionVi: "Khoảnh khắc nhân sự thả lỏng và gắn kết trong không gian hoa",
        captionEn: "Mindful corporate team bonding moment creating sculptural arrangements"
      },
      {
        url: BUNDLED_ASSETS.workshopMaterialsStems,
        captionVi: "Chủng loại hoa tuyển chọn: Hồng Cappuccino, Mao Lương, Cành khô uốn lượn",
        captionEn: "Curated botanical ingredients: Cappuccino roses, ranunculus, curly branches"
      }
    ]
  },
  {
    id: "turnkey-corporate-experience",
    indexNumber: "02",
    name: "LUNA STIPULA",
    latinMonographName: "Gắn Kết Doanh Nghiệp Trọn Gói",
    titleVi: "TRỌN GÓI Ý TƯỞNG ĐẾN THỰC THI CHO DOANH NGHIỆP",
    titleEn: "END-TO-END CORPORATE EXPERIENCES & SENSORY WELLNESS",
    subtitleVi: "Giải pháp nhân sự không lo lắng · Tinh tế · Tái tạo cảm hứng",
    subtitleEn: "Zero-stress HR event solution fostering emotional well-being and collaboration.",
    editorialQuoteVi: "Mọi khâu từ ý tưởng đến thực thi đều được JU đảm nhận trọn gói, giúp bộ phận nhân sự hoàn toàn thảnh thơi mà không cần bận tâm lo lắng. Từng dụng cụ, cành hoa tuyển chọn đều được chuẩn bị chu đáo tại bàn của mỗi nhân viên.",
    editorialQuoteEn: "Every operational detail from conceptual theme to flawless on-site styling is meticulously orchestrated by JU. We deliver complete floral workstations directly to each employee's desk or conference salon.",
    descriptionVi: "Dịch vụ giải phóng hoàn toàn áp lực tổ chức sự kiện cho ban nhân sự và ban giám đốc. Tạo nên những bức ảnh tư liệu truyền thông nội bộ đẳng cấp và gắn kết chân thành.",
    descriptionEn: "Freeing leadership and HR teams from logistical overhead while crafting high-fashion internal media assets and genuine cross-team synergy.",
    fullContentVi: [
      "Bộ phận nhân sự chỉ cần chọn ngày giờ và địa điểm mong muốn. Đội ngũ nghệ nhân và điều phối viên của JU et Saigon sẽ có mặt trước 60 phút để setup toàn bộ không gian nghệ thuật, trải thảm bảo vệ bàn làm việc và chuẩn bị từng bộ dụng cụ cao cấp.",
      "Mỗi người tham dự được trao tận tay những cành hoa tươi cao cấp nhất, hướng dẫn kỹ thuật cắt cành dưỡng hoa, phối màu theo vòng tròn sắc thái và tạo dáng bình hoa nghệ thuật mang đậm dấu ấn cá nhân."
    ],
    fullContentEn: [
      "Your HR team simply designates the date, time, and room. JU et Saigon's facilitation crew arrives 60 minutes in advance to transform the room with protective linen coverings and individual floral toolkits.",
      "Each participant receives first-grade blooms, expert step-by-step coaching on stem conditioning, chromatic harmony, and contemporary floral sculpting."
    ],
    highlightsVi: [
      "Tối ưu thời gian: Thực hiện nhanh gọn trong 2.5 tiếng ngay tại công ty",
      "Bảo đảm vệ sinh sạch sẽ 100% trước và sau buổi workshop",
      "Tùy biến bảng màu hoa theo nhận diện thương hiệu công ty"
    ],
    highlightsEn: [
      "Time efficient: High-impact 2.5-hour workshop with zero commute",
      "100% spotless setup and clean-up guarantee",
      "Customizable floral palette matching your corporate brand colors"
    ],
    duration: "2.5 Giờ (Hours)",
    groupSize: "15 – 60+ Thành viên (Pax)",
    locationVi: "Tận nơi tại Văn Phòng Doanh Nghiệp (TP.HCM & lân cận)",
    locationEn: "Directly at Corporate Headquarters (HCMC & surrounding areas)",
    pricePerPaxVnd: 850000,
    pricePerPaxUsd: 35,
    zaloCommunityUrl: "https://zalo.me/g/lbzvqb973",
    hotline: "090 936 80 80",
    image: BUNDLED_ASSETS.workshopTableFlatlay,
    galleryImages: [
      {
        url: BUNDLED_ASSETS.workshopTableFlatlay,
        captionVi: "Bàn chuẩn bị dụng cụ, hoa tươi nhập khẩu & bình gốm nghệ thuật",
        captionEn: "Artisanal workshop workstation setup with shears and ceramic vases"
      },
      {
        url: BUNDLED_ASSETS.workshopOfficeTerracotta,
        captionVi: "Bó hoa tông màu cam đất ấm áp đặc quyền cuối năm",
        captionEn: "Official workshop visual: Warm terracotta & caramel rose bouquet"
      },
      {
        url: BUNDLED_ASSETS.workshopMaterialsStems,
        captionVi: "Chủng loại hoa tuyển chọn: Hồng Cappuccino, Mao Lương, Cành khô uốn lượn",
        captionEn: "Curated botanical ingredients: Cappuccino roses, ranunculus, curly branches"
      },
      {
        url: BUNDLED_ASSETS.workshopTeamBonding,
        captionVi: "Khoảnh khắc nhân sự thả lỏng và gắn kết trong không gian hoa",
        captionEn: "Mindful corporate team bonding moment creating sculptural arrangements"
      }
    ]
  },
  {
    id: "atelier-d1-masterclass",
    indexNumber: "03",
    name: "VOMITUS FLOS",
    latinMonographName: "Atelier Masterclass Quận 1",
    titleVi: "ATELIER PRIVATE MASTERCLASS TẠI QUẬN 1",
    titleEn: "INTIMATE BOUTIQUE MASTERCLASS AT DISTRICT 1 ATELIER",
    subtitleVi: "Không gian Pháp cổ · Thưởng trà thảo mộc · Cắm hoa nghệ thuật",
    subtitleEn: "Private boutique sessions nestled in District 1 for connoisseurs and leadership retreats.",
    editorialQuoteVi: "Dành cho các nhóm bạn, cô dâu hoặc ban lãnh đạo muốn tìm về một chốn bình yên thanh nhã giữa trung tâm Sài Gòn. Tận hưởng hương thơm, âm nhạc Solfeggio và tự tay hoàn thiện tác phẩm hoa độc bản.",
    editorialQuoteEn: "Tailored for private groups, bridal showers, or executive retreats seeking a serene oasis in central Saigon. Enjoy organic herbal teas, Solfeggio soundscapes, and hands-on botanical mastery.",
    descriptionVi: "Không gian studio Lầu 1, 31 Nguyễn Trãi với ánh sáng tự nhiên và kiến trúc duy mỹ, tạo nên bối cảnh hoàn hảo cho những buổi sáng tạo riêng tư.",
    descriptionEn: "Our 1st Floor atelier on Nguyen Trai Street bathed in soft natural light offers an inspiring backdrop for private creative masterclasses.",
    fullContentVi: [
      "Khám phá kỹ thuật tạo hình hoa cao cấp từ các loại hoa nhập khẩu như Dạ lan trắng Nhật Bản, Sen cung đình, Hồng baccara và Mao lương Pháp.",
      "Được tặng kèm bộ ảnh kỷ niệm chất lượng cao chụp cùng tác phẩm hoa độc bản do chính bạn hoàn thiện."
    ],
    fullContentEn: [
      "Master advanced techniques working with rare imports including Japanese Hyacinths, French Peonies, and Royal Vietnamese Sacred Lotuses.",
      "Includes a complimentary fine-art portrait photography session with your completed floral arrangement."
    ],
    highlightsVi: [
      "Quy mô thân mật: 4 – 10 học viên / buổi",
      "Thưởng thức trà thảo mộc organic và bánh ngọt thủ công",
      "Tặng kèm bộ ảnh chân dung nghệ thuật chụp tại Studio"
    ],
    highlightsEn: [
      "Intimate scale: 4 – 10 participants per session",
      "Organic artisanal tea and patisserie pairing",
      "Complimentary studio portrait photography package"
    ],
    duration: "2.5 Giờ (Hours)",
    groupSize: "4 – 10 Học viên (Pax)",
    locationVi: "Atelier JU et Saigon: Lầu 1 - 31 Nguyễn Trãi, Phường Bến Thành, Quận 1",
    locationEn: "JU et Saigon Atelier: 1st Floor, 31 Nguyen Trai, Ben Thanh Ward, District 1",
    pricePerPaxVnd: 1200000,
    pricePerPaxUsd: 48,
    zaloCommunityUrl: "https://zalo.me/g/lbzvqb973",
    hotline: "090 936 80 80",
    image: BUNDLED_ASSETS.workshopTeamBonding,
    galleryImages: [
      {
        url: BUNDLED_ASSETS.workshopTeamBonding,
        captionVi: "Khoảnh khắc nhân sự thả lỏng và gắn kết trong không gian hoa",
        captionEn: "Mindful corporate team bonding moment creating sculptural arrangements"
      },
      {
        url: BUNDLED_ASSETS.workshopTableFlatlay,
        captionVi: "Bàn chuẩn bị dụng cụ, hoa tươi nhập khẩu & bình gốm nghệ thuật",
        captionEn: "Artisanal workshop workstation setup with shears and ceramic vases"
      },
      {
        url: BUNDLED_ASSETS.workshopOfficeTerracotta,
        captionVi: "Bó hoa tông màu cam đất ấm áp đặc quyền cuối năm",
        captionEn: "Official workshop visual: Warm terracotta & caramel rose bouquet"
      },
      {
        url: BUNDLED_ASSETS.workshopMaterialsStems,
        captionVi: "Chủng loại hoa tuyển chọn: Hồng Cappuccino, Mao Lương, Cành khô uốn lượn",
        captionEn: "Curated botanical ingredients: Cappuccino roses, ranunculus, curly branches"
      }
    ]
  }
];
