"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { HijaiyahCard } from "@/components/iqro/HijaiyahCard";
import { cn } from "@/lib/utils";
import { getIqroPageData } from "@/lib/iqro";
import { IqroPageData } from "@/lib/types";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { IqroHeader } from "@/components/iqro/IqroHeader";
import { IqroNavigation } from "@/components/iqro/IqroNavigation";
import { CompletionView } from "@/components/iqro/CompletionView";
import { useQueryClient } from "@tanstack/react-query";
import { useIqroMetadata, useIqroPage } from "@/hooks/use-iqro";

export default function LessonPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const levelId = parseInt(params.level as string);

    const [currentPage, setCurrentPage] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    // Fetch Level Metadata
    const { data: metadata } = useIqroMetadata(levelId);

    const totalPages = metadata?.total_pages || 1;

    // Check if level is disabled
    useEffect(() => {
        if (metadata && metadata.is_disabled) {
            router.replace('/iqro');
        }
    }, [metadata, router]);

    // Fetch Page Data
    const { data: pageData, isLoading: loading } = useIqroPage(levelId, currentPage);

    // Prefetch Next Page
    useEffect(() => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            queryClient.prefetchQuery({
                queryKey: ['iqro-page', levelId, nextPage],
                queryFn: () => getIqroPageData(levelId, nextPage),
            });
        }
    }, [currentPage, totalPages, levelId, queryClient]);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setIsCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsCompleted(false);
        }
    };

    if (loading && !pageData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center overflow-auto relative">
            <AmbientBackground variant="iqro" />

            {/* App Bar */}
            <IqroHeader
                levelId={levelId}
                levelTitle={pageData?.level_title}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mt-16 md:mt-24 pb-32 md:pb-40 flex flex-col items-center justify-start p-4 md:p-8 relative z-10">
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {!isCompleted ? (
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.04, y: -20 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="space-y-10 md:space-y-16"
                            >
                                <div className="text-center space-y-12 md:space-y-20">
                                    <div className="space-y-6 md:space-y-8">
                                        <motion.h2
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-3xl md:text-5xl font-black text-primary/40 uppercase tracking-[0.3em] italic"
                                        >
                                            {pageData?.name || pageData?.level_title}
                                        </motion.h2>

                                        {pageData?.basmallah && (
                                            <div className="relative py-4">
                                                <p className="text-5xl md:text-7xl font-arabic text-foreground drop-shadow-2xl leading-relaxed relative z-10" dir="rtl">
                                                    {pageData.basmallah}
                                                </p>
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                                            </div>
                                        )}
                                    </div>

                                    {pageData?.instruction && (
                                        <div className="relative inline-flex flex-col items-center group/instr">
                                            <div className="flex items-center gap-3 mb-4 opacity-30">
                                                <div className="h-px w-8 bg-primary" />
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <div className="h-px w-8 bg-primary" />
                                            </div>
                                            <p className="text-lg md:text-2xl font-black text-foreground tracking-tight italic max-w-2xl">
                                                "{pageData.instruction}"
                                            </p>
                                            <div className="mt-8 w-12 h-1 bg-primary/10 rounded-full" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 relative py-10" dir="rtl">
                                    {pageData?.sections.map((item: any, idx: number) => (
                                        <HijaiyahCard
                                            key={idx}
                                            letter={item.text}
                                            pronunciation={item.latin}
                                            disableAudio={!item.audioUrl}
                                            audioUrl={item.audioUrl}
                                            className={cn(
                                                "h-auto aspect-square border-white/20 dark:border-white/10 shadow-2xl transition-all duration-700 hover:scale-[1.05] hover:-translate-y-2",
                                                idx % 2 === 0 ? "bg-white/40 dark:bg-white/5" : "bg-primary/3 dark:bg-primary/2"
                                            )}
                                        />
                                    ))}
                                    {/* High-end decorative overlays */}
                                    <div className="absolute -top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                                    <div className="absolute -bottom-20 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                                </div>
                            </motion.div>
                        ) : (
                            <CompletionView
                                levelId={levelId}
                                onRepeat={() => { setCurrentPage(1); setIsCompleted(false); }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Fixed Bottom Navigation Bar */}
            <IqroNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                isCompleted={isCompleted}
                onPrev={handlePrev}
                onNext={isCompleted ? () => router.push('/iqro') : handleNext}
            />
        </div>
    );
}
