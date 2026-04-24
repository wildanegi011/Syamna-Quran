"use client";

import React from 'react';
import {
    ChevronLeft,
    Settings,
    BookOpen,
    Headphones,
    Music2,
    Check,
    Sparkles,
    Search,
    Info
} from 'lucide-react';
import { AyahJumpInput } from './AyahList';
import { cn } from '@/lib/utils';
import { Ayah, SurahSummary, Reciters } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { motion, AnimatePresence } from "framer-motion";

interface MobileHeaderProps {
    viewedJuz: number | null;
    viewedSurah: SurahSummary | null;
    setRightPanelOpen: (open: boolean) => void;
    setIsSettingsOpen: (open: boolean) => void;
    surahSummaryData: any[];
    setViewedSurah: (surah: SurahSummary | null) => void;
    setViewedJuz: (juz: number | null) => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    activeData: any;
    handleAyahJump: (ayah: Ayah) => void;
    pagination?: any;
}

export const MobileHeader = ({
    viewedJuz,
    viewedSurah,
    setRightPanelOpen,
    setIsSettingsOpen,
    surahSummaryData,
    setViewedSurah,
    setViewedJuz,
    scrollContainerRef,
    activeData,
    handleAyahJump,
    pagination
}: MobileHeaderProps) => {
    const [isJumpInputOpen, setIsJumpInputOpen] = React.useState(false);

    return (
        <div className="lg:hidden flex flex-col bg-[#0a0a0a]/80 backdrop-blur-3xl sticky top-0 z-50 shrink-0 border-b border-white/5">
            <div className="flex items-center justify-between px-2 h-16">
                <button
                    onClick={() => setRightPanelOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewedJuz ? `j-title-${viewedJuz}` : `s-title-${viewedSurah?.nomor}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center min-w-0"
                    >
                        <h3 className="text-base font-black text-white truncate max-w-[200px] leading-tight">
                            {viewedJuz ? `Juz ${viewedJuz}` : viewedSurah?.namaLatin}
                        </h3>
                        {!viewedJuz && viewedSurah && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/40">
                                <span className="truncate max-w-[100px]">{viewedSurah.arti}</span>
                                <span className="w-0.5 h-0.5 rounded-full bg-white/20 shrink-0" />
                                <span>{viewedSurah.jumlahAyat} Ayat</span>
                            </div>
                        )}
                        {viewedJuz && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
                                Juz Al-Qur'an
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsJumpInputOpen(!isJumpInputOpen)}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95",
                            isJumpInputOpen ? "text-primary bg-primary/10" : "text-white/60 hover:text-white"
                        )}
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white active:scale-95 transition-all"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Jump Input Drawer */}
            <Drawer open={isJumpInputOpen} onOpenChange={setIsJumpInputOpen}>
                <DrawerContent className="bg-[#121212] border-white/10 p-0 text-white pb-10">
                    <DrawerHeader className="border-b border-white/5 pb-4 px-6 text-left">
                        <DrawerTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Lompat ke Ayat</DrawerTitle>
                        <DrawerDescription className="text-[10px] text-white/40">Cari dan pilih ayat untuk langsung menuju ke lokasinya</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-6">
                        <AyahJumpInput
                            ayahs={activeData?.ayat || []}
                            onSelect={(ayah) => {
                                handleAyahJump(ayah);
                                setIsJumpInputOpen(false);
                            }}
                            viewedJuz={viewedJuz}
                            pagination={pagination}
                        />
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Horizontal Surah List */}
            <div className="px-4 pb-4">
                <div className="flex overflow-x-auto scrollbar-hide gap-2 py-0.5 overscroll-contain">
                    {(viewedJuz ? Array.from({ length: 30 }, (_, i) => i + 1) : surahSummaryData).map((item: any) => {
                        const isJuzMode = typeof item === 'number';
                        const id = isJuzMode ? item : item.nomor;
                        const label = isJuzMode ? `Juz ${item}` : `${item.nomor}. ${item.namaLatin}`;
                        const isActive = isJuzMode ? viewedJuz === item : viewedSurah?.nomor === item.nomor;

                        return (
                            <button
                                key={id}
                                onClick={() => {
                                    if (isJuzMode) {
                                        setViewedJuz(item);
                                    } else {
                                        setViewedSurah(item);
                                    }
                                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                                }}
                                className={cn(
                                    "shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                    isActive
                                        ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                                        : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                                )}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

interface DesktopHeaderProps {
    viewedJuz: number | null;
    viewedSurah: SurahSummary | null;
    activeData: any;
    onOpenInfo: (e: React.MouseEvent) => void;
    onOpenTajweed?: () => void;
    reciters: Reciters[];
    selectedReciterId: string;
    setReciterId: (id: string) => void;
    isFetching: boolean;
}

export const DesktopHeader = ({
    viewedJuz,
    viewedSurah,
    activeData,
    onOpenInfo,
    onOpenTajweed,
    reciters,
    selectedReciterId,
    setReciterId,
    isFetching
}: DesktopHeaderProps) => {
    return (
        <div className="p-4 sm:p-6 pb-4 flex flex-col gap-4 sm:gap-6 shrink-0 hidden lg:flex">
            <AnimatePresence mode="wait">
                <motion.div
                    key={viewedJuz ? `j-desk-${viewedJuz}` : `s-desk-${viewedSurah?.nomor}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-1.5 md:pt-0"
                >
                    <h3 className="text-2xl sm:text-3xl font-headline font-black text-white tracking-tighter leading-none">
                        {viewedJuz ? `Juz ${viewedJuz}` : viewedSurah?.namaLatin}
                    </h3>
                    {!viewedJuz && (
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
                            <span className="text-white/60">{viewedSurah?.arti}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-white/40">{viewedSurah?.jumlahAyat} Ayat</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className={cn(
                                viewedSurah?.tempatTurun === "Madinah" ? "text-[#56B874]" : "text-[#638FE5]"
                            )}>
                                {viewedSurah?.tempatTurun}
                            </span>
                        </div>
                    )}
                    {viewedJuz && (
                        <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
                                <span className="text-primary font-black">Juz Al-Qur'an</span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-white/40">{activeData?.ayat?.length || 0} Ayat</span>
                            </div>
                            {activeData && activeData.ayat && activeData.ayat.length > 0 && (
                                <p className="text-[11px] font-medium text-white/50 leading-relaxed max-w-[90%]">
                                    Surat {activeData.ayat[0].surahInfo?.namaLatin} [{activeData.ayat[0].nomorAyat}] — Surat {activeData.ayat[activeData.ayat.length - 1].surahInfo?.namaLatin} [{activeData.ayat[activeData.ayat.length - 1].nomorAyat}]
                                </p>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {!viewedJuz && (
                    <button
                        onClick={(e) => onOpenInfo(e)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Info Surat
                    </button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all active:scale-95 group/qori disabled:opacity-50 whitespace-nowrap"
                            disabled={isFetching}
                        >
                            {isFetching ? (
                                <Music2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary animate-spin" />
                            ) : (
                                <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary transition-transform group-hover/qori:scale-110" />
                            )}
                            {isFetching ? '...' : (reciters.find(r => r.identifier === selectedReciterId)?.englishName?.split(' ').slice(-1)[0] || 'Qori')}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-72 bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[1.5rem] overflow-hidden"
                        align="start"
                        sideOffset={12}
                    >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-4 py-4 flex items-center gap-2">
                            <Headphones className="w-3 h-3" />
                            Pilih Qori (Reciter)
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5 mx-2 mb-1" />
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar px-1 py-1 space-y-1">
                            {reciters.map((qori) => (
                                <DropdownMenuItem
                                    key={qori.identifier}
                                    onClick={() => setReciterId(qori.identifier)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer outline-none",
                                        selectedReciterId === qori.identifier
                                            ? "bg-primary/20 text-white"
                                            : "hover:bg-white/5 text-white/60 hover:text-white focus:bg-white/10"
                                    )}
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-sm tracking-tight truncate">{qori.englishName}</span>
                                        <span className="text-[10px] opacity-40 font-medium uppercase tracking-wider">{qori.type}</span>
                                    </div>
                                    {selectedReciterId === qori.identifier && (
                                        <motion.div layoutId="active-qori">
                                            <Check className="w-4 h-4 text-primary" />
                                        </motion.div>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    onClick={onOpenTajweed}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary transition-all active:scale-95 whitespace-nowrap"
                >
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Tajwid
                </button>
            </div>
        </div>
    );
};
