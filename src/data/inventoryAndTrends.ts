import { FlowerItem } from './flowers';
import { BespokeOrder } from '../context/AtelierContext';

export type SupplyCategory = 'vessels' | 'packaging' | 'conditioning' | 'stems';

export interface SupplyItem {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  category: SupplyCategory;
  unit: string;
  currentStock: number;
  minThreshold: number;
  unitCostVnd: number;
  peakBoostFactor: number; // Multiplier during peak floral months (e.g. 2.0x - 3.0x)
  supplierNote: string;
  updatedAt: string;
}

export const SUPPLY_CATEGORIES: Array<{
  id: SupplyCategory | 'all';
  labelVi: string;
  labelEn: string;
  descVi: string;
}> = [
  {
    id: 'all',
    labelVi: 'Tất Cả Vật Tư',
    labelEn: 'All Supplies',
    descVi: 'Toàn bộ dụng cụ, bình gốm, phụ liệu đóng gói và hoa chủ đạo'
  },
  {
    id: 'vessels',
    labelVi: '1. Bình, Giỏ & Hộp Hoa',
    labelEn: '1. Vessels & Boxes',
    descVi: 'Bình gốm Wabi-Sabi, bình thủy tinh điêu khắc, hộp nhung Signature'
  },
  {
    id: 'packaging',
    labelVi: '2. Giấy Gói, Ruy Băng & Sáp',
    labelEn: '2. Packaging & Wax Seal',
    descVi: 'Giấy lụa chống nước, ruy băng tơ tằm, sáp đóng dấu, thiệp mỹ thuật'
  },
  {
    id: 'conditioning',
    labelVi: '3. Dưỡng Hoa & Dụng Cụ Xưởng',
    labelEn: '3. Conditioning & Tools',
    descVi: 'Xốp Oasis Maxlife, thuốc dưỡng Chrysal, túi bọc giữ ẩm gốc hoa'
  },
  {
    id: 'stems',
    labelVi: '4. Hoa & Lá Chủ Đạo Dự Trữ',
    labelEn: '4. Core Stems & Foliage',
    descVi: 'Các dòng hoa nhập khẩu chủ lực & lá tạo form cần kiểm soát định mức'
  }
];

