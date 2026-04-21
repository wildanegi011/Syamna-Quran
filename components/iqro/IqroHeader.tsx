"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IqroHeaderProps {
    levelId: number;
    levelTitle?: string;
    currentPage: number;
    totalPages: number;
}

export function IqroHeader({ levelId, levelTitle, currentPage, totalPages }: IqroHeaderProps) {
    const router = useRouter();

    return (
        <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b h-16 md:h-24 flex items-center px-4 md:px-10 justify-between transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-white/50 dark:bg-white/10 hover:bg-primary/10 transition-colors border border-white/40 dark:border-white/10 shadow-lg"
                    onClick={() => router.push('/iqro')}
                >
                    <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                </Button>
                <div className="space-y-0.5 md:space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60">Pelajaran Aktif</span>
                    </div>
                    <h1 className="text-sm md:text-lg font-black tracking-tighter leading-none flex items-center gap-2 md:gap-3">
                        {levelTitle || `Iqro ${levelId}`}
                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/40" />
                        <span className="text-[10px] md:text-xs text-muted-foreground opacity-60">Halaman {currentPage} dari {totalPages}</span>
                    </h1>
                </div>
            </div>
            <div className="w-10 h-10 md:w-14" /> {/* Spacer */}
        </header>
    );
}
