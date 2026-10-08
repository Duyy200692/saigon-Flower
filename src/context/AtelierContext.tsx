import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { FlowerItem, FLOWERS, ATELIER_DATA } from '../data/flowers';
import { WorkshopItem, WORKSHOPS } from '../data/workshop';
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

export type OrderStatus = 'pending' | 'crafting' | 'delivering' | 'completed' | 'cancelled';

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
  district: string;
  budgetVnd: number;
  notes: string;
  giftCard?: WaxSealGiftCard;
  status: OrderStatus;
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
  createOrder: (
    orderData: Omit<BespokeOrder, 'id' | 'orderCode' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<BespokeOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNote?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
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
  BOOKINGS: 'juet_workshop_bookings_cache_v1'
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

// Normalize a flower item so missing fields never cause runtime crashes and all titles are synchronized
function normalizeFlower(item: Partial<FlowerItem>, idx: number): FlowerItem {
  const fallback = FLOWERS[idx % FLOWERS.length] || FLOWERS[0];
  const rawMaterials = Array.isArray(item.materials) ? item.materials : fallback.materials;
  const rawMaterialsVi = Array.isArray(item.materialsVi) ? item.materialsVi : fallback.materialsVi;
  const rawGallery =
    Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
      : fallback.galleryImages;

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
    materials: rawMaterials.map((m) => formatTitleCase(m)),
    materialsVi: rawMaterialsVi.map((m) => formatTitleCase(m)),
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
    anatomy: Array.isArray(item.anatomy) ? item.anatomy : fallback.anatomy,
    dimensions: normalizeUnicodeNFC(item.dimensions || fallback.dimensions),
    seasonality: normalizeUnicodeNFC(item.seasonality || fallback.seasonality),
    priceVnd: typeof item.priceVnd === 'number' && !Number.isNaN(item.priceVnd) ? item.priceVnd : fallback.priceVnd,
    priceUsd: typeof item.priceUsd === 'number' && !Number.isNaN(item.priceUsd) ? item.priceUsd : fallback.priceUsd,
    image: item.image || fallback.image,
    galleryImages: rawGallery.map((g) => ({
      ...g,
      captionVi: formatProseNFC(g.captionVi),
      captionEn: formatProseNFC(g.captionEn)
    })),
    audioFrequency: typeof item.audioFrequency === 'number' ? item.audioFrequency : fallback.audioFrequency,
    pinnedToLanding: item.pinnedToLanding !== undefined ? item.pinnedToLanding : idx < 12
  };
}

// Normalize a workshop item so missing fields never cause runtime crashes and all titles are synchronized
function normalizeWorkshop(item: Partial<WorkshopItem>, idx: number): WorkshopItem {
  const fallback = WORKSHOPS[idx % WORKSHOPS.length] || WORKSHOPS[0];
  const rawGallery =
    Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages
      : fallback.galleryImages;

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
    fullContentVi: (Array.isArray(item.fullContentVi) ? item.fullContentVi : fallback.fullContentVi).map((p) =>
      formatProseNFC(p)
    ),
    fullContentEn: (Array.isArray(item.fullContentEn) ? item.fullContentEn : fallback.fullContentEn).map((p) =>
      formatProseNFC(p)
    ),
    highlightsVi: (Array.isArray(item.highlightsVi) ? item.highlightsVi : fallback.highlightsVi).map((h) =>
      formatProseNFC(h)
    ),
    highlightsEn: (Array.isArray(item.highlightsEn) ? item.highlightsEn : fallback.highlightsEn).map((h) =>
      formatProseNFC(h)
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
    image: item.image || fallback.image,
    galleryImages: rawGallery.map((g) => ({
      ...g,
      captionVi: formatProseNFC(g.captionVi),
      captionEn: formatProseNFC(g.captionEn)
    }))
  };
}

