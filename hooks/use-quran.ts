"use client";

import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { getAllSurahs, getSurahPage, getSurahTafsir, getJuzPage, getReciters, getTranslations, getTafsirResources, getChapterInfo } from "@/lib/quran";
import { useSettings } from "@/contexts/SettingsContext";

const QURAN_BASE_KEY = ['quran'] as const;

export const quranKeys = {
    all: QURAN_BASE_KEY,
    surahs: (lang: string) => [...QURAN_BASE_KEY, 'surahs', lang],
    reciters: (lang: string) => [...QURAN_BASE_KEY, 'reciters', lang],
    translations: (lang: string) => [...QURAN_BASE_KEY, 'translations', lang],
    tafsirs: (lang: string) => [...QURAN_BASE_KEY, 'tafsirs', lang],
    surahDetail: (nomor: any, reciter: any, trans: any, mushaf: any, lang: string) => 
        [...QURAN_BASE_KEY, 'surah', nomor ?? 0, reciter ?? '7', trans ?? 33, mushaf ?? 4, lang],
    surahTafsir: (nomor: any, tafsirId: any, lang: string) => 
        [...QURAN_BASE_KEY, 'tafsir', nomor ?? 0, tafsirId ?? 0, lang],
    juzDetail: (nomor: any, reciter: any, trans: any, mushaf: any, lang: string) => 
        [...QURAN_BASE_KEY, 'juz', nomor ?? 0, reciter ?? '7', trans ?? 33, mushaf ?? 4, lang],
    chapterInfo: (nomor: any, lang: string) => [...QURAN_BASE_KEY, 'chapterInfo', nomor ?? 0, lang],
};

/**
 * Hook to fetch the list of all available reciters (Qori).
 */
export function useReciters() {
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.reciters(language),
        queryFn: () => getReciters(language),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook to fetch the list of all available translations.
 */
export function useTranslations() {
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.translations(language),
        queryFn: () => getTranslations(language),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        placeholderData: keepPreviousData,
    });
}

/**
 * Hook to fetch the list of all available tafsir resources.
 */
export function useTafsirResources() {
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.tafsirs(language),
        queryFn: () => getTafsirResources(language),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

/**
 * Hook to fetch the list of all Surahs.
 */
export function useSurahs() {
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.surahs(language),
        queryFn: () => getAllSurahs(language),
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Infinite query hook for surah detail with pagination.
 */
export function useSurahDetail(surahNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId, mushafId, language } = useSettings();

    const query = useInfiniteQuery({
        queryKey: quranKeys.surahDetail(surahNumber, selectedReciterId, translationId, mushafId, language),
        queryFn: ({ pageParam }) => getSurahPage(surahNumber, selectedReciterId, translationId, pageParam, mushafId, language),
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
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.surahTafsir(surahNumber, tafsirId!, language),
        queryFn: () => getSurahTafsir(surahNumber, tafsirId!, language),
        enabled: enabled && !!surahNumber && !!tafsirId,
        staleTime: 1000 * 60 * 60,
    });
}

/**
 * Infinite query hook for juz detail with pagination.
 */
export function useJuzDetail(juzNumber: number, selectedReciterId: string = "7", enabled: boolean = true) {
    const { translationId, mushafId, language } = useSettings();

    const query = useInfiniteQuery({
        queryKey: quranKeys.juzDetail(juzNumber, selectedReciterId, translationId, mushafId, language),
        queryFn: ({ pageParam }) => getJuzPage(juzNumber, selectedReciterId, translationId, pageParam, mushafId, language),
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
    const { language } = useSettings();
    return useQuery({
        queryKey: quranKeys.chapterInfo(surahNumber, language),
        queryFn: () => getChapterInfo(surahNumber, language),
        enabled: enabled && !!surahNumber,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}
