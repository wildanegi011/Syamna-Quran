"use client";

import { useAppModules } from "@/hooks/use-modules";

import { HomeBackground } from "@/components/home/HomeBackground";
import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { StorySection } from "@/components/home/StorySection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {

  return (
    <main className="min-h-screen w-full relative bg-background text-foreground font-sans selection:bg-[#00df9a]/30 overflow-y-auto scroll-smooth snap-y snap-mandatory custom-scrollbar">
      <HomeBackground />
      <Navbar />

      {/* Page 1: Hero */}
      <section className="relative h-screen min-h-[600px] w-full flex flex-col items-center justify-center snap-start px-4 sm:px-6">
        <HeroSection />
        
        {/* Subtle Scroll Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 animate-pulse hidden md:flex">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Page 2: Features */}
      <section id="features" className="relative min-h-screen w-full flex flex-col items-center justify-center snap-start py-12 md:py-20 overflow-hidden">
        <FeatureSection />
      </section>

      {/* Page 3: Story + Footer */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center snap-start px-4 sm:px-6 pt-24 md:pt-32 pb-12">
        <div className="flex-1 flex items-center justify-center w-full py-12">
          <StorySection />
        </div>
        
        <div className="w-full mt-12">
          <HomeFooter />
        </div>
      </section>
    </main>
  );
}


