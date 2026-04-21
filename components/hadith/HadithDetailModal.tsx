"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useHadithDetail } from "@/hooks/use-hadith";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, BookOpen, ShieldCheck, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface HadithDetailModalProps {
    hadithId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HadithDetailModal({ hadithId, open, onOpenChange }: HadithDetailModalProps) {
    const { data: hadith, isLoading } = useHadithDetail(hadithId, open);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden bg-surface-container-lowest/95 backdrop-blur-3xl border-white/5 p-0 rounded-[2.5rem] md:rounded-[3.5rem] shadow-3xl scrollbar-hide flex flex-col">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="p-8 md:p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
                            <DialogHeader className="sr-only">
                                <DialogTitle>Memuat Detail Hadits</DialogTitle>
                            </DialogHeader>
                            <Skeleton className="h-8 w-3/4 rounded-xl" />
                            <Skeleton className="h-64 w-full rounded-[2rem]" />
                        </div>
                    ) : hadith ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col min-h-0 overflow-hidden"
                        >
                            {/* Sticky Modal Header / Banner */}
                            <div className="relative p-6 md:p-10 pb-4 md:pb-6 border-b border-white/[0.03] overflow-hidden shrink-0 bg-surface-container-lowest/40 backdrop-blur-md z-20">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <BookOpen className="w-48 h-48 rotate-12" />
                                </div>
                                
                                <div className="relative z-10 space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-headline font-black uppercase tracking-widest border",
                                            hadith.grade.toLowerCase().includes("sahih") 
                                                ? "bg-primary/10 text-primary border-primary/20" 
                                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                        )}>
                                            <ShieldCheck className="w-3 h-3 inline-block mr-2" />
                                            {hadith.grade}
                                        </span>
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-headline font-black uppercase tracking-widest bg-white/[0.03] text-on-surface/40 border border-white/[0.05]">
                                            {hadith.attribution}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-2xl md:text-3xl font-headline font-black text-on-surface leading-tight">
                                        {hadith.title}
                                    </DialogTitle>
                                </div>
                            </div>

                            {/* Scrollable Main Content Area */}
                            <div className="overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide flex-1">
                                {/* Arabic Section */}
                                <section className="relative space-y-6">
                                    <div className="flex items-center gap-4 text-primary/40">
                                        <Quote className="w-6 h-6 rotate-180" />
                                        <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Naskah Arab</span>
                                    </div>
                                    <div className="bg-surface-container-high/40 p-6 md:p-8 rounded-[2.5rem] border border-white/[0.02]">
                                        <p className="text-3xl md:text-4xl font-arabic text-on-surface leading-[1.8] text-right dir-rtl">
                                            {hadith.hadeeth_ar}
                                        </p>
                                    </div>
                                </section>

                                {/* Translation Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4 text-primary/40">
                                        <BookOpen className="w-6 h-6" />
                                        <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Terjemahan</span>
                                    </div>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-lg md:text-xl text-on-surface/80 font-body leading-relaxed whitespace-pre-line">
                                            {hadith.hadeeth}
                                        </p>
                                    </div>
                                </section>

                                {/* Explanation Section */}
                                {hadith.explanation && (
                                    <section className="space-y-6 pt-6 border-t border-white/[0.03]">
                                        <div className="flex items-center gap-4 text-primary/40">
                                            <GraduationCap className="w-6 h-6" />
                                            <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Penjelasan (Syarah)</span>
                                        </div>
                                        <div className="bg-primary/[0.02] p-6 md:p-8 rounded-[2rem] border border-primary/5">
                                            <p className="text-base text-on-surface/60 font-body leading-relaxed whitespace-pre-line">
                                                {hadith.explanation}
                                            </p>
                                        </div>
                                    </section>
                                )}

                                {/* Footer Spacer */}
                                <div className="pt-8 border-t border-white/[0.03] flex justify-center">
                                    <p className="text-[10px] font-headline font-black uppercase tracking-[0.4em] text-on-surface/20">
                                        Sumber: HadeethEnc.com
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="p-20 text-center">
                            <DialogTitle className="sr-only">Gagal Memuat</DialogTitle>
                            <p className="text-on-surface/40">Gagal memuat detail hadist.</p>
                        </div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
