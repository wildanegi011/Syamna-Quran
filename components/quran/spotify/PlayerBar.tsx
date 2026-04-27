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
    const { currentAyah, isRightPanelOpen } = useAudioState();

    if (!currentAyah) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out",
                "px-2 pb-2 md:px-0 md:pb-0" // Padding for floating effect on mobile
            )}
        >
            <div className={cn(
                "w-full mx-auto transition-all duration-500",
                "h-14 md:h-20", // Responsive height
                "bg-background/90 backdrop-blur-3xl border border-foreground/10 md:border-0 md:border-t",
                "rounded-2xl md:rounded-none", // Pill on mobile, bar on desktop
                "flex items-center px-4 md:px-8 gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]",
                isRightPanelOpen ? "md:pr-[400px]" : "" // Offset if panel is open on desktop
            )}>
                {/* Progress bar at the very top for mobile, integrated for desktop */}
                <div className="absolute top-0 left-4 right-4 md:hidden">
                    <MiniProgress />
                </div>

                <div className="flex flex-1 items-center gap-2 md:gap-4 w-full h-full">
                    <TrackInfo />
                    
                    {/* Desktop Central Controls */}
                    <div className="hidden md:flex flex-1 flex-col items-center max-w-[600px] gap-1 md:gap-2">
                        <PlaybackControls />
                        <ProgressSection />
                    </div>

                    {/* Mobile Controls (Right Side) */}
                    <div className="flex md:hidden items-center gap-1">
                        <MobileControls />
                    </div>

                    <VolumeSection />
                </div>
            </div>
        </motion.div>
    );
}

function MiniProgress() {
    const { progress } = useAudioProgress();
    return (
        <div className="h-[2px] w-full bg-foreground/5 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            />
        </div>
    );
}

function MobileControls() {
    const { isPlaying, togglePlay, nextAyah } = useAudioState();
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full text-foreground hover:bg-foreground/10 active:scale-90 transition-all"
            >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={nextAyah}
                className="w-10 h-10 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/10 active:scale-90 transition-all"
            >
                <SkipForward className="w-5 h-5 fill-current" />
            </Button>
        </div>
    );
}

function TrackInfo() {
    const { currentAyah, currentSurah, toggleFavorite, isFavorite, setRightPanelOpen } = useAudioState();
    const heartActive = currentSurah ? isFavorite(currentSurah.nomor, currentAyah!.nomorAyat) : false;

    return (
        <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none md:w-[30%] min-w-0">
            <div 
                onClick={() => setRightPanelOpen(true)}
                className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center text-primary font-headline font-black border border-primary/20 shrink-0 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] cursor-pointer hover:scale-105 transition-transform"
            >
                {currentSurah?.nomor}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden cursor-pointer group" onClick={() => setRightPanelOpen(true)}>
                <span className="text-[13px] md:text-base font-headline font-bold text-foreground group-hover:text-primary transition-colors truncate leading-tight">
                    {currentSurah?.namaLatin}
                </span>
                <span className="text-[10px] md:text-xs text-foreground/40 font-label font-bold uppercase tracking-widest group-hover:text-primary/60 transition-colors truncate">
                    Ayat {currentAyah?.nomorAyat}
                </span>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            currentSurah && toggleFavorite(currentSurah.nomor, currentAyah!.nomorAyat);
                        }}
                        className={cn(
                            "transition-all duration-300 hidden sm:flex shrink-0",
                            heartActive ? "text-primary hover:text-primary/80 scale-110" : "text-foreground/20 hover:text-primary/60"
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
                            isShuffle ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
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
                    <Button variant="ghost" size="icon" onClick={prevAyah} className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95">
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
                        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-foreground text-background hover:scale-105 transition-transform p-0 flex items-center justify-center shrink-0 shadow-lg"
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
                    <Button variant="ghost" size="icon" onClick={nextAyah} className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95">
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
                            repeatMode !== 'off' ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
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
    const { volume, setVolume, isRightPanelOpen, setRightPanelOpen } = useAudioState();
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
        <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
            <div className="flex items-center gap-2 mr-2 border-r border-foreground/5 pr-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setRightPanelOpen(!isRightPanelOpen)} 
                            className={cn(
                                "transition-colors",
                                isRightPanelOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <PanelRight className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={28}>
                        <p>{isRightPanelOpen ? 'Tutup Panel' : 'Buka Panel'}</p>
                    </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="text-muted-foreground hover:text-foreground transition-colors">
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={28}>
                        <p>{isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="flex items-center gap-3 w-24 xl:w-32 group animate-in fade-in slide-in-from-right-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="p-0 h-fit w-fit hover:bg-transparent">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-foreground" /> : <Volume2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />}
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

