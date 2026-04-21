"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, BookOpen } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { useHadithsWithDetails, useHadithCategories } from "@/hooks/use-hadith";
import { HadithCard } from "@/components/hadith/HadithCard";
import { HadithDetailModal } from "@/components/hadith/HadithDetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ModulePagination } from "@/components/shared/ModulePagination";
import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";
import { ModuleHero } from "@/components/shared/ModuleHero";

// Use the standardized skeleton that matches the card shape
function HadithSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32 animate-pulse">
            {/* Hero Skeleton placeholder */}
            <ModuleHero
                title="Memuat Hadits..."
                subtitle="Menyiapkan koleksi sabda Nabi..."
                backgroundImage="/backgrounds/hadith_hero.png"
            />

            <ModuleGrid
                columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                className="py-12"
            >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative flex flex-col justify-between p-5 md:p-6 rounded-[2rem] bg-surface-container-low/30 backdrop-blur-xl border border-white/[0.03] min-h-[110px] w-full h-full">
                        <div className="flex flex-col gap-4">
                            {/* Badges Skeleton */}
                            <div className="flex gap-2">
                                <div className="h-4 w-14 rounded-full bg-primary/10" />
                                <div className="h-4 w-20 rounded-full bg-white/5" />
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.25rem] bg-surface-container-highest/50 shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-5 w-full rounded-md bg-on-surface/5" />
                                    <div className="h-5 w-[70%] rounded-md bg-on-surface/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ModuleGrid>
        </div>
    );
}

export default function HadithCategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.categoryId as string;
    const { searchQuery, setSearchQuery } = useSearch();

    const [currentPage, setCurrentPage] = useState(1);
    const [activeGrade, setActiveGrade] = useState("Semua");
    const [activeAttribution, setActiveAttribution] = useState("Semua");

    // Modal State
    const [selectedHadithId, setSelectedHadithId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: categories = [] } = useHadithCategories();
    // Use the enriched hook that fetches details (grade/attribution) in parallel
    const { data: enrichedHadiths = [], isLoading } = useHadithsWithDetails(categoryId, currentPage);

    const currentCategory = categories.find(c => c.id === categoryId);

    // Extract unique grades and attributions from CURRENT data for filtering
    const grades = useMemo(() => {
        const unique = Array.from(new Set(enrichedHadiths.map(h => h.grade).filter(Boolean)));
        return ["Semua", ...unique as string[]];
    }, [enrichedHadiths]);

    const attributions = useMemo(() => {
        const unique = Array.from(new Set(enrichedHadiths.map(h => h.attribution).filter(Boolean)));
        return ["Semua", ...unique as string[]];
    }, [enrichedHadiths]);

    // Total pages calculation: 20 items per page from HadeethEnc API
    const totalPages = useMemo(() => {
        if (!currentCategory) return 0;
        return Math.ceil(Number(currentCategory.hadeeths_count) / 20);
    }, [currentCategory]);

    const handleOpenDetail = (id: string) => {
        setSelectedHadithId(id);
        setIsModalOpen(true);
    };

    // Combined filtering logic (Search + Grade + Attribution)
    const filteredHadiths = useMemo(() => {
        return enrichedHadiths.filter(h => {
            const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGrade = activeGrade === "Semua" || h.grade === activeGrade;
            const matchesAttribution = activeAttribution === "Semua" || h.attribution === activeAttribution;
            return matchesSearch && matchesGrade && matchesAttribution;
        });
    }, [enrichedHadiths, searchQuery, activeGrade, activeAttribution]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Reset local filters when moving to a new page as the available values change
        setActiveGrade("Semua");
        setActiveAttribution("Semua");
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return <HadithSkeleton />;
    }

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">

            <ModuleHero
                title={currentCategory?.title || "Memuat..."}
                subtitle={`Ditemukan ${currentCategory?.hadeeths_count || 0} hadist dalam kategori ini`}
                backgroundImage="/backgrounds/hadith_hero.png"
                onBack={() => router.push("/hadits")}
            />

            <ModuleGrid
                columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                className="py-12"
                isEmpty={filteredHadiths.length === 0}
                isLoading={isLoading}
                emptyState={
                    <div className="text-center py-20 w-full col-span-full">
                        <p className="text-xl text-on-surface/40 font-headline font-black italic">
                            Hadist tidak ditemukan dengan filter ini.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setActiveGrade("Semua"); setActiveAttribution("Semua"); }}
                            className="mt-6 text-primary text-[10px] font-headline font-black uppercase tracking-widest hover:underline"
                        >
                            Reset Filter
                        </button>
                    </div>
                }
            >
                {filteredHadiths.map((hadith, index) => (
                    <HadithCard
                        key={hadith.id}
                        hadith={hadith}
                        index={index}
                        onDetail={handleOpenDetail}
                    />
                ))}
            </ModuleGrid>

            {totalPages > 1 && (
                <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 mb-20">
                    <ModulePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Detail Modal */}
            <HadithDetailModal
                hadithId={selectedHadithId}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            <ModuleFooter />
        </div>
    );
}
