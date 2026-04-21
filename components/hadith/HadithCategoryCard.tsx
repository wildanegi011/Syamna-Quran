"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, Sparkles, Shield, Scale, History, Heart, Zap, Scroll, Book } from "lucide-react";
import { HadithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { normalizeArabicLatin } from "@/lib/utils/string";
import Link from "next/link";

interface HadithCategoryCardProps {
    category: HadithCategory;
    index: number;
}

const getCategoryStyle = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes("akidah")) return { icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10" };
    if (normalized.includes("fikih")) return { icon: Scale, color: "text-emerald-400", bg: "bg-emerald-400/10" };
    if (normalized.includes("sejarah")) return { icon: History, color: "text-amber-400", bg: "bg-amber-400/10" };
    if (normalized.includes("akhlak") || normalized.includes("adab")) return { icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" };
    if (normalized.includes("quran") || normalized.includes("tafsir")) return { icon: Book, color: "text-indigo-400", bg: "bg-indigo-400/10" };
    if (normalized.includes("dasar") || normalized.includes("umum")) return { icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" };
    if (normalized.includes("sunnah") || normalized.includes("ilmu")) return { icon: Scroll, color: "text-cyan-400", bg: "bg-cyan-400/10" };
    return { icon: BookOpen, color: "text-primary", bg: "bg-primary/10" };
};

export function HadithCategoryCard({ category, index }: HadithCategoryCardProps) {
    const { icon: CategoryIcon, color, bg } = getCategoryStyle(category.title);
    const displayTitle = normalizeArabicLatin(category.title);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: Math.min(index * 0.05, 0.5),
                type: "spring",
                stiffness: 100
            }}
            className="h-full"
        >
            <Link
                href={`/hadits/${category.id}`}
                className="group relative flex items-center justify-between p-5 md:p-6 rounded-[2rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 hover:bg-surface-container-highest/60 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer overflow-hidden min-h-[110px] h-full"
            >
                {/* Visual Accent Layer */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center gap-6 md:gap-7 z-10 w-full min-w-0">
                    {/* Icon Box */}
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.25rem] bg-surface-container-highest flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden border border-white/5",
                            "group-hover:bg-primary group-hover:rotate-6 group-hover:border-primary/50"
                        )}>
                            <CategoryIcon 
                                className={cn("w-5 h-5 md:w-6 md:h-6 transition-colors duration-700", color, "group-hover:text-primary-foreground")} 
                                strokeWidth={1.5}
                            />
                            {/* Decorative background for the box */}
                            <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Micro Sparkle on Hover */}
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 scale-0 group-hover:scale-100">
                            <Sparkles className="w-4 h-4 text-primary p-0.5" />
                        </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
                            <div className={cn(
                                "flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[9px] md:text-[10px] font-headline font-black uppercase tracking-wider transition-colors",
                                bg, color, "border-white/[0.05] group-hover:border-primary/20"
                            )}>
                                <span>{category.hadeeths_count} HADITS</span>
                            </div>
                        </div>
                        <h3 className="text-base md:text-lg font-headline font-black text-on-surface/90 tracking-tight group-hover:text-primary transition-all duration-300 leading-tight truncate">
                            {displayTitle}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10 shrink-0 ml-4">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>

                {/* Decorative background glow that follows the theme */}
                <div className={cn("absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-all duration-1000", bg)} />
            </Link>
        </motion.div>
    );
}
