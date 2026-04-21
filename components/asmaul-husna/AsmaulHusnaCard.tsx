"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AsmaulHusnaCardProps {
    item: {
        urutan: number;
        latin: string;
        arab: string;
        arti: string;
    };
    index: number;
}

export function AsmaulHusnaCard({ item, index }: AsmaulHusnaCardProps) {
    // Generate a rotating color theme based on order
    const themes = [
        { color: "#638FE5", glow: "rgba(99, 143, 229, 0.15)" }, // Blue
        { color: "#56B874", glow: "rgba(86, 184, 116, 0.15)" }, // Green
        { color: "#C69446", glow: "rgba(198, 148, 70, 0.2)" },  // Gold
        { color: "#E56B6B", glow: "rgba(229, 107, 107, 0.15)" }, // Red
        { color: "#9B6BE5", glow: "rgba(155, 107, 229, 0.15)" }, // Purple
    ];

    const theme = themes[index % themes.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
            className="h-full"
        >
            <div
                className={cn(
                    "group relative flex flex-col p-6 h-[170px] transition-all duration-500 overflow-hidden border bg-white/[0.03] backdrop-blur-3xl rounded-[1.25rem] cursor-pointer outline-none",
                    "border-white/[0.05] hover:border-white/10 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                )}
            >
                {/* Focused Glow behind Number */}
                <div
                    className="absolute -top-6 -left-6 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-full"
                    style={{ backgroundColor: theme.color }}
                />

                <div className="relative z-10 flex flex-col justify-between w-full h-full">
                    {/* Top Content */}
                    <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Number Circle */}
                            <div
                                className="w-[48px] h-[48px] text-xl rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
                                style={{ backgroundColor: theme.color, color: 'white' }}
                            >
                                <span>{item.urutan}</span>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors truncate">
                                    {item.latin}
                                </h3>
                                <p className="text-xs font-medium text-white/50 italic truncate mt-0.5 max-w-[120px] md:max-w-[150px]">
                                    {item.arti}
                                </p>
                            </div>
                        </div>

                        {/* Arabic Calligraphy */}
                        <div className="text-right">
                            <span
                                className="text-4xl font-arabic transition-all duration-500 block group-hover:scale-110 origin-right tracking-wider text-white/90 group-hover:text-white"
                                style={{ color: theme.color }}
                            >
                                {item.arab}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="flex items-center justify-between w-full mt-auto">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">Asmaul Husna</span>
                        </div>

                        <div className="text-[10px] font-bold text-primary/0 group-hover:text-primary/60 transition-all duration-500 uppercase tracking-widest">
                            {item.latin}
                        </div>
                    </div>
                </div>

                {/* Subtly animated background glow */}
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/5 group-hover:bg-primary/10 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
}
