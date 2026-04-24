export interface LanguageMeta {
  flag: string;
  iso: string;
  name: string;
}

/**
 * Global configuration for language metadata including flags and ISO codes.
 * This can be used across the application to provide consistent language representation.
 */
export const LANGUAGE_CONFIG: Record<string, LanguageMeta> = {
  // Common & Quran Foundation supported languages
  indonesian: { flag: '🇮🇩', iso: 'ID', name: 'Bahasa Indonesia' },
  english: { flag: '🇺🇸', iso: 'EN', name: 'English' },
  arabic: { flag: '🇸🇦', iso: 'AR', name: 'العربية' },
  malay: { flag: '🇲🇾', iso: 'MS', name: 'Bahasa Melayu' },
  turkish: { flag: '🇹🇷', iso: 'TR', name: 'Türkçe' },
  french: { flag: '🇫🇷', iso: 'FR', name: 'Français' },
  german: { flag: '🇩🇪', iso: 'DE', name: 'Deutsch' },
  spanish: { flag: '🇪🇸', iso: 'ES', name: 'Español' },
  urdu: { flag: '🇵🇰', iso: 'UR', name: 'اردو' },
  bengali: { flag: '🇧🇩', iso: 'BN', name: 'বাংলা' },
  russian: { flag: '🇷🇺', iso: 'RU', name: 'Русский' },
  persian: { flag: '🇮🇷', iso: 'FA', name: 'فارسی' },
  chinese: { flag: '🇨🇳', iso: 'ZH', name: '中文' },
  japanese: { flag: '🇯🇵', iso: 'JA', name: '日本語' },
  korean: { flag: '🇰🇷', iso: 'KO', name: '한국어' },
  italian: { flag: '🇮🇹', iso: 'IT', name: 'Italiano' },
  dutch: { flag: '🇳🇱', iso: 'NL', name: 'Nederlands' },
  portuguese: { flag: '🇵🇹', iso: 'PT', name: 'Português' },
  swedish: { flag: '🇸🇪', iso: 'SV', name: 'Svenska' },
  norwegian: { flag: '🇳🇴', iso: 'NO', name: 'Norsk' },
  danish: { flag: '🇩🇰', iso: 'DA', name: 'Dansk' },
  finnish: { flag: '🇫🇮', iso: 'FI', name: 'Suomi' },
  polish: { flag: '🇵🇱', iso: 'PL', name: 'Polski' },
  czech: { flag: '🇨🇿', iso: 'CS', name: 'Čeština' },
  romanian: { flag: '🇷🇴', iso: 'RO', name: 'Română' },
  hungarian: { flag: '🇭🇺', iso: 'HU', name: 'Magyar' },
  greek: { flag: '🇬🇷', iso: 'EL', name: 'Ελληνικά' },
  hebrew: { flag: '🇮🇱', iso: 'HE', name: 'עברית' },
  thai: { flag: '🇹🇭', iso: 'TH', name: 'ไทย' },
  vietnamese: { flag: '🇻🇳', iso: 'VI', name: 'Tiếng Việt' },
  hindi: { flag: '🇮🇳', iso: 'HI', name: 'हिन्दी' },
  albanian: { flag: '🇦🇱', iso: 'SQ', name: 'Shqip' },
  bosnian: { flag: '🇧🇦', iso: 'BS', name: 'Bosanski' },
  bulgarian: { flag: '🇧🇬', iso: 'BG', name: 'Български' },
  uzbek: { flag: '🇺🇿', iso: 'UZ', name: 'Oʻzbekcha' },
  swahili: { flag: '🇰🇪', iso: 'SW', name: 'Kiswahili' },
  tamil: { flag: '🇮🇳', iso: 'TA', name: 'தமிழ்' },
  telugu: { flag: '🇮🇳', iso: 'TE', name: 'తెలుగు' },
  malayalam: { flag: '🇮🇳', iso: 'ML', name: 'മലയാളം' },
  kannada: { flag: '🇮🇳', iso: 'KN', name: 'ಕನ್ನಡ' },
  marathi: { flag: '🇮🇳', iso: 'MR', name: 'मराठी' },
  punjabi: { flag: '🇵🇰', iso: 'PA', name: 'ਪੰਜਾਬੀ' },
  kyrgyz: { flag: '🇰🇬', iso: 'KY', name: 'Кыргызча' },
  kazakh: { flag: '🇰🇿', iso: 'KK', name: 'Қазақша' },
  tajik: { flag: '🇹🇯', iso: 'TG', name: 'Tojikī' },
  tatar: { flag: '🇷🇺', iso: 'TT', name: 'Татарcha' },
  uighur: { flag: '🇨🇳', iso: 'UG', name: 'ئۇيغۇرچە' },
  latin: { flag: '📜', iso: 'LA', name: 'Latina (Transliteration)' },
};

/**
 * Normalizes language name to match configuration keys.
 */
const normalizeLanguageName = (name: string): string => {
  return name.toLowerCase().trim();
};

/**
 * Gets metadata for a specific language.
 * Falls back to default '🌐' and '??' if not found.
 */
export const getLanguageMeta = (languageName?: string): LanguageMeta => {
  if (!languageName) return { flag: '🌐', iso: '??', name: 'Unknown' };
  
  const normalized = normalizeLanguageName(languageName);
  
  // Try exact match
  if (LANGUAGE_CONFIG[normalized]) {
    return LANGUAGE_CONFIG[normalized];
  }
  
  // Try partial match (e.g., "indonesian (kemenag)" -> "indonesian")
  for (const key in LANGUAGE_CONFIG) {
    if (normalized.includes(key)) {
      return LANGUAGE_CONFIG[key];
    }
  }
  
  return { flag: '🌐', iso: '??', name: languageName };
};
