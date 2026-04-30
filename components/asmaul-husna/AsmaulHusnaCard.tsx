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
                    "group relative flex items-center md:items-stretch md:flex-col p-3 md:p-5 h-[80px] md:h-[110px] transition-all duration-500 overflow-hidden border bg-foreground/[0.03] backdrop-blur-3xl rounded-[1.25rem] cursor-pointer outline-none",
                    "border-foreground/5 hover:border-foreground/20 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1"
                )}
            >
                {/* Focused Glow behind Number */}
                <div
                    className="absolute -top-6 -left-6 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-full"
                    style={{ backgroundColor: theme.color }}
                />

                <div className="relative z-10 flex flex-row md:flex-col justify-center items-center md:items-stretch w-full h-full">
                    {/* Main Content Row */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            {/* Number Circle */}
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl rounded-[0.85rem] md:rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 relative transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
                                style={{ backgroundColor: theme.color, color: 'white' }}
                            >
                                <span>{item.urutan}</span>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                    {item.latin}
                                </h3>
                                <p className="text-[10px] md:text-xs font-medium text-foreground/50 italic truncate mt-0.5 max-w-[120px] md:max-w-[150px]">
                                    {item.arti}
                                </p>
                            </div>
                        </div>

                        {/* Arabic Calligraphy */}
                        <div className="text-right">
                            <span
                                className="text-3xl md:text-4xl font-arabic transition-all duration-500 block group-hover:scale-110 origin-right tracking-wider text-foreground group-hover:text-foreground"
                                style={{ color: theme.color }}
                            >
                                {item.arab}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subtly animated background glow */}
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/5 group-hover:bg-primary/10 rounded-full blur-3xl transition-all duration-500 pointer-events-none" />
            </div>
        </motion.div>
    );
}
