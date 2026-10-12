// Automatic VND <-> USD Currency Conversion Utility for JU et Saigon Atelier

export const DEFAULT_USD_EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND default benchmark
const RATE_STORAGE_KEY = 'juet_usd_vnd_exchange_rate';
const RATE_TIMESTAMP_KEY = 'juet_usd_vnd_rate_updated_at';

export function getUsdExchangeRate(): number {
  if (typeof window === 'undefined') return DEFAULT_USD_EXCHANGE_RATE;
  try {
    const saved = localStorage.getItem(RATE_STORAGE_KEY);
    if (saved) {
      const parsed = Number(saved);
      if (Number.isFinite(parsed) && parsed >= 15000 && parsed <= 40000) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_USD_EXCHANGE_RATE;
}

export function setUsdExchangeRate(rate: number): void {
  if (typeof window === 'undefined') return;
  try {
    if (Number.isFinite(rate) && rate >= 15000 && rate <= 40000) {
      localStorage.setItem(RATE_STORAGE_KEY, String(Math.round(rate)));
      localStorage.setItem(RATE_TIMESTAMP_KEY, new Date().toISOString());
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Converts a VND amount to USD automatically using the active exchange rate.
 */
export function convertVndToUsd(vnd?: number | null, customRate?: number): number {
  const numericVnd = Number(vnd || 0);
  if (!Number.isFinite(numericVnd) || numericVnd <= 0) return 0;
  const rate = customRate && customRate >= 1000 ? customRate : getUsdExchangeRate();
  return Math.max(1, Math.round(numericVnd / rate));
}

/**
 * Resolves a flower's USD price: uses stored priceUsd if valid, or auto-calculates from priceVnd.
 */
export function resolveFlowerUsd(priceVnd?: number, priceUsd?: number, customRate?: number): number {
  if (priceUsd && Number.isFinite(priceUsd) && priceUsd > 0) {
    return Math.round(priceUsd);
  }
  return convertVndToUsd(priceVnd, customRate);
}

/**
 * Parses a formatted or raw VND string (e.g. "3.500.000" or "3500000") into a clean number.
 */
export function parseVndString(raw: string): number {
  const digitsOnly = String(raw || '').replace(/[^0-9]/g, '');
  if (!digitsOnly) return 0;
  const parsed = Number(digitsOnly);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Fetches live USD -> VND exchange rate from public open API (cached for 12 hours).
 */
export async function syncLiveUsdExchangeRate(force = false): Promise<number> {
  if (typeof window === 'undefined') return DEFAULT_USD_EXCHANGE_RATE;
  try {
    if (!force) {
      const lastUpdated = localStorage.getItem(RATE_TIMESTAMP_KEY);
      if (lastUpdated) {
        const elapsedMs = Date.now() - new Date(lastUpdated).getTime();
        if (elapsedMs < 12 * 60 * 60 * 1000) {
          return getUsdExchangeRate();
        }
      }
    }

    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      const vndRate = data?.rates?.VND;
      if (typeof vndRate === 'number' && vndRate >= 20000 && vndRate <= 35000) {
        // Round to nearest 100 VND for clean calculation
        const roundedRate = Math.round(vndRate / 100) * 100;
        setUsdExchangeRate(roundedRate);
        return roundedRate;
      }
    }
  } catch {
    // Fallback to stored or default rate
  }
  return getUsdExchangeRate();
}
