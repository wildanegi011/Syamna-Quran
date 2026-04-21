/**
 * Normalizes Arabic transliteration characters to standard Indonesian equivalents.
 * E.g., "Al-Qur`ān" -> "Al-Quran"
 */
export function normalizeArabicLatin(text: string): string {
    if (!text) return "";

    return text
        // Replace special characters with standard ones
        .replace(/[āāâáà]/g, "a")
        .replace(/[īīîíì]/g, "i")
        .replace(/[ūūûúù]/g, "u")
        .replace(/[Ḥḥ]/g, "h")
        .replace(/[Ṣṣ]/g, "s")
        .replace(/[Ḍḍ]/g, "d")
        .replace(/[Ṭṭ]/g, "t")
        .replace(/[Ẓẓ]/g, "z")
        // Handle backticks and special apostrophes
        .replace(/[`]/g, "")
        .replace(/[’'']/g, "'")
        // Specific term corrections if needed
        .replace(/Al-Quran/gi, "Al-Quran")
        .replace(/Al-Qur'an/gi, "Al-Quran")
        .trim();
}
