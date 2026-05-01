"use client";

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/constants/translations';
import { parseTajweed } from '@/lib/utils/tajweed';

export function SettingsPreview() {
    const {
        arabicFontSize,
        translationFontSize,
        showTajweed,
        showTranslation,
        showLatin,
        mushafId,
        language
    } = useSettings();

    const { t } = useTranslation(language);

    const sampleAyah = {
        teksArab: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        teksTajweed: "[h:0]قُلْ[/h] هُوَ [madda_normal]اللَّهُ[/madda_normal] [qalaqah]أَحَدٌ[/qalaqah]",
        teksLatin: "qul huwa-llāhu aḥad",
        teksIndonesia: language === 'ID' 
            ? 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."' 
            : 'Say, "He is Allah, [who is] One."'
    };

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-foreground/40 uppercase font-black tracking-[0.2em]">{t('pratinjau')}</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-foreground/5 to-transparent ml-4" />
            </div>
            
            <div className="bg-foreground/[0.03] border border-foreground/5 rounded-3xl p-8 overflow-hidden relative group transition-all duration-500 hover:border-primary/20 hover:bg-foreground/[0.04]">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 transition-all duration-700 group-hover:bg-primary/15 group-hover:scale-150" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full -ml-12 -mb-12 transition-all duration-700 group-hover:bg-primary/10 group-hover:scale-125" />
                
                <div className="relative space-y-8">
                    {/* Arabic */}
                    <div
                        className={cn(
                            [3, 6, 7].includes(mushafId) ? "font-indopak" : "font-arabic",
                            "leading-[2.5] text-right transition-all duration-300"
                        )}
                        dir="rtl"
                        style={{ fontSize: `${arabicFontSize}px` }}
                        dangerouslySetInnerHTML={{ 
                            __html: showTajweed 
                                ? parseTajweed(sampleAyah.teksTajweed) 
                                : sampleAyah.teksArab 
                        }}
                    />

                    {/* Latin & Translation */}
                    <div className="space-y-4">
                        {showLatin && (
                            <div className="space-y-1">
                                <span className="text-[9px] text-primary/40 uppercase font-bold tracking-widest">Latin</span>
                                <p className="text-xs font-bold italic text-primary/70 transition-all duration-300">
                                    {sampleAyah.teksLatin}
                                </p>
                            </div>
                        )}
                        
                        {showTranslation && (
                            <div className="space-y-1">
                                <span className="text-[9px] text-foreground/20 uppercase font-bold tracking-widest">Terjemahan</span>
                                <p 
                                    className="text-foreground/70 leading-relaxed font-medium transition-all duration-300"
                                    style={{ fontSize: `${translationFontSize}px` }}
                                >
                                    {sampleAyah.teksIndonesia}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
