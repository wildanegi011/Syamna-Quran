import { useQuery } from "@tanstack/react-query";
import { getDoaList, getDoaDetail } from "@/lib/doa";

export function useDoa() {
    return useQuery({
        queryKey: ["doa-list"],
        queryFn: getDoaList,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export function useDoaDetail(id: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ["doa-detail", id],
        queryFn: () => getDoaDetail(id),
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled,
    });
}
