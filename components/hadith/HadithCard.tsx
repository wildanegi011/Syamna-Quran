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
    const isSahih = hadith.grade?.toLowerCase().includes("sahih");
    const isHasan = hadith.grade?.toLowerCase().includes("hasan");

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
            <div className="group relative flex items-center justify-between p-5 md:p-6 rounded-[2rem] bg-surface-container-low/60 backdrop-blur-xl border border-white/10 hover:bg-surface-container-highest/60 hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer overflow-hidden min-h-[110px] h-full">
                {/* Visual Accent Layer */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center gap-6 md:gap-7 z-10 w-full min-w-0">
                    {/* Logo Box */}
                    <div className="relative shrink-0">
                        <div className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-[1.25rem] bg-surface-container-highest flex items-center justify-center transition-all duration-700 shadow-inner overflow-hidden border border-white/5",
                            "group-hover:bg-primary group-hover:rotate-6 group-hover:border-primary/50"
                        )}>
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors duration-700" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                        {/* Badges Row */}
                        <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                            {hadith.grade ? (
                                <div className={cn(
                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-headline font-black uppercase tracking-wider border transition-colors",
                                    isSahih ? "bg-primary/10 text-primary border-primary/20" :
                                        isHasan ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                            "bg-white/5 text-on-surface/40 border-white/10"
                                )}>
                                    {hadith.grade}
                                </div>
                            ) : (
                                <Skeleton className="h-4 w-12 rounded-md bg-white/5" />
                            )}
                            <span className="text-[9px] font-headline font-black uppercase tracking-wider text-on-surface/20 truncate max-w-[120px] md:max-w-[150px]">
                                {hadith.attribution}
                            </span>
                        </div>

                        <div className="min-h-[3.5rem] flex flex-col justify-center">
                            <h3 className="text-base md:text-lg font-headline font-black text-on-surface/90 tracking-tight group-hover:text-on-surface transition-all duration-300 leading-tight line-clamp-2">
                                {hadith.title}
                            </h3>
                        </div>

                        {/* Content Previews - Arabic & Translation */}
                        {hadith.hadeeth_ar && (
                            <div className="flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity mt-2">
                                <p className="text-right font-arabic text-primary/80 line-clamp-1 text-base md:text-lg leading-relaxed select-none">
                                    {hadith.hadeeth_ar}
                                </p>
                                <p className="text-xs md:text-sm font-body italic text-on-surface/50 line-clamp-1 tracking-tight">
                                    "{hadith.hadeeth}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10 shrink-0 ml-4">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </div>

                {/* Decorative background number */}
                <div className="absolute -right-4 -bottom-4 text-[80px] font-black text-on-surface/[0.01] group-hover:text-primary/[0.02] transition-all duration-700 pointer-events-none font-headline">
                    {index + 1}
                </div>
            </div>
        </motion.div>
    );
}
