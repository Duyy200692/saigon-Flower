/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FLOWERS, FlowerItem, ATELIER_DATA } from './data/flowers';
import { soundEngine } from './utils/audio';

import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { BotanicalMatrix } from './components/BotanicalMatrix';
import { ActionLinks } from './components/ActionLinks';
import { ManifestoSection } from './components/ManifestoSection';
import { BotanicalFeed } from './components/BotanicalFeed';
import { IndexSlideOver } from './components/IndexSlideOver';
import { FlowerDetailModal } from './components/FlowerDetailModal';
import { BespokeOrderModal } from './components/BespokeOrderModal';
import { AtelierModal } from './components/AtelierModal';
import { CreditsModal } from './components/CreditsModal';
import { FloatingMobileBar } from './components/FloatingMobileBar';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // Modal / Drawer States
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [inspectedFlower, setInspectedFlower] = useState<FlowerItem | null>(null);
  const [orderFlower, setOrderFlower] = useState<FlowerItem | null>(null);

  // Toggle ambient soundscape
  const handleToggleAudio = () => {
    const newState = soundEngine.toggleAmbient((playing) => setIsAudioPlaying(playing));
    setIsAudioPlaying(newState);
  };

  // When clicking on a flower in matrix or feed
  const handleSelectFlower = (flower: FlowerItem) => {
    const el = document.getElementById(flower.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setInspectedFlower(flower);
    }
  };

  const handleInspectFlower = (flower: FlowerItem) => {
    soundEngine.playFlowerChime(flower.audioFrequency);
    setInspectedFlower(flower);
  };

  const handleOrderFlower = (flower: FlowerItem) => {
    setOrderFlower(flower);
    setIsOrderOpen(true);
  };

  const handleOpenGeneralOrder = () => {
    setOrderFlower(null);
    setIsOrderOpen(true);
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
        flowerCount={FLOWERS.length}
      />

      {/* Main Content Flow */}
      <main className="flex-1 w-full pb-16">
        
        {/* Monumental Hero Section */}
        <HeroSection
          lang={lang}
          onOpenIndex={() => setIsIndexOpen(true)}
          onOpenCredits={() => setIsCreditsOpen(true)}
        />

        {/* 3-Column Botanical Matrix Gallery matching Image 1 */}
        <BotanicalMatrix
          flowers={FLOWERS}
          lang={lang}
          onSelectFlower={handleSelectFlower}
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

        {/* Vertical Botanical Monographs Continuous Feed matching Image 1 */}
        <BotanicalFeed
          flowers={FLOWERS}
          lang={lang}
          onInspectFlower={handleInspectFlower}
          onOrderFlower={handleOrderFlower}
        />

      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenOrder={handleOpenGeneralOrder}
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenCredits={() => setIsCreditsOpen(true)}
      />

      {/* Floating Mobile App Bar */}
      <FloatingMobileBar
        lang={lang}
        setLang={setLang}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenOrder={handleOpenGeneralOrder}
        flowerCount={FLOWERS.length}
      />

      {/* Drawers & Modals */}
      <IndexSlideOver
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        flowers={FLOWERS}
        lang={lang}
        onSelectFlower={handleSelectFlower}
      />

      <FlowerDetailModal
        flower={inspectedFlower}
        isOpen={!!inspectedFlower}
        onClose={() => setInspectedFlower(null)}
        lang={lang}
        onOrderFlower={handleOrderFlower}
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

    </div>
  );
}
