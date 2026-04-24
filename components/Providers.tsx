"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AudioProvider } from "@/contexts/AudioContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuranAuthProvider } from "@/contexts/QuranAuthContext";
import QuranDataPrefetcher from "./quran/QuranDataPrefetcher";

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <QuranDataPrefetcher />
            <AuthProvider>
                <QuranAuthProvider>
                    <SearchProvider>
                        <AudioProvider>
                            {children}
                        </AudioProvider>
                    </SearchProvider>
                </QuranAuthProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
