"use client";

import React from "react";
import { Filter, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterItem {
    label: string;
    count?: number;
    value: string;
}

interface ModuleFilterBarProps {
    items: (FilterItem | string)[];
    activeItem: string;
    onSelect: (value: string) => void;
    className?: string;
}

export function ModuleFilterBar({
    items,
    activeItem,
    onSelect,
    className
}: ModuleFilterBarProps) {
    return (
        <div className={cn("sticky top-16 z-30 bg-background/80 backdrop-blur-3xl border-b border-white/5 py-3 md:py-4", className)}>
            <div className="px-8 md:px-12">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">

                        {/* Filter Pills */}
                        <div className="flex gap-2">
                            {items.map((item, index) => {
                                const label = typeof item === 'string' ? item : item.label;
                                const value = typeof item === 'string' ? item : item.value;
                                const count = typeof item === 'string' ? undefined : item.count;
                                const isActive = activeItem === value;
                                
                                return (
                                    <button
                                        key={value || index}
                                        onClick={() => onSelect(value)}
                                        className={cn(
                                            "relative px-6 py-2.5 h-11 rounded-full text-[10px] font-headline font-black transition-all duration-300 whitespace-nowrap border active:scale-95 uppercase tracking-widest flex items-center gap-2",
                                            isActive
                                                ? "bg-white text-black border-white shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] scale-105"
                                                : "bg-white/[0.03] text-white/40 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10"
                                        )}
                                    >
                                        <span>{label}</span>
                                        {count !== undefined && (
                                            <span className={cn(
                                                "ml-1 px-1.5 py-0.5 rounded-md text-[8px] font-black leading-none",
                                                isActive ? "bg-black/10 text-black/60" : "bg-white/10 text-white/40"
                                            )}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
