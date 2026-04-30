"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Save, Loader2, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuranFoundation } from '@/hooks/use-quran-foundation';
import { Ayah } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ReflectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    ayah: Ayah | null;
    surahNumber: number;
}

export function ReflectionDrawer({ isOpen, onClose, ayah, surahNumber }: ReflectionDrawerProps) {
    const { allNotes, saveNote, isConnected } = useQuranFoundation();
    const [noteBody, setNoteBody] = useState("");

    // Find existing note for this ayah
    const existingNote = allNotes.data?.find(
        n => n.chapter_id === surahNumber && n.verse_number === ayah?.nomorAyat
    );

    useEffect(() => {
        if (existingNote) {
            setNoteBody(existingNote.body);
        } else {
            setNoteBody("");
        }
    }, [existingNote, isOpen]);

    const handleSave = async () => {
        if (!ayah || !noteBody.trim()) return;
        
        try {
            await saveNote.mutateAsync({
                chapter_id: surahNumber,
                verse_number: ayah.nomorAyat,
                body: noteBody
            });
            onClose();
        } catch (error) {
            console.error("Failed to save reflection:", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 lg:top-0 right-0 w-full lg:w-[450px] bg-background border-t lg:border-t-0 lg:border-l border-foreground/10 z-[101] shadow-2xl flex flex-col h-[85vh] lg:h-screen"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-foreground/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-foreground">Tadabbur Ayat</h3>
                                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider">QS {surahNumber}:{ayah?.nomorAyat}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>
                        </div>

                        {/* Content */}
                        {!isConnected ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse rounded-full" />
                                    <Sparkles className="w-10 h-10 text-primary relative z-10" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-foreground">Fitur Khusus Terhubung</h4>
                                    <p className="text-sm text-foreground/40 font-medium leading-relaxed">
                                        Sambungkan akun Quran Foundation Anda untuk menyimpan catatan tadabbur dan sinkronisasi di semua perangkat.
                                    </p>
                                </div>
                                <Button className="w-full h-12 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px]" onClick={() => window.location.href = '/api/quran/auth/login'}>
                                    Hubungkan Sekarang
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Verse Preview */}
                                    <div className="p-4 bg-foreground/[0.03] rounded-2xl border border-foreground/5 text-right">
                                        <div className="flex items-center justify-end gap-2 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Ayat Preview</span>
                                            <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <p className="font-arabic text-xl leading-relaxed mb-4" dir="rtl">
                                            {ayah?.teksArab}
                                        </p>
                                        <p className="text-sm text-foreground/60 leading-relaxed italic text-left">
                                            "{ayah?.teksIndonesia}"
                                        </p>
                                    </div>

                                    {/* Reflection Input */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Catatan Refleksi</label>
                                        <textarea
                                            value={noteBody}
                                            onChange={(e) => setNoteBody(e.target.value)}
                                            placeholder="Tuliskan makna, hikmah, atau doa yang terlintas saat membaca ayat ini..."
                                            className="w-full h-64 p-5 bg-background border-2 border-foreground/5 rounded-2xl focus:border-primary/30 outline-none transition-all text-sm leading-relaxed resize-none font-medium placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-foreground/5 bg-foreground/[0.01]">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saveNote.isPending || !noteBody.trim()}
                                        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary text-black font-black uppercase tracking-[0.2em] text-xs gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                                    >
                                        {saveNote.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Simpan Tadabbur
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
