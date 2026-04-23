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
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.75rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 hover:bg-surface-container-highest/60 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer overflow-hidden min-h-[100px]"
        >
            {/* Visual Accent Layer */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-center gap-4 sm:gap-5 z-10 w-full min-w-0">
                {/* Logo Box */}
                <div className="relative shrink-0">
                    <div className={cn(
                        "w-10 h-10 md:w-11 md:h-11 rounded-[0.85rem] md:rounded-[1rem] bg-surface-container-highest flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden border border-white/5",
                        "group-hover:bg-primary group-hover:rotate-6 group-hover:border-primary/50"
                    )}>
                        <GroupIcon
                            className={cn("w-5 h-5 md:w-5.5 md:h-5.5 transition-colors duration-700", color, "group-hover:text-primary-foreground")}
                            strokeWidth={1.5}
                        />
                        <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1 justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-[8px] md:text-[9px] font-headline font-black uppercase tracking-widest px-1.5 py-0.5 rounded border transition-colors truncate",
                            bg, color, "border-white/[0.05] group-hover:border-primary/20"
                        )}>
                            {doa.grup}
                        </span>
                    </div>
                    <h3 className="text-sm md:text-base font-headline font-bold text-on-surface/90 tracking-tight group-hover:text-on-surface transition-all duration-300 leading-snug line-clamp-2">
                        {doa.nama}
                    </h3>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 z-10 shrink-0 ml-3">
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
            </div>

            {/* Decorative background glow */}
            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-1000", bg)} />
        </motion.div>
    );
}
