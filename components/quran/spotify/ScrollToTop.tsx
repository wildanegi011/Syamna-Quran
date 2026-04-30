"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tombol scroll ke atas yang muncul otomatis saat user sudah scroll jauh.
 * Mencari scroll container terdekat (<main> di SpotifyLayout).
 */
export function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

    // Cari scroll container saat mount
    useEffect(() => {
        // Cari <main> yang punya overflow-y-auto
        const main = document.querySelector("main");
        if (main) {
            setScrollContainer(main);
        }
    }, []);

    // Pantau scroll position
    useEffect(() => {
        if (!scrollContainer) return;

        const handleScroll = () => {
            setVisible(scrollContainer.scrollTop > 600);
        };

        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [scrollContainer]);

    const handleClick = useCallback(() => {
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [scrollContainer]);

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label="Scroll ke atas"
            className={cn(
                "fixed bottom-28 md:bottom-8 right-6 z-50 w-12 h-12 rounded-full",
                "bg-primary text-primary-foreground shadow-2xl",
                "flex items-center justify-center",
                "hover:scale-110 active:scale-95 transition-all duration-300",
                "border border-foreground/10",
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            <ChevronUp className="w-6 h-6" />
        </button>
    );
}
