import React from 'react';

// Import all 17 high-resolution botanical & workshop assets so Vite bundles them in production
import imgBlueIris from '../assets/images/juet_blue_iris_1790840866986.jpg';
import imgBlushPeony from '../assets/images/juet_blush_peony_1790840758164.jpg';
import imgBridalMacroPearls from '../assets/images/juet_bridal_macro_pearls_1790844489242.jpg';
import imgCallaSculpture from '../assets/images/juet_calla_sculpture_1790840903037.jpg';
import imgGoldenChrysanthemum from '../assets/images/juet_golden_chrysanthemum_1790840878623.jpg';
import imgHyacinthBridal from '../assets/images/juet_hyacinth_bridal_1790840743947.jpg';
import imgLotusMinimalTable from '../assets/images/juet_lotus_minimal_table_1790844513685.jpg';
import imgOrchidMacroStamen from '../assets/images/juet_orchid_macro_stamen_1790844525372.jpg';
import imgPeonySideAngle from '../assets/images/juet_peony_side_angle_1790844501746.jpg';
import imgPoppyTransvaal from '../assets/images/juet_poppy_transvaal_1790840799591.jpg';
import imgSacredLotus from '../assets/images/juet_sacred_lotus_1790840770921.jpg';
import imgSurrealOrchid from '../assets/images/juet_surreal_orchid_1790840788413.jpg';
import imgWhiteAnemone from '../assets/images/juet_white_anemone_1790840892002.jpg';
import imgWorkshopMaterialsStems from '../assets/images/juet_workshop_materials_stems_1790851117842.jpg';
import imgWorkshopOfficeTerracotta from '../assets/images/juet_workshop_office_terracotta_1790851072206.jpg';
import imgWorkshopTableFlatlay from '../assets/images/juet_workshop_table_flatlay_1790851084638.jpg';
import imgWorkshopTeamBonding from '../assets/images/juet_workshop_team_bonding_1790851105708.jpg';

export const BUNDLED_ASSETS = {
  blueIris: imgBlueIris,
  blushPeony: imgBlushPeony,
  bridalMacroPearls: imgBridalMacroPearls,
  callaSculpture: imgCallaSculpture,
  goldenChrysanthemum: imgGoldenChrysanthemum,
  hyacinthBridal: imgHyacinthBridal,
  lotusMinimalTable: imgLotusMinimalTable,
  orchidMacroStamen: imgOrchidMacroStamen,
  peonySideAngle: imgPeonySideAngle,
  poppyTransvaal: imgPoppyTransvaal,
  sacredLotus: imgSacredLotus,
  surrealOrchid: imgSurrealOrchid,
  whiteAnemone: imgWhiteAnemone,
  workshopMaterialsStems: imgWorkshopMaterialsStems,
  workshopOfficeTerracotta: imgWorkshopOfficeTerracotta,
  workshopTableFlatlay: imgWorkshopTableFlatlay,
  workshopTeamBonding: imgWorkshopTeamBonding,
} as const;

// Map every filename and legacy filename to its bundled Vite asset URL
const FILENAME_TO_ASSET_MAP: Record<string, string> = {
  'juet_blue_iris_1790840866986.jpg': imgBlueIris,
  'juet_blush_peony_1790840758164.jpg': imgBlushPeony,
  'juet_bridal_macro_pearls_1790844489242.jpg': imgBridalMacroPearls,
  'juet_calla_sculpture_1790840903037.jpg': imgCallaSculpture,
  'juet_golden_chrysanthemum_1790840878623.jpg': imgGoldenChrysanthemum,
  'juet_hyacinth_bridal_1790840743947.jpg': imgHyacinthBridal,
  'juet_lotus_minimal_table_1790844513685.jpg': imgLotusMinimalTable,
  'juet_orchid_macro_stamen_1790844525372.jpg': imgOrchidMacroStamen,
  'juet_peony_side_angle_1790844501746.jpg': imgPeonySideAngle,
  'juet_poppy_transvaal_1790840799591.jpg': imgPoppyTransvaal,
  'juet_sacred_lotus_1790840770921.jpg': imgSacredLotus,
  'juet_surreal_orchid_1790840788413.jpg': imgSurrealOrchid,
  'juet_white_anemone_1790840892002.jpg': imgWhiteAnemone,
  'juet_workshop_materials_stems_1790851117842.jpg': imgWorkshopMaterialsStems,
  'juet_workshop_office_terracotta_1790851072206.jpg': imgWorkshopOfficeTerracotta,
  'juet_workshop_table_flatlay_1790851084638.jpg': imgWorkshopTableFlatlay,
  'juet_workshop_team_bonding_1790851105708.jpg': imgWorkshopTeamBonding,
  // Legacy workshop filenames that may exist in Firestore or localStorage from earlier versions
  'juet_workshop_hero_1790840742512.jpg': imgWorkshopOfficeTerracotta,
  'juet_workshop_ranunculus_1790840772583.jpg': imgWorkshopTableFlatlay,
  'juet_workshop_peony_1790840786968.jpg': imgWorkshopTeamBonding,
  'juet_workshop_autumn_1790840801831.jpg': imgWorkshopMaterialsStems,
};

