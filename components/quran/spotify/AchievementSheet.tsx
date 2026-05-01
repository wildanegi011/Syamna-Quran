"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuranFoundation } from "@/hooks/use-quran-foundation";
import { Flame, Trophy, Calendar, Target, Award, Star, BookOpen, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInDays } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/lib/constants/translations";

interface AchievementSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementSheet({ isOpen, onClose }: AchievementSheetProps) {
  const { streaks, currentStreakCount, activityDays } = useQuranFoundation();
  const { language } = useSettings();
  const { t } = useTranslation(language);

  const locale = language === 'ID' ? idLocale : enUS;
  const currentDays = currentStreakCount.data?.days || 0;
  
  // Find longest streak
  const longestStreak = React.useMemo(() => {
    if (!streaks.data || streaks.data.length === 0) return currentDays;
    const maxHistorical = Math.max(...streaks.data.map(s => s.days));
    return Math.max(maxHistorical, currentDays);
  }, [streaks.data, currentDays]);

  const activeStreakDetails = streaks.data?.find(s => s.status === "ACTIVE");

  // Calculate Weekly Stats from Activity Days
  const weeklyStats = React.useMemo(() => {
    let totalVerses = 0;
    let totalSeconds = 0;
    
    if (activityDays.data) {
      activityDays.data.forEach(day => {
        totalVerses += day.versesRead || 0;
        totalSeconds += day.secondsRead || 0;
      });
    }
    
    return {
      totalVerses,
      totalMinutes: Math.round(totalSeconds / 60)
    };
  }, [activityDays.data]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-foreground/5 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{language === 'ID' ? 'Pencapaian Quran' : 'Quran Achievements'}</SheetTitle>
          <SheetDescription>{language === 'ID' ? 'Detail statistik membaca Al-Quran Anda.' : 'Your Al-Quran reading statistics.'}</SheetDescription>
        </SheetHeader>
        
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="h-32 bg-primary/10 relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
             <Trophy className="w-24 h-24 text-primary/20 absolute -bottom-4" />
          </div>

          <div className="px-8 pt-6 pb-8 space-y-8 relative z-20">
            {/* Main Current Streak */}
            <div className="text-center space-y-2">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                 {language === 'ID' ? 'Streak Saat Ini' : 'Current Streak'}
               </h2>
               {currentStreakCount.isLoading ? (
                   <Skeleton className="h-16 w-24 mx-auto" />
               ) : (
                   <div className="flex items-center justify-center gap-2">
                       <Flame className="w-8 h-8 text-primary fill-primary/20 animate-pulse" />
                       <span className="text-5xl font-black text-foreground">{currentDays}</span>
                       <span className="text-xl font-bold text-foreground/40 mt-3">
                         {language === 'ID' ? 'Hari' : 'Days'}
                       </span>
                   </div>
               )}
               {activeStreakDetails && (
                   <p className="text-[10px] font-medium text-foreground/40 mt-2">
                       {language === 'ID' ? 'Dimulai sejak ' : 'Started on '}
                       {format(new Date(activeStreakDetails.startDate), "d MMMM yyyy", { locale })}
                   </p>
               )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
               {/* Longest Record */}
               <div className="bg-foreground/[0.03] border border-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
                    {language === 'ID' ? 'Rekor Terpanjang' : 'Longest Record'}
                  </span>
                  {streaks.isLoading ? <Skeleton className="h-6 w-8" /> : (
                      <span className="text-xl font-black text-foreground">{longestStreak} <span className="text-xs text-foreground/40">{language === 'ID' ? 'hari' : 'days'}</span></span>
                  )}
               </div>
               
               {/* Total Sessions */}
               <div className="bg-foreground/[0.03] border border-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <Award className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
                    {language === 'ID' ? 'Total Sesi' : 'Total Sessions'}
                  </span>
                  {streaks.isLoading ? <Skeleton className="h-6 w-8" /> : (
                      <span className="text-xl font-black text-foreground">{streaks.data?.length || 0}</span>
                  )}
               </div>

               {/* Verses Read This Week */}
               <div className="bg-foreground/[0.03] border border-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <BookOpen className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
                    {language === 'ID' ? 'Ayat Minggu Ini' : 'Verses This Week'}
                  </span>
                  {activityDays.isLoading ? <Skeleton className="h-6 w-8" /> : (
                      <span className="text-xl font-black text-foreground">{weeklyStats.totalVerses} <span className="text-xs text-foreground/40">{language === 'ID' ? 'ayat' : 'verses'}</span></span>
                  )}
               </div>

               {/* Time Read This Week */}
               <div className="bg-foreground/[0.03] border border-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <Clock className="w-5 h-5 text-purple-500 fill-purple-500/20" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">
                    {language === 'ID' ? 'Waktu Membaca' : 'Reading Time'}
                  </span>
                  {activityDays.isLoading ? <Skeleton className="h-6 w-8" /> : (
                      <span className="text-xl font-black text-foreground">{weeklyStats.totalMinutes} <span className="text-xs text-foreground/40">{language === 'ID' ? 'mnt' : 'min'}</span></span>
                  )}
               </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {language === 'ID' ? 'Riwayat Streak' : 'Streak History'}
                </h3>
                
                <div className="space-y-3">
                    {streaks.isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
                    ) : streaks.data && streaks.data.length > 0 ? (
                        streaks.data.map((streak) => (
                            <div key={streak.id} className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-foreground">
                                        {format(new Date(streak.startDate), "d MMM", { locale })} - {format(new Date(streak.endDate), "d MMM yyyy", { locale })}
                                    </span>
                                    <span className="text-[9px] font-medium text-foreground/40 uppercase tracking-wider">
                                        {streak.status === "ACTIVE" 
                                            ? (language === 'ID' ? "Sedang Berjalan" : "Active") 
                                            : (language === 'ID' ? "Selesai" : "Completed")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/[0.05]">
                                    <Flame className="w-3 h-3 text-foreground/60" />
                                    <span className="text-[10px] font-black text-foreground/80">{streak.days}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-[10px] text-foreground/40 font-medium">
                                {language === 'ID' ? 'Belum ada riwayat streak. Yuk mulai hari ini!' : 'No streak history yet. Start today!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
