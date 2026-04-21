"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ModuleFooterProps {
    className?: string;
}

export function ModuleFooter({ className }: ModuleFooterProps) {
    return (
        <footer className={cn("w-full px-8 md:px-12 mt-32 py-10 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6", className)}>
            <p className="text-xs text-on-surface/30 font-label font-bold uppercase tracking-widest">
                © 2026 Al-Qur'an Sanctuary Experience
            </p>
            <div className="flex items-center gap-8 text-[10px] font-label font-bold uppercase tracking-widest text-on-surface/30">
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
        </footer>
    );
}
