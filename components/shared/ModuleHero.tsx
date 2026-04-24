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
        <section className={cn("relative h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px] w-full overflow-hidden border-b border-white/5", className)}>
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

            <div className="relative z-10 px-4 sm:px-6 md:px-12 h-full flex items-center pt-8 md:pt-16">
                <div className="flex items-center justify-between w-full gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2 md:space-y-4 max-w-2xl"
                    >
                        {/* Back Button - Top Mini */}
                        {onBack && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onBack();
                                }}
                                type="button"
                                className="mb-2 flex items-center gap-2 text-on-surface/40 hover:text-primary transition-all duration-300 group px-2 py-1 -ml-2 bg-transparent border-none cursor-pointer relative z-20 active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-headline font-black uppercase tracking-widest leading-none">Kembali</span>
                            </button>
                        )}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-black text-on-surface tracking-tighter leading-[1.1]">
                            {title}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-sm lg:text-base text-on-surface/50 font-body max-w-lg leading-relaxed italic line-clamp-2 md:line-clamp-none">
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
