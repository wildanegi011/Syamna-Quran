"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { Progress } from '@/components/ui/progress';

export function ReadingJourney() {
    const { streaks, todayActivity, isConnected } = useQuranFoundation();

    if (!isConnected) return null;

    const streakCount = streaks.data?.streak || 0;
    const progressPercent = Math.min(((todayActivity.data?.verses_count || 0) / 10) * 100, 100); // Assume 10 verses daily goal

    return (
        <div className="px-4 mb-8">
            <div className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 overflow-hidden relative group">
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors" />

                <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-primary fill-primary/20" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Journey Kita</span>
                        </div>
                        <div className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-md">
                            <Zap className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black">{streakCount}</span>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <h4 className="text-sm font-bold text-foreground">Target Harian</h4>
                            <span className="text-[10px] font-black text-primary uppercase">{todayActivity.data?.verses_count || 0}/10 Ayat</span>
                        </div>
                        
                        <div className="relative pt-1">
                             <Progress value={progressPercent} className="h-2 bg-foreground/5" />
                        </div>

                        <p className="text-[10px] text-foreground/30 font-medium leading-relaxed">
                            {progressPercent >= 100 
                                ? "MasyaAllah! Target hari ini tercapai. Lanjutkan istiqomahmu." 
                                : `Baca ${10 - (todayActivity.data?.verses_count || 0)} ayat lagi untuk menjaga streak.`}
                        </p>
                    </div>

                    {/* Call to Action or Secondary Stats */}
                    <button className="w-full mt-2 py-3 rounded-xl bg-foreground/[0.05] hover:bg-foreground/[0.08] transition-all flex items-center justify-center gap-2 group/btn">
                        <Trophy className="w-3.5 h-3.5 text-primary/40 group-hover/btn:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-foreground/40 group-hover/btn:text-foreground">Lihat Pencapaian</span>
                        <ChevronRight className="w-3 h-3 ml-auto mr-2 text-foreground/20 group-hover/btn:text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );
}
