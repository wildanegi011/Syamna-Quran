import { useQuery } from "@tanstack/react-query";
import { getHadithCategories, getHadithList, getHadithDetail } from "@/lib/hadith";

export const hadithKeys = {
    all: ['hadith'] as const,
    categories: () => [...hadithKeys.all, 'categories'] as const,
    list: (categoryId: string, page: number) => [...hadithKeys.all, 'list', categoryId, page] as const,
    detail: (id: string) => [...hadithKeys.all, 'detail', id] as const,
};

export function useHadithCategories() {
    return useQuery({
        queryKey: hadithKeys.categories(),
        queryFn: getHadithCategories,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export function useHadithList(categoryId: string, page: number = 1) {
    return useQuery({
        queryKey: hadithKeys.list(categoryId, page),
        queryFn: () => getHadithList(categoryId, page),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: !!categoryId,
    });
}

export function useHadithDetail(id: string | null, enabled: boolean = true) {
    return useQuery({
        queryKey: hadithKeys.detail(id!),
        queryFn: () => getHadithDetail(id!),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: enabled && !!id,
    });
}
