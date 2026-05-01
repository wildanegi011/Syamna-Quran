export const TRANSLATIONS = {
    ID: {
        // General
        beranda: "Beranda",
        quran: "Al-Quran",
        hadits: "Hadits",
        doa: "Doa",
        asmaulHusna: "Asmaul Husna",
        sholat: "Jadwal Sholat",
        masuk: "Masuk",
        keluar: "Keluar",
        pengaturan: "Pengaturan",
        profil: "Profil Saya",
        cari: "Cari...",
        cariSurah: "Cari Surah atau Juz...",
        cariHadits: "Cari Kategori Hadits...",
        cariDoa: "Cari Doa...",
        cariAsmaul: "Cari Asmaul Husna...",
        
        // Settings
        tampilan: "Tampilan",
        ukuranFont: "Ukuran Font",
        hurufArab: "Huruf Arab",
        terjemahan: "Terjemahan",
        warnaTajweed: "Warna Tajweed",
        latin: "Latin (Transliterasi)",
        jenisMushaf: "Jenis Mushaf",
        audio: "Audio",
        tafsir: "Tafsir",
        pratinjau: "Pratinjau Tampilan",
        
        // Quran
        ayat: "Ayat",
        tafsirAyat: "Tafsir Ayat",
        salin: "Salin",
        tersalin: "Tersalin",
        tandai: "Tandai",
        ditandai: "Ditandai",
        putarAyat: "Putar Ayat",
        bacaSekarang: "Baca Sekarang",
        terakhirBaca: "Terakhir Baca",
        juz: "Juz",
    },
    EN: {
        // General
        beranda: "Home",
        quran: "Al-Quran",
        hadits: "Hadith",
        doa: "Supplication",
        asmaulHusna: "Asmaul Husna",
        sholat: "Prayer Times",
        masuk: "Sign In",
        keluar: "Sign Out",
        pengaturan: "Settings",
        profil: "My Profile",
        cari: "Search...",
        cariSurah: "Search Surah or Juz...",
        cariHadits: "Search Hadith Categories...",
        cariDoa: "Search Supplications...",
        cariAsmaul: "Search Asmaul Husna...",
        
        // Settings
        tampilan: "Appearance",
        ukuranFont: "Font Size",
        hurufArab: "Arabic Script",
        terjemahan: "Translation",
        warnaTajweed: "Tajweed Colors",
        latin: "Latin (Transliteration)",
        jenisMushaf: "Mushaf Type",
        audio: "Audio",
        tafsir: "Commentary",
        pratinjau: "Display Preview",
        
        // Quran
        ayat: "Verse",
        tafsirAyat: "Verse Commentary",
        salin: "Copy",
        tersalin: "Copied",
        tandai: "Bookmark",
        ditandai: "Bookmarked",
        putarAyat: "Play Verse",
        bacaSekarang: "Read Now",
        terakhirBaca: "Last Read",
        juz: "Juz",
    }
};

export type Language = keyof typeof TRANSLATIONS;
export type TranslationKey = keyof typeof TRANSLATIONS.ID;

export const useTranslation = (lang: Language) => {
    const t = (key: TranslationKey) => {
        const dict = TRANSLATIONS[lang] || TRANSLATIONS.ID;
        return dict[key] || key;
    };
    return { t };
};
