"use client";

import { useAppModules } from "@/hooks/use-modules";
import { ScrollArea } from "@/components/ui/scroll-area";

import { HomeBackground } from "@/components/home/HomeBackground";
import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { PrayerTimesDisplay } from "@/components/home/PrayerTimesDisplay";
import { VerseOfTheDay } from "@/components/home/VerseOfTheDay";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {
  const { data: modules = [], isLoading } = useAppModules();

  return (
    <main className="h-screen w-full relative overflow-hidden flex flex-col text-white bg-[#020617] font-sans text-center">
      <HomeBackground />
      <Navbar />

      <ScrollArea className="h-full w-full relative z-20">
        <div className="flex flex-col items-center justify-center min-h-screen w-full py-20 gap-16 md:gap-16">
          {/* Hero & Features Integrated Stack */}
          <section className="relative w-full flex flex-col items-center justify-center px-6">
            <HeroSection />
          </section>

          <section className="relative w-full max-w-7xl flex flex-col items-center px-6 justify-center">
            <FeatureGrid modules={modules} isLoading={isLoading} />
            <HomeFooter />
          </section>
        </div>
      </ScrollArea>
    </main>
  );
}
