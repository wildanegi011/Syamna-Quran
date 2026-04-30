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
import { Info, Loader2 } from "lucide-react";
import { useChapterInfo } from "@/hooks/use-quran";

interface SurahInfoProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  surahNumber: number;
  surahName: string;
}

export function SurahInfo({
  isOpen,
  onOpenChange,
  surahNumber,
  surahName,
}: SurahInfoProps) {
  const isMobile = useIsMobile();

  const { data: chapterInfo, isLoading } = useChapterInfo(
    surahNumber,
    isOpen && !!surahNumber
  );

  const title = `Info Surat ${surahName}`;
  const description = `Informasi detail mengenai Surah ${surahName}`;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-full bg-background border-foreground/10 rounded-none">
          <DrawerHeader className="border-b border-foreground/5 pb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-left">
                <DrawerTitle className="text-xl font-headline font-black text-foreground">
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
                <p className="text-[10px] font-headline font-black uppercase tracking-widest text-primary/40">Mengunduh Info Surat...</p>
              </div>
            ) : (
              <div
                className="text-lg leading-[1.8] text-foreground/90 font-body space-y-6 pb-10 quran-info-content"
                dangerouslySetInnerHTML={{ __html: chapterInfo?.short_text || chapterInfo?.text || "Informasi tidak tersedia untuk surat ini." }}
              />
            )}
          </div>
          <DrawerFooter className="pt-4 pb-8 border-t border-foreground/5">
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-2xl border-foreground/10 h-14 font-black uppercase tracking-widest text-[10px] bg-foreground/5">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-background border-foreground/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="p-8 pb-6 border-b border-foreground/5 bg-foreground/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Info className="w-7 h-7" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-headline font-black text-foreground tracking-tight">
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
                <p className="text-xs font-headline font-black uppercase tracking-widest text-primary/40 animate-pulse">Menghubungkan ke Pusat Data...</p>
              </div>
            ) : (
              <div
                className="text-lg leading-[1.8] text-foreground/80 font-body space-y-6 quran-info-content"
                dangerouslySetInnerHTML={{ __html: chapterInfo?.text || "Informasi tidak tersedia untuk surat ini." }}
              />
            )}
          </div>
        </ScrollArea>
        <div className="p-6 bg-foreground/[0.01] border-t border-foreground/5 flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs">
            Mengerti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
