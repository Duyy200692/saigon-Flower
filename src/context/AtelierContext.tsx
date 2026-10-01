import React, { createContext, useContext, useState, useEffect } from 'react';
import { FlowerItem, FLOWERS, ATELIER_DATA } from '../data/flowers';
import { WorkshopItem, WORKSHOPS } from '../data/workshop';

interface AtelierContextType {
  flowers: FlowerItem[];
  workshops: WorkshopItem[];
  atelierData: typeof ATELIER_DATA;
  logoUrl: string | null;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addFlower: (flower: Omit<FlowerItem, 'id' | 'indexNumber'>) => void;
  updateFlower: (id: string, flower: Partial<FlowerItem>) => void;
  deleteFlower: (id: string) => void;
  togglePinFlower: (id: string) => void;
  addWorkshop: (workshop: Omit<WorkshopItem, 'id' | 'indexNumber'>) => void;
  updateWorkshop: (id: string, workshop: Partial<WorkshopItem>) => void;
  deleteWorkshop: (id: string) => void;
  updateAtelierData: (data: Partial<typeof ATELIER_DATA>) => void;
  updateLogoUrl: (url: string | null) => void;
  resetAllData: () => void;
}

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FLOWERS: 'juet_flowers_data_v2',
  WORKSHOPS: 'juet_workshops_data_v2',
  ATELIER: 'juet_atelier_data_v2',
  LOGO: 'juet_logo_url_v2',
  AUTH: 'juet_admin_authenticated'
};

const DEFAULT_ADMIN_PASS = 'juetsaigon2026';

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
    // Ensure pinnedToLanding property exists; default top 12 to true if not explicitly set
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
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved atelier data', e);
      }
    }
    return ATELIER_DATA;
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGO);
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // Sync to localStorage
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

  // Authentication
  const login = (password: string): boolean => {
    if (password === DEFAULT_ADMIN_PASS || password === 'admin') {
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

  // Flower CRUD
  const addFlower = (flowerData: Omit<FlowerItem, 'id' | 'indexNumber'>) => {
    const nextIdx = String(flowers.length + 1).padStart(2, '0');
    const newId = `flower-${Date.now()}`;
    const newFlower: FlowerItem = {
      ...flowerData,
      id: newId,
      indexNumber: nextIdx
    };
    setFlowers((prev) => [newFlower, ...prev]);
  };

  const updateFlower = (id: string, updatedFields: Partial<FlowerItem>) => {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
  };

  const deleteFlower = (id: string) => {
    setFlowers((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      // Re-index
      return filtered.map((item, idx) => ({
        ...item,
        indexNumber: String(idx + 1).padStart(2, '0')
      }));
    });
  };

  const togglePinFlower = (id: string) => {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, pinnedToLanding: !f.pinnedToLanding } : f))
    );
  };

  // Workshop CRUD
  const addWorkshop = (workshopData: Omit<WorkshopItem, 'id' | 'indexNumber'>) => {
    const nextIdx = String(workshops.length + 1).padStart(2, '0');
    const newId = `workshop-${Date.now()}`;
    const newWorkshop: WorkshopItem = {
      ...workshopData,
      id: newId,
      indexNumber: nextIdx
    };
    setWorkshops((prev) => [...prev, newWorkshop]);
  };

  const updateWorkshop = (id: string, updatedFields: Partial<WorkshopItem>) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w))
    );
  };

  const deleteWorkshop = (id: string) => {
    setWorkshops((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      return filtered.map((item, idx) => ({
        ...item,
        indexNumber: String(idx + 1).padStart(2, '0')
      }));
    });
  };

  const updateAtelierData = (data: Partial<typeof ATELIER_DATA>) => {
    setAtelierData((prev) => ({ ...prev, ...data }));
  };

  const updateLogoUrl = (url: string | null) => {
    setLogoUrl(url);
  };

  const resetAllData = () => {
    setFlowers(FLOWERS);
    setWorkshops(WORKSHOPS);
    setAtelierData(ATELIER_DATA);
    setLogoUrl(null);
    localStorage.removeItem(STORAGE_KEYS.FLOWERS);
    localStorage.removeItem(STORAGE_KEYS.WORKSHOPS);
    localStorage.removeItem(STORAGE_KEYS.ATELIER);
    localStorage.removeItem(STORAGE_KEYS.LOGO);
  };

  return (
    <AtelierContext.Provider
      value={{
        flowers,
        workshops,
        atelierData,
        logoUrl,
        isAdmin,
        login,
        logout,
        addFlower,
        updateFlower,
        deleteFlower,
        togglePinFlower,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        updateAtelierData,
        updateLogoUrl,
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
