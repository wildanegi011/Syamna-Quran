"use client";

import React from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDoaDetail } from "@/hooks/use-doa";
import { Copy, Loader2, BookOpen, Quote, Info, Hash, Languages, X, Compass, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";

interface DoaDetailModalProps {
    doaId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DoaContent({ isLoading, doa }: { isLoading: boolean, doa: any }) {
    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 flex flex-col items-center justify-center space-y-4 flex-1 h-full"
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                    <p className="text-[10px] font-headline font-black uppercase tracking-widest text-foreground/30">Memuat Doa...</p>
                </motion.div>
            ) : doa ? (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="relative p-6 md:p-10 pb-4 md:pb-6 border-b border-foreground/5 overflow-hidden shrink-0 bg-foreground/[0.02] backdrop-blur-md z-20">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Compass className="w-48 h-48 rotate-12 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-headline font-black uppercase tracking-widest text-primary">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    {doa.grup}
                                </span>
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-headline font-black uppercase tracking-widest bg-foreground/[0.03] text-foreground/40 border border-foreground/5">
                                    ID: {doa.id}
                                </span>
                            </div>
                            <h2 className="text-xl md:text-3xl font-headline font-black text-foreground tracking-tight leading-tight">
                                {doa.nama}
                            </h2>
                        </div>
                    </div>

                    {/* Scrollable Main Content Area */}
                    <div className="overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide flex-1 pb-20 md:pb-10">
                        {/* Arab Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-primary/40">
                                <Quote className="w-6 h-6 rotate-180" />
                                <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Naskah Arab</span>
                            </div>
                            <div className="bg-foreground/[0.02] p-6 md:p-8 rounded-[2.5rem] border border-foreground/[0.02]">
                                <p className="text-2xl md:text-4xl font-arabic text-right leading-[2.2] text-foreground" dir="rtl">
                                    {doa.ar}
                                </p>
                            </div>
                        </div>

                        {/* Translation Section */}
                        <div className="space-y-8 pt-6 border-t border-foreground/5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary/40">
                                    <Languages className="w-5 h-5" />
                                    <span className="text-[10px] font-headline font-black uppercase tracking-widest">Transliterasi</span>
                                </div>
                                <p className="text-base md:text-lg italic text-foreground/80 leading-relaxed font-body pl-2 border-l-2 border-primary/20">
                                    {doa.tr}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-primary/40">
                                    <Info className="w-5 h-5 text-foreground/30" />
                                    <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Terjemahan</span>
                                </div>
                                <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
                                    {doa.idn}
                                </p>
                            </div>
                        </div>

                        {/* About / Source */}
                        {doa.tentang && (
                            <div className="space-y-6 pt-6 border-t border-foreground/5">
                                <div className="flex items-center gap-4 text-primary/40">
                                    <Hash className="w-5 h-5" />
                                    <span className="text-[10px] font-headline font-black uppercase tracking-[0.3em]">Referensi</span>
                                </div>
                                <div className="bg-primary/[0.02] p-6 md:p-8 rounded-[2rem] border border-primary/5">
                                    <p className="text-sm md:text-base text-foreground/60 leading-relaxed font-body whitespace-pre-line decoration-primary/20">
                                        {doa.tentang}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer Spacer */}
                        <div className="pt-8 border-t border-foreground/5 flex justify-center">
                            <p className="text-[8px] md:text-[10px] font-headline font-black uppercase tracking-[0.4em] text-foreground/20">
                                Sumber: {doa.tentang ? "Hisnul Muslim" : "Equuran.id"}
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
                    className="p-20 text-center flex-1"
                >
                    <p className="text-foreground/40 font-headline font-black italic tracking-widest text-xs uppercase">Gagal memuat Detail Doa.</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function DoaDetailModal({ doaId, open, onOpenChange }: DoaDetailModalProps) {
    const { data: doa, isLoading } = useDoaDetail(doaId || 0, open && !!doaId);
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-background/95 backdrop-blur-3xl border-foreground/5 p-0 h-[85vh] text-foreground">
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>{doa?.nama || "Detail Doa"}</DrawerTitle>
                        </DrawerHeader>
                        <DoaContent isLoading={isLoading} doa={doa} />
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
            <DialogContent
                className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-background border-foreground/5 overflow-hidden flex flex-col rounded-[3.5rem] shadow-3xl scrollbar-hide text-foreground"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{doa?.nama || "Detail Doa"}</DialogTitle>
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

                <DoaContent isLoading={isLoading} doa={doa} />
            </DialogContent>
        </Dialog>
    );
}
