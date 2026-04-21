/**
 * API Configuration
 * Centralizes all API endpoints and keys from environment variables.
 */

export const CONFIG = {
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
};
