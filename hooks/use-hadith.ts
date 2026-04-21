import { useQuery, useQueries } from "@tanstack/react-query";
import { getHadithCategories, getHadithList, getHadithDetail } from "@/lib/hadith";
import { HadithSummary } from "@/lib/types";

export function useHadithCategories() {
    return useQuery({
        queryKey: ["hadith-categories"],
        queryFn: getHadithCategories,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours (categories rarely change)
    });
}

export function useHadithList(categoryId: string, page: number = 1) {
    return useQuery({
        queryKey: ["hadith-list", categoryId, page],
        queryFn: () => getHadithList(categoryId, page),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!categoryId,
    });
}

/**
 * Fetches the list of hadiths for a category, then fetches the details
 * in parallel for each hadith to get attribution and grade.
 */
export function useHadithsWithDetails(categoryId: string, page: number = 1) {
    const listQuery = useHadithList(categoryId, page);
    const hadithSummaries = listQuery.data || [];

    const detailQueries = useQueries({
        queries: hadithSummaries.map((h: HadithSummary) => ({
            queryKey: ["hadith-detail", h.id],
            queryFn: () => getHadithDetail(h.id),
            staleTime: 1000 * 60 * 60,
            enabled: !!h.id,
        })),
    });

    const isLoadingDetails = detailQueries.some(q => q.isLoading);
    
    const enrichedHadiths = useMemo(() => {
        return hadithSummaries.map((h: HadithSummary, index: number) => {
            const detail = detailQueries[index]?.data;
            if (!detail) return h;
            return {
                ...h,
                attribution: detail.attribution,
                grade: detail.grade,
                hadeeth: detail.hadeeth,
                hadeeth_ar: detail.hadeeth_ar,
            };
        });
    }, [hadithSummaries, detailQueries]);

    return {
        data: enrichedHadiths,
        isLoading: listQuery.isLoading,
        isLoadingDetails,
        isError: listQuery.isError || detailQueries.some(q => q.isError),
        refetch: listQuery.refetch,
    };
}

export function useHadithDetail(id: string | null, enabled: boolean = true) {
    return useQuery({
        queryKey: ["hadith-detail", id],
        queryFn: () => getHadithDetail(id!),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: enabled && !!id,
    });
}

import { useMemo } from "react";
