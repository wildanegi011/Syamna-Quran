"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Ayah, SurahSummary } from '@/lib/types';
import { AyahItem } from './AyahItem';
import { useReadingProgress } from '@/contexts/ReadingProgressContext';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { useQuranAuth } from '@/contexts/QuranAuthContext';
import { ChevronDown, Loader2, Search, Trophy } from 'lucide-react';

// Surahs that don't start with Bismillah (At-Taubah) or already contains it (Al-Fatihah)
const NO_BISMILLAH = [1, 9];

interface AyahListProps {
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    isLoading: boolean;
    isFetching: boolean;
    isDataStale: boolean;
    activeData: any;
    handleAyahJump: (ayah: Ayah) => void;
    currentAyah: Ayah | null;
    playingSurah: SurahSummary | null;
    isPlaying: boolean;
    handleAyahPlay: (ayah: Ayah) => void;
    handleTafsirClick: (e: React.MouseEvent, ayah: Ayah) => void;
    handleCopyAyah: (e: React.MouseEvent, ayah: Ayah) => void;
    handleOpenMenu: (ayah: Ayah) => void;
    viewedSurah: SurahSummary | null;
    viewedJuz: number | null;
    // Infinite scroll
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    pagination?: any;
    isJumping?: boolean;
    mode: 'reading' | 'listening';
}

