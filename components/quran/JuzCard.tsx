"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioState } from "@/contexts/AudioContext";
import { useQueryClient } from "@tanstack/react-query";
import { getSurahDetail, getJuzDetail } from "@/lib/quran";
import { useSurahs } from "@/hooks/use-quran";

interface JuzCardProps {
    juz: {
        id: number;
        start: string;
        end: string;
    };
    index: number;
    isCurrentJuzActive: boolean;
    isPlaying: boolean;
    currentAyah: any | null;
    togglePlay: () => void;
    playAyah: (ayah: any, surah: any, queue?: any[], juzId?: number | null) => Promise<void>;
    setRightPanelOpen: (val: boolean) => void;
    setViewedJuz: (id: number) => void;
    selectedReciterId: string;
}

// Mapping Juz to starting surah and ayah
// This is based on standard 30 Juz division
const JUZ_START_MAP: Record<number, { surah: number; ayah: number }> = {
    1: { surah: 1, ayah: 1 },
    2: { surah: 2, ayah: 142 },
    3: { surah: 2, ayah: 253 },
    4: { surah: 3, ayah: 93 },
    5: { surah: 4, ayah: 24 },
    6: { surah: 4, ayah: 148 },
    7: { surah: 5, ayah: 82 },
    8: { surah: 6, ayah: 111 },
    9: { surah: 7, ayah: 88 },
    10: { surah: 8, ayah: 41 },
    11: { surah: 9, ayah: 93 },
    12: { surah: 11, ayah: 6 },
    13: { surah: 12, ayah: 53 },
    14: { surah: 15, ayah: 1 },
    15: { surah: 17, ayah: 1 },
    16: { surah: 18, ayah: 75 },
    17: { surah: 21, ayah: 1 },
    18: { surah: 23, ayah: 1 },
    19: { surah: 25, ayah: 21 },
    20: { surah: 27, ayah: 56 },
    21: { surah: 29, ayah: 46 },
    22: { surah: 33, ayah: 31 },
    23: { surah: 36, ayah: 28 },
    24: { surah: 39, ayah: 32 },
    25: { surah: 41, ayah: 47 },
    26: { surah: 46, ayah: 1 },
    27: { surah: 51, ayah: 31 },
    28: { surah: 58, ayah: 1 },
    29: { surah: 67, ayah: 1 },
    30: { surah: 78, ayah: 1 }
};

const JUZ_THEME = {
    color: '#8FA9F4', // Premium Syamna Purple/Blue
    glow: 'rgba(143, 169, 244, 0.15)',
    border: 'rgba(143, 169, 244, 0.2)'
};

