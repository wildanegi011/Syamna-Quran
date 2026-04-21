"use client";

import { motion } from "framer-motion";
import { ArrowRight, Moon, BookText, HandHelping, Sparkles, Clock, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
    "Moon": Moon,
    "BookText": BookText,
    "HandHelping": HandHelping,
    "Sparkles": Sparkles,
    "Clock": Clock,
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    delay?: number;
    onClick: () => void;
    className?: string;
}

export function FeatureCard({ title, description, icon, color, delay = 0, onClick, className }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay }}
            onClick={onClick}
            className={cn("group cursor-pointer relative", className)}
        >
            <div className="relative h-full bg-[#111827]/80 rounded-2xl p-5 md:p-6 border border-white/5 transition-all duration-300 flex flex-col items-center text-center hover:bg-[#111827] hover:border-[#00df9a]/20">

                {/* Icon Container - Centered */}
                <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-300",
                    "bg-[#00df9a]/5 border border-[#00df9a]/10 group-hover:bg-[#00df9a]/10 group-hover:border-[#00df9a]/30"
                )}>
                    {iconMap[icon] ? (
                        (() => {
                            const Icon = iconMap[icon];
                            return <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#00df9a]" />;
                        })()
                    ) : (
                        <span className="text-xl text-[#00df9a]">{icon}</span>
                    )}
                </div>

                {/* Text Content - Centered */}
                <div className="space-y-2 flex flex-col items-center">
                    <h3 className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-[#00df9a] transition-colors leading-tight">
                        {title}
                    </h3>
                    <p className="text-white/40 text-[10px] md:text-xs font-medium leading-relaxed max-w-[180px] opacity-100 transition-opacity">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
