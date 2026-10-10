import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { FlowerItem, FLOWERS, ATELIER_DATA } from '../data/flowers';
import { WorkshopItem, WORKSHOPS } from '../data/workshop';
import { SupplyItem, DEFAULT_SUPPLIES } from '../data/inventoryAndTrends';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import {
  formatDisplayUppercase,
  formatTitleCase,
  formatBotanicalLatin,
  formatProseNFC,
  normalizeUnicodeNFC
} from '../utils/textFormatter';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

export interface WaxSealGiftCard {
  enabled: boolean;
  recipient: string;
  sender: string;
  message: string;
  paperStyle: 'parchment' | 'noir' | 'blush';
  fontStyle: 'serif' | 'italic' | 'mono';
  waxColor: 'gold' | 'crimson' | 'bronze' | 'moss';
}

export type OrderStatus =
  | 'pending'
  | 'conditioning'
  | 'crafting'
  | 'quality_check'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface OrderWorkflowChecklist {
  stemsConditioned: boolean;
  vesselPrepared: boolean;
  arrangementCrafted: boolean;
  waxSealCardAttached: boolean;
  qcPhotoUploaded: boolean;
  hydrationWrapped: boolean;
}

export interface OrderWorkflowLog {
  stage: OrderStatus;
  timestamp: string;
  note?: string;
}

export const DEFAULT_WORKFLOW_CHECKLIST: OrderWorkflowChecklist = {
  stemsConditioned: false,
  vesselPrepared: false,
  arrangementCrafted: false,
  waxSealCardAttached: false,
  qcPhotoUploaded: false,
  hydrationWrapped: false
};

export const ORDER_WORKFLOW_STAGES: Array<{
  id: OrderStatus;
  stepNum: number;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  descVi: string;
  descEn: string;
}> = [
  {
    id: 'pending',
    stepNum: 1,
    labelVi: '1. Tiếp Nhận & Xác Nhận',
    labelEn: '1. Order Received',
    shortVi: 'Tiếp nhận',
    descVi: 'Xác nhận yêu cầu thiết kế, khung giờ giao và thông tin người nhận',
    descEn: 'Validating bespoke concept, delivery window, and recipient details'
  },
  {
    id: 'conditioning',
    stepNum: 2,
    labelVi: '2. Tuyển Chọn & Dưỡng Hoa',
    labelEn: '2. Stem Conditioning',
    shortVi: 'Dưỡng hoa',
    descVi: 'Tuyển chọn cành hoa tươi, cắt gốc và cấp nước dưỡng chuyên sâu tại Atelier',
    descEn: 'Selecting premium blooms, stem trimming, and deep hydration conditioning'
  },
  {
    id: 'crafting',
    stepNum: 3,
    labelVi: '3. Chế Tác & Đóng Dấu Sáp',
    labelEn: '3. Floral Crafting & Wax Seal',
    shortVi: 'Đang chế tác',
    descVi: 'Nghệ nhân cắm hoa thủ công theo cấu trúc và niêm phong thiệp dấu sáp',
    descEn: 'Master florist crafting the arrangement and hand-stamping the wax seal card'
  },
  {
    id: 'quality_check',
    stepNum: 4,
    labelVi: '4. Nghiệm Thu Ảnh Thực Tế',
    labelEn: '4. Pre-Delivery Photo QC',
    shortVi: 'Nghiệm thu ảnh',
    descVi: 'Kiểm định form dáng, chụp ảnh tác phẩm hoàn thiện tại xưởng gửi khách xem',
    descEn: 'Final quality inspection and studio photography of your finished piece'
  },
  {
    id: 'delivering',
    stepNum: 5,
    labelVi: '5. Đóng Gói & Đang Giao',
    labelEn: '5. Hydration Wrap & Dispatch',
    shortVi: 'Đang giao',
    descVi: 'Bọc giữ ẩm gốc hoa, đính kèm hướng dẫn chăm sóc và vận chuyển tận nơi',
    descEn: 'Hydration root wrapping, care guide attachment, and courier dispatch'
  },
  {
    id: 'completed',
    stepNum: 6,
    labelVi: '6. Trao Tận Tay Hoàn Tất',
    labelEn: '6. Delivered & Completed',
    shortVi: 'Hoàn tất',
    descVi: 'Tác phẩm đã được trao tận tay người nhận trọn vẹn cảm xúc',
    descEn: 'Successfully delivered to the recipient'
  }
];

export interface BespokeOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  flowerId?: string;
  flowerName?: string;
  flowerImage?: string;
  moodboardItems?: string[];
  occasion: string;
  deliveryDate: string;
  deliveryTimeSlot?: string;
  district: string;
  budgetVnd: number;
  notes: string;
  giftCard?: WaxSealGiftCard;
  status: OrderStatus;
  assignedFlorist?: string;
  finishedPhotoUrl?: string;
  workflowChecklist?: OrderWorkflowChecklist;
  workflowHistory?: OrderWorkflowLog[];
  substitutionPolicy?: 'allow_equivalent' | 'strict_confirm' | 'designer_choice';
  suppliesDeducted?: boolean;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkshopBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface WorkshopBooking {
  id: string;
  bookingCode: string;
  workshopId: string;
  workshopName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  companyName?: string;
  participantsCount: number;
  preferredDate: string;
  locationType: string;
  notes: string;
  status: WorkshopBookingStatus;
  createdAt: string;
  updatedAt: string;
}

