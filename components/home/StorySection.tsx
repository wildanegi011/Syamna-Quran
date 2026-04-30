"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Zap, BookOpen } from "lucide-react";

export function StorySection() {
    const stories = [
        {
            icon: Heart,
            title: "Dibuat dengan Hati",
            description: "Syamna lahir dari kegelisahan kami melihat betapa sulitnya menjaga kedekatan dengan Al-Qur'an di tengah bisingnya dunia digital.",
            color: "text-red-400",
            bg: "bg-red-400/10"
        },
        {
            icon: Zap,
            title: "Solusi Muslim Modern",
            description: "Kami mendesain ruang yang tenang, bebas distraksi, agar setiap detik interaksimu dengan firman-Nya terasa lebih berkualitas.",
            color: "text-amber-400",
            bg: "bg-amber-400/10"
        },
        {
            icon: Sparkles,
            title: "Melampaui Sekadar Baca",
            description: "Bukan hanya aplikasi, Syamna adalah pendamping yang membantumu tadabbur lebih dalam dan menghafal lebih konsisten.",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Content */}
                <div className="space-y-8 md:space-y-10 order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-3 md:space-y-4"
                    >
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Visi Kami</h2>
                        <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
                            Kenapa Kami Membangun <span className="text-primary">Syamna Quran?</span>
                        </h3>
                    </motion.div>

                    <div className="space-y-6 md:space-y-8">
                        {stories.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4 md:gap-6 group"
                            >
                                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl ${story.bg} flex items-center justify-center border border-foreground/5 group-hover:border-primary/30 transition-all duration-500`}>
                                    <story.icon className={`w-5 h-5 md:w-6 md:h-6 ${story.color}`} />
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">{story.title}</h4>
                                    <p className="text-foreground/40 leading-relaxed text-xs md:text-base">{story.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Decorative Image/Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-square order-2 lg:order-none max-w-sm mx-auto w-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[60px] md:blur-[100px] animate-pulse" />
                    <div className="relative h-full w-full rounded-[2rem] md:rounded-[3rem] border border-foreground/5 bg-foreground/[0.02] backdrop-blur-3xl overflow-hidden flex items-center justify-center p-8 md:p-12">
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                        <div className="text-center space-y-6 relative z-10">
                            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(0,223,154,0.1)]">
                                <BookOpen className="w-10 h-10 text-primary" />
                            </div>
                            <p className="text-xl md:text-2xl font-medium italic text-foreground/70 leading-relaxed">
                                "Syamna hadir bukan sebagai distraksi baru, melainkan sebagai penenang di hari-harimu."
                            </p>
                            <div className="h-px w-20 bg-primary/30 mx-auto" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Misi Kami</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