export const DEFAULT_SUPPLIES: SupplyItem[] = [
  {
    id: 'sup-vessel-wabisabi',
    sku: 'VES-01',
    nameVi: 'Bình Gốm Wabi-Sabi Thủ Công (Đen Nhám / Kem Đá)',
    nameEn: 'Handcrafted Wabi-Sabi Ceramic Vessel',
    category: 'vessels',
    unit: 'Chiếc',
    currentStock: 8,
    minThreshold: 10,
    unitCostVnd: 280000,
    peakBoostFactor: 2.2,
    supplierNote: 'Lò gốm thủ công Bình Dương — Đặt trước 5 ngày nếu nhập trên 20 chiếc',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-vessel-velvetbox',
    sku: 'VES-02',
    nameVi: 'Hộp Hoa Nhung Đen & Kem Signature JU et Saigon',
    nameEn: 'Signature Velvet Hatbox (Noir & Crème)',
    category: 'vessels',
    unit: 'Hộp',
    currentStock: 12,
    minThreshold: 15,
    unitCostVnd: 165000,
    peakBoostFactor: 2.8,
    supplierNote: 'Xưởng hộp ép kim Q.3 — Tiêu thụ cực nhanh dịp 20/10, 14/02 và 08/03',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-vessel-glass',
    sku: 'VES-03',
    nameVi: 'Bình Thủy Tinh Điêu Khắc Cổ Cao Trong Suốt',
    nameEn: 'Architectural Tall Cylinder Glass Vase',
    category: 'vessels',
    unit: 'Chiếc',
    currentStock: 14,
    minThreshold: 8,
    unitCostVnd: 190000,
    peakBoostFactor: 1.8,
    supplierNote: 'Dùng cho các mẫu Điêu Khắc (Sculptural) & Sảnh Doanh Nghiệp',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-pkg-silkpaper',
    sku: 'PKG-01',
    nameVi: 'Giấy Gói Lụa Mờ Chống Nước Hàn Quốc (Đen / Kem / Khói)',
    nameEn: 'Matte Waterproof Korean Silk Wrapping Paper',
    category: 'packaging',
    unit: 'Xấp (20 tờ)',
    currentStock: 6,
    minThreshold: 10,
    unitCostVnd: 95000,
    peakBoostFactor: 2.6,
    supplierNote: 'Ưu tiên tông Đen Noir, Kem Parchment và Xám Khói đặc trưng của Atelier',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-pkg-ribbon',
    sku: 'PKG-02',
    nameVi: 'Ruy Băng Lụa Tơ Tằm Tước Sợi Thủ Công Khổ 4cm',
    nameEn: 'Hand-Frayed Raw Silk Ribbon (4cm)',
    category: 'packaging',
    unit: 'Cuộn (25m)',
    currentStock: 7,
    minThreshold: 8,
    unitCostVnd: 140000,
    peakBoostFactor: 2.5,
    supplierNote: 'Dùng buộc gốc bó hoa & hộp quà — Luôn dự trữ màu Champagne & Đỏ Rượu',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-pkg-waxbeads',
    sku: 'PKG-03',
    nameVi: 'Hạt Sáp Đóng Dấu Cổ Điển (Vàng Đồng / Đỏ Nhung / Rêu)',
    nameEn: 'Artisanal Sealing Wax Beads (Gold / Crimson / Moss)',
    category: 'packaging',
    unit: 'Hộp (200 hạt)',
    currentStock: 5,
    minThreshold: 6,
    unitCostVnd: 120000,
    peakBoostFactor: 2.4,
    supplierNote: 'Mỗi thiệp dấu sáp tiêu hao 3–4 hạt sáp. Kiểm tra thêm nến đun sáp.',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-pkg-cards',
    sku: 'PKG-04',
    nameVi: 'Bộ Thiệp Giấy Mỹ Thuật 350gsm & Phong Bì Can Mờ',
    nameEn: '350gsm Fine Art Stationery Card & Vellum Envelope',
    category: 'packaging',
    unit: 'Bộ (50 thiệp)',
    currentStock: 4,
    minThreshold: 5,
    unitCostVnd: 210000,
    peakBoostFactor: 3.0,
    supplierNote: '100% đơn quà tặng dịp lễ đều đính kèm thiệp đóng dấu sáp và Care Tag',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-cnd-oasis',
    sku: 'CND-01',
    nameVi: 'Xốp Cắm Hoa Sinh Học Oasis Ideal Floral Foam',
    nameEn: 'Oasis Ideal Maxlife Floral Foam Box',
    category: 'conditioning',
    unit: 'Thùng (20 viên)',
    currentStock: 3,
    minThreshold: 4,
    unitCostVnd: 360000,
    peakBoostFactor: 2.5,
    supplierNote: 'Ngâm nước pha Chrysal tự thẩm thấu, không ấn tay khi chuẩn bị cốt cắm',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-cnd-chrysal',
    sku: 'CND-02',
    nameVi: 'Dung Dịch Dưỡng Hoa Tươi Chrysal Professional 2',
    nameEn: 'Chrysal Professional 2 Conditioning Solution',
    category: 'conditioning',
    unit: 'Can (5 Lít)',
    currentStock: 2,
    minThreshold: 2,
    unitCostVnd: 680000,
    peakBoostFactor: 2.0,
    supplierNote: 'Dùng cho Bước 2 (Tuyển chọn & Dưỡng hoa) giúp hoa tươi lâu thêm 60%',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-cnd-hydration',
    sku: 'CND-03',
    nameVi: 'Túi Bọc Giữ Ẩm Gốc Hoa Chuyên Dụng (Eco Hydration Bag)',
    nameEn: 'Eco Root Hydration Travel Wrap Pack',
    category: 'conditioning',
    unit: 'Bịch (50 túi)',
    currentStock: 3,
    minThreshold: 5,
    unitCostVnd: 150000,
    peakBoostFactor: 2.6,
    supplierNote: 'Bắt buộc ở Bước 5 (Đóng gói & Đang giao) để hoa không héo khi di chuyển',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-stm-ohara',
    sku: 'STM-01',
    nameVi: 'Hoa Hồng Ngoại Ohara / Ecuador Tuyển Chọn (Hồng Phấn & Trắng Kem)',
    nameEn: 'Premium Imported Ohara & Ecuadorian Roses',
    category: 'stems',
    unit: 'Bó (20 cành)',
    currentStock: 6,
    minThreshold: 8,
    unitCostVnd: 450000,
    peakBoostFactor: 3.0,
    supplierNote: 'Bảo quản tủ mát 4–6°C, tỉa gai và lá gốc ngay khi nhập kho buổi sáng',
    updatedAt: '2026-10-09T00:00:00.000Z'
  },
  {
    id: 'sup-stm-eucalyptus',
    sku: 'STM-02',
    nameVi: 'Lá Khuynh Diệp Bạc Nhập Khẩu (Cinerea & Parvifolia)',
    nameEn: 'Imported Silver Dollar & Parvifolia Eucalyptus',
    category: 'stems',
    unit: 'Bó lớn',
    currentStock: 9,
    minThreshold: 6,
    unitCostVnd: 180000,
    peakBoostFactor: 2.0,
    supplierNote: 'Nốt hương xanh mát chủ đạo xuất hiện trong 70% tác phẩm của JU et Saigon',
    updatedAt: '2026-10-09T00:00:00.000Z'
  }
];

