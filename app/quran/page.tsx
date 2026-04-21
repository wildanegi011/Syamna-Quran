"use client";

import { useSurahs } from "@/hooks/use-quran";
import { useState } from "react";
import juzData from "@/lib/data/juz.json";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";
import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";

import { SurahCard } from "@/components/quran/SurahCard";
import { JuzCard } from "@/components/quran/JuzCard";
import { Book, Compass, ChevronRight, Zap } from "lucide-react";
import { useAudioState } from "@/contexts/AudioContext";

function QuranSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32 animate-pulse">
            <div className="sticky top-[65px] z-20 bg-background shadow-md shadow-background">
                <ModuleHero
                    title="Daftar Surah"
                    subtitle="Temukan ketenangan dalam setiap ayat yang suci."
                    backgroundImage="/backgrounds/quran_hero.png"
                />

                <div className="w-full px-8 md:px-12 mt-12 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-12 rounded-full bg-white/5 opacity-50" />
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-11 w-28 rounded-full bg-white/5" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ModuleGrid
                columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative flex items-center justify-between p-5 md:p-6 rounded-[2rem] bg-surface-container-low/30 backdrop-blur-xl border border-white/[0.03] min-h-[110px] w-full">
                        <div className="flex items-center gap-6 md:gap-7 flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.25rem] bg-surface-container-highest/50" />
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="h-6 w-[70%] rounded-lg bg-on-surface/5" />
                                <div className="h-4 w-[40%] rounded-full bg-on-surface/5" />
                                <div className="flex gap-2">
                                    <div className="h-4 w-12 rounded bg-white/5" />
                                    <div className="h-4 w-10 rounded bg-white/5" />
                                </div>
                            </div>
                        </div>
                        <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary/5 ml-4" />
                    </div>
                ))}
            </ModuleGrid>
        </div>
    );
}

export default function QuranRootPage() {
    const { searchQuery } = useSearch();
    const { 
        isRightPanelOpen, 
        isPlaying, 
        currentSurah: playingSurah, 
        currentAyah, 
        playSurah, 
        playAyah, // Needed for JuzCard
        togglePlay, 
        setRightPanelOpen, 
        setViewedSurah, 
        setViewedJuz, 
        selectedReciterId, 
        currentJuz 
    } = useAudioState();
    const [activeFilter, setActiveFilter] = useState("Semua");

    const { data: surahs = [], isLoading } = useSurahs();

    // Calculate Counts for Filters
    const counts = {
        Semua: surahs.length,
        Makkiyah: surahs.filter(s => s.tempatTurun === "Mekah").length,
        Madaniyah: surahs.filter(s => s.tempatTurun === "Madinah").length,
        Sajdah: surahs.filter(s => s.ayatsajdah).length,
        Juz: 30
    };

    const filterItems = [
        { label: "Semua", value: "Semua", count: counts.Semua },
        { label: "Makkiyah", value: "Makkiyah", count: counts.Makkiyah },
        { label: "Madaniyah", value: "Madaniyah", count: counts.Madaniyah },
        { label: "Sajdah", value: "Sajdah", count: counts.Sajdah },
        { label: "Juz", value: "Juz", count: counts.Juz },
    ];

    const filteredSurahs = surahs.filter(surah => {
        const matchesSearch = surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.nomor.toString().includes(searchQuery);

        const matchesFilter =
            activeFilter === "Semua" ||
            (activeFilter === "Makkiyah" && surah.tempatTurun === "Mekah") ||
            (activeFilter === "Madaniyah" && surah.tempatTurun === "Madinah") ||
            (activeFilter === "Sajdah" && surah.ayatsajdah);
        return matchesSearch && matchesFilter;
    });

    const filteredJuz = juzData.filter(juz =>
        searchQuery === "" ||
        juz.id.toString().includes(searchQuery) ||
        juz.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
        juz.end.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <QuranSkeleton />;
    }

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">

            <ModuleHero
                title={<>Daftar <span className="text-[#8FA9F4]">Surah</span></>}
                subtitle="Hiduplah dalam bimbingan cahaya wahyu. Akses 114 Surah dengan lantunan qari terbaik dan terjemahan yang mendalam."
                backgroundImage="/backgrounds/quran_hero.png"
                featuredImage="/decorations/quran_rehal.png"
            />

            <ModuleFilterBar
                items={filterItems}
                activeItem={activeFilter}
                onSelect={setActiveFilter}
                className="!top-0 !sticky border-b-0"
            />

            <div className="mt-12 overflow-hidden">
                <ModuleGrid
                    columnsClassName={cn(
                        isRightPanelOpen
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}
                    isEmpty={activeFilter === "Juz" ? filteredJuz.length === 0 : filteredSurahs.length === 0}
                    isLoading={isLoading}
                    emptyState={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 flex flex-col items-center text-center px-4"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-white/10" />
                            </div>
                            <p className="text-xl text-on-surface/40 font-headline font-black italic tracking-tight">
                                Surah atau kata kunci tidak ditemukan.
                            </p>
                            <button
                                onClick={() => setActiveFilter("Semua")}
                                className="mt-6 text-primary font-bold hover:underline"
                            >
                                Reset Filter
                            </button>
                        </motion.div>
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {activeFilter === "Juz" ? (
                            filteredJuz.map((juz, index) => (
                                <JuzCard 
                                    key={`juz-${juz.id}`} 
                                    juz={juz} 
                                    index={index} 
                                    isCurrentJuzActive={currentJuz === juz.id}
                                    isPlaying={isPlaying}
                                    currentAyah={currentAyah}
                                    togglePlay={togglePlay}
                                    playAyah={playAyah}
                                    setRightPanelOpen={setRightPanelOpen}
                                    setViewedJuz={setViewedJuz}
                                    selectedReciterId={selectedReciterId}
                                />
                            ))
                        ) : (
                            filteredSurahs.map((surah, index) => (
                                <SurahCard
                                    key={surah.nomor}
                                    surah={surah}
                                    index={index}
                                    isCurrentlyPlaying={playingSurah?.nomor === surah.nomor && !currentJuz}
                                    isPlaying={isPlaying}
                                    currentAyah={currentAyah}
                                    togglePlay={togglePlay}
                                    playSurah={playSurah}
                                    setRightPanelOpen={setRightPanelOpen}
                                    setViewedSurah={setViewedSurah}
                                    selectedReciterId={selectedReciterId}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </ModuleGrid>
            </div>
            <ModuleFooter />
        </div>
    );
}
