"use client";

import { usePrayerSchedule, useSelectedLocation } from "@/hooks/use-prayer";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function PrayerSchedule({ month, year }: { month?: number; year?: number }) {
    const { location } = useSelectedLocation();
    const { data: scheduleData, isLoading } = usePrayerSchedule(
        location?.province ?? null,
        location?.city ?? null,
        month,
        year
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-2xl bg-white/5" />
            </div>
        );
    }

    if (!scheduleData || !scheduleData.jadwal) {
        return (
            <div className="p-12 text-center text-white/40 font-medium bg-white/5 rounded-2xl border border-white/5">
                Pilih lokasi terlebih dahulu untuk melihat jadwal sholat.
            </div>
        );
    }

    const now = new Date();
    const todayDate = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return (
        <div className="relative group/table overflow-hidden rounded-[2.5rem] border border-white/[0.03] bg-surface-container-low/20 backdrop-blur-3xl shadow-xl">
            {/* Mobile Scroll Hint - Sublet gradient on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-black/20 to-transparent pointer-events-none z-10 md:hidden" />
            
            <div className="overflow-x-auto scrollbar-hide scroll-smooth">
                <Table>
                    <TableHeader className="bg-white/[0.01]">
                        <TableRow className="border-white/[0.03] hover:bg-transparent">
                            <TableHead className="text-on-surface/40 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center h-16">Tanggal</TableHead>
                            <TableHead className="text-on-surface/30 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Imsak</TableHead>
                            <TableHead className="text-primary/60 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Subuh</TableHead>
                            <TableHead className="text-on-surface/30 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Terbit</TableHead>
                            <TableHead className="text-on-surface/30 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Dzuhur</TableHead>
                            <TableHead className="text-on-surface/30 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Ashar</TableHead>
                            <TableHead className="text-primary/60 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Maghrib</TableHead>
                            <TableHead className="text-on-surface/30 font-headline font-black uppercase text-[9px] tracking-[0.2em] text-center">Isya</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduleData.jadwal.map((day, idx) => {
                            const isToday = day.tanggal === todayDate &&
                                (month === currentMonth || (!month && currentMonth === new Date().getMonth() + 1)) &&
                                (year === currentYear || (!year && currentYear === new Date().getFullYear()));
                            return (
                                <TableRow
                                    key={idx}
                                    className={cn(
                                        "border-white/[0.02] transition-colors duration-500 relative group/row",
                                        isToday ? "bg-primary/[0.04] hover:bg-primary/[0.08]" : "hover:bg-white/[0.01]"
                                    )}
                                >
                                    <TableCell className="text-center font-body py-4 md:py-6">
                                        <div className="flex flex-col gap-0.5 relative">
                                            {isToday && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 md:h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />}
                                            <span className={cn(
                                                "text-xs md:text-sm font-headline font-black tracking-tight transition-colors",
                                                isToday ? "text-primary" : "text-on-surface/80"
                                            )}>{day.tanggal}</span>
                                            <span className="text-[7px] md:text-[8px] font-headline font-bold text-on-surface/20 uppercase tracking-widest">{day.hari}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-xs font-body font-medium text-on-surface/40 tabular-nums">{day.imsak}</TableCell>
                                    <TableCell className={cn(
                                        "text-center text-sm font-headline font-black tabular-nums transition-colors",
                                        isToday ? "text-primary" : "text-primary/50"
                                    )}>{day.subuh}</TableCell>
                                    <TableCell className="text-center text-xs font-body font-medium text-on-surface/40 tabular-nums">{day.terbit}</TableCell>
                                    <TableCell className="text-center text-xs font-body font-bold text-on-surface/60 tabular-nums">{day.dzuhur}</TableCell>
                                    <TableCell className="text-center text-xs font-body font-bold text-on-surface/60 tabular-nums">{day.ashar}</TableCell>
                                    <TableCell className={cn(
                                        "text-center text-sm font-headline font-black tabular-nums transition-colors",
                                        isToday ? "text-primary" : "text-primary/50"
                                    )}>{day.maghrib}</TableCell>
                                    <TableCell className="text-center text-xs font-body font-bold text-on-surface/60 tabular-nums">{day.isya}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                
                {/* Mobile Scroll Indicator - Subtle text */}
                <div className="md:hidden flex justify-center py-2 bg-white/[0.02] border-t border-white/[0.02]">
                    <span className="text-[8px] font-headline font-black text-on-surface/20 uppercase tracking-[0.2em]">Geser horizontal untuk lihat waktu lengkap</span>
                </div>
            </div>

            {/* Legend / Info */}
            <div className="p-4 bg-white/[0.005] border-t border-white/[0.03] flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 opacity-30">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[8px] font-headline font-black text-on-surface uppercase tracking-[0.2em]">Hari Ini</span>
                </div>
                <div className="flex items-center gap-2 opacity-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-on-surface" />
                    <span className="text-[8px] font-headline font-black text-on-surface uppercase tracking-[0.2em]">Kemenag RI</span>
                </div>
            </div>
        </div>
    );
}
