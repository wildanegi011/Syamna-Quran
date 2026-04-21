"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import Image from "next/image";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
          <Image
            src="/logos/white.png"
            alt="Syamna Quran Logo"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xl font-black text-white">Syamna <span className="text-[#00df9a]">Quran</span></span>
      </div>

      <div className="flex items-center gap-8">
        <Link href="#fitur" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Fitur</Link>
        <Link href="#tentang" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Tentang</Link>
        <Button variant="outline" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-10 px-6">
          Masuk
        </Button>
      </div>
    </motion.nav>
  );
}
