"use client";

import { useProvinces, useCities, useSelectedLocation } from "@/hooks/use-prayer";

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
import { MapPin, Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PrayerCitySelector({ type }: { type?: "province" | "city" }) {
    const { location, saveLocation } = useSelectedLocation();
    const [openProvince, setOpenProvince] = React.useState(false);
    const [openCity, setOpenCity] = React.useState(false);

    const { data: provinces, isLoading: loadingProvinces } = useProvinces();
    const { data: cities, isLoading: loadingCities } = useCities(location?.province ?? null);

    if (loadingProvinces || !location) {
        return <Skeleton className="h-10 w-full rounded-xl bg-foreground/5" />;
    }

    const renderProvince = () => (
        <Popover open={openProvince} onOpenChange={setOpenProvince}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProvince}
                    className="w-full h-12 justify-between bg-foreground/5 border-foreground/5 rounded-xl text-foreground hover:bg-foreground/[0.08] hover:text-foreground transition-all duration-300 font-body text-xs px-4"
                >
                    <div className="flex items-center gap-3">
                        <MapPin className={cn("w-4 h-4 transition-colors", location.province ? "text-primary" : "text-foreground/20")} />
                        <span className={cn(location.province ? "opacity-100" : "opacity-40")}>
                            {location.province || "Cari Provinsi..."}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-20" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-background/95 backdrop-blur-3xl border-foreground/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Cari provinsi..." className="h-11 font-body" />
                    <CommandList className="max-h-[300px] scrollbar-hide">
                        <CommandEmpty className="py-6 text-center text-xs text-foreground/40">Provinsi tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {provinces?.map((p) => (
                                <CommandItem
                                    key={p}
                                    value={p}
                                    onSelect={(currentValue) => {
                                        saveLocation(currentValue, "");
                                        setOpenProvince(false);
                                    }}
                                    className="py-3 px-4 flex items-center justify-between text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                >
                                    {p}
                                    <Check
                                        className={cn(
                                            "mr-2 h-3.5 w-3.5 text-primary transition-opacity",
                                            location.province === p ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    const renderCity = () => (
        <Popover open={openCity} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCity}
                    disabled={!location.province || loadingCities}
                    className="w-full h-12 justify-between bg-foreground/5 border-foreground/5 rounded-xl text-foreground hover:bg-foreground/[0.08] hover:text-foreground transition-all duration-300 font-body text-xs px-4 disabled:opacity-30"
                >
                    <div className="flex items-center gap-3">
                        <MapPin className={cn("w-4 h-4 transition-colors", location.city ? "text-primary" : "text-foreground/20")} />
                        <span className={cn(location.city ? "opacity-100" : "opacity-40")}>
                            {loadingCities ? "Memuat..." : (location.city || (location.province ? "Cari Kota..." : "Pilih Provinsi Dulu"))}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-20" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-background/95 backdrop-blur-3xl border-foreground/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Cari kabupaten/kota..." className="h-11 font-body" />
                    <CommandList className="max-h-[300px] scrollbar-hide">
                        <CommandEmpty className="py-6 text-center text-xs text-foreground/40">Kota tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {cities?.map((c) => (
                                <CommandItem
                                    key={c}
                                    value={c}
                                    onSelect={(currentValue) => {
                                        saveLocation(location.province, currentValue);
                                        setOpenCity(false);
                                    }}
                                    className="py-3 px-4 flex items-center justify-between text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                >
                                    {c}
                                    <Check
                                        className={cn(
                                            "mr-2 h-3.5 w-3.5 text-primary transition-opacity",
                                            location.city === c ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    if (type === "province") return renderProvince();
    if (type === "city") return renderCity();

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">{renderProvince()}</div>
            <div className="flex-1">{renderCity()}</div>
        </div>
    );
}
