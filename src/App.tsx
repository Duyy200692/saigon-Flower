/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtelierProvider, useAtelier } from './context/AtelierContext';
import { FlowerItem } from './data/flowers';
import { WorkshopItem } from './data/workshop';
import { soundEngine } from './utils/audio';

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

function AtelierApp() {
  const { flowers, workshops, isAdmin } = useAtelier();
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // Modal / Drawer States
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isWorkshopGalleryOpen, setIsWorkshopGalleryOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  
  const [inspectedFlower, setInspectedFlower] = useState<FlowerItem | null>(null);
  const [orderFlower, setOrderFlower] = useState<FlowerItem | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem | null>(null);

  // Toggle ambient soundscape
  const handleToggleAudio = () => {
    const newState = soundEngine.toggleAmbient((playing) => setIsAudioPlaying(playing));
    setIsAudioPlaying(newState);
  };

  // Open Flower Detail
  const handleSelectFlower = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    setInspectedFlower(flower);
  };

  // Next & Previous flower navigation inside sub-tag modal
  const handleNextFlower = () => {
    if (!inspectedFlower) return;
    const currentIndex = flowers.findIndex((f) => f.id === inspectedFlower.id);
    const nextIndex = (currentIndex + 1) % flowers.length;
    const nextFlower = flowers[nextIndex];
    soundEngine.playFlowerChime(nextFlower.audioFrequency);
    setInspectedFlower(nextFlower);
  };

  const handlePrevFlower = () => {
    if (!inspectedFlower) return;
    const currentIndex = flowers.findIndex((f) => f.id === inspectedFlower.id);
    const prevIndex = (currentIndex - 1 + flowers.length) % flowers.length;
    const prevFlower = flowers[prevIndex];
    soundEngine.playFlowerChime(prevFlower.audioFrequency);
    setInspectedFlower(prevFlower);
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
    <div className="min-h-screen editorial-canvas flex flex-col font-sans selection:bg-[#141414] selection:text-[#dcd8cf]">
      
      {/* Top Bar matching 3-zone contract */}
      <TopBar
        lang={lang}
        setLang={setLang}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenWorkshop={() => setIsWorkshopGalleryOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        flowerCount={flowers.length}
      />

      {/* Main Content Flow */}
      <main className="flex-1 w-full pb-16">
        
        {/* Monumental Hero Section */}
        <HeroSection
          lang={lang}
          onOpenIndex={() => setIsIndexOpen(true)}
          onOpenCredits={() => setIsCreditsOpen(true)}
        />

        {/* 3-Column Botanical Matrix Gallery (Hover pop-out & click opens modal) */}
        <BotanicalMatrix
          flowers={flowers}
          lang={lang}
          onSelectFlower={handleSelectFlower}
          onOpenCollection={() => setIsIndexOpen(true)}
        />

        {/* Compact Workshop Teaser Section on Landing Page (Keeps page neat!) */}
        <WorkshopTeaserSection
          lang={lang}
          onOpenWorkshopGallery={() => setIsWorkshopGalleryOpen(true)}
        />

        {/* Action Capsule Links (Instagram / Consultation / Hotline) */}
        <ActionLinks
          lang={lang}
          onOpenOrder={handleOpenGeneralOrder}
          onOpenAtelier={() => setIsAtelierOpen(true)}
        />

        {/* Longform Botanical Manifesto & Expandable Details */}
        <ManifestoSection
          lang={lang}
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
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenWorkshop={() => setIsWorkshopGalleryOpen(true)}
        flowerCount={flowers.length}
      />

      {/* Drawers & Modals */}
      <CollectionCatalogModal
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        flowers={flowers}
        lang={lang}
        onSelectFlower={handleSelectFlower}
      />

      {/* Interactive Sub-Tag Modal for viewing flower details */}
      <FlowerDetailModal
        flower={inspectedFlower}
        isOpen={!!inspectedFlower}
        onClose={() => setInspectedFlower(null)}
        lang={lang}
        onOrderFlower={handleOrderFlower}
        onNext={handleNextFlower}
        onPrev={handlePrevFlower}
      />

      {/* Dedicated Fullscreen Workshop Gallery Overlay (Alternating 3-row layout) */}
      <WorkshopGalleryModal
        isOpen={isWorkshopGalleryOpen}
        onClose={() => setIsWorkshopGalleryOpen(false)}
        lang={lang}
        onSelectWorkshop={(ws) => setSelectedWorkshop(ws)}
      />

      {/* Workshop Detailed Dossier & Adaptive Gallery Modal */}
      <WorkshopDetailModal
        workshop={selectedWorkshop}
        isOpen={!!selectedWorkshop}
        onClose={() => setSelectedWorkshop(null)}
        lang={lang}
      />

      <BespokeOrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedFlower={orderFlower}
        lang={lang}
      />

      <AtelierModal
        isOpen={isAtelierOpen}
        onClose={() => setIsAtelierOpen(false)}
        lang={lang}
        onOpenOrder={handleOpenGeneralOrder}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
        lang={lang}
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
      />

      {/* Full Admin Management Portal with WebP Compressor */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        lang={lang}
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
