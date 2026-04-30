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
            "bg-background border-b border-foreground/5 pt-3 pb-1 md:pt-4 md:pb-2",
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
                                        ? "bg-primary text-white border-primary shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)] scale-105"
                                        : "bg-background text-foreground/60 border-foreground/10 hover:bg-foreground/[0.03] hover:text-foreground hover:border-foreground/20"
                                )}
                            >
                                <span>{label}</span>
                                {count !== undefined && (
                                    <span className={cn(
                                        "ml-1 px-2 py-0.5 rounded-md text-[11px] font-black leading-none",
                                        isActive ? "bg-white/20 text-white" : "bg-foreground/15 text-foreground/50"
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
