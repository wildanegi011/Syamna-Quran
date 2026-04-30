"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllSurahs, getSurahPage, getSurahTafsir, getJuzPage, getReciters, getTranslations, getTafsirResources, getChapterInfo } from "@/lib/quran";
import { useSettings } from "@/contexts/SettingsContext";

const QURAN_BASE_KEY = ['quran'] as const;

export const quranKeys = {
    all: QURAN_BASE_KEY,
    surahs: () => [...QURAN_BASE_KEY, 'surahs'],
    reciters: () => [...QURAN_BASE_KEY, 'reciters'],
    translations: () => [...QURAN_BASE_KEY, 'translations'],
    tafsirs: () => [...QURAN_BASE_KEY, 'tafsirs'],
    surahDetail: (nomor: any, reciter: any, trans: any, mushaf: any) => 
        [...QURAN_BASE_KEY, 'surah', nomor ?? 0, reciter ?? '7', trans ?? 33, mushaf ?? 4],
    surahTafsir: (nomor: any, tafsirId: any) => 
        [...QURAN_BASE_KEY, 'tafsir', nomor ?? 0, tafsirId ?? 0],
    juzDetail: (nomor: any, reciter: any, trans: any, mushaf: any) => 
        [...QURAN_BASE_KEY, 'juz', nomor ?? 0, reciter ?? '7', trans ?? 33, mushaf ?? 4],
    chapterInfo: (nomor: any) => [...QURAN_BASE_KEY, 'chapterInfo', nomor ?? 0],
};

/**
 * Hook to fetch the list of all available reciters (Qori).
 */
export function useReciters() {
    return useQuery({
        queryKey: quranKeys.reciters(),
        queryFn: getReciters,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook to fetch the list of all available translations.
 */
export function useTranslations() {
    return useQuery({
        queryKey: quranKeys.translations(),
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
        queryKey: quranKeys.tafsirs(),
        queryFn: getTafsirResources,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook to fetch the list of all Surahs.
 */
export function useSurahs() {
    return useQuery({
        queryKey: quranKeys.surahs(),
        queryFn: getAllSurahs,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Infinite query hook for surah detail with pagination.
 */
export function useSurahDetail(surahNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId, mushafId } = useSettings();

    const query = useInfiniteQuery({
        queryKey: quranKeys.surahDetail(surahNumber, selectedReciterId, translationId, mushafId),
        queryFn: ({ pageParam }) => getSurahPage(surahNumber, selectedReciterId, translationId, pageParam, mushafId),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage ?? undefined,
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60,
    });

    const pages = query.data?.pages;
    const allAyats = pages ? pages.flatMap(p => p?.ayats ?? []) : [];
    const surahMeta = (pages && pages.length > 0) ? pages[0]?.surahMeta : undefined;
    const pagination = (pages && pages.length > 0) ? pages[pages.length - 1]?.pagination : undefined;

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
        queryKey: quranKeys.surahTafsir(surahNumber, tafsirId!),
        queryFn: () => getSurahTafsir(surahNumber, tafsirId!),
        enabled: enabled && !!surahNumber && !!tafsirId,
        staleTime: 1000 * 60 * 60,
    });
}

/**
 * Infinite query hook for juz detail with pagination.
 */
export function useJuzDetail(juzNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId, mushafId } = useSettings();

    const query = useInfiniteQuery({
        queryKey: quranKeys.juzDetail(juzNumber, selectedReciterId, translationId, mushafId),
        queryFn: ({ pageParam }) => getJuzPage(juzNumber, selectedReciterId, translationId, pageParam, mushafId),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage ?? undefined,
        enabled: enabled && !!juzNumber,
        staleTime: 1000 * 60 * 60,
    });

    const pages = query.data?.pages;
    const allAyats = pages ? pages.flatMap(p => p?.ayats ?? []) : [];
    const lastPage = (pages && pages.length > 0) ? pages[pages.length - 1] : undefined;

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
        queryKey: quranKeys.chapterInfo(surahNumber),
        queryFn: () => getChapterInfo(surahNumber),
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}
