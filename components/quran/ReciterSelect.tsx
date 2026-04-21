"use client";

import React, { useState } from 'react';
import { useAudioState } from '@/contexts/AudioContext';
import { useReciters } from '@/hooks/use-quran';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Headphones, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReciterSelect() {
    const [open, setOpen] = useState(false);
    const { selectedReciterId, setReciterId } = useAudioState();
    const { data: reciters, isLoading } = useReciters();

    const selectedReciter = reciters?.find((r) => r.identifier === selectedReciterId);

    return (
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground mr-1">
                <Headphones className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Qori</span>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[180px] md:w-[220px] justify-between bg-surface-container-highest/50 border-white/5 text-on-surface font-headline font-bold h-10 rounded-full hover:bg-surface-container-highest hover:text-primary transition-all shadow-lg"
                    >
                        <span className="truncate">
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : selectedReciter ? (
                                selectedReciter.englishName
                            ) : (
                                "Pilih Qori..."
                            )}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[190px] md:w-[240px] p-0 bg-surface-container border-white/10 shadow-2xl overflow-hidden rounded-md">
                    <Command className="bg-surface-container text-on-surface">
                        <CommandInput
                            placeholder="Cari Qori..."
                            className="h-10 border-none focus:ring-0 text-on-surface placeholder:text-muted-foreground/50 bg-transparent"
                        />
                        <CommandList className="max-h-[350px] overflow-y-auto custom-scrollbar p-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty className="py-6 text-center text-xs text-muted-foreground/60 italic">
                                        Qori tidak ditemukan.
                                    </CommandEmpty>
                                    <CommandGroup className="px-1">
                                        {reciters?.map((reciter) => (
                                            <CommandItem
                                                key={reciter.identifier}
                                                value={reciter.englishName}
                                                onSelect={() => {
                                                    setReciterId(reciter.identifier);
                                                    setOpen(false);
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between py-2.5 px-3 rounded-lg cursor-pointer transition-all mb-1",
                                                    "hover:bg-white/10 text-white/90 data-selected:bg-white/10 data-selected:text-white",
                                                    selectedReciterId === reciter.identifier ? "bg-primary !text-black" : "text-white/80"
                                                )}
                                            >
                                                <div className="flex flex-col min-w-0 pr-2">
                                                    <span className="font-bold text-sm truncate">{reciter.englishName}</span>
                                                    <span className={cn(
                                                        "text-[10px] uppercase tracking-tighter truncate leading-none mt-0.5",
                                                        selectedReciterId === reciter.identifier ? "text-black/60" : "text-white/40"
                                                    )}>
                                                        {reciter.identifier}
                                                    </span>
                                                </div>
                                                {selectedReciterId === reciter.identifier && (
                                                    <Check className="h-4 w-4 shrink-0 text-black" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