interface AtelierContextType {
  flowers: FlowerItem[];
  workshops: WorkshopItem[];
  atelierData: typeof ATELIER_DATA;
  logoUrl: string | null;
  logoWhiteUrl: string | null;
  isAdmin: boolean;
  adminPassword?: string;
  isCloudConnected: boolean;
  isSyncing: boolean;
  // Wishlist / Personal Botanical Moodboard
  wishlistIds: string[];
  toggleWishlist: (flowerId: string) => void;
  isInWishlist: (flowerId: string) => boolean;
  clearWishlist: () => void;
  // Real-time Orders & Workshop Bookings
  orders: BespokeOrder[];
  workshopBookings: WorkshopBooking[];
  supplies: SupplyItem[];
  createOrder: (
    orderData: Omit<BespokeOrder, 'id' | 'orderCode' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<BespokeOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNote?: string) => Promise<void>;
  updateOrderWorkflow: (
    orderId: string,
    updates: Partial<
      Pick<
        BespokeOrder,
        | 'status'
        | 'adminNote'
        | 'assignedFlorist'
        | 'finishedPhotoUrl'
        | 'deliveryTimeSlot'
        | 'workflowChecklist'
        | 'workflowHistory'
        | 'substitutionPolicy'
        | 'suppliesDeducted'
      >
    >
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  // Atelier Supply & Tool Inventory CRUD
  addSupply: (item: Omit<SupplyItem, 'id' | 'updatedAt'>) => Promise<void>;
  updateSupply: (id: string, updates: Partial<SupplyItem>) => Promise<void>;
  adjustSupplyStock: (id: string, delta: number) => Promise<void>;
  deleteSupply: (id: string) => Promise<void>;
  deductOrderSupplies: (orderId: string) => Promise<void>;
  createWorkshopBooking: (
    bookingData: Omit<WorkshopBooking, 'id' | 'bookingCode' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<WorkshopBooking>;
  updateWorkshopBookingStatus: (bookingId: string, status: WorkshopBookingStatus) => Promise<void>;
  deleteWorkshopBooking: (bookingId: string) => Promise<void>;
  // Auth & Catalog CRUD
  login: (password: string) => boolean;
  logout: () => void;
  changeAdminPassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; message: string }>;
  addFlower: (flower: Omit<FlowerItem, 'id' | 'indexNumber'>) => Promise<void>;
  updateFlower: (id: string, flower: Partial<FlowerItem>) => Promise<void>;
  deleteFlower: (id: string) => Promise<void>;
  togglePinFlower: (id: string) => Promise<void>;
  addWorkshop: (workshop: Omit<WorkshopItem, 'id' | 'indexNumber'>) => Promise<void>;
  updateWorkshop: (id: string, workshop: Partial<WorkshopItem>) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;
  updateAtelierData: (data: Partial<typeof ATELIER_DATA>) => Promise<void>;
  updateLogoUrl: (url: string | null) => Promise<void>;
  updateLogoWhiteUrl: (url: string | null) => Promise<void>;
  syncAllToCloud: () => Promise<void>;
  resetAllData: () => Promise<void>;
  exportBackupJson: () => void;
  importBackupJson: (jsonText: string) => Promise<{ success: boolean; message: string }>;
}

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FLOWERS: 'juet_flowers_data_v2',
  WORKSHOPS: 'juet_workshops_data_v2',
  ATELIER: 'juet_atelier_data_v2',
  LOGO: 'juet_logo_url_v2',
  LOGO_WHITE: 'juet_logo_white_url_v2',
  AUTH: 'juet_admin_authenticated',
  PASS: 'juet_admin_password_v2',
  WISHLIST: 'juet_moodboard_wishlist_v1',
  ORDERS: 'juet_orders_cache_v1',
  BOOKINGS: 'juet_workshop_bookings_cache_v1',
  SUPPLIES: 'juet_supplies_cache_v1'
};

// Safe localStorage helpers to prevent QuotaExceededError from crashing React
function safeGetStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`Unable to read localStorage key "${key}":`, e);
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // QuotaExceededError can happen when base64 WebP images exceed 5MB localStorage limit.
    // Firestore holds the full data, so we safely ignore localStorage quota errors.
    console.warn(`localStorage quota reached for "${key}", relying on Firestore & in-memory state.`);
  }
}

function safeRemoveStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Unable to remove localStorage key "${key}":`, e);
  }
}

// Safely strip undefined values recursively before writing to Firestore (Firestore rejects undefined values)
function stripUndefined<T>(val: T): T {
  if (Array.isArray(val)) {
    return val
      .filter((item) => item !== undefined)
      .map((item) => stripUndefined(item)) as unknown as T;
  }
  if (val !== null && typeof val === 'object') {
    const cleaned: Record<string, unknown> = {};
    Object.entries(val as Record<string, unknown>).forEach(([k, v]) => {
      if (v !== undefined) {
        cleaned[k] = stripUndefined(v);
      }
    });
    return cleaned as T;
  }
  return val;
}

// Normalize a flower item so missing fields never cause runtime crashes and all titles are synchronized
function normalizeFlower(item: Partial<FlowerItem>, idx: number): FlowerItem {
  const fallback = FLOWERS.find((f) => f.id === item.id) || FLOWERS[idx % FLOWERS.length] || FLOWERS[0];
  const validGallery = Array.isArray(item.galleryImages)
    ? item.galleryImages.filter((g) => g && typeof g.url === 'string' && g.url.trim().length > 0)
    : [];
  const primaryImage =
    (item.image && item.image.trim()) ||
    (validGallery[0]?.url && validGallery[0].url.trim()) ||
    fallback.image;
  const rawMaterials = Array.isArray(item.materials) ? item.materials.filter(Boolean) : fallback.materials;
  const rawMaterialsVi = Array.isArray(item.materialsVi) ? item.materialsVi.filter(Boolean) : fallback.materialsVi;
  const rawGallery =
    validGallery.length > 0
      ? validGallery
      : fallback.galleryImages && fallback.galleryImages.length > 0
        ? fallback.galleryImages
        : [{ url: primaryImage, captionVi: 'Góc nhìn toàn cảnh', captionEn: 'Full architectural view' }];

  return {
    ...fallback,
    ...item,
    id: item.id || fallback.id || `flower-${idx + 1}`,
    indexNumber: item.indexNumber || String(idx + 1).padStart(2, '0'),
    name: formatDisplayUppercase(item.name || fallback.name),
    vietnameseName: formatTitleCase(item.vietnameseName || item.name || fallback.vietnameseName),
    latinName: formatBotanicalLatin(item.latinName || fallback.latinName),
    category: item.category || fallback.category,
    categoryLabelEn: formatTitleCase(item.categoryLabelEn || fallback.categoryLabelEn),
    categoryLabelVi: formatTitleCase(item.categoryLabelVi || fallback.categoryLabelVi),
    shortDescriptionEn: formatProseNFC(item.shortDescriptionEn || fallback.shortDescriptionEn),
    shortDescriptionVi: formatProseNFC(item.shortDescriptionVi || fallback.shortDescriptionVi),
    storyEn: formatProseNFC(item.storyEn || fallback.storyEn),
    storyVi: formatProseNFC(item.storyVi || fallback.storyVi),
    botanicalNotesEn: formatProseNFC(item.botanicalNotesEn || fallback.botanicalNotesEn),
    botanicalNotesVi: formatProseNFC(item.botanicalNotesVi || fallback.botanicalNotesVi),
    materials: rawMaterials.map((m) => formatTitleCase(String(m))),
    materialsVi: rawMaterialsVi.map((m) => formatTitleCase(String(m))),
    scent:
      item.scent && typeof item.scent === 'object'
        ? {
            ...fallback.scent,
            ...item.scent,
            top: formatTitleCase(item.scent.top || fallback.scent.top),
            heart: formatTitleCase(item.scent.heart || fallback.scent.heart),
            base: formatTitleCase(item.scent.base || fallback.scent.base),
            mood: formatTitleCase(item.scent.mood || fallback.scent.mood)
          }
        : fallback.scent,
    anatomy: Array.isArray(item.anatomy) ? item.anatomy.filter(Boolean) : fallback.anatomy,
    dimensions: normalizeUnicodeNFC(item.dimensions || fallback.dimensions),
    seasonality: normalizeUnicodeNFC(item.seasonality || fallback.seasonality),
    priceVnd: typeof item.priceVnd === 'number' && !Number.isNaN(item.priceVnd) ? item.priceVnd : fallback.priceVnd,
    priceUsd: typeof item.priceUsd === 'number' && !Number.isNaN(item.priceUsd) ? item.priceUsd : fallback.priceUsd,
    image: primaryImage,
    galleryImages: rawGallery.map((g) => ({
      url: g.url || primaryImage,
      captionVi: formatProseNFC(g.captionVi || 'Góc nhìn nghệ thuật'),
      captionEn: formatProseNFC(g.captionEn || 'Artistic perspective')
    })),
    audioFrequency: typeof item.audioFrequency === 'number' ? item.audioFrequency : fallback.audioFrequency,
    pinnedToLanding: item.pinnedToLanding !== undefined ? item.pinnedToLanding : true,
    availabilityStatus:
      item.availabilityStatus ||
      (item.category === 'bridal' || item.category === 'installation' ? 'preorder_24h' : 'ready_today'),
    prepLeadTimeHours:
      typeof item.prepLeadTimeHours === 'number'
        ? item.prepLeadTimeHours
        : item.category === 'bridal' || item.category === 'installation'
          ? 24
          : 4
  };
}

// Normalize a workshop item so missing fields never cause runtime crashes and all titles are synchronized
function normalizeWorkshop(item: Partial<WorkshopItem>, idx: number): WorkshopItem {
  const fallback = WORKSHOPS.find((w) => w.id === item.id) || WORKSHOPS[idx % WORKSHOPS.length] || WORKSHOPS[0];
  const validGallery = Array.isArray(item.galleryImages)
    ? item.galleryImages.filter((g) => g && typeof g.url === 'string' && g.url.trim().length > 0)
    : [];
  const primaryImage =
    (item.image && item.image.trim()) ||
    (validGallery[0]?.url && validGallery[0].url.trim()) ||
    fallback.image;
  const rawGallery =
    validGallery.length > 0
      ? validGallery
      : fallback.galleryImages && fallback.galleryImages.length > 0
        ? fallback.galleryImages
        : [{ url: primaryImage, captionVi: 'Không gian Workshop nghệ thuật', captionEn: 'Artistic workshop atmosphere' }];

  return {
    ...fallback,
    ...item,
    id: item.id || fallback.id || `workshop-${idx + 1}`,
    indexNumber: item.indexNumber || String(idx + 1).padStart(2, '0'),
    name: formatDisplayUppercase(item.name || fallback.name),
    latinMonographName: formatTitleCase(item.latinMonographName || fallback.latinMonographName),
    titleVi: formatTitleCase(item.titleVi || fallback.titleVi),
    titleEn: formatTitleCase(item.titleEn || fallback.titleEn),
    subtitleVi: formatProseNFC(item.subtitleVi || fallback.subtitleVi),
    subtitleEn: formatProseNFC(item.subtitleEn || fallback.subtitleEn),
    editorialQuoteVi: formatProseNFC(item.editorialQuoteVi || fallback.editorialQuoteVi),
    editorialQuoteEn: formatProseNFC(item.editorialQuoteEn || fallback.editorialQuoteEn),
    descriptionVi: formatProseNFC(item.descriptionVi || fallback.descriptionVi),
    descriptionEn: formatProseNFC(item.descriptionEn || fallback.descriptionEn),
    fullContentVi: (Array.isArray(item.fullContentVi) ? item.fullContentVi.filter(Boolean) : fallback.fullContentVi).map((p) =>
      formatProseNFC(String(p))
    ),
    fullContentEn: (Array.isArray(item.fullContentEn) ? item.fullContentEn.filter(Boolean) : fallback.fullContentEn).map((p) =>
      formatProseNFC(String(p))
    ),
    highlightsVi: (Array.isArray(item.highlightsVi) ? item.highlightsVi.filter(Boolean) : fallback.highlightsVi).map((h) =>
      formatProseNFC(String(h))
    ),
    highlightsEn: (Array.isArray(item.highlightsEn) ? item.highlightsEn.filter(Boolean) : fallback.highlightsEn).map((h) =>
      formatProseNFC(String(h))
    ),
    duration: normalizeUnicodeNFC(item.duration || fallback.duration),
    groupSize: normalizeUnicodeNFC(item.groupSize || fallback.groupSize),
    locationVi: normalizeUnicodeNFC(item.locationVi || fallback.locationVi),
    locationEn: normalizeUnicodeNFC(item.locationEn || fallback.locationEn),
    pricePerPaxVnd:
      typeof item.pricePerPaxVnd === 'number' && !Number.isNaN(item.pricePerPaxVnd)
        ? item.pricePerPaxVnd
        : fallback.pricePerPaxVnd,
    pricePerPaxUsd:
      typeof item.pricePerPaxUsd === 'number' && !Number.isNaN(item.pricePerPaxUsd)
        ? item.pricePerPaxUsd
        : fallback.pricePerPaxUsd,
    zaloCommunityUrl: item.zaloCommunityUrl || fallback.zaloCommunityUrl,
    hotline: item.hotline || fallback.hotline,
    image: primaryImage,
    galleryImages: rawGallery.map((g) => ({
      url: g.url || primaryImage,
      captionVi: formatProseNFC(g.captionVi || 'Không gian Workshop'),
      captionEn: formatProseNFC(g.captionEn || 'Workshop moment')
    }))
  };
}

export const AtelierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flowers, setFlowers] = useState<FlowerItem[]>(() => {
    const saved =
      safeGetStorage(STORAGE_KEYS.FLOWERS) ||
      safeGetStorage('juet_flowers_data') ||
      safeGetStorage('juet_flowers_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => normalizeFlower(item, idx));
        }
      } catch (e) {
        console.error('Failed to parse saved flowers', e);
      }
    }
    return FLOWERS.map((item, idx) => normalizeFlower(item, idx));
  });

  const [workshops, setWorkshops] = useState<WorkshopItem[]>(() => {
    const saved =
      safeGetStorage(STORAGE_KEYS.WORKSHOPS) ||
      safeGetStorage('juet_workshops_data') ||
      safeGetStorage('juet_workshops_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => normalizeWorkshop(item, idx));
        }
      } catch (e) {
        console.error('Failed to parse saved workshops', e);
      }
    }
    return WORKSHOPS.map((item, idx) => normalizeWorkshop(item, idx));
  });

  const [atelierData, setAtelierData] = useState<typeof ATELIER_DATA>(() => {
    const saved =
      safeGetStorage(STORAGE_KEYS.ATELIER) ||
      safeGetStorage('juet_atelier_data') ||
      safeGetStorage('juet_atelier_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...ATELIER_DATA, ...parsed };
        }
      } catch (e) {
        console.error('Failed to parse saved atelier data', e);
      }
    }
    return ATELIER_DATA;
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    return safeGetStorage(STORAGE_KEYS.LOGO) || safeGetStorage('juet_logo_url');
  });

  const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(() => {
    return safeGetStorage(STORAGE_KEYS.LOGO_WHITE) || safeGetStorage('juet_logo_white_url');
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return safeGetStorage(STORAGE_KEYS.AUTH) === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return safeGetStorage(STORAGE_KEYS.PASS) || 'juetsaigon2026';
  });

  // Personal Botanical Moodboard (Wishlist)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = safeGetStorage(STORAGE_KEYS.WISHLIST);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Real-time Bespoke Orders & Workshop Bookings
  const [orders, setOrders] = useState<BespokeOrder[]>(() => {
    const saved = safeGetStorage(STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [workshopBookings, setWorkshopBookings] = useState<WorkshopBooking[]>(() => {
    const saved = safeGetStorage(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [supplies, setSupplies] = useState<SupplyItem[]>(() => {
    const saved = safeGetStorage(STORAGE_KEYS.SUPPLIES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return DEFAULT_SUPPLIES;
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isInitialCloudSyncDone = useRef<boolean>(false);

  // Sync state to localStorage for offline resilience (Protected against QuotaExceededError)
  useEffect(() => {
    if (flowers.length > 0) {
      safeSetStorage(STORAGE_KEYS.FLOWERS, JSON.stringify(flowers));
    }
  }, [flowers]);

  useEffect(() => {
    if (workshops.length > 0) {
      safeSetStorage(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
    }
  }, [workshops]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.ATELIER, JSON.stringify(atelierData));
  }, [atelierData]);

  useEffect(() => {
    if (logoUrl) {
      safeSetStorage(STORAGE_KEYS.LOGO, logoUrl);
    } else {
      safeRemoveStorage(STORAGE_KEYS.LOGO);
    }
  }, [logoUrl]);

  useEffect(() => {
    if (logoWhiteUrl) {
      safeSetStorage(STORAGE_KEYS.LOGO_WHITE, logoWhiteUrl);
    } else {
      safeRemoveStorage(STORAGE_KEYS.LOGO_WHITE);
    }
  }, [logoWhiteUrl]);

  useEffect(() => {
    if (adminPassword) {
      safeSetStorage(STORAGE_KEYS.PASS, adminPassword);
    }
  }, [adminPassword]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.BOOKINGS, JSON.stringify(workshopBookings));
  }, [workshopBookings]);

  useEffect(() => {
    if (supplies.length > 0) {
      safeSetStorage(STORAGE_KEYS.SUPPLIES, JSON.stringify(supplies));
    }
  }, [supplies]);

  // Firestore Realtime Subscription
  useEffect(() => {
    let unsubscribeFlowers: (() => void) | null = null;
    let unsubscribeWorkshops: (() => void) | null = null;
    let unsubscribeSettings: (() => void) | null = null;
    let unsubscribeSecurity: (() => void) | null = null;
    let unsubscribeOrders: (() => void) | null = null;
    let unsubscribeBookings: (() => void) | null = null;
    let unsubscribeSupplies: (() => void) | null = null;

    const setupFirestoreSync = async () => {
      try {
        const connected = await testFirestoreConnection();
        setIsCloudConnected(connected);

        // 1. Listen to Flowers Collection
        const flowersCollectionRef = collection(db, 'flowers');
        unsubscribeFlowers = onSnapshot(
          flowersCollectionRef,
          (snapshot) => {
            setIsCloudConnected(true);
            if (!snapshot.empty) {
              const rawFlowers: Partial<FlowerItem>[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Partial<FlowerItem>;
                rawFlowers.push({ ...data, id: docSnap.id });
              });
              rawFlowers.sort((a, b) => {
                const aCustom = String(a.id || '').startsWith('flower-') ? 0 : 1;
                const bCustom = String(b.id || '').startsWith('flower-') ? 0 : 1;
                const idxCompare = (a.indexNumber || '').localeCompare(b.indexNumber || '');
                if (idxCompare !== 0) return idxCompare;
                return aCustom - bCustom;
              });
              setFlowers(rawFlowers.map((item, idx) => normalizeFlower(item, idx)));
            } else if (!isInitialCloudSyncDone.current) {
              seedInitialDataToCloud();
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'flowers');
            } catch {
              // Keep local fallback data rendered if cloud read fails
            }
          }
        );

        // 2. Listen to Workshops Collection
        const workshopsCollectionRef = collection(db, 'workshops');
        unsubscribeWorkshops = onSnapshot(
          workshopsCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const rawWorkshops: Partial<WorkshopItem>[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Partial<WorkshopItem>;
                rawWorkshops.push({ ...data, id: docSnap.id });
              });
              rawWorkshops.sort((a, b) => (a.indexNumber || '').localeCompare(b.indexNumber || ''));
              setWorkshops(rawWorkshops.map((item, idx) => normalizeWorkshop(item, idx)));
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'workshops');
            } catch {
              // Keep local fallback data rendered
            }
          }
        );

        // 3. Listen to Atelier Settings Document
        const settingsDocRef = doc(db, 'settings', 'atelier');
        unsubscribeSettings = onSnapshot(
          settingsDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const { logoUrl: cloudLogo, logoWhiteUrl: cloudLogoWhite, ...restSettings } = data;
              setAtelierData((prev) => ({ ...ATELIER_DATA, ...prev, ...restSettings }));
              if (cloudLogo !== undefined) {
                setLogoUrl(cloudLogo);
              }
              if (cloudLogoWhite !== undefined) {
                setLogoWhiteUrl(cloudLogoWhite);
              }
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'settings/atelier');
            } catch {
              // Keep local fallback data rendered
            }
          }
        );

        // 4. Listen to Security Settings Document (Admin Password purely from Firestore)
        const securityDocRef = doc(db, 'settings', 'security');
        unsubscribeSecurity = onSnapshot(
          securityDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.adminPassword) {
                setAdminPassword(data.adminPassword);
              }
            } else {
              // Initialize default security document in Firestore if not yet created
              setDoc(
                securityDocRef,
                {
                  adminPassword: safeGetStorage(STORAGE_KEYS.PASS) || 'juetsaigon2026',
                  updatedAt: new Date().toISOString(),
                  updatedBy: 'system'
                },
                { merge: true }
              ).catch(() => {});
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'settings/security');
            } catch {
              // Ignore
            }
          }
        );

        // 5. Listen to Bespoke Orders Collection
        const ordersCollectionRef = collection(db, 'orders');
        unsubscribeOrders = onSnapshot(
          ordersCollectionRef,
          (snapshot) => {
            const rawOrders: BespokeOrder[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as BespokeOrder;
              rawOrders.push({ ...data, id: docSnap.id });
            });
            rawOrders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
            setOrders(rawOrders);
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'orders');
            } catch {
              // Keep local fallback
            }
          }
        );

        // 6. Listen to Workshop Bookings Collection
        const bookingsCollectionRef = collection(db, 'workshop_bookings');
        unsubscribeBookings = onSnapshot(
          bookingsCollectionRef,
          (snapshot) => {
            const rawBookings: WorkshopBooking[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as WorkshopBooking;
              rawBookings.push({ ...data, id: docSnap.id });
            });
            rawBookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
            setWorkshopBookings(rawBookings);
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'workshop_bookings');
            } catch {
              // Keep local fallback
            }
          }
        );

        // 7. Listen to Atelier Supplies & Tools Inventory Collection
        const suppliesCollectionRef = collection(db, 'supplies');
        unsubscribeSupplies = onSnapshot(
          suppliesCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const rawSupplies: SupplyItem[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as SupplyItem;
                rawSupplies.push({ ...data, id: docSnap.id });
              });
              rawSupplies.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''));
              setSupplies(rawSupplies);
            } else {
              // Auto-seed default luxury floral supplies to Firestore if empty
              const supplyBatch = writeBatch(db);
              DEFAULT_SUPPLIES.forEach((sup) => {
                supplyBatch.set(doc(db, 'supplies', sup.id), stripUndefined(sup));
              });
              supplyBatch.commit().catch(() => {});
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, 'supplies');
            } catch {
              // Keep local fallback
            }
          }
        );
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    };

    setupFirestoreSync();

    return () => {
      if (unsubscribeFlowers) unsubscribeFlowers();
      if (unsubscribeWorkshops) unsubscribeWorkshops();
      if (unsubscribeSettings) unsubscribeSettings();
      if (unsubscribeSecurity) unsubscribeSecurity();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeSupplies) unsubscribeSupplies();
    };
  }, []);

  // Seed default data if database is fresh
  const seedInitialDataToCloud = async () => {
    if (isInitialCloudSyncDone.current) return;
    isInitialCloudSyncDone.current = true;
    try {
      setIsSyncing(true);
      const batch = writeBatch(db);

      // Seed flowers
      FLOWERS.forEach((flower, idx) => {
        const flowerRef = doc(db, 'flowers', flower.id);
        batch.set(
          flowerRef,
          stripUndefined({
            ...flower,
            pinnedToLanding: idx < 12,
            updatedAt: new Date().toISOString()
          })
        );
      });

      // Seed workshops
      WORKSHOPS.forEach((workshop) => {
        const workshopRef = doc(db, 'workshops', workshop.id);
        batch.set(
          workshopRef,
          stripUndefined({
            ...workshop,
            updatedAt: new Date().toISOString()
          })
        );
      });

      // Seed atelier settings
      const settingsRef = doc(db, 'settings', 'atelier');
      batch.set(
        settingsRef,
        stripUndefined({
          ...ATELIER_DATA,
          logoUrl: null,
          logoWhiteUrl: null,
          updatedAt: new Date().toISOString()
        })
      );

      await batch.commit();
      console.log('Successfully seeded initial atelier catalog to Firebase Firestore.');
    } catch (error) {
      console.error('Error seeding initial data to Firestore:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual Force Full Sync to Cloud
  const syncAllToCloud = async () => {
    setIsSyncing(true);
    try {
      const batch = writeBatch(db);

      flowers.forEach((flower) => {
        const flowerRef = doc(db, 'flowers', flower.id);
        batch.set(
          flowerRef,
          stripUndefined({
            ...flower,
            updatedAt: new Date().toISOString()
          })
        );
      });

      workshops.forEach((workshop) => {
        const workshopRef = doc(db, 'workshops', workshop.id);
        batch.set(
          workshopRef,
          stripUndefined({
            ...workshop,
            updatedAt: new Date().toISOString()
          })
        );
      });

      const settingsRef = doc(db, 'settings', 'atelier');
      batch.set(
        settingsRef,
        stripUndefined({
          ...atelierData,
          logoUrl,
          logoWhiteUrl,
          updatedAt: new Date().toISOString()
        })
      );

      if (adminPassword) {
        const securityRef = doc(db, 'settings', 'security');
        batch.set(
          securityRef,
          stripUndefined({
            adminPassword,
            updatedAt: new Date().toISOString(),
            updatedBy: 'admin'
          })
        );
      }

      await batch.commit();
      setIsCloudConnected(true);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'syncAllToCloud');
      } catch {
        // Keep local state intact
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Strict Authentication directly against Firebase synced password
  const login = (password: string): boolean => {
    const trimmed = password.trim();
    if (adminPassword && trimmed === adminPassword) {
      setIsAdmin(true);
      safeSetStorage(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    safeRemoveStorage(STORAGE_KEYS.AUTH);
  };

  // Change Admin Password and Sync to Firebase
  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!adminPassword || currentPass.trim() !== adminPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
    }

    const cleanNewPass = newPass.trim();
    setAdminPassword(cleanNewPass);
    safeSetStorage(STORAGE_KEYS.PASS, cleanNewPass);

    try {
      const securityDocRef = doc(db, 'settings', 'security');
      await setDoc(
        securityDocRef,
        {
          adminPassword: cleanNewPass,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin'
        },
        { merge: true }
      );
      return {
        success: true,
        message: 'Đã cập nhật mật khẩu mới lên Firebase Firestore thành công!'
      };
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'settings/security');
      } catch {
        // Fallback notice
      }
      return {
        success: true,
        message: 'Đã lưu mật khẩu cục bộ và đang đồng bộ lên Firebase.'
      };
    }
  };

  // Flower CRUD with Firestore Persistence
  const addFlower = async (flowerData: Omit<FlowerItem, 'id' | 'indexNumber'>) => {
    const newId = `flower-${Date.now()}`;
    const newFlower: FlowerItem = normalizeFlower(
      {
        ...flowerData,
        id: newId,
        indexNumber: '01',
        pinnedToLanding: flowerData.pinnedToLanding !== false
      },
      0
    );

    const updatedList = [
      newFlower,
      ...flowers.map((f, idx) => ({
        ...f,
        indexNumber: String(idx + 2).padStart(2, '0')
      }))
    ];
    setFlowers(updatedList);

    try {
      const batch = writeBatch(db);
      updatedList.forEach((f) => {
        batch.set(
          doc(db, 'flowers', f.id),
          stripUndefined({
            ...f,
            updatedAt: new Date().toISOString()
          }),
          { merge: true }
        );
      });
      await batch.commit();
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `flowers/${newId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const updateFlower = async (id: string, updatedFields: Partial<FlowerItem>) => {
    const existingIdx = flowers.findIndex((f) => f.id === id);
    const existingFlower = existingIdx >= 0 ? flowers[existingIdx] : FLOWERS[0];
    const normalizedUpdated = normalizeFlower(
      { ...existingFlower, ...updatedFields, id },
      existingIdx >= 0 ? existingIdx : 0
    );

    setFlowers((prev) =>
      prev.map((f, idx) => (f.id === id ? normalizeFlower({ ...f, ...updatedFields }, idx) : f))
    );

    try {
      await setDoc(
        doc(db, 'flowers', id),
        stripUndefined({ ...normalizedUpdated, updatedAt: new Date().toISOString() }),
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `flowers/${id}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const deleteFlower = async (id: string) => {
    setFlowers((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      return filtered.map((item, idx) => ({
        ...item,
        indexNumber: String(idx + 1).padStart(2, '0')
      }));
    });

    try {
      await deleteDoc(doc(db, 'flowers', id));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `flowers/${id}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const togglePinFlower = async (id: string) => {
    const targetFlower = flowers.find((f) => f.id === id);
    const newPinned = targetFlower ? !targetFlower.pinnedToLanding : true;

    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, pinnedToLanding: newPinned } : f))
    );

    try {
      await setDoc(
        doc(db, 'flowers', id),
        { pinnedToLanding: newPinned, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `flowers/${id}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  // Workshop CRUD with Firestore Persistence
  const addWorkshop = async (workshopData: Omit<WorkshopItem, 'id' | 'indexNumber'>) => {
    const nextIdx = String(workshops.length + 1).padStart(2, '0');
    const newId = `workshop-${Date.now()}`;
    const newWorkshop: WorkshopItem = normalizeWorkshop(
      {
        ...workshopData,
        id: newId,
        indexNumber: nextIdx
      },
      workshops.length
    );

    setWorkshops((prev) => [...prev, newWorkshop]);

    try {
      await setDoc(
        doc(db, 'workshops', newId),
        stripUndefined({
          ...newWorkshop,
          updatedAt: new Date().toISOString()
        })
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `workshops/${newId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const updateWorkshop = async (id: string, updatedFields: Partial<WorkshopItem>) => {
    const existingIdx = workshops.findIndex((w) => w.id === id);
    const existingWorkshop = existingIdx >= 0 ? workshops[existingIdx] : WORKSHOPS[0];
    const normalizedUpdated = normalizeWorkshop(
      { ...existingWorkshop, ...updatedFields, id },
      existingIdx >= 0 ? existingIdx : 0
    );

    setWorkshops((prev) =>
      prev.map((w, idx) => (w.id === id ? normalizeWorkshop({ ...w, ...updatedFields }, idx) : w))
    );

    try {
      await setDoc(
        doc(db, 'workshops', id),
        stripUndefined({ ...normalizedUpdated, updatedAt: new Date().toISOString() }),
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `workshops/${id}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const deleteWorkshop = async (id: string) => {
    setWorkshops((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      return filtered.map((item, idx) => ({
        ...item,
        indexNumber: String(idx + 1).padStart(2, '0')
      }));
    });

    try {
      await deleteDoc(doc(db, 'workshops', id));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `workshops/${id}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  // Atelier Brand Settings
  const updateAtelierData = async (data: Partial<typeof ATELIER_DATA>) => {
    setAtelierData((prev) => ({ ...prev, ...data }));

    try {
      await setDoc(
        doc(db, 'settings', 'atelier'),
        stripUndefined({ ...data, updatedAt: new Date().toISOString() }),
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const updateLogoUrl = async (url: string | null) => {
    setLogoUrl(url);

    try {
      await setDoc(
        doc(db, 'settings', 'atelier'),
        { logoUrl: url, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const updateLogoWhiteUrl = async (url: string | null) => {
    setLogoWhiteUrl(url);

    try {
      await setDoc(
        doc(db, 'settings', 'atelier'),
        { logoWhiteUrl: url, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
      } catch {
        // Keep local optimistic state
      }
    }
  };

  // Wishlist / Personal Botanical Moodboard Handlers
  const toggleWishlist = (flowerId: string) => {
    setWishlistIds((prev) =>
      prev.includes(flowerId) ? prev.filter((id) => id !== flowerId) : [...prev, flowerId]
    );
  };

  const isInWishlist = (flowerId: string): boolean => {
    return wishlistIds.includes(flowerId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  // Bespoke Order CRUD with Firestore Persistence
  const createOrder = async (
    orderData: Omit<BespokeOrder, 'id' | 'orderCode' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<BespokeOrder> => {
    const now = new Date();
    const dateStamp = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randDigits = String(Math.floor(100 + Math.random() * 900));
    const orderCode = `JU-${dateStamp}-${randDigits}`;
    const newId = `order-${Date.now()}`;
    const isoNow = now.toISOString();

    const newOrder: BespokeOrder = stripUndefined({
      ...orderData,
      id: newId,
      orderCode,
      status: 'pending',
      deliveryTimeSlot: orderData.deliveryTimeSlot || '08:30 – 11:30 (Sáng)',
      workflowChecklist: { ...DEFAULT_WORKFLOW_CHECKLIST },
      workflowHistory: [
        {
          stage: 'pending',
          timestamp: isoNow,
          note: 'Đơn hàng được khởi tạo trên hệ thống Atelier'
        }
      ],
      createdAt: isoNow,
      updatedAt: isoNow
    });

    setOrders((prev) => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', newId), newOrder);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `orders/${newId}`);
      } catch {
        // Keep local optimistic state if offline
      }
    }

    return newOrder;
  };

  const updateOrderWorkflow = async (
    orderId: string,
    updates: Partial<
      Pick<
        BespokeOrder,
        | 'status'
        | 'adminNote'
        | 'assignedFlorist'
        | 'finishedPhotoUrl'
        | 'deliveryTimeSlot'
        | 'workflowChecklist'
        | 'workflowHistory'
        | 'substitutionPolicy'
        | 'suppliesDeducted'
      >
    >
  ) => {
    const isoNow = new Date().toISOString();
    const targetOrder = orders.find((o) => o.id === orderId);
    const currentChecklist: OrderWorkflowChecklist = {
      ...DEFAULT_WORKFLOW_CHECKLIST,
      ...(targetOrder?.workflowChecklist || {}),
      ...(updates.workflowChecklist || {})
    };

    // Auto-sync checklist flags when advancing stages or uploading QC photo
    if (updates.finishedPhotoUrl) {
      currentChecklist.qcPhotoUploaded = true;
    }
    if (updates.status === 'conditioning') {
      currentChecklist.stemsConditioned = true;
    } else if (updates.status === 'crafting') {
      currentChecklist.stemsConditioned = true;
      currentChecklist.vesselPrepared = true;
    } else if (updates.status === 'quality_check') {
      currentChecklist.stemsConditioned = true;
      currentChecklist.vesselPrepared = true;
      currentChecklist.arrangementCrafted = true;
      if (targetOrder?.giftCard?.enabled) {
        currentChecklist.waxSealCardAttached = true;
      }
    } else if (updates.status === 'delivering') {
      currentChecklist.stemsConditioned = true;
      currentChecklist.vesselPrepared = true;
      currentChecklist.arrangementCrafted = true;
      currentChecklist.hydrationWrapped = true;
    } else if (updates.status === 'completed') {
      currentChecklist.stemsConditioned = true;
      currentChecklist.vesselPrepared = true;
      currentChecklist.arrangementCrafted = true;
      currentChecklist.hydrationWrapped = true;
    }

    const existingHistory = Array.isArray(targetOrder?.workflowHistory)
      ? targetOrder!.workflowHistory!
      : [];
    const shouldAppendHistory =
      updates.status && updates.status !== targetOrder?.status;
    const stageMeta = ORDER_WORKFLOW_STAGES.find((s) => s.id === updates.status);
    const updatedHistory: OrderWorkflowLog[] = shouldAppendHistory
      ? [
          ...existingHistory,
          {
            stage: updates.status!,
            timestamp: isoNow,
            note:
              updates.adminNote ||
              (stageMeta ? stageMeta.labelVi : `Chuyển trạng thái: ${updates.status}`)
          }
        ]
      : updates.workflowHistory || existingHistory;

    const payload = stripUndefined({
      ...updates,
      workflowChecklist: currentChecklist,
      workflowHistory: updatedHistory,
      updatedAt: isoNow
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...payload } : o))
    );

    try {
      await setDoc(doc(db, 'orders', orderId), payload, { merge: true });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, adminNote?: string) => {
    await updateOrderWorkflow(orderId, {
      status,
      ...(adminNote !== undefined ? { adminNote } : {})
    });
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  // Workshop Booking CRUD with Firestore Persistence
  const createWorkshopBooking = async (
    bookingData: Omit<WorkshopBooking, 'id' | 'bookingCode' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkshopBooking> => {
    const now = new Date();
    const dateStamp = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const randDigits = String(Math.floor(100 + Math.random() * 900));
    const bookingCode = `WS-${dateStamp}-${randDigits}`;
    const newId = `wsbooking-${Date.now()}`;
    const isoNow = now.toISOString();

    const newBooking: WorkshopBooking = stripUndefined({
      ...bookingData,
      id: newId,
      bookingCode,
      status: 'pending',
      createdAt: isoNow,
      updatedAt: isoNow
    });

    setWorkshopBookings((prev) => [newBooking, ...prev]);

    try {
      await setDoc(doc(db, 'workshop_bookings', newId), newBooking);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `workshop_bookings/${newId}`);
      } catch {
        // Keep local state if offline
      }
    }

    return newBooking;
  };

  const updateWorkshopBookingStatus = async (bookingId: string, status: WorkshopBookingStatus) => {
    const isoNow = new Date().toISOString();
    setWorkshopBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, updatedAt: isoNow } : b))
    );

    try {
      await setDoc(
        doc(db, 'workshop_bookings', bookingId),
        { status, updatedAt: isoNow },
        { merge: true }
      );
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `workshop_bookings/${bookingId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  const deleteWorkshopBooking = async (bookingId: string) => {
    setWorkshopBookings((prev) => prev.filter((b) => b.id !== bookingId));

    try {
      await deleteDoc(doc(db, 'workshop_bookings', bookingId));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `workshop_bookings/${bookingId}`);
      } catch {
        // Keep local optimistic state
      }
    }
  };

  // Atelier Supply & Tool Inventory CRUD with Real-time Firestore Persistence
  const addSupply = async (itemData: Omit<SupplyItem, 'id' | 'updatedAt'>) => {
    const newId = `sup-${Date.now()}`;
    const isoNow = new Date().toISOString();
    const newSupply: SupplyItem = stripUndefined({
      ...itemData,
      id: newId,
      currentStock: Math.max(0, Number(itemData.currentStock) || 0),
      minThreshold: Math.max(1, Number(itemData.minThreshold) || 1),
      unitCostVnd: Math.max(0, Number(itemData.unitCostVnd) || 0),
      peakBoostFactor: Math.max(1, Number(itemData.peakBoostFactor) || 1.5),
      updatedAt: isoNow
    });

    setSupplies((prev) => [...prev, newSupply]);

    try {
      await setDoc(doc(db, 'supplies', newId), newSupply);
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, `supplies/${newId}`);
      } catch {
        // Keep optimistic state
      }
    }
  };

  const updateSupply = async (id: string, updates: Partial<SupplyItem>) => {
    const isoNow = new Date().toISOString();
    const payload = stripUndefined({
      ...updates,
      updatedAt: isoNow
    });

    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...payload } : s))
    );

    try {
      await setDoc(doc(db, 'supplies', id), payload, { merge: true });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `supplies/${id}`);
      } catch {
        // Keep optimistic state
      }
    }
  };

  const adjustSupplyStock = async (id: string, delta: number) => {
    const target = supplies.find((s) => s.id === id);
    if (!target) return;
    const nextStock = Math.max(0, (target.currentStock || 0) + delta);
    await updateSupply(id, { currentStock: nextStock });
  };

  const deleteSupply = async (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'supplies', id));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.DELETE, `supplies/${id}`);
      } catch {
        // Keep optimistic state
      }
    }
  };

  // 1-Click Deduct Consumable Supplies for an Order (Vessel/Box + Wrapping + Hydration + Wax Seal if enabled)
  const deductOrderSupplies = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.suppliesDeducted) return;

    const isoNow = new Date().toISOString();
    // Pick 1 representative item from vessels, packaging, conditioning
    const vesselItem = supplies.find((s) => s.category === 'vessels' && s.currentStock > 0);
    const pkgItem = supplies.find((s) => s.category === 'packaging' && s.currentStock > 0);
    const condItem = supplies.find((s) => s.category === 'conditioning' && s.currentStock > 0);
    const stemItem = supplies.find((s) => s.category === 'stems' && s.currentStock > 0);

    const idsToDeduct = [vesselItem?.id, pkgItem?.id, condItem?.id, stemItem?.id].filter(
      Boolean
    ) as string[];

    setSupplies((prev) =>
      prev.map((s) =>
        idsToDeduct.includes(s.id)
          ? { ...s, currentStock: Math.max(0, s.currentStock - 1), updatedAt: isoNow }
          : s
      )
    );

    await updateOrderWorkflow(orderId, {
      suppliesDeducted: true,
      workflowChecklist: {
        ...DEFAULT_WORKFLOW_CHECKLIST,
        ...(targetOrder.workflowChecklist || {}),
        vesselPrepared: true
      }
    });

    try {
      const batch = writeBatch(db);
      idsToDeduct.forEach((supId) => {
        const current = supplies.find((x) => x.id === supId);
        if (current) {
          batch.set(
            doc(db, 'supplies', supId),
            { currentStock: Math.max(0, current.currentStock - 1), updatedAt: isoNow },
            { merge: true }
          );
        }
      });
      await batch.commit();
    } catch {
      // Optimistic state already updated
    }
  };

  const resetAllData = async () => {
    // Preserve custom user-added flowers and workshops while restoring missing default specimens
    const customFlowers = flowers.filter(
      (f) => f.id.startsWith('flower-') && !FLOWERS.some((def) => def.id === f.id)
    );
    const defaultFlowers = FLOWERS.map((item, idx) =>
      normalizeFlower(item, customFlowers.length + idx)
    );
    const mergedFlowers = [...customFlowers, ...defaultFlowers].map((item, idx) => ({
      ...item,
      indexNumber: String(idx + 1).padStart(2, '0'),
      pinnedToLanding: true
    }));

    const customWorkshops = workshops.filter(
      (w) => w.id.startsWith('workshop-') && !WORKSHOPS.some((def) => def.id === w.id)
    );
    const defaultWorkshops = WORKSHOPS.map((item, idx) =>
      normalizeWorkshop(item, customWorkshops.length + idx)
    );
    const mergedWorkshops = [...customWorkshops, ...defaultWorkshops].map((item, idx) => ({
      ...item,
      indexNumber: String(idx + 1).padStart(2, '0')
    }));

    setFlowers(mergedFlowers);
    setWorkshops(mergedWorkshops);

    try {
      const batch = writeBatch(db);
      mergedFlowers.forEach((f) => {
        batch.set(
          doc(db, 'flowers', f.id),
          stripUndefined({ ...f, updatedAt: new Date().toISOString() }),
          { merge: true }
        );
      });
      mergedWorkshops.forEach((w) => {
        batch.set(
          doc(db, 'workshops', w.id),
          stripUndefined({ ...w, updatedAt: new Date().toISOString() }),
          { merge: true }
        );
      });
      await batch.commit();
    } catch (e) {
      console.warn('Error restoring catalog defaults:', e);
    }
  };

  // Export Full Atelier Snapshot as JSON file for 100% safe local backup
  const exportBackupJson = () => {
    try {
      const backupPayload = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        flowers,
        workshops,
        atelierData,
        logoUrl,
        logoWhiteUrl,
        orders,
        workshopBookings,
        supplies
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
        type: 'application/json;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `juet-saigon-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export backup error:', e);
    }
  };

  // Import & Restore Full Atelier Snapshot from JSON file and sync to Firebase
  const importBackupJson = async (
    jsonText: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'File sao lưu không hợp lệ.' };
      }

      const batch = writeBatch(db);
      const isoNow = new Date().toISOString();

      if (Array.isArray(parsed.flowers) && parsed.flowers.length > 0) {
        const normalized = parsed.flowers.map((f: Partial<FlowerItem>, i: number) =>
          normalizeFlower({ ...f, pinnedToLanding: f.pinnedToLanding !== false }, i)
        );
        setFlowers(normalized);
        normalized.forEach((f: FlowerItem) => {
          batch.set(doc(db, 'flowers', f.id), stripUndefined({ ...f, updatedAt: isoNow }), {
            merge: true
          });
        });
      }

      if (Array.isArray(parsed.workshops) && parsed.workshops.length > 0) {
        const normalizedWs = parsed.workshops.map((w: Partial<WorkshopItem>, i: number) =>
          normalizeWorkshop(w, i)
        );
        setWorkshops(normalizedWs);
        normalizedWs.forEach((w: WorkshopItem) => {
          batch.set(doc(db, 'workshops', w.id), stripUndefined({ ...w, updatedAt: isoNow }), {
            merge: true
          });
        });
      }

      if (parsed.atelierData && typeof parsed.atelierData === 'object') {
        const nextAtelier = { ...ATELIER_DATA, ...parsed.atelierData };
        setAtelierData(nextAtelier);
        const nextLogo = parsed.logoUrl !== undefined ? parsed.logoUrl : logoUrl;
        const nextLogoWhite =
          parsed.logoWhiteUrl !== undefined ? parsed.logoWhiteUrl : logoWhiteUrl;
        if (parsed.logoUrl !== undefined) setLogoUrl(parsed.logoUrl);
        if (parsed.logoWhiteUrl !== undefined) setLogoWhiteUrl(parsed.logoWhiteUrl);
        batch.set(
          doc(db, 'settings', 'atelier'),
          stripUndefined({
            ...nextAtelier,
            logoUrl: nextLogo,
            logoWhiteUrl: nextLogoWhite,
            updatedAt: isoNow
          }),
          { merge: true }
        );
      }

      if (Array.isArray(parsed.supplies) && parsed.supplies.length > 0) {
        setSupplies(parsed.supplies);
        parsed.supplies.forEach((s: SupplyItem) => {
          if (s && s.id) {
            batch.set(doc(db, 'supplies', s.id), stripUndefined({ ...s, updatedAt: isoNow }), {
              merge: true
            });
          }
        });
      }

      await batch.commit();
      return {
        success: true,
        message: 'Đã khôi phục toàn bộ dữ liệu từ bản sao lưu và đồng bộ lên Firebase thành công!'
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Không thể đọc file JSON sao lưu.'
      };
    }
  };

  return (
    <AtelierContext.Provider
      value={{
        flowers,
        workshops,
        atelierData,
        logoUrl,
        logoWhiteUrl,
        isAdmin,
        adminPassword,
        isCloudConnected,
        isSyncing,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        orders,
        workshopBookings,
        supplies,
        createOrder,
        updateOrderStatus,
        updateOrderWorkflow,
        deleteOrder,
        addSupply,
        updateSupply,
        adjustSupplyStock,
        deleteSupply,
        deductOrderSupplies,
        createWorkshopBooking,
        updateWorkshopBookingStatus,
        deleteWorkshopBooking,
        login,
        logout,
        changeAdminPassword,
        addFlower,
        updateFlower,
        deleteFlower,
        togglePinFlower,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        updateAtelierData,
        updateLogoUrl,
        updateLogoWhiteUrl,
        syncAllToCloud,
        resetAllData,
        exportBackupJson,
        importBackupJson
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};

export const useAtelier = () => {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
};
