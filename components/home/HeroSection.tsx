"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, Sparkles } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  return (
    <header className="text-center space-y-8 max-w-4xl w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-4 md:space-y-6"
      >
        {/* Header Badge */}
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl">
            <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
              TEMAN PERJALANAN SPIRITUAL ANDA
            </span>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Syamna <span className="text-[#00df9a] drop-shadow-[0_0_15px_rgba(0,223,154,0.3)]">Quran</span>
          </h1>
          <h2 className="text-lg md:text-3xl font-medium tracking-tight text-white/50 uppercase tracking-[0.2em]">
            Cahaya di Setiap Ayat
          </h2>
        </div>

        <p className="max-w-2xl mx-auto text-base md:text-xl text-white/50 font-medium leading-relaxed">
          Baca, pahami, dan hafal Al-Quran — kapan saja, di mana saja,
          dengan fitur spiritual terlengkap.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/quran')}
            className="h-12 md:h-14 px-8 md:px-10 rounded-xl bg-[#00df9a] hover:bg-[#00c88a] text-white font-black text-base md:text-lg gap-3 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Mulai membaca
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 md:h-14 px-8 md:px-10 rounded-xl bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold text-base md:text-lg transition-all"
          >
            Pelajari fitur
          </Button>
        </div>
      </motion.div>
    </header>
  );
}
