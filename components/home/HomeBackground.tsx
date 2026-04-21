"use client";
import React from "react";
import Image from "next/image";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { motion, useScroll, useTransform } from "framer-motion";

export function HomeBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden">
      {/* Immersive Background Layers */}
      
      {/* Layer 1: Animated Nebula (Fastest) */}
      <motion.div
         style={{ y: y1 }}
         className="absolute inset-0 z-0"
      >
        <Image
          src="/images/nebula-bg.png"
          alt="Syamna Nebula"
          fill
          className="object-cover opacity-[0.12] scale-125 pointer-events-none"
          priority
        />
      </motion.div>

      {/* Layer 2: Moving Grid (Perspective) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
          }}
        />
      </div>

      {/* Layer 3: Star Field (Slowest) */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <div className="absolute inset-0 opacity-[0.15]"
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
               backgroundSize: '120px 120px'
             }}
        />
      </motion.div>

      {/* Layer 4: Global Ambient Glows */}
      <AmbientBackground variant="equran" className="fixed inset-0 z-30 opacity-40 mix-blend-screen" />

      {/* Final Vignette Finish */}
      <div className="absolute inset-0 z-40 bg-radial-gradient(circle at 50% 50%, transparent 20%, #020617 100%) pointer-events-none" />
      <div className="absolute inset-0 z-40 bg-gradient-to-b from-[#020617]/40 via-transparent to-[#020617] pointer-events-none" />


    </div>
  );
}

