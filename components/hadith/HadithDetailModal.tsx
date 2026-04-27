"use client";

import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useHadithDetail } from "@/hooks/use-hadith";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, BookOpen, ShieldCheck, GraduationCap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface HadithDetailModalProps {
    hadithId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function HadithContent({ isLoading, hadith }: { isLoading: boolean, hadith: any }) {
    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 md:p-12 space-y-8 flex-1 flex flex-col items-center justify-center h-full"
                >
                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-[2rem]" />
                </motion.div>
            ) : hadith ? (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-hide"
                >
                    {/* Header Section (Not sticky anymore) */}
                    <div className="relative p-6 md:p-10 pb-4 md:pb-6 border-b border-foreground/5 overflow-hidden shrink-0">
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
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-headline font-black uppercase tracking-widest bg-foreground/[0.03] text-foreground/40 border border-foreground/5">
                                    {hadith.attribution}
                                </span>
                            </div>
                            <h2 className="text-xl md:text-3xl font-headline font-black text-foreground leading-tight">
                                {hadith.title}
                            </h2>
                        </div>
                    </div>

                    {/* Main Content Area (No longer the only scrollable part) */}
                    <div className="p-6 md:p-10 space-y-10 flex-1 pb-20 md:pb-10">
                        {/* Arabic Section */}
                        <section className="relative space-y-6">
                            <div className="flex items-center gap-4 text-primary/40">
                                <Quote className="w-6 h-6 rotate-180" />
                                <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Naskah Arab</span>
                            </div>
                            <div className="bg-foreground/[0.02] p-6 md:p-8 rounded-[2.5rem] border border-foreground/[0.02]">
                                <p className="text-2xl md:text-4xl font-arabic text-foreground leading-[2.2] text-right dir-rtl">
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
                                <p className="text-base md:text-xl text-foreground/80 font-body leading-relaxed whitespace-pre-line">
                                    {hadith.hadeeth}
                                </p>
                            </div>
                        </section>

                        {/* Explanation Section */}
                        {hadith.explanation && (
                            <section className="space-y-6 pt-6 border-t border-foreground/5">
                                <div className="flex items-center gap-4 text-primary/40">
                                    <GraduationCap className="w-6 h-6" />
                                    <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Penjelasan (Syarah)</span>
                                </div>
                                <div className="bg-primary/[0.02] p-6 md:p-8 rounded-[2rem] border border-primary/5">
                                    <p className="text-sm md:text-base text-foreground/60 font-body leading-relaxed whitespace-pre-line">
                                        {hadith.explanation}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Footer Spacer */}
                        <div className="pt-8 border-t border-foreground/5 flex justify-center">
                            <p className="text-[8px] md:text-[10px] font-headline font-black uppercase tracking-[0.4em] text-foreground/20">
                                Sumber: HadeethEnc.com
                            </p>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-20 text-center flex-1 h-full"
                >
                    <p className="text-foreground/40 font-headline font-black italic tracking-widest text-xs uppercase">Gagal memuat detail hadist.</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function HadithDetailModal({ hadithId, open, onOpenChange }: HadithDetailModalProps) {
    const { data: hadith, isLoading } = useHadithDetail(hadithId, open);
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-background/95 backdrop-blur-3xl border-foreground/5 p-0 h-[85vh] text-foreground">
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>{hadith?.title || "Detail Hadits"}</DrawerTitle>
                        </DrawerHeader>
                        <HadithContent isLoading={isLoading} hadith={hadith} />
                        <div className="p-4 pt-0 shrink-0">
                            <Button
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="w-full h-12 rounded-2xl bg-foreground/5 border border-foreground/5 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground"
                            >
                                Tutup Detail
                            </Button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden bg-background border-foreground/5 p-0 rounded-[3.5rem] shadow-3xl scrollbar-hide flex flex-col text-foreground">
                <DialogHeader className="sr-only">
                    <DialogTitle>{hadith?.title || "Detail Hadits"}</DialogTitle>
                </DialogHeader>

                {/* Manual Close Button for Desktop */}
                <DialogClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground/40 hover:text-foreground transition-all"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </DialogClose>

                <HadithContent isLoading={isLoading} hadith={hadith} />
            </DialogContent>
        </Dialog>
    );
}
