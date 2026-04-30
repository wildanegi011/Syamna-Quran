import { useQuery } from "@tanstack/react-query";
import { getDoaList, getDoaDetail } from "@/lib/doa";

export const doaKeys = {
    all: ['doa'] as const,
    list: () => [...doaKeys.all, 'list'] as const,
    detail: (id: number) => [...doaKeys.all, 'detail', id] as const,
};

export function useDoa() {
    return useQuery({
        queryKey: doaKeys.list(),
        queryFn: getDoaList,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useDoaDetail(id: number, enabled: boolean = true) {
    return useQuery({
        queryKey: doaKeys.detail(id),
        queryFn: () => getDoaDetail(id),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: enabled && !!id,
    });
}
