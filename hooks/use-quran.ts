"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllSurahs, getSurahDetail, getSurahTafsir, getJuzDetail, getReciters } from "@/lib/quran";

/**
 * Hook to fetch the list of all available reciters (Qori).
 */
export function useReciters() {
    return useQuery({
        queryKey: ["reciters"],
        queryFn: getReciters,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours - Reciters list changes very rarely
    });
}

/**
 * Hook to fetch the list of all Surahs.
 * Cached globally to ensure consistent data across sidebar, grid, and search.
 */
export function useSurahs() {
    return useQuery({
        queryKey: ["surahs"],
        queryFn: getAllSurahs,
        staleTime: 1000 * 60 * 10, // 10 minutes - Quran data rarely changes
    });
}

export const POPULAR_RECITERS = [
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

/** Hook to fetch detail for a specific Surah by its number.
 * Pre-fetches a group of popular reciters for instant switching.
 */
export function useSurahDetail(surahNumber: number, selectedReciterId: string = "ar.alafasy") {
    // Ensure the selected reciter is included in the fetch list if not already there
    const reciterIds = [...new Set([selectedReciterId, ...POPULAR_RECITERS])];

    return useQuery({
        queryKey: ["surah", surahNumber, reciterIds],
        queryFn: () => getSurahDetail(surahNumber, reciterIds),
        enabled: !!surahNumber,
        staleTime: 1000 * 60 * 60, // 1 hour
        placeholderData: keepPreviousData,
    });
}

/**
 * Hook to fetch Tafsir for a specific Surah by its number.
 * Usually dependent on the Surah detail being fetched.
 */
export function useSurahTafsir(surahNumber: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ["tafsir", surahNumber],
        queryFn: () => getSurahTafsir(surahNumber),
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

/**
 * Hook to fetch detail for a specific Juz by its number.
 */
export function useJuzDetail(juzNumber: number, selectedReciterId: string = "ar.alafasy") {
    // For Juz, we reduce the pre-fetch list to avoid hitting API size limits (Juz data is large)
    const JUZ_PREFETCH_RECITERS = ['ar.alafasy', 'ar.abdurrahmaansudais', 'ar.mahermuaiqly'];
    const reciterIds = [...new Set([selectedReciterId, ...JUZ_PREFETCH_RECITERS])];

    return useQuery({
        queryKey: ["juz", juzNumber, reciterIds],
        queryFn: () => getJuzDetail(juzNumber, reciterIds),
        enabled: !!juzNumber,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}
