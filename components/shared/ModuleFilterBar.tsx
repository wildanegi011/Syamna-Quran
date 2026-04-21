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
        <div className={cn(
            "sticky top-[63px] z-30 transition-all duration-300",
            "bg-background border-b border-white/5 py-3 md:py-4",
            className
        )}>
            <div className="px-4 sm:px-6 md:px-12">
                <div className="flex items-center justify-start gap-6">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        {/* Filter Pills */}
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
                                        "relative px-6 h-11 rounded-full text-xs font-headline font-black transition-all duration-300 whitespace-nowrap border active:scale-95 uppercase tracking-[0.1em] flex items-center gap-2",
                                        isActive
                                            ? "bg-white text-black border-white shadow-[0_15px_35px_-10px_rgba(255,255,255,0.4)] scale-105"
                                            : "bg-white/[0.08] text-white/60 border-white/10 hover:bg-white/15 hover:text-white hover:border-white/20"
                                    )}
                                >
                                    <span>{label}</span>
                                    {count !== undefined && (
                                        <span className={cn(
                                            "ml-1 px-2 py-0.5 rounded-md text-[11px] font-black leading-none",
                                            isActive ? "bg-black/20 text-black/70" : "bg-white/15 text-white/50"
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
    );
}
