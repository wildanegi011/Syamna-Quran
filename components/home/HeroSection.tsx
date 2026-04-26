"use client";
import React from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, ChevronRight, Play, LogIn, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const router = useRouter();
  const { user, signInWithGoogle, loading } = useAuth();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };


  return (
    <header className="text-center relative max-w-5xl w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y }}
        className="flex flex-col items-center space-y-6 md:space-y-10"
      >
        {/* Brand Identity (Secondary) */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#00df9a]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative inline-flex items-center gap-3 px-3 md:px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:bg-white/[0.05] hover:border-[#00df9a]/30">
              <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#00df9a]/20 ring-1 ring-[#00df9a]/40">
                <Sparkles className="w-2 md:w-2.5 h-2 md:h-2.5 text-[#00df9a]" />
              </div>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#00df9a]">
                Platform Al-Quran Digital Terlengkap
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Headline (Primary) */}
        <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
          <div className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-[#00df9a]/5 blur-[120px] rounded-full pointer-events-none" />
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-white select-none">
              Al-Qur’an Digital
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00df9a] via-[#34d399] to-[#00df9a] bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_30px_rgba(0,223,154,0.2)]">
                Terpadu.
              </span>
            </h1>

          </div>

          <h2 className="text-base sm:text-lg md:text-2xl font-bold tracking-[0.05em] text-white/50 leading-relaxed max-w-4xl mx-auto">
            Baca, dengarkan, dan hafalkan Al-Qur’an dalam satu aplikasi.
          </h2>
        </motion.div>

        {/* Hard-hitting Description */}
        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-base sm:text-lg md:text-2xl text-white/40 font-medium leading-[1.6] px-6 sm:px-0">
          Tilawah harian, tafsir mendalam, dan hafalan interaktif —
          <span className="text-white/70"> semua dalam satu platform modern. </span>
        </motion.p>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-6 md:gap-8 pt-4 w-full">
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full justify-center px-6 sm:px-0">
            <Button
              size="lg"
              onClick={() => router.push('/quran')}
              className="h-14 md:h-16 px-10 md:px-12 rounded-2xl bg-[#00df9a] hover:bg-[#00df9a] text-black font-black text-sm md:text-xl gap-4 shadow-[0_20px_40px_rgba(0,223,154,0.2)] transition-all hover:scale-105 active:scale-95 group/main-cta w-full sm:w-auto"
            >
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
              Mulai Membaca
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            {user ? (
              <button
                onClick={() => router.push('/quran')}
                className="group flex items-center gap-4 text-white/50 hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px] md:text-xs"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/[0.08] group-hover:border-[#00df9a]/40 group-hover:scale-110">
                  <Play className="w-5 h-5 fill-current md:w-6 md:h-6 text-[#00df9a]" />
                </div>
                Kembali ke Dashboard
              </button>
            ) : null}
            {false && !user && (
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="group flex items-center gap-4 text-white/50 hover:text-white transition-all font-bold text-xs md:text-sm"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#00df9a]/10 group-hover:border-[#00df9a]/40 group-hover:scale-110">
                  <LogIn className="w-5 h-5 md:w-6 md:h-6 text-[#00df9a]" />
                </div>
                <div className="flex flex-col items-center leading-tight text-center">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Sudah punya akun?</span>
                  <span className="uppercase tracking-wider">Masuk Sekarang</span>
                </div>

              </button>
            )}
          </motion.div>

        </div>

      </motion.div>
    </header>
  );
}
