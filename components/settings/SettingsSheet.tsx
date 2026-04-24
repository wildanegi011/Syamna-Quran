"use client";

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { SettingsContent } from './SettingsContent';

interface SettingsSheetProps {
    children: React.ReactNode;
}

export function SettingsSheet({ children }: SettingsSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-full sm:max-w-md bg-[#0d0f14] border-white/5 p-0 flex flex-col shadow-2xl h-dvh fixed outline-none"
            >
                <SheetHeader className="p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-white/60">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold text-white tracking-tight">Pengaturan</SheetTitle>
                            <SheetDescription className="text-[10px] text-white/30 uppercase font-black tracking-widest">Syamna Quran Settings</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 min-h-0 overscroll-contain">
                    <SettingsContent />
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] shrink-0 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10">
                        v0.1.0
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