export const AtelierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flowers, setFlowers] = useState<FlowerItem[]>(() => {
    const saved = safeGetStorage(STORAGE_KEYS.FLOWERS);
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
    const saved = safeGetStorage(STORAGE_KEYS.WORKSHOPS);
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
    const saved = safeGetStorage(STORAGE_KEYS.ATELIER);
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
    return safeGetStorage(STORAGE_KEYS.LOGO);
  });

  const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(() => {
    return safeGetStorage(STORAGE_KEYS.LOGO_WHITE);
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return safeGetStorage(STORAGE_KEYS.AUTH) === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return safeGetStorage(STORAGE_KEYS.PASS) || '';
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

  // Firestore Realtime Subscription
  useEffect(() => {
    let unsubscribeFlowers: (() => void) | null = null;
    let unsubscribeWorkshops: (() => void) | null = null;
    let unsubscribeSettings: (() => void) | null = null;
    let unsubscribeSecurity: (() => void) | null = null;
    let unsubscribeOrders: (() => void) | null = null;
    let unsubscribeBookings: (() => void) | null = null;

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
              rawFlowers.sort((a, b) => (a.indexNumber || '').localeCompare(b.indexNumber || ''));
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
        batch.set(flowerRef, {
          ...flower,
          pinnedToLanding: idx < 12,
          updatedAt: new Date().toISOString()
        });
      });

      // Seed workshops
      WORKSHOPS.forEach((workshop) => {
        const workshopRef = doc(db, 'workshops', workshop.id);
        batch.set(workshopRef, {
          ...workshop,
          updatedAt: new Date().toISOString()
        });
      });

      // Seed atelier settings
      const settingsRef = doc(db, 'settings', 'atelier');
      batch.set(settingsRef, {
        ...ATELIER_DATA,
        logoUrl: null,
        logoWhiteUrl: null,
        updatedAt: new Date().toISOString()
      });

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
        batch.set(flowerRef, {
          ...flower,
          updatedAt: new Date().toISOString()
        });
      });

      workshops.forEach((workshop) => {
        const workshopRef = doc(db, 'workshops', workshop.id);
        batch.set(workshopRef, {
          ...workshop,
          updatedAt: new Date().toISOString()
        });
      });

      const settingsRef = doc(db, 'settings', 'atelier');
      batch.set(settingsRef, {
        ...atelierData,
        logoUrl,
        logoWhiteUrl,
        updatedAt: new Date().toISOString()
      });

      if (adminPassword) {
        const securityRef = doc(db, 'settings', 'security');
        batch.set(securityRef, {
          adminPassword,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin'
        });
      }

      await batch.commit();
      setIsCloudConnected(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'syncAllToCloud');
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
    const nextIdx = String(flowers.length + 1).padStart(2, '0');
    const newId = `flower-${Date.now()}`;
    const newFlower: FlowerItem = normalizeFlower(
      {
        ...flowerData,
        id: newId,
        indexNumber: nextIdx
      },
      flowers.length
    );

    setFlowers((prev) => [newFlower, ...prev]);

    try {
      await setDoc(doc(db, 'flowers', newId), {
        ...newFlower,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `flowers/${newId}`);
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
        { ...normalizedUpdated, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `flowers/${id}`);
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
      handleFirestoreError(error, OperationType.DELETE, `flowers/${id}`);
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
      handleFirestoreError(error, OperationType.UPDATE, `flowers/${id}`);
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
      await setDoc(doc(db, 'workshops', newId), {
        ...newWorkshop,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `workshops/${newId}`);
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
        { ...normalizedUpdated, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `workshops/${id}`);
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
      handleFirestoreError(error, OperationType.DELETE, `workshops/${id}`);
    }
  };

  // Atelier Brand Settings
  const updateAtelierData = async (data: Partial<typeof ATELIER_DATA>) => {
    setAtelierData((prev) => ({ ...prev, ...data }));

    try {
      await setDoc(
        doc(db, 'settings', 'atelier'),
        { ...data, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
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
      handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
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
      handleFirestoreError(error, OperationType.UPDATE, 'settings/atelier');
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

    const newOrder: BespokeOrder = {
      ...orderData,
      id: newId,
      orderCode,
      status: 'pending',
      createdAt: isoNow,
      updatedAt: isoNow
    };

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

  const updateOrderStatus = async (orderId: string, status: OrderStatus, adminNote?: string) => {
    const isoNow = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(adminNote !== undefined ? { adminNote } : {}),
              updatedAt: isoNow
            }
          : o
      )
    );

    try {
      await setDoc(
        doc(db, 'orders', orderId),
        {
          status,
          ...(adminNote !== undefined ? { adminNote } : {}),
          updatedAt: isoNow
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
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

    const newBooking: WorkshopBooking = {
      ...bookingData,
      id: newId,
      bookingCode,
      status: 'pending',
      createdAt: isoNow,
      updatedAt: isoNow
    };

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
      handleFirestoreError(error, OperationType.UPDATE, `workshop_bookings/${bookingId}`);
    }
  };

  const deleteWorkshopBooking = async (bookingId: string) => {
    setWorkshopBookings((prev) => prev.filter((b) => b.id !== bookingId));

    try {
      await deleteDoc(doc(db, 'workshop_bookings', bookingId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `workshop_bookings/${bookingId}`);
    }
  };

  const resetAllData = async () => {
    const defaultFlowers = FLOWERS.map((item, idx) => normalizeFlower(item, idx));
    const defaultWorkshops = WORKSHOPS.map((item, idx) => normalizeWorkshop(item, idx));
    setFlowers(defaultFlowers);
    setWorkshops(defaultWorkshops);
    setAtelierData(ATELIER_DATA);
    setLogoUrl(null);
    setLogoWhiteUrl(null);
    safeRemoveStorage(STORAGE_KEYS.FLOWERS);
    safeRemoveStorage(STORAGE_KEYS.WORKSHOPS);
    safeRemoveStorage(STORAGE_KEYS.ATELIER);
    safeRemoveStorage(STORAGE_KEYS.LOGO);
    safeRemoveStorage(STORAGE_KEYS.LOGO_WHITE);

    try {
      await syncAllToCloud();
    } catch (e) {
      console.warn('Error resetting cloud data:', e);
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
        createOrder,
        updateOrderStatus,
        deleteOrder,
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
        resetAllData
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
