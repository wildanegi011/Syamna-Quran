/**
 * Core types and interfaces for Syamna Quran.
 * Consolidated from various modules to ensure consistency across the app.
 */

// --- Application Modules (Landing Page) ---


export interface SurahSummary {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    audioFull: Record<string, string>;
    juz?: number;
    ayatsajdah?: boolean;
    revelationType?: string; // Aladhan field
}

export interface AppModule {
    id: number;
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
    display_order: number;
}

// --- Iqro Module ---

export interface IqroLevel {
    level_number: number;
    title: string;
    description: string;
    color: string;
    is_disabled: boolean;
}

export interface IqroSection {
    section_id: number;
    text: string;
    latin?: string;
    audioUrl?: string;
}

export interface IqroPageData {
    page_number: number;
    level_id: number;
    level_title: string;
    basmallah?: string;
    instruction?: string;
    name?: string;
    sections: IqroSection[];
}

export interface HijaiyahLetter {
    order_id: number;
    arabic: string;
    latin: string;
    audioUrl?: string;
}

export type IqroItem = HijaiyahLetter;

// --- Quran Module (EQuran.id API) ---

export interface AyahAudio {
    url: string;
    segments?: (string | number)[][];
}

export interface Ayah {
    nomorAyat: number;
    numberGlobal?: number; // Absolute ayah number (1-6236)
    verseKey?: string;
    teksArab: string;
    teksTajweed?: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: Record<string, AyahAudio>;
    hizbNumber?: number;
    rubElHizbNumber?: number;
    rukuNumber?: number;
    manzilNumber?: number;
    sajdahNumber?: number | null;
    pageNumber?: number;
    juzNumber?: number;
    surahInfo?: {
        nomor: number;
        namaLatin: string;
    };
}

export interface SurahDetail extends SurahSummary {
    ayat: Ayah[];
    suratSebelum: SurahSummary | boolean;
    suratSesudah: SurahSummary | boolean;
}

export interface TafsirAyah {
    ayat: number;
    teks: string;
}

export interface SurahTafsir extends SurahSummary {
    tafsir: TafsirAyah[];
    suratSebelum: SurahSummary | boolean;
    suratSesudah: SurahSummary | boolean;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// --- Aladhan API Types (for Juz support) ---

export interface AladhanAyah {
    number: number;
    text: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
        numberOfAyahs: number;
    };
    numberInSurah: number;
    juz: number;
    manzil: number;
    page: number;
    ruku: number;
    hizbQuarter: number;
    sajda: boolean;
}

export interface AladhanJuzResponse {
    number: number;
    ayahs: AladhanAyah[];
    edition: {
        identifier: string;
        language: string;
        name: string;
        englishName: string;
        format: string;
        type: string;
        direction?: string;
    };
}

export interface JuzDetail {
    nomor: number;
    ayat: Ayah[];
}

// --- Aladhan Enhanced Types ---

export interface AladhanSurah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: AladhanAyah[];
    edition: {
        identifier: string;
        language: string;
        name: string;
        englishName: string;
        format: string;
        type: string;
        direction?: string;
    };
}

export interface Reciter {
    id: string;
    name: string;
    style?: string;
}

// --- Spiritual & Daily (Asmaul Husna & Doa) ---

export interface AsmaulHusnaItem {
    index: number;
    arabic: string;
    latin: string;
    translation: string;
}

export interface DoaCollection {
    id: string;
    title: string;
    description: string;
    count: number;
    color: string;
    href: string;
    icon: string;
}

export interface DoaItem {
    id: number;
    grup: string;
    nama: string;
    ar: string;
    tr: string;
    idn: string;
    tag: string[];
}

export interface DoaDetail extends DoaItem {
    tentang: string;
    tag: string[];
}

// --- Hadith Module (HadeethEnc API) ---

export interface HadithCategory {
    id: string;
    title: string;
    hadeeths_count: string;
    parent_id: string | null;
}

export interface HadithSummary {
    id: string;
    title: string;
    attribution?: string;
    grade?: string;
    hadeeth?: string;
    hadeeth_ar?: string;
}

export interface HadithDetail {
    id: string;
    title: string;
    hadeeth: string;
    attribution: string;
    grade: string;
    explanation: string;
    hints: string[];
    categories: string[];
    translations: string[];
    hadeeth_ar: string;
    explanation_ar?: string;
    attribution_ar?: string;
    grade_ar?: string;
}

// --- Prayer Schedule (EQuran.id API) ---

export interface PrayerSchedule {
    tanggal: number;
    tanggal_lengkap: string;
    hari: string;
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export interface PrayerScheduleData {
    provinsi: string;
    kabkota: string;
    bulan: number;
    tahun: number;
    jadwal: PrayerSchedule[];
}

export interface PrayerApiResponse<T> {
    code: number;
    message: string;
    data: T;
}




export interface Reciters {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format?: string;
    type?: string;
}

export interface Language {
    id: number;
    name: string;
    isoCode: string;
    nativeName: string;
    direction: string;
    translationsCount?: number;
}

export interface Translation {
    id: number;
    name: string;
    authorName: string;
    slug: string;
    languageName: string;
    translatedName?: {
        name: string;
        languageName: string;
    };
}

export interface TafsirResource {
    id: number;
    name: string;
    authorName: string;
    slug: string;
    languageName: string;
    translatedName?: {
        name: string;
        languageName: string;
    };
}


export interface QuranCloudResponse<T> {
    code: number;
    status: string;
    data: T;
}
