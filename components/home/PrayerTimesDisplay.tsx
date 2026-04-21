"use client";

import { motion } from "framer-motion";
import { useSelectedLocation, usePrayerSchedule, useNextPrayer } from "@/hooks/use-prayer";
import { Clock, MapPin, Sparkles, ChevronRight, Moon, Sun, CloudSun, Sunrise, Sunset } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationSettingsModal } from "./LocationSettingsModal";
import { cn } from "@/lib/utils";

export function PrayerTimesDisplay() {
    const { location } = useSelectedLocation();
    const { data: schedule, isLoading: loadingSchedule } = usePrayerSchedule(
        location?.province ?? null,
        location?.city ?? null
    );
    const { nextPrayer } = useNextPrayer(
        location?.province ?? null,
        location?.city ?? null
    );

    const todayDate = new Date().getDate();
    const todaySchedule = schedule?.jadwal.find(s => s.tanggal === todayDate);

    if (loadingSchedule || !location || !todaySchedule) {
        return (
            <div className="w-full max-w-7xl mx-auto px-6 py-4">
                <Skeleton className="h-[140px] w-full rounded-3xl bg-white/5 border border-white/10" />
            </div>
        );
    }

    const prayerTimes = [
        { name: "Shobuh", time: todaySchedule.subuh, icon: Moon },
        { name: "Terbit", time: todaySchedule.terbit, icon: Sunrise },
        { name: "Dzuhur", time: todaySchedule.dzuhur, icon: Sun },
        { name: "Ashar", time: todaySchedule.ashar, icon: Sun },
        { name: "Maghrib", time: todaySchedule.maghrib, icon: CloudSun },
        { name: "Isya", time: todaySchedule.isya, icon: Sunset },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-6 mb-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group p-[1px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent w-full"
            >
                {/* Solid Background */}
                <div className="absolute inset-0 bg-[#111827]/90 rounded-3xl border border-white/5" />

                <div className="relative p-6 flex flex-col gap-6">

                    {/* Unified Header: City & Countdown */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                                    {location.city}
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#64748b] font-bold">Jadwal Sholat Hari Ini</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {nextPrayer && (
                                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#111827] border border-emerald-500/30">
                                    <Clock className="w-3.5 h-3.5 text-[#00df9a]" />
                                    <span className="text-[10px] font-black text-[#00df9a] tracking-widest tabular-nums uppercase">{nextPrayer.countdown} lagi</span>
                                </div>
                            )}
                            <LocationSettingsModal />
                        </div>
                    </div>

                    {/* Integrated Horizontal Schedule */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full">
                        {prayerTimes.map((prayer) => {
                            const isNext = nextPrayer?.name === prayer.name;
                            return (
                                <div
                                    key={prayer.name}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300",
                                        isNext
                                            ? "bg-[#00df9a] shadow-[0_15px_30px_rgba(0,223,154,0.15)] scale-105 z-10"
                                            : "bg-white/[0.03] text-white/40 border border-white/5"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-widest mb-1",
                                        isNext ? "text-emerald-950 font-black" : "text-[#64748b]"
                                    )}>
                                        {prayer.name}
                                    </span>
                                    <span className={cn(
                                        "text-base md:text-lg font-black tabular-nums tracking-tight",
                                        isNext ? "text-emerald-950" : "text-white/80"
                                    )}>
                                        {prayer.time}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Glass Flare */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -z-10 pointer-events-none" />
            </motion.div>
        </section>
    );
}
