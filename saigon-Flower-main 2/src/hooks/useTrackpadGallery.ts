import { useEffect, useRef, useState, useCallback } from 'react';

interface UseTrackpadGalleryOptions {
  totalItems: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  threshold?: number; // Accumulated deltaX threshold (default 40)
  cooldownMs?: number; // Cooldown after a slide (default 320ms)
  enabled?: boolean;
}

export function useTrackpadGallery<T extends HTMLElement = HTMLDivElement>({
  totalItems,
  currentIndex,
  onNext,
  onPrev,
  threshold = 38,
  cooldownMs = 300,
  enabled = true
}: UseTrackpadGalleryOptions) {
  const containerRef = useRef<T | null>(null);
  const accumulatedDeltaX = useRef(0);
  const lastTriggerTime = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isMacOs = useRef(false);

  // Detect Mac / Apple trackpad environment
  useEffect(() => {
    try {
      isMacOs.current =
        /Mac|Macintosh|iPhone|iPad|iPod/i.test(navigator.platform || '') ||
        /Mac OS/i.test(navigator.userAgent || '');
    } catch {
      isMacOs.current = false;
    }
  }, []);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  const handlePrev = useCallback(() => {
    onPrev();
  }, [onPrev]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !enabled || totalItems <= 1) return;

    let resetTimer: NodeJS.Timeout | null = null;

    const onWheel = (e: WheelEvent) => {
      // Don't intercept if ctrlKey is pressed (e.g. pinch-to-zoom in lightbox)
      if (e.ctrlKey) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // We only care about horizontal gesture intents where deltaX dominates
      if (absX > absY && absX > 6) {
        // Prevent browser's horizontal swipe history back/forward navigation
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastTriggerTime.current < cooldownMs) {
          return;
        }

        accumulatedDeltaX.current += e.deltaX;

        // Visual feedback during swipe (capped between -25px and 25px)
        const visualFriction = 0.25;
        const clampedOffset = Math.max(-28, Math.min(28, -accumulatedDeltaX.current * visualFriction));
        setDragOffset(clampedOffset);

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          accumulatedDeltaX.current = 0;
          setDragOffset(0);
        }, 180);

        if (accumulatedDeltaX.current > threshold) {
          // Swiped Left with 2 fingers -> go to NEXT image
          lastTriggerTime.current = now;
          accumulatedDeltaX.current = 0;
          setDragOffset(0);
          handleNext();
        } else if (accumulatedDeltaX.current < -threshold) {
          // Swiped Right with 2 fingers -> go to PREVIOUS image
          lastTriggerTime.current = now;
          accumulatedDeltaX.current = 0;
          setDragOffset(0);
          handlePrev();
        }
      }
    };

    // Passive false is mandatory to allow e.preventDefault()
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [enabled, totalItems, threshold, cooldownMs, handleNext, handlePrev]);

  return {
    containerRef,
    dragOffset,
    isMacOs: isMacOs.current
  };
}
