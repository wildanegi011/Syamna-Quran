"use client";

import { useAppModules } from "@/hooks/use-modules";

import { HomeBackground } from "@/components/home/HomeBackground";
import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {

  return (
    <main className="min-h-screen w-full relative flex flex-col items-center justify-between text-white bg-[#020617] font-sans selection:bg-[#00df9a]/30 overflow-x-hidden">
      <HomeBackground />
      <Navbar />

      {/* Hero Section Container - Centered in viewport */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6">
        <HeroSection />
      </div>

      {/* Footer - Positioned to not interfere with vertical center */}
      <div className="absolute bottom-8 md:bottom-12 z-30 w-full flex justify-center">
        <HomeFooter />
      </div>

    </main>
  );
}