export interface MonthlyMarketForecast {
  month: number; // 1 - 12
  monthNameVi: string;
  seasonLabelVi: string;
  peakEventTitleVi: string;
  peakDates: string;
  demandMultiplier: number; // e.g., 1.4 to 3.0
  demandLevel: 'normal' | 'high' | 'extreme';
  trendingMoods: string[];
  keyBloomsInSeasonVi: string[];
  colorPaletteTrendVi: string;
  marketForecastSummaryVi: string;
  actionableAdviceVi: string[];
}

export const MONTHLY_MARKET_FORECASTS: MonthlyMarketForecast[] = [
  {
    month: 1,
    monthNameVi: 'Tháng 1 — Khởi Đầu Năm Mới & Chớm Xuân',
    seasonLabelVi: 'Mùa Xuân (Spring)',
    peakEventTitleVi: 'Tết Dương Lịch & Chuẩn Bị Tết Nguyên Đán',
    peakDates: '01/01 – Cuối tháng Chạp',
    demandMultiplier: 2.3,
    demandLevel: 'high',
    trendingMoods: ['sculptural', 'minimalist'],
    keyBloomsInSeasonVi: ['Đào Đông Đỏ (Ilex)', 'Lan Hồ Điệp', 'Mao Lương (Ranunculus)', 'Tuyết Mai', 'Thanh Liễu'],
    colorPaletteTrendVi: 'Đỏ Carmine, Vàng Champagne & Xanh Rêu Trầm',
    marketForecastSummaryVi:
      'Khách hàng doanh nghiệp đặt hoa tri ân đối tác cuối năm và trang trí không gian đón xuân. Các thiết kế bình gốm dáng điêu khắc sang trọng tăng trưởng mạnh.',
    actionableAdviceVi: [
      'Nhập dự trữ Bình gốm Wabi-Sabi cỡ lớn và Hộp quà doanh nghiệp trước 20 ngày.',
      'Chốt lịch đặt hoa Đào Đông, Tuyết Mai và Lan Hồ Điệp với nhà vườn Đà Lạt / Hà Lan.',
      'Đẩy mạnh các mẫu Điêu Khắc (Sculptural) cho sảnh công ty và biệt thự.'
    ]
  },
  {
    month: 2,
    monthNameVi: 'Tháng 2 — Mùa Yêu Valentine & Tân Niên',
    seasonLabelVi: 'Mùa Xuân (Spring)',
    peakEventTitleVi: 'Lễ Tình Nhân Valentine (14/02)',
    peakDates: '10/02 – 15/02',
    demandMultiplier: 3.0,
    demandLevel: 'extreme',
    trendingMoods: ['romantic', 'sculptural'],
    keyBloomsInSeasonVi: ['Hồng Ecuador Đỏ Nhung (Explorer)', 'Hồng Ohara', 'Tulip Hà Lan', 'Mẫu Đơn (Peony)'],
    colorPaletteTrendVi: 'Đỏ Rượu Vang (Burgundy), Đen Noir & Hồng Khói',
    marketForecastSummaryVi:
      'Đỉnh điểm đơn đặt hoa cá nhân và thiệp đóng dấu sáp. Giá hoa hồng nhập khẩu thường tăng 80–120% sát ngày 12–14/02.',
    actionableAdviceVi: [
      'Tăng gấp 3 lần tồn kho Hộp nhung đen Signature, Sáp đỏ Crimson và Ruy băng lụa.',
      'Khuyến khích khách đặt sớm trước ngày 11/02 với khung giờ giao sáng.',
      'Kích hoạt gợi ý mẫu Tulip hoặc Mao Lương thay thế khi Hồng Ecuador cháy hàng.'
    ]
  },
  {
    month: 3,
    monthNameVi: 'Tháng 3 — Tôn Vinh Phái Đẹp Quốc Tế',
    seasonLabelVi: 'Mùa Xuân (Spring)',
    peakEventTitleVi: 'Quốc Tế Phụ Nữ (08/03)',
    peakDates: '05/03 – 08/03',
    demandMultiplier: 2.8,
    demandLevel: 'extreme',
    trendingMoods: ['romantic', 'minimalist', 'wild'],
    keyBloomsInSeasonVi: ['Mao Lương (Ranunculus)', 'Hoa Đậu Thơm (Sweet Pea)', 'Tulip Cánh Kép', 'Hồng Juliet'],
    colorPaletteTrendVi: 'Hồng Phấn Đào, Kem Bơ (Buttercream) & Trắng Tinh Khiết',
    marketForecastSummaryVi:
      'Lượng đơn tăng đột biến ở cả hai phân khúc: Quà tặng doanh nghiệp (số lượng lớn) và quà tặng cá nhân (vợ, mẹ, người thương).',
    actionableAdviceVi: [
      'Dự trữ tối đa Giấy gói lụa Hàn Quốc, Túi bọc giữ ẩm gốc hoa và Thiệp viết tay.',
      'Mở sẵn các mẫu "Sẵn hoa trong ngày" tầm giá 1.200.000đ – 2.500.000đ để chốt đơn nhanh.',
      'Phân bổ đơn theo 4 khung giờ giao để đội shipper không bị quá tải sáng 08/03.'
    ]
  },
  {
    month: 4,
    monthNameVi: 'Tháng 4 — Giao Mùa Thanh Khiết',
    seasonLabelVi: 'Giao Mùa Xuân – Hạ',
    peakEventTitleVi: 'Mùa Triển Lãm Nghệ Thuật & Sự Kiện Thương Hiệu',
    peakDates: 'Cả tháng 4',
    demandMultiplier: 1.4,
    demandLevel: 'normal',
    trendingMoods: ['minimalist', 'bridal'],
    keyBloomsInSeasonVi: ['Rum Trắng (Calla Lily)', 'Lan Hồ Điệp Trắng', 'Cát Tường Xoăn', 'Lá Khuynh Diệp'],
    colorPaletteTrendVi: 'Trắng Ngà, Xanh Lá Mạ & Cát Tự Nhiên',
    marketForecastSummaryVi:
      'Thời tiết Sài Gòn bắt đầu nắng ấm, khách hàng ưu chuộng các thiết kế Tối Giản (Minimalist) mang cảm giác thanh mát và bền nhiệt.',
    actionableAdviceVi: [
      'Tăng cường sử dụng Chrysal dưỡng hoa và bọc giữ ẩm kỹ hơn do nhiệt độ ngoài trời cao.',
      'Đẩy mạnh dịch vụ Workshop cắm hoa doanh nghiệp cuối tuần.'
    ]
  },
  {
    month: 5,
    monthNameVi: 'Tháng 5 — Mùa Của Mẹ & Hoa Mẫu Đơn Chính Vụ',
    seasonLabelVi: 'Mùa Hạ (Summer)',
    peakEventTitleVi: 'Ngày Của Mẹ (Chủ Nhật tuần thứ 2 của Tháng 5)',
    peakDates: 'Tuần thứ 2 Tháng 5',
    demandMultiplier: 2.2,
    demandLevel: 'high',
    trendingMoods: ['romantic', 'wild'],
    keyBloomsInSeasonVi: ['Mẫu Đơn (Peony) Chính Vụ', 'Cẩm Tú Cầu Nhập Khẩu', 'Hồng Cổ Điển', 'Cúc Mẫu Đơn'],
    colorPaletteTrendVi: 'Hồng Coral, Trắng Kem & Tím Pastel Dịu Dàng',
    marketForecastSummaryVi:
      'Tháng 5 là đỉnh cao của mùa hoa Mẫu Đơn (Peony) bông to và giá tốt nhất năm. Khách hàng đặt giỏ hoa & bình hoa tặng Mẹ tăng mạnh.',
    actionableAdviceVi: [
      'Tung bộ sưu tập Mẫu Đơn (Peony) giới hạn và ghim lên đầu trang chủ.',
      'Chuẩn bị thêm Giỏ hoa & Bình gốm để khách tặng Mẹ chưng bàn ăn gia đình.'
    ]
  },
  {
    month: 6,
    monthNameVi: 'Tháng 6 — Nghệ Thuật Nhiệt Đới & Tiệc Cưới Hè',
    seasonLabelVi: 'Mùa Hạ (Summer)',
    peakEventTitleVi: 'Ngày Gia Đình Việt Nam (28/06) & Mùa Cưới Hè',
    peakDates: '25/06 – 28/06',
    demandMultiplier: 1.6,
    demandLevel: 'normal',
    trendingMoods: ['bridal', 'sculptural'],
    keyBloomsInSeasonVi: ['Thảo Đường Hoàng Đế (King Protea)', 'Sen Quan Âm', 'Hồng Môn Nghệ Thuật', 'Lan Vũ Nữ'],
    colorPaletteTrendVi: 'Trắng Tinh Khôi, Xanh Olive & Cam Đất Terracotta',
    marketForecastSummaryVi:
      'Hoa Sen đầu mùa và các loài hoa nhiệt đới có độ bền vượt trội lên ngôi. Nhu cầu hoa cầm tay cô dâu (Bridal) và hoa trang trí tư gia ổn định.',
    actionableAdviceVi: [
      'Ưu tiên nhập các dòng hoa chịu nhiệt tốt (Protea, Calla Lily, Sen, Lan).',
      'Kiểm soát lượng tồn kho hoa lá nhạy cảm nhiệt để giảm tỷ lệ hao hụt.'
    ]
  },
  {
    month: 7,
    monthNameVi: 'Tháng 7 — Điêu Khắc Đương Đại Mùa Mưa Sài Gòn',
    seasonLabelVi: 'Mùa Hạ – Mùa Mưa',
    peakEventTitleVi: 'Mùa Workshop Trải Nghiệm & Không Gian Nội Thất',
    peakDates: 'Cả tháng 7',
    demandMultiplier: 1.3,
    demandLevel: 'normal',
    trendingMoods: ['sculptural', 'minimalist'],
    keyBloomsInSeasonVi: ['Thiên Điểu (Bird of Paradise)', 'Cỏ Đồng Tiền (Lunaria)', 'Cành Khô Nghệ Thuật', 'Hồng Ecuador'],
    colorPaletteTrendVi: 'Nâu Đất, Be Đá Vôi & Xanh Rêu Rừng',
    marketForecastSummaryVi:
      'Mùa mưa chiều tại Sài Gòn khiến khách hàng chuộng đặt hoa giao khung giờ Sáng (08:30–11:30) và tham gia các buổi Workshop trong nhà.',
    actionableAdviceVi: [
      'Bọc chống nước lớp ngoài cho tác phẩm khi giao khung giờ Chiều & Tối.',
      'Tối ưu tồn kho ở mức tinh gọn, tập trung vào các mẫu bình gốm Ikebana.'
    ]
  },
  {
    month: 8,
    monthNameVi: 'Tháng 8 — Mùa Vu Lan Hiếu Hạnh & Chớm Thu',
    seasonLabelVi: 'Chớm Thu (Early Autumn)',
    peakEventTitleVi: 'Lễ Vu Lan Báo Hiếu (Rằm Tháng 7 Âm Lịch)',
    peakDates: 'Giữa Tháng 8',
    demandMultiplier: 1.9,
    demandLevel: 'high',
    trendingMoods: ['minimalist', 'romantic'],
    keyBloomsInSeasonVi: ['Sen Trắng & Sen Hồng', 'Mẫu Đơn Trắng', 'Cúc Mẫu Đơn', 'Hồng Trắng Ohara'],
    colorPaletteTrendVi: 'Trắng Thanh Khiết, Vàng Nhạt & Hồng Phấn Trang Nhã',
    marketForecastSummaryVi:
      'Nhu cầu đặt hoa dâng Phật và hoa tặng cha mẹ dịp lễ Vu Lan tăng cao, đặc biệt là các thiết kế thanh tao, trang trọng.',
    actionableAdviceVi: [
      'Chuẩn bị sẵn dòng thiệp chữ thư pháp / serif trang nhã kèm dấu sáp màu Đồng (Bronze).',
      'Nhập tăng cường bình gốm tông màu trầm và hoa tông trắng – kem.'
    ]
  },
  {
    month: 9,
    monthNameVi: 'Tháng 9 — Khúc Giao Mùa Thu & Tết Trung Thu',
    seasonLabelVi: 'Mùa Thu (Autumn)',
    peakEventTitleVi: 'Quốc Khánh (02/09) & Quà Tặng Trung Thu Đoàn Viên',
    peakDates: 'Đầu & Giữa Tháng 9',
    demandMultiplier: 1.8,
    demandLevel: 'high',
    trendingMoods: ['sculptural', 'wild'],
    keyBloomsInSeasonVi: ['Hồng Cổ Điển (Capuccino / Toffee)', 'Cúc Mẫu Đơn Nâu Cam', 'Lá Phong Đỏ', 'Quả Hồng Tiểu Cảnh'],
    colorPaletteTrendVi: 'Cam Cháy (Burnt Sienna), Nâu Cafe, Vàng Hổ Phách',
    marketForecastSummaryVi:
      'Thị trường bắt đầu bước vào chuỗi 4 tháng cao điểm nhất năm (Tháng 9 đến Tháng 12). Tông màu Thu trầm ấm được săn đón mạnh.',
    actionableAdviceVi: [
      'Rà soát toàn bộ kho Bình, Hộp, Giấy gói và Sáp đóng dấu để chuẩn bị cho cao điểm Tháng 10.',
      'Ra mắt các thiết kế tông Nâu Toffee – Cam Đất – Vàng Mùa Thu.'
    ]
  },
  {
    month: 10,
    monthNameVi: 'Tháng 10 — Đỉnh Cao Mùa Thu & Ngày Phụ Nữ Việt Nam 20/10',
    seasonLabelVi: 'Mùa Thu (Peak Autumn)',
    peakEventTitleVi: 'Ngày Phụ Nữ Việt Nam (20/10)',
    peakDates: '16/10 – 20/10',
    demandMultiplier: 2.8,
    demandLevel: 'extreme',
    trendingMoods: ['romantic', 'sculptural', 'wild'],
    keyBloomsInSeasonVi: [
      'Hồng Ohara Hồng & Trắng',
      'Cúc Mẫu Đơn Hà Lan',
      'Thu Hải Đường (Begonia)',
      'Thảo Đường (Protea)',
      'Mao Lương Đầu Mùa'
    ],
    colorPaletteTrendVi: 'Hồng Phấn Cổ Điển, Đỏ Burgundy, Kem Ngà & Vàng Đồng',
    marketForecastSummaryVi:
      'Một trong 3 tháng có doanh số cao nhất năm. Đơn hàng tăng gấp 3 lần từ ngày 17/10, đặc biệt là phân khúc bó hoa thiết kế riêng kèm thiệp đóng dấu sáp.',
    actionableAdviceVi: [
      'Nhập bổ sung ngay các vật tư dưới ngưỡng Cao Điểm (Hộp hoa, Giấy lụa, Ruy băng, Xốp Oasis, Túi giữ ẩm).',
      'Bật trạng thái "Sẵn hoa trong ngày" cho ít nhất 6–8 mẫu chủ lực để khách đặt nhanh không bị nghẽn.',
      'Sử dụng tính năng Gợi ý mẫu thay thế tự động cho các mẫu hoa trái mùa để giữ 100% tỷ lệ chuyển đổi.'
    ]
  },
  {
    month: 11,
    monthNameVi: 'Tháng 11 — Mùa Tri Ân 20/11 & Đỉnh Cao Mùa Cưới Cuối Năm',
    seasonLabelVi: 'Cuối Thu – Chớm Đông',
    peakEventTitleVi: 'Ngày Nhà Giáo Việt Nam (20/11) & Mùa Cưới Cuối Năm',
    peakDates: '15/11 – 20/11',
    demandMultiplier: 2.3,
    demandLevel: 'high',
    trendingMoods: ['bridal', 'romantic', 'minimalist'],
    keyBloomsInSeasonVi: ['Hướng Dương Nghệ Thuật', 'Rum Trắng (Calla Lily)', 'Hồng Juliet', 'Linh Lan (Lily of the Valley)'],
    colorPaletteTrendVi: 'Vàng Nắng Ấm, Trắng Kem Tinh Khiết & Xanh Bạc',
    marketForecastSummaryVi:
      'Song hành 2 luồng nhu cầu lớn: Hoa tri ân thầy cô dịp 20/11 và hoa cưới cầm tay (Bridal) khi bước vào mùa cưới đẹp nhất năm.',
    actionableAdviceVi: [
      'Dự trữ đầy đủ Thiệp mỹ thuật 350gsm và Sáp đóng dấu vì 95% đơn 20/11 có lời chúc dài.',
      'Đẩy mạnh các mẫu Hoa Cưới (Bridal) và Giỏ/Hộp hoa trang trọng.'
    ]
  },
  {
    month: 12,
    monthNameVi: 'Tháng 12 — Mùa Lễ Hội Giáng Sinh & Giao Thừa',
    seasonLabelVi: 'Mùa Đông (Winter Festive)',
    peakEventTitleVi: 'Giáng Sinh (24–25/12) & Tiệc Tất Niên Doanh Nghiệp',
    peakDates: '15/12 – 31/12',
    demandMultiplier: 2.5,
    demandLevel: 'extreme',
    trendingMoods: ['sculptural', 'wild', 'romantic'],
    keyBloomsInSeasonVi: ['Thông Tươi Đan Mạch (Nobilis Fir)', 'Đào Đông Đỏ (Ilex)', 'Hồng Đỏ Explorer', 'Trạng Nguyên & Quả Thông'],
    colorPaletteTrendVi: 'Xanh Thông Rừng (Forest Green), Đỏ Nhung & Vàng Ánh Kim',
    marketForecastSummaryVi:
      'Nhu cầu vòng nguyệt quế thông tươi, bình hoa bàn tiệc Giáng Sinh và Workshop làm vòng thông cuối năm tăng bùng nổ.',
    actionableAdviceVi: [
      'Nhập Thông tươi Đan Mạch, Quả châu, Nến thơm và Ruy băng nhung từ đầu tháng 12.',
      'Mở lịch đăng ký Workshop Giáng Sinh cho khách doanh nghiệp từ tuần đầu tháng.'
    ]
  }
];

