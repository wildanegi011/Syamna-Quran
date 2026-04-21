"use client";

import { useSurahDetail, useSurahTafsir } from "@/hooks/use-quran";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import { Play, Pause, ChevronLeft, MoreHorizontal, Share2, Heart } from "lucide-react";
import { AyahRow } from "@/components/quran/spotify/AyahRow";
import { motion } from "framer-motion";
import { useAudioState } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { ReadingControls } from "@/components/quran/spotify/ReadingControls";
import { AyahTafsir } from "@/components/quran/AyahTafsir";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TajweedLegend } from "@/components/quran/TajweedLegend";

function SurahDetailSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            {/* Header / Banner Skeleton */}
            <div className="h-[280px] md:h-[320px] w-full relative bg-surface-container/20 overflow-hidden">
                <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 md:px-12 h-full flex flex-col md:flex-row items-center gap-8 md:gap-12 pt-20 md:pt-24">
                    <Skeleton className="w-40 h-40 md:w-52 md:h-52 rounded-[2rem] shrink-0" />
                    <div className="flex flex-col gap-4 flex-1">
                        <Skeleton className="h-4 w-32 rounded-full opacity-50" />
                        <Skeleton className="h-16 md:h-24 w-full max-w-xl rounded-2xl" />
                        <div className="mt-8 space-y-2">
                            <Skeleton className="h-24 w-full max-w-2xl rounded-xl" />
                            <Skeleton className="h-10 w-40 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar Skeleton */}
            <div className="bg-background/95 backdrop-blur-md px-8 md:px-12 py-6 md:py-8 sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <Skeleton className="w-14 h-14 md:w-20 md:h-20 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-32 rounded-lg" />
                        <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-48 rounded-2xl" />
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                </div>
            </div>

            {/* Ayah List Skeleton */}
            <div className="py-12 md:py-16 px-8 md:px-12 max-w-[1400px] mx-auto w-full space-y-12">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-6">
                        <div className="flex justify-between items-start gap-10">
                            <Skeleton className="h-8 w-12 rounded-lg" />
                            <Skeleton className="h-24 w-full max-w-3xl rounded-2xl ml-auto" />
                        </div>
                        <div className="pl-12 space-y-2">
                            <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
                            <Skeleton className="h-4 w-2/3 rounded-full opacity-50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SurahDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const surahNumber = parseInt(id);

    const { data: surah, isLoading: isSurahLoading } = useSurahDetail(surahNumber);
    const { data: tafsir, isLoading: isTafsirLoading } = useSurahTafsir(surahNumber, !!surah);

    const [jumpAyah, setJumpAyah] = useState("");
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [selectedTafsir, setSelectedTafsir] = useState<{ number: number; surahNumber: number; surahName: string; text: string } | null>(null);
    const [isTafsirOpen, setIsTafsirOpen] = useState(false);
    const [isTajweedLegendOpen, setIsTajweedLegendOpen] = useState(false);
    const { currentAyah, isPlaying, togglePlay, playAyah, currentSurah, autoNext, setAutoNext } = useAudioState();

    const isLoading = isSurahLoading || isTafsirLoading;

    useEffect(() => {
        if (!isSurahLoading && !surah) {
            notFound();
        }
    }, [isSurahLoading, surah]);

    // Save history
    useEffect(() => {
        if (surah) {
            localStorage.setItem('syamna_last_read', JSON.stringify({
                id: surah.nomor,
                name: surah.namaLatin
            }));
        }
    }, [surah]);

    // Simple lookup for tafsir text
    const tafsirMap = useMemo(() => {
        if (!tafsir) return {};
        return tafsir.tafsir.reduce((acc, curr) => {
            acc[curr.ayat] = curr.teks;
            return acc;
        }, {} as Record<number, string>);
    }, [tafsir]);

    // Auto-scroll logic
    useEffect(() => {
        if (currentAyah && currentSurah?.nomor === surah?.nomor) {
            const element = document.getElementById(`ayah-${currentAyah.nomorAyat}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentAyah?.nomorAyat, currentSurah?.nomor, surah?.nomor]);

    const handleJump = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(jumpAyah);
        if (num > 0 && surah && num <= surah.jumlahAyat) {
            const element = document.getElementById(`ayah-${num}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setJumpAyah("");
            }
        }
    };

    const handleShowTafsir = useCallback((number: number, surahNumber: number, surahName: string, text?: string) => {
        setSelectedTafsir({ number, surahNumber, surahName, text: text || "" });
        setIsTafsirOpen(true);
    }, []);

    const handleTajweedToggle = useCallback(() => {
        setIsTajweedLegendOpen(prev => !prev);
    }, []);

    if (isLoading) {
        return <SurahDetailSkeleton />;
    }

    if (!surah) return null;

    const isCurrentPlaylist = currentSurah?.nomor === surah.nomor;

    const handleHeaderPlay = () => {
        if (isCurrentPlaylist) {
            togglePlay();
        } else {
            playAyah(surah.ayat[0], surah, surah.ayat);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            {/* Header / Banner */}
            <header className={cn(
                "relative w-full flex items-center px-8 md:px-12 pb-8 md:pb-12 pt-24 md:pt-32 overflow-hidden group transition-all duration-700 ease-in-out",
                isDescExpanded ? "min-h-[380px] h-auto" : "h-[280px] md:h-[320px]"
            )}>
                {/* Thematic Background Image */}
                {surah.background && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={surah.background}
                            alt={surah.namaLatin}
                            fill
                            className="object-cover opacity-30 group-hover:opacity-40 transition-all duration-[2000ms] ease-out scale-100 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-10" />
                    </div>
                )}

                {!surah.background && (
                    <div className={cn(
                        "absolute inset-0 bg-linear-to-b from-primary/40 to-[#121212] transition-colors duration-1000",
                        isCurrentPlaylist && isPlaying ? "opacity-60" : "opacity-40"
                    )} />
                )}

                {/* Back button */}
                <Link href="/quran" className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 hover:scale-110 active:scale-95">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-20 w-full max-w-[1400px] mx-auto">
                    {/* Artwork */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-40 h-40 md:w-52 md:h-52 bg-white/5 backdrop-blur-3xl rounded-[2rem] shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center border border-white/20 shrink-0 relative overflow-hidden group/artwork"
                    >
                        {/* Mini background blur inside artwork */}
                        {surah.background && (
                            <div className="absolute inset-0 z-0 opacity-20 blur-xl scale-150">
                                <Image src={surah.background} alt="" fill className="object-cover" />
                            </div>
                        )}
                        <span className="relative z-10 text-5xl md:text-7xl font-headline font-black text-primary/40 uppercase italic tracking-tighter drop-shadow-2xl">{surah.nomor}</span>
                        <span className="relative z-10 text-3xl md:text-4xl font-arabic text-primary mt-4 drop-shadow-[0_4px_12px_rgba(var(--primary-rgb),0.5)] group-hover/artwork:scale-110 transition-transform duration-500">{surah.nama}</span>
                    </motion.div>

                    <div className="flex flex-col gap-2 md:gap-4 mb-2">
                        <span className="text-xs md:text-sm font-headline font-black uppercase tracking-[0.3em] text-primary drop-shadow-md">Daftar Putar Surah</span>
                        <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tighter leading-[0.8] text-white drop-shadow-2xl">{surah.namaLatin}</h1>

                        <div className="mt-8 mb-4 relative group/desc">
                            <motion.div
                                initial={false}
                                animate={{ height: isDescExpanded ? "auto" : 88 }}
                                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="max-w-4xl text-sm md:text-lg text-white/70 font-medium leading-relaxed font-body"
                                    dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
                                />
                            </motion.div>
                            <button
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                className="mt-6 flex items-center gap-3 text-[10px] md:text-xs font-headline font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-all bg-white/5 hover:bg-primary/20 px-6 py-2 rounded-full border border-primary/10 group/btn"
                            >
                                {isDescExpanded ? "Sembunyikan Deskripsi" : "Selengkapnya"}
                                <div className={cn("w-1.5 h-1.5 rounded-full bg-primary transition-transform duration-500", isDescExpanded ? "rotate-180 scale-125" : "animate-pulse")} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm md:text-base font-body font-bold text-white/80 mt-2">
                            <span className="hover:text-primary transition-colors cursor-pointer">Syamna Quran</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span>{surah.jumlahAyat} Ayat</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span>{surah.tempatTurun}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Unified Controls Bar */}
            <ReadingControls
                title={surah.namaLatin}
                subtitle="Daftar Putar Surah"
                isPlaying={isPlaying}
                onPlayToggle={handleHeaderPlay}
                onTajweedToggle={handleTajweedToggle}
                ayahs={surah.ayat}
                isCurrentPlaylist={isCurrentPlaylist}
            />

            {/* Ayah List */}
            <div className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="space-y-6 md:space-y-10">
                    {surah.ayat.map((ayah, idx) => (
                        <AyahRow
                            key={ayah.nomorAyat}
                            ayah={ayah}
                            surah={surah}
                            index={idx}
                            queue={surah.ayat}
                            tafsirText={tafsirMap[ayah.nomorAyat]}
                            onShowTafsir={handleShowTafsir}
                        />
                    ))}
                </div>
            </div>

            {/* Global Tafsir Modal */}
            <AyahTafsir
                isOpen={isTafsirOpen}
                onOpenChange={setIsTafsirOpen}
                ayahNumber={selectedTafsir?.number || 0}
                surahNumber={selectedTafsir?.surahNumber}
                surahName={selectedTafsir?.surahName || surah.namaLatin}
                tafsirText={selectedTafsir?.text || ""}
            />

            <TajweedLegend
                isOpen={isTajweedLegendOpen}
                onOpenChange={setIsTajweedLegendOpen}
            />
        </div>
    );
}
