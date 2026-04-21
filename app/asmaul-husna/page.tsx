"use client"

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleGrid } from "@/components/shared/ModuleGrid";
import { ModuleFooter } from "@/components/shared/ModuleFooter";
import { AsmaulHusnaCard } from "@/components/asmaul-husna/AsmaulHusnaCard";
import { useSearch } from "@/contexts/SearchContext";
import asmaulHusnaData from "@/lib/data/asmaul_husna.json";

export default function AsmaulHusnaPage() {
    const { searchQuery } = useSearch();

    // Filter logic based on global search
    const filteredData = useMemo(() => {
        if (!searchQuery) return asmaulHusnaData.data;

        return asmaulHusnaData.data.filter((item) =>
            item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.arti.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            <ModuleHero
                title={<>Asmaul <span className="text-primary">Husna</span></>}
                subtitle="Mengenal nama-nama Allah yang mulia. Setiap asma mengandung keagungan dan samudra hikmah yang menyejukkan jiwa."
                backgroundImage="/backgrounds/desert.png"
            />

            <main className="w-full -mt-10 z-20">
                <div className="mt-12 overflow-hidden px-8 md:px-12">
                    <ModuleGrid
                        columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        className="px-0 md:px-0"
                        isEmpty={filteredData.length === 0}
                        emptyState={
                            <div className="flex flex-col items-center gap-4 opacity-30 py-20">
                                <Search className="w-12 h-12" />
                                <p className="font-headline font-black uppercase tracking-widest text-sm">Nama tidak ditemukan</p>
                            </div>
                        }
                    >
                        {filteredData.map((item, idx) => (
                            <AsmaulHusnaCard
                                key={item.urutan}
                                item={item}
                                index={idx}
                            />
                        ))}
                    </ModuleGrid>
                </div>
            </main>

            <ModuleFooter />
        </div>
    );
}
