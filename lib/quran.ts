import { ApiResponse, SurahSummary, SurahDetail, SurahTafsir, JuzDetail, Ayah, Reciters, AyahAudio, Translation, Language, TafsirResource } from "./types";
import { stripHtml } from "./utils";
import { fetchRecitations, fetchSurahVerses, fetchJuzVerses, fetchSurahTafsirFromQF, fetchTranslations, fetchLanguages, fetchChapters, fetchTafsirResources, fetchChapterInfo, fetchIndonesianTafsir } from "./api/quran";
import surahSummaryData from "./data/surahs.json";

const QF_AUDIO_BASE = "https://verses.quran.com";

function buildAudioUrl(endpoint: string): string {
    if (!endpoint) return "";
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
    if (endpoint.startsWith('//')) return `https:${endpoint}`;
    return `${QF_AUDIO_BASE}/${endpoint}`;
}

/**
 * Helper to get data from LocalStorage with expiry check.
 */
function getCachedData<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
        const cached = localStorage.getItem(`syamna_cache_${key}`);
        if (!cached) return null;

        const { data, expiry } = JSON.parse(cached);
        if (Date.now() > expiry) {
            localStorage.removeItem(`syamna_cache_${key}`);
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}

/**
 * Helper to save data to LocalStorage with expiry.
 */
function setCachedData<T>(key: string, data: T, ttlHours: number = 24): void {
    if (typeof window === 'undefined') return;
    try {
        const payload = {
            data,
            expiry: Date.now() + (ttlHours * 60 * 60 * 1000)
        };
        localStorage.setItem(`syamna_cache_${key}`, JSON.stringify(payload));
    } catch (e) {
        // Silently fail
    }
}

/**
 * Fetches the list of all available Qoris (reciters) purely from API.
 */
export async function getReciters(): Promise<Reciters[]> {
    const cached = getCachedData<Reciters[]>('recitations');
    if (cached) return cached;

    try {
        const result = await fetchRecitations();

        // Map strictly from QF API parameters
        const mappedData = (result.recitations as any[])
            .map(r => ({
                identifier: r.id.toString(),
                language: 'ar',
                name: r.reciter_name,
                englishName: r.translated_name?.name || r.reciter_name,
                format: 'audio',
                type: r.style || 'Murattal'
            }));

        setCachedData('recitations', mappedData);
        return mappedData;
    } catch (error) {
        console.error(`Error fetching Reciters:`, error);
        return [];
    }
}

/**
 * Fetches the list of all available translations from Quran Foundation.
 */
export async function getTranslations(): Promise<Translation[]> {
    const cached = getCachedData<Translation[]>('translations');
    if (cached) return cached;

    try {
        const result = await fetchTranslations();
        const mappedData = (result.translations as any[]).map(t => ({
            id: t.id,
            name: t.name,
            authorName: t.author_name,
            slug: t.slug,
            languageName: t.language_name,
            translatedName: t.translated_name
        }));

        setCachedData('translations', mappedData);
        return mappedData;
    } catch (error) {
        console.error(`Error fetching translations:`, error);
        return [];
    }
}

/**
 * Virtual Tafsir resource for Indonesian localized content.
 * Handled via equran.id local proxy instead of Quran Foundation.
 */
const VIRTUAL_ID_TAFSIR_KEMENAG = 999;
const INDONESIAN_VIRTUAL_TAFSIRS: TafsirResource[] = [
    {
        id: VIRTUAL_ID_TAFSIR_KEMENAG,
        name: "Tafsir Kemenag",
        authorName: "Kementerian Agama RI",
        slug: "id-tafsir-kemenag",
        languageName: "indonesian",
        translatedName: {
            name: "Tafsir Kemenag",
            languageName: "indonesian"
        }
    }
];

/**
 * Fetches the list of all available tafsir resources from Quran Foundation.
 */
export async function getTafsirResources(): Promise<TafsirResource[]> {
    const cached = getCachedData<TafsirResource[]>('tafsir_resources');
    if (cached) return [...INDONESIAN_VIRTUAL_TAFSIRS, ...cached];

    try {
        const result = await fetchTafsirResources();
        const mappedData = (result.tafsirs as any[]).map(t => ({
            id: t.id,
            name: t.name,
            authorName: t.author_name,
            slug: t.slug,
            languageName: t.language_name,
            translatedName: t.translated_name
        }));

        setCachedData('tafsir_resources', mappedData);
        return [...INDONESIAN_VIRTUAL_TAFSIRS, ...mappedData];
    } catch (error) {
        console.error(`Error fetching tafsir resources:`, error);
        return INDONESIAN_VIRTUAL_TAFSIRS;
    }
}

/**
 * Fetches the list of all supported languages from Quran Foundation.
 */
