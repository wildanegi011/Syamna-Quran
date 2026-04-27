"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppModules } from "@/hooks/use-modules";
import { 
  Moon, 
  BookText, 
  HandHelping, 
  Sparkles, 
  Clock, 
  Zap,
  Star
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  "Moon": Moon,
  "BookText": BookText,
  "HandHelping": HandHelping,
  "Sparkles": Sparkles,
  "Clock": Clock,
};

export function FeatureSection() {
  const { data: modules = [] } = useAppModules();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div id="features" className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-10 md:mb-16">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2"
        >
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Fitur Unggulan</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight"
        >
          Satu Aplikasi untuk <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
            Segala Kebutuhan Ibadahmu.
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-foreground/60 dark:text-foreground/40 max-w-2xl text-sm md:text-lg font-medium leading-relaxed"
        >
          Dirancang dengan antarmuka modern yang tenang, 
          menghadirkan pengalaman ibadah digital kelas premium.
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {Array.isArray(modules) && modules.map((module) => {
          const Icon = iconMap[module.icon] || Sparkles;
          return (
            <motion.div
              key={module.id}
              variants={itemVariants}
              className="group relative"
            >
              <Link href={module.href} className="block h-full">
                <div className="relative h-full p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-foreground/[0.02] border border-foreground/5 backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:bg-foreground/[0.05] hover:border-primary/20 hover:-translate-y-2 flex flex-col group">
                  {/* Background Image Texture */}
                  <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-700 bg-cover bg-center mix-blend-overlay" 
                       style={{ 
                         backgroundImage: `url(${
                           module.id === 1 ? '/features/quran.png' :
                           module.id === 2 ? '/features/hadits.png' :
                           module.id === 3 ? '/features/doa.png' :
                           module.id === 4 ? '/features/asmaul_husna.png' :
                           module.id === 5 ? '/features/sholat.png' :
                           '/feature-bg.png'
                         })` 
                       }} />
                  
                  {/* Decorative Gradient Background */}
                  <div className={cn(
                    "absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                    module.color || "bg-primary"
                  )} />
                  
                  {/* Icon Container */}
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    module.id === 1 ? "bg-primary/10 border border-primary/20" : "bg-foreground/5 border border-foreground/10"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6 md:w-8 md:h-8 transition-colors duration-500",
                      module.id === 1 ? "text-primary" : "text-foreground/40 group-hover:text-primary"
                    )} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-foreground/60 dark:text-foreground/40 leading-relaxed text-xs md:text-sm font-medium">
                      {module.description}
                    </p>
                  </div>
                  
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Placeholder for more features teaser */}
        <motion.div
          variants={itemVariants}
          className="group relative"
        >
          <div className="relative h-full p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 backdrop-blur-3xl overflow-hidden flex flex-col justify-center items-center text-center py-16">
            {/* Background Image Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-cover bg-center mix-blend-overlay" 
                 style={{ backgroundImage: 'url("/feature-bg.png")' }} />
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-6 animate-bounce">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-foreground/50">Lainnya...</h3>
            <p className="text-foreground/30 text-xs mt-2 uppercase tracking-widest">Akan Segera Hadir</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
