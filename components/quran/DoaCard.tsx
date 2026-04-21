"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Bookmark, Quote, Sparkles, Sun, Shield, Zap, Moon, Cloud, Heart, Compass, Droplets, Smile, HelpCircle } from "lucide-react";
import { DoaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DoaCardProps {
    doa: DoaItem;
    index: number;
    onDetail: (id: number) => void;
}

const getDoaGroupStyle = (group: string) => {
    const normalized = group.toLowerCase();
    if (normalized.includes("harian")) return { icon: Sun, color: "text-amber-400", bg: "bg-amber-400/10" };
    if (normalized.includes("shalat")) return { icon: Compass, color: "text-indigo-400", bg: "bg-indigo-400/10" };
    if (normalized.includes("wudhu") || normalized.includes("mandi")) return { icon: Droplets, color: "text-cyan-400", bg: "bg-cyan-400/10" };
    if (normalized.includes("perlindungan")) return { icon: Shield, color: "text-blue-400", bg: "bg-blue-400/10" };
    if (normalized.includes("pagi")) return { icon: Sun, color: "text-orange-400", bg: "bg-orange-400/10" };
    if (normalized.includes("malam") || normalized.includes("tidur")) return { icon: Moon, color: "text-purple-400", bg: "bg-purple-400/10" };
    if (normalized.includes("penting") || normalized.includes("hajat")) return { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" };
    if (normalized.includes("sakit") || normalized.includes("sedih")) return { icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" };
    if (normalized.includes("perjalanan")) return { icon: Cloud, color: "text-sky-400", bg: "bg-sky-400/10" };
    if (normalized.includes("syukur") || normalized.includes("bahagia")) return { icon: Smile, color: "text-emerald-400", bg: "bg-emerald-400/10" };
    return { icon: HelpCircle, color: "text-primary", bg: "bg-primary/10" };
};

export function DoaCard({ doa, index, onDetail }: DoaCardProps) {
    const { icon: GroupIcon, color, bg } = getDoaGroupStyle(doa.grup);

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
            onClick={() => onDetail(doa.id)}
            className="group relative flex items-center justify-between p-7 md:p-8 rounded-[2.5rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 hover:bg-surface-container-highest/60 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer overflow-hidden min-h-[160px]"
        >
            {/* Visual Accent Layer */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-center gap-6 md:gap-8 z-10 w-full min-w-0">
                {/* Logo Box */}
                <div className="relative shrink-0">
                    <div className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.5rem] bg-surface-container-highest flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden border border-white/5",
                        "group-hover:bg-primary group-hover:rotate-6 group-hover:border-primary/50"
                    )}>
                        <GroupIcon
                            className={cn("w-6 h-6 md:w-8 md:h-8 transition-colors duration-700", color, "group-hover:text-primary-foreground")}
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
                    <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                        <span className={cn(
                            "text-[10px] md:text-[11px] font-headline font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-md border transition-colors truncate",
                            bg, color, "border-white/[0.05] group-hover:border-primary/20"
                        )}>
                            {doa.grup}
                        </span>
                    </div>
                    <h3 className="text-base md:text-lg font-headline font-black text-on-surface/90 tracking-tight group-hover:text-on-surface transition-all duration-300 leading-tight mb-2">
                        {doa.nama}
                    </h3>

                    {/* Content Previews - Arabic & Translation */}
                    <div className="flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <p className="text-right font-arabic text-primary/80 line-clamp-1 text-base md:text-lg leading-relaxed select-none">
                            {doa.ar}
                        </p>
                        <p className="text-xs md:text-sm font-body italic text-on-surface/50 line-clamp-1 tracking-tight">
                            "{doa.idn}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 z-10 shrink-0 ml-4">
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 shadow-lg shadow-transparent group-hover:shadow-primary/20 transition-all duration-500">
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </div>
            </div>

            {/* Decorative background glow that follows the theme */}
            <div className={cn("absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-50 transition-all duration-1000", bg)} />
            <div className="absolute -left-12 -top-12 w-32 h-32 bg-primary/2 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200" />
        </motion.div>
    );
}
