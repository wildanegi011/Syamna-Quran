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

interface TooltipState {
    rule: typeof TAJWEED_RULES[0];
    x: number;
    y: number;
}

export function TajweedLegend({ isOpen, onOpenChange }: TajweedLegendProps) {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const closeTooltip = useCallback(() => setTooltip(null), []);

    useEffect(() => {
        const handleTajweedAction = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Use closest to ensure we catch interactions even if they land on child elements
            const ruleElement = target.closest('[data-rule]');
            
            if (ruleElement) {
                const ruleCode = ruleElement.getAttribute('data-rule');
                if (ruleCode) {
                    const rule = TAJWEED_RULES.find(r => r.codes.includes(ruleCode));
                    if (rule) {
                        const rect = ruleElement.getBoundingClientRect();
                        // Position tooltip above the interacted word
                        setTooltip({
                            rule,
                            x: rect.left + rect.width / 2,
                            y: rect.top + window.scrollY - 10
                        });
                        
                        if (e.type === 'click') {
                            e.stopPropagation();
                        }
                        return; // Exit early if we found a rule
                    }
                }
            }
            
            // If we're not over a rule element and it's not a mouseover, close tooltip
            if (e.type !== 'mouseover') {
                closeTooltip();
            }
        };

        const handleScroll = () => closeTooltip();
        
        document.addEventListener('click', handleTajweedAction);
        document.addEventListener('mouseover', handleTajweedAction);
        document.addEventListener('mouseout', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-rule]')) {
                closeTooltip();
            }
        });
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('click', handleTajweedAction);
            document.removeEventListener('mouseover', handleTajweedAction);
            document.removeEventListener('mouseout', closeTooltip);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [closeTooltip]);

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent 
                    side="right" 
                    className="w-full sm:max-w-md bg-background/80 backdrop-blur-3xl border-l border-white/5 p-0 flex flex-col shadow-2xl z-[60]"
                >
                    <SheetHeader className="p-8 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-headline font-black tracking-tighter text-white">Panduan Tajwid</SheetTitle>
                                <div className="h-1 w-12 bg-primary rounded-full mt-1" />
                            </div>
                        </div>
                        <SheetDescription className="text-on-surface/50 font-body font-medium leading-relaxed mt-2">
                            Gunakan panduan warna ini untuk membaca Al-Quran dengan tartil sesuai kaidah tajwid yang benar.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                        <div className="grid gap-4">
                            {TAJWEED_RULES.map((rule) => (
                                <div 
                                    key={rule.codes[0]}
                                    className="group flex items-start gap-5 p-5 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-primary/[0.05] hover:border-primary/20 transition-all duration-500"
                                >
                                    <div 
                                        className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                                        style={{ backgroundColor: rule.color }}
                                    >
                                        <span className="text-white font-headline font-bold uppercase text-xs opacity-50">{rule.codes[0]}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-sm md:text-base font-headline font-black text-white/90 tracking-tight group-hover:text-primary transition-colors">{rule.name}</h4>
                                        <p className="text-xs text-on-surface/40 font-body leading-relaxed font-medium">
                                            {rule.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 pt-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
                        <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 shadow-inner">
                            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] md:text-[12px] text-primary/80 font-body leading-relaxed font-bold">
                                Tips: Ketuk pada kata yang berwarna dalam ayat untuk melihat hukum tajwid yang berlaku secara instan di atas kata tersebut.
                            </p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Dynamic Floating Tooltip */}
            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        ref={tooltipRef}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed z-[100] px-4 py-2 rounded-xl shadow-2xl pointer-events-none flex flex-col items-center"
                        style={{ 
                            left: tooltip.x, 
                            top: tooltip.y,
                            translateX: '-50%',
                            translateY: '-100%',
                            backgroundColor: tooltip.rule.color,
                        }}
                    >
                        <span className="text-[10px] font-headline font-black uppercase tracking-widest text-white/60 leading-none mb-1">
                            {tooltip.rule.name.split(' / ')[0]}
                        </span>
                        <span className="text-xs font-body font-black text-white whitespace-nowrap">
                            {tooltip.rule.description.split('.')[0]}
                        </span>
                        
                        {/* Tooltip Arrow */}
                        <div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent" 
                            style={{ borderTopColor: tooltip.rule.color }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
