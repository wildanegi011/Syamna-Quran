"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ModuleFooterProps {
    className?: string;
}

export function ModuleFooter({ className }: ModuleFooterProps) {
    return (
        <footer className={cn("w-full px-8 md:px-12 mt-4 py-4 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4", className)}>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
                © 2026 Syamna Quran
            </p>
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                <Link href="#" className="hover:text-primary transition-colors">About</Link>
            </div>
        </footer>
    );
}
