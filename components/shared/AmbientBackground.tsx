"use client";

import { cn } from "@/lib/utils";

interface AmbientBackgroundProps {
    className?: string;
    variant?: 'default' | 'iqro' | 'equran';
}

export function AmbientBackground({ className, variant = 'default' }: AmbientBackgroundProps) {
    if (variant === 'equran') {
        return (
            <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
                {/* Blue/Cyan Swash - Top Right */}
                <div 
                    className="absolute -top-[20%] -right-[10%] w-[80%] h-[70%] bg-cyan-500/20 blur-[120px] rotate-[-15deg] opacity-60 will-change-[transform,opacity]" 
                    style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                />
                
                {/* Purple/Indigo Swash - Center Right */}
                <div 
                    className="absolute top-[10%] right-[-5%] w-[50%] h-[60%] bg-indigo-500/15 blur-[100px] rotate-[25deg] opacity-40 will-change-[transform,opacity]" 
                    style={{ borderRadius: '50% 50% 50% 50% / 60% 40% 70% 30%' }}
                />

                {/* Red/Orange Swash - Bottom Left */}
                <div 
                    className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[50%] bg-rose-500/20 blur-[140px] rotate-[45deg] opacity-50 will-change-[transform,opacity]" 
                    style={{ borderRadius: '30% 70% 70% 30% / 50% 50% 50% 50%' }}
                />

                {/* Subtle Amber Glow - Bottom Right */}
                <div 
                    className="absolute bottom-[-20%] right-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[100px] opacity-30" 
                />
                
                {/* Global Vignette */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background/80" />
            </div>
        );
    }

    if (variant === 'iqro') {
        return (
            <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px] animate-pulse will-change-opacity" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/15 rounded-full blur-[140px] will-change-opacity" />
                <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute middle-0 left-[-15%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
            </div>
        );
    }

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-50", className)}>
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/8 rounded-full blur-[120px] animate-pulse will-change-opacity" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] left-[5%] w-[30%] h-[30%] bg-accent/8 rounded-full blur-[80px]" />
        </div>
    );
}
