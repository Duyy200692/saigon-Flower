export interface ScentProfile {
  top: string;
  heart: string;
  base: string;
  intensity: number; // 1 to 5
  mood: string;
}

export interface AnatomyPoint {
  id: string;
  x: number; // percentage
  y: number; // percentage
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
}

export interface GalleryImage {
  url: string;
  captionVi: string;
  captionEn: string;
}

export interface FlowerItem {
  id: string;
  indexNumber: string;
  name: string;
  vietnameseName: string;
  latinName: string;
  category: 'bridal' | 'sculptural' | 'rare-stems' | 'seasonal' | 'installation';
  categoryLabelEn: string;
  categoryLabelVi: string;
  shortDescriptionEn: string;
  shortDescriptionVi: string;
  storyEn: string;
  storyVi: string;
  botanicalNotesEn: string;
  botanicalNotesVi: string;
  materials: string[];
  materialsVi: string[];
  scent: ScentProfile;
  anatomy: AnatomyPoint[];
  dimensions: string;
  seasonality: string;
  priceVnd: number;
  priceUsd: number;
  image: string;
  galleryImages: GalleryImage[];
  audioFrequency: number;
  highlight?: boolean;
  pinnedToLanding?: boolean;
  availabilityStatus?: 'ready_today' | 'preorder_24h' | 'seasonal_out';
  prepLeadTimeHours?: number;
}

export const ATELIER_DATA = {
  name: "JU et Saigon",
  tagline: "Flower your heart, Flower your soul",
  subTaglineVi: "Góc hoa nhỏ mang sứ mệnh trao gởi yêu thương và truyền tải thông điệp đến từ hương thơm và sắc màu.",
  subTaglineEn: "A bespoke floral atelier carrying a mission of love and soul resonance through pure fragrance and living color.",
  addressVi: "Lầu 1 - 31 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
  addressEn: "1st Floor, 31 Nguyen Trai Street, Ben Thanh Ward, District 1, Ho Chi Minh City",
  phone: "090 936 80 80",
  phoneFormatted: "0909 368 080",
  email: "juetsaigon@gmail.com",
  instagram: "juetsaigon",
  instagramUrl: "https://instagram.com/juetsaigon",
  facebookName: "JU et Saigon",
  facebookUrl: "https://www.facebook.com/juetsaigon/",
  zaloUrl: "https://zalo.me/g/lbzvqb973",
  tiktokUrl: "https://www.tiktok.com/@juetsaigon",
  website: "juinternational.com",
  websiteUrl: "https://juinternational.com",
  hoursVi: "Thứ Hai – Chủ Nhật: 08:30 – 20:30",
  hoursEn: "Monday – Sunday: 08:30 AM – 08:30 PM",
  consultationNoticeVi: "Vui lòng đặt lịch hẹn trước 24h đối với hoa cưới Haute Couture và thiết kế không gian sự kiện riêng.",
  consultationNoticeEn: "Please book 24 hours in advance for Haute Couture bridal bouquets and bespoke spatial installations.",
};

