/**
 * Smart Vietnamese & Botanical Typography Normalization Engine
 * - Converts decomposed Unicode (NFD from Facebook/macOS) to precomposed NFC so Vietnamese diacritics never break fonts
 * - Automatically standardizes Title Case, Monumental Uppercase, and Botanical Latin nomenclature across the entire Atelier system
 */

const PRESERVE_UPPERCASE_TOKENS = new Set([
  'JU',
  'SAIGON',
  'TP.HCM',
  'TPHCM',
  'HCM',
  'TP.',
  'Q.1',
  'Q.2',
  'Q.3',
  'Q.7',
  'Q1',
  'Q2',
  'Q3',
  'Q7',
  'D1',
  'D2',
  'D3',
  'D7',
  'D.1',
  'VND',
  'USD',
  'A-Z',
  'A–Z',
  'VIP',
  'HR',
  'CEO',
  '3D',
  '24/7',
  'II',
  'III',
  'IV'
]);

/**
 * Ensures text is in canonical Unicode NFC form (fixes decomposed Vietnamese diacritics from Facebook/macOS)
 * and collapses redundant whitespace.
 */
export function normalizeUnicodeNFC(text: string | undefined | null): string {
  if (!text) return '';
  return String(text)
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats a string into Monumental Display Uppercase (NFC normalized).
 * Ideal for primary specimen codes and monumental headers (e.g., "HYACINTHUS NUPTIALIS").
 */
export function formatDisplayUppercase(text: string | undefined | null): string {
  const clean = normalizeUnicodeNFC(text);
  if (!clean) return '';
  return clean.toLocaleUpperCase('vi-VN');
}

/**
 * Formats a string into synchronized Title Case (Viết Hoa Chữ Cái Đầu Mỗi Từ)
 * whether the user typed all lowercase, all uppercase, or mixed case.
 * Example:
 *  - "hoa cưới dạ lan trắng & ngọc trai" -> "Hoa Cưới Dạ Lan Trắng & Ngọc Trai"
 *  - "HOA CƯỚI DẠ LAN TRẮNG & NGỌC TRAI" -> "Hoa Cưới Dạ Lan Trắng & Ngọc Trai"
 */
export function formatTitleCase(text: string | undefined | null): string {
  const clean = normalizeUnicodeNFC(text);
  if (!clean) return '';

  const words = clean.split(' ');
  const formattedWords = words.map((word, index) => {
    if (!word) return word;

    // Preserve symbols like &, ·, -, –, /, |
    if (/^[&·\-–/|+:]+$/.test(word)) {
      return word;
    }

    // Check if the raw upper token matches a preserved acronym (e.g. JU, TP.HCM, Q.1, A-Z)
    const strippedPunct = word.replace(/^[([{"']+|[)\]}",.;:!?']+$/g, '');
    const upperToken = strippedPunct.toLocaleUpperCase('vi-VN');
    if (PRESERVE_UPPERCASE_TOKENS.has(upperToken)) {
      // Special case: keep "SAIGON" as "Saigon" in Title Case unless part of all-caps
      if (upperToken === 'SAIGON') {
        return word.replace(strippedPunct, 'Saigon');
      }
      return word.replace(strippedPunct, upperToken);
    }

    // Keep French connector "et" in "JU et Saigon" lowercase
    if (strippedPunct.toLowerCase() === 'et' && index > 0) {
      return 'et';
    }

    // Handle hyphenated or slash-connected words (e.g. "A-Z", "Độc-Bản")
    const lowerWord = word.toLocaleLowerCase('vi-VN');
    // Find the first alphabetic character (including Vietnamese letters) and capitalize it
    return lowerWord.replace(
      /(^|[(\[{"'/—–-])([a-zA-ZÀ-ỹ])/g,
      (_match, prefix, char) => `${prefix}${char.toLocaleUpperCase('vi-VN')}`
    );
  });

  return formattedWords.join(' ').replace(/\bJU Et Saigon\b/gi, 'JU et Saigon');
}

/**
 * Formats Botanical Latin nomenclature:
 * Genus capitalized, species lowercase, hybrid 'x' lowercase, e.g. "Hyacinthus orientalis alba x Margaritifera"
 */
export function formatBotanicalLatin(text: string | undefined | null): string {
  const clean = normalizeUnicodeNFC(text);
  if (!clean) return '';

  // If the text contains Vietnamese characters (like Workshop latinMonographName "Workshop Cắm Hoa Cuối Năm"),
  // format it with Title Case so it looks harmonious!
  if (/[À-ỹ]/.test(clean)) {
    return formatTitleCase(clean);
  }

  const words = clean.split(' ');
  return words
    .map((w, idx) => {
      const lower = w.toLowerCase();
      if (idx === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      if (lower === 'x' || lower === '×') {
        return 'x';
      }
      // If previous word was 'x', capitalize the hybrid genus/cultivar
      if (idx > 0 && (words[idx - 1].toLowerCase() === 'x' || words[idx - 1] === '×')) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      return lower;
    })
    .join(' ');
}

/**
 * Normalizes prose/paragraphs to Unicode NFC without altering intentional sentence casing,
 * while ensuring the first letter is capitalized and spacing is clean.
 */
export function formatProseNFC(text: string | undefined | null): string {
  if (!text) return '';
  const clean = String(text).normalize('NFC').trim();
  if (!clean) return '';
  return clean.charAt(0).toLocaleUpperCase('vi-VN') + clean.slice(1);
}
