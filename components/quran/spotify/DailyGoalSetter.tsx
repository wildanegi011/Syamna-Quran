"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Sparkles, LogIn, ChevronRight, Heart, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useReadingProgress } from '@/contexts/ReadingProgressContext';

interface DailyGoalSetterProps {
    onGoalSet?: (goal: number) => void;
}

const GOALS = [
    { id: 'santai', label: 'Santai', verses: 1, icon: '🌱', sub: 'Pelan asal konsisten' },
    { id: 'biasa', label: 'Biasa', verses: 5, icon: '🚶', sub: 'Langkah yang mantap' },
    { id: 'serius', label: 'Serius', verses: 10, icon: '🔥', sub: 'Target ideal harian' },
    { id: 'intens', label: 'Intens', verses: 20, icon: '⚡', sub: 'Maksimal keberkahan' },
];

export function DailyGoalSetter({ onGoalSet }: DailyGoalSetterProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
    const [step, setStep] = useState(1); // 1: Pick Goal, 2: Login Proposal/Success
    const pathname = usePathname();
    const { user, signInWithGoogle, loading: authLoading } = useAuth();
    const { setDailyGoal } = useReadingProgress();

    useEffect(() => {
        if (pathname.includes('/quran') && user) {
            const saved = localStorage.getItem('syamna_daily_goal');
            if (!saved) setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [pathname, user]);

    const handlePickGoal = (verses: number) => {
        setSelectedGoal(verses);
        setDailyGoal(verses);
        setStep(2);

        if (user) {
            setTimeout(() => {
                setIsVisible(false);
                if (onGoalSet) onGoalSet(verses);
            }, 2500);
        }
    };

    const handleFinish = () => {
        setIsVisible(false);
        if (onGoalSet && selectedGoal) onGoalSet(selectedGoal);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
                {/* Immersive Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-2xl"
                />

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-[400px] bg-card/80 border border-foreground/10 rounded-[42px] p-8 md:p-10 shadow-2xl overflow-hidden"
                >
                    {/* Decorative Gradient Glows */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 blur-[80px] rounded-full -ml-20 -mb-20" />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Back Button */}
                        <AnimatePresence>
                            {step > 1 && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={() => setStep(1)}
                                    className="absolute -top-2 left-0 p-3 rounded-2xl bg-foreground/[0.03] border border-foreground/5 text-foreground/30 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all active:scale-90 z-20 group"
                                    title="Kembali"
                                >
                                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full space-y-8"
                                >
                                    <div className="text-center space-y-3">
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xl font-black uppercase text-primary tracking-tight block mb-2"
                                        >
                                            Assalamu'alaikum
                                        </motion.span>
                                        {/* <h2 className="text-2xl font-black text-foreground tracking-tight leading-none uppercase">Mau khatam berapa ayat hari ini?</h2> */}
                                        <p className="text-xs text-foreground/40 font-medium leading-relaxed px-4">
                                            Biar istiqomah, yuk pilih target harianmu. Pelan-pelan saja yang penting konsisten ya! ✨
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        {GOALS.map((goal, idx) => (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 + 0.3 }}
                                                key={goal.id}
                                                onClick={() => handlePickGoal(goal.verses)}
                                                className="group relative flex items-center justify-between p-5 rounded-[24px] bg-foreground/[0.02] border border-foreground/5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 active:scale-95"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                                                        {goal.icon}
                                                    </div>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-sm font-black text-foreground uppercase tracking-widest">{goal.label}</span>
                                                        <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-tight">{goal.sub}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-primary uppercase">{goal.verses}</span>
                                                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Ayat</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full text-center space-y-8 pt-2"
                                >
                                    <div className="space-y-4">
                                        <div className="relative inline-flex">
                                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <Heart className="w-10 h-10 text-primary fill-primary/20" />
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full bg-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Alhamdulillah!</h2>
                                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                                                Target <span className="text-primary">{selectedGoal} Ayat</span> per hari sudah siap.
                                            </p>
                                        </div>
                                    </div>

                                    {!user ? (
                                        <div className="space-y-6 pt-2">
                                            <div className="bg-primary/5 border border-primary/10 rounded-[30px] p-6 space-y-4">
                                                <p className="text-[11px] text-foreground/60 font-medium leading-relaxed">
                                                    Biar pencapaianmu tersimpan rapi dan istiqomahmu terjaga, yuk sambungkan akunmu! 🚀
                                                </p>
                                                <button
                                                    onClick={signInWithGoogle}
                                                    disabled={authLoading}
                                                    className="w-full h-14 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all group"
                                                >
                                                    <LogIn className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                    Masuk via Google
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleFinish}
                                                className="flex items-center justify-center gap-2 mx-auto text-[9px] font-black text-foreground/20 uppercase tracking-[0.3em] hover:text-primary transition-all group"
                                            >
                                                Nanti saja, langsung baca dulu
                                                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-10 space-y-4"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                                <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Menyiapkan Mushaf...</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Aesthetic Progress Dots */}
                        <div className="flex gap-2.5 mt-10">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-700",
                                        s === step ? "w-10 bg-primary" : "w-2 bg-foreground/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