// Compact inline jump input 
export function AyahJumpInput({
    ayahs,
    onSelect,
    viewedJuz,
    pagination
}: {
    ayahs: Ayah[],
    onSelect: (ayah: Ayah) => void,
    viewedJuz: number | null,
    pagination?: any
}) {
    const [search, setSearch] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const placeholder = React.useMemo(() => {
        if (!ayahs || ayahs.length === 0) return "Lompat ke ayat...";

        const minAyat = Math.min(...ayahs.map(a => a.nomorAyat || 0));
        const maxAyat = Math.max(...ayahs.map(a => a.nomorAyat || 0));

        const pages = ayahs.map(a => a.pageNumber).filter(Boolean) as number[];
        const minPage = pages.length > 0 ? Math.min(...pages) : null;
        const maxPage = pages.length > 0 ? Math.max(...pages) : null;

        let label = `Lompat ke ayat (${minAyat}-${maxAyat})`;
        if (minPage && maxPage) {
            label += ` • Hal ${minPage === maxPage ? minPage : `${minPage}-${maxPage}`}`;
        }

        return `${label}...`;
    }, [ayahs]);

    const filtered = React.useMemo(() => {
        if (!search.trim()) return [];
        const q = search.toLowerCase().trim();
        return ayahs.filter((ayah) => {
            if (String(ayah.nomorAyat) === q) return true;
            if (String(ayah.nomorAyat).startsWith(q)) return true;
            if (ayah.surahInfo?.namaLatin?.toLowerCase().includes(q)) return true;
            return false;
        }).slice(0, 8);
    }, [ayahs, search]);

    // Check if we should offer a jump to a number that hasn't been loaded yet
    const jumpOption = React.useMemo(() => {
        const num = parseInt(search);
        if (isNaN(num)) return null;

        // Don't show jump if already in filtered list
        if (filtered.some(a => a.nomorAyat === num)) return null;

        // Check against total records if available
        const total = pagination?.totalRecords || 0;
        if (total > 0 && (num < 1 || num > total)) return null;

        return num;
    }, [search, filtered, pagination]);

    const handleSelect = (ayah: Ayah) => {
        setSearch("");
        setIsFocused(false);
        onSelect(ayah);
    };

    const handleJump = () => {
        if (!jumpOption) return;
        setSearch("");
        setIsFocused(false);
        // Create a partial Ayah object to trigger the fetch logic in parent
        onSelect({ nomorAyat: jumpOption } as Ayah);
    };

    return (
        <div className="relative">
            <div className="relative group">
                <Search className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                    isFocused ? "text-primary" : "text-foreground/20"
                )} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && jumpOption) handleJump();
                    }}
                    placeholder={placeholder}
                    className="w-full h-12 pl-11 pr-4 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-sm font-medium text-foreground placeholder:text-foreground/20 outline-none focus:border-primary/30 focus:bg-primary/5 focus:ring-4 focus:ring-primary/5 transition-all"
                />
            </div>

            {/* Results Dropdown */}
            {isFocused && (filtered.length > 0 || jumpOption) && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:absolute relative top-full left-0 right-0 lg:mt-1 mt-2 bg-background lg:border border-foreground/10 rounded-xl overflow-hidden lg:shadow-2xl z-[100] max-h-[300px] overflow-y-auto custom-scrollbar"
                >
                    {filtered.map((ayah, idx) => (
                        <button
                            key={`jump-${ayah.surahInfo?.nomor || 0}-${ayah.nomorAyat}-${idx}`}
                            type="button"
                            onMouseDown={() => handleSelect(ayah)}
                            className="w-full text-left px-5 py-4 hover:bg-primary/10 transition-colors flex items-center justify-between gap-3 border-b border-foreground/5 last:border-none"
                        >
                            <span className="text-xs font-bold text-foreground">Ayat {ayah.nomorAyat}</span>
                            {ayah.surahInfo && (
                                <span className="text-[10px] text-foreground/30 font-medium">
                                    {ayah.surahInfo.namaLatin}
                                </span>
                            )}
                        </button>
                    ))}

                    {jumpOption && (
                        <button
                            type="button"
                            onMouseDown={handleJump}
                            className="w-full text-left px-5 py-4 hover:bg-primary/10 transition-colors flex items-center justify-between gap-3 border-t border-foreground/5"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-primary">Lompat ke Ayat {jumpOption}</span>
                                <span className="text-[9px] text-foreground/40 font-medium uppercase tracking-tight">Data belum dimuat, klik untuk tarik otomatis</span>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                <ChevronDown className="w-3 h-3 text-primary -rotate-90" />
                            </div>
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}

// Clean skeleton that mirrors actual AyahItem layout
function AyahSkeleton() {
    return (
        <div className="py-6 px-2 sm:px-4 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3 py-5 border-b border-foreground/5">
                    {/* Arabic text skeleton */}
                    <div className="flex justify-end gap-3">
                        <div className="h-8 w-[85%] rounded-lg bg-foreground/[0.04]" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <div className="h-8 w-[65%] rounded-lg bg-foreground/[0.04]" />
                    </div>
                    {/* Translation skeleton */}
                    <div className="space-y-1.5 mt-3">
                        <div className="h-3.5 w-[90%] rounded bg-foreground/[0.03]" />
                        <div className="h-3.5 w-[70%] rounded bg-foreground/[0.03]" />
                    </div>
                    {/* Badge skeleton */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="h-7 w-20 rounded-full bg-foreground/[0.04]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Main list of Ayahs with goal and mode logic
export const AyahList = ({
    scrollContainerRef,
    isLoading,
    isFetching,
    isDataStale,
    activeData,
    handleAyahJump,
    currentAyah,
    playingSurah,
    isPlaying,
    handleAyahPlay,
    handleTafsirClick,
    handleCopyAyah,
    handleOpenMenu,
    viewedSurah,
    viewedJuz,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    pagination,
    isJumping,
    mode
}: AyahListProps) => {

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const { dailyGoal, hasFinishedGoalMode, setHasFinishedGoalMode, submitActivity, hasSubmittedToday } = useReadingProgress();
    const { readingBookmark, toggleReadingBookmark } = useQuranFoundation();
    const { isConnected, connectQuranAccount } = useQuranAuth();
    const [ayahPendingKey, setAyahPendingKey] = React.useState<string | null>(null);
    const [isConnecting, setIsConnecting] = React.useState(false);

    // Clear local pending state when mutation finishes
    useEffect(() => {
        if (!toggleReadingBookmark.isPending && !isConnecting) {
            setAyahPendingKey(null);
        }
    }, [toggleReadingBookmark.isPending, isConnecting]);

    const isGoalModeActive = mode === 'reading' && !hasFinishedGoalMode;
    // We only slice the array if they are in reading mode and haven't finished the goal
    const displayedAyat = isGoalModeActive ? activeData?.ayat?.slice(0, dailyGoal) : activeData?.ayat;
    // Check if we hit the limit in the current view
    const isTargetReachedInView = isGoalModeActive && (activeData?.ayat?.length || 0) >= dailyGoal;

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage?.();
                }
            },
            { root: scrollContainerRef.current, threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, scrollContainerRef]);

    return (
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar px-0 sm:px-5 lg:px-6 pb-20 relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewedJuz ? `juz-${viewedJuz}` : `surah-${viewedSurah?.nomor}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn("flex-1 flex flex-col", (isFetching && !isFetchingNextPage && !isDataStale) && "opacity-60")}
                >
                    <div className="hidden lg:block sticky top-0 z-30 pt-3 pb-3 bg-background -mx-1 px-1">
                        <AyahJumpInput
                            ayahs={(isLoading || isDataStale) ? [] : (displayedAyat || [])}
                            onSelect={handleAyahJump}
                            viewedJuz={viewedJuz}
                            pagination={pagination}
                        />
                    </div>

                    {isJumping && (
                        <div className="absolute inset-0 z-[40] bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-background border border-foreground/5 px-8 py-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse -z-10" />
                                </div>
                                <div className="flex flex-col items-center relative z-10">
                                    <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Menuju Ayat</span>
                                    <div className="flex gap-1 mt-2">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 rounded-full bg-primary" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-primary" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-primary" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {(isLoading || isDataStale) ? (
                        <AyahSkeleton />
                    ) : (
                        <>
                            {/* Bismillah Banner */}
                            {!viewedJuz && viewedSurah && !NO_BISMILLAH.includes(viewedSurah.nomor) && (
                                <div className="py-6 sm:py-8 flex flex-col items-center gap-2">
                                    <p className="text-2xl sm:text-3xl font-arabic text-foreground/70 leading-relaxed text-center" dir="rtl">
                                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="h-px w-8 bg-foreground/[0.08]" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/15">
                                            Dengan Nama Allah
                                        </span>
                                        <div className="h-px w-8 bg-foreground/[0.08]" />
                                    </div>
                                </div>
                            )}

                            {displayedAyat?.map((ayah: Ayah, idx: number) => {
                                const prevAyah = idx > 0 ? displayedAyat?.[idx - 1] : null;
                                const showSurahHeader = viewedJuz && (!prevAyah || prevAyah.surahInfo?.nomor !== ayah.surahInfo?.nomor);

                                return (
                                    <React.Fragment key={`${ayah.surahInfo?.nomor || viewedSurah?.nomor}-${ayah.nomorAyat}`}>
                                        {showSurahHeader && (
                                            <div className="py-6 flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="h-px flex-1 bg-foreground/[0.05]" />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary px-3">
                                                        Surah {ayah.surahInfo?.namaLatin}
                                                    </span>
                                                    <div className="h-px flex-1 bg-foreground/[0.05]" />
                                                </div>
                                                {ayah.surahInfo?.nomor && !NO_BISMILLAH.includes(ayah.surahInfo.nomor) && (
                                                    <p className="text-xl font-arabic text-foreground/50 mt-1" dir="rtl">
                                                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <AyahItem
                                            ayah={ayah}
                                            surahNumber={ayah.surahInfo?.nomor || viewedSurah?.nomor}
                                            customId={viewedJuz ? `np-ayah-${ayah.surahInfo?.nomor}-${ayah.nomorAyat}` : `np-ayah-${viewedSurah?.nomor}-${ayah.nomorAyat}`}
                                            isActive={currentAyah?.nomorAyat === ayah.nomorAyat && (
                                                (currentAyah?.surahInfo?.nomor || playingSurah?.nomor) === (ayah.surahInfo?.nomor || viewedSurah?.nomor)
                                            )}
                                            isPlaying={isPlaying}
                                            isBookmarked={
                                                readingBookmark.data?.key === (ayah.surahInfo?.nomor || viewedSurah?.nomor) &&
                                                readingBookmark.data?.verseNumber === ayah.nomorAyat
                                            }
                                            isBookmarking={
                                                ayahPendingKey === `${ayah.surahInfo?.nomor || viewedSurah?.nomor}-${ayah.nomorAyat}`
                                            }
                                            onPlay={handleAyahPlay}
                                            onTafsir={handleTafsirClick}
                                            onCopy={handleCopyAyah}
                                            onToggleBookmark={(e) => {
                                                e.stopPropagation();
                                                const sId = ayah.surahInfo?.nomor || viewedSurah?.nomor || 0;
                                                const aId = ayah.nomorAyat;
                                                setAyahPendingKey(`${sId}-${aId}`);

                                                if (!isConnected) {
                                                    setIsConnecting(true);
                                                    connectQuranAccount();
                                                    return;
                                                }
                                                
                                                toggleReadingBookmark.mutate({
                                                    surahId: sId,
                                                    ayahId: aId
                                                });
                                            }}
                                            onOpenMenu={handleOpenMenu}
                                            mode={mode}
                                        />
                                    </React.Fragment>
                                );
                            })}

                            {isTargetReachedInView ? (
                                <div className="py-8 px-4 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Target {dailyGoal} Ayat Tercapai</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full max-w-[280px]">
                                        <button
                                            onClick={() => {
                                                const ranges = displayedAyat.map((a: Ayah) => `${a.surahInfo?.nomor || viewedSurah?.nomor}:${a.nomorAyat}-${a.surahInfo?.nomor || viewedSurah?.nomor}:${a.nomorAyat}`);
                                                submitActivity(dailyGoal, ranges);
                                            }}
                                            disabled={hasSubmittedToday}
                                            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-wider text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {hasSubmittedToday ? "Tersimpan ✅" : "Selesai ✨"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const ranges = displayedAyat.map((a: Ayah) => `${a.surahInfo?.nomor || viewedSurah?.nomor}:${a.nomorAyat}-${a.surahInfo?.nomor || viewedSurah?.nomor}:${a.nomorAyat}`);
                                                submitActivity(dailyGoal, ranges);
                                                setHasFinishedGoalMode(true);
                                            }}
                                            className="flex-1 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 font-bold uppercase tracking-wider text-[10px] transition-colors"
                                        >
                                            Lanjut Baca
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Infinite Scroll Sentinel + Loading */
                                <div ref={loadMoreRef} className="py-6 flex justify-center">
                                    {isFetchingNextPage ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2 text-foreground/30"
                                        >
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs font-medium">Memuat ayat...</span>
                                        </motion.div>
                                    ) : hasNextPage ? (
                                        <button
                                            onClick={() => fetchNextPage?.()}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground/30 hover:text-foreground/50 text-xs font-medium transition-all"
                                        >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                            Muat lagi
                                        </button>
                                    ) : displayedAyat?.length > 0 ? (
                                        <span className="text-[10px] text-foreground/15 font-medium uppercase tracking-wider">
                                            — Selesai —
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};
