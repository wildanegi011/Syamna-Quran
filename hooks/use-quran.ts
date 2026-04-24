"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllSurahs, getSurahPage, getSurahTafsir, getJuzPage, getReciters, getTranslations, getTafsirResources, getChapterInfo } from "@/lib/quran";
import { useSettings } from "@/contexts/SettingsContext";

/**
 * Hook to fetch the list of all available reciters (Qori).
 */
export function useReciters() {
    return useQuery({
        queryKey: ["reciters"],
        queryFn: getReciters,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook to fetch the list of all available translations.
 */
export function useTranslations() {
    return useQuery({
        queryKey: ["translations"],
        queryFn: getTranslations,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        placeholderData: keepPreviousData,
    });
}

/**
 * Hook to fetch the list of all available tafsir resources.
 */
export function useTafsirResources() {
    return useQuery({
        queryKey: ["tafsirs"],
        queryFn: getTafsirResources,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}


/**
 * Hook to fetch the list of all Surahs.
 */
export function useSurahs() {
    return useQuery({
        queryKey: ["surahs"],
        queryFn: getAllSurahs,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Infinite query hook for surah detail with pagination.
 * Flattens all pages into a single ayat array for easy consumption.
 */
export function useSurahDetail(surahNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId } = useSettings();

    const query = useInfiniteQuery({
        queryKey: ["surah", surahNumber, selectedReciterId, translationId],
        queryFn: ({ pageParam }) => getSurahPage(surahNumber, selectedReciterId, translationId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage ?? undefined,
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60,
    });

    // Flatten pages into a single data object matching the old interface
    const allAyats = query.data?.pages?.flatMap(p => p?.ayats ?? []) ?? [];
    const surahMeta = query.data?.pages?.[0]?.surahMeta;
    const pagination = query.data?.pages?.[query.data.pages.length - 1]?.pagination;

    const data = surahMeta ? {
        ...surahMeta,
        ayat: allAyats,
        suratSebelum: false,
        suratSesudah: false,
    } : undefined;

    return {
        data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        pagination,
    };
}

/**
 * Hook to fetch Tafsir for a specific Surah.
 */
export function useSurahTafsir(surahNumber: number, enabled: boolean = true, tafsirId?: number) {
    return useQuery({
        queryKey: ["tafsir", surahNumber, tafsirId],
        queryFn: () => getSurahTafsir(surahNumber, tafsirId!),
        enabled: enabled && !!surahNumber && !!tafsirId,
        staleTime: 1000 * 60 * 60,
    });
}

/**
 * Infinite query hook for juz detail with pagination.
 */
export function useJuzDetail(juzNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId } = useSettings();

    const query = useInfiniteQuery({
        queryKey: ["juz", juzNumber, selectedReciterId, translationId],
        queryFn: ({ pageParam }) => getJuzPage(juzNumber, selectedReciterId, translationId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage ?? undefined,
        enabled: enabled && !!juzNumber,
        staleTime: 1000 * 60 * 60,
    });

    const allAyats = query.data?.pages?.flatMap(p => p?.ayats ?? []) ?? [];
    const lastPage = query.data?.pages?.[query.data.pages.length - 1];

    const data = juzNumber ? {
        nomor: juzNumber,
        ayat: allAyats,
    } : undefined;

    return {
        data: query.data ? data : undefined,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        pagination: lastPage?.pagination,
    };
}

/**
 * Hook to fetch information about a specific Surah (Chapter Info).
 */
export function useChapterInfo(surahNumber: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ["chapterInfo", surahNumber],
        queryFn: () => getChapterInfo(surahNumber),
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

