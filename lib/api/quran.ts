/**
 * Fetches the list of all available recitations from internal API.
 */
export async function fetchRecitations() {
    const response = await fetch(`/api/quran/resources/recitations?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch Reciters from QF`);
    return await response.json();
}

/**
 * Fetches the list of all available translations from internal API.
 */
export async function fetchTranslations() {
    const response = await fetch(`/api/quran/resources/translations?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch translations from QF`);
    return await response.json();
}

/**
 * Fetches the list of all available tafsir resources from internal API.
 */
export async function fetchTafsirResources() {
    const response = await fetch(`/api/quran/resources/tafsirs?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch Tafsir resources from QF`);
    return await response.json();
}

/**
 * Fetches the list of supported languages from internal API.
 */
export async function fetchLanguages() {
    const response = await fetch(`/api/quran/resources/languages?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch languages from QF`);
    return await response.json();
}

/**
 * Fetches the list of all surahs (chapters) from internal API.
 */
export async function fetchChapters() {
    const response = await fetch(`/api/quran/chapters?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch chapters from QF`);
    return await response.json();
}

/**
 * Fetches a page of verses for a specific surah from internal API.
 * Supports pagination via `page` parameter.
 */
export async function fetchSurahVerses(nomor: number, reciterId: string, translationId: number = 33, page: number = 1, perPage: number = 50) {
    const response = await fetch(
        `/api/quran/verses/by_chapter/${nomor}?language=id&per_page=${perPage}&page=${page}&translations=${translationId}&audio=${reciterId}&fields=text_uthmani,text_uthmani_tajweed`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch verses for surah ${nomor} from Quran Foundation`);
    }
    return await response.json();
}

/**
 * Fetches a page of verses for a specific juz from internal API.
 * Supports pagination via `page` parameter.
 */
export async function fetchJuzVerses(nomor: number, reciterId: string, translationId: number = 33, page: number = 1, perPage: number = 50) {
    const response = await fetch(
        `/api/quran/verses/by_juz/${nomor}?language=id&per_page=${perPage}&page=${page}&translations=${translationId}&audio=${reciterId}&fields=text_uthmani,text_uthmani_tajweed`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch verses for juz ${nomor} from Quran Foundation`);
    }
    return await response.json();
}

/**
 * Fetches tafsir for a specific surah from Quran Foundation.
 * @param nomor The surah number
 * @param tafsirId The tafsir resource ID
 */
export async function fetchSurahTafsirFromQF(nomor: number, tafsirId: number) {
    const response = await fetch(`/api/quran/tafsirs/${tafsirId}/by_chapter/${nomor}`);
    if (!response.ok) throw new Error(`Failed to fetch tafsir ${tafsirId} for surah ${nomor} from Quran Foundation`);
    return await response.json();
}

/**
 * @deprecated Use fetchSurahTafsirFromQF
 */
export async function fetchTafsir(nomor: number) {
    const response = await fetch(`/api/tafsir/${nomor}`);
    if (!response.ok) throw new Error(`Failed to fetch tafsir for surah ${nomor}`);
    return await response.json();
}

/**
 * Fetches information about a specific surah (chapter) from internal API.
 * @param nomor The surah number
 */
export async function fetchChapterInfo(nomor: number) {
    const response = await fetch(`/api/quran/chapters/${nomor}/info?language=id`);
    if (!response.ok) throw new Error(`Failed to fetch info for surah ${nomor} from Quran Foundation`);
    return await response.json();
}