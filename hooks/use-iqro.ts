import { useQuery } from "@tanstack/react-query";
import {
    getAllIqroLevels,
    getHijaiyahIntroData,
    getIqroBookMetadata,
    getIqroPageData
} from "@/lib/iqro";

export const iqroKeys = {
    all: ['iqro'] as const,
    levels: () => [...iqroKeys.all, 'levels'] as const,
    intro: () => [...iqroKeys.all, 'intro'] as const,
    metadata: (levelId: number) => [...iqroKeys.all, 'metadata', levelId] as const,
    page: (levelId: number, pageNumber: number) => [...iqroKeys.all, 'page', levelId, pageNumber] as const,
};

export function useIqroLevels() {
    return useQuery({
        queryKey: iqroKeys.levels(),
        queryFn: getAllIqroLevels,
    });
}

export function useHijaiyahIntro() {
    return useQuery({
        queryKey: iqroKeys.intro(),
        queryFn: getHijaiyahIntroData,
    });
}

export function useIqroMetadata(levelId: number) {
    return useQuery({
        queryKey: iqroKeys.metadata(levelId),
        queryFn: () => getIqroBookMetadata(levelId),
        enabled: !isNaN(levelId),
    });
}

export function useIqroPage(levelId: number, pageNumber: number) {
    return useQuery({
        queryKey: iqroKeys.page(levelId, pageNumber),
        queryFn: () => getIqroPageData(levelId, pageNumber),
        enabled: !isNaN(levelId) && !isNaN(pageNumber),
    });
}
