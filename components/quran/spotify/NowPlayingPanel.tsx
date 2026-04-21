"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioState } from '@/contexts/AudioContext';
import { useSurahDetail, useReciters, useJuzDetail } from '@/hooks/use-quran';
import surahSummaryData from '@/lib/data/surahs.json';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { AyahTafsir } from '../AyahTafsir';
import { ChevronRight, Music2 } from 'lucide-react';

// Sub-components
import { MobileHeader, DesktopHeader } from './NowPlaying/Header';
import { AyahList } from './NowPlaying/AyahList';
import { SettingsDrawer, ActionDrawer } from './NowPlaying/Drawers';
import { SidebarProgress, SidebarControls, SidebarVolume, SidebarActiveInfo } from './NowPlaying/PlayerFooter';

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
    const [activeAyahForTafsir, setActiveAyahForTafsir] = useState<Ayah | null>(null);

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
    } = useAudioState();

    const { data: reciters = [] } = useReciters();

    // Data Fetching
    const { data: surahDetail, isLoading: surahLoading, isFetching: surahFetching } = useSurahDetail(
        !viewedJuz ? (viewedSurah?.nomor || 0) : 0,
        selectedReciterId
    );

    const { data: juzDetail, isLoading: juzLoading, isFetching: juzFetching } = useJuzDetail(
        viewedJuz || 0,
        selectedReciterId
    );

    const activeData = viewedJuz ? juzDetail : surahDetail;
    const isLoading = viewedJuz ? juzLoading : surahLoading;
    const isFetching = viewedJuz ? juzFetching : surahFetching;

    // Detect if the currently displayed data belongs to a previous surah/juz (stale due to keepPreviousData)
    const isDataStale = !isLoading && isFetching && (
        viewedJuz
            ? (activeData?.nomor !== viewedJuz)
            : (activeData?.nomor !== viewedSurah?.nomor)
    );

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Sync refreshed ayah data for audio
    React.useEffect(() => {
        if (currentAyah && activeData) {
            const updatedAyah = activeData.ayat?.find(a =>
                a.nomorAyat === currentAyah.nomorAyat &&
                (!viewedJuz || a.surahInfo?.nomor === currentAyah.surahInfo?.nomor)
            );
            if (updatedAyah && !currentAyah.audio[selectedReciterId] && updatedAyah.audio[selectedReciterId]) {
                playAyah(updatedAyah, playingSurah!, activeData.ayat);
            }
        }
    }, [activeData, currentAyah, selectedReciterId, playingSurah, playAyah, viewedJuz]);

    // Handlers
    const handleAyahJump = (ayah: Ayah) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
        const delay = isMobile ? 400 : 250;

        setTimeout(() => {
            const container = scrollContainerRef.current;
            const surahNum = ayah.surahInfo?.nomor || viewedSurah?.nomor;
            const npId = viewedJuz
                ? `np-ayah-${ayah.surahInfo?.nomor}-${ayah.nomorAyat}`
                : `np-ayah-${surahNum}-${ayah.nomorAyat}`;

            const mainId = `ayah-${surahNum}-${ayah.nomorAyat}`;
            const element = document.getElementById(npId) || document.getElementById(mainId);
            if (!element) return;

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
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 220,
                    mass: 0.8
                }}
                className={cn(
                    "flex flex-col shadow-2xl z-50",
                    "fixed inset-0 w-full h-screen",
                    "lg:relative lg:inset-auto lg:w-[480px] xl:w-[560px] lg:h-full lg:border-l lg:border-white/10",
                    "bg-[#0a0a0a] lg:bg-[#121212]/95 lg:backdrop-blur-3xl"
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
                    className="absolute top-1/2 -left-4 -translate-y-1/2 z-50 w-8 h-16 rounded-l-2xl bg-primary/10 hover:bg-primary/20 border-l border-y border-primary/20 backdrop-blur-3xl hidden lg:flex items-center justify-center text-primary/60 hover:text-primary transition-all shadow-[-10px_0_30px_rgba(0,0,0,0.5)] group/close-side"
                >
                    <motion.div animate={{ rotate: 0 }} className="cursor-pointer">
                        <motion.div whileHover={{ x: 2 }}><ChevronRight className="w-4 h-4" /></motion.div>
                    </motion.div>
                </button>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {!viewedSurah && !viewedJuz ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6 opacity-30 pt-24">
                            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10">
                                <Music2 className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-headline font-black text-white">Belum Ada Putaran</h3>
                                <p className="text-xs font-medium text-white/60 leading-relaxed max-w-[200px]">Pilih salah satu Surah atau Juz untuk mulai mendengarkan lantunan ayat suci Al-Qur'an.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                            <DesktopHeader
                                viewedJuz={viewedJuz}
                                viewedSurah={viewedSurah}
                                activeData={activeData}
                                handleTafsirClick={handleTafsirClick}
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
                            />
                        </div>
                    )}
                </div>

                {currentAyah && (
                    <div className="mt-auto bg-[#121212] border-t border-white/5 p-4 sm:p-6 py-5 flex flex-col gap-4 sm:gap-5 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                        <SidebarProgress />
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div className="w-full lg:w-auto flex justify-center lg:justify-start lg:flex-1 min-w-0">
                                <SidebarActiveInfo />
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <SidebarControls />
                            </div>
                            <div className="hidden lg:flex lg:flex-1 justify-end">
                                <SidebarVolume />
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

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
                tafsirText={undefined}
            />
        </>
    );
}
