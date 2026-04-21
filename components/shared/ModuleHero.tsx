"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleHeroProps {
    title: string | React.ReactNode;
    subtitle: string;
    backgroundImage: string;
    featuredImage?: string;
    onBack?: () => void;
    className?: string;
}

export function ModuleHero({
    title,
    subtitle,
    backgroundImage,
    featuredImage,
    onBack,
    className
}: ModuleHeroProps) {
    return (
        <section className={cn("relative h-[250px] md:h-[300px] w-full overflow-hidden border-b border-white/5", className)}>
            {/* Background Image with Overlay - Sufter/Minimal for better readability */}
            <div className="absolute inset-0 z-0 bg-background">
                <Image
                    src={backgroundImage}
                    alt="Background Badge"
                    fill
                    className="object-cover opacity-35 scale-105 blur-[2px] transition-all duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/40 to-transparent" />
            </div>

            <div className="relative z-10 px-8 md:px-12 h-full flex items-center pt-16">
                <div className="flex items-center justify-between w-full gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4 max-w-2xl"
                    >
                        {/* Back Button - Top Mini */}
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="mb-2 flex items-center gap-2 text-on-surface/40 hover:text-primary transition-colors group px-0 bg-transparent border-none"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-headline font-black uppercase tracking-widest">Kembali</span>
                            </button>
                        )}
                        <h1 className="text-4xl md:text-6xl font-headline font-black text-on-surface tracking-tighter leading-[1.1]">
                            {title}
                        </h1>
                        <p className="text-sm md:text-base text-on-surface/50 font-body max-w-lg leading-relaxed italic">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* {featuredImage && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden lg:block absolute right-0 bottom-[-20%] pointer-events-none w-[450px] h-[450px]"
                        >
                            <Image
                                src={featuredImage}
                                alt="Featured"
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    )} */}
                </div>
            </div>
        </section>
    );
}
