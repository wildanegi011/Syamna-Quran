"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioState } from '@/contexts/AudioContext';
import { useSurahDetail, useReciters, useJuzDetail } from '@/hooks/use-quran';
import surahSummaryData from '@/lib/data/surahs.json';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { AyahTafsir } from '../AyahTafsir';
import { SurahInfo } from '../SurahInfo';
import { ChevronRight, Music2 } from 'lucide-react';

// Sub-components
import { MobileHeader, DesktopHeader } from './NowPlaying/Header';
import { AyahList } from './NowPlaying/AyahList';
import { SettingsDrawer, ActionDrawer } from './NowPlaying/Drawers';
import { SidebarProgress, SidebarControls, SidebarVolume, SidebarActiveInfo } from './NowPlaying/PlayerFooter';
import { useSettings } from '@/contexts/SettingsContext';

function findScrollParent(el: HTMLElement): HTMLElement | null {
    let parent = el.parentElement;
    while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

export function NowPlayingPanel({ onOpenTajweed }: { onOpenTajweed?: () => void }) {
    // UI States
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedAyahMenu, setSelectedAyahMenu] = useState<Ayah | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tafsirOpen, setTafsirOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [activeAyahForTafsir, setActiveAyahForTafsir] = useState<Ayah | null>(null);
    const [targetAyahNum, setTargetAyahNum] = useState<number | null>(null);

    const {
        currentAyah,
        isPlaying,
        viewedJuz,
        viewedSurah,
        setViewedSurah,
        setViewedJuz,
        selectedReciterId,
        setReciterId,
        playAyah,
        toggleFavorite,
        isFavorite,
        currentSurah: playingSurah,
        setRightPanelOpen,
        isRightPanelOpen,
    } = useAudioState();
    const { tafsirId } = useSettings();

    const { data: reciters = [] } = useReciters();

    // Data Fetching — Infinite Query
    const {
        data: surahDetail,
        isLoading: surahLoading,
        isFetching: surahFetching,
        isFetchingNextPage: surahFetchingNext,
        hasNextPage: surahHasNext,
        fetchNextPage: surahFetchNext,
        pagination: surahPagination
    } = useSurahDetail(
        !viewedJuz ? (viewedSurah?.nomor || 0) : 0,
        selectedReciterId,
        isRightPanelOpen // Only fetch when panel is open
    );

    const {
        data: juzDetail,
        isLoading: juzLoading,
        isFetching: juzFetching,
        isFetchingNextPage: juzFetchingNext,
        hasNextPage: juzHasNext,
        fetchNextPage: juzFetchNext,
        pagination: juzPagination
    } = useJuzDetail(
        viewedJuz || 0,
        selectedReciterId,
        isRightPanelOpen // Only fetch when panel is open
    );

    const activeData = viewedJuz ? juzDetail : surahDetail;
    const isLoading = viewedJuz ? juzLoading : surahLoading;
    const isFetching = viewedJuz ? juzFetching : surahFetching;
    const isFetchingNextPage = viewedJuz ? juzFetchingNext : surahFetchingNext;
    const hasNextPage = viewedJuz ? juzHasNext : surahHasNext;
    const fetchNextPage = viewedJuz ? juzFetchNext : surahFetchNext;
    const pagination = viewedJuz ? juzPagination : surahPagination;
    const isJumping = !!targetAyahNum;

    // Detect if the currently displayed data belongs to a previous surah/juz (stale due to keepPreviousData)
    const isDataStale = !isLoading && isFetching && (
        viewedJuz
            ? (activeData?.nomor !== viewedJuz)
            : (activeData?.nomor !== viewedSurah?.nomor)
    );

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Effect to handle sequential jump fetching
    React.useEffect(() => {
        if (!targetAyahNum || !activeData?.ayat || isFetchingNextPage) return;

        const found = activeData.ayat.find((a: Ayah) => a.nomorAyat === targetAyahNum);
        if (found) {
            handleAyahJump(found);
            setTargetAyahNum(null);
        } else if (hasNextPage) {
            fetchNextPage();
        } else {
            // Reached end and not found
            setTargetAyahNum(null);
        }
    }, [activeData?.ayat, targetAyahNum, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Sync scroll to active ayah
    React.useEffect(() => {
        if (currentAyah && isRightPanelOpen && !isJumping) {
            // Check if we are viewing the surah/juz that is currently playing
            const playingSurahNum = currentAyah.surahInfo?.nomor || playingSurah?.nomor;
            const isPlayingViewedSurah = !viewedJuz && playingSurahNum === viewedSurah?.nomor;
            const isPlayingViewedJuz = viewedJuz && (currentAyah.juzNumber === viewedJuz);

            if (isPlayingViewedSurah || isPlayingViewedJuz) {
                // Use a slightly longer delay for auto-scroll to feel more natural
                const timeoutId = setTimeout(() => {
                    handleAyahJump(currentAyah);
                }, 100);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [currentAyah?.nomorAyat, currentAyah?.surahInfo?.nomor, isRightPanelOpen, viewedSurah?.nomor, viewedJuz, playingSurah?.nomor]);

    // Sync refreshed ayah data for audio
    React.useEffect(() => {
        if (currentAyah && activeData?.ayat && playingSurah) {
            const updatedAyah = activeData.ayat.find((a: Ayah) =>
                a.nomorAyat === currentAyah.nomorAyat &&
                (a.surahInfo?.nomor || viewedSurah?.nomor) === (currentAyah.surahInfo?.nomor || playingSurah?.nomor)
            );

            if (updatedAyah && !currentAyah.audio[selectedReciterId]?.url && updatedAyah.audio[selectedReciterId]?.url) {
                playAyah(updatedAyah, playingSurah!, activeData.ayat);
            }
        }
    }, [activeData, currentAyah, selectedReciterId, playingSurah, playAyah, viewedJuz]);

    // Handlers
    const handleAyahJump = (ayah: Ayah) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
        const delay = isMobile ? 400 : 150;

        // If ayah only contains nomorAyat (virtual result), we need to fetch it first
        if (Object.keys(ayah).length === 1 && ayah.nomorAyat) {
            const existing = activeData?.ayat?.find((a: Ayah) => a.nomorAyat === ayah.nomorAyat);
            if (existing) {
                handleAyahJump(existing);
            } else {
                setTargetAyahNum(ayah.nomorAyat);
            }
            return;
        }

        setTimeout(() => {
            const container = scrollContainerRef.current;
            const surahNum = ayah.surahInfo?.nomor || viewedSurah?.nomor;
            const npId = viewedJuz
                ? `np-ayah-${ayah.surahInfo?.nomor}-${ayah.nomorAyat}`
                : `np-ayah-${surahNum}-${ayah.nomorAyat}`;

            const mainId = `ayah-${surahNum}-${ayah.nomorAyat}`;
            const element = document.getElementById(npId) || document.getElementById(mainId);

            if (!element) {
                // If element still not in DOM, maybe try one more time or just set target
                if (!targetAyahNum) setTargetAyahNum(ayah.nomorAyat);
                return;
            }

            const targetContainer = (container && container.contains(element))
                ? container
                : findScrollParent(element as HTMLElement);

            if (!targetContainer) return;

            const containerRect = targetContainer.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const offset = isMobile ? 120 : 80;
            const scrollTarget = elementRect.top - containerRect.top + targetContainer.scrollTop - offset;

            targetContainer.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
        }, delay);
    };

    const handleAyahPlay = (targetAyah: Ayah) => {
        const surahNum = targetAyah.surahInfo?.nomor || viewedSurah?.nomor;
        const contextSurah = (surahSummaryData as any[]).find(s => s.nomor === surahNum) || viewedSurah || playingSurah;
        if (contextSurah) {
            playAyah(targetAyah, contextSurah, activeData?.ayat || [], viewedJuz);
        }
    };

    const handleTafsirClick = (e: React.MouseEvent, ayah: Ayah) => {
        e.stopPropagation();
        setActiveAyahForTafsir(ayah);
        setTafsirOpen(true);
    };

    const handleCopyAyah = async (e: React.MouseEvent, ayah: Ayah) => {
        e.stopPropagation();
        const textToCopy = `${ayah.teksArab}\n\n${ayah.teksIndonesia}\n\n(QS. ${(viewedSurah?.namaLatin || ayah.surahInfo?.namaLatin)}: ${ayah.nomorAyat})`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleOpenMenu = (ayah: Ayah) => {
        setSelectedAyahMenu(ayah);
        setIsMenuOpen(true);
    };

    return (
        <>
            <div
                className={cn(
                    "flex flex-col h-full w-full",
                    "lg:border-l lg:border-foreground/10",
                    "bg-background lg:bg-background/95 lg:backdrop-blur-3xl"
                )}
            >
                <MobileHeader
                    viewedJuz={viewedJuz}
                    viewedSurah={viewedSurah}
                    setRightPanelOpen={setRightPanelOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                    surahSummaryData={surahSummaryData}
                    setViewedSurah={setViewedSurah}
                    setViewedJuz={setViewedJuz}
                    scrollContainerRef={scrollContainerRef}
                    activeData={activeData}
                    handleAyahJump={handleAyahJump}
                    pagination={pagination}
                />

                {isFetching && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute top-0 left-0 right-0 h-1 bg-primary z-[60] lg:z-50 origin-left"
                        transition={{ duration: 0.5 }}
                    />
                )}

                <button
                    onClick={() => setRightPanelOpen(false)}
                    className={cn(
                        "absolute top-1/2 -left-5 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center justify-center w-7 h-20 rounded-l-2xl bg-gradient-to-r from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border-l border-y border-primary/25 hover:border-primary/40 backdrop-blur-xl text-primary/60 hover:text-primary transition-all duration-300 group/close shadow-lg shadow-black/20 cursor-pointer",
                        isRightPanelOpen ? "opacity-100 translate-x-0" : "opacity-0 pointer-events-none translate-x-4"
                    )}
                >
                    {/* Accent line */}
                    <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-primary/40 group-hover/close:bg-primary/70 transition-colors" />
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/close:translate-x-0.5" />
                </button>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {!viewedSurah && !viewedJuz ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6 opacity-30 pt-24">
                            <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center border border-foreground/10">
                                <Music2 className="w-10 h-10 text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-headline font-black text-foreground">Belum Ada Putaran</h3>
                                <p className="text-xs font-medium text-foreground/60 leading-relaxed max-w-[200px]">Pilih salah satu Surah atau Juz untuk mulai mendengarkan lantunan ayat suci Al-Qur'an.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                            <DesktopHeader
                                viewedJuz={viewedJuz}
                                viewedSurah={viewedSurah}
                                activeData={activeData}
                                onOpenInfo={() => setInfoOpen(true)}
                                onOpenTajweed={onOpenTajweed}
                                reciters={reciters}
                                selectedReciterId={selectedReciterId}
                                setReciterId={setReciterId}
                                isFetching={isFetching}
                            />

                            <AyahList
                                scrollContainerRef={scrollContainerRef}
                                isLoading={isLoading}
                                isFetching={isFetching}
                                isDataStale={isDataStale}
                                activeData={activeData}
                                handleAyahJump={handleAyahJump}
                                currentAyah={currentAyah}
                                playingSurah={playingSurah}
                                isPlaying={isPlaying}
                                isFavorite={isFavorite}
                                toggleFavorite={toggleFavorite}
                                handleAyahPlay={handleAyahPlay}
                                handleTafsirClick={handleTafsirClick}
                                handleCopyAyah={handleCopyAyah}
                                handleOpenMenu={handleOpenMenu}
                                viewedSurah={viewedSurah}
                                viewedJuz={viewedJuz}
                                hasNextPage={hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                                pagination={pagination}
                                isJumping={!!targetAyahNum}
                            />
                        </div>
                    )}
                </div>

                {currentAyah && (
                    <div className="mt-auto bg-background/95 backdrop-blur-xl border-t border-foreground/5 z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] flex flex-col relative">
                        {/* Progress bar at the very top for mobile, slightly inset for desktop */}
                        <div className="absolute top-0 left-0 right-0 lg:px-6">
                            <SidebarProgress />
                        </div>

                        <div className="px-5 py-2 lg:p-6 lg:pt-8 flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-5">
                            <div className="flex lg:w-auto justify-center lg:justify-start lg:flex-1 min-w-0">
                                <SidebarActiveInfo />
                            </div>
                            <div className="flex flex-col items-center py-1">
                                <SidebarControls />
                            </div>
                            <div className="hidden lg:flex lg:flex-1 justify-end">
                                <SidebarVolume />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <SettingsDrawer
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
                isLoading={isLoading}
                isDataStale={isDataStale}
                activeData={activeData}
                handleAyahJump={handleAyahJump}
                setRightPanelOpen={setRightPanelOpen}
                reciters={reciters}
                selectedReciterId={selectedReciterId}
                setReciterId={setReciterId}
                onOpenTajweed={onOpenTajweed}
                viewedJuz={viewedJuz}
            />

            <ActionDrawer
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                selectedAyahMenu={selectedAyahMenu}
                viewedJuz={viewedJuz}
                viewedSurah={viewedSurah}
                handleAyahPlay={handleAyahPlay}
                handleTafsirClick={handleTafsirClick}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                isCopied={isCopied}
                handleCopyAyah={handleCopyAyah}
            />

            <AyahTafsir
                isOpen={tafsirOpen}
                onOpenChange={setTafsirOpen}
                ayahNumber={activeAyahForTafsir?.nomorAyat || 0}
                surahNumber={activeAyahForTafsir?.surahInfo?.nomor || viewedSurah?.nomor}
                surahName={activeAyahForTafsir?.surahInfo?.namaLatin || viewedSurah?.namaLatin || ""}
                tafsirId={tafsirId}
            />

            <SurahInfo
                isOpen={infoOpen}
                onOpenChange={setInfoOpen}
                surahNumber={viewedSurah?.nomor || activeAyahForTafsir?.surahInfo?.nomor || 0}
                surahName={viewedSurah?.namaLatin || activeAyahForTafsir?.surahInfo?.namaLatin || ""}
            />
        </>
    );
}
