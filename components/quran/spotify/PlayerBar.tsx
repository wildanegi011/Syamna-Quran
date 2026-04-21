"use client";

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Minimize2, Shuffle, Repeat, Repeat1, VolumeX, Heart, PanelRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";


import { useAudioState, useAudioProgress } from '@/contexts/AudioContext';

export function PlayerBar() {
    const { currentAyah, isPlaying } = useAudioState();

    if (!currentAyah) return null;

    return (
        <motion.div
            initial={false}
            animate={{
                height: '100px',
                y: 0,
                paddingTop: '0px'
            }}
            className="w-full bg-background/80 backdrop-blur-3xl border-t border-white/5 flex items-center px-4 md:px-8 fixed bottom-0 left-0 right-0 z-[100] gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-all"
        >
            <div className="flex flex-1 items-center gap-4 w-full h-full">
                <TrackInfo />
                <div className="flex-1 flex flex-col items-center max-w-[600px] gap-1 md:gap-2">
                    <PlaybackControls />
                    <ProgressSection />
                </div>
                <VolumeSection />
            </div>


        </motion.div>
    );
}

function TrackInfo() {
    const { currentAyah, currentSurah, toggleFavorite, isFavorite } = useAudioState();
    const heartActive = currentSurah ? isFavorite(currentSurah.nomor, currentAyah!.nomorAyat) : false;

    return (
        <div className="flex items-center gap-4 w-[30%] min-w-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-headline font-black border border-primary/20 shrink-0 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">
                {currentSurah?.nomor}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm md:text-base font-headline font-bold text-on-surface hover:text-primary transition-colors cursor-pointer truncate">
                    {currentSurah?.namaLatin}
                </span>
                <span className="text-[10px] md:text-xs text-on-surface/40 font-label font-bold uppercase tracking-widest hover:text-primary transition-colors cursor-pointer truncate">
                    Ayat {currentAyah?.nomorAyat}
                </span>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => currentSurah && toggleFavorite(currentSurah.nomor, currentAyah!.nomorAyat)}
                        className={cn(
                            "transition-all duration-300 hidden sm:flex shrink-0",
                            heartActive ? "text-primary hover:text-primary/80 scale-110" : "text-on-surface/20 hover:text-primary/60"
                        )}
                    >
                        <Heart className={cn("w-5 h-5", heartActive && "fill-current")} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>{heartActive ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

function PlaybackControls() {
    const { isPlaying, togglePlay, nextAyah, prevAyah, isShuffle, toggleShuffle, repeatMode, toggleRepeatMode } = useAudioState();

    return (
        <div className="flex items-center gap-3 md:gap-6">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                            "transition-colors hidden md:flex relative",
                            isShuffle ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        <Shuffle className="w-4 h-4" />
                        {isShuffle && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>{isShuffle ? 'Matikan Putar Acak' : 'Aktifkan Putar Acak'}</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={prevAyah} className="text-muted-foreground hover:text-white transition-colors hover:scale-110 active:scale-95">
                        <SkipBack className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>Ayat Sebelumnya</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={togglePlay}
                        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black hover:scale-105 transition-transform p-0 flex items-center justify-center shrink-0 shadow-lg"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>{isPlaying ? 'Jeda' : 'Putar'}</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={nextAyah} className="text-muted-foreground hover:text-white transition-colors hover:scale-110 active:scale-95">
                        <SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>Ayat Berikutnya</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleRepeatMode}
                        className={cn(
                            "transition-colors hidden md:flex relative",
                            repeatMode !== 'off' ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-white"
                        )}
                    >
                        {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                        {repeatMode !== 'off' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={18}>
                    <p>{repeatMode === 'off' ? 'Aktifkan Pengulangan' : repeatMode === 'one' ? 'Ulangi Semua' : 'Matikan Pengulangan'}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

function ProgressSection() {
    const { progress, duration } = useAudioProgress();
    const { seek } = useAudioState();

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
            <span className="w-8 md:w-10 text-right tabular-nums">{formatTime(progress * duration / 100)}</span>
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(val) => seek(val[0])}
                className="flex-1 py-1 group cursor-pointer"
            />
            <span className="w-8 md:w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
    );
}

function VolumeSection() {
    const { volume, setVolume } = useAudioState();
    const [isMuted, setIsMuted] = React.useState(false);
    const [prevVolume, setPrevVolume] = React.useState(0.7);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleMuteToggle = () => {
        if (isMuted) {
            setVolume(prevVolume);
            setIsMuted(false);
        } else {
            setPrevVolume(volume);
            setVolume(0);
            setIsMuted(true);
        }
    };

    return (
        <div className="hidden lg:flex items-center justify-end gap-3 w-[30%]">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="text-muted-foreground hover:text-white transition-colors">
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={28}>
                    <p>{isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}</p>
                </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-3 w-24 xl:w-32 group">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="p-0 h-fit w-fit hover:bg-transparent">
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-white" /> : <Volume2 className="w-5 h-5 text-muted-foreground group-hover:text-white" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={18}>
                        <p>{isMuted || volume === 0 ? 'Bunyikan' : 'Senyap'}</p>
                    </TooltipContent>
                </Tooltip>
                <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={(val) => {
                        setVolume(val[0] / 100);
                        if (val[0] > 0) setIsMuted(false);
                    }}
                    className="w-full py-1 cursor-pointer"
                />
            </div>
        </div>
    );
}
