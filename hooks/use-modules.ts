import { useQuery } from "@tanstack/react-query";
import { getAppModules } from "@/lib/modules";

export const moduleKeys = {
    all: ['app-modules'] as const,
};

export function useAppModules() {
    return useQuery({
        queryKey: moduleKeys.all,
        queryFn: getAppModules,
    });
}
