import { ApiResponse, SurahSummary, SurahDetail, SurahTafsir, JuzDetail, Ayah, QuranCloudResponse, Reciters } from "./types";
import surahsData from "./data/surahs.json";
import { CONFIG } from "./api-config";

const BASE_URL = `${CONFIG.EQURAN_API}/v2`;
const ALADHAN_BASE_URL = CONFIG.ALQURAN_CLOUD_API;

const POPULAR_RECITERS = [
    'ar.alafasy',
    'ar.abdurrahmaansudais',
    'ar.abdullahbasfar',
    'ar.ahmedajamy',
    'ar.mahermuaiqly',
    'ar.minshawi',
    'ar.husary',
    'ar.muhammadayyoub',
    'ar.saoodshuraym',
    'ar.hanirifai',
    'ar.shaatree',
    'ar.hudhaify',
    'ar.juhany',
    'ar.yasseraldossari'
];

function getSurahBackground(nomor: number, tempatTurun: string): string {
    // Protection/Night surahs
    if (nomor >= 112) return '/backgrounds/nocturnal.png';

    // Nature specifically mentioned
    const natureSurahs = [16, 27, 29, 91, 95];
    if (natureSurahs.includes(nomor)) return '/backgrounds/nature.png';

    // Cosmic/Majesty
    const cosmicSurahs = [1, 55, 56, 67, 78, 81, 82, 84, 85, 86, 87, 88];
    if (cosmicSurahs.includes(nomor)) return '/backgrounds/cosmic.png';

    // Madinan (Geometric/Architectural focus)
    if (tempatTurun === 'Madinah') return '/backgrounds/geometric.png';

    // Default for Meccan (Desert/Ancient theme)
    return '/backgrounds/desert.png';
}

/**
 * Fetches the list of all available Qoris (reciters).
 * Specifically requests audio editions in Arabic and filters for popular ones.
 */
export async function getReciters(): Promise<Reciters[]> {
    try {
        const response = await fetch(`${ALADHAN_BASE_URL}/edition?format=audio&language=ar`, {
            headers: { 'Accept-Encoding': 'gzip, zstd' }
        });
        if (!response.ok) throw new Error(`Failed to fetch Reciters`);

        const result: QuranCloudResponse<Reciters[]> = await response.json();

        // Filter for popular reciters and ensure we only have Latin names for display if needed
        // although Aladhan's englishName is already Latin.
        return result.data.filter(r => POPULAR_RECITERS.includes(r.identifier));
    } catch (error) {
        console.error(`Error fetching Reciters:`, error);
        return [];
    }
}


/**
 * Returns the list of all surahs from local data to ensure Indonesian localization.
 * We use local data for the list view because it's faster and correctly localized 
 * (Indonesian surah names and meanings).
 */
export async function getAllSurahs(): Promise<SurahSummary[]> {
    // We use the local surahsData which already has the Indonesian translations (arti)
    const data = surahsData as SurahSummary[];
    return data.map(s => ({
        ...s,
        background: getSurahBackground(s.nomor, s.tempatTurun)
    }));
}


/**
 * Fetches the detail of a specific surah (including ayats) from Aladhan API.
 * Combines Tajweed text, Indonesian translation, and multiple audio editions in one request.
 * @param nomor The surah number (1-114)
 * @param reciterIds Array of reciter identifiers
 */