export const FLOWERS: FlowerItem[] = [
  {
    id: "flower-1791388842716",
    indexNumber: "01",
    name: "THE BRIDAL VOWS",
    vietnameseName: "Lời Thề Của Cô Dâu",
    latinName: "The Bridal Vows",
    category: "bridal",
    categoryLabelEn: "Bridal Haute Couture",
    categoryLabelVi: "Hoa Cưới Độc Bản",
    shortDescriptionEn: "Bespoke floral creation.",
    shortDescriptionVi: "Lưu giữ khoảnh khắc tình yêu lãng mạn nhất trong ngày trọng đại với đóa hoa mẫu đơn trắng tinh khôi đan xen chút lan ngọt ngào.",
    storyEn: "Preserve the most romantic moments of love on your special day with a bouquet of pristine white peonies intertwined with sweet orchids. Like a prayer for a complete, peaceful happiness and a gift of youth dedicated to true love. A beauty of classic charm, elegant and captivating.\nEvery detail is thoughtfully crafted to accompany you into the most beautiful moment of your life, shining and radiant.",
    storyVi: "Lưu giữ khoảnh khắc tình yêu lãng mạn nhất trong ngày trọng đại với đóa hoa mẫu đơn trắng tinh khôi đan xen chút lan ngọt ngào. Tựa như lời cầu mong về một hạnh phúc vẹn tròn, bình yên và cũng là món quà của thanh xuân dành riêng cho tình yêu chân thành. Một vẻ đẹp của cổ điển, vừa thanh tao vừa cuốn hút.\nTừng chi tiết được chăm chút để cùng bạn bước vào khoảnh khắc đẹp nhất cuộc đời một cách tỏa sáng và kiêu kỳ nhất.",
    botanicalNotesEn: "Curated botanical stems and artisanal technique.",
    botanicalNotesVi: "Chủng loại hoa nhập khẩu và kỹ nghệ cắm.",
    materials: ["Imported Stems", "French Silk"],
    materialsVi: ["Hoa Nhập Khẩu", "Lụa Satin Pháp"],
    scent: {
      top: "Hương Hoa Cỏ Tươi Mát",
      heart: "Hương Hoa Nở Rộ Ngọt Ngào",
      base: "Gỗ Tuyết Tùng Trầm Ấm",
      intensity: 3,
      mood: "Thanh Khiết, Sang Trọng"
    },
    anatomy: [],
    dimensions: "30cm x 45cm",
    seasonality: "Quanh năm (Year-Round)",
    priceVnd: 0,
    priceUsd: 0,
    image: "/src/assets/images/juet_bridal_vows_1.jpg",
    galleryImages: [
      { url: "/src/assets/images/juet_bridal_vows_1.jpg", captionVi: "Góc nhìn toàn cảnh", captionEn: "Frontal view" },
      { url: "/src/assets/images/juet_bridal_vows_2.jpg", captionVi: "Góc nghiêng nghệ thuật", captionEn: "Side angle" },
      { url: "/src/assets/images/juet_bridal_vows_3.jpg", captionVi: "Cận cảnh chi tiết cánh hoa", captionEn: "Macro detail" },
      { url: "/src/assets/images/juet_bridal_vows_4.jpg", captionVi: "Chi tiết hoàn thiện", captionEn: "Finishing detail" }
    ],
    audioFrequency: 528,
    pinnedToLanding: true
  },
  {
    id: "hyacinthus-nuptialis",
    indexNumber: "02",
    name: "HYACINTHUS NUPTIALIS",
    vietnameseName: "Hoa Cưới Dạ Lan Trắng & Ngọc Trai",
    latinName: "Hyacinthus orientalis alba x Margaritifera",
    category: "bridal",
    categoryLabelEn: "Bridal Haute Couture",
    categoryLabelVi: "Hoa Cưới Độc Bản",
    shortDescriptionEn: "A once-in-a-lifetime cascade of Japanese pure white hyacinths draped with lustrous freshwater pearls.",
    shortDescriptionVi: "Tuyệt tác hoa cưới biểu tượng khoảnh khắc trọng đại, kết tinh từ dạ lan trắng thuần khiết và chuỗi ngọc trai biển.",
    storyEn: "Crafted for the unforgettable 'Once-in-a-Lifetime Moment', this bespoke bridal cascade celebrates the fragile purity of crisp winter hyacinths. Each delicate floret is hand-wired to an architectural crescent, gracefully entwined with baroque freshwater pearls that catch every gentle movement down the aisle. The fragrance is fresh, honeyed, and evocative of timeless devotion.",
    storyVi: "Được sinh ra dành cho 'Khoảnh Khắc Cả Đời Chỉ Có Một Lần' (A Once-in-a-Lifetime Moment), bó hoa cưới haute couture này là bản giao hưởng giữa hương thơm thanh khiết của hoa dạ lan trắng Nhật Bản và sự mềm mại quý phái của chuỗi ngọc trai nuôi nước ngọt. Từng cánh hoa được nâng niu tỉ mỉ trên cấu trúc bán nguyệt uốn cong ôm trọn bàn tay cô dâu.",
    botanicalNotesEn: "Cold-pressed Japanese white hyacinth blooms, freshwater baroque pearls, double-faced French silk ribbon, structural wireframe.",
    botanicalNotesVi: "Hoa Dạ Lan Hương trắng nhập khẩu Nhật Bản, ngọc trai tự nhiên, dải lụa satin Pháp cao cấp, khung tạo hình thủ công.",
    materials: ["Japanese White Hyacinth", "Baroque Freshwater Pearls", "French Ivory Silk Ribbon", "Asparagus Fern Filaments"],
    materialsVi: ["Dạ Lan Trắng Nhật Bản", "Ngọc Trai Nước Ngọt Baroque", "Lụa Satin Pháp Màu Ngà", "Măng Tây Kim"],
    scent: {
      top: "Crisp Green Spring Dew, Crushed Stems",
      heart: "White Lilac, Sweet Honeyed Hyacinth Florets",
      base: "Sheer Musk, Clean Cedarwood",
      intensity: 4,
      mood: "Ethereal, Romantic & Pure"
    },
    anatomy: [
      {
        id: "p1",
        x: 48,
        y: 35,
        titleEn: "Dense Hyacinth Dome",
        titleVi: "Vòm Dạ Lan Hương Đầy Đặn",
        descriptionEn: "Over 80 individual white star florets hand-positioned to create volumetric cloud texture.",
        descriptionVi: "Hơn 80 bông dạ lan trắng li ti được kết nối thủ công tạo độ phồng bồng bềnh tựa mây."
      },
      {
        id: "p2",
        x: 75,
        y: 45,
        titleEn: "Baroque Pearl Arch",
        titleVi: "Cung Ngọc Trai Tinh Xảo",
        descriptionEn: "Floating perimeter line of hand-strung natural pearls accentuating the crescent silhouette.",
        descriptionVi: "Chuỗi ngọc trai uốn cong tạo điểm nhấn mềm mại chuyển động theo từng bước đi."
      },
      {
        id: "p3",
        x: 52,
        y: 82,
        titleEn: "Pure Silk Bind",
        titleVi: "Dây Buộc Lụa Tơ Tằm",
        descriptionEn: "Extended silk trailing ribbons weighted for serene bridal posture.",
        descriptionVi: "Ruy băng lụa buông dài tạo độ thướt tha và êm ái khi cầm."
      }
    ],
    dimensions: "32cm (W) x 48cm (H)",
    seasonality: "November – April (Bespoke import all year upon 3-day notice)",
    priceVnd: 4500000,
    priceUsd: 180,
    image: "/src/assets/images/juet_hyacinth_bridal_1790840743947.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_hyacinth_bridal_1790840743947.jpg",
        captionVi: "Góc nhìn toàn cảnh bó hoa cưới cầm tay cô dâu",
        captionEn: "Frontal bridal portrait showcasing crescent form"
      },
      {
        url: "/src/assets/images/juet_bridal_macro_pearls_1790844489242.jpg",
        captionVi: "Cận cảnh chi tiết chuỗi ngọc trai biển và từng cánh dạ lan",
        captionEn: "Macro detail of freshwater pearls woven through florets"
      },
      {
        url: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
        captionVi: "Góc nghiêng điêu khắc cùng chất liệu hoa nhập khẩu",
        captionEn: "Sculptural profile angle with porcelain white petals"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Kỹ nghệ thắt dải lụa satin Pháp độc quyền tại Atelier",
        captionEn: "Artisanal silk finishing and architectural stem foundation"
      }
    ],
    audioFrequency: 528,
    highlight: true
  },
  {
    id: "peonia-blush-royale",
    indexNumber: "02",
    name: "PEONIA BLUSH ROYALE",
    vietnameseName: "Hộp Hoa Mẫu Đơn Pháp & Mao Lương Hồng",
    latinName: "Paeonia suffruticosa x Ranunculus asiaticus",
    category: "seasonal",
    categoryLabelEn: "Seasonal Haute Floristry",
    categoryLabelVi: "Hoa Thiết Kế Mùa",
    shortDescriptionEn: "Layered French garden peonies paired with delicate blush ranunculus buds nestled in a bespoke cylinder.",
    shortDescriptionVi: "Sự kết hợp quyến rũ giữa những bông mẫu đơn Pháp bung nở dày cánh và nụ hoa mao lương hồng phấn dịu dàng.",
    storyEn: "A lavish celebration of softness and feminine grace. French Sarah Bernhardt peonies unfold into hundred-petal rosettes, enveloped by spiraling ranunculus and subtle blush tones. Encased in JU et Saigon's signature cylindrical hatbox, it breathes the romance of Parisian afternoon salons into the vibrant energy of Saigon.",
    storyVi: "Mẫu hoa biểu tượng cho sự thịnh vượng, dịu dàng và tình yêu son sắt. Những đóa Mẫu Đơn Sarah Bernhardt nhập khẩu từ Pháp với hàng trăm lớp cánh mỏng manh xếp tầng, điểm xuyết cùng mao lương hồng pastel trong hộp tròn đặc trưng của JU et Saigon.",
    botanicalNotesEn: "Double-flowered French garden peonies, tiered blush ranunculus, eucalyptus parvifolia, sweet pea whispers.",
    botanicalNotesVi: "Mẫu Đơn Pháp Sarah Bernhardt, Mao Lương hồng phấn, Lá khuynh diệp nhỏ, Đậu hoa thơm.",
    materials: ["French Garden Peonies", "Blush Ranunculus", "Baby Eucalyptus", "Custom Pink Velvet Cylinder"],
    materialsVi: ["Mẫu Đơn Pháp", "Mao Lương Hồng Phấn", "Lá Bạc Mini", "Hộp Trụ Nhung Độc Quyền JU"],
    scent: {
      top: "Dewy Peaches, Pink Grapefruit Zest",
      heart: "French Peony Blossom, Damask Rosewater",
      base: "White Amber, Cashmeran",
      intensity: 4,
      mood: "Velvety, Sensual & Aristocratic"
    },
    anatomy: [
      {
        id: "p1",
        x: 45,
        y: 40,
        titleEn: "Multi-layered Peony Core",
        titleVi: "Tâm Cánh Mẫu Đơn Xếp Lớp",
        descriptionEn: "Soft crimped petals that gently open over 5 days, intensifying in scent.",
        descriptionVi: "Cánh hoa dập dềnh tỏa hương thơm đậm đà dần trong suốt 5-7 ngày."
      },
      {
        id: "p2",
        x: 30,
        y: 65,
        titleEn: "Spiral Ranunculus",
        titleVi: "Nụ Mao Lương Xoắn",
        descriptionEn: "Architectural geometric swirls that balance the wild peony fullness.",
        descriptionVi: "Vòng xoắn hình học tự nhiên tạo độ tương phản tinh tế với hoa mẫu đơn."
      }
    ],
    dimensions: "35cm (Diameter) x 45cm (H)",
    seasonality: "Year-Round Specialty",
    priceVnd: 3800000,
    priceUsd: 152,
    image: "/src/assets/images/juet_blush_peony_1790840758164.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_blush_peony_1790840758164.jpg",
        captionVi: "Góc chụp chính diện hộp hoa trụ nhung sang trọng",
        captionEn: "Frontal perspective of blush peony cylinder arrangement"
      },
      {
        url: "/src/assets/images/juet_peony_side_angle_1790844501746.jpg",
        captionVi: "Góc nghiêng nghệ thuật trong không gian nội thất tối giản",
        captionEn: "Side angle view styled on modern travertine console table"
      },
      {
        url: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
        captionVi: "Chi tiết xếp lớp các tầng cánh hoa mẫu đơn tự nhiên",
        captionEn: "Concentric floral layering under soft studio lighting"
      },
      {
        url: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
        captionVi: "Cận cảnh nụ hoa mao lương đan xen sắc tố hồng dịu",
        captionEn: "Blush ranunculus spiraling buds and velvety texture"
      }
    ],
    audioFrequency: 432,
    highlight: true
  },
  {
    id: "lotus-sacra-saigon",
    indexNumber: "03",
    name: "LOTUS SACRA SAIGON",
    vietnameseName: "Hoa Sen Trắng Cung Đình & Đài Sen Điêu Khắc",
    latinName: "Nelumbo nucifera albicans",
    category: "sculptural",
    categoryLabelEn: "Artistic Installations",
    categoryLabelVi: "Nghệ Thuật Điêu Khắc",
    shortDescriptionEn: "A serene avant-garde white lotus in full bloom, honoring the spiritual stillness of Vietnamese botanical heritage.",
    shortDescriptionVi: "Đóa sen trắng thanh tao bung nở trọn vẹn, tôn vinh nét thiền tịnh và vẻ đẹp thanh cao của di sản hoa Việt Nam.",
    storyEn: "A tribute to the deep botanical soul of Vietnam. The Sacred White Lotus rises from dark waters with spotless ivory petals and a central golden seedpod. In our Saigon atelier, we fold and sculpt each petal with meditation-like precision, creating a focal centerpiece that transforms any modern living space into a sanctuary of tranquility.",
    storyVi: "Tôn vinh cốt cách tao nhã của loài hoa biểu tượng Việt Nam. Sen trắng Tây Hồ được tuyển chọn từng búp đều đặn, nghệ nhân JU et Saigon gấp cánh thủ công theo dáng hoa ngọc, kết hợp đài sen non màu ngọc bích và lá sen tơ tạo nên một tác phẩm nghệ thuật thiền định độc đáo.",
    botanicalNotesEn: "Royal white sacred lotus, jade green seed pod, raw lotus stem fibers, Vietnamese riverstone base.",
    botanicalNotesVi: "Sen trắng cung đình, đài sen xanh non, sợi tơ ngó sen, đế đá sông tự nhiên.",
    materials: ["Sacred White Lotus", "Emerald Lotus Pod", "Unfurling Leaf Fronds", "Minimalist Ceramic Vessel"],
    materialsVi: ["Sen Trắng Cung Đình", "Gương Sen Xanh", "Lá Sen Non", "Bình Gốm Tối Giản"],
    scent: {
      top: "Cool River Water, Morning Dew",
      heart: "Lotus Pollen, Green Tea Blossoms",
      base: "Wet Earth, Bamboo Stems",
      intensity: 2,
      mood: "Meditative, Sacred & Calming"
    },
    anatomy: [
      {
        id: "p1",
        x: 50,
        y: 30,
        titleEn: "Sculpted Petal Fold",
        titleVi: "Kỹ Thuật Gấp Cánh Sen Thủ Công",
        descriptionEn: "Each ivory petal is individually shaped to hold its bloom open without wilting.",
        descriptionVi: "Từng cánh sen được xếp nếp tỉ mỉ giữ form hoa đứng vững và bung tỏa trọn vẹn."
      },
      {
        id: "p2",
        x: 55,
        y: 75,
        titleEn: "Jade Seed Receptacle",
        titleVi: "Gương Sen Xanh Ngọc",
        descriptionEn: "A geometric center containing sweet natural lotus seeds.",
        descriptionVi: "Nhụy sen và hạt sen non mang sắc xanh dịu mắt, tỏa hương phấn hoa thanh mát."
      }
    ],
    dimensions: "30cm (W) x 55cm (H)",
    seasonality: "Peak June – September (Atelier reserve available year-round)",
    priceVnd: 2800000,
    priceUsd: 112,
    image: "/src/assets/images/juet_sacred_lotus_1790840770921.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_sacred_lotus_1790840770921.jpg",
        captionVi: "Đóa sen trắng cung đình bung nở dáng thiền tịnh",
        captionEn: "Full frontal portrait of sacred white lotus in full bloom"
      },
      {
        url: "/src/assets/images/juet_lotus_minimal_table_1790844513685.jpg",
        captionVi: "Bình sen đặt trên bàn đá tối giản phong cách đương đại",
        captionEn: "Minimalist ceramic vase styling in contemporary zen space"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Chi tiết đài sen non ngọc bích và nhụy phấn hoa thơm",
        captionEn: "Jade green seed receptacle and fine botanical filaments"
      },
      {
        url: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
        captionVi: "Kỹ thuật gấp cánh hoa sen ngọc thủ công tại Atelier",
        captionEn: "Handcrafted petal folding technique ensuring sculptural longevity"
      }
    ],
    audioFrequency: 639,
    highlight: true
  },
  {
    id: "orchidia-vampirea",
    indexNumber: "04",
    name: "ORCHIDIA VAMPIREA",
    vietnameseName: "Lan Vanda Dạ Lam & Cành Xoắn Nghệ Thuật",
    latinName: "Vanda coerulea nocturna",
    category: "rare-stems",
    categoryLabelEn: "Monochromatic Rare Stems",
    categoryLabelVi: "Cành Hoa Độc Bản Hiếm",
    shortDescriptionEn: "Surreal indigo and obsidian orchids with sweeping architectural contours and glowing stamen.",
    shortDescriptionVi: "Lan Vanda sắc xanh chàm huyền bí kết hợp cành khô uốn lượn phong cách Ondrej Zunka đương đại.",
    storyEn: "Inspired by the enigmatic depths of tropical dusk. Orchidia Vampirea features ultra-rare deep cobalt Vanda orchids grafted onto sinuous carbon-black stems. A masterpiece that blurs the boundary between digital surrealism and living botanical couture.",
    storyVi: "Lấy cảm hứng từ chiều hoàng hôn nhiệt đới Sài Gòn đầy quyến rũ. Tác phẩm sử dụng Lan Vanda màu chàm sẫm quý hiếm kết hợp cùng thân gỗ uốn lượn sắc sảo, gợi mở vẻ đẹp siêu thực giữa nghệ thuật tạo hình 3D và hoa tươi sống động.",
    botanicalNotesEn: "Air-rooted blue Vanda orchids, sculpted dark branches, golden anther filaments.",
    botanicalNotesVi: "Lan Vanda xanh chàm nhập khẩu Hà Lan, thân cành điêu khắc sấy mộc, nhị vàng óng.",
    materials: ["Midnight Blue Vanda Orchids", "Architectural Twisted Wood", "Black Anthurium", "Golden Dust Leaf Accents"],
    materialsVi: ["Lan Vanda Xanh Đêm", "Gỗ Uốn Kiến Trúc", "Hồng Môn Đen Obsidian", "Lá Mạ Vàng Nhẹ"],
    scent: {
      top: "Bitter Almond, Night Jasmine",
      heart: "Smoky Vanilla, Midnight Orchid",
      base: "Incense Bark, Patchouli",
      intensity: 3,
      mood: "Mysterious, Hypnotic & Dramatic"
    },
    anatomy: [
      {
        id: "p1",
        x: 46,
        y: 38,
        titleEn: "Cobalt Petal Membrane",
        titleVi: "Cánh Hoa Màu Chàm Đậm",
        descriptionEn: "Translucent cell structure with geometric venation that shifts under studio light.",
        descriptionVi: "Gân hoa lan nổi rõ với sắc tố chàm chuyển màu huyền ảo dưới ánh sáng."
      }
    ],
    dimensions: "28cm (W) x 60cm (H)",
    seasonality: "Limited Edition / Atelier Exclusive",
    priceVnd: 5200000,
    priceUsd: 210,
    image: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
        captionVi: "Góc nhìn điêu khắc thân cây uốn lượn phong cách Ondrej Zunka",
        captionEn: "Sculptural twisted branch framework and cobalt blooms"
      },
      {
        url: "/src/assets/images/juet_orchid_macro_stamen_1790844525372.jpg",
        captionVi: "Cận cảnh gân hoa lan Vanda phát quang và nhị vàng óng",
        captionEn: "Macro close-up of luminous blue petal venation and golden stamen"
      },
      {
        url: "/src/assets/images/juet_blue_iris_1790840866986.jpg",
        captionVi: "Sự kết hợp sắc lam hoàng gia và bóng tối huyền ảo",
        captionEn: "Royal midnight indigo chromatic depth under studio key light"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Cấu trúc chân đế gỗ mun nguyên khối vững chãi",
        captionEn: "Solid blackened architectural wood base craftsmanship"
      }
    ],
    audioFrequency: 741,
    highlight: true
  },
  {
    id: "transvaal-rubrum",
    indexNumber: "05",
    name: "TRANSVAAL RUBRUM",
    vietnameseName: "Hồng Môn & Anh Túc Đỏ Xoắn",
    latinName: "Papaver somniferum rubrum spiralis",
    category: "sculptural",
    categoryLabelEn: "Artistic Installations",
    categoryLabelVi: "Nghệ Thuật Điêu Khắc",
    shortDescriptionEn: "A vibrant scarlet poppy with an orbital spiral stem tracking the sun's trajectory across the sky.",
    shortDescriptionVi: "Bông anh túc đỏ thắm kiêu hãnh với thân xoắn ốc vươn mình theo hành trình của ánh mặt trời.",
    storyEn: "The twisted stem of the Transvaal Rubrum is a structural alteration stimulated by heliotropism. As the flower cranes toward the sunlight, the stem freezes in an exquisite corkscrew curve, a visual history of living movement and organic determination.",
    storyVi: "Thân cây uốn lượn của Transvaal Rubrum là biểu tượng của sự hướng quang mãnh liệt. Mỗi nhịp uốn là một dấu vết của quá trình tìm kiếm ánh sáng, tạo nên dáng vẻ điêu khắc sống động đầy nội lực.",
    botanicalNotesEn: "Velvet scarlet poppy petals, curled latex stem, black central disc.",
    botanicalNotesVi: "Cánh hoa anh túc nhung đỏ thẫm, thân xoắn tự nhiên, nhụy đen nổi bật.",
    materials: ["Crimson Poppy", "Red Gloriosa Lily", "Twisted Vine Stalks", "Obsidian Basalt Base"],
    materialsVi: ["Hoa Anh Túc Đỏ", "Hoa Ngót Ngoẻo Đỏ Lửa", "Dây Leo Xoắn Tự Nhiên", "Đế Đá Bazan Đen"],
    scent: {
      top: "Spicy Pink Pepper, Crushed Green Bark",
      heart: "Smoldering Poppy, Clove Bud",
      base: "Warm Benzoin Resin",
      intensity: 3,
      mood: "Fiery, Bold & Unapologetic"
    },
    anatomy: [
      {
        id: "p1",
        x: 48,
        y: 25,
        titleEn: "Fluted Velvet Crown",
        titleVi: "Vương Miện Cánh Nhung Đỏ",
        descriptionEn: "Feather-light crinkled petals reflecting deep ruby light.",
        descriptionVi: "Cánh hoa mỏng như lụa nhung phản chiếu sắc đỏ ruby quý phái."
      },
      {
        id: "p2",
        x: 52,
        y: 65,
        titleEn: "Corkscrew Stem",
        titleVi: "Thân Uốn Xoắn Heliotropic",
        descriptionEn: "A hardened green spiral supporting the flower's dramatic cantilever.",
        descriptionVi: "Đường cong tự nhiên nâng đỡ đài hoa tạo tư thế bay bổng."
      }
    ],
    dimensions: "26cm (W) x 58cm (H)",
    seasonality: "Spring / Autumn Special Import",
    priceVnd: 3400000,
    priceUsd: 136,
    image: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
        captionVi: "Góc chụp chính diện đóa anh túc đỏ và thân xoắn",
        captionEn: "Frontal botanical portrait of heliotropic scarlet bloom"
      },
      {
        url: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
        captionVi: "Cận cảnh chất nhung cánh hoa và nhụy đen nổi bật",
        captionEn: "Macro detail of velvet crinkled petal texture and dark core"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Đường cong cành xoắn định hình không gian nghệ thuật",
        captionEn: "Sinuous stem curvature creating dynamic negative space"
      },
      {
        url: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
        captionVi: "Bố cục nghệ thuật trong bóng tối chiaroscuro",
        captionEn: "Moody chiaroscuro fine art lighting installation"
      }
    ],
    audioFrequency: 396,
    highlight: true
  },
  {
    id: "iris-celeste-nocturne",
    indexNumber: "06",
    name: "IRIS CELESTE NOCTURNE",
    vietnameseName: "Diên Vĩ Hoàng Gia Sắc Xanh Đêm",
    latinName: "Iris germanica caerulea",
    category: "rare-stems",
    categoryLabelEn: "Monochromatic Rare Stems",
    categoryLabelVi: "Cành Hoa Độc Bản Hiếm",
    shortDescriptionEn: "A majestic royal blue iris with curving tendrils that capture the quiet mystery of Saigon midnight.",
    shortDescriptionVi: "Hoa diên vĩ sắc xanh hoàng gia vương giả, đại diện cho niềm hy vọng, trí tuệ và sự trung thành.",
    storyEn: "With ruffled midnight-blue petals resembling velvet banners, the Iris Celeste is celebrated for its stately grace. In our atelier, we highlight its dramatic silhouette against negative space, creating an arresting visual haiku.",
    storyVi: "Những cánh hoa màu lam sẫm viền vàng nhạt mở ra tựa cánh bướm đêm. Diên vĩ là biểu tượng của quý tộc và sự thanh lịch bất diệt, mang lại sự sang trọng sâu lắng cho không gian phòng khách hoặc bàn tiệc trang trọng.",
    botanicalNotesEn: "Royal blue German iris, curly willow shoots, dried lichen branches.",
    botanicalNotesVi: "Hoa Diên Vĩ xanh coban, cành liễu xoắn, rêu sấy bảo tồn.",
    materials: ["Blue Dutch Iris", "Curly Willow", "Blue Eryngium Thistle", "Minimalist Slate Stand"],
    materialsVi: ["Diên Vĩ Xanh Hà Lan", "Cành Liễu Xoắn", "Cỏ Nhím Biển Eryngium", "Chân Đá Phiến"],
    scent: {
      top: "Ozone, Bergamot Mist",
      heart: "Iris Root (Orris), Violet Leaf",
      base: "Powdery Suede, Oakmoss",
      intensity: 3,
      mood: "Intellectual, Stately & Poetic"
    },
    anatomy: [
      {
        id: "p1",
        x: 50,
        y: 40,
        titleEn: "Velvet Falls Petals",
        titleVi: "Cánh Hoa Thác Đổ",
        descriptionEn: "Downward draping petals with golden tactile beard sensors.",
        descriptionVi: "Cánh hoa rủ mềm như dải lụa nhung điểm nhụy lông vàng óng."
      }
    ],
    dimensions: "25cm (W) x 52cm (H)",
    seasonality: "Winter – Early Spring",
    priceVnd: 2900000,
    priceUsd: 116,
    image: "/src/assets/images/juet_blue_iris_1790840866986.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_blue_iris_1790840866986.jpg",
        captionVi: "Góc chụp chính diện hoa diên vĩ xanh đêm hoàng gia",
        captionEn: "Frontal portrait of royal blue iris with curving tendrils"
      },
      {
        url: "/src/assets/images/juet_orchid_macro_stamen_1790844525372.jpg",
        captionVi: "Cận cảnh chi tiết nhung lụa và nhụy hoa vàng rực rỡ",
        captionEn: "Macro detail of golden beard filaments on velvet falls"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Dáng đứng thanh thoát trong không gian studio",
        captionEn: "Stately silhouette in curated gallery space"
      },
      {
        url: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
        captionVi: "Nghệ thuật phối màu đơn sắc xanh đêm và tro xám",
        captionEn: "Monochromatic cobalt and charcoal shadow composition"
      }
    ],
    audioFrequency: 852
  },
  {
    id: "solaris-chrysanthemum",
    indexNumber: "07",
    name: "SOLARIS CHRYSANTHEMUM",
    vietnameseName: "Cúc Mẫu Đơn Hoàng Kim",
    latinName: "Chrysanthemum morifolium aurea",
    category: "seasonal",
    categoryLabelEn: "Seasonal Haute Floristry",
    categoryLabelVi: "Hoa Thiết Kế Mùa",
    shortDescriptionEn: "A radiantly dense golden chrysanthemum radiating warmth and solar abundance.",
    shortDescriptionVi: "Bông cúc mẫu đơn hoàng kim bung tỏa năng lượng ấm áp, rạng rỡ tựa vầng thái dương.",
    storyEn: "A sphere of glowing amber needles that captures the warm sunlight of Southern Vietnam. Long revered as a symbol of longevity and noble friendship, our master florists arrange it to cast dramatic radial shadows in any curated interior.",
    storyVi: "Hàng ngàn sợi cánh hoa vàng óng ả xếp lớp hoàn hảo tạo nên khối cầu ánh sáng lộng lẫy. Món quà hoàn hảo để trao gởi lời chúc vạn sự hưng vượng, sức khỏe và tình thâm sâu sắc.",
    botanicalNotesEn: "Japanese golden spider chrysanthemum, dried wheat stalks, smoked glass.",
    botanicalNotesVi: "Cúc mẫu đơn vàng hoàng kim nhập khẩu, lúa mạch vàng, bình thủy tinh khói.",
    materials: ["Golden Spider Mum", "Yellow Craspedia Balls", "Eucalyptus Pods"],
    materialsVi: ["Cúc Mẫu Đơn Vàng", "Hoa Đom Đóm Craspedia", "Trái Khuynh Diệp"],
    scent: {
      top: "Sweet Wild Honey, Lemon Thyme",
      heart: "Spiced Tea Leaves, Chrysanthemum Herb",
      base: "Sunbaked Wood, Amber Resin",
      intensity: 3,
      mood: "Warm, Uplifting & Prosperous"
    },
    anatomy: [
      {
        id: "p1",
        x: 50,
        y: 35,
        titleEn: "Radial Petal Matrix",
        titleVi: "Ma Trận Cánh Tỏa Tròn",
        descriptionEn: "Concentric rings of quill-shaped petals designed for maximum light capture.",
        descriptionVi: "Hàng trăm cánh hoa nhọn hình kim tỏa đều bắt trọn mọi góc sáng."
      }
    ],
    dimensions: "32cm (W) x 45cm (H)",
    seasonality: "Autumn – Tet Festival Special",
    priceVnd: 2600000,
    priceUsd: 104,
    image: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
        captionVi: "Góc chụp chính diện quả cầu hoa cúc mẫu đơn hoàng kim",
        captionEn: "Frontal view of spherical golden spider mum"
      },
      {
        url: "/src/assets/images/juet_peony_side_angle_1790844501746.jpg",
        captionVi: "Ánh sáng tự nhiên làm nổi bật các sợi cánh vàng óng",
        captionEn: "Warm ambient daylight catching golden amber petals"
      },
      {
        url: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
        captionVi: "Cận cảnh tâm nhụy và các vòng cánh hoa đồng tâm",
        captionEn: "Macro detail of concentric quill petal matrix"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Bình hoa cúc mẫu đơn đặt trong phòng khách sang trọng",
        captionEn: "Luxury interior centerpiece presentation"
      }
    ],
    audioFrequency: 528
  },
  {
    id: "anemone-porcelain",
    indexNumber: "08",
    name: "ANEMONE PORCELAIN",
    vietnameseName: "Hoa Phong Quỳ Trắng Tâm Đen Điêu Khắc",
    latinName: "Anemone coronaria alba",
    category: "sculptural",
    categoryLabelEn: "Artistic Installations",
    categoryLabelVi: "Nghệ Thuật Điêu Khắc",
    shortDescriptionEn: "Pure porcelain white petals with a high-contrast obsidian center on a sinuous sculptural pedestal.",
    shortDescriptionVi: "Vẻ đẹp tương phản đỉnh cao giữa cánh hoa trắng mịn như sứ và nhụy đen nhung huyền bí.",
    storyEn: "A minimalist study in stark contrast. The paper-thin ivory petals surround a dense, velvet-black central button. Framed with curved stems that emulate modern bronze sculpture, it is the connoisseur's choice for modern architectural homes.",
    storyVi: "Bản tuyên ngôn nghệ thuật của sự tối giản sang trọng. Từng cánh hoa mỏng manh như cánh bướm tương phản mạnh mẽ cùng tâm nhụy đen tuyền, mang đến xúc cảm thị giác đầy mê hoặc.",
    botanicalNotesEn: "Italian white anemone, blackened ironwood base, white calla accents.",
    botanicalNotesVi: "Hoa phong quỳ trắng Ý, chân gỗ lũa đen, điểm xuyết hoa rum.",
    materials: ["Italian White Anemone", "Black Scabiosa", "Monstera Skeleton Leaves"],
    materialsVi: ["Phong Quỳ Ý Trắng", "Hoa Scabiosa Đen", "Lá Xương Trầu Bà"],
    scent: {
      top: "Crisp Green Apple, Morning Grass",
      heart: "Delicate White Peppery Blossom",
      base: "Clean Linen, White Cedar",
      intensity: 2,
      mood: "Graphic, Minimalist & Pure"
    },
    anatomy: [
      {
        id: "p1",
        x: 48,
        y: 40,
        titleEn: "Obsidian Anther Disc",
        titleVi: "Đĩa Nhụy Đen Nhung",
        descriptionEn: "Hyper-pigmented dark center releasing micro-pollen.",
        descriptionVi: "Tâm nhụy sẫm màu tạo điểm nhấn thị giác sâu hút đầy cuốn hút."
      }
    ],
    dimensions: "28cm (W) x 48cm (H)",
    seasonality: "Winter – Early Spring",
    priceVnd: 3200000,
    priceUsd: 128,
    image: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
        captionVi: "Góc chụp chính diện hoa phong quỳ trắng tâm đen",
        captionEn: "Frontal portrait of high-contrast white anemone"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Cận cảnh độ mỏng như lụa của cánh hoa sứ",
        captionEn: "Macro detail of paper-thin porcelain petal texture"
      },
      {
        url: "/src/assets/images/juet_bridal_macro_pearls_1790844489242.jpg",
        captionVi: "Chi tiết đĩa nhụy đen obsidian tương phản",
        captionEn: "Obsidian velvet center disc close-up"
      },
      {
        url: "/src/assets/images/juet_lotus_minimal_table_1790844513685.jpg",
        captionVi: "Thân cây uốn lượn phong cách điêu khắc Art Gallery",
        captionEn: "Sculptural twisted branch framing and silhouette"
      }
    ],
    audioFrequency: 963
  },
  {
    id: "luna-calla-stipula",
    indexNumber: "09",
    name: "LUNA CALLA STIPULA",
    vietnameseName: "Hoa Rum Trắng Uốn Khung Điêu Khắc",
    latinName: "Zantedeschia aethiopica luna",
    category: "sculptural",
    categoryLabelEn: "Artistic Installations",
    categoryLabelVi: "Nghệ Thuật Điêu Khắc",
    shortDescriptionEn: "A sinuous cream calla lily cradled within an avant-garde geometric stalk structure.",
    shortDescriptionVi: "Đóa hoa rum trắng muốt với đường cong mỹ miều lồng ghép trong khung cành điêu khắc hình học.",
    storyEn: "The stalks of Luna Calla branch and merge as it grows to form an architectural web-like structure. These strange curved silhouettes keep the flower poised like a modern sculpture, blooming into radiant moonlit beauty.",
    storyVi: "Đường nét uốn lượn mềm mại của hoa rum trắng (Calla Lily) kết hợp cùng kỹ thuật định hình không gian của JU et Saigon. Một tác phẩm đại diện cho gu thẩm mỹ đỉnh cao của những gia chủ yêu phong cách Art Gallery.",
    botanicalNotesEn: "Dutch giant calla lily, molded bronze wire mesh, polished stone pedestal.",
    botanicalNotesVi: "Hoa Rum trắng Hà Lan, khung kim loại uốn thủ công, đế đá mài cao cấp.",
    materials: ["White Calla Lily", "Sculptural Wire Frame", "Green Aspidistra Ribbon"],
    materialsVi: ["Hoa Rum Trắng", "Khung Điêu Khắc Độc Quyền", "Lá Thiết Mộc Lan Uốn"],
    scent: {
      top: "Green Fig, Cool Air",
      heart: "Alabaster Spathe, Creamy Floral",
      base: "Blonde Woods",
      intensity: 2,
      mood: "Architectural, Zen & Noble"
    },
    anatomy: [
      {
        id: "p1",
        x: 52,
        y: 35,
        titleEn: "Curled Spathe Funnel",
        titleVi: "Phễu Cánh Hoa Rum Uốn Lượn",
        descriptionEn: "Thick leathery ivory petal wrapping around a golden spadix.",
        descriptionVi: "Mo hoa dày dặn màu kem sữa ôm lấy trụ phấn vàng thanh tú."
      }
    ],
    dimensions: "30cm (W) x 65cm (H)",
    seasonality: "Year-Round",
    priceVnd: 3600000,
    priceUsd: 144,
    image: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Góc chụp chính diện hoa rum trắng và khung cành hình học",
        captionEn: "Frontal view of sculptural calla lily in geometric frame"
      },
      {
        url: "/src/assets/images/juet_lotus_minimal_table_1790844513685.jpg",
        captionVi: "Đường cong phễu hoa màu kem sữa mềm mại",
        captionEn: "Fluid curvature of ivory spathe funnel"
      },
      {
        url: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
        captionVi: "Cận cảnh trụ phấn vàng thanh tú bên trong",
        captionEn: "Macro detail of central golden spadix"
      },
      {
        url: "/src/assets/images/juet_bridal_macro_pearls_1790844489242.jpg",
        captionVi: "Khung kim loại điêu khắc uốn tay tinh xảo",
        captionEn: "Handcrafted architectural wire mesh structure"
      }
    ],
    audioFrequency: 432
  },
  {
    id: "odorata-cinere",
    indexNumber: "10",
    name: "ODORATA CINERE",
    vietnameseName: "Dạ Lan Xám Huyền Bí & Tinh Dầu Quý",
    latinName: "Odorata cinere spectabilis",
    category: "rare-stems",
    categoryLabelEn: "Monochromatic Rare Stems",
    categoryLabelVi: "Cành Hoa Độc Bản Hiếm",
    shortDescriptionEn: "A rare ash-toned botanical marvel with an exceptionally intoxicating honey fragrance.",
    shortDescriptionVi: "Giống hoa mang sắc xám khói độc đáo cùng hương thơm mật ngọt say đắm lòng người.",
    storyEn: "To make up for its colourless, scraggy-looking petals, the Odorata Cinere emits an aroma so delicious that it is described as one of the most enticing scents in the botanical world. The fragrant oils secrete profusely from floral tissue, coating nearby buds in sweet nectar.",
    storyVi: "Khoác lên mình sắc xám tro cổ kính, Odorata Cinere bù đắp bằng tầng hương mật ong và gỗ trầm cực kỳ quyến rũ. Một loài hoa dành riêng cho những buổi tối tiệc ấm cúng cần điểm nhấn hương thơm khó quên.",
    botanicalNotesEn: "Smoked silver-grey petals, amber resin secretions, dark moss coating.",
    botanicalNotesVi: "Cánh hoa xám tro, nhựa thơm ngát, lớp rêu sấy bảo tồn.",
    materials: ["Smoked Ranunculus", "Silver Brunia Berries", "Dusty Miller Foliage"],
    materialsVi: ["Mao Lương Xám Khói", "Trái Brunia Bạc", "Lá Cúc Mốc Bạc"],
    scent: {
      top: "Incense Smoke, Sweet Pear",
      heart: "Dark Honey, Wild Orchid",
      base: "Sandalwood, Grey Amber",
      intensity: 5,
      mood: "Intoxicating, Decadent & Rich"
    },
    anatomy: [
      {
        id: "p1",
        x: 50,
        y: 45,
        titleEn: "Aroma Secreting Glands",
        titleVi: "Tuyến Tiết Hương Tự Nhiên",
        descriptionEn: "Microscopic droplets of aromatic essential oils that bloom under warmth.",
        descriptionVi: "Túi tinh dầu tự nhiên tỏa hương thơm nồng nàn khi gặp hơi ấm."
      }
    ],
    dimensions: "24cm (W) x 46cm (H)",
    seasonality: "Autumn – Winter",
    priceVnd: 2700000,
    priceUsd: 108,
    image: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
        captionVi: "Góc chụp chính diện loài hoa xám khói huyền bí",
        captionEn: "Frontal view of ash-toned rare botanical specimen"
      },
      {
        url: "/src/assets/images/juet_orchid_macro_stamen_1790844525372.jpg",
        captionVi: "Cận cảnh túi tinh dầu tự nhiên thơm ngát",
        captionEn: "Macro detail of aroma-secreting resin glands"
      },
      {
        url: "/src/assets/images/juet_blue_iris_1790840866986.jpg",
        captionVi: "Sắc thái huyền ảo trong bóng tối tĩnh lặng",
        captionEn: "Smoky chiaroscuro shadow play"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Dáng cành điêu khắc độc bản tại Atelier",
        captionEn: "Architectural branch arrangement profile"
      }
    ],
    audioFrequency: 528
  },
  {
    id: "rosa-damascena-noir",
    indexNumber: "11",
    name: "ROSA DAMASCENA NOIR",
    vietnameseName: "Hồng Damask Đen Nhung Huyền Thoại",
    latinName: "Rosa damascena tenebrosa",
    category: "bridal",
    categoryLabelEn: "Bridal & Haute Gifting",
    categoryLabelVi: "Hoa Cưới & Quà Tặng Đỉnh Cao",
    shortDescriptionEn: "A deep black-burgundy Ecuadorian rose bouquet tied with bespoke silk cord.",
    shortDescriptionVi: "Bó hoa hồng đen nhung Ecuador thượng hạng thắt dây lụa tơ tằm nguyên bản.",
    storyEn: "Grown in volcanic soil at 3,000 meters altitude, these velvet roses possess deep crimson pigmentation so dense it appears jet-black in dim light. A symbol of eternal soul connection and unbreakable passion.",
    storyVi: "Được nuôi dưỡng trên sườn núi lửa Ecuador, những đóa hồng mang sắc đỏ nhung đậm đến mức hóa đen tuyền dưới ánh đèn mờ ảo. Món quà trao gởi tình yêu vĩnh cửu không phai tàn theo thời gian.",
    botanicalNotesEn: "Ecuadorian black baccara roses, black calla lilies, smoky velvet wrapper.",
    botanicalNotesVi: "Hồng Black Baccara Ecuador, hoa rum đen, giấy gói nhung khói.",
    materials: ["Black Baccara Roses", "Black Calla Lilies", "Dark Cotinus Leaves"],
    materialsVi: ["Hồng Đen Baccara Ecuador", "Rum Đen", "Lá Cotinus Đỏ Tía"],
    scent: {
      top: "Black Currant, Damask Rose",
      heart: "Red Wine, Clove, Turkish Delight",
      base: "Dark Patchouli, Velvet Oud",
      intensity: 5,
      mood: "Passionate, Luxurious & Eternal"
    },
    anatomy: [
      {
        id: "p1",
        x: 48,
        y: 42,
        titleEn: "Velvet Petal Sheen",
        titleVi: "Lớp Nhung Cánh Hồng",
        descriptionEn: "Light-absorbing velvety texture with deep anthocyanin pigments.",
        descriptionVi: "Chất cánh nhung dày dặn hấp thụ ánh sáng tạo độ sâu huyền bí."
      }
    ],
    dimensions: "36cm (W) x 50cm (H)",
    seasonality: "Year-Round",
    priceVnd: 4200000,
    priceUsd: 168,
    image: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_poppy_transvaal_1790840799591.jpg",
        captionVi: "Bó hoa hồng đen nhung quý phái",
        captionEn: "Frontal portrait of Black Baccara luxury bouquet"
      },
      {
        url: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
        captionVi: "Cận cảnh chất nhung đen đậm sắc đỏ rượu vang",
        captionEn: "Macro detail of velvety burgundy-black rose petals"
      },
      {
        url: "/src/assets/images/juet_calla_sculpture_1790840903037.jpg",
        captionVi: "Dải lụa tơ tằm nguyên bản thắt thủ công",
        captionEn: "Hand-tied silk cord and wrapping craftsmanship"
      },
      {
        url: "/src/assets/images/juet_surreal_orchid_1790840788413.jpg",
        captionVi: "Ánh sáng studio làm nổi bật nét huyền bí",
        captionEn: "Chiaroscuro studio spotlighting on dark petals"
      }
    ],
    audioFrequency: 639
  },
  {
    id: "fluffus-ranunculus",
    indexNumber: "12",
    name: "FLUFFUS RANUNCULUS",
    vietnameseName: "Mao Lương Bồng Bềnh Dáng Mây",
    latinName: "Ranunculus grandis fluffus",
    category: "seasonal",
    categoryLabelEn: "Seasonal Haute Floristry",
    categoryLabelVi: "Hoa Thiết Kế Mùa",
    shortDescriptionEn: "Airy pastel ranunculus nestled within fluffy natural cotton clouds.",
    shortDescriptionVi: "Hoa mao lương pastel bồng bềnh êm ái giữa những cụm bông gòn tự nhiên như mây trời.",
    storyEn: "Gentle and uplifting, this signature JU et Saigon design combines hundreds of paper-thin ranunculus petals with natural cotton boll accents, evoking the innocence of morning dreams over the city.",
    storyVi: "Mang lại cảm giác bình yên và êm dịu. Sự đan xen giữa hoa mao lương cánh mỏng và bông cotton trắng tinh khôi là lựa chọn ngọt ngào nhất cho sinh nhật, kỷ niệm và quà tặng người thương.",
    botanicalNotesEn: "Pastel butterfly ranunculus, natural raw cotton bolls, baby breath filigree.",
    botanicalNotesVi: "Mao lương bướm pastel, quả bông tự nhiên, hoa bi trắng li ti.",
    materials: ["Pastel Butterfly Ranunculus", "Raw White Cotton", "Blush Sweet Peas"],
    materialsVi: ["Mao Lương Bướm Pastel", "Bông Gòn Tự Nhiên", "Đậu Thơm Hồng Phấn"],
    scent: {
      top: "Sweet Almond, Cotton Blossom",
      heart: "Morning Dew, Peony Petals",
      base: "White Musks",
      intensity: 2,
      mood: "Comforting, Soft & Dreamy"
    },
    anatomy: [
      {
        id: "p1",
        x: 50,
        y: 35,
        titleEn: "Cotton Cloud Pods",
        titleVi: "Búp Bông Gòn Mây Trắng",
        descriptionEn: "Soft organic cotton fibers acting as gentle shock absorbers.",
        descriptionVi: "Sợi bông gòn organic tự nhiên ôm ấp từng nụ hoa tươi non."
      }
    ],
    dimensions: "30cm (W) x 40cm (H)",
    seasonality: "Spring / Autumn",
    priceVnd: 2400000,
    priceUsd: 96,
    image: "/src/assets/images/juet_blush_peony_1790840758164.jpg",
    galleryImages: [
      {
        url: "/src/assets/images/juet_blush_peony_1790840758164.jpg",
        captionVi: "Góc chụp chính diện bó hoa mao lương mây trắng",
        captionEn: "Frontal view of fluffy pastel ranunculus arrangement"
      },
      {
        url: "/src/assets/images/juet_peony_side_angle_1790844501746.jpg",
        captionVi: "Góc nghiêng bồng bềnh trong không gian phòng ngủ",
        captionEn: "Side angle perspective in soft morning natural light"
      },
      {
        url: "/src/assets/images/juet_golden_chrysanthemum_1790840878623.jpg",
        captionVi: "Cận cảnh sợi bông gòn tự nhiên và cánh hoa mềm",
        captionEn: "Macro detail of organic raw cotton and layered petals"
      },
      {
        url: "/src/assets/images/juet_white_anemone_1790840892002.jpg",
        captionVi: "Chi tiết bao gói tinh tế đặc trưng JU et Saigon",
        captionEn: "Signature JU et Saigon wrapper presentation"
      }
    ],
    audioFrequency: 432
  }
];