export const DEFAULT_FALLBACK_FLOWER_IMAGE = imgBlushPeony;
export const DEFAULT_FALLBACK_WORKSHOP_IMAGE = imgWorkshopOfficeTerracotta;

/**
 * Resolves any stored image URL (from Firestore, localStorage, or static data)
 * into a guaranteed-working asset URL.
 */
export function resolveImageUrl(
  rawUrl: string | undefined | null,
  fallbackUrl: string = DEFAULT_FALLBACK_FLOWER_IMAGE
): string {
  const resolvedFallback = resolveKnownFilename(fallbackUrl) || DEFAULT_FALLBACK_FLOWER_IMAGE;

  if (!rawUrl || typeof rawUrl !== 'string') {
    return resolvedFallback;
  }

  const trimmed = rawUrl.trim();
  if (
    !trimmed ||
    trimmed === 'null' ||
    trimmed === 'undefined' ||
    trimmed.startsWith('blob:') ||
    trimmed.includes('unsplash.com') ||
    trimmed.includes('picsum.photos') ||
    trimmed.includes('placeholder.com')
  ) {
    return resolvedFallback;
  }

  // Validate base64 data URLs
  if (trimmed.startsWith('data:image/')) {
    if (trimmed.length > 120 && trimmed.includes(',')) {
      return trimmed;
    }
    return resolvedFallback;
  }

  // Check if URL references any known local asset filename
  const matchedAsset = resolveKnownFilename(trimmed);
  if (matchedAsset) {
    return matchedAsset;
  }

  // If it's a local /src/assets/ or /assets/ path that does NOT match any existing file, heal with fallback
  if (trimmed.startsWith('/src/') || trimmed.startsWith('src/')) {
    return resolvedFallback;
  }

  return trimmed;
}

function resolveKnownFilename(url: string): string | null {
  if (!url) return null;
  // Direct match against values already resolved by Vite
  for (const [filename, bundledUrl] of Object.entries(FILENAME_TO_ASSET_MAP)) {
    if (url === bundledUrl || url.endsWith('/' + filename) || url === filename) {
      return bundledUrl;
    }
  }
  // Fuzzy keyword match for any legacy juet_ asset path
  const lower = url.toLowerCase();
  if (lower.includes('juet_')) {
    if (lower.includes('hyacinth')) return imgHyacinthBridal;
    if (lower.includes('bridal_macro') || lower.includes('pearls')) return imgBridalMacroPearls;
    if (lower.includes('peony_side')) return imgPeonySideAngle;
    if (lower.includes('blush_peony')) return imgBlushPeony;
    if (lower.includes('lotus_minimal')) return imgLotusMinimalTable;
    if (lower.includes('sacred_lotus')) return imgSacredLotus;
    if (lower.includes('orchid_macro')) return imgOrchidMacroStamen;
    if (lower.includes('surreal_orchid')) return imgSurrealOrchid;
    if (lower.includes('poppy')) return imgPoppyTransvaal;
    if (lower.includes('blue_iris') || lower.includes('iris')) return imgBlueIris;
    if (lower.includes('chrysanthemum')) return imgGoldenChrysanthemum;
    if (lower.includes('anemone')) return imgWhiteAnemone;
    if (lower.includes('calla')) return imgCallaSculpture;
    if (lower.includes('workshop_table') || lower.includes('workshop_ranunculus')) return imgWorkshopTableFlatlay;
    if (lower.includes('workshop_team') || lower.includes('workshop_peony')) return imgWorkshopTeamBonding;
    if (lower.includes('workshop_materials') || lower.includes('workshop_autumn')) return imgWorkshopMaterialsStems;
    if (lower.includes('workshop')) return imgWorkshopOfficeTerracotta;
  }
  return null;
}

/**
 * Global onError handler for <img> elements to guarantee zero broken images.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl: string = DEFAULT_FALLBACK_FLOWER_IMAGE
): void {
  const target = e.currentTarget;
  const safeFallback = resolveImageUrl(fallbackUrl, DEFAULT_FALLBACK_FLOWER_IMAGE);
  if (target.dataset.fallbackApplied === 'true') {
    if (target.src !== DEFAULT_FALLBACK_FLOWER_IMAGE) {
      target.src = DEFAULT_FALLBACK_FLOWER_IMAGE;
    }
    return;
  }
  target.dataset.fallbackApplied = 'true';
  target.src = safeFallback;
}
