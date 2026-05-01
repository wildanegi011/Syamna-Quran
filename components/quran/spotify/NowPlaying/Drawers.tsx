"use client";

import React from 'react';
import { 
    Settings, 
    Headphones, 
    Check, 
    Sparkles, 
    BookOpen, 
    ChevronRight, 
    Play, 
    Bookmark, 
    Copy, 
    CheckCircle2,
    Book,
    Loader2
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTafsirResources } from '@/hooks/use-quran';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { useQuranAuth } from '@/contexts/QuranAuthContext';
import { useTranslation } from '@/lib/constants/translations';
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
    const { tafsirId, setTafsirId, mushafId, setMushafId, language } = useSettings();
    const { t } = useTranslation(language);
    const { data: tafsirResources, isLoading: isTafsirLoading } = useTafsirResources();

    // Sort tafsirs with Indonesian first, show all
    const sortedTafsirs = React.useMemo(() => {
        if (!tafsirResources) return [];
        return [...tafsirResources].sort((a, b) => {
            const isAIndonesian = a.languageName.toLowerCase() === 'indonesian';
            const isBIndonesian = b.languageName.toLowerCase() === 'indonesian';
            if (isAIndonesian && !isBIndonesian) return -1;
            if (!isAIndonesian && isBIndonesian) return 1;
            return 0;
        });
    }, [tafsirResources]);

    // Only set default if no selection exists yet
    React.useEffect(() => {
        if (tafsirId === 0 && sortedTafsirs.length > 0) {
            const kemenag = sortedTafsirs.find(t => t.id === 999);
            setTafsirId(kemenag ? kemenag.id : sortedTafsirs[0].id);
        }
    }, [sortedTafsirs, tafsirId, setTafsirId]);

    return (
        <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DrawerContent className="bg-background border-foreground/10 p-0 text-foreground pb-10">
                <DrawerHeader className="border-b border-foreground/5 pb-4">
                    <DrawerTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                        {language === 'ID' ? 'Pengaturan Pemutar' : 'Player Settings'}
                    </DrawerTitle>
                    <DrawerDescription className="text-[10px] text-foreground/40">
                        {language === 'ID' ? 'Sesuaikan pengalaman mendengarkan Anda' : 'Customize your listening experience'}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="overflow-y-auto max-h-[70vh] custom-scrollbar px-6 py-4">
                    <Accordion type="multiple" defaultValue={["reciter"]} className="w-full space-y-2">
                        {/* Qori Section */}
                        <AccordionItem value="reciter" className="border-none bg-foreground/[0.03] rounded-2xl overflow-hidden px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Headphones className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground/90">{language === 'ID' ? 'Pilih Qori' : 'Choose Reciter'}</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">{language === 'ID' ? 'Lantunan suara pilihan' : 'Selected voice recitation'}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    {reciters.slice(0, 10).map((qori) => (
                                        <button
                                            key={qori.identifier}
                                            onClick={() => setReciterId(qori.identifier)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl transition-all",
                                                selectedReciterId === qori.identifier
                                                    ? "bg-primary/20 text-foreground border border-primary/20"
                                                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                            )}
                                        >
                                            <span className="font-bold text-sm">{qori.englishName}</span>
                                            {selectedReciterId === qori.identifier && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Tafsir Section */}
                        <AccordionItem value="tafsir" className="border-none bg-foreground/[0.03] rounded-2xl overflow-hidden px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground/90">{language === 'ID' ? 'Pilih Tafsir' : 'Choose Tafsir'}</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">{language === 'ID' ? 'Penjelasan makna ayat' : 'Explanation of verse meanings'}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    {isTafsirLoading ? (
                                        <div className="space-y-2">
                                            {[1, 2].map(i => (
                                                <div key={i} className="h-16 w-full animate-pulse bg-foreground/5 rounded-2xl" />
                                            ))}
                                        </div>
                                    ) : (
                                        sortedTafsirs.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTafsirId(t.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl transition-all text-left",
                                                    tafsirId === t.id
                                                        ? "bg-primary/20 text-foreground border border-primary/20"
                                                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                                )}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-sm">{t.name}</span>
                                                    <span className="text-[10px] opacity-60 font-medium truncate max-w-[200px]">
                                                        {t.authorName}
                                                    </span>
                                                </div>
                                                {tafsirId === t.id && <Check className="w-4 h-4 text-primary" />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Tajweed Section */}
                        <AccordionItem value="tajweed" className="border-none bg-foreground/[0.03] rounded-2xl overflow-hidden px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground/90">Tajwid</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">{language === 'ID' ? 'Panduan hukum bacaan' : 'Reading rule guidance'}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <button
                                    onClick={() => {
                                        onOpenTajweed?.();
                                    }}
                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary active:scale-95 transition-all mt-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">{language === 'ID' ? 'Buka Keterangan Tajwid' : 'Open Tajweed Info'}</p>
                                            <p className="text-[10px] opacity-70">{language === 'ID' ? 'Pewarnaan hukum bacaan' : 'Coloring of reading rules'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </AccordionContent>
                        </AccordionItem>
                        
                        {/* Mushaf Section */}
                        <AccordionItem value="mushaf" className="border-none bg-foreground/[0.03] rounded-2xl overflow-hidden px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Book className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest text-foreground/90">{language === 'ID' ? 'Jenis Mushaf' : 'Mushaf Type'}</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">{language === 'ID' ? 'Tampilan skrip Al-Qur\'an' : 'Quran script appearance'}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                                <div className="grid grid-cols-1 gap-2 pt-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {[
                                        { id: 1, name: 'QCF V2', desc: 'Standard Digital V2' },
                                        { id: 2, name: 'QCF V1', desc: 'Standard Digital V1' },
                                        { id: 3, name: 'Indopak', desc: 'Skrip Asia Selatan' },
                                        { id: 4, name: 'Uthmani Hafs', desc: 'Standar Internasional' },
                                        { id: 5, name: 'KFGQPCHAFS', desc: 'Mushaf Madinah' },
                                        { id: 6, name: 'Indopak 15 Lines', desc: 'Standar Indonesia' },
                                        { id: 7, name: 'Indopak 16 Lines', desc: 'Standard Asia' },
                                        { id: 11, name: 'Tajweed', desc: 'Berwarna dengan hukum Tajwid' },
                                        { id: 19, name: 'QCF Tajweed V4', desc: 'Standard Digital Tajweed' },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMushafId(m.id)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl transition-all text-left",
                                                mushafId === m.id
                                                    ? "bg-primary/20 text-foreground border border-primary/20"
                                                    : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                                            )}
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-sm">{m.name}</span>
                                                <span className="text-[10px] opacity-60 font-medium uppercase tracking-wider">{m.desc}</span>
                                            </div>
                                            {mushafId === m.id && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <DrawerFooter className="border-t border-foreground/5 pt-4 px-6">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-foreground/60 font-black uppercase tracking-widest text-[10px] hover:bg-foreground/5">
                            {language === 'ID' ? 'Tutup Pengaturan' : 'Close Settings'}
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
    isCopied: boolean;
    handleCopyAyah: (e: React.MouseEvent, ayah: Ayah) => void;
    mode: 'reading' | 'listening';
}

export const ActionDrawer = ({
    isMenuOpen,
    setIsMenuOpen,
    selectedAyahMenu,
    viewedJuz,
    viewedSurah,
    handleAyahPlay,
    handleTafsirClick,
    isCopied,
    handleCopyAyah,
    mode
}: ActionDrawerProps) => {
    const { language } = useSettings();
    const { t } = useTranslation(language);
    const { readingBookmark, toggleReadingBookmark } = useQuranFoundation();
    const { isConnected, connectQuranAccount } = useQuranAuth();
    const [isConnecting, setIsConnecting] = React.useState(false);

    // Reset connecting state when menu closes
    React.useEffect(() => {
        if (!isMenuOpen) {
            setIsConnecting(false);
        }
    }, [isMenuOpen]);

    return (
        <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerContent className="bg-background border-foreground/10 p-0 text-foreground pb-10">
                <DrawerHeader className="border-b border-foreground/5 pb-4 px-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{language === 'ID' ? 'Aksi Ayat' : 'Verse Action'}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{t('ayat')} {selectedAyahMenu?.nomorAyat}</span>
                    </div>
                    <DrawerTitle className="text-lg font-headline font-black text-foreground leading-tight">
                        {viewedJuz ? selectedAyahMenu?.surahInfo?.namaLatin : viewedSurah?.namaLatin}
                    </DrawerTitle>
                </DrawerHeader>
                
                <div className="p-4 space-y-1">
                    {mode !== 'reading' && (
                        <button
                            onClick={() => {
                                if (selectedAyahMenu) {
                                    handleAyahPlay(selectedAyahMenu);
                                    setIsMenuOpen(false);
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/5 active:bg-foreground/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">{language === 'ID' ? 'Putar Ayat' : 'Play Verse'}</p>
                                    <p className="text-[10px] text-foreground/40">{language === 'ID' ? 'Dengarkan lantunan audio' : 'Listen to audio recitation'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40" />
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            if (selectedAyahMenu) {
                                handleTafsirClick(e, selectedAyahMenu);
                                setIsMenuOpen(false);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/5 active:bg-foreground/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/60">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-foreground">{t('tafsir')} {t('ayat')}</p>
                                <p className="text-[10px] text-foreground/40">{language === 'ID' ? 'Baca penjelasan dan hukum' : 'Read explanation and rules'}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40" />
                    </button>

                    <button
                        onClick={() => {
                            if (selectedAyahMenu) {
                                if (!isConnected) {
                                    setIsConnecting(true);
                                    connectQuranAccount();
                                    return;
                                }
                                toggleReadingBookmark.mutate({
                                    surahId: selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor || 0,
                                    ayahId: selectedAyahMenu.nomorAyat
                                });
                            }
                        }}
                        disabled={toggleReadingBookmark.isPending || isConnecting}
                        className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/5 active:bg-foreground/10 transition-all group",
                            (toggleReadingBookmark.isPending || isConnecting) && "opacity-70 pointer-events-none"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                selectedAyahMenu && readingBookmark.data?.key === (selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor) && readingBookmark.data?.verseNumber === selectedAyahMenu.nomorAyat
                                    ? "bg-primary/20 text-primary"
                                    : "bg-foreground/5 text-foreground/60"
                            )}>
                                {toggleReadingBookmark.isPending || isConnecting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Bookmark className={cn("w-5 h-5", selectedAyahMenu && readingBookmark.data?.key === (selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor) && readingBookmark.data?.verseNumber === selectedAyahMenu.nomorAyat && "fill-current")} />
                                )}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-foreground">
                                    {toggleReadingBookmark.isPending || isConnecting ? (language === 'ID' ? 'Memproses...' : 'Processing...') : (selectedAyahMenu && readingBookmark.data?.key === (selectedAyahMenu.surahInfo?.nomor || viewedSurah?.nomor) && readingBookmark.data?.verseNumber === selectedAyahMenu.nomorAyat ? (language === 'ID' ? 'Hapus Terakhir Baca' : 'Remove Last Read') : (language === 'ID' ? 'Jadikan Terakhir Baca' : 'Set as Last Read'))}
                                </p>
                                <p className="text-[10px] text-foreground/40">
                                    {toggleReadingBookmark.isPending || isConnecting ? (language === 'ID' ? 'Sedang memperbarui bookmark...' : 'Updating bookmark...') : (language === 'ID' ? 'Simpan ayat untuk dilanjutkan nanti' : 'Save verse to continue later')}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40" />
                    </button>

                    <button
                        onClick={(e) => {
                            if (selectedAyahMenu) {
                                handleCopyAyah(e, selectedAyahMenu);
                            }
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/5 active:bg-foreground/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                isCopied ? "bg-[#56B874]/20 text-[#56B874]" : "bg-foreground/5 text-foreground/60"
                            )}>
                                {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </div>
                            <div className="text-left">
                                <p className={cn(
                                    "font-bold text-sm transition-colors",
                                    isCopied ? "text-[#56B874]" : "text-foreground"
                                )}>
                                    {isCopied ? (language === 'ID' ? 'Berhasil Salin' : 'Successfully Copied') : (language === 'ID' ? 'Salin Ayat' : 'Copy Verse')}
                                </p>
                                <p className="text-[10px] text-foreground/40">
                                    {isCopied ? (language === 'ID' ? 'Teks telah disalin ke clipboard' : 'Text copied to clipboard') : (language === 'ID' ? 'Salin teks Arab dan terjemah' : 'Copy Arabic text and translation')}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40" />
                    </button>
                </div>

                <DrawerFooter className="px-6 pt-2">
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full h-12 rounded-xl text-foreground/40 font-black uppercase tracking-widest text-[10px] hover:bg-foreground/5">
                            {language === 'ID' ? 'Tutup' : 'Close'}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
