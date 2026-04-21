"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioState } from "@/contexts/AudioContext";
import { useQueryClient } from "@tanstack/react-query";
import { getSurahDetail, getJuzDetail } from "@/lib/quran";
import { POPULAR_RECITERS } from "@/hooks/use-quran";
import surahSummaryData from "@/lib/data/surahs.json";

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

    const startInfo = JUZ_START_MAP[juz.id];

    // Correctly parse Surah names (handling spaces like "Ali 'Imran")
    const startSurahName = juz.start.replace(/\s\s*\d+$/, '');
    const endSurahName = juz.end.replace(/\s\s*\d+$/, '');

    // Calculate how many surahs are in this Juz
    const surahList = surahSummaryData as any[];
    const startIndex = surahList.findIndex(s => s.namaLatin === startSurahName);
    const endIndex = surahList.findIndex(s => s.namaLatin === endSurahName);
    const surahCount = (startIndex !== -1 && endIndex !== -1) ? (endIndex - startIndex + 1) : 0;

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const surah = (surahSummaryData as any[]).find(s => s.nomor === startInfo.surah);
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
            const reciterIds = [selectedReciterId];
            const detail = await getJuzDetail(juz.id, reciterIds);

            if (detail && detail.ayat.length > 0) {
                // Find the starting surah metadata
                const initialSurah = (surahSummaryData as any[]).find(s => s.nomor === startInfo.surah);

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

    const handleMouseEnter = () => {
        const reciterIds = [...new Set([selectedReciterId, ...POPULAR_RECITERS])];
        queryClient.prefetchQuery({
            queryKey: ["surah", startInfo.surah, reciterIds],
            queryFn: () => getSurahDetail(startInfo.surah, reciterIds),
            staleTime: 1000 * 60 * 60, // 1 hour
        });
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
                onMouseEnter={handleMouseEnter}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(e as any);
                    }
                }}
                className={cn(
                    "group relative flex flex-col p-5 sm:p-6 min-h-[160px] h-full transition-all duration-500 overflow-hidden border bg-white/[0.03] backdrop-blur-3xl rounded-[1.25rem] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isCurrentJuzActive
                        ? "border-primary/40 bg-primary/[0.05] shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                        : "border-white/[0.05] hover:border-white/10 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.3)]"
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

                <div className="relative z-10 flex flex-col justify-between w-full h-full">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Circle Indicator */}
                            <div
                                className={cn(
                                    "w-[48px] h-[48px] text-xl rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-300 group-hover:rotate-3",
                                    isCurrentJuzActive && isPlaying ? "scale-105" : "group-hover:scale-110"
                                )}
                                style={{ backgroundColor: JUZ_THEME.color, color: 'white' }}
                            >
                                {isCurrentJuzActive && isPlaying ? (
                                    <div className="flex items-end gap-0.5 h-4 mb-0.5">
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
                                        "text-xl font-bold tracking-tight leading-tight transition-colors truncate",
                                        isCurrentJuzActive ? "text-primary" : "text-white group-hover:text-primary"
                                    )}
                                >
                                    Juz {juz.id}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5 overflow-hidden">
                                    <p className="text-xs font-medium text-white/50 italic whitespace-nowrap truncate">
                                        Mulai: {startSurahName}
                                    </p>
                                    <span className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
                                    {surahCount > 0 && (
                                        <p className="text-xs font-bold text-primary/60 uppercase tracking-wider whitespace-nowrap">
                                            {surahCount} Surah
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Stats */}
                    <div className="flex items-center justify-between w-full mt-4">
                        <div
                            className={cn(
                                "flex flex-col text-xs font-bold uppercase tracking-[0.1em]",
                                isCurrentJuzActive ? "text-primary" : "text-white/40"
                            )}
                        >
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span>{juz.start}</span>
                                <span className="text-white/20">→</span>
                                <span>{juz.end}</span>
                            </div>
                        </div>

                        {/* Play Button */}
                        <button
                            onClick={handlePlayClick}
                            className={cn(
                                "h-10 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg group/play",
                                isCurrentJuzActive && isPlaying
                                    ? "bg-primary text-primary-foreground scale-110"
                                    : "bg-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110",
                                (isLoading || (isCurrentJuzActive && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isCurrentJuzActive && isPlaying ? (
                                <>
                                    <Pause className="w-5 h-5 fill-current" />
                                    <span className="text-xs font-black uppercase tracking-wider">Berhenti</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                    <span className="text-xs font-black uppercase tracking-wider">Putar</span>
                                </>
                            )}
                        </button>
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
