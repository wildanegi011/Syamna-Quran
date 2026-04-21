"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getProvinces, getCities, getPrayerSchedule } from "@/lib/prayer";
import { useState, useEffect } from "react";

const STORAGE_KEY = "syamna-prayer-location";

export function useProvinces() {
    return useQuery({
        queryKey: ["provinces"],
        queryFn: getProvinces,
        staleTime: Infinity,
    });
}

export function useCities(province: string | null) {
    return useQuery({
        queryKey: ["cities", province],
        queryFn: () => getCities(province!),
        enabled: !!province,
        staleTime: Infinity,
    });
}

export function usePrayerSchedule(province: string | null, city: string | null, month?: number, year?: number) {
    return useQuery({
        queryKey: ["prayer-schedule", province, city, month, year],
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
    
    // Use React Query as a global state manager for location
    const { data: location, isLoading } = useQuery<LocationData | null>({
        queryKey: ["selected-location"],
        queryFn: () => {
            if (typeof window === "undefined") return null;
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        },
        staleTime: Infinity,
    });

    const [isDetecting, setIsDetecting] = useState(false);

    const saveLocation = (province: string, city: string, source: LocationSource = 'manual') => {
        const newLocation: LocationData = { province, city, source };
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        }
        // Update the global cache instantly
        queryClient.setQueryData(["selected-location"], newLocation);
    };

    const detectLocation = async () => {
        setIsDetecting(true);
        try {
            if (typeof window !== "undefined" && "geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                        const data = await response.json();

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
    };

    // Initial load logic moved to useEffect to avoid hydration issues
    useEffect(() => {
        if (!location && !isLoading) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                queryClient.setQueryData(["selected-location"], JSON.parse(stored));
            } else {
                detectLocation();
            }
        }
    }, [location, isLoading, queryClient]);

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
            
            // If the selected month/year is not the current one, the notion of "today" in that schedule
            // reflects the same day of the month as currently, but in the selected month context.
            const todaySchedule = schedule.jadwal.find(s => s.tanggal === todayDate);

            if (!todaySchedule) {
                // Return last day of month if current date exceeds days in schedule
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
                
                // Set context date to the selected month/year if applicable
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
