"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, ChevronRight, Zap, Bookmark, PlayCircle, Check, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { useReadingProgress } from '@/contexts/ReadingProgressContext';
import { useAudioState } from '@/contexts/AudioContext';
import { useSearch } from '@/contexts/SearchContext';
import surahSummaryData from '@/lib/data/surahs.json';
import { AchievementSheet } from './AchievementSheet';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/lib/constants/translations';

/** Build an array of 7 day-objects for Mon..Sun of the current week */
function getWeekDays() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);

    const days: { date: string; label: string; labelEN: string; isToday: boolean; isPast: boolean }[] = [];
    const labelsID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const labelsEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayStr = now.toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        days.push({
            date: dateStr,
            label: labelsID[i],
            labelEN: labelsEN[i],
            isToday: dateStr === todayStr,
            isPast: dateStr < todayStr,
        });
    }
    return days;
}

export function ReadingJourney() {
    const [isAchievementOpen, setIsAchievementOpen] = React.useState(false);
    const { streaks, currentStreakCount, readingBookmark, activityDays, isConnected, authLoading } = useQuranFoundation();
    const { hasSubmittedToday, dailyGoal } = useReadingProgress();
    const { setViewedSurah, setViewedJuz, setJumpTargetAyah, setRightPanelOpen } = useAudioState();
    const { setIsMobileMenuOpen } = useSearch();
    const { language } = useSettings();
    const { t } = useTranslation(language);

    const streakCount = currentStreakCount.data?.days || (streaks.data && streaks.data.length > 0 ? streaks.data[0].days : 0);

    const weekDays = React.useMemo(() => getWeekDays(), []);

    // Build a Set of dates that have activity
    const activeDatesSet = React.useMemo(() => {
        const set = new Set<string>();
        if (activityDays.data) {
            activityDays.data.forEach(a => set.add(a.date));
        }
        // If today was submitted locally but API hasn't refreshed yet, include it
        if (hasSubmittedToday) {
            set.add(new Date().toISOString().split('T')[0]);
        }
        return set;
    }, [activityDays.data, hasSubmittedToday]);

    const bookmarkedSurah = React.useMemo(() => {
        const data = readingBookmark.data;
        if (!data) return null;
        return (surahSummaryData as any[]).find(s => s.nomor === data.key);
    }, [readingBookmark.data]);

    const handleContinueReading = () => {
        if (bookmarkedSurah) {
            setRightPanelOpen(true);
            setViewedJuz(null);
            setViewedSurah(bookmarkedSurah);
            setJumpTargetAyah(readingBookmark.data?.verseNumber || 1);
            setIsMobileMenuOpen(false);
        }
    };

    // Loading skeleton while auth state is resolving
    if (authLoading) {
        return (
            <div className="px-4 mb-8">
                <div className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 animate-pulse">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-foreground/[0.06]" />
                            <div className="w-20 h-3 rounded bg-foreground/[0.06]" />
                        </div>
                        <div className="w-10 h-5 rounded-md bg-foreground/[0.06]" />
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                <div className="w-5 h-2 rounded bg-foreground/[0.04]" />
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.06]" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="w-28 h-2.5 rounded bg-foreground/[0.04]" />
                        <div className="w-12 h-2.5 rounded bg-foreground/[0.04]" />
                    </div>
                </div>
            </div>
        );
    }

    // Guest: don't render anything — login is handled via TopNav only
    if (!isConnected) return null;

    return (
        <div className="px-4 mb-8 space-y-4">
            {/* Weekly Progress Card */}
            <div className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-5 overflow-hidden relative group">
                {/* Background Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors" />

                <div className="relative z-10 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Flame className="w-4 h-4 text-primary fill-primary/20" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">
                                {language === 'ID' ? 'Minggu Ini' : 'This Week'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-md">
                            <Zap className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black">{streakCount}</span>
                        </div>
                    </div>

                    {/* Weekly Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                        {weekDays.map((day) => {
                            const hasActivity = activeDatesSet.has(day.date);
                            const isTodayNotDone = day.isToday && !hasActivity;
                            const isFuture = !day.isPast && !day.isToday;

                            return (
                                <div key={day.date} className="flex flex-col items-center gap-1.5">
                                    {/* Day label */}
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-wider",
                                        day.isToday ? "text-primary" : "text-foreground/25"
                                    )}>
                                        {language === 'ID' ? day.label : day.labelEN}
                                    </span>

                                    {/* Day circle */}
                                    <div className="relative">
                                        {isTodayNotDone ? (
                                            /* Today, not done yet — animated pulse */
                                            <motion.div
                                                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                                            >
                                                <Flame className="w-3.5 h-3.5 text-primary fill-primary/30" />
                                            </motion.div>
                                        ) : hasActivity ? (
                                            /* Done */
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                                            >
                                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                            </motion.div>
                                        ) : (
                                            /* Not done / future */
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                isFuture
                                                    ? "bg-foreground/[0.03] border border-foreground/5"
                                                    : "bg-foreground/[0.06] border border-foreground/10"
                                            )}>
                                                {/* Small dot for missed past days */}
                                                {day.isPast && !isFuture && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/15" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Daily Goal Info */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-foreground/20" />
                            <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-wider">
                                {language === 'ID' ? `Target: ${dailyGoal} Ayat/hari` : `Goal: ${dailyGoal} Verses/day`}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAchievementOpen(true)}
                            className="flex items-center gap-1 text-[9px] font-bold text-primary/50 hover:text-primary transition-colors uppercase tracking-wider"
                        >
                            <Trophy className="w-3 h-3" />
                            {language === 'ID' ? 'Detail' : 'Details'}
                        </button>
                    </div>
                </div>
            </div>

            <AchievementSheet 
                isOpen={isAchievementOpen} 
                onClose={() => setIsAchievementOpen(false)} 
            />

            {/* Streak Reminder / Continue Reading Button */}
            {!hasSubmittedToday && bookmarkedSurah ? (
                <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleContinueReading}
                    className="w-full bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] group"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-primary/20"
                        />
                        <div className="relative w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <PlayCircle className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-foreground">
                            {language === 'ID' ? 'Belum baca hari ini!' : "You haven't read today!"}
                        </p>
                        <p className="text-[10px] text-foreground/40 font-medium">
                            {language === 'ID' 
                                ? `Lanjut Surah ${bookmarkedSurah.namaLatin}, ${t('ayat')} ${readingBookmark.data?.verseNumber}`
                                : `Continue Surah ${bookmarkedSurah.namaLatin}, ${t('ayat')} ${readingBookmark.data?.verseNumber}`}
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                </motion.button>
            ) : bookmarkedSurah ? (
                /* Already read today — show simple last read card */
                <div 
                    className="bg-foreground/[0.03] border border-foreground/5 rounded-2xl p-4 overflow-hidden relative group cursor-pointer hover:bg-foreground/[0.05] transition-all"
                    onClick={handleContinueReading}
                >
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <Bookmark className="w-3 h-3 text-primary fill-primary/20" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{t('terakhirBaca')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Surah {bookmarkedSurah.namaLatin}</h4>
                                <p className="text-[10px] text-foreground/40 font-medium">{t('ayat')} {readingBookmark.data?.verseNumber}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary text-primary group-hover:text-primary-foreground transition-all">
                                <PlayCircle className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
