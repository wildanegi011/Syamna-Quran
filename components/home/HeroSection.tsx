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
            <div className="relative inline-flex items-center gap-3 px-3 md:px-4 py-2 rounded-full bg-foreground/[0.03] border border-foreground/10 backdrop-blur-xl shadow-2xl transition-all hover:bg-foreground/[0.05] hover:border-primary/30">
              <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/20 ring-1 ring-primary/40">
                <Sparkles className="w-2 md:w-2.5 h-2 md:h-2.5 text-primary" />
              </div>
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary">
                Bersama Al-Qur'an Setiap Hari
              </span>
            </div>
          </div>
        </motion.div>

        {/* Hero Headline (Primary) */}
        <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
          <div className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[140%] h-[120%] bg-[#00df9a]/5 blur-[120px] rounded-full pointer-events-none" />
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] md:leading-[1] text-foreground select-none">
              Syamna Quran,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_30px_rgba(0,223,154,0.2)]">
                Teman Ibadahmu.
              </span>
            </h1>

          </div>

          <h2 className="text-base sm:text-xl md:text-2xl font-medium tracking-tight text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            Pendamping ibadah digital untuk tilawah harian, tadabbur tafsir, hingga memantau progres hafalanmu secara cerdas.
          </h2>
        </motion.div>

        {/* Hard-hitting Description */}
        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-foreground/60 dark:text-foreground/40 font-medium leading-[1.6] px-6 sm:px-0">
          Dirancang untuk muslim modern yang ingin tetap
          <span className="text-foreground/80 dark:text-foreground/60"> terhubung dengan wahyu Allah </span>
          di tengah hiruk pikuk kehidupan dunia.
        </motion.p>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-6 md:gap-8 pt-4 w-full">
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full justify-center px-6 sm:px-0">
            <Button
              size="lg"
              onClick={() => router.push('/quran')}
              className="h-14 md:h-16 px-10 md:px-12 rounded-2xl bg-primary hover:bg-primary text-primary-foreground font-black text-sm md:text-xl gap-4 shadow-[0_20px_40px_rgba(0,223,154,0.2)] transition-all hover:scale-[1.03] active:scale-95 group/main-cta w-full sm:w-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/main-cta:translate-y-0 transition-transform duration-500" />
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12 relative z-10" />
              <span className="relative z-10 text-primary-foreground">Mulai Tilawah</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 relative z-10" />
            </Button>

            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-4 text-foreground/50 hover:text-foreground transition-all font-bold text-xs md:text-sm"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:border-primary/40 group-hover:scale-110">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="flex flex-col items-center leading-tight text-center">
                <span className="uppercase tracking-wider">Jelajahi Fitur</span>
              </div>
            </button>
          </motion.div>

        </div>

      </motion.div>
    </header>
  );
}
