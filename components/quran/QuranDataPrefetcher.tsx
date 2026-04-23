"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getReciters, getTranslations } from '@/lib/quran';

/**
 * QuranDataPrefetcher
 * 
 * A headless component that prefetches static Quran resources (reciters, translations)
 * when the application starts. This ensures that by the time the user opens the 
 * settings or selection views, the data is already available in the cache.
 */
export default function QuranDataPrefetcher() {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Prefetch reciters list
        queryClient.prefetchQuery({
            queryKey: ["reciters"],
            queryFn: getReciters,
            staleTime: 1000 * 60 * 60 * 24, // 24 hours
        });

        // Prefetch translations list
        queryClient.prefetchQuery({
            queryKey: ["translations"],
            queryFn: getTranslations,
            staleTime: 1000 * 60 * 60 * 24, // 24 hours
        });
    }, [queryClient]);

    return null; // This component doesn't render anything
}
