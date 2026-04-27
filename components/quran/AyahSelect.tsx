"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Ayah } from "@/lib/types";

interface AyahSelectProps {
    ayahs: Ayah[];
    onSelect?: (ayah: Ayah) => void;
    placeholder?: string;
    showSurahName?: boolean;
}

/**
 * Cari scrollable parent terdekat dari sebuah element.
 * Dibutuhkan karena layout Spotify pakai <main overflow-y-auto>,
 * bukan window scroll biasa.
 */
function findScrollParent(el: HTMLElement): HTMLElement | null {
    let parent = el.parentElement;
    while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

export function AyahSelect({ ayahs, onSelect, placeholder = "Pilih Ayat...", showSurahName }: AyahSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input saat popover dibuka
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setSearch("");
        }
    }, [open]);

    // Filter ayat berdasarkan pencarian
    const filtered = useMemo(() => {
        if (!search.trim()) return ayahs;
        const q = search.toLowerCase().trim();
        return ayahs.filter((ayah) => {
            if (String(ayah.nomorAyat).includes(q)) return true;
            if (ayah.surahInfo?.namaLatin.toLowerCase().includes(q)) return true;
            if (ayah.surahInfo && String(ayah.surahInfo.nomor).includes(q)) return true;
            return false;
        });
    }, [ayahs, search]);

    // Scroll ke ayat yang dipilih
    const handleSelect = (ayah: Ayah) => {
        setOpen(false);

        if (onSelect) {
            onSelect(ayah);
            return;
        }

        // ID harus cocok persis dengan yg di AyahRow
        const id = ayah.surahInfo
            ? `ayah-${ayah.surahInfo.nomor}-${ayah.nomorAyat}`
            : `ayah-${ayah.nomorAyat}`;

        // Delay agar popover sempat tertutup & layout stabil
        setTimeout(() => {
            const el = document.getElementById(id);
            if (!el) return;

            // Cari scroll container (yaitu <main> di SpotifyLayout)
            const scrollParent = findScrollParent(el);
            if (scrollParent) {
                // Hitung posisi target relatif terhadap scroll container
                const elRect = el.getBoundingClientRect();
                const parentRect = scrollParent.getBoundingClientRect();
                // offset 160px untuk melewati sticky ReadingControls
                const targetScroll = elRect.top - parentRect.top + scrollParent.scrollTop - 160;
                scrollParent.scrollTo({ top: targetScroll, behavior: 'smooth' });
            } else {
                // Fallback: pakai scrollIntoView kalau tidak ketemu parent
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 200);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 w-full pl-10 pr-4 rounded-full bg-foreground/[0.03] border-foreground/5 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/[0.08] transition-all justify-start relative group"
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary group-hover:text-foreground transition-colors" />
                    <span className="text-foreground/40 group-hover:text-foreground transition-colors capitalize tracking-normal text-xs font-medium">{placeholder}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-popover border-foreground/10 backdrop-blur-3xl rounded-md shadow-2xl z-[110]" align="end">
                {/* Input pencarian */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/5">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ketik nomor ayat..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                    />
                </div>

                {/* Daftar ayat */}
                <div 
                    className="max-h-[300px] overflow-y-auto overscroll-contain"
                    data-vaul-no-drag
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {filtered.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground/60 italic">
                            Ayat tidak ditemukan.
                        </div>
                    ) : (
                        filtered.map((ayah, idx) => (
                            <button
                                key={`sel-${ayah.surahInfo?.nomor || 0}-${ayah.nomorAyat}-${idx}`}
                                type="button"
                                onClick={() => handleSelect(ayah)}
                                className="w-full text-left px-4 py-3 hover:bg-primary/10 active:bg-primary/20 transition-colors cursor-pointer flex flex-col gap-0.5"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-foreground">Ayat {ayah.nomorAyat}</span>
                                    {ayah.surahInfo && (
                                        <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black tracking-tight">
                                            SURAH {ayah.surahInfo.nomor}
                                        </span>
                                    )}
                                </div>
                                {ayah.surahInfo && (
                                    <span className="text-[10px] text-muted-foreground font-headline font-black uppercase tracking-widest leading-none">
                                        {ayah.surahInfo.namaLatin}
                                    </span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
