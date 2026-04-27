"use client";

import { useSurahs } from "@/hooks/use-quran";
import { useState } from "react";
import juzData from "@/lib/data/juz.json";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";
import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";

import { SurahCard } from "@/components/quran/SurahCard";
import { JuzCard } from "@/components/quran/JuzCard";
import { useAudioState } from "@/contexts/AudioContext";

function QuranSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-10 animate-pulse">
            {/* Compact Header Skeleton */}
            <div className="px-4 sm:px-6 md:px-12 pt-6 pb-4">
                <div className="h-8 w-48 rounded-lg bg-foreground/5 mb-3" />
                <div className="h-4 w-72 rounded bg-foreground/5 mb-6" />
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 w-20 rounded-full bg-foreground/5" />
                    ))}
                </div>
            </div>

            <ModuleGrid columnsClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative flex items-center justify-between p-5 md:p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.03] min-h-[84px] w-full">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-foreground/5" />
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-5 w-[60%] rounded bg-foreground/5" />
                                <div className="h-3 w-[40%] rounded bg-foreground/5" />
                            </div>
                        </div>
                    </div>
                ))}
            </ModuleGrid>
        </div>
    );
}

export default function QuranRootPage() {
    const { searchQuery, clearSearch } = useSearch();
    const {
        isRightPanelOpen,
        isPlaying,
        currentSurah: playingSurah,
        currentAyah,
        playSurah,
        playAyah,
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
        <div className="flex-1 flex flex-col min-h-full pb-10">

            {/* Hero Section */}
            <ModuleHero
                title={<>Daftar <span className="text-[#8FA9F4]">Surah</span></>}
                subtitle="Hiduplah dalam bimbingan cahaya wahyu. Akses 114 Surah dengan lantunan qari terbaik dan terjemahan yang mendalam."
                backgroundImage="/backgrounds/quran_hero.png"
            />

            {/* Sticky Filter Bar */}
            <ModuleFilterBar
                items={filterItems}
                activeItem={activeFilter}
                onSelect={setActiveFilter}
                className="!top-0 !sticky border-b-0"
            />

            <div className="mt-2 sm:mt-4 overflow-hidden">
                <ModuleGrid
                    columnsClassName={cn(
                        isRightPanelOpen
                            ? "grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                            : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    )}
                    isEmpty={activeFilter === "Juz" ? filteredJuz.length === 0 : filteredSurahs.length === 0}
                    isLoading={isLoading}
                    emptyState={
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center text-center px-6"
                        >
                            <div className="relative mb-10">
                                {/* Enhanced Glow Effects */}
                                <div className="absolute inset-x-0 -top-4 -bottom-4 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                                <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full" />

                                <div className="relative w-28 h-28 rounded-[2.5rem] bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center backdrop-blur-md shadow-2xl overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Search className="w-12 h-12 text-primary/40" />
                                </div>
                            </div>
                            <div className="space-y-3 relative z-10">
                                <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Pencarian Nihil</h3>
                                <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full" />
                                <p className="text-base text-foreground/40 font-medium max-w-[320px] mx-auto leading-relaxed mt-4">
                                    Kami tidak menemukan surah atau juz yang sesuai dengan kata kunci <span className="text-primary/60">"{searchQuery}"</span>.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveFilter("Semua");
                                    clearSearch();
                                }}
                                className="mt-12 px-10 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-xl shadow-primary/20"
                            >
                                Atur Ulang Filter
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
