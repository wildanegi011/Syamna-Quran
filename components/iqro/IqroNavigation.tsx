"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface IqroNavigationProps {
    currentPage: number;
    totalPages: number;
    isCompleted: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export function IqroNavigation({
    currentPage,
    totalPages,
    isCompleted,
    onPrev,
    onNext
}: IqroNavigationProps) {
    const router = useRouter();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-foreground/10 pb-safe">
            <div className="max-w-5xl mx-auto px-4 py-4 md:px-8 md:py-6 flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-2xl h-12 w-12 md:h-16 md:w-16 bg-muted/50 hover:bg-muted transition-all group border border-transparent hover:border-foreground/20"
                    disabled={currentPage === 1 || isCompleted}
                    onClick={onPrev}
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </Button>

                <Button
                    size="lg"
                    className="rounded-2xl h-12 md:h-16 flex-1 max-w-md text-base md:text-xl font-black shadow-lg hover:shadow-primary/25 group tracking-tight relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
                    onClick={onNext}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isCompleted ? "Pilih Level Baru" : (currentPage === totalPages ? "Selesaikan Sesi" : "Lanjut Halaman")}
                        {!isCompleted && <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />}
                    </div>
                    {/* Premium shimmer effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                </Button>

                <div className="hidden sm:flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl border border-foreground/5">
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">HLM</span>
                    <span className="text-xs md:text-sm font-black text-primary">{currentPage}</span>
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground/40">/ {totalPages}</span>
                </div>
            </div>
        </footer>
    );
}
