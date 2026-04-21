"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioState, useAudioProgress } from '@/contexts/AudioContext';
import { useSurahDetail, useReciters, useJuzDetail } from '@/hooks/use-quran';
import surahSummaryData from '@/lib/data/surahs.json';
import { cn } from '@/lib/utils';
import { Ayah } from '@/lib/types';
import { parseTajweed } from '@/lib/utils/tajweed';
import { AyahTafsir } from '../AyahTafsir';
import { AyahSelect } from '@/components/quran/AyahSelect';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Headphones,
    Check,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Shuffle,
    Repeat,
    Repeat1,
    BookOpen as BookOpenIcon,
    Heart as HeartIcon,
    Share2 as ShareIcon,
    Sparkles,
    Music2,
    ChevronRight,
    BookOpen,
    Heart,
    Pause,
    Play,
    Copy,
    CheckCircle2
} from 'lucide-react';

const AyahItem = React.memo(({
    ayah,
    isActive,
    isFav,
    onTafsir,
    onCopy,
    onToggleFavorite,
    onPlay,
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
            className={cn(
                "w-full text-left p-4 rounded-[1.5rem] transition-all duration-300 flex items-start gap-4 group relative overflow-hidden scroll-mt-28",
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

                {/* Vertical Actions (Visible on Hover/Active) */}
                <div className={cn(
                    "flex flex-col items-center gap-3 transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                )}>
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
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                    <div
                        className={cn(
                            "text-4xl font-arabic leading-[2.2] transition-all text-right w-full",
                            isActive ? "text-white font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-white/90 group-hover:text-white"
                        )}
                        dir="rtl"
                        style={{ fontSize: 'clamp(22px, 3.5vw, 32px)' }}
                        dangerouslySetInnerHTML={{ __html: parseTajweed(ayah.teksTajweed || ayah.teksArab) }}
                    />
                </div>
                <p className={cn(
                    "text-sm leading-relaxed transition-colors font-medium",
                    isActive ? "text-white/90" : "text-white/40 group-hover:text-white/70"
                )}>
                    {ayah.teksIndonesia}
                </p>
            </div>
        </div>
    );
}, (prev, next) => {
    return prev.isActive === next.isActive &&
        prev.isFav === next.isFav &&
        prev.ayah.numberGlobal === next.ayah.numberGlobal;
});

export function NowPlayingPanel({ onOpenTajweed }: { onOpenTajweed?: () => void }) {
    const {
        currentAyah,
        isPlaying,
        togglePlay,
        setRightPanelOpen,
        playAyah,
        toggleFavorite,
        isFavorite,
        selectedReciterId,
        setReciterId,
        currentSurah: playingSurah,
        currentJuz: playingJuz,
        viewedSurah,
        viewedJuz
    } = useAudioState();

    const { data: reciters = [] } = useReciters();

    // Conditional fetching based on whether we're in a Juz or a Surah view
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

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Tafsir Modal State
    const [tafsirOpen, setTafsirOpen] = useState(false);
    const [activeAyahForTafsir, setActiveAyahForTafsir] = useState<Ayah | null>(null);

    // Sync refreshed ayah data to AudioContext when Qori is switched
    React.useEffect(() => {
        if (currentAyah && activeData) {
            const updatedAyah = activeData.ayat.find(a =>
                a.nomorAyat === currentAyah.nomorAyat &&
                (!viewedJuz || a.surahInfo?.nomor === currentAyah.surahInfo?.nomor)
            );
            // If the updated version has the audio URL we're looking for, but our current one doesn't
            if (updatedAyah && !currentAyah.audio[selectedReciterId] && updatedAyah.audio[selectedReciterId]) {
                const { audio: oldAudio, ...rest } = currentAyah;
                playAyah(updatedAyah, playingSurah!, activeData.ayat);
            }
        }
    }, [activeData, currentAyah, selectedReciterId, playingSurah, playAyah, playingJuz]);

    const handleAyahJump = (ayah: Ayah) => {
        // Delay scroll to let the Popover fully close and layout stabilize
        setTimeout(() => {
            const container = scrollContainerRef.current;
            const id = viewedJuz
                ? `np-ayah-${ayah.surahInfo?.nomor}-${ayah.nomorAyat}`
                : `np-ayah-${ayah.nomorAyat}`;
            const element = document.getElementById(id);
            if (!container || !element) return;

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const scrollTarget = elementRect.top - containerRect.top + container.scrollTop - 80;

            container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }, 250);
    };

    React.useEffect(() => {
        if (currentAyah && scrollContainerRef.current && (viewedSurah || viewedJuz)) {
            // Only auto-scroll if the playing ayah belongs to the surah/context we are currently viewing
            const playingSurahNum = currentAyah.surahInfo?.nomor || playingSurah?.nomor;
            const viewedSurahNum = viewedSurah?.nomor;

            if (!viewedJuz && playingSurahNum !== viewedSurahNum) return;

            const container = scrollContainerRef.current;
            const id = viewedJuz
                ? `np-ayah-${currentAyah.surahInfo?.nomor}-${currentAyah.nomorAyat}`
                : `np-ayah-${playingSurahNum || viewedSurahNum}-${currentAyah.nomorAyat}`;

            const activeElement = container.querySelector(`#${id}`) as HTMLElement;
            if (activeElement) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = activeElement.getBoundingClientRect();

                // Calculate position to center the ayah in the viewport
                const scrollTarget = elementRect.top - containerRect.top + container.scrollTop - (container.clientHeight / 3);

                container.scrollTo({
                    top: Math.max(0, scrollTarget),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentAyah, viewedJuz, viewedSurah, playingSurah]);

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
            // Optionally add a toast here if you have a toast system
            console.log("Ayah copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    // Single return structure for consistency
    return (
        <>
            <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 450 }}
                className="w-full lg:w-[480px] xl:w-[560px] shrink-0 h-full bg-[#121212]/40 backdrop-blur-3xl border-l border-white/10 flex flex-col z-40 relative shadow-2xl pt-20"
            >
                {/* Background Fetching Loader */}
                {isFetching && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                        transition={{ duration: 0.5 }}
                    />
                )}

                {/* Side Toggle Button (Middle Left) */}
                <button
                    onClick={() => setRightPanelOpen(false)}
                    className="absolute top-1/2 -left-4 -translate-y-1/2 z-50 w-8 h-16 rounded-l-2xl bg-primary/10 hover:bg-primary/20 border-l border-y border-primary/20 backdrop-blur-3xl flex items-center justify-center text-primary/60 hover:text-primary transition-all shadow-[-10px_0_30px_rgba(0,0,0,0.5)] group/close-side"
                >
                    <ChevronRight className="w-5 h-5 transition-transform group-hover/close-side:translate-x-1 cursor-pointer" />
                </button>

                {/* Main Content Area */}
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
                            {/* Header Section */}
                            <div className="p-6 pb-4 flex flex-col gap-6 shrink-0">
                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-3xl font-headline font-black text-white tracking-tighter leading-none">
                                        {viewedJuz ? `Juz ${viewedJuz}` : viewedSurah?.namaLatin}
                                    </h3>
                                    {!viewedJuz && (
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
                                            <span className="text-white/60">{viewedSurah?.arti}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className="text-white/40">{viewedSurah?.jumlahAyat} Ayat</span>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <span className={cn(
                                                viewedSurah?.tempatTurun === "Madinah" ? "text-[#56B874]" : "text-[#638FE5]"
                                            )}>
                                                {viewedSurah?.tempatTurun}
                                            </span>
                                        </div>
                                    )}
                                    {viewedJuz && (
                                        <div className="flex flex-col gap-1.5 mt-1">
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
                                                <span className="text-primary font-black">Juz Al-Qur'an</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="text-white/40">{activeData?.ayat.length || 0} Ayat</span>
                                            </div>
                                            {activeData && activeData.ayat.length > 0 && (
                                                <p className="text-[11px] font-medium text-white/50 leading-relaxed max-w-[90%]">
                                                    Surat {activeData.ayat[0].surahInfo?.namaLatin} [{activeData.ayat[0].nomorAyat}] — Surat {activeData.ayat[activeData.ayat.length - 1].surahInfo?.namaLatin} [{activeData.ayat[activeData.ayat.length - 1].nomorAyat}]
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {!viewedJuz && (
                                        <button
                                            onClick={(e) => activeData?.ayat[0] && handleTafsirClick(e, activeData.ayat[0])}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            <BookOpen className="w-3.5 h-3.5" />
                                            Tafsir
                                        </button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all active:scale-95 group/qori disabled:opacity-50 whitespace-nowrap"
                                                disabled={isFetching}
                                            >
                                                {isFetching ? (
                                                    <Music2 className="w-3.5 h-3.5 text-primary animate-spin" />
                                                ) : (
                                                    <Headphones className="w-3.5 h-3.5 text-primary transition-transform group-hover/qori:scale-110" />
                                                )}
                                                {isFetching ? '...' : (reciters.find(r => r.identifier === selectedReciterId)?.englishName?.split(' ').slice(-1)[0] || 'Qori')}
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-64 bg-[#121212]/95 backdrop-blur-2xl border-white/10 p-2 shadow-2xl" align="end">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-3 py-4">Pilih Qori (Reciter)</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5 mb-1" />
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-1">
                                                {reciters.map((qori) => (
                                                    <DropdownMenuItem
                                                        key={qori.identifier}
                                                        onClick={() => setReciterId(qori.identifier)}
                                                        className={cn(
                                                            "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer outline-none",
                                                            selectedReciterId === qori.identifier
                                                                ? "bg-primary/20 text-white"
                                                                : "hover:bg-white/5 text-white/60 hover:text-white focus:bg-white/10"
                                                        )}
                                                    >
                                                        <span className="font-bold text-sm tracking-tight">{qori.englishName}</span>
                                                        {selectedReciterId === qori.identifier && (
                                                            <motion.div layoutId="active-qori">
                                                                <Check className="w-4 h-4 text-primary" />
                                                            </motion.div>
                                                        )}
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <button
                                        onClick={onOpenTajweed}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Tajwid
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20 relative">
                                {/* Sticky Search Area */}
                                <div className="sticky top-0 z-30 pt-4 pb-6 bg-[#121212]/60 backdrop-blur-xl -mx-2 px-2">
                                    <AyahSelect
                                        ayahs={activeData?.ayat || []}
                                        onSelect={handleAyahJump}
                                        placeholder={viewedJuz ? "Cari ayat di Juz ini..." : "Cari atau Lompat ke ayat..."}
                                        showSurahName={!!viewedJuz}
                                    />
                                </div>

                                <div className={cn("transition-opacity duration-300", isFetching && "opacity-60")}>
                                    {activeData?.ayat.map((ayah: Ayah, idx: number) => {
                                        const prevAyah = idx > 0 ? activeData.ayat[idx - 1] : null;
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
                                                    onPlay={(targetAyah) => {
                                                        const surahNum = targetAyah.surahInfo?.nomor || viewedSurah?.nomor;
                                                        const contextSurah = (surahSummaryData as any[]).find(s => s.nomor === surahNum) || viewedSurah || playingSurah;
                                                        if (contextSurah) {
                                                            playAyah(targetAyah, contextSurah, activeData!.ayat, viewedJuz);
                                                        }
                                                    }}
                                                    onTafsir={handleTafsirClick}
                                                    onCopy={handleCopyAyah}
                                                    onToggleFavorite={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(ayah.surahInfo?.nomor || viewedSurah?.nomor || 0, ayah.nomorAyat);
                                                    }}
                                                />
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Player Integration - Now Always at the bottom */}
                <div className="mt-auto bg-[#121212]/90 backdrop-blur-3xl border-t border-white/5 p-6 py-5 flex flex-col gap-5 z-50">
                    <SidebarProgress />
                    <div className="grid grid-cols-3 items-center gap-4">
                        <div className="flex justify-start">
                            <SidebarActiveInfo />
                        </div>
                        <div className="flex justify-center">
                            <SidebarControls />
                        </div>
                        <div className="flex justify-end">
                            <SidebarVolume />
                        </div>
                    </div>
                </div>

            </motion.aside>

            {/* Tafsir Modal Integration */}
            <AyahTafsir
                isOpen={tafsirOpen}
                onOpenChange={setTafsirOpen}
                ayahNumber={activeAyahForTafsir?.nomorAyat || 0}
                surahNumber={activeAyahForTafsir?.surahInfo?.nomor || viewedSurah?.nomor}
                surahName={activeAyahForTafsir?.surahInfo?.namaLatin || viewedSurah?.namaLatin || ""}
                tafsirText={undefined} // Force re-fetch for fresh data
            />
        </>
    );
}

// --- Sidebar Player Sub-components ---

function SidebarProgress() {
    const { progress, duration } = useAudioProgress();
    const { seek } = useAudioState();

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(val) => seek(val[0])}
                className="w-full py-1 group cursor-pointer"
            />
            <div className="flex justify-between items-center text-[10px] text-white/40 font-black tabular-nums tracking-widest uppercase">
                <span>{formatTime(progress * duration / 100)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}

function SidebarControls() {
    const { isPlaying, togglePlay, nextAyah, prevAyah, isShuffle, toggleShuffle, repeatMode, toggleRepeatMode } = useAudioState();

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(
                    "w-8 h-8 rounded-full transition-colors relative",
                    isShuffle ? "text-primary bg-primary/5" : "text-white/20 hover:text-white"
                )}
            >
                <Shuffle className="w-3.5 h-3.5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={prevAyah} className="w-8 h-8 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <SkipBack className="w-5 h-5 fill-current" />
            </Button>

            <Button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 transition-transform p-0 flex items-center justify-center shrink-0 shadow-lg"
            >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={nextAyah} className="w-8 h-8 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <SkipForward className="w-5 h-5 fill-current" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeatMode}
                className={cn(
                    "w-8 h-8 rounded-full transition-colors relative",
                    repeatMode !== 'off' ? "text-primary bg-primary/5" : "text-white/20 hover:text-white"
                )}
            >
                {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            </Button>
        </div>
    );
}

function SidebarVolume() {
    const { volume, setVolume } = useAudioState();
    const [isMuted, setIsMuted] = React.useState(false);
    const [prevVolume, setPrevVolume] = React.useState(0.7);

    const handleMuteToggle = () => {
        if (isMuted) {
            setVolume(prevVolume);
            setIsMuted(false);
        } else {
            setPrevVolume(volume);
            setVolume(0);
            setIsMuted(true);
        }
    };

    return (
        <div className="flex items-center gap-2 group px-2 py-1.5 rounded-full bg-white/5 border border-white/5">
            <button onClick={handleMuteToggle} className="text-white/40 group-hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={(val) => {
                    setVolume(val[0] / 100);
                    if (val[0] > 0) setIsMuted(false);
                }}
                className="w-12 xl:w-16 py-1 cursor-pointer"
            />
        </div>
    );
}

function SidebarActiveInfo() {
    const { currentSurah, currentAyah, currentJuz, isPlaying, isUsingFallback } = useAudioState();

    if (!currentSurah || !currentAyah) return (
        <div className="flex items-center gap-3 animate-pulse opacity-20">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="space-y-1.5">
                <div className="w-16 h-2 bg-white/20 rounded" />
                <div className="w-10 h-1.5 bg-white/10 rounded" />
            </div>
        </div>
    );

    return (
        <div className="flex items-center gap-3 group max-w-[140px] xl:max-w-[180px]">
            <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <Music2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                </div>
                {isUsingFallback && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-[#121212] animate-pulse" title="Menggunakan Jalur Cadangan (Stabil)" />
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[11px] font-black text-white truncate leading-tight tracking-tight">
                        {currentJuz ? `Juz ${currentJuz}` : currentSurah.namaLatin}
                    </span>
                    {isUsingFallback && (
                        <span className="shrink-0 px-1 py-0.5 rounded-[4px] bg-amber-500/10 border border-amber-500/20 text-[7px] font-black text-amber-500 uppercase tracking-tighter">
                            Fallback
                        </span>
                    )}
                </div>
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-0.5">
                    {currentJuz ? currentSurah.namaLatin : `Ayat ${currentAyah.nomorAyat}`}
                    {currentJuz && <span className="mx-1 text-white/20">•</span>}
                    {currentJuz && `Ayat ${currentAyah.nomorAyat}`}
                </span>
            </div>
        </div>
    );
}
