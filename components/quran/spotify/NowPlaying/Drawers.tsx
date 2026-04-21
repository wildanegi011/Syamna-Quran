"use client";

import React from 'react';
import { 
    Settings, 
    Headphones, 
    Check, 
    LayoutGrid, 
    Sparkles, 
    BookOpen, 
    ChevronRight, 
    Play, 
    Heart, 
    Copy, 
    CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ayah, SurahSummary, Reciters } from '@/lib/types';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { AyahSelect } from '@/components/quran/AyahSelect';
import { Button } from '@/components/ui/button';

interface SettingsDrawerProps {
    isSettingsOpen: boolean;
    setIsSettingsOpen: (open: boolean) => void;
    isLoading: boolean;
    isDataStale: boolean;
    activeData: any;
    handleAyahJump: (ayah: Ayah) => void;
    setRightPanelOpen: (open: boolean) => void;
    reciters: Reciters[];
    selectedReciterId: string;
    setReciterId: (id: string) => void;
    onOpenTajweed?: () => void;
    viewedJuz: number | null;
}

export const SettingsDrawer = ({
    isSettingsOpen,
    setIsSettingsOpen,
    isLoading,
    isDataStale,
    activeData,
    handleAyahJump,
    setRightPanelOpen,
    reciters,
    selectedReciterId,
    setReciterId,
    onOpenTajweed,
    viewedJuz
}: SettingsDrawerProps) => {
    return (
        <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DrawerContent className="bg-[#121212] border-white/10 p-0 text-white pb-10">
                <DrawerHeader className="border-b border-white/5 pb-4">
                    <DrawerTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Pengaturan Pemutar</DrawerTitle>
                    <DrawerDescription className="text-[10px] text-white/40">Sesuaikan pengalaman mendengarkan Anda</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {/* Qori Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Headphones className="w-3 h-3 text-primary" />
                            Pilih Qori (Reciter)
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {reciters.slice(0, 10).map((qori) => (
                                <button
                                    key={qori.identifier}
                                    onClick={() => setReciterId(qori.identifier)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl transition-all",
                                        selectedReciterId === qori.identifier
                                            ? "bg-primary/20 text-white border border-primary/20"
                                            : "bg-white/5 text-white/60 hover:bg-white/10"
                                    )}
                                >
                                    <span className="font-bold text-sm">{qori.englishName}</span>
                                    {selectedReciterId === qori.identifier && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Jump to Ayah Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <LayoutGrid className="w-3 h-3 text-primary" />
                            Lompat ke Ayat
                        </div>
                        <div className="px-0.5">
                            <AyahSelect
                                ayahs={(isLoading || isDataStale) ? [] : (activeData?.ayat || [])}
                                onSelect={(ayah) => {
                                    handleAyahJump(ayah);
                                    setIsSettingsOpen(false);
                                }}
                                placeholder={viewedJuz ? "Cari ayat di Juz ini..." : "Cari atau Lompat ke ayat..."}
                                showSurahName={!!viewedJuz}
                            />
                        </div>
                    </div>

                    {/* Tajweed Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Panduan Tajwid
                        </div>
                        <button
                            onClick={() => {
                                onOpenTajweed?.();
                            }}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Lihat Keterangan Tajwid</p>
                                    <p className="text-[10px] opacity-70">Pelajari pewarnaan hukum bacaan</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <DrawerFooter className="border-t border-white/5 pt-4 px-6">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-white/60 font-black uppercase tracking-widest text-[10px] hover:bg-white/5">
                            Tutup Pengaturan
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

interface ActionDrawerProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    selectedAyahMenu: Ayah | null;
    viewedJuz: number | null;
    viewedSurah: SurahSummary | null;
    handleAyahPlay: (ayah: Ayah) => void;
    handleTafsirClick: (e: React.MouseEvent, ayah: Ayah) => void;
    toggleFavorite: (surahId: number, ayahId: number) => void;
    isFavorite: (surahId: number, ayahId: number) => boolean;
    isCopied: boolean;
    handleCopyAyah: (e: React.MouseEvent, ayah: Ayah) => void;
}

export const ActionDrawer = ({
    isMenuOpen,
    setIsMenuOpen,
    selectedAyahMenu,
    viewedJuz,
    viewedSurah,
    handleAyahPlay,
    handleTafsirClick,
    toggleFavorite,
    isFavorite,
    isCopied,
    handleCopyAyah
}: ActionDrawerProps) => {
    return (
        <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerContent className="bg-[#121212] border-white/10 p-0 text-white pb-10">
                <DrawerHeader className="border-b border-white/5 pb-4 px-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Aksi Ayat</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ayat {selectedAyahMenu?.nomorAyat}</span>
                    </div>
                    <DrawerTitle className="text-lg font-headline font-black text-white leading-tight">
                        {viewedJuz ? selectedAyahMenu?.surahInfo?.namaLatin : viewedSurah?.namaLatin}
                    </DrawerTitle>
                </DrawerHeader>
                
                <div className="p-4 space-y-1">
                    <button
                        onClick={() => {
                            if (selectedAyahMenu) {
                                handleAyahPlay(selectedAyahMenu);
                                setIsMenuOpen(false);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-white">Putar Ayat</p>
                                <p className="text-[10px] text-white/40">Dengarkan lantunan audio</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                    </button>

                    <button
                        onClick={(e) => {
                            if (selectedAyahMenu) {
                                handleTafsirClick(e, selectedAyahMenu);
                                setIsMenuOpen(false);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-white">Tafsir Ayat</p>
                                <p className="text-[10px] text-white/40">Baca penjelasan dan hukum</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                    </button>

                    <button
                        onClick={() => {
                            if (selectedAyahMenu) {
                                toggleFavorite(selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor || 0, selectedAyahMenu.nomorAyat);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                selectedAyahMenu && isFavorite(selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor || 0, selectedAyahMenu.nomorAyat)
                                    ? "bg-primary/20 text-primary"
                                    : "bg-white/5 text-white/60"
                            )}>
                                <Heart className={cn("w-5 h-5", selectedAyahMenu && isFavorite(selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor || 0, selectedAyahMenu.nomorAyat) && "fill-current")} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-white">
                                    {selectedAyahMenu && isFavorite(selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor || 0, selectedAyahMenu.nomorAyat) ? 'Hapus Favorit' : 'Tambah Favorit'}
                                </p>
                                <p className="text-[10px] text-white/40">Simpan ke bookmark Anda</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                    </button>

                    <button
                        onClick={(e) => {
                            if (selectedAyahMenu) {
                                handleCopyAyah(e, selectedAyahMenu);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                isCopied ? "bg-[#56B874]/20 text-[#56B874]" : "bg-white/5 text-white/60"
                            )}>
                                {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </div>
                            <div className="text-left">
                                <p className={cn(
                                    "font-bold text-sm transition-colors",
                                    isCopied ? "text-[#56B874]" : "text-white"
                                )}>
                                    {isCopied ? 'Berhasil Salin' : 'Salin Ayat'}
                                </p>
                                <p className="text-[10px] text-white/40">
                                    {isCopied ? 'Teks telah disalin ke clipboard' : 'Salin teks Arab dan terjemah'}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                    </button>
                </div>

                <DrawerFooter className="px-6 pt-2">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-white/40 font-black uppercase tracking-widest text-[10px] hover:bg-white/5">
                            Tutup
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
