"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, Volume2, Play, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { HijaiyahCard } from "@/components/iqro/HijaiyahCard";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { Button } from "@/components/ui/button";
import { IqroHeader } from "@/components/iqro/IqroHeader";
import { IqroNavigation } from "@/components/iqro/IqroNavigation";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/use-audio-player";

import { useHijaiyahIntro } from "@/hooks/use-iqro";

export default function HijaiyahIntroPage() {
    const router = useRouter();
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { data: introData = [], isLoading } = useHijaiyahIntro();

    // Audio player for sequential playback
    const { play, stop } = useAudioPlayer({
        onEnded: () => {
            if (isAutoPlaying && playingIndex !== null) {
                playSequentially(playingIndex + 1);
            }
        },
        onError: () => {
            if (isAutoPlaying && playingIndex !== null) {
                playSequentially(playingIndex + 1);
            }
        }
    });

    // Initialize/Update refs when data changes
    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, introData.length);
    }, [introData]);

    const stopPlayback = useCallback(() => {
        stop();
        setPlayingIndex(null);
        setIsAutoPlaying(false);
    }, [stop]);

    const playSequentially = useCallback((index: number) => {
        if (index >= introData.length) {
            stopPlayback();
            return;
        }

        const item = introData[index];
        if (!item.audioUrl) {
            playSequentially(index + 1);
            return;
        }

        setPlayingIndex(index);

        // Auto-scroll logic
        const targetCard = cardRefs.current[index];
        if (targetCard) {
            targetCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        play(item.audioUrl);
    }, [introData, stopPlayback, play]);

    const toggleAutoPlay = () => {
        if (isAutoPlaying) {
            stopPlayback();
        } else {
            setIsAutoPlaying(true);
            playSequentially(0);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center overflow-auto relative">
            <AmbientBackground variant="iqro" />

            {/* Standard Header - Consistent with Lessons */}
            <IqroHeader
                levelId={0}
                levelTitle="Perkenalan Hijaiyah"
                currentPage={1}
                totalPages={1}
            />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mt-16 md:mt-24 pb-32 md:pb-40 flex flex-col items-center justify-start p-4 md:p-8 relative z-10">
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="space-y-6 md:space-y-10"
                        >
                            {/* Refined Content Header (Hero) */}
                            <div className="bg-primary/5 dark:bg-primary/10 rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-10 border border-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BookOpen className="w-20 h-20 md:w-32 md:h-32 -rotate-12" />
                                </div>

                                <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                    <div className="space-y-2 md:space-y-4 text-left">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                                            <span className="text-[9px] md:text-xs font-black text-primary uppercase tracking-widest">Materi Dasar</span>
                                        </div>
                                        <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-none bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                                            Kenali <span className="text-primary italic">Huruf</span> Hijaiyah
                                        </h1>
                                        <p className="max-w-md text-muted-foreground text-xs md:text-lg font-semibold opacity-70">
                                            Langkah awal mengenal pondasi bahasa Al-Quran. Dengarkan semua huruf secara otomatis.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <Button
                                            onClick={toggleAutoPlay}
                                            disabled={isLoading}
                                            className={cn(
                                                "h-11 md:h-16 px-5 md:px-8 rounded-xl md:rounded-2xl text-sm md:text-xl font-black shadow-xl transition-all duration-300 active:scale-[0.98] group",
                                                isAutoPlaying ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 md:gap-3">
                                                {isAutoPlaying ? (
                                                    <Square className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                                                ) : (
                                                    <Play className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                                                )}
                                                {isAutoPlaying ? "Hentikan" : "Baca Semua"}
                                            </div>
                                        </Button>

                                        <div className="bg-background/80 dark:bg-background/20 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-2 md:gap-3">
                                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-[10px] md:text-sm font-black text-foreground">Audio Aktif</span>
                                                <span className="text-[8px] md:text-[10px] text-muted-foreground font-semibold">28+ Karakter</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-6 relative py-4" dir="rtl">
                                {isLoading ? (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 opacity-40">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                        <span className="text-sm font-black uppercase tracking-widest">Memuat Huruf...</span>
                                    </div>
                                ) : (
                                    introData.map((item, idx) => (
                                        <HijaiyahCard
                                            key={idx}
                                            ref={(el) => { cardRefs.current[idx] = el; }}
                                            letter={item.arabic}
                                            pronunciation={item.latin}
                                            audioUrl={item.audioUrl}
                                            isHighlighted={playingIndex === idx}
                                            className={cn(
                                                "h-auto aspect-square border-white/20 dark:border-white/10 shadow-2xl transition-all duration-700 p-3 md:p-5 scroll-mt-32 md:scroll-mt-40",
                                                idx % 2 === 0 ? "bg-white/40 dark:bg-white/5" : "bg-primary/3 dark:bg-primary/2",
                                                playingIndex === idx && "z-20 scale-[1.08] shadow-primary/30"
                                            )}
                                        />
                                    ))
                                )}
                                {/* High-end decorative overlays */}
                                <div className="absolute -top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute -bottom-20 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Fixed Bottom Navigation Bar */}
            <IqroNavigation
                currentPage={1}
                totalPages={1}
                isCompleted={false}
                onPrev={() => router.push('/iqro')}
                onNext={() => router.push('/iqro')}
            />
        </div>
    );
}
