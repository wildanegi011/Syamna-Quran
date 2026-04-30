"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CompletionViewProps {
    levelId: number;
    onRepeat: () => void;
}

export function CompletionView({ levelId, onRepeat }: CompletionViewProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-foreground/[0.03] backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] p-12 md:p-24 text-center border border-foreground/10 shadow-2xl max-w-sm md:max-w-2xl mx-auto relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-4 bg-linear-to-r from-primary/30 via-primary to-primary/30" />
            <div className="mb-10 md:mb-16 inline-flex items-center justify-center w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[3.5rem] bg-primary text-primary-foreground shadow-[0_30px_60px_rgba(var(--primary),0.4)] rotate-6 hover:rotate-0 transition-all duration-700">
                <CheckCircle2 className="w-14 h-14 md:w-24 md:h-24" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter">Maa Syaa Allah! 🌟</h2>
            <p className="text-muted-foreground text-lg md:text-2xl mb-10 md:mb-16 font-semibold px-6 opacity-70 leading-relaxed italic">
                Pelajaran di Iqro {levelId} telah selesai dengan sangat baik. Mari lanjutkan perjuanganmu!
            </p>
            <div className="grid grid-cols-1 gap-4 md:gap-6 max-w-sm mx-auto">
                <Button className="rounded-full h-14 md:h-18 shadow-[0_20px_40px_rgba(var(--primary),0.3)] text-lg md:text-2xl font-black tracking-tight" onClick={() => router.push('/iqro')}>
                    Pilih Level Berikutnya
                </Button>
                <Button variant="ghost" className="rounded-full h-12 md:h-16 font-black text-base md:text-lg opacity-50 hover:opacity-100 transition-opacity" onClick={onRepeat}>
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Ulangi Sesi Ini
                </Button>
            </div>
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-primary/20 rounded-full blur-[140px]" />
        </motion.div>
    );
}
