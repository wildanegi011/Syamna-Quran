import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPronunciation } from "@/lib/iqro";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface HijaiyahCardProps {
    letter: string;
    pronunciation?: string;
    audioUrl?: string;
    disableAudio?: boolean;
    className?: string;
    isHighlighted?: boolean;
}

export const HijaiyahCard = forwardRef<HTMLButtonElement, HijaiyahCardProps>(
    ({ letter, pronunciation, audioUrl, disableAudio, className, isHighlighted }, ref) => {
        const { isPlaying, play } = useAudioPlayer();

        const handlePlay = () => {
            if (!disableAudio && audioUrl) {
                play(audioUrl);
            }
        };

        const displayPronunciation = formatPronunciation(pronunciation);

        return (
            <motion.button
                ref={ref}
                whileHover={{
                    y: -8,
                    scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlay}
                className={cn(
                    "aspect-square flex flex-col items-center justify-center p-3 md:p-6 rounded-[2rem] md:rounded-[3.5rem] bg-white/40 dark:bg-white/5 backdrop-blur-2xl border transition-all duration-500 shadow-2xl relative group overflow-visible",
                    isHighlighted ? "border-primary ring-2 ring-primary/20 scale-[1.05] -translate-y-2" : "border-white/40 dark:border-white/10",
                    className
                )}
            >
                {/* Glossy Reflection Overlay */}
                <div className={cn(
                    "absolute inset-0 rounded-[2rem] md:rounded-[3.5rem] bg-linear-to-br from-white/20 to-transparent pointer-events-none transition-opacity",
                    isHighlighted ? "opacity-100" : "opacity-50 group-hover:opacity-100"
                )} />

                <div className="flex-1 flex items-center justify-center w-full overflow-visible relative z-10">
                    <span className={cn(
                        "font-amiri transition-all duration-700 leading-none",
                        isHighlighted ? "text-primary scale-110 drop-shadow-[0_20px_40px_rgba(var(--primary),0.2)]" : "text-foreground group-hover:text-primary drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_20px_40px_rgba(var(--primary),0.2)]",
                        letter.length > 5 ? "text-xl md:text-3xl" : letter.length > 2 ? "text-3xl md:text-5xl" : "text-5xl md:text-8xl"
                    )}>
                        {letter}
                    </span>
                </div>

                {displayPronunciation && (
                    <div className="mt-1 md:mt-3 px-2 md:px-4 py-0.5 md:py-1 rounded-full bg-primary/5 border border-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:shadow-2xl shadow-primary/20 relative z-10 max-w-full">
                        <span className="text-[7px] md:text-[11px] font-black text-primary/60 uppercase tracking-widest italic group-hover:text-white transition-colors truncate block">
                            {displayPronunciation}
                        </span>
                    </div>
                )}

                {audioUrl && !disableAudio && (
                    <div className={cn(
                        "absolute top-2 right-2 md:top-6 md:right-6 w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 z-20 border border-white/40 backdrop-blur-md shadow-xl",
                        isPlaying
                            ? "bg-primary text-white scale-110 shadow-primary/40 rotate-12"
                            : "bg-white/50 dark:bg-white/5 text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    )}>
                        {isPlaying ? <Volume2 className="w-3 h-3 md:w-6 md:h-6 animate-pulse" /> : <Play className="w-3 h-3 md:w-5 md:h-5 fill-primary" />}
                    </div>
                )}

                {/* Inner Depth / Glow */}
                <div className="absolute inset-x-4 top-4 h-px bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-[2rem] md:rounded-[3.5rem] transition-colors duration-500" />
            </motion.button>
        );
    });

HijaiyahCard.displayName = "HijaiyahCard";
