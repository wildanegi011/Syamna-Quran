"use client";
import React from "react";
import Image from "next/image";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, useScroll, useTransform } from "framer-motion";

export function HomeBackground() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * 40,
        y: (e.clientY / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-background overflow-hidden transition-colors duration-500">
      {/* Immersive Background Layers */}
      
      {/* Layer 1: Animated Nebula (Fastest) */}
      <motion.div
         animate={{ 
           x: mousePos.x * 0.5,
           y: y1.get() + (mousePos.y * 0.5)
         }}
         className="absolute inset-0 z-0"
      >
        <Image
          src="/images/nebula-bg.png"
          alt="Syamna Nebula"
          fill
          className={cn(
            "object-cover scale-125 pointer-events-none transition-opacity duration-1000",
            mounted ? (theme === 'dark' ? "opacity-[0.25]" : "opacity-[0.08]") : "opacity-[0.25]"
          )}
          priority
        />
      </motion.div>

      {/* Layer 2: Moving Grid (Perspective) */}
      <motion.div 
        animate={{ 
          x: mousePos.x * 0.2,
          y: mousePos.y * 0.2
        }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }}
        />
      </motion.div>

      {/* Layer 3: Star Field (Slowest) */}
      <motion.div 
        animate={{ 
          x: mousePos.x * 1,
          y: y2.get() + (mousePos.y * 1)
        }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                mounted ? (theme === 'dark' ? "opacity-[0.3]" : "opacity-[0.1]") : "opacity-[0.3]"
              )}
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
               backgroundSize: '120px 120px'
             }}
        />
      </motion.div>

      {/* Layer 4: Global Ambient Glows */}
      <AmbientBackground variant="equran" className={cn(
        "fixed inset-0 z-30 transition-opacity duration-1000 mix-blend-screen",
        mounted ? (theme === 'dark' ? "opacity-40" : "opacity-10") : "opacity-40"
      )} />

      {/* Final Vignette Finish */}
      <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,var(--background)_100%)] pointer-events-none" />
      <div className="absolute inset-0 z-40 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />


    </div>
  );
}

