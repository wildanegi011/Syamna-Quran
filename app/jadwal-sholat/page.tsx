"use client";

import { motion } from "framer-motion";
import { useSelectedLocation, usePrayerSchedule, useNextPrayer } from "@/hooks/use-prayer";
import { Clock, MapPin, Moon, Sun, CloudSun, Sunrise, Sunset, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PrayerCitySelector } from "@/components/prayer/PrayerCitySelector";
import { PrayerSchedule } from "@/components/prayer/PrayerSchedule";
import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFilterBar } from "@/components/shared/ModuleFilterBar";
import { ModuleFooter } from "@/components/shared/ModuleFooter";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

export default function PrayerSchedulePage() {
    const [openMonth, setOpenMonth] = useState(false);
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear] = useState(today.getFullYear());

    const { location } = useSelectedLocation();
    const { data: schedule, isLoading: loadingSchedule } = usePrayerSchedule(
        location?.province ?? null,
        location?.city ?? null,
        selectedMonth,
        selectedYear
    );
    const { nextPrayer } = useNextPrayer(
        location?.province ?? null,
        location?.city ?? null,
        selectedMonth,
        selectedYear
    );

    // Reset month to current when province changes (as requested)
    useEffect(() => {
        if (location?.province) {
            setSelectedMonth(today.getMonth() + 1);
        }
    }, [location?.province]);

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const todayDate = today.getDate();
    const todaySchedule = schedule?.jadwal.find(s => s.tanggal === todayDate);

    const prayerTimes = todaySchedule ? [
        { name: "Imsak", time: todaySchedule.imsak, icon: Clock, color: "text-primary/60" },
        { name: "Subuh", time: todaySchedule.subuh, icon: Moon, color: "text-primary" },
        { name: "Terbit", time: todaySchedule.terbit, icon: Sunrise, color: "text-primary/60" },
        { name: "Dzuhur", time: todaySchedule.dzuhur, icon: Sun, color: "text-primary" },
        { name: "Ashar", time: todaySchedule.ashar, icon: Sun, color: "text-primary" },
        { name: "Maghrib", time: todaySchedule.maghrib, icon: CloudSun, color: "text-primary" },
        { name: "Isya", time: todaySchedule.isya, icon: Sunset, color: "text-primary" },
    ] : [];

    return (
        <div className="flex-1 flex flex-col min-h-full pb-20 md:pb-32">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-10 space-y-6 md:space-y-10">
                {/* Simple Header */}
                <header className="space-y-1 md:space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-headline font-black text-foreground tracking-tighter">
                        Jadwal <span className="text-primary">Sholat</span>
                    </h1>
                    <p className="text-[10px] md:text-sm text-foreground/40 font-body">
                        Waktu sholat akurat untuk wilayah {location?.city || "Anda"} — {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(today)}
                    </p>
                </header>

                {/* Unified Control Bar */}
                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-1 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] border border-foreground/5 bg-foreground/[0.02] backdrop-blur-3xl shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-2 md:gap-4 px-2 md:px-4"
                >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {/* Province & City Combine */}
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-foreground/5 rounded-[1.2rem] md:rounded-[1.8rem] p-1 md:p-2">
                            <div className="w-full">
                                <PrayerCitySelector type="province" />
                            </div>
                            <div className="hidden md:block w-px h-6 bg-foreground/10" />
                            <div className="w-full">
                                <PrayerCitySelector type="city" />
                            </div>
                        </div>

                        {/* Month Selector */}
                        <div className="flex items-center gap-4 bg-foreground/5 rounded-[1.2rem] md:rounded-[1.8rem] p-1 md:p-2 md:pr-4">
                            <div className="w-full">
                                <Popover open={openMonth} onOpenChange={setOpenMonth}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full h-10 md:h-12 justify-between bg-transparent border-none rounded-xl text-foreground hover:bg-foreground/[0.05] transition-all duration-300 font-body text-[10px] md:text-xs px-3 md:px-4"
                                        >
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <Calendar className={cn("w-3.5 h-3.5 md:w-4 md:h-4 text-primary")} />
                                                <span>{monthNames[selectedMonth - 1]}</span>
                                            </div>
                                            <ChevronsUpDown className="ml-2 h-3 w-3 md:h-4 md:w-4 shrink-0 opacity-20" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-background/95 backdrop-blur-3xl border-foreground/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
                                        <Command className="bg-transparent">
                                            <CommandInput placeholder="Cari bulan..." className="h-10 md:h-11 font-body text-xs" />
                                            <CommandList className="max-h-[250px] md:max-h-[300px] scrollbar-hide">
                                                <CommandEmpty className="py-4 md:py-6 text-center text-[10px] md:text-xs text-foreground/40">Bulan tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {monthNames.map((name, idx) => (
                                                        <CommandItem
                                                            key={name}
                                                            value={name}
                                                            onSelect={() => {
                                                                setSelectedMonth(idx + 1);
                                                                setOpenMonth(false);
                                                            }}
                                                            className="py-2.5 md:py-3 px-3 md:px-4 flex items-center justify-between text-[10px] md:text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                                        >
                                                            {name}
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-3 w-3 md:h-3.5 md:w-3.5 text-primary transition-opacity",
                                                                    selectedMonth === idx + 1 ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Active Info Badge */}
                    <div className="lg:w-64 h-12 md:h-16 lg:h-20 px-4 md:px-6 rounded-[1.2rem] md:rounded-[1.8rem] bg-primary/10 border border-primary/20 flex flex-col justify-center gap-0.5">
                        <span className="text-[6px] md:text-[8px] font-headline font-black text-primary uppercase tracking-[0.2em] opacity-60">Wilayah Aktif</span>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                            <span className="text-[9px] md:text-xs font-headline font-black text-foreground truncate">{location?.city || "Belum Dipilih"}</span>
                        </div>
                    </div>
                </motion.section>

                {/* Next Prayer Status Bar */}
                {nextPrayer && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-primary/20 bg-linear-to-r from-primary/10 to-transparent backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 overflow-hidden group shadow-2xl shadow-primary/5"
                    >
                        <div className="absolute top-0 right-0 w-60 md:w-80 h-60 md:h-80 bg-primary/10 blur-[80px] md:blur-[120px] -mr-30 md:-mr-40 -mt-30 md:-mt-40 rounded-full animate-pulse" />

                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 relative z-10 w-full md:w-auto">
                            {/* Visual Indicator */}
                            <div className="relative group/ring">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg md:blur-xl group-hover/ring:bg-primary/40 transition-all duration-500 animate-pulse" />
                                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-primary/30 flex items-center justify-center relative bg-background/80 backdrop-blur-xl">
                                    <Clock className="w-5 h-5 md:w-8 md:h-8 text-primary animate-pulse" />
                                </div>
                            </div>

                            <div className="flex flex-col text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-1.5 md:gap-2 mb-0.5 md:mb-2">
                                    <span className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-primary animate-ping" />
                                    <span className="text-[7px] md:text-[10px] font-headline font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] leading-none mb-0.5">Shalat Berikutnya</span>
                                </div>
                                <h3 className="text-lg md:text-3xl font-headline font-black text-foreground tracking-tight leading-tight">
                                    {nextPrayer.name}
                                    <span className="text-primary/40 font-black text-[10px] md:text-lg ml-1.5 md:ml-3 italic tracking-widest lowercase opacity-60">mendatang</span>
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4 md:gap-8 relative z-10 bg-foreground/5 p-3 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border border-foreground/5 w-full md:w-auto justify-center md:justify-end">
                            <div className="flex flex-col items-center md:items-end">
                                <span className="text-[7px] md:text-[9px] font-headline font-black text-foreground/30 uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none mb-1 md:mb-2">Hitung Mundur</span>
                                <div className="text-xl md:text-5xl font-headline font-black text-primary tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                                    {nextPrayer.countdown}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )
                }

                {/* Today's Schedule Row */}
                {(!location?.city || location.city === "") ? (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 md:py-20 text-center border border-dashed border-foreground/10 rounded-[1.5rem] md:rounded-[3rem] bg-foreground/[0.01]"
                    >
                        <div className="flex flex-col items-center gap-3 md:gap-4 text-foreground/30">
                            <MapPin className="w-10 h-10 md:w-12 md:h-12 opacity-20" />
                            <p className="font-headline font-black uppercase tracking-widest text-xs md:text-sm">Pilih Kota Terlebih Dahulu</p>
                            <p className="text-[10px] md:text-xs font-body max-w-xs md:max-w-md">Silakan pilih Provinsi dan Kota/Kabupaten untuk melihat jadwal sholat hari ini.</p>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="space-y-4 md:space-y-6"
                    >
                        <div className="flex items-center justify-between px-1 md:px-2">
                            <div className="flex items-center gap-2 md:gap-3">
                                <Sun className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                                <h2 className="text-base md:text-xl font-headline font-black tracking-tight text-foreground">Jadwal Hari Ini</h2>
                            </div>
                            <div className="text-[8px] md:text-[10px] font-headline font-black text-foreground/20 uppercase tracking-[0.15em] md:tracking-[0.2em]">
                                {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(today)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
                            {loadingSchedule ? (
                                Array(7).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-28 md:h-40 rounded-[1.5rem] md:rounded-[2.5rem] bg-foreground/5" />
                                ))
                            ) : prayerTimes.map((prayer) => {
                                const isNext = nextPrayer?.name === prayer.name;
                                return (
                                    <div
                                        key={prayer.name}
                                        className={cn(
                                            "p-4 md:p-6 h-28 md:h-40 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center text-center gap-2 md:gap-5 relative overflow-hidden group/item",
                                            isNext
                                                ? "bg-primary text-black border-primary shadow-xl md:shadow-2xl scale-[1.02] md:scale-105 z-10"
                                                : "bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.05] hover:border-foreground/10 hover:-translate-y-0.5 md:hover:-translate-y-1"
                                        )}
                                    >
                                        {isNext && <div className="absolute inset-0 bg-white/10 blur-xl animate-pulse" />}
                                        <prayer.icon className={cn(
                                            "w-4 h-4 md:w-6 h-6 transition-all duration-500 relative z-10",
                                            isNext ? "text-black scale-110" : "text-primary/40 group-hover/item:text-primary group-hover/item:scale-110"
                                        )} />
                                        <div className="space-y-0.5 md:space-y-1 relative z-10">
                                            <div className={cn(
                                                "text-[7px] md:text-[9px] font-headline font-black uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none mb-0.5 md:mb-1.5",
                                                isNext ? "text-black/60" : "text-foreground/20"
                                            )}>
                                                {prayer.name}
                                            </div>
                                            <div className={cn(
                                                "text-lg md:text-2xl font-headline font-black tabular-nums tracking-tighter leading-none",
                                                isNext ? "text-black" : "text-foreground/80"
                                            )}>
                                                {prayer.time}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.section>
                )}

                {/* Monthly Table Section */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 md:gap-3 px-1 md:px-2">
                        <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        <h2 className="text-base md:text-xl font-headline font-black tracking-tight text-foreground">Jadwal Bulanan</h2>
                        <span className="text-[8px] md:text-[10px] font-headline font-black text-foreground/20 uppercase tracking-widest ml-auto">
                            {monthNames[selectedMonth - 1]} {selectedYear}
                        </span>
                    </div>

                    <motion.div
                        key={`${selectedMonth}-${selectedYear}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PrayerSchedule month={selectedMonth} year={selectedYear} />
                    </motion.div>
                </div>
            </div>

            <ModuleFooter />
        </div>
    );
}