export interface SupplyRestockAnalysis {
  item: SupplyItem;
  normalMin: number;
  peakAdjustedMin: number;
  status: 'critical' | 'peak_warning' | 'healthy';
  suggestedOrderQty: number;
  estimatedRestockCostVnd: number;
}

/**
 * Computes restock recommendations for all supplies based on the selected/current month's peak multiplier
 */
export function analyzeSupplyInventory(
  supplies: SupplyItem[],
  targetMonth?: number
): {
  forecast: MonthlyMarketForecast;
  itemsAnalysis: SupplyRestockAnalysis[];
  criticalCount: number;
  peakWarningCount: number;
  totalSuggestedRestockVnd: number;
} {
  const currentMonth = targetMonth || new Date().getMonth() + 1;
  const forecast =
    MONTHLY_MARKET_FORECASTS.find((m) => m.month === currentMonth) ||
    MONTHLY_MARKET_FORECASTS[9]; // Fallback October

  const itemsAnalysis: SupplyRestockAnalysis[] = supplies.map((item) => {
    const normalMin = Math.max(1, item.minThreshold);
    // Combine month demand multiplier with item's peak boost sensitivity
    const effectiveMultiplier = Math.max(
      1,
      (forecast.demandMultiplier * 0.65 + item.peakBoostFactor * 0.35)
    );
    const peakAdjustedMin = Math.ceil(normalMin * effectiveMultiplier);

    let status: 'critical' | 'peak_warning' | 'healthy' = 'healthy';
    if (item.currentStock <= normalMin) {
      status = 'critical';
    } else if (item.currentStock < peakAdjustedMin) {
      status = 'peak_warning';
    }

    // Target stock to reach safe buffer above peakAdjustedMin
    const targetSafeStock =
      status === 'healthy' ? item.currentStock : Math.ceil(peakAdjustedMin * 1.15);
    const suggestedOrderQty = Math.max(0, targetSafeStock - item.currentStock);
    const estimatedRestockCostVnd = suggestedOrderQty * (item.unitCostVnd || 0);

    return {
      item,
      normalMin,
      peakAdjustedMin,
      status,
      suggestedOrderQty,
      estimatedRestockCostVnd
    };
  });

  // Sort: critical first, then peak_warning, then healthy
  const priorityOrder = { critical: 0, peak_warning: 1, healthy: 2 };
  itemsAnalysis.sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]);

  const criticalCount = itemsAnalysis.filter((x) => x.status === 'critical').length;
  const peakWarningCount = itemsAnalysis.filter((x) => x.status === 'peak_warning').length;
  const totalSuggestedRestockVnd = itemsAnalysis.reduce(
    (sum, x) => sum + x.estimatedRestockCostVnd,
    0
  );

  return {
    forecast,
    itemsAnalysis,
    criticalCount,
    peakWarningCount,
    totalSuggestedRestockVnd
  };
}