export async function getSurahDetail(nomor: number, reciterIds: string[] = ['ar.alafasy']): Promise<SurahDetail | null> {
    try {
        const fetchOptions = {
            headers: { 'Accept-Encoding': 'gzip, zstd' }
        };

        const editions = ['quran-tajweed', 'id.indonesian', ...reciterIds];

        // Fetch aggregate editions
        const response = await fetch(
            `${ALADHAN_BASE_URL}/surah/${nomor}/editions/${editions.join(',')}`,
            fetchOptions
        );

        if (!response.ok)
            throw new Error(`Failed to fetch surah ${nomor} aggregate editions from Aladhan`);

        const result: QuranCloudResponse<any[]> = await response.json();

        // result.data[0] -> quran-tajweed
        // result.data[1] -> id.indonesian
        // result.data[2...] -> audio editions
        const tajweedEd = result.data[0];
        const translationEd = result.data[1];
        const audioEds = result.data.slice(2);

        const ayats: Ayah[] = tajweedEd.ayahs.map((ayah: any, idx: number) => {
            const audioMap: Record<string, string> = {};

            // Map each audio edition by its identifier from the API response
            audioEds.forEach((editionObj: any) => {
                const identifier = editionObj.edition.identifier;
                if (editionObj.ayahs[idx]?.audio) {
                    audioMap[identifier] = editionObj.ayahs[idx].audio;
                }
            });

            return {
                nomorAyat: ayah.numberInSurah,
                numberGlobal: ayah.number,
                teksArab: ayah.text,
                teksTajweed: ayah.text,
                teksLatin: "",
                teksIndonesia: translationEd.ayahs[idx].text,
                audio: audioMap
            };
        });

        // Locate local metadata for Indonesian translation and description
        const localSurah = (surahsData as any[]).find(s => s.nomor === nomor);

        return {
            nomor: tajweedEd.number,
            nama: tajweedEd.name,
            namaLatin: localSurah?.namaLatin || tajweedEd.englishName,
            jumlahAyat: tajweedEd.numberOfAyahs,
            tempatTurun: localSurah?.tempatTurun || (tajweedEd.revelationType === 'Meccan' ? 'Mekah' : 'Madinah'),
            arti: localSurah?.arti || tajweedEd.englishNameTranslation,
            deskripsi: localSurah?.deskripsi || "",
            audioFull: {},
            ayat: ayats,
            suratSebelum: false,
            suratSesudah: false,
            background: getSurahBackground(tajweedEd.number, tajweedEd.revelationType === 'Meccan' ? 'Mekah' : 'Madinah')
        };
    } catch (error) {
        console.error(`Error fetching surah ${nomor} detail:`, error);
        return null;
    }
}

/**
 * Fetches the tafsir of a specific surah from EQuran.id.
 * @param nomor The surah number (1-114)
 */
export async function getSurahTafsir(nomor: number): Promise<SurahTafsir | null> {
    try {
        const response = await fetch(`${BASE_URL}/tafsir/${nomor}`);
        if (!response.ok) throw new Error(`Failed to fetch tafsir for surah ${nomor}`);

        const result: ApiResponse<SurahTafsir> = await response.json();
        return result.data;
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
export async function getJuzDetail(nomor: number, reciterIds: string[] = ['ar.alafasy']): Promise<JuzDetail | null> {
    try {
        const fetchOptions = {
            headers: { 'Accept-Encoding': 'gzip, zstd' }
        };

        // Create a list of all editions we need to fetch
        const targetEditions = ['quran-tajweed', 'id.indonesian', ...reciterIds];

        // Fetch all editions in parallel
        const responses = await Promise.all(
            targetEditions.map(edition =>
                fetch(`${ALADHAN_BASE_URL}/juz/${nomor}/${edition}`, fetchOptions)
                    .then(res => res.ok ? res.json() : null)
                    .catch(err => {
                        console.error(`Failed to fetch ${edition} for juz ${nomor}:`, err);
                        return null;
                    })
            )
        );

        // Map responses back to their roles
        // responses[0] -> quran-tajweed
        // responses[1] -> id.indonesian
        // responses[2...] -> audio editions
        const tajweedData = responses[0]?.data;
        const translationData = responses[1]?.data;
        const audioDataList = responses.slice(2);

        if (!tajweedData || !translationData) {
            throw new Error(`Essential Juz data (text/translation) failed to load for juz ${nomor}`);
        }

        const ayats: Ayah[] = tajweedData.ayahs.map((ayah: any, idx: number) => {
            const audioMap: Record<string, string> = {};

            audioDataList.forEach((resObj: any, audioIdx: number) => {
                if (resObj && resObj.data && resObj.data.ayahs[idx]?.audio) {
                    const identifier = targetEditions[audioIdx + 2]; // +2 because first 2 are non-audio
                    audioMap[identifier] = resObj.data.ayahs[idx].audio;
                }
            });

            return {
                nomorAyat: ayah.numberInSurah,
                numberGlobal: ayah.number,
                teksArab: ayah.text,
                teksTajweed: ayah.text,
                teksLatin: "",
                teksIndonesia: translationData.ayahs[idx].text,
                audio: audioMap,
                surahInfo: {
                    nomor: ayah.surah.number,
                    namaLatin: (surahsData as any[]).find(s => s.nomor === ayah.surah.number)?.namaLatin || ayah.surah.englishName
                }
            };
        });

        return {
            nomor: tajweedData.number,
            ayat: ayats
        };
    } catch (error) {
        console.error(`Error fetching juz ${nomor} detail in parallel:`, error);
        return null;
    }
}
