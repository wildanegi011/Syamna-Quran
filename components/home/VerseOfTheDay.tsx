"use client";

import { motion } from "framer-motion";

export function VerseOfTheDay() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-6xl mx-auto px-6 text-center my-0"
        >
            <div className="relative overflow-hidden bg-card/60 border-l-4 border-primary p-8 md:p-12 rounded-r-[2rem] text-left">
                <p className="font-baskerville italic text-xl md:text-3xl text-foreground/70 leading-relaxed tracking-wide mb-6">
                    &ldquo; Hai orang-orang yang beriman, sukakah kamu Aku tunjukkan suatu perdagangan yang dapat menyelamatkan kamu dari azab yang pedih? &rdquo;
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-xs md:text-sm font-bold text-foreground/20 uppercase tracking-[0.3em]">
                        QS. As-Saff: 10
                    </span>
                </div>
            </div>
        </motion.section>
    );
}
