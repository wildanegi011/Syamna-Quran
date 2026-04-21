"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Ayah, SurahSummary } from '@/lib/types';
import { AyahSelect } from '@/components/quran/AyahSelect';
import { AyahItem } from './AyahItem';

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
    isFavorite: (surahId: number, ayahId: number) => boolean;
    toggleFavorite: (surahId: number, ayahId: number) => void;
    handleAyahPlay: (ayah: Ayah) => void;
    handleTafsirClick: (e: React.MouseEvent, ayah: Ayah) => void;
    handleCopyAyah: (e: React.MouseEvent, ayah: Ayah) => void;
    handleOpenMenu: (ayah: Ayah) => void;
    viewedSurah: SurahSummary | null;
    viewedJuz: number | null;
}

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
    isFavorite,
    toggleFavorite,
    handleAyahPlay,
    handleTafsirClick,
    handleCopyAyah,
    handleOpenMenu,
    viewedSurah,
    viewedJuz
}: AyahListProps) => {
    return (
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 pb-20 relative">
            {/* Sticky Search Area */}
            <div className="sticky top-0 z-30 pt-4 pb-6 bg-[#121212] -mx-2 px-2 border-b border-white/5 shadow-md hidden lg:block">
                <AyahSelect
                    ayahs={(isLoading || isDataStale) ? [] : (activeData?.ayat || [])}
                    onSelect={handleAyahJump}
                    placeholder={viewedJuz ? "Cari ayat di Juz ini..." : "Cari atau Lompat ke ayat..."}
                    showSurahName={!!viewedJuz}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={viewedJuz ? `juz-${viewedJuz}` : `surah-${viewedSurah?.nomor}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn("flex-1 flex flex-col", (isFetching && !isDataStale) && "opacity-60")}
                >
                    {(isLoading || isDataStale) ? (
                        <div className="flex flex-col gap-2 p-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        activeData?.ayat?.map((ayah: Ayah, idx: number) => {
                            const prevAyah = idx > 0 ? activeData?.ayat?.[idx - 1] : null;
                            const showSurahHeader = viewedJuz && (!prevAyah || prevAyah.surahInfo?.nomor !== ayah.surahInfo?.nomor);

                            return (
                                <React.Fragment key={`${ayah.surahInfo?.nomor || viewedSurah?.nomor}-${ayah.nomorAyat}`}>
                                    {showSurahHeader && (
                                        <div className="pt-10 pb-6 px-2">
                                            <div className="flex items-center gap-4">
                                                <div className="h-[2px] flex-1 bg-white/[0.03] rounded-full" />
                                                <div className="px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                                                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                                                        Surah {ayah.surahInfo?.namaLatin}
                                                    </h4>
                                                </div>
                                                <div className="h-[2px] flex-1 bg-white/[0.03] rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                    <AyahItem
                                        ayah={ayah}
                                        surahNumber={ayah.surahInfo?.nomor || viewedSurah?.nomor}
                                        customId={viewedJuz ? `np-ayah-${ayah.surahInfo?.nomor}-${ayah.nomorAyat}` : `np-ayah-${viewedSurah?.nomor}-${ayah.nomorAyat}`}
                                        isActive={currentAyah?.nomorAyat === ayah.nomorAyat && (
                                            // Strict surah check
                                            (currentAyah?.surahInfo?.nomor || playingSurah?.nomor) === (ayah.surahInfo?.nomor || viewedSurah?.nomor)
                                        )}
                                        isPlaying={isPlaying}
                                        isFav={isFavorite(ayah.surahInfo?.nomor || viewedSurah?.nomor || 0, ayah.nomorAyat)}
                                        onPlay={handleAyahPlay}
                                        onTafsir={handleTafsirClick}
                                        onCopy={handleCopyAyah}
                                        onToggleFavorite={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(ayah.surahInfo?.nomor || viewedSurah?.nomor || 0, ayah.nomorAyat);
                                        }}
                                        onOpenMenu={handleOpenMenu}
                                    />
                                </React.Fragment>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
