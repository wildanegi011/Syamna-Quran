"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModuleGridProps {
    children: React.ReactNode;
    columnsClassName?: string;
    className?: string;
    isEmpty?: boolean;
    isLoading?: boolean;
    emptyState?: React.ReactNode;
}

export function ModuleGrid({
    children,
    columnsClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    className,
    isEmpty,
    isLoading,
    emptyState
}: ModuleGridProps) {
    if (!isLoading && isEmpty && emptyState) {
        return <div className="py-40 text-center space-y-4">{emptyState}</div>;
    }

    return (
        <main className={cn("w-full px-8 md:px-12 pb-12 md:pb-16", className)}>
            <div className={cn("grid gap-4 md:gap-5", columnsClassName)}>
                <AnimatePresence mode="popLayout">
                    {children}
                </AnimatePresence>
            </div>
        </main>
    );
}
