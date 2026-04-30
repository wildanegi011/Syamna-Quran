"use client";

import React from "react";
import { Play, Pause, Heart, Share2, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReciterSelect } from "@/components/quran/ReciterSelect";
import { AyahSelect } from "@/components/quran/AyahSelect";
import { Ayah } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ReadingControlsProps {
    title: string;
    subtitle: string;
    isPlaying: boolean;
    onPlayToggle: () => void;
    onTajweedToggle: () => void;
    ayahs: Ayah[];
    isCurrentPlaylist: boolean;
}

export function ReadingControls({
    title,
    subtitle,
    isPlaying,
    onPlayToggle,
    onTajweedToggle,
    ayahs,
    isCurrentPlaylist
}: ReadingControlsProps) {
    return (
        <div className="bg-background/95 backdrop-blur-md px-4 md:px-12 py-4 md:py-8 sticky top-0 z-40 border-b border-foreground/5 shadow-2xl transition-all duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center justify-between w-full md:w-auto gap-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <Button
                            onClick={onPlayToggle}
                            className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all flex items-center justify-center p-0 shrink-0"
                        >
                            {isCurrentPlaylist && isPlaying ? (
                                <Pause className="w-6 h-6 md:w-10 md:h-10 fill-current" />
                            ) : (
                                <Play className="w-6 h-6 md:w-10 md:h-10 fill-current ml-1" />
                            )}
                        </Button>

                        <div className="flex flex-col">
                            <span className="text-sm md:text-xl font-headline font-black text-foreground leading-none mb-1 md:mb-2 italic tracking-tight">
                                {title}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[8px] md:text-[10px] font-headline font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                                    isCurrentPlaylist && isPlaying
                                        ? "bg-primary/20 text-primary animate-pulse"
                                        : "bg-foreground/10 text-foreground/40"
                                )}>
                                    {isCurrentPlaylist && isPlaying ? "Streaming" : subtitle}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-wrap items-center gap-3 md:gap-8 w-full md:w-auto justify-center md:justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onTajweedToggle}
                        className="flex items-center gap-2 px-4 py-6 rounded-2xl bg-primary/5 hover:bg-primary/10 text-primary font-headline font-black text-[10px] uppercase tracking-wider transition-all border border-primary/10"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Panduan Tajwid</span>
                    </Button>

                    <div className="flex items-center gap-3 md:gap-4 p-1 bg-foreground/[0.03] rounded-full border border-foreground/5">
                        <ReciterSelect />
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 p-1 bg-foreground/[0.03] rounded-full border border-foreground/5">
                        <AyahSelect ayahs={ayahs} />
                    </div>
                </div>
            </div>
        </div>
    );
}
