"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, ChevronRight, Zap, Bookmark, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { useAudioState } from '@/contexts/AudioContext';
import { useSearch } from '@/contexts/SearchContext';
import surahSummaryData from '@/lib/data/surahs.json';
import { AchievementSheet } from './AchievementSheet';

export function ReadingJourney() {
    const [isAchievementOpen, setIsAchievementOpen] = React.useState(false);
    const { streaks, currentStreakCount, readingBookmark, isConnected } = useQuranFoundation();
    const { setViewedSurah, setViewedJuz, setJumpTargetAyah, setRightPanelOpen } = useAudioState();
    const { setIsMobileMenuOpen } = useSearch();

    const streakCount = currentStreakCount.data?.days || (streaks.data && streaks.data.length > 0 ? streaks.data[0].days : 0);

    const bookmarkedSurah = React.useMemo(() => {
        const data = readingBookmark.data;
        if (!data) return null;
        return (surahSummaryData as any[]).find(s => s.nomor === data.key);
    }, [readingBookmark.data]);

    // Fallback UI for Guest/Not Connected
    if (!isConnected) {
        return (
            <div className="px-4 mb-8">
                <div className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 overflow-hidden relative group">
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Flame className="w-4 h-4 text-primary fill-primary/20" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">Quran Journey</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-foreground">Ayo Mulai Journey-mu!</h4>
                            <p className="text-[10px] text-foreground/30 font-medium leading-relaxed">
                                Sambungkan akunmu biar progres bacaan harian tercatat rapi secara otomatis.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/api/quran/auth/login'}
                            className="w-full mt-2 py-2.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/10 active:scale-95 transition-all"
                        >
                            Sambungkan Sekarang
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <p className="text-[10px] text-foreground/30 font-medium leading-relaxed">
                            Jaga terus streak harianmu dengan membaca Al-Quran setiap hari! Semangat meraih keberkahan! ✨
                        </p>
                    </div>

                    {/* Call to Action or Secondary Stats */}
                    <button 
                        onClick={() => setIsAchievementOpen(true)}
                        className="w-full mt-2 py-3 rounded-xl bg-foreground/[0.05] hover:bg-foreground/[0.08] transition-all flex items-center justify-center gap-2 group/btn"
                    >
                        <Trophy className="w-3.5 h-3.5 text-primary/40 group-hover/btn:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-foreground/40 group-hover/btn:text-foreground">Lihat Pencapaian</span>
                        <ChevronRight className="w-3 h-3 ml-auto mr-2 text-foreground/20 group-hover/btn:text-primary" />
                    </button>
                </div>
            </div>

            <AchievementSheet 
                isOpen={isAchievementOpen} 
                onClose={() => setIsAchievementOpen(false)} 
            />

            {/* Last Read Widget */}
            {bookmarkedSurah && (
                <div className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 overflow-hidden relative group mt-4 cursor-pointer hover:bg-foreground/[0.05] transition-all"
                    onClick={() => {
                        if (bookmarkedSurah) {
                            // Order: Open -> View -> Jump -> Close Sidebar (mobile)
                            setRightPanelOpen(true);
                            setViewedJuz(null);
                            setViewedSurah(bookmarkedSurah);
                            setJumpTargetAyah(readingBookmark.data?.verseNumber || 1);
                            setIsMobileMenuOpen(false);
                        }
                    }}
                >
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <Bookmark className="w-3 h-3 text-primary fill-primary/20" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Terakhir Baca</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Surah {bookmarkedSurah.namaLatin}</h4>
                                <p className="text-[10px] text-foreground/40 font-medium">Ayat {readingBookmark.data?.verseNumber}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary text-primary group-hover:text-primary-foreground transition-all">
                                <PlayCircle className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