export const BOTANICAL_CATEGORIES = [
  { id: 'all', labelEn: 'All Creations', labelVi: 'Tất Cả Tác Phẩm' },
  { id: 'bridal', labelEn: 'Bridal Haute Couture', labelVi: 'Hoa Cưới Độc Bản' },
  { id: 'sculptural', labelEn: 'Artistic Installations', labelVi: 'Điêu Khắc Không Gian' },
  { id: 'rare-stems', labelEn: 'Rare Stems Archive', labelVi: 'Cành Hoa Quý Hiếm' },
  { id: 'seasonal', labelEn: 'Seasonal Collections', labelVi: 'Bộ Sưu Tập Mùa' }
];

export const BOTANICAL_SEASONS = [
  { id: 'all', labelEn: 'All Seasons', labelVi: 'Tất Cả Các Mùa' },
  { id: 'spring', labelEn: 'Spring (Xuân)', labelVi: 'Mùa Xuân' },
  { id: 'summer', labelEn: 'Summer (Hạ)', labelVi: 'Mùa Hạ' },
  { id: 'autumn', labelEn: 'Autumn (Thu)', labelVi: 'Mùa Thu' },
  { id: 'winter', labelEn: 'Winter (Đông)', labelVi: 'Mùa Đông' },
  { id: 'year-round', labelEn: 'Year-Round (Quanh năm)', labelVi: 'Quanh Năm' }
];
