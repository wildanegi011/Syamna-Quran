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
            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 mt-12 mb-10">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-12 rounded-full bg-foreground/5 opacity-50" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-11 w-28 rounded-full bg-foreground/5 shrink-0" />
                        ))}
                    </div>
                </div>
            </div>

            <ModuleGrid
                columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="relative flex items-center p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.75rem] bg-foreground/[0.03] backdrop-blur-xl border border-foreground/5 min-h-[100px] w-full h-full">
                        <div className="flex items-center gap-4 w-full">
                            {/* Icon Box Skeleton */}
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-[0.85rem] md:rounded-[1rem] bg-foreground/10 shrink-0" />

                            <div className="flex flex-col gap-2 flex-1">
                                {/* Group Pill Skeleton */}
                                <div className="h-3 w-16 rounded bg-primary/10" />
                                {/* Title Skeleton */}
                                <div className="h-4 w-full rounded bg-foreground/5" />
                                <div className="h-4 w-[60%] rounded bg-foreground/5" />
                            </div>
                        </div>
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
                className="!top-0 !sticky border-b-0"
            />

            <ModuleGrid
                columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                isEmpty={filteredDoas.length === 0}
                isLoading={isLoading}
                emptyState={
                    <>
                        <div className="text-6xl mb-6">🤲</div>
                        <p className="text-2xl text-foreground/40 font-headline font-black italic">
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

            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 mb-20">
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