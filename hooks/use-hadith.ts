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

export function useHadithDetail(id: string | null, enabled: boolean = true) {
    return useQuery({
        queryKey: ["hadith-detail", id],
        queryFn: () => getHadithDetail(id!),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: enabled && !!id,
    });
}

import { useMemo } from "react";
