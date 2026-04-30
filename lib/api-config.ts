/**
 * API Configuration
 * Centralizes all API endpoints and keys from environment variables.
 */

export const CONFIG = {

  /**
   * Next Public URL - Used for Next.js URL.
   */
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",

  /**
   * EQuran.id API - Used for Quran surahs, ayats, and tafsir.
   * Falls back to v2 if not specified.
   */
  EQURAN_API: process.env.NEXT_PUBLIC_EQURAN_API || "https://equran.id/api",

  /**
   * AlQuran Cloud API (Aladhan) - Used for supplemental Quran data like Juz.
   */
  ALQURAN_CLOUD_API: process.env.NEXT_PUBLIC_ALQURAN_CLOUD_API || "https://api.alquran.cloud/v1",

  /**
   * Islamic API (HadeethEnc) - Used for Hadith data.
   */
  HADIST_API: process.env.NEXT_PUBLIC_HADIST_API || "https://hadeethenc.com/api/v1",

  /**
   * Islamic API V2 - General purpose Islamic data.
   */
  ISLAMIC_API_V2: process.env.NEXT_PUBLIC_ISLAMIC_API_V2 || "https://islamic-api.vwxyz.id/v2",

  /**
   * Islamic API V1 - Usually requires an API key.
   */
  ISLAMIC_API: process.env.NEXT_PUBLIC_ISLAMIC_API || "https://islamicapi.com/api/v1",
  ISLAMIC_API_KEY: process.env.NEXT_PUBLIC_ISLAMIC_API_KEY || "",

  /**
   * Quran Foundation API - Used for Quran.
   */
  QURAN_FOUNDATION_API: process.env.QURAN_FOUNDATION_API || "https://api.quranfoundation.org",
  QURAN_FOUNDATION_OAUTH: process.env.QURAN_FOUNDATION_OAUTH || "https://oauth2.quran.foundation",
  QURAN_FOUNDATION_CLIENT_ID: process.env.QURAN_FOUNDATION_CLIENT_ID || "",
  QURAN_FOUNDATION_CLIENT_SECRET: process.env.QURAN_FOUNDATION_CLIENT_SECRET || "",
  QURAN_FOUNDATION_REDIRECT_URI: process.env.QURAN_FOUNDATION_REDIRECT_URI || `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/quran/auth/callback`,
  QURAN_FOUNDATION_MUSHAF_ID: Number(process.env.NEXT_PUBLIC_QF_MUSHAF_ID) || 4,
};