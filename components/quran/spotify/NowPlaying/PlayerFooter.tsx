"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Shuffle,
    SkipBack,
    Pause,
    Play,
    Square,
    SkipForward,
    Repeat,
    Repeat1,
    Volume2,
    VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioState, useAudioProgress } from '@/contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export function SidebarProgress() {
    const { progress, duration } = useAudioProgress();
    const { seek } = useAudioState();

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(val) => seek(val[0])}
                className="w-full py-1 group cursor-pointer"
            />
            <div className="hidden lg:flex justify-between items-center text-[10px] text-white/40 font-black tabular-nums tracking-widest uppercase">
                <span>{formatTime(progress * duration / 100)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
}

export function SidebarControls() {
    const { isPlaying, togglePlay, stopAudio, nextAyah, prevAyah, isShuffle, toggleShuffle, repeatMode, toggleRepeatMode } = useAudioState();

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={cn(
                    "w-8 h-8 rounded-full transition-colors relative",
                    isShuffle ? "text-primary bg-primary/5" : "text-white/20 hover:text-white"
                )}
            >
                <Shuffle className="w-3.5 h-3.5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={prevAyah} className="w-8 h-8 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <SkipBack className="w-5 h-5 fill-current" />
            </Button>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                <Button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 transition-transform p-0 flex items-center justify-center shrink-0 shadow-lg"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopAudio}
                    className="w-9 h-9 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    title="Stop"
                >
                    <Square className="w-4 h-4 fill-current" />
                </Button>
            </div>

            <Button variant="ghost" size="icon" onClick={nextAyah} className="w-8 h-8 rounded-full text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
                <SkipForward className="w-5 h-5 fill-current" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeatMode}
                className={cn(
                    "w-8 h-8 rounded-full transition-colors relative",
                    repeatMode !== 'off' ? "text-primary bg-primary/5" : "text-white/20 hover:text-white"
                )}
            >
                {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
            </Button>
        </div>
    );
}

export function SidebarVolume() {
    const { volume, setVolume } = useAudioState();
    const [isMuted, setIsMuted] = React.useState(false);
    const [prevVolume, setPrevVolume] = React.useState(0.7);

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
        <div className="flex items-center gap-2 group px-2 py-1.5 rounded-full bg-white/5 border border-white/5">
            <button onClick={handleMuteToggle} className="text-white/40 group-hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={(val) => {
                    setVolume(val[0] / 100);
                    if (val[0] > 0) setIsMuted(false);
                }}
                className="w-12 xl:w-16 py-1 cursor-pointer"
            />
        </div>
    );
}

export function SidebarActiveInfo() {
    const { currentSurah, currentAyah, currentJuz, isUsingFallback } = useAudioState();

    if (!currentSurah || !currentAyah) return (
        <div className="flex items-center gap-3 animate-pulse opacity-20">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="space-y-1.5">
                <div className="w-16 h-2 bg-white/20 rounded" />
                <div className="w-10 h-1.5 bg-white/10 rounded" />
            </div>
        </div>
    );

    return (
        <div className="w-full lg:w-auto">
            {/* Mobile View: Centered, Single Line */}
            <div className="flex lg:hidden items-center justify-center gap-2 group text-center w-full px-4">
                <span className="text-xs font-black text-white truncate tracking-tight">
                    {currentJuz ? `Juz ${currentJuz}` : currentSurah.namaLatin}
                </span>
                <span className="text-[10px] font-black text-primary/40 leading-none">•</span>
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest truncate">
                    {currentJuz ? currentSurah.namaLatin : `Ayat ${currentAyah.nomorAyat}`}
                    {currentJuz && <span className="mx-1 text-white/20">•</span>}
                    {currentJuz && `Ayat ${currentAyah.nomorAyat}`}
                </span>
            </div>

            {/* Desktop View: Left Aligned, Stacked */}
            <div className="hidden lg:flex flex-col items-start min-w-0 group text-left">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-xs font-black text-white truncate tracking-tight">
                        {currentJuz ? `Juz ${currentJuz}` : currentSurah.namaLatin}
                    </span>
                    {isUsingFallback && (
                        <span className="shrink-0 px-1 py-0.5 rounded-[4px] bg-amber-500/10 border border-amber-500/20 text-[7px] font-black text-amber-500 uppercase tracking-tighter">
                            Fallback
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-0.5 truncate max-w-full">
                    {currentJuz ? currentSurah.namaLatin : `Ayat ${currentAyah.nomorAyat}`}
                    {currentJuz && <span className="mx-1 text-white/20">•</span>}
                    {currentJuz && `Ayat ${currentAyah.nomorAyat}`}
                </span>
            </div>
        </div>
    );
}
