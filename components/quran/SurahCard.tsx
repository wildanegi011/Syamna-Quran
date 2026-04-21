"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, FileText, MapPin, Link2, Play, Pause, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAudioState } from "@/contexts/AudioContext";
import { useQueryClient } from "@tanstack/react-query";
import { getSurahDetail } from "@/lib/quran";
import { POPULAR_RECITERS } from "@/hooks/use-quran";

interface SurahCardProps {
    surah: {
        nomor: number;
        nama: string;
        namaLatin: string;
        arti: string;
        jumlahAyat: number;
        tempatTurun: string;
        juz?: number;
        ayatsajdah?: boolean;
    };
    index: number;
}

const THEMES = {
    MADANIYAH: {
        color: '#56B874', // Green
        glow: 'rgba(86, 184, 116, 0.15)',
        border: 'rgba(86, 184, 116, 0.2)'
    },
    MAKKIYAH: {
        color: '#638FE5', // Blue
        glow: 'rgba(99, 143, 229, 0.15)',
        border: 'rgba(99, 143, 229, 0.2)'
    },
    SAJDAH: {
        color: '#C69446', // Gold
        glow: 'rgba(198, 148, 70, 0.2)',
        border: 'rgba(198, 148, 70, 0.3)'
    }
};

export function SurahCard({ surah, index }: SurahCardProps) {
    const queryClient = useQueryClient();
    const { isPlaying, togglePlay, currentSurah: playingSurah, currentAyah, playSurah, setRightPanelOpen, setViewedSurah, selectedReciterId, currentJuz } = useAudioState();
    const [isLoading, setIsLoading] = React.useState(false);
    const isCurrentlyPlaying = playingSurah?.nomor === surah.nomor && !currentJuz;

    // Determine theme based on surah metadata
    let theme = surah.tempatTurun === "Madinah" ? THEMES.MADANIYAH : THEMES.MAKKIYAH;
    if (surah.ayatsajdah) theme = THEMES.SAJDAH;

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setViewedSurah(surah as any);
        setRightPanelOpen(true);
    };

    const handlePlayClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCurrentlyPlaying && currentAyah) {
            togglePlay();
            return;
        }

        setIsLoading(true);
        try {
            await playSurah(surah.nomor);
            // Sync side panel with what is playing
            setViewedSurah(surah as any);
            setRightPanelOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseEnter = () => {
        const reciterIds = [...new Set([selectedReciterId, ...POPULAR_RECITERS])];
        queryClient.prefetchQuery({
            queryKey: ["surah", surah.nomor, reciterIds],
            queryFn: () => getSurahDetail(surah.nomor, reciterIds),
            staleTime: 1000 * 60 * 60, // 1 hour
        });
    };

    return (
        <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                opacity: { duration: 0.2 }
            }}
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
                    "group relative flex flex-col p-6 h-[170px] transition-all duration-500 overflow-hidden border bg-white/[0.03] backdrop-blur-3xl rounded-[1.25rem] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isCurrentlyPlaying
                        ? "border-primary/40 bg-primary/[0.05] shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                        : "border-white/[0.05] hover:border-white/10 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.3)]"
                )}
                style={{
                    '--theme-glow': theme.border,
                } as React.CSSProperties}
            >
                {/* Focused Glow behind Number */}
                <div
                    className={cn(
                        "absolute -top-6 -left-6 w-32 h-32 blur-[40px] opacity-0 transition-opacity duration-300 pointer-events-none rounded-full",
                        isCurrentlyPlaying ? "opacity-30" : "group-hover:opacity-30"
                    )}
                    style={{ backgroundColor: theme.color }}
                />

                <div className="relative z-10 flex flex-col justify-between w-full h-full">
                    {/* Top Content */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Number Circle / Play Indicator */}
                            <div
                                className={cn(
                                    "w-[48px] h-[48px] text-xl rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-300 group-hover:rotate-3",
                                    isCurrentlyPlaying && isPlaying ? "scale-105" : "group-hover:scale-110"
                                )}
                                style={{ backgroundColor: theme.color, color: 'white' }}
                            >
                                {isCurrentlyPlaying && isPlaying ? (
                                    <div className="flex items-end gap-0.5 h-4 mb-0.5">
                                        <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white rounded-full" />
                                        <motion.div animate={{ height: [8, 4, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-1 bg-white rounded-full" />
                                        <motion.div animate={{ height: [12, 6, 4, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                                    </div>
                                ) : (
                                    <span>{surah.nomor}</span>
                                )}
                            </div>

                            <div className="flex flex-col min-w-0">
                                <h3
                                    className={cn(
                                        "text-xl font-bold tracking-tight leading-tight transition-colors truncate",
                                        isCurrentlyPlaying ? "text-primary" : "text-white group-hover:text-primary"
                                    )}
                                >
                                    {surah.namaLatin}
                                </h3>
                                <p className="text-xs font-medium text-white/50 italic truncate max-w-[140px] mt-0.5">
                                    {surah.arti}
                                </p>
                            </div>
                        </div>

                        {/* Arabic */}
                        <div className="text-right">
                            <span
                                className="text-4xl font-arabic transition-all duration-500 block group-hover:scale-105 origin-right tracking-wider"
                                style={{ color: isCurrentlyPlaying ? '#ffffff' : theme.color }}
                            >
                                {surah.nama}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="flex items-center justify-between w-full mt-4">
                        <div
                            className={cn(
                                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap",
                                isCurrentlyPlaying ? "text-primary" : "text-white/40"
                            )}
                        >
                            <span>{surah.jumlahAyat} Ayat</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className={cn(
                                surah.tempatTurun === "Madinah" ? "text-[#56B874]/80" : "text-[#638FE5]/80"
                            )}>
                                {surah.tempatTurun}
                            </span>
                            {surah.ayatsajdah && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-[#C69446]/80">Sajdah</span>
                                </>
                            )}
                        </div>

                        {/* Action Corner - Play Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePlayClick}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg group/play",
                                    isCurrentlyPlaying && isPlaying
                                        ? "bg-primary text-primary-foreground scale-110"
                                        : "bg-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110",
                                    (isLoading || (isCurrentlyPlaying && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : isCurrentlyPlaying && isPlaying ? (
                                    <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
