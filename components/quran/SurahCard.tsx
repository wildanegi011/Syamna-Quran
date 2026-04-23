"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, FileText, MapPin, Link2, Play, Pause, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAudioState } from "@/contexts/AudioContext";
import { useQueryClient } from "@tanstack/react-query";
import { getSurahDetail } from "@/lib/quran";

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
    isCurrentlyPlaying: boolean;
    isPlaying: boolean;
    currentAyah: any | null;
    togglePlay: () => void;
    playSurah: (num: number) => Promise<void>;
    setRightPanelOpen: (val: boolean) => void;
    setViewedSurah: (surah: any) => void;
    selectedReciterId: string;
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

export const SurahCard = React.memo(function SurahCard({
    surah,
    index,
    isCurrentlyPlaying,
    isPlaying,
    currentAyah,
    togglePlay,
    playSurah,
    setRightPanelOpen,
    setViewedSurah,
    selectedReciterId
}: SurahCardProps) {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = React.useState(false);

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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(e as any);
                    }
                }}
                className={cn(
                    "group relative flex flex-row lg:flex-col p-3 sm:p-4 lg:p-6 min-h-[80px] sm:min-h-[90px] lg:min-h-[160px] items-center lg:items-stretch transition-all duration-500 overflow-hidden border bg-white/[0.03] backdrop-blur-3xl rounded-xl sm:rounded-2xl lg:rounded-[1.25rem] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
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

                <div className="relative z-10 flex flex-row lg:flex-col justify-between items-center lg:items-stretch w-full h-full gap-3 sm:gap-4 lg:gap-0">
                    {/* Left/Top Content Group */}
                    <div className="flex flex-row items-center gap-3 sm:gap-4 min-w-0 flex-1 sm:flex-none">
                        {/* Number Circle / Play Indicator */}
                        <div
                            className={cn(
                                "w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px] text-base sm:text-lg lg:text-xl rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-300 group-hover:rotate-3",
                                isCurrentlyPlaying && isPlaying ? "scale-105" : "group-hover:scale-110"
                            )}
                            style={{ backgroundColor: theme.color, color: 'white' }}
                        >
                            {isCurrentlyPlaying && isPlaying ? (
                                <div className="flex items-end gap-0.5 h-3 md:h-4 mb-0.5">
                                    <motion.div animate={{ height: [3, 10, 5, 10, 3] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [6, 3, 10, 3, 6] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [10, 5, 3, 5, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                                </div>
                            ) : (
                                <span>{surah.nomor}</span>
                            )}
                        </div>

                        <div className="flex flex-col min-w-0">
                            <h3
                                className={cn(
                                    "text-sm sm:text-base lg:text-xl font-bold tracking-tight leading-tight transition-colors truncate",
                                    isCurrentlyPlaying ? "text-primary" : "text-white group-hover:text-primary"
                                )}
                            >
                                {surah.namaLatin}
                            </h3>
                            <div className="flex flex-col sm:block">
                                <p className="text-[9px] sm:text-xs font-medium text-white/50 italic truncate max-w-[100px] sm:max-w-[140px] mt-0.5">
                                    {surah.arti}
                                </p>
                                {/* Tablet/Mobile Stats */}
                                <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white/30">
                                    <span>{surah.jumlahAyat} Ayat</span>
                                    <span className="w-0.5 h-0.5 rounded-full bg-white/10" />
                                    <span className={cn(
                                        surah.tempatTurun === "Madinah" ? "text-[#56B874]/60" : "text-[#638FE5]/60"
                                    )}>
                                        {surah.tempatTurun}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arabic Content (Desktop mode or right-aligned tablet) */}
                    <div className="hidden lg:block text-right mt-2 lg:mt-0">
                        <span
                            className="text-2xl sm:text-3xl lg:text-4xl font-arabic transition-all duration-500 block group-hover:scale-105 origin-right tracking-wider"
                            style={{
                                color: isCurrentlyPlaying ? '#ffffff' : theme.color,
                                fontSize: 'clamp(24px, 5vw, 36px)'
                            }}
                        >
                            {surah.nama}
                        </span>
                    </div>

                    {/* Desktop Stats (hidden on mobile/tablet rows) */}
                    <div className="hidden lg:flex items-center justify-between w-full mt-4">
                        <div
                            className={cn(
                                "flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap",
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

                        {/* Action Corner - Play Button (Desktop) */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePlayClick}
                                className={cn(
                                    "h-8 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 shadow-lg group/play",
                                    isCurrentlyPlaying && isPlaying
                                        ? "bg-primary text-primary-foreground scale-110"
                                        : "bg-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:scale-110",
                                    (isLoading || (isCurrentlyPlaying && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isCurrentlyPlaying && isPlaying ? (
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
                    </div>

                    {/* Mobile/Tablet Row Action */}
                    <div className="lg:hidden flex items-center gap-2 sm:gap-4 ml-auto">
                        {/* Arabic (shown on row layout if screen > 400px) */}
                        <span
                            className="text-xl sm:text-2xl lg:text-3xl font-arabic transition-all duration-500 opacity-60 hidden min-[400px]:block"
                            style={{ color: isCurrentlyPlaying ? '#ffffff' : theme.color }}
                        >
                            {surah.nama}
                        </span>

                        <button
                            onClick={handlePlayClick}
                            className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shrink-0",
                                isCurrentlyPlaying && isPlaying
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-white/10 text-white hover:bg-primary hover:text-primary-foreground",
                                (isLoading || (isCurrentlyPlaying && !currentAyah && isPlaying)) ? "cursor-wait" : "cursor-pointer"
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isCurrentlyPlaying && isPlaying ? (
                                <Pause className="w-4 h-4 fill-current" />
                            ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    return prevProps.surah.nomor === nextProps.surah.nomor &&
        prevProps.index === nextProps.index &&
        prevProps.isCurrentlyPlaying === nextProps.isCurrentlyPlaying &&
        prevProps.isPlaying === nextProps.isPlaying &&
        prevProps.selectedReciterId === nextProps.selectedReciterId;
});
