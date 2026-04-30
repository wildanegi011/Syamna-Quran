"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProvinces, getCities, getPrayerSchedule, getReverseGeocode } from "@/lib/prayer";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "syamna-prayer-location";

export const prayerKeys = {
    all: ['prayer'] as const,
    provinces: () => [...prayerKeys.all, 'provinces'] as const,
    cities: (province: string | null) => [...prayerKeys.all, 'cities', province] as const,
    schedule: (province: string | null, city: string | null, month?: number, year?: number) => [...prayerKeys.all, 'schedule', province, city, month, year] as const,
    location: () => [...prayerKeys.all, 'selected-location'] as const,
};

export function useProvinces() {
    return useQuery({
        queryKey: prayerKeys.provinces(),
        queryFn: getProvinces,
        staleTime: Infinity,
    });
}

export function useCities(province: string | null) {
    return useQuery({
        queryKey: prayerKeys.cities(province),
        queryFn: () => getCities(province!),
        enabled: !!province,
        staleTime: Infinity,
    });
}

export function usePrayerSchedule(province: string | null, city: string | null, month?: number, year?: number) {
    return useQuery({
        queryKey: prayerKeys.schedule(province, city, month, year),
        queryFn: () => getPrayerSchedule(province!, city!, month, year),
        enabled: !!province && !!city,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}

export type LocationSource = 'auto' | 'manual';

export interface LocationData {
    province: string;
    city: string;
    source: LocationSource;
}

export function useSelectedLocation() {
    const queryClient = useQueryClient();
    
    const { data: location, isLoading } = useQuery<LocationData | null>({
        queryKey: prayerKeys.location(),
        queryFn: () => {
            if (typeof window === "undefined") return null;
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        },
        staleTime: Infinity,
    });

    const [isDetecting, setIsDetecting] = useState(false);

    const saveLocation = useCallback((province: string, city: string, source: LocationSource = 'manual') => {
        const newLocation: LocationData = { province, city, source };
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        }
        queryClient.setQueryData(prayerKeys.location(), newLocation);
    }, [queryClient]);

    const detectLocation = useCallback(async () => {
        setIsDetecting(true);
        try {
            if (typeof window !== "undefined" && "geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const data = await getReverseGeocode(latitude, longitude);

                        const detectedCity = data.address.city || data.address.town || data.address.city_district || data.address.county || "";
                        const detectedProvince = data.address.state || "";

                        const provinces = await getProvinces();
                        const bestProvince = provinces.find(p =>
                            detectedProvince.toLowerCase().includes(p.toLowerCase()) ||
                            p.toLowerCase().includes(detectedProvince.toLowerCase())
                        ) || provinces[0];

                        const cities = await getCities(bestProvince);
                        const bestCity = cities.find(c =>
                            detectedCity.toLowerCase().includes(c.toLowerCase().replace('kota ', '').replace('kab. ', '')) ||
                            c.toLowerCase().includes(detectedCity.toLowerCase())
                        ) || cities[0];

                        saveLocation(bestProvince, bestCity, 'auto');
                    } catch (error) {
                        console.error("Reverse geocoding matching failed", error);
                        if (!location) saveLocation("DKI Jakarta", "Kota Jakarta", "manual");
                    } finally {
                        setIsDetecting(false);
                    }
                }, (error) => {
                    console.error("Geolocation failed", error);
                    if (!location) saveLocation("DKI Jakarta", "Kota Jakarta", "manual");
                    setIsDetecting(false);
                });
            } else {
                if (!location) saveLocation("DKI Jakarta", "Kota Jakarta", "manual");
                setIsDetecting(false);
            }
        } catch (e) {
            console.error("Auto detect failed", e);
            setIsDetecting(false);
        }
    }, [location, saveLocation]);

    useEffect(() => {
        if (!location && !isLoading) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                queryClient.setQueryData(prayerKeys.location(), JSON.parse(stored));
            } else {
                detectLocation();
            }
        }
    }, [location, isLoading, queryClient, detectLocation]);

    return { 
        location: location ?? null, 
        saveLocation, 
        detectLocation, 
        isDetecting 
    };
}

export function useNextPrayer(province: string | null, city: string | null, month?: number, year?: number) {
    const { data: schedule, isLoading } = usePrayerSchedule(province, city, month, year);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null);

    useEffect(() => {
        if (!schedule || !schedule.jadwal) return;

        const timer = setInterval(() => {
            const now = new Date();
            const todayDate = now.getDate();
            const todaySchedule = schedule.jadwal.find(s => s.tanggal === todayDate);

            if (!todaySchedule) {
                const lastDay = schedule.jadwal[schedule.jadwal.length - 1];
                setNextPrayer({ name: "End of Month", time: lastDay.isya, countdown: "Pilih Hari Lain" });
                return;
            }

            const prayerTimes = [
                { name: "Imsak", time: todaySchedule.imsak },
                { name: "Subuh", time: todaySchedule.subuh },
                { name: "Dzuhur", time: todaySchedule.dzuhur },
                { name: "Ashar", time: todaySchedule.ashar },
                { name: "Maghrib", time: todaySchedule.maghrib },
                { name: "Isya", time: todaySchedule.isya },
            ];

            let found = false;
            for (const prayer of prayerTimes) {
                const [hours, minutes] = prayer.time.split(":").map(Number);
                const prayerDate = new Date();
                if (month) prayerDate.setMonth(month - 1);
                if (year) prayerDate.setFullYear(year);
                prayerDate.setHours(hours, minutes, 0, 0);

                if (prayerDate > now) {
                    const diff = prayerDate.getTime() - now.getTime();
                    const h = Math.floor(diff / (1000 * 60 * 60));
                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);

                    setNextPrayer({
                        name: prayer.name,
                        time: prayer.time,
                        countdown: `${h > 0 ? h + 'j ' : ''}${m}m ${s}s`
                    });
                    found = true;
                    break;
                }
            }

            if (!found) {
                setNextPrayer({ name: "Qiyamulyail", time: "--:--", countdown: "Beristirahat" });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [schedule, month, year]);

    return { nextPrayer, isLoading };
}
