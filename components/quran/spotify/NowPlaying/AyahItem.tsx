"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { parseTajweed } from '@/lib/utils/tajweed';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/lib/constants/translations';
import { 
    Play, 
    Pause,
    BookOpen,
    Bookmark, 
    Copy, 
    CheckCircle2,
    Sparkles,
    Loader2
} from 'lucide-react';

export const AyahItem = React.memo(({
    ayah,
    isActive,
    isBookmarked,
    onTafsir,
    onCopy,
    onToggleBookmark,
    onPlay,
    onOpenMenu,
    isPlaying,
    surahNumber,
    customId,
    mode,
    isBookmarking,
    isLastRead
}: {
    ayah: Ayah,
    isActive: boolean,
    isBookmarked: boolean,
    isBookmarking: boolean,
    onTafsir: (e: React.MouseEvent, ayah: Ayah) => void,
    onCopy: (e: React.MouseEvent, ayah: Ayah) => void,
    onToggleBookmark: (e: React.MouseEvent, ayah: Ayah) => void,
    onPlay: (ayah: Ayah) => void,
    onOpenMenu?: (ayah: Ayah) => void,
    isPlaying: boolean,
    surahNumber?: number,
    customId?: string,
    mode?: 'reading' | 'listening',
    isLastRead?: boolean
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const { 
        arabicFontSize, 
        translationFontSize, 
        showTajweed, 
        showTranslation,
        showLatin,
        mushafId,
        language
    } = useSettings();
    const { t } = useTranslation(language);

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
                    : isLastRead
                        ? "bg-primary/[0.03] border-primary/10"
                        : "active:bg-foreground/[0.06] lg:active:bg-transparent"
            )}
        >
            {/* Active Indicator Line (Playing) */}
            {isActive && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
            )}
            
            {/* Last Read Indicator (Bookmark) */}
            {isLastRead && !isActive && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary/40 shadow-[0_0_4px_rgba(var(--primary-rgb),0.2)]" />
            )}

            {/* Arabic Text - Full Width, Right-Aligned */}
            <div
                className={cn(
                    [3, 6, 7].includes(mushafId) ? "font-indopak" : "font-arabic",
                    "leading-[2.4] transition-all text-right w-full mb-4",
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

            {/* Latin / Transliteration */}
            {showLatin && ayah.teksLatin && (
                <p className={cn(
                    "leading-relaxed transition-colors font-medium mt-2 italic text-primary/80",
                    isActive ? "text-primary" : "text-primary/60 group-hover:text-primary/80"
                )} style={{ fontSize: `${translationFontSize - 2}px` }}>
                    {ayah.teksLatin}
                </p>
            )}

            {/* Translation */}
            {showTranslation && (
                <p className={cn(
                    "leading-relaxed transition-colors font-medium mt-1",
                    isActive ? "text-foreground/80" : "text-foreground/40 group-hover:text-foreground/60"
                )} style={{ fontSize: `${translationFontSize}px` }}>
                    {ayah.teksIndonesia}
                </p>
            )}

            {/* Footer: Ayah Number + Actions */}
            <div className="flex items-center justify-between mt-4">
                {/* Ayah Number Badge */}
                <button
                    onClick={(e) => { 
                        if (mode === 'listening') {
                            e.stopPropagation(); 
                            onPlay(ayah); 
                        }
                    }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all",
                        isActive 
                            ? "bg-primary/20 text-primary" 
                            : "bg-foreground/5 text-foreground/30",
                        mode === 'listening' && !isActive && "hover:bg-primary/10 hover:text-primary",
                        mode === 'reading' && "cursor-default"
                    )}
                >
                    {isActive && isPlaying && mode === 'listening' ? (
                        <>
                            <div className="flex items-end gap-[2px] h-3">
                                <motion.div animate={{ height: [3, 8, 4, 8, 3] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[2px] bg-primary rounded-full" />
                                <motion.div animate={{ height: [5, 3, 8, 3, 5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-[2px] bg-primary rounded-full" />
                                <motion.div animate={{ height: [8, 4, 3, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-primary rounded-full" />
                            </div>
                            <span>{t('ayat')} {ayah.nomorAyat}</span>
                        </>
                    ) : (
                        <>
                            {mode === 'listening' && <Play className="w-3 h-3 fill-current" />}
                            <span>{t('ayat')} {ayah.nomorAyat}</span>
                        </>
                    )}
                </button>

                {/* Action Buttons - Desktop only, visible on hover/active */}
                <div className={cn(
                    "hidden lg:flex items-center gap-2 transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                    <button
                        onClick={(e) => onTafsir(e, ayah)}
                        className="h-8 px-3 rounded-full hover:bg-foreground/10 flex items-center gap-1.5 text-foreground/30 hover:text-foreground transition-all group/btn"
                    >
                        <BookOpen className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{t('tafsir')}</span>
                    </button>

                    <button
                        onClick={(e) => !isBookmarking && onToggleBookmark(e, ayah)}
                        disabled={isBookmarking}
                        className={cn(
                            "h-8 px-3 rounded-full flex items-center gap-1.5 transition-all group/btn",
                            isBookmarked 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-foreground/10 text-foreground/30 hover:text-foreground",
                            isBookmarking && "opacity-50 cursor-wait"
                        )}
                    >
                        {isBookmarking ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Bookmark className={cn("w-3.5 h-3.5 transition-transform group-hover/btn:scale-110", isBookmarked && "fill-current")} />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {isBookmarking ? (language === 'ID' ? 'Proses...' : 'Processing...') : (isBookmarked ? t('ditandai') : t('tandai'))}
                        </span>
                    </button>

                    <button
                        onClick={handleCopy}
                        className={cn(
                            "h-8 px-3 rounded-full flex items-center gap-1.5 transition-all group/btn",
                            isCopied 
                                ? "bg-[#56B874]/10 text-[#56B874]" 
                                : "hover:bg-foreground/10 text-foreground/30 hover:text-foreground"
                        )}
                    >
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {isCopied ? (language === 'ID' ? 'Tersalin' : 'Copied') : (language === 'ID' ? 'Salin' : 'Copy')}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.isActive === next.isActive &&
        prev.isBookmarked === next.isBookmarked &&
        prev.isBookmarking === next.isBookmarking &&
        prev.ayah.numberGlobal === next.ayah.numberGlobal &&
        prev.isPlaying === next.isPlaying &&
        prev.mode === next.mode;
});
