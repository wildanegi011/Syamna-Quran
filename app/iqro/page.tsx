"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleHero } from "@/components/shared/ModuleHero";
import { ModuleFooter } from "@/components/shared/ModuleFooter";

import { useIqroLevels } from "@/hooks/use-iqro";

export default function IqroSelectionPage() {
    const router = useRouter();

    const { data: levels = [], isLoading } = useIqroLevels();

    return (
        <div className="flex-1 flex flex-col min-h-full pb-32">
            <ModuleHero
                title={<>Metode <span className="text-primary">Iqro</span></>}
                subtitle="Langkah awal menuju kefasihan. Mulailah perjalanan Anda mengenal huruf-huruf langit dengan metode yang teruji dan mudah dipahami."
                backgroundImage="/backgrounds/quran_hero.png"
            />

            <main className="max-w-7xl mx-auto w-full px-6 md:px-12 -mt-10 z-20 space-y-12">
                {/* Intro Card - Featured Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-3xl border border-white/[0.05] rounded-[1.25rem] p-6 md:p-8 shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden group/intro"
                    onClick={() => router.push('/iqro/intro')}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 relative z-10">
                        <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto">
                            <div className="w-[64px] h-[64px] rounded-2xl bg-primary flex items-center justify-center text-black shadow-xl group-hover/intro:scale-110 group-hover/intro:rotate-3 transition-all duration-500">
                                <GraduationCap className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-1.5 tracking-tight group-hover/intro:text-primary transition-colors">Perkenalan Hijaiyah</h3>
                                <p className="text-white/40 text-[11px] md:text-sm italic font-body">Pelajari dasar-dasar makhorijul huruf sebelum mulai belajar Iqro.</p>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            className="bg-white/10 hover:bg-primary hover:text-black text-white border border-white/10 rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-base font-bold tracking-tight transition-all"
                        >
                            Mulai Belajar
                        </Button>
                    </div>
                </motion.div>

                {/* Level Selection Grid */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h3 className="text-[10px] md:text-xs font-headline font-black uppercase tracking-[0.4em] text-on-surface/40">Level Pembelajaran</h3>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <Skeleton key={idx} className="h-32 md:h-40 rounded-[2.5rem] bg-white/5" />
                            ))
                        ) : (
                            levels.map((level, idx) => (
                                <motion.div
                                    key={level.level_number}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (idx * 0.05) + 0.2 }}
                                    className={cn(
                                        "group relative flex flex-col p-6 h-[170px] transition-all duration-500 overflow-hidden border bg-white/[0.03] backdrop-blur-3xl rounded-[1.25rem] cursor-pointer",
                                        level.is_disabled
                                            ? "opacity-40 grayscale border-white/[0.05]"
                                            : "border-white/[0.05] hover:border-white/10 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                                    )}
                                    onClick={() => !level.is_disabled && router.push(`/iqro/${level.level_number}`)}
                                >
                                    <div className="relative z-10 flex flex-col justify-between w-full h-full">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="flex items-center gap-4 min-w-0">
                                                {/* Number / Lock Badge */}
                                                <div className={cn(
                                                    "w-[48px] h-[48px] text-xl rounded-2xl flex items-center justify-center font-black shadow-xl shrink-0 transition-all duration-500",
                                                    !level.is_disabled && "group-hover:rotate-6 group-hover:scale-110",
                                                    level.is_disabled ? "bg-white/10 text-white/20" : level.color
                                                )}
                                                    style={{ color: level.is_disabled ? undefined : 'white' }}
                                                >
                                                    {level.is_disabled ? <Lock className="w-5 h-5 opacity-30" /> : level.level_number}
                                                </div>

                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={cn(
                                                            "text-xl font-bold tracking-tight transition-colors truncate",
                                                            !level.is_disabled ? "text-white group-hover:text-primary" : "text-white/40"
                                                        )}>{level.title}</h3>
                                                        {level.is_disabled && (
                                                            <span className="text-[8px] font-bold uppercase tracking-widest bg-white/5 text-white/20 px-2 py-0.5 rounded-full">Soon</span>
                                                        )}
                                                    </div>
                                                    <p className="text-white/40 text-xs italic truncate mt-0.5">{level.description}</p>
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 transition-all duration-300",
                                                !level.is_disabled && "group-hover:bg-primary group-hover:text-black group-hover:scale-110"
                                            )}>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>

                                        {/* Bottom indicator or additional text could go here */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Tahap {level.level_number}</span>
                                            {!level.is_disabled && (
                                                <div className="flex items-center gap-1.5 text-primary/0 group-hover:text-primary/60 transition-all duration-500">
                                                    <span className="text-[9px] font-bold uppercase tracking-tight">Pelajari</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subtly animated background glow */}
                                    <div className={cn(
                                        "absolute -bottom-16 -right-16 w-32 h-32 rounded-full blur-3xl transition-all duration-500",
                                        level.is_disabled ? "bg-white/5" : "bg-primary/5 group-hover:bg-primary/10"
                                    )} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <ModuleFooter />
        </div>
    );
}
