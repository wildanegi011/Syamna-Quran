import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Bookmark, Quote, Sparkles, ShieldCheck, BookOpen } from "lucide-react";
import { HadithSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface HadithCardProps {
    hadith: HadithSummary;
    index: number;
    onDetail: (id: string) => void;
}

export function HadithCard({ hadith, index, onDetail }: HadithCardProps) {
    return (
        <motion.div
            className="h-full"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: Math.min(index * 0.05, 0.5),
                type: "spring",
                stiffness: 100
            }}
            onClick={() => onDetail(hadith.id)}
        >
            <div className="group relative flex items-center justify-between p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.75rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 hover:bg-surface-container-highest/60 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer overflow-hidden min-h-[80px] h-full">
                {/* Visual Accent Layer */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex items-center gap-4 sm:gap-5 z-10 w-full min-w-0">
                    {/* Logo Box */}
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-10 h-10 md:w-11 md:h-11 rounded-[0.85rem] md:rounded-[1rem] bg-surface-container-highest flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden border border-white/5",
                            "group-hover:bg-primary group-hover:rotate-6 group-hover:border-primary/50"
                        )}>
                            <BookOpen className="w-5 h-5 md:w-5.5 md:h-5.5 text-primary group-hover:text-primary-foreground transition-colors duration-700" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <h3 className="text-sm md:text-base font-headline font-bold text-on-surface/90 tracking-tight group-hover:text-on-surface transition-all duration-300 leading-snug line-clamp-2 md:line-clamp-3">
                            {hadith.title}
                        </h3>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 z-10 shrink-0 ml-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>

                {/* Decorative background number */}
                <div className="absolute -right-3 -bottom-3 text-[60px] font-black text-on-surface/[0.01] group-hover:text-primary/[0.02] transition-all duration-700 pointer-events-none font-headline">
                    {index + 1}
                </div>
            </div>
        </motion.div>
    );
}
