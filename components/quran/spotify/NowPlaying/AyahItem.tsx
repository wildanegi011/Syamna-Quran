"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { parseTajweed } from '@/lib/utils/tajweed';
import { 
    Play, 
    BookOpen, 
    Heart, 
    Copy, 
    CheckCircle2 
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const AyahItem = React.memo(({
    ayah,
    isActive,
    isFav,
    onTafsir,
    onCopy,
    onToggleFavorite,
    onPlay,
    onOpenMenu,
    isPlaying,
    surahNumber,
    customId
}: {
    ayah: Ayah,
    isActive: boolean,
    isFav: boolean,
    onTafsir: (e: React.MouseEvent, ayah: Ayah) => void,
    onCopy: (e: React.MouseEvent, ayah: Ayah) => void,
    onToggleFavorite: (e: React.MouseEvent, ayah: Ayah) => void,
    onPlay: (ayah: Ayah) => void,
    onOpenMenu?: (ayah: Ayah) => void,
    isPlaying: boolean,
    surahNumber?: number,
    customId?: string
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        onCopy(e, ayah);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div
            data-ayah={ayah.nomorAyat}
            id={customId || `np-ayah-${surahNumber || '0'}-${ayah.nomorAyat}`}
            onClick={() => {
                if (window.innerWidth < 1024) {
                    onOpenMenu?.(ayah);
                }
            }}
            className={cn(
                "w-full text-left p-4 rounded-[1.5rem] transition-all duration-300 flex items-start gap-4 group relative overflow-hidden scroll-mt-28",
                window.innerWidth < 1024 && "active:bg-white/10", // Mobile active state
                isActive
                    ? "bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/20 scale-[1.01]"
                    : "hover:bg-white/5 border border-transparent"
            )}
        >
            {/* Background Glow Effect for Active Ayah */}
            {isActive && (
                <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none opacity-50" />
            )}
            {/* Left Column: Number & Actions */}
            <div className="flex flex-col items-center gap-3 shrink-0 w-8 transition-all duration-300">
                <button
                    onClick={() => onPlay(ayah)}
                    className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-500 mb-1 relative overflow-hidden",
                        isActive ? "bg-white text-black shadow-lg scale-110" : "bg-white/10 text-white/40 group-hover:bg-primary group-hover:text-white"
                    )}
                >
                    {/* Number (Hidden on Hover) */}
                    <span className={cn(
                        "transition-all duration-300",
                        isActive ? "opacity-0 scale-50" : "group-hover:opacity-0 group-hover:scale-50"
                    )}>
                        {ayah.nomorAyat}
                    </span>

                    {/* Play/Pause Icon (Visible on Hover or if Active) */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-300",
                        isActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
                    )}>
                        {isActive && isPlaying ? (
                            <div className="flex items-end gap-0.5 h-3 mb-0.5">
                                <motion.div animate={{ height: [3, 10, 5, 10, 3] }} transition={{ repeat: Infinity, duration: 0.4 }} className={cn("w-0.5 rounded-full", isActive ? "bg-black" : "bg-white")} />
                                <motion.div animate={{ height: [6, 3, 10, 3, 6] }} transition={{ repeat: Infinity, duration: 0.3 }} className={cn("w-0.5 rounded-full", isActive ? "bg-black" : "bg-white")} />
                                <motion.div animate={{ height: [10, 5, 3, 5, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className={cn("w-0.5 rounded-full", isActive ? "bg-black" : "bg-white")} />
                            </div>
                        ) : (
                            <Play className={cn("w-3 h-3 fill-current", isActive ? "ml-0.5" : "ml-0.5")} />
                        )}
                    </div>
                </button>

                {/* Vertical Actions (Visible on Hover/Active) - Hidden on Mobile */}
                <div className={cn(
                    "flex flex-col items-center gap-3 transition-all duration-300 hidden lg:flex",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                )}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => onTafsir(e, ayah)}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                                >
                                    <BookOpen className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Tafsir Ayat</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={(e) => onToggleFavorite(e, ayah)}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        isFav ? "bg-primary text-primary-foreground" : "bg-white/5 hover:bg-white/20 text-white/40 hover:text-white"
                                    )}
                                >
                                    <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{isFav ? 'Hapus' : 'Favorit'}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={handleCopy}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        isCopied ? "bg-[#56B874] text-white" : "bg-white/5 hover:bg-white/20 text-white/40 hover:text-white"
                                    )}
                                >
                                    {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{isCopied ? 'Berhasil Salin' : 'Salin Ayat'}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                    <div
                        className={cn(
                            "text-4xl font-arabic leading-[2.2] transition-all text-right w-full",
                            isActive ? "text-white font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-white/95 group-hover:text-white"
                        )}
                        dir="rtl"
                        style={{ fontSize: 'clamp(28px, 4vw, 36px)' }}
                        dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.teksTajweed || ayah.teksArab) }}
                    />
                </div>
                <p className={cn(
                    "text-[15px] sm:text-base leading-relaxed transition-colors font-medium",
                    isActive ? "text-white/95" : "text-white/50 group-hover:text-white/80"
                )}>
                    {ayah.teksIndonesia}
                </p>
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.isActive === next.isActive &&
        prev.isFav === next.isFav &&
        prev.ayah.numberGlobal === next.ayah.numberGlobal &&
        prev.isPlaying === next.isPlaying;
});
