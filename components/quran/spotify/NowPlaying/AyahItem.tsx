"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { parseTajweed } from '@/lib/utils/tajweed';
import { useSettings } from '@/contexts/SettingsContext';
import { 
    Play, 
    Pause,
    BookOpen, 
    Heart, 
    Copy, 
    CheckCircle2 
} from 'lucide-react';

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
    const { 
        arabicFontSize, 
        translationFontSize, 
        showTajweed, 
        showTranslation 
    } = useSettings();

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
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onOpenMenu?.(ayah);
                }
            }}
            className={cn(
                "w-full text-left py-6 sm:py-6 px-4 sm:px-4 transition-all duration-300 relative scroll-mt-28 group cursor-pointer lg:cursor-default",
                "border-b border-foreground/[0.04]",
                isActive
                    ? "bg-foreground/[0.04] border-transparent"
                    : "active:bg-foreground/[0.06] lg:active:bg-transparent"
            )}
        >
            {/* Active Indicator Line */}
            {isActive && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
            )}

            {/* Arabic Text - Full Width, Right-Aligned */}
            <div
                className={cn(
                    "font-arabic leading-[2.4] transition-all text-right w-full mb-4",
                    isActive ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
                )}
                dir="rtl"
                style={{ fontSize: `${arabicFontSize}px` }}
                dangerouslySetInnerHTML={{ 
                    __html: showTajweed 
                        ? parseTajweed(ayah.teksTajweed || ayah.teksArab) 
                        : ayah.teksArab 
                }}
            />

            {/* Translation */}
            {showTranslation && (
                <p className={cn(
                    "leading-relaxed transition-colors font-medium mt-2",
                    isActive ? "text-foreground/80" : "text-foreground/40 group-hover:text-foreground/60"
                )} style={{ fontSize: `${translationFontSize}px` }}>
                    {ayah.teksIndonesia}
                </p>
            )}

            {/* Footer: Ayah Number + Actions */}
            <div className="flex items-center justify-between mt-4">
                {/* Ayah Number Badge */}
                <button
                    onClick={(e) => { e.stopPropagation(); onPlay(ayah); }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all",
                        isActive 
                            ? "bg-primary/20 text-primary" 
                            : "bg-foreground/5 text-foreground/30 hover:bg-primary/10 hover:text-primary"
                    )}
                >
                    {isActive && isPlaying ? (
                        <>
                            <div className="flex items-end gap-[2px] h-3">
                                <motion.div animate={{ height: [3, 8, 4, 8, 3] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[2px] bg-primary rounded-full" />
                                <motion.div animate={{ height: [5, 3, 8, 3, 5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-[2px] bg-primary rounded-full" />
                                <motion.div animate={{ height: [8, 4, 3, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-primary rounded-full" />
                            </div>
                            <span>Ayat {ayah.nomorAyat}</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Ayat {ayah.nomorAyat}</span>
                        </>
                    )}
                </button>

                {/* Action Buttons - Desktop only, visible on hover/active */}
                <div className={cn(
                    "hidden lg:flex items-center gap-1 transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                    <button
                        onClick={(e) => onTafsir(e, ayah)}
                        className="w-8 h-8 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground/30 hover:text-foreground transition-colors"
                        title="Tafsir"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={(e) => onToggleFavorite(e, ayah)}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isFav ? "text-primary" : "hover:bg-foreground/10 text-foreground/30 hover:text-foreground"
                        )}
                        title={isFav ? 'Hapus Favorit' : 'Favorit'}
                    >
                        <Heart className={cn("w-3.5 h-3.5", isFav && "fill-current")} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isCopied ? "text-[#56B874]" : "hover:bg-foreground/10 text-foreground/30 hover:text-foreground"
                        )}
                        title={isCopied ? 'Tersalin' : 'Salin'}
                    >
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.isActive === next.isActive &&
        prev.isFav === next.isFav &&
        prev.ayah.numberGlobal === next.ayah.numberGlobal &&
        prev.isPlaying === next.isPlaying;
});
