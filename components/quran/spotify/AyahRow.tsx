import React, { useState, memo } from 'react';
import { Play, Pause, BookOpen, Heart, Share2, MessageCircle } from 'lucide-react';
import { useAudioState } from '@/contexts/AudioContext';
import { Ayah, SurahSummary } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AyahTafsir } from '../AyahTafsir';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseTajweed } from '@/lib/utils/tajweed';
import { useSettings } from '@/contexts/SettingsContext';

interface AyahRowProps {
    ayah: Ayah;
    surah: SurahSummary;
    index: number;
    queue: Ayah[];
    tafsirText?: string;
    onShowTafsir: (ayahNumber: number, surahNumber: number, surahName: string, tafsirText?: string) => void;
}

export const AyahRow = memo(function AyahRow({ ayah, surah, index, queue, tafsirText, onShowTafsir }: AyahRowProps) {
    const { currentAyah, isPlaying, playAyah, togglePlay, currentSurah } = useAudioState();
    const { mushafId } = useSettings();

    const isCurrent = currentAyah?.nomorAyat === ayah.nomorAyat && currentSurah?.nomor === surah.nomor;

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCurrent) {
            togglePlay();
        } else {
            playAyah(ayah, surah, queue);
        }
    };

    const handleTafsirClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const sNum = ayah.surahInfo?.nomor || surah.nomor;
        const sName = ayah.surahInfo?.namaLatin || surah.namaLatin;
        onShowTafsir(ayah.nomorAyat, sNum, sName, tafsirText);
    };

    return (
        <motion.div
            id={ayah.surahInfo ? `ayah-${ayah.surahInfo.nomor}-${ayah.nomorAyat}` : `ayah-${ayah.nomorAyat}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
                "group flex flex-col gap-4 md:gap-6 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-700 hover:bg-foreground/[0.03] relative overflow-hidden border border-foreground/[0.02] scroll-mt-24 md:scroll-mt-40",
                isCurrent && "bg-foreground/[0.05] backdrop-blur-2xl border border-foreground/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-foreground/5"
            )}
        >
            {/* Background Glow Effect for Active Ayah */}
            {isCurrent && (
                <div className="absolute inset-0 bg-linear-to-br from-foreground/5 via-transparent to-transparent pointer-events-none opacity-50" />
            )}

            {/* Top Row: Number & Arabic Text */}
            <div className="flex items-start justify-between gap-4 md:gap-8 relative z-10 w-full">
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
                        <div className={cn(
                            "w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-foreground/10 flex flex-col items-center justify-center text-[10px] md:text-xs font-headline font-black transition-all duration-500",
                            isCurrent ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/30 group-hover:opacity-0",
                            isCurrent && isPlaying && "opacity-0"
                        )}>
                            <span className={cn(ayah.surahInfo ? "text-[8px] md:text-[10px]" : "text-xs")}>{ayah.nomorAyat}</span>
                        </div>

                        {/* Play/Pause Button - Replaces Number on Hover or when Current */}
                        <div className={cn(
                            "absolute inset-0 flex items-center justify-center transition-all duration-300",
                            isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlay}
                                className={cn(
                                    "w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 p-0",
                                    isCurrent ? "text-primary bg-primary/10 hover:bg-primary/20" : "bg-primary text-primary-foreground shadow-xl hover:bg-primary/90"
                                )}
                            >
                                {isCurrent && isPlaying ? (
                                    <div className="flex items-center gap-0.5 md:gap-1 h-3 md:h-3.5">
                                        {[1, 2, 3].map(i => (
                                            <span key={i} className="w-0.5 bg-current rounded-full animate-bounce" style={{ height: '100%', animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                ) : (
                                    <Play className="w-4 h-4 md:w-6 md:h-6 fill-current ml-0.5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "flex-1 text-right leading-[2] transition-all duration-1000",
                        [3, 6, 7].includes(mushafId) ? "font-indopak text-4xl md:text-5xl" : "font-arabic text-3xl md:text-4xl",
                        isCurrent ? "text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)] opacity-100" : "text-foreground/80 hover:text-foreground"
                    )}
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.teksTajweed || ayah.teksArab) }}
                />
            </div>

            {/* Bottom Row: Transliteration & Translation & Quick Actions */}
            <div className="flex flex-col gap-4 relative z-10 md:pl-20">
                <div className="flex flex-col gap-3">
                    {/* Latin Transliteration (Small & Subdue) */}
                    <p className={cn(
                        "text-xs font-label font-bold italic tracking-wide transition-colors",
                        isCurrent ? "text-primary/60" : "text-foreground/20"
                    )} dangerouslySetInnerHTML={{ __html: ayah.teksLatin }} />

                    {/* Translation (Main Reading) */}
                    <p className={cn(
                        "text-base md:text-lg font-body leading-relaxed transition-all duration-700 max-w-4xl",
                        isCurrent ? "text-foreground opacity-100" : "text-foreground/60 font-medium opacity-80"
                    )}>
                        {ayah.teksIndonesia}
                    </p>
                </div>

                {/* Quick Actions - Persistent on Mobile, Hover on Desktop */}
                <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-0 md:absolute md:bottom-0 md:right-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground h-9 w-9 md:h-11 md:w-11 cursor-pointer"
                                onClick={handleTafsirClick}
                            >
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Tafsir Ayat</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("p-2 rounded-full hover:bg-foreground/10 transition-colors h-9 w-9 md:h-11 md:w-11 cursor-pointer", isCurrent ? "text-primary" : "text-muted-foreground")}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Add favorite logic here
                                }}
                            >
                                <Heart className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Simpan ke Favorit</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground h-9 w-9 md:h-11 md:w-11 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Add share logic here
                                }}
                            >
                                <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Bagikan Ayat</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </motion.div>
    );
});
