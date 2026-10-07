import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { FlowerItem, FLOWERS, ATELIER_DATA } from '../data/flowers';
import { WorkshopItem, WORKSHOPS } from '../data/workshop';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';

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
  PASS: 'juet_admin_password_v2'
};

export const AtelierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flowers, setFlowers] = useState<FlowerItem[]>(() => {
    let list: FlowerItem[] = FLOWERS;
    const saved = localStorage.getItem(STORAGE_KEYS.FLOWERS);
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved flowers', e);
      }
    }
    return list.map((item, idx) => ({
      ...item,
      pinnedToLanding: item.pinnedToLanding !== undefined ? item.pinnedToLanding : idx < 12
    }));
  });

  const [workshops, setWorkshops] = useState<WorkshopItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved workshops', e);
      }
    }
    return WORKSHOPS;
  });

  const [atelierData, setAtelierData] = useState<typeof ATELIER_DATA>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATELIER);
    if (saved) {
      try {
        return { ...ATELIER_DATA, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse saved atelier data', e);
      }
    }
    return ATELIER_DATA;
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGO);
  });

  const [logoWhiteUrl, setLogoWhiteUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGO_WHITE);
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PASS) || '';
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isInitialCloudSyncDone = useRef<boolean>(false);

  // Sync state to localStorage for offline resilience
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLOWERS, JSON.stringify(flowers));
  }, [flowers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(workshops));
  }, [workshops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(atelierData));
  }, [atelierData]);

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem(STORAGE_KEYS.LOGO, logoUrl);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGO);
    }
  }, [logoUrl]);

  useEffect(() => {
    if (logoWhiteUrl) {
      localStorage.setItem(STORAGE_KEYS.LOGO_WHITE, logoWhiteUrl);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGO_WHITE);
    }
  }, [logoWhiteUrl]);

  useEffect(() => {
    if (adminPassword) {
      localStorage.setItem(STORAGE_KEYS.PASS, adminPassword);
    }
  }, [adminPassword]);

  // Firestore Realtime Subscription
  useEffect(() => {
    let unsubscribeFlowers: (() => void) | null = null;
    let unsubscribeWorkshops: (() => void) | null = null;
    let unsubscribeSettings: (() => void) | null = null;
    let unsubscribeSecurity: (() => void) | null = null;

    const setupFirestoreSync = async () => {
      try {
        const connected = await testFirestoreConnection();
        setIsCloudConnected(connected);

        // 1. Listen to Flowers Collection
        const flowersCollectionRef = collection(db, 'flowers');
        unsubscribeFlowers = onSnapshot(
          flowersCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudFlowers: FlowerItem[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as FlowerItem;
                cloudFlowers.push({ ...data, id: docSnap.id });
              });
              cloudFlowers.sort((a, b) => (a.indexNumber || '').localeCompare(b.indexNumber || ''));
              setFlowers(cloudFlowers);
            } else if (!isInitialCloudSyncDone.current) {
              seedInitialDataToCloud();
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'flowers');
          }
        );

        // 2. Listen to Workshops Collection
        const workshopsCollectionRef = collection(db, 'workshops');
        unsubscribeWorkshops = onSnapshot(
          workshopsCollectionRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudWorkshops: WorkshopItem[] = [];
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as WorkshopItem;
                cloudWorkshops.push({ ...data, id: docSnap.id });
              });
              cloudWorkshops.sort((a, b) => (a.indexNumber || '').localeCompare(b.indexNumber || ''));
              setWorkshops(cloudWorkshops);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'workshops');
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
              setAtelierData((prev) => ({ ...prev, ...restSettings }));
              if (cloudLogo !== undefined) {
                setLogoUrl(cloudLogo);
              }
              if (cloudLogoWhite !== undefined) {
                setLogoWhiteUrl(cloudLogoWhite);
              }
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, 'settings/atelier');
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
            handleFirestoreError(error, OperationType.GET, 'settings/security');
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
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
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
    localStorage.setItem(STORAGE_KEYS.PASS, cleanNewPass);

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
      handleFirestoreError(error, OperationType.UPDATE, 'settings/security');
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
    const newFlower: FlowerItem = {
      ...flowerData,
      id: newId,
      indexNumber: nextIdx
    };

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
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );

    try {
      await setDoc(
        doc(db, 'flowers', id),
        { ...updatedFields, updatedAt: new Date().toISOString() },
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
    const newWorkshop: WorkshopItem = {
      ...workshopData,
      id: newId,
      indexNumber: nextIdx
    };

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
    setWorkshops((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w))
    );

    try {
      await setDoc(
        doc(db, 'workshops', id),
        { ...updatedFields, updatedAt: new Date().toISOString() },
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

  const resetAllData = async () => {
    setFlowers(FLOWERS);
    setWorkshops(WORKSHOPS);
    setAtelierData(ATELIER_DATA);
    setLogoUrl(null);
    setLogoWhiteUrl(null);
    localStorage.removeItem(STORAGE_KEYS.FLOWERS);
    localStorage.removeItem(STORAGE_KEYS.WORKSHOPS);
    localStorage.removeItem(STORAGE_KEYS.ATELIER);
    localStorage.removeItem(STORAGE_KEYS.LOGO);
    localStorage.removeItem(STORAGE_KEYS.LOGO_WHITE);

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