export interface SmartAlternativeSuggestion {
  flower: FlowerItem;
  matchScore: number; // e.g. 82 - 98
  reasonsVi: string[];
  reasonsEn: string[];
}

/**
 * Recommends top alternative floral arrangements when the primary selection is out of season,
 * requires 24h pre-order (for express orders), or as curated similar designs.
 */
export function getSmartAlternativeFlowers(
  targetFlower: FlowerItem | null | undefined,
  allFlowers: FlowerItem[],
  limit = 3
): SmartAlternativeSuggestion[] {
  if (!targetFlower || !Array.isArray(allFlowers) || allFlowers.length === 0) {
    return [];
  }

  const candidates = allFlowers.filter((f) => f.id !== targetFlower.id);

  const scored: SmartAlternativeSuggestion[] = candidates.map((candidate) => {
    let score = 45;
    const reasonsVi: string[] = [];
    const reasonsEn: string[] = [];

    // 1. Operational Availability (Ready Today gets highest priority)
    const avail = candidate.availabilityStatus || 'ready_today';
    if (avail === 'ready_today') {
      score += 28;
      reasonsVi.push('Sẵn hoa trong ngày');
      reasonsEn.push('Ready today');
    } else if (avail === 'preorder_24h') {
      score += 10;
    } else {
      score -= 30; // Avoid recommending out-of-season items as alternatives
    }

    // 2. Emotional Category / Mood alignment
    if (candidate.category === targetFlower.category) {
      score += 16;
      reasonsVi.push(`Cùng cảm xúc ${candidate.categoryLabelVi}`);
      reasonsEn.push(`Same ${candidate.categoryLabelEn} mood`);
    }

    // 3. Price proximity (within ±30%)
    const targetPrice = targetFlower.priceVnd || 1500000;
    const candPrice = candidate.priceVnd || 1500000;
    const priceDiffRatio = Math.abs(candPrice - targetPrice) / Math.max(1, targetPrice);
    if (priceDiffRatio <= 0.25) {
      score += 10;
      reasonsVi.push('Tương đồng ngân sách');
      reasonsEn.push('Similar investment');
    } else if (priceDiffRatio <= 0.45) {
      score += 5;
    }

    // 4. Olfactory / Scent intensity or Highlight status
    if (candidate.highlight || candidate.pinnedToLanding !== false) {
      score += 4;
    }

    const clampedScore = Math.max(60, Math.min(98, Math.round(score)));
    if (reasonsVi.length === 0) {
      reasonsVi.push('Tác phẩm gợi ý từ Nghệ nhân');
      reasonsEn.push('Artisan curated alternative');
    }

    return {
      flower: candidate,
      matchScore: clampedScore,
      reasonsVi,
      reasonsEn
    };
  });

  // Sort by ready_today first, then matchScore descending
  scored.sort((a, b) => {
    const aReady = (a.flower.availabilityStatus || 'ready_today') === 'ready_today' ? 1 : 0;
    const bReady = (b.flower.availabilityStatus || 'ready_today') === 'ready_today' ? 1 : 0;
    if (aReady !== bReady) return bReady - aReady;
    return b.matchScore - a.matchScore;
  });

  return scored.slice(0, limit);
}