export async function getLanguages(): Promise<Language[]> {
    try {
        const result = await fetchLanguages();
        return (result.languages as any[]).map(l => ({
            id: l.id,
            name: l.name,
            isoCode: l.iso_code,
            nativeName: l.native_name,
            direction: l.direction,
            translationsCount: l.translations_count
        }));
    } catch (error) {
        console.error(`Error fetching languages:`, error);
        return [];
    }
}


/**
 * Returns the list of all surahs directly from Quran Foundation API.
 */
export async function getAllSurahs(): Promise<SurahSummary[]> {
    const cached = getCachedData<SurahSummary[]>('surahs');
    if (cached) return cached;

    try {
        const result = await fetchChapters();
        const mappedData = (result.chapters as any[]).map(s => ({
            nomor: s.id,
            nama: s.name_arabic,
            namaLatin: s.name_simple,
            jumlahAyat: s.verses_count,
            tempatTurun: s.revelation_place === 'makkah' ? 'Mekah' : 'Madinah',
            arti: s.translated_name?.name || '',
            deskripsi: '',
            audioFull: {},
            ayatsajdah: [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96].includes(s.id)
        }));

        setCachedData('surahs', mappedData);
        return mappedData;
    } catch (error) {
        console.error("Error in getAllSurahs from API:", error);
        return [];
    }
}

/**
 * Fetches a page of ayats for a specific surah using Quran Foundation API directly.
 */
export async function getSurahPage(
    nomor: number,
    reciterId: string = '7',
    translationId: number = 33,
    page: number = 1,
    mushafId: number = 4
): Promise<{ ayats: Ayah[]; pagination: { currentPage: number; totalPages: number; totalRecords: number; nextPage: number | null }; surahMeta: any } | null> {
    try {
        const versesData = await fetchSurahVerses(nomor, reciterId, translationId, page, 50, mushafId);
        const verses = versesData.verses || [];
        const pag = versesData.pagination || {};

        const ayats: Ayah[] = verses.map((v: any) => {
            const audioMap: Record<string, AyahAudio> = {};
            if (v.audio?.url) {
                audioMap[reciterId] = {
                    url: buildAudioUrl(v.audio.url),
                    segments: v.audio.segments
                };
            }

            return {
                nomorAyat: v.verse_number,
                numberGlobal: v.id,
                verseKey: v.verse_key,
                teksArab: [3, 6, 7].includes(mushafId) ? (v.text_indopak || v.text_uthmani) : v.text_uthmani,
                teksTajweed: v.text_uthmani_tajweed || v.text_uthmani,
                teksLatin: "",
                teksIndonesia: stripHtml(v.translations?.[0]?.text || ""),
                audio: audioMap,
                pageNumber: v.page_number,
                juzNumber: v.juz_number,
                hizbNumber: v.hizb_number,
                rubElHizbNumber: v.rub_el_hizb_number,
                rukuNumber: v.ruku_number,
                manzilNumber: v.manzil_number,
                sajdahNumber: v.sajdah_number
            };
        });

        // Fetch dynamic Surah List from API rather than local JSON
        const allSurahs = await getAllSurahs();
        const localSurah = allSurahs.find(s => s.nomor === nomor);

        return {
            ayats,
            pagination: {
                currentPage: pag.current_page || page,
                totalPages: pag.total_pages || 1,
                totalRecords: pag.total_records || ayats.length,
                nextPage: pag.next_page || null
            },
            surahMeta: localSurah ? {
                nomor: localSurah.nomor,
                nama: localSurah.nama,
                namaLatin: localSurah.namaLatin,
                jumlahAyat: localSurah.jumlahAyat || pag.total_records,
                tempatTurun: localSurah.tempatTurun,
                arti: localSurah.arti,
                deskripsi: localSurah.deskripsi || "",
                audioFull: localSurah.audioFull || {},
                ayatsajdah: localSurah.ayatsajdah || false,
            } : null
        };
    } catch (error) {
        console.error(`Error fetching surah ${nomor} page ${page} from QF:`, error);
        return null;
    }
}

/**
 * Legacy wrapper — fetches ALL ayats (page 1 only for backward compat).
 */
export async function getSurahDetail(nomor: number, reciterId: string = '7', translationId: number = 33): Promise<SurahDetail | null> {
    const result = await getSurahPage(nomor, reciterId, translationId, 1);
    if (!result || !result.surahMeta) return null;

    return {
        ...result.surahMeta,
        ayat: result.ayats,
        suratSebelum: false,
        suratSesudah: false,
    };
}

/**
 * Fetches the tafsir for a specific surah using Quran Foundation API or local equran.id proxy.
 * Maps it to our internal SurahTafsir format.
 * @param nomor The surah number (1-114)
 * @param tafsirId The tafsir resource ID
 */
