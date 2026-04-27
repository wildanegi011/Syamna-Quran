"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Sparkles, Info, BookOpen } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TAJWEED_RULES = [
    {
        name: "Wasil / Hamzatul Wasl",
        description: "Penyambung antar kata, tidak dibaca jika tidak di awal kalimat.",
        color: "#AAAAAA",
        codes: ["h", "s"]
    },
    {
        name: "Madd (Panjang)",
        description: "Memanjangkan suara huruf vokal (2, 4, atau 6 harakat).",
        color: "#2196F3",
        codes: ["p", "c"]
    },
    {
        name: "Madd Lazim",
        description: "Madd yang wajib dibaca panjang (6 harakat).",
        color: "#1B5E20",
        codes: ["n"]
    },
    {
        name: "Dengung (Ghunnah)",
        description: "Suara dengung yang keluar dari pangkal hidung.",
        color: "#4CAF50",
        codes: ["g"]
    },
    {
        name: "Samar (Ikhfa)",
        description: "Menyamarkan suara nun sukun atau tanwin.",
        color: "#E91E63",
        codes: ["i", "k"]
    },
    {
        name: "Melebur (Idgham)",
        description: "Memasukkan suara huruf ke huruf berikutnya.",
        color: "#FF9800",
        codes: ["o", "f"]
    },
    {
        name: "Memantul (Qalqalah)",
        description: "Pantulan suara pada huruf-huruf tertentu saat sukun.",
        color: "#F44336",
        codes: ["q"]
    },
    {
        name: "Melebur Tanpa Dengung",
        description: "Memasukkan suara huruf tanpa disertai dengung.",
        color: "#03A9F4",
        codes: ["u", "l"]
    },
];

interface TajweedLegendProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TajweedLegend({ isOpen, onOpenChange }: TajweedLegendProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Interactivity removed as per user request to hide tooltips
    }, []);

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent
                    side="right"
                    className="w-full h-full bg-background/95 backdrop-blur-3xl border-none p-0 flex flex-col shadow-2xl"
                >
                    <SheetHeader className="p-6 sm:p-8 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-xl sm:text-2xl font-headline font-black tracking-tighter text-foreground">Panduan Tajwid</SheetTitle>
                                <div className="h-1 w-12 bg-primary rounded-full mt-1" />
                            </div>
                        </div>
                        <SheetDescription className="text-foreground/50 font-body font-medium leading-relaxed mt-2 text-xs sm:text-sm">
                            Gunakan panduan warna ini untuk membaca Al-Quran dengan tartil sesuai kaidah tajwid yang benar.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-4 custom-scrollbar">
                        <div className="grid gap-3 sm:gap-4">
                            {TAJWEED_RULES.map((rule) => (
                                <div
                                    key={rule.codes[0]}
                                    className="group flex items-start gap-4 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] bg-foreground/[0.03] border border-foreground/5 hover:bg-primary/[0.05] hover:border-primary/20 transition-all duration-500"
                                >
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shrink-0 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                                        style={{ backgroundColor: rule.color }}
                                    >
                                        <span className="text-white font-headline font-bold uppercase text-[10px] sm:text-xs opacity-50">{rule.codes[0]}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5 sm:gap-1">
                                        <h4 className="text-sm md:text-base font-headline font-black text-foreground/90 tracking-tight group-hover:text-primary transition-colors">{rule.name}</h4>
                                        <p className="text-[11px] sm:text-xs text-foreground/40 font-body leading-relaxed font-medium">
                                            {rule.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 pt-4 border-t border-foreground/5 bg-foreground/[0.02] backdrop-blur-md">
                        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] bg-primary/5 border border-primary/10 shadow-inner">
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-[12px] text-primary/80 font-body leading-relaxed font-bold italic">
                                Tips: Gunakan panduan warna di atas untuk memudahkan Anda mengenali hukum bacaan saat membaca Al-Qur'an.
                            </p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

        </>
    );
}