export const JuzCard = React.memo(function JuzCard({ 
    juz, 
    index,
    isCurrentJuzActive,
    isPlaying,
    currentAyah,
    togglePlay,
    playAyah,
    setRightPanelOpen,
    setViewedJuz,
    selectedReciterId
}: JuzCardProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = React.useState(false);
    const { data: allSurahs = [] } = useSurahs();

    const startInfo = JUZ_START_MAP[juz.id];

    // Correctly parse Surah names (handling spaces like "Ali 'Imran")
    const startSurahName = juz.start.replace(/\s\s*\d+$/, '');
    const endSurahName = juz.end.replace(/\s\s*\d+$/, '');

    // Calculate how many surahs are in this Juz using dynamic surah list
    const startIndex = allSurahs.findIndex(s => s.namaLatin === startSurahName);
    const endIndex = allSurahs.findIndex(s => s.namaLatin === endSurahName);
    const surahCount = (startIndex !== -1 && endIndex !== -1) ? (endIndex - startIndex + 1) : 0;

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const surah = allSurahs.find(s => s.nomor === startInfo.surah);
        if (surah) {
            setViewedJuz(juz.id);
            setRightPanelOpen(true);
        }
    };

    const handlePlayClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCurrentJuzActive && currentAyah) {
            togglePlay();
            return;
        }

        setIsLoading(true);
        try {
            // Use getJuzDetail to get ALL verses in the Juz (all surahs included)
            const detail = await getJuzDetail(juz.id, selectedReciterId);

            if (detail && detail.ayat.length > 0) {
                // Find the starting surah metadata
                const initialSurah = allSurahs.find(s => s.nomor === startInfo.surah);

                // Find the specific ayah from the starting surah
                const startAyah = detail.ayat.find(a =>
                    a.nomorAyat === startInfo.ayah && a.surahInfo?.nomor === startInfo.surah
                ) || detail.ayat[0];

                await playAyah(startAyah, initialSurah!, detail.ayat, juz.id);

                setRightPanelOpen(true);
            }
        } catch (err) {
            console.error("Failed to play juz detail:", err);
        } finally {
            setIsLoading(false);
        }
    };


    // Arabic numeral representation
    const arabicId = juz.id.toLocaleString('ar-EG');

    return (
        <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ opacity: { duration: 0.2 } }}
        >
            <div
                onClick={handleCardClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(e as any);
                    }
                }}
                className={cn(
                    "group relative flex flex-row lg:flex-col p-3 sm:p-4 lg:p-6 min-h-[80px] sm:min-h-[90px] lg:min-h-[160px] items-center lg:items-stretch transition-all duration-500 overflow-hidden border rounded-xl sm:rounded-2xl lg:rounded-[1.25rem] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isCurrentJuzActive
                        ? "border-primary bg-primary/[0.08] shadow-[0_15px_35px_-12px_rgba(var(--primary-rgb),0.2)]"
                        : "border-foreground/[0.05] bg-foreground/[0.02] hover:border-primary/30 hover:bg-background hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
                )}
            >
                {/* Visual Accent Layer */}
                <div
                    className={cn(
                        "absolute -top-6 -left-6 w-32 h-32 blur-[40px] opacity-0 transition-opacity duration-300 pointer-events-none rounded-full",
                        isCurrentJuzActive ? "opacity-30" : "group-hover:opacity-30"
                    )}
                    style={{ backgroundColor: JUZ_THEME.color }}
                />

                <div className="relative z-10 flex flex-row lg:flex-col justify-between items-center lg:items-stretch w-full h-full gap-3 sm:gap-4 lg:gap-0">
                    <div className="flex flex-row items-center gap-3 sm:gap-4 min-w-0 flex-1 sm:flex-none">
                        {/* Circle Indicator */}
                        <div
                            className={cn(
                                "w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px] text-base sm:text-lg lg:text-xl rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-300 group-hover:rotate-3",
                                isCurrentJuzActive && isPlaying ? "scale-105" : "group-hover:scale-110"
                            )}
                            style={{ backgroundColor: JUZ_THEME.color, color: 'white' }}
                        >
                            {isCurrentJuzActive && isPlaying ? (
                                <div className="flex items-end gap-0.5 h-3 md:h-4 mb-0.5">
                                    <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [8, 4, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [12, 6, 4, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                                </div>
                            ) : (
                                <span>{juz.id}</span>
                            )}
                        </div>

                        <div className="flex flex-col min-w-0">
                            <h3
                                className={cn(
                                    "text-sm sm:text-base lg:text-xl font-bold tracking-tight leading-tight transition-colors truncate",
                                    isCurrentJuzActive ? "text-primary" : "text-foreground group-hover:text-primary"
                                )}
                            >
                                Juz {juz.id}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5 overflow-hidden">
                                <p className="text-[9px] sm:text-xs font-medium text-foreground/50 italic whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
                                    Mulai: {startSurahName}
                                </p>
                                <span className="hidden sm:block w-1 h-1 rounded-full bg-foreground/10 shrink-0" />
                                {surahCount > 0 && (
                                    <p className="text-[9px] sm:text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap">
                                        {surahCount} Surah
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats (Desktop/Card) / Right Content (Mobile/List) */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-4 sm:gap-0 lg:mt-4 ml-auto sm:ml-0">
                        {/* Range/Stats Info */}
                        <div
                            className={cn(
                                "hidden lg:flex flex-col text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em]",
                                isCurrentJuzActive ? "text-primary" : "text-foreground/40"
                            )}
                        >
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span>{juz.start}</span>
                                <span className="text-foreground/20">→</span>
                                <span>{juz.end}</span>
                            </div>
                        </div>

                        {/* Play Button - Desktop/Card */}
                        <div className="hidden lg:flex items-center justify-end w-full">
                            <button
                                onClick={handlePlayClick}
                                className={cn(
                                    "h-8 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg group/play",
                                    isCurrentJuzActive && isPlaying
                                        ? "bg-primary text-primary-foreground scale-110"
                                        : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110",
                                    (isLoading || (isCurrentJuzActive && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isCurrentJuzActive && isPlaying ? (
                                    <>
                                        <Pause className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Berhenti</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Putar</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Play Button - Mobile/Tablet Row */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                onClick={handlePlayClick}
                                className={cn(
                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shrink-0",
                                    isCurrentJuzActive && isPlaying
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground",
                                    (isLoading || (isCurrentJuzActive && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isCurrentJuzActive && isPlaying ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    return prevProps.juz.id === nextProps.juz.id && 
           prevProps.index === nextProps.index &&
           prevProps.isCurrentJuzActive === nextProps.isCurrentJuzActive &&
           prevProps.isPlaying === nextProps.isPlaying &&
           prevProps.selectedReciterId === nextProps.selectedReciterId;
});