export async function getSurahTafsir(nomor: number, tafsirId: number): Promise<SurahTafsir | null> {
    try {
        // Handle virtual Indonesian Tafsirs from equran.id
        if (tafsirId === VIRTUAL_ID_TAFSIR_KEMENAG) {
            const result = await fetchIndonesianTafsir(nomor);
            
            if (!result || !result.data) return null;
            const data = result.data;
            
            return {
                nomor,
                id: nomor,
                nama: data.nama || "",
                namaLatin: data.nama_latin || "",
                jumlahAyat: data.jumlah_ayat || 0,
                tafsir: data.tafsir.map((t: any) => ({
                    ayat: t.ayat,
                    teks: t.teks
                })),
                suratSebelum: false,
                suratSesudah: false,
                tempatTurun: data.tempat_turun === 'Mekah' ? 'Mekah' : 'Madinah',
                arti: data.arti || "",
                deskripsi: data.deskripsi || "",
                audioFull: data.audio_full || {}
            } as SurahTafsir;
        }

        const result = await fetchSurahTafsirFromQF(nomor, tafsirId);

        if (!result || !result.tafsirs) return null;

        const localSurah = (surahSummaryData as any[]).find(s => s.nomor === nomor);

        // Map QF structure to our internal SurahTafsir format
        return {
            ...(localSurah || {}),
            id: nomor,
            nomor: nomor,
            nama: localSurah?.nama || "",
            namaLatin: localSurah?.namaLatin || "",
            jumlahAyat: result.tafsirs.length,
            tafsir: result.tafsirs.map((t: any, index: number) => ({
                ayat: index + 1,
                teks: t.text
            })),
            suratSebelum: false,
            suratSesudah: false
        } as SurahTafsir;
    } catch (error) {
        console.error(`Error fetching surah ${nomor} tafsir:`, error);
        return null;
    }
}

/**
 * Fetches the detail of a specific Juz from Aladhan API.
 * Uses parallel (Promise.all) requests for Tajweed, Indonesian translation, and popular reciters
 * to avoid hitting payload size limits with larger Juz.
 * @param nomor The juz number (1-30)
 * @param reciterIds Array of reciter identifiers
 */
export async function getJuzPage(
    nomor: number,
    reciterId: string = '7',
    translationId: number = 33,
    page: number = 1,
    mushafId: number = 4
): Promise<{ ayats: Ayah[]; pagination: { currentPage: number; totalPages: number; totalRecords: number; nextPage: number | null } } | null> {
    try {
        const result = await fetchJuzVerses(nomor, reciterId, translationId, page, 50, mushafId);
        const verses = result.verses || [];
        const pag = result.pagination || {};

        const allSurahs = await getAllSurahs();

        const ayats: Ayah[] = verses.map((v: any) => {
            const [surahNum] = v.verse_key.split(':').map(Number);
            const localSurah = allSurahs.find(s => s.nomor === surahNum);

            const audioMap: Record<string, AyahAudio> = {};
            if (v.audio?.url) {
                audioMap[reciterId] = {
                    url: buildAudioUrl(v.audio.url),
                    segments: v.audio.segments
                };
            }

            return {
                nomorAyat: v.verse_number,
                numberGlobal: v.id,
                verseKey: v.verse_key,
                teksArab: [3, 6, 7].includes(mushafId) ? (v.text_indopak || v.text_uthmani) : v.text_uthmani,
                teksTajweed: v.text_uthmani_tajweed || v.text_uthmani,
                teksLatin: "",
                teksIndonesia: stripHtml(v.translations?.[0]?.text || ""),
                audio: audioMap,
                pageNumber: v.page_number,
                juzNumber: v.juz_number,
                hizbNumber: v.hizb_number,
                rubElHizbNumber: v.rub_el_hizb_number,
                rukuNumber: v.ruku_number,
                manzilNumber: v.manzil_number,
                sajdahNumber: v.sajdah_number,
                surahInfo: {
                    nomor: surahNum,
                    namaLatin: localSurah?.namaLatin || `Surah ${surahNum}`
                }
            };
        });

        return {
            ayats,
            pagination: {
                currentPage: pag.current_page || page,
                totalPages: pag.total_pages || 1,
                totalRecords: pag.total_records || ayats.length,
                nextPage: pag.next_page || null
            }
        };
    } catch (error) {
        console.error(`Error fetching juz ${nomor} page ${page} from QF:`, error);
        return null;
    }
}

/**
 * Legacy wrapper for backward compat.
 */
export async function getJuzDetail(nomor: number, reciterId: string = '7', translationId: number = 33): Promise<JuzDetail | null> {
    const result = await getJuzPage(nomor, reciterId, translationId, 1);
    if (!result) return null;

    return {
        nomor,
        ayat: result.ayats
    };
}

/**
 * Fetches information about a specific surah (chapter).
 * @param nomor The surah number
 */
export async function getChapterInfo(nomor: number) {
    try {
        const result = await fetchChapterInfo(nomor);
        return result.chapter_info;
    } catch (error) {
        console.error(`Error fetching surah ${nomor} info:`, error);
        return null;
    }
}

