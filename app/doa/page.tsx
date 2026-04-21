"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import { useDoa } from "@/hooks/use-doa";
import { DoaCard } from "@/components/quran/DoaCard";
import { DoaDetailModal } from "@/components/quran/DoaDetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination";

import { ModulePagination } from "@/components/shared/ModulePagination";
import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";
import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";

function DoaSkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32 animate-pulse">
            {/* Hero Skeleton placeholder */}
            <ModuleHero
                title="Koleksi Doa"
                subtitle="Bersimpuh dalam doa, temukan ketenangan di setiap kata."
                backgroundImage="/backgrounds/doa_hero.png"
            />

            {/* Filter Bar Skeleton placeholder */}
            <div className="max-w-[1400px] mx-auto w-full px-8 md:px-12 mt-12 mb-10">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-12 rounded-full bg-white/5 opacity-50" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-11 w-28 rounded-full bg-white/5 shrink-0" />
                        ))}
                    </div>
                </div>
            </div>

            <ModuleGrid
                columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="relative flex items-center justify-between p-7 md:p-8 rounded-[2.5rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 min-h-[160px] w-full h-full">
                        <div className="flex items-center gap-6 md:gap-8 flex-1">
                            {/* ID Box Skeleton */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.5rem] bg-surface-container-highest/50" />

                            <div className="flex flex-col gap-3 flex-1">
                                {/* Group Pill Skeleton */}
                                <div className="h-5 w-24 rounded-md bg-primary/10" />
                                {/* Title Skeleton */}
                                <div className="h-6 w-[70%] rounded-lg bg-on-surface/5" />
                                {/* Tags Skeleton */}
                                <div className="flex gap-2">
                                    <div className="h-4 w-12 rounded bg-white/5" />
                                    <div className="h-4 w-10 rounded bg-white/5" />
                                </div>
                            </div>
                        </div>

                        {/* Action Button Skeleton */}
                        <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary/5 ml-4" />
                    </div>
                ))}
            </ModuleGrid>
        </div>
    );
}

export default function DoaPage() {
    const { data: doas = [], isLoading } = useDoa();
    const { searchQuery } = useSearch();
    const [activeGroup, setActiveGroup] = useState("Semua");

    // Detail Modal State
    const [selectedDoaId, setSelectedDoaId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Extract unique groups
    const groups = useMemo(() => {
        const uniqueGroups = Array.from(new Set(doas.map((d) => d.grup)));
        return ["Semua", ...uniqueGroups];
    }, [doas]);

    // Filtered data
    const filteredDoas = useMemo(() => {
        return doas.filter((doa) => {
            const matchesSearch =
                doa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doa.idn.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGroup = activeGroup === "Semua" || doa.grup === activeGroup;
            return matchesSearch && matchesGroup;
        });
    }, [doas, searchQuery, activeGroup]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredDoas.length / itemsPerPage);
    const paginatedDoas = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredDoas.slice(start, start + itemsPerPage);
    }, [filteredDoas, currentPage]);

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeGroup]);

    // Scroll to top when page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleOpenDetail = (id: number) => {
        setSelectedDoaId(id);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <DoaSkeleton />;
    }

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">

            <ModuleHero
                title={<>Koleksi <span className="not-italic text-primary">Doa</span></>}
                subtitle="Untaian munajat penyejuk hati. Temukan kumpulan doa-doa mustajab untuk setiap langkah dan kebutuhan hidup Anda."
                backgroundImage="/backgrounds/doa_hero.png"
            />

            <ModuleFilterBar
                items={groups}
                activeItem={activeGroup}
                onSelect={setActiveGroup}
            />

            <ModuleGrid
                columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                isEmpty={filteredDoas.length === 0}
                isLoading={isLoading}
                emptyState={
                    <>
                        <div className="text-6xl mb-6">🤲</div>
                        <p className="text-2xl text-on-surface/40 font-headline font-black italic">
                            Doa tidak ditemukan.
                        </p>
                    </>
                }
            >
                {paginatedDoas.map((doa, index) => (
                    <DoaCard
                        key={doa.id}
                        doa={doa}
                        index={index}
                        onDetail={handleOpenDetail}
                    />
                ))}
            </ModuleGrid>

            <div className="max-w-[1400px] mx-auto w-full px-8 md:px-12 mb-20">
                <ModulePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <DoaDetailModal
                doaId={selectedDoaId}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />

            <ModuleFooter />
        </div>
    );
}