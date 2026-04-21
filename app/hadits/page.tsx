"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, BookOpen } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import { useHadithCategories } from "@/hooks/use-hadith";
import { HadithCategoryCard } from "@/components/hadith/HadithCategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";
import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";

function CategorySkeleton() {
    return (
        <div className="flex-1 flex flex-col min-h-full pb-32 animate-pulse">
            {/* Hero Skeleton placeholder */}
            <ModuleHero
                title="Ensiklopedi Hadits"
                subtitle="Pelajari sabda Nabi Muhammad SAW melalui koleksi terpercaya."
                backgroundImage="/backgrounds/hadith_hero.png"
            />

            {/* Filter Bar Skeleton placeholder */}
            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 mt-12 mb-10">
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
                    <div key={i} className="relative flex items-center justify-between p-5 md:p-6 rounded-[2rem] bg-surface-container-low/30 backdrop-blur-xl border border-white/[0.03] min-h-[110px] w-full">
                        <div className="flex items-center gap-6 md:gap-7 flex-1">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.25rem] bg-surface-container-highest/50" />
                            <div className="flex flex-col gap-2.5 flex-1">
                                <div className="h-4 w-16 rounded-md bg-primary/10" />
                                <div className="h-5 w-[70%] rounded-lg bg-on-surface/5" />
                            </div>
                        </div>
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/5 ml-4" />
                    </div>
                ))}
            </ModuleGrid>
        </div>
    );
}

export default function HadithPage() {
    const { data: categories = [], isLoading } = useHadithCategories();
    const { searchQuery } = useSearch();
    const [activeRoot, setActiveRoot] = useState("Semua");

    // Extract root categories (parent_id is null)
    const rootCategories = useMemo(() => {
        return categories.filter(c => c.parent_id === null);
    }, [categories]);

    // Filtered categories
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => {
            const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase());

            // If we are filtering by a specific root category
            let matchesRoot = true;
            if (activeRoot !== "Semua") {
                const selectedRoot = rootCategories.find(r => r.title === activeRoot);
                // We show the root itself and its immediate children
                matchesRoot = cat.id === selectedRoot?.id || cat.parent_id === selectedRoot?.id;
            } else if (searchQuery === "") {
                // By default show only top-level categories if no search
                matchesRoot = cat.parent_id === null;
            }

            return matchesSearch && matchesRoot;
        });
    }, [categories, searchQuery, activeRoot, rootCategories]);

    if (isLoading) {
        return <CategorySkeleton />;
    }

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">

            <ModuleHero
                title={<>Ensiklopedi <span className="not-italic text-primary">Hadits</span></>}
                subtitle="Warisan hikmah dari lisan yang mulia. Kumpulan hadits pilihan sebagai tuntunan akhlak dan teladan kehidupan."
                backgroundImage="/backgrounds/hadith_hero.png"
            />

            <ModuleFilterBar
                items={["Semua", ...rootCategories.map(r => r.title)]}
                activeItem={activeRoot}
                onSelect={setActiveRoot}
                className="!top-0 !sticky border-b-0"
            />

            <ModuleGrid
                columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                isEmpty={filteredCategories.length === 0}
                isLoading={isLoading}
                emptyState={
                    <>
                        <div className="text-6xl mb-6">📖</div>
                        <p className="text-2xl text-on-surface/40 font-headline font-black italic">
                            Kategori tidak ditemukan.
                        </p>
                    </>
                }
            >
                {filteredCategories.map((category, index) => (
                    <HadithCategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                    />
                ))}
            </ModuleGrid>

            <ModuleFooter />
        </div>
    );
}
