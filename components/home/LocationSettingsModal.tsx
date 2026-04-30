"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, RotateCw, Check } from "lucide-react";
import { useProvinces, useCities, useSelectedLocation } from "@/hooks/use-prayer";
import { cn } from "@/lib/utils";

export function LocationSettingsModal() {
    const { location, saveLocation, detectLocation, isDetecting } = useSelectedLocation();
    const [open, setOpen] = useState(false);
    
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
    const { data: cities = [], isLoading: loadingCities } = useCities(selectedProvince);

    // Sync from current location when modal opens
    useEffect(() => {
        if (open && location) {
            setSelectedProvince(location.province);
            setSelectedCity(location.city);
        }
    }, [open, location]);

    const handleSave = () => {
        if (selectedProvince && selectedCity) {
            saveLocation(selectedProvince, selectedCity, 'manual');
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 gap-2 bg-foreground/5 border-foreground/10 hover:bg-foreground/10 text-foreground/60 hover:text-foreground rounded-xl backdrop-blur-xl transition-all"
                >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold truncate max-w-[120px]">
                        {location?.city || "Pilih Lokasi"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/90 backdrop-blur-2xl border-foreground/10 text-foreground rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight">Pengaturan Lokasi</DialogTitle>
                    <DialogDescription className="text-foreground/40">
                        Pilih lokasi secara manual atau gunakan deteksi otomatis.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <Button
                        variant="secondary"
                        onClick={() => detectLocation()}
                        disabled={isDetecting}
                        className="h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-500 font-bold gap-3 transition-all"
                    >
                        <RotateCw className={cn("w-4 h-4", isDetecting && "animate-spin")} />
                        {isDetecting ? "Mendeteksi..." : "Gunakan Lokasi Saat Ini"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-foreground/5" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-foreground/20 font-bold tracking-widest">Atau Manual</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] pl-1">Provinsi</label>
                            <Select 
                                value={selectedProvince || ""} 
                                onValueChange={(v) => {
                                    setSelectedProvince(v);
                                    setSelectedCity(null);
                                }}
                            >
                                <SelectTrigger className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl text-foreground font-medium focus:ring-primary/30">
                                    <SelectValue placeholder="Pilih Provinsi" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-foreground/10 text-foreground rounded-xl">
                                    {provinces.map((p) => (
                                        <SelectItem key={p} value={p} className="focus:bg-foreground/10 focus:text-foreground">
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] pl-1">Kabupaten / Kota</label>
                            <Select 
                                value={selectedCity || ""} 
                                onValueChange={setSelectedCity}
                                disabled={!selectedProvince}
                            >
                                <SelectTrigger className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl text-foreground font-medium focus:ring-primary/30">
                                    <SelectValue placeholder={selectedProvince ? "Pilih Kota" : "Pilih Provinsi Terlebih Dahulu"} />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-foreground/10 text-foreground rounded-xl">
                                    {cities.map((c) => (
                                        <SelectItem key={c} value={c} className="focus:bg-foreground/10 focus:text-foreground">

                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => setOpen(false)}
                        className="rounded-xl hover:bg-foreground/5 text-foreground/60"
                    >
                        Batal
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={!selectedProvince || !selectedCity}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 rounded-xl gap-2 shadow-lg shadow-primary/20"
                    >
                        <Check className="w-4 h-4" />
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