export interface FlowerTrendMetric {
  flower: FlowerItem;
  heatScore: number; // 0 - 100
  orderCount: number;
  wishlistsaved: boolean;
  isSeasonalPeak: boolean;
  trendBadgeVi: string | null;
  trendBadgeEn: string | null;
  trendType: 'hot' | 'seasonal' | 'signature' | null;
}

/**
 * Computes real-time market heat scores & trending badges for every flower
 * combining live orders, moodboard saves, and seasonal alignment.
 */
export function computeFlowerMarketTrends(
  flowers: FlowerItem[],
  orders: BespokeOrder[],
  wishlistIds: string[],
  targetMonth?: number
): FlowerTrendMetric[] {
  const currentMonth = targetMonth || new Date().getMonth() + 1;
  const forecast =
    MONTHLY_MARKET_FORECASTS.find((m) => m.month === currentMonth) ||
    MONTHLY_MARKET_FORECASTS[9];

  const metrics: FlowerTrendMetric[] = flowers.map((flower, idx) => {
    // Count matching orders
    const orderCount = orders.filter(
      (o) =>
        o.status !== 'cancelled' &&
        (o.flowerId === flower.id ||
          (o.flowerName && o.flowerName.toLowerCase().includes(flower.name.toLowerCase())))
    ).length;

    const wishlistsaved = wishlistIds.includes(flower.id);
    const isTrendingMood = forecast.trendingMoods.includes(flower.category);
    const seasonLower = (flower.seasonality || '').toLowerCase();
    const isSeasonalPeak =
      isTrendingMood ||
      seasonLower.includes('quanh năm') ||
      seasonLower.includes('year-round') ||
      (currentMonth >= 9 && currentMonth <= 11 && (seasonLower.includes('thu') || seasonLower.includes('autumn'))) ||
      (currentMonth === 12 && (seasonLower.includes('đông') || seasonLower.includes('winter'))) ||
      (currentMonth >= 1 && currentMonth <= 3 && (seasonLower.includes('xuân') || seasonLower.includes('spring')));

    let heatScore = 62;
    heatScore += Math.min(24, orderCount * 8);
    if (wishlistsaved) heatScore += 6;
    if (flower.highlight) heatScore += 7;
    if (flower.pinnedToLanding !== false) heatScore += 4;
    if (isTrendingMood) heatScore += 6;
    if ((flower.availabilityStatus || 'ready_today') === 'ready_today') heatScore += 4;
    // Slight deterministic variance based on index so top pieces rank cleanly even with 0 initial orders
    heatScore += Math.max(0, 6 - idx);

    const finalHeat = Math.min(99, Math.round(heatScore));

    let trendBadgeVi: string | null = null;
    let trendBadgeEn: string | null = null;
    let trendType: 'hot' | 'seasonal' | 'signature' | null = null;

    if (orderCount > 0 || finalHeat >= 82) {
      trendBadgeVi = 'Đang Hot Tuần Này';
      trendBadgeEn = 'Trending Now';
      trendType = 'hot';
    } else if (isSeasonalPeak && (flower.availabilityStatus || 'ready_today') === 'ready_today') {
      trendBadgeVi = 'Hoa Đúng Mùa Đẹp Nhất';
      trendBadgeEn = 'Peak Season Bloom';
      trendType = 'seasonal';
    } else if (flower.highlight) {
      trendBadgeVi = 'Signature Bán Chạy';
      trendBadgeEn = 'Atelier Bestseller';
      trendType = 'signature';
    }

    return {
      flower,
      heatScore: finalHeat,
      orderCount,
      wishlistsaved,
      isSeasonalPeak,
      trendBadgeVi,
      trendBadgeEn,
      trendType
    };
  });

  return metrics.sort((a, b) => b.heatScore - a.heatScore);
}
