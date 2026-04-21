"use client";

import { useJuzDetail } from "@/hooks/use-quran";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AyahRow } from "@/components/quran/spotify/AyahRow";
import { motion } from "framer-motion";
import { useAudioState } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { ReadingControls } from "@/components/quran/spotify/ReadingControls";
import { AyahTafsir } from "@/components/quran/AyahTafsir";
import { TajweedLegend } from "@/components/quran/TajweedLegend";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import juzData from "@/lib/data/juz.json";

function JuzDetailSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            <div className="h-[280px] md:h-[320px] w-full relative bg-surface-container/20 overflow-hidden">
                <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 md:px-12 h-full flex flex-col md:flex-row items-center gap-8 md:gap-12 pt-20 md:pt-24">
                    <Skeleton className="w-40 h-40 md:w-52 md:h-52 rounded-[2rem] shrink-0" />
                    <div className="flex flex-col gap-4 flex-1">
                        <Skeleton className="h-4 w-32 rounded-full opacity-50" />
                        <Skeleton className="h-20 md:h-32 w-full max-w-xl rounded-2xl" />
                        <div className="mt-8 space-y-2">
                            <Skeleton className="h-10 w-40 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-background/95 backdrop-blur-md px-8 md:px-12 py-6 md:py-8 sticky top-0 z-40 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
                <Skeleton className="w-14 h-14 md:w-20 md:h-20 rounded-full shrink-0" />
                <div className="flex gap-4">
                    <Skeleton className="h-12 w-48 rounded-2xl" />
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default function JuzDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const juzNumber = parseInt(id);

    const { selectedReciterId, currentAyah, isPlaying, togglePlay, playAyah, currentSurah } = useAudioState();
    const { data: juz, isLoading } = useJuzDetail(juzNumber, selectedReciterId);
    
    const [selectedTafsir, setSelectedTafsir] = useState<{ number: number; surahNumber: number; surahName: string; text?: string } | null>(null);
    const [isTafsirOpen, setIsTafsirOpen] = useState(false);
    const [isTajweedLegendOpen, setIsTajweedLegendOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !juz) {
            notFound();
        }
    }, [isLoading, juz]);

    // Create a mock SurahSummary for the Juz context to satisfy requirements
    const juzSummary = useMemo(() => {
        if (!juz) return null;
        const metadata = juzData.find(j => j.id === juz.nomor);
        return {
            nomor: juz.nomor + 1000, // Offset to avoid collision with Surah IDs
            nama: "الجزء " + juz.nomor,
            namaLatin: `Juz ${juz.nomor}`,
            jumlahAyat: juz.ayat.length,
            tempatTurun: metadata?.start.split(' ')[0] || "Mushaf",
            arti: metadata ? `${metadata.start} — ${metadata.end}` : "Mushaf Digital",
            deskripsi: metadata ? `Juz ke-${juz.nomor} dalam Al-Qur'an, dimulai dari ${metadata.start} sampai dengan ${metadata.end}.` : "",
            audioFull: {},
            background: "/backgrounds/cosmic.png"
        };
    }, [juz]);

    useEffect(() => {
        if (currentAyah && currentSurah?.nomor === juzSummary?.nomor) {
            const element = document.getElementById(`ayah-${currentAyah.surahInfo?.nomor}-${currentAyah.nomorAyat}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentAyah?.nomorAyat, currentAyah?.surahInfo?.nomor, currentSurah?.nomor, juzSummary?.nomor]);

    const handleShowTafsir = useCallback((number: number, surahNumber: number, surahName: string, text?: string) => {
        setSelectedTafsir({ number, surahNumber, surahName, text });
        setIsTafsirOpen(true);
    }, []);

    const handleTajweedToggle = useCallback(() => {
        setIsTajweedLegendOpen(prev => !prev);
    }, []);

    if (isLoading) {
        return <JuzDetailSkeleton />;
    }

    if (!juz || !juzSummary) return null;

    const isCurrentPlaylist = currentSurah?.nomor === juzSummary.nomor;

    const handleHeaderPlay = () => {
        if (isCurrentPlaylist) {
            togglePlay();
        } else {
            playAyah(juz.ayat[0], juzSummary, juz.ayat);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            {/* Header / Banner */}
            <header className="relative w-full h-[280px] md:h-[320px] flex items-center px-8 md:px-12 pb-8 md:pb-12 pt-24 md:pt-32 overflow-hidden group transition-all duration-700">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/backgrounds/cosmic.png"
                        alt={`Juz ${juz.nomor}`}
                        fill
                        className="object-cover opacity-30 group-hover:opacity-40 transition-all duration-[2000ms] scale-100 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-10" />
                </div>

                <Link href="/quran" className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 hover:scale-110">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-20 w-full max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-40 h-40 md:w-52 md:h-52 bg-white/5 backdrop-blur-3xl rounded-[2rem] shadow-2xl flex flex-col items-center justify-center border border-white/20 shrink-0 relative overflow-hidden"
                    >
                        <span className="relative z-10 text-5xl md:text-7xl font-headline font-black text-primary/40 uppercase italic tracking-tighter">{juz.nomor}</span>
                        <span className="relative z-10 text-lg font-headline font-black text-primary mt-4 tracking-[0.2em] uppercase">Juz</span>
                    </motion.div>

                    <div className="flex flex-col gap-2 md:gap-4 mb-2 text-center md:text-left">
                        <span className="text-xs md:text-sm font-headline font-black uppercase tracking-[0.3em] text-primary">Daftar Putar Juz</span>
                        <h1 className="text-5xl md:text-8xl font-headline font-black tracking-tighter leading-[0.8] text-white">Juz {juz.nomor}</h1>
                        <p className="mt-4 md:mt-8 text-sm md:text-lg text-white/70 font-medium font-body max-w-2xl leading-relaxed">
                            {juzSummary.arti}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm md:text-base font-body font-bold text-white/80 mt-4">
                            <span className="hover:text-primary transition-colors cursor-pointer">Syamna Quran</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <span>{juz.ayat.length} Ayat</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Unified Controls Bar */}
            <ReadingControls
                title={`Juz ${juz.nomor}`}
                subtitle="Daftar Putar Juz"
                isPlaying={isPlaying}
                onPlayToggle={handleHeaderPlay}
                onTajweedToggle={handleTajweedToggle}
                ayahs={juz.ayat}
                isCurrentPlaylist={isCurrentPlaylist}
            />

            {/* Ayah List */}
            <div className="py-12 md:py-16 px-8 md:px-12 max-w-[1400px] mx-auto w-full">
                <div className="space-y-6 md:space-y-10">
                    {juz.ayat.map((ayah, idx) => (
                        <div key={`${ayah.surahInfo?.nomor}-${ayah.nomorAyat}`} className="space-y-4">
                            {/* Surah Divider if this ayah starts a new surah in the Juz */}
                            {(idx === 0 || ayah.surahInfo?.nomor !== juz.ayat[idx - 1].surahInfo?.nomor) && (
                                <div className="pt-12 pb-6 first:pt-0">
                                    <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-on-surface/20" />
                                        <span className="text-xs font-headline font-black uppercase tracking-[0.3em] text-primary whitespace-nowrap">
                                            Surah {ayah.surahInfo?.namaLatin}
                                        </span>
                                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-on-surface/20" />
                                    </div>
                                </div>
                            )}
                            <AyahRow
                                ayah={ayah}
                                surah={juzSummary}
                                index={idx}
                                queue={juz.ayat}
                                onShowTafsir={handleShowTafsir}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Footer */}
            <footer className="mt-16 py-12 px-8 md:px-12 max-w-[1400px] mx-auto w-full border-t border-white/5 flex justify-between items-center">
                {juz.nomor > 1 ? (
                    <Link href={`/quran/juz/${juz.nomor - 1}`}>
                        <Button variant="ghost" className="h-20 gap-6 rounded-3xl hover:bg-white/5 px-8 group">
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                            <div className="text-left">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-primary/60">Sebelumnya</span>
                                <span className="text-xl font-headline font-black text-on-surface">Juz {juz.nomor - 1}</span>
                            </div>
                        </Button>
                    </Link>
                ) : <div />}

                {juz.nomor < 30 ? (
                    <Link href={`/quran/juz/${juz.nomor + 1}`}>
                        <Button variant="ghost" className="h-20 gap-6 rounded-3xl hover:bg-white/5 px-8 group">
                            <div className="text-right">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-primary/60">Selanjutnya</span>
                                <span className="text-xl font-headline font-black text-on-surface">Juz {juz.nomor + 1}</span>
                            </div>
                            <ChevronLeft className="w-8 h-8 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                ) : <div />}
            </footer>

            <AyahTafsir
                isOpen={isTafsirOpen}
                onOpenChange={setIsTafsirOpen}
                ayahNumber={selectedTafsir?.number || 0}
                surahNumber={selectedTafsir?.surahNumber}
                surahName={selectedTafsir?.surahName || `Juz ${juz.nomor}`}
                tafsirText={selectedTafsir?.text || ""}
            />

            <TajweedLegend 
                isOpen={isTajweedLegendOpen}
                onOpenChange={setIsTajweedLegendOpen}
            />
        </div>
    );
}
