"use client";

import { useRouter } from "next/navigation";
import { FeatureCard } from "@/components/home/FeatureCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AppModule } from "@/lib/types";

interface FeatureGridProps {
  modules: AppModule[];
  isLoading: boolean;
}

export function FeatureGrid({ modules, isLoading }: FeatureGridProps) {
  const router = useRouter();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton 
              key={idx} 
              className="w-full aspect-square rounded-[2.5rem] bg-white/5 border border-white/10" 
            />
          ))
        ) : (
          modules.map((module, idx) => (
            <FeatureCard
              key={module.id}
              {...module}
              delay={0.1 + (idx * 0.05)}
              onClick={() => module.href !== '#' ? router.push(module.href) : null}
              className="w-full h-full"
            />
          ))
        )}
      </div>
    </section>
  );
}
