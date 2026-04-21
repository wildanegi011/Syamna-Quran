"use client";

import Image from "next/image";
import { AmbientBackground } from "@/components/shared/AmbientBackground";
import { motion } from "framer-motion";

export function HomeBackground() {
  return (
    <>
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
        {/* Animated Nebula Layer */}
        <motion.div
           animate={{
             scale: [1, 1.1, 1],
             x: [0, -10, 0],
             y: [0, -10, 0],
           }}
           transition={{
             duration: 20,
             repeat: Infinity,
             ease: "easeInOut"
           }}
           className="absolute inset-0"
        >
          <Image
            src="/images/nebula-bg.png"
            alt="Syamna Nebula"
            fill
            className="object-cover opacity-[0.08] scale-110 pointer-events-none"
            priority
          />
        </motion.div>

        {/* Animated Star Field Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.1]"
               style={{
                 backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                 backgroundSize: '100px 100px'
               }}
          />
        </div>

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/0 via-[#020617]/40 to-[#020617]" />
      </div>

      <AmbientBackground variant="equran" className="fixed inset-0 z-10" />
    </>
  );
}
