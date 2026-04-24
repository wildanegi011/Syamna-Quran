"use client";

import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

import { useSurahTafsir } from "@/hooks/use-quran";
import { Loader2 } from "lucide-react";

interface AyahTafsirProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ayahNumber: number;
  surahNumber?: number;
  surahName: string;
  tafsirText?: string;
  tafsirId?: number;
}

export function AyahTafsir({
  isOpen,
  onOpenChange,
  ayahNumber,
  surahNumber,
  surahName,
  tafsirText,
  tafsirId = 0,
}: AyahTafsirProps) {
  const isMobile = useIsMobile();

  // On-demand fetching if tafsirText is not provided
  const { data: fechedTafsir, isLoading } = useSurahTafsir(
    surahNumber || 0,
    isOpen && !tafsirText && !!surahNumber,
    tafsirId
  );

  const activeTafsir = React.useMemo(() => {
    if (tafsirText) return tafsirText;
    if (fechedTafsir) {
      return fechedTafsir.tafsir.find((t) => t.ayat === ayahNumber)?.teks || "";
    }
    return "";
  }, [tafsirText, fechedTafsir, ayahNumber]);

  const title = `Tafsir Surat ${surahName}`;
  const description = `Ayat ke ${ayahNumber}`;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-full bg-surface-container-highest border-white/10 rounded-none">
          <DrawerHeader className="border-b border-white/5 pb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <DrawerTitle className="text-xl font-headline font-black text-on-surface">
                  {title}
                </DrawerTitle>
                <DrawerDescription className="text-primary font-body font-bold text-xs uppercase tracking-widest mt-0.5">
                  {description}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="px-4 py-6 overflow-y-auto min-h-[300px] flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[10px] font-headline font-black uppercase tracking-widest text-primary/40">Mengunduh Tafsir...</p>
              </div>
            ) : (
              <div
                className="text-lg leading-[1.8] text-white/90 font-body space-y-6 pb-10"
                dangerouslySetInnerHTML={{ __html: activeTafsir || "Tafsir tidak tersedia untuk ayat ini." }}
              />
            )}
          </div>
          <DrawerFooter className="pt-4 pb-8 border-t border-white/5">
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-2xl border-white/10 h-14 font-black uppercase tracking-widest text-[10px] bg-white/5">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-surface-container-highest border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-headline font-black text-on-surface tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-primary font-headline font-black text-sm uppercase tracking-[0.2em] mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] min-h-[300px]">
          <div className="p-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xs font-headline font-black uppercase tracking-widest text-primary/40 animate-pulse">Menghubungkan ke Pusat Tafsir...</p>
              </div>
            ) : (
              <div
                className="text-lg leading-[1.8] text-white/80 font-body space-y-6"
                dangerouslySetInnerHTML={{ __html: activeTafsir || "Tafsir tidak tersedia untuk ayat ini." }}
              />
            )}
          </div>
        </ScrollArea>
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs">
            Mengerti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
