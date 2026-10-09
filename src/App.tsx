/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AtelierProvider, useAtelier } from './context/AtelierContext';
import { FlowerItem } from './data/flowers';
import { WorkshopItem } from './data/workshop';

import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { BotanicalMatrix } from './components/BotanicalMatrix';
import { WorkshopTeaserSection } from './components/WorkshopTeaserSection';
import { WorkshopGalleryModal } from './components/WorkshopGalleryModal';
import { WorkshopDetailModal } from './components/WorkshopDetailModal';
import { ActionLinks } from './components/ActionLinks';
import { ManifestoSection } from './components/ManifestoSection';
import { CollectionCatalogModal } from './components/CollectionCatalogModal';
import { FlowerDetailModal } from './components/FlowerDetailModal';
import { BespokeOrderModal } from './components/BespokeOrderModal';
import { AtelierModal } from './components/AtelierModal';
import { CreditsModal } from './components/CreditsModal';
import { FloatingMobileBar } from './components/FloatingMobileBar';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { FlowerSommelierModal } from './components/FlowerSommelierModal';
import { MoodboardModal } from './components/MoodboardModal';

function AtelierApp() {
  const { flowers, isAdmin } = useAtelier();
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ju_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ju_theme', theme);
    } catch {
      // ignore storage errors
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Modal / Drawer States
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isWorkshopGalleryOpen, setIsWorkshopGalleryOpen] = useState(false);
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  
  const [inspectedFlower, setInspectedFlower] = useState<FlowerItem | null>(null);
  const [orderFlower, setOrderFlower] = useState<FlowerItem | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem | null>(null);

  const isAnyModalOpen = Boolean(
    inspectedFlower ||
      selectedWorkshop ||
      isIndexOpen ||
      isOrderOpen ||
      isAtelierOpen ||
      isCreditsOpen ||
      isWorkshopGalleryOpen ||
      isSommelierOpen ||
      isMoodboardOpen ||
      isAdminLoginOpen ||
      isAdminPortalOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Open Flower Detail (silent — no audio on product click)
  const handleSelectFlower = (flower: FlowerItem) => {
    setInspectedFlower(flower);
  };

  // Next & Previous flower navigation inside sub-tag modal
  const handleNextFlower = () => {
    if (!inspectedFlower) return;
    const currentIndex = flowers.findIndex((f) => f.id === inspectedFlower.id);
    const nextIndex = (currentIndex + 1) % flowers.length;
    setInspectedFlower(flowers[nextIndex]);
  };

  const handlePrevFlower = () => {
    if (!inspectedFlower) return;
    const currentIndex = flowers.findIndex((f) => f.id === inspectedFlower.id);
    const prevIndex = (currentIndex - 1 + flowers.length) % flowers.length;
    setInspectedFlower(flowers[prevIndex]);
  };

  const handleOrderFlower = (flower: FlowerItem) => {
    setOrderFlower(flower);
    setIsOrderOpen(true);
  };

  const handleOpenGeneralOrder = () => {
    setOrderFlower(null);
    setIsOrderOpen(true);
  };

  const handleOpenAdminTrigger = () => {
    if (isAdmin) {
      setIsAdminPortalOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  return (
    <div
      className={`min-h-screen editorial-canvas flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark'
          ? 'theme-dark selection:bg-[#ede9df] selection:text-[#141414]'
          : 'selection:bg-[#141414] selection:text-[#dcd8cf]'
      }`}
    >
      {/* Top Bar with Light/Dark Toggle & Spacious Mobile Brand Logo */}
      <TopBar
        lang={lang}
        setLang={setLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenWorkshop={() => setIsWorkshopGalleryOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        flowerCount={flowers.length}
      />

      {/* Main Content Flow */}
      <main className="flex-1 w-full pb-16">
        
        {/* Monumental Hero Section */}
        <HeroSection
          lang={lang}
          theme={theme}
          onOpenIndex={() => setIsIndexOpen(true)}
          onOpenCredits={() => setIsCreditsOpen(true)}
        />

        {/* 3-Column Botanical Matrix Gallery */}
        <BotanicalMatrix
          flowers={flowers}
          lang={lang}
          theme={theme}
          onSelectFlower={handleSelectFlower}
          onOpenCollection={() => setIsIndexOpen(true)}
        />

        {/* Compact Workshop Teaser Section on Landing Page */}
        <WorkshopTeaserSection
          lang={lang}
          theme={theme}
          onOpenWorkshopGallery={() => setIsWorkshopGalleryOpen(true)}
        />

        {/* Action Capsule Links (Instagram / Sommelier / Consultation / Hotline) */}
        <ActionLinks
          lang={lang}
          theme={theme}
          onOpenOrder={handleOpenGeneralOrder}
          onOpenAtelier={() => setIsAtelierOpen(true)}
          onOpenSommelier={() => setIsSommelierOpen(true)}
        />

        {/* Longform Botanical Manifesto & Expandable Details */}
        <ManifestoSection
          lang={lang}
          theme={theme}
          onOpenOrder={handleOpenGeneralOrder}
          onOpenAtelier={() => setIsAtelierOpen(true)}
        />

      </main>

      {/* Footer with Admin Portal trigger */}
      <Footer
        lang={lang}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenCredits={() => setIsCreditsOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Floating Mobile App Bar */}
      <FloatingMobileBar
        lang={lang}
        setLang={setLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenWorkshop={() => setIsWorkshopGalleryOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onOpenMoodboard={() => setIsMoodboardOpen(true)}
        flowerCount={flowers.length}
      />

      {/* Drawers & Modals */}
      <CollectionCatalogModal
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        flowers={flowers}
        lang={lang}
        theme={theme}
        onSelectFlower={handleSelectFlower}
      />

      {/* Interactive Sub-Tag Modal for viewing flower details */}
      <FlowerDetailModal
        flower={inspectedFlower}
        isOpen={!!inspectedFlower}
        onClose={() => setInspectedFlower(null)}
        lang={lang}
        theme={theme}
        onOrderFlower={handleOrderFlower}
        onNext={handleNextFlower}
        onPrev={handlePrevFlower}
      />

      {/* Flower Sommelier Advisor Modal (Hạng mục 1) */}
      <FlowerSommelierModal
        isOpen={isSommelierOpen}
        onClose={() => setIsSommelierOpen(false)}
        lang={lang}
        theme={theme}
        onSelectFlower={handleSelectFlower}
        onOrderFlower={handleOrderFlower}
      />

      {/* Personal Botanical Moodboard & Comparison Modal (Hạng mục 2) */}
      <MoodboardModal
        isOpen={isMoodboardOpen}
        onClose={() => setIsMoodboardOpen(false)}
        lang={lang}
        theme={theme}
        onSelectFlower={handleSelectFlower}
        onOrderFlower={handleOrderFlower}
        onConsultMoodboard={handleOpenGeneralOrder}
        onOpenSommelier={() => setIsSommelierOpen(true)}
      />

      {/* Dedicated Fullscreen Workshop Gallery Overlay */}
      <WorkshopGalleryModal
        isOpen={isWorkshopGalleryOpen}
        onClose={() => setIsWorkshopGalleryOpen(false)}
        lang={lang}
        theme={theme}
        onSelectWorkshop={(ws) => setSelectedWorkshop(ws)}
      />

      {/* Workshop Detailed Dossier & Adaptive Gallery Modal */}
      <WorkshopDetailModal
        workshop={selectedWorkshop}
        isOpen={!!selectedWorkshop}
        onClose={() => setSelectedWorkshop(null)}
        lang={lang}
        theme={theme}
      />

      <BespokeOrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedFlower={orderFlower}
        lang={lang}
        theme={theme}
      />

      <AtelierModal
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
        lang={lang}
        theme={theme}
        onOpenOrder={handleOpenGeneralOrder}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
        lang={lang}
        theme={theme}
      />

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminPortalOpen(true);
        }}
        lang={lang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Full Admin Management Portal with WebP Compressor */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        lang={lang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <AtelierProvider>
      <AtelierApp />
    </AtelierProvider>
  );
}
