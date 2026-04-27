"use client";

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAudioState } from '@/contexts/AudioContext';
import { useReciters, useTranslations, useTafsirResources } from '@/hooks/use-quran';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Type,
    Headphones,
    Languages,
    Eye,
    Search,
    Check,
    ChevronDown,
    Info,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLanguageMeta } from '@/lib/constants/languages';
import { Input } from '@/components/ui/input';

interface SettingsContentProps {
    className?: string;
}

export function SettingsContent({ className }: SettingsContentProps) {
    const {
        arabicFontSize, setArabicFontSize,
        translationFontSize, setTranslationFontSize,
        translationId, setTranslationId,
        showTajweed, setShowTajweed,
        showTranslation, setShowTranslation,
        showLatin, setShowLatin,
        tafsirId, setTafsirId
    } = useSettings();

    const { selectedReciterId, setReciterId } = useAudioState();
    const { data: reciters } = useReciters();
    const { data: translations } = useTranslations();
    const { data: tafsirResources, isLoading: isTafsirLoading } = useTafsirResources();

    const [searchReciter, setSearchReciter] = React.useState('');
    const [searchTranslation, setSearchTranslation] = React.useState('');
    const [searchTafsir, setSearchTafsir] = React.useState('');
    const [expandedSection, setExpandedSection] = React.useState<'tampilan' | 'reciter' | 'translation' | 'tafsir' | null>('tampilan');

    const sortedTafsirs = React.useMemo(() => {
        if (!tafsirResources) return [];
        // Sort Indonesian resources to the top, then the rest
        return [...tafsirResources].sort((a, b) => {
            const isAIndonesian = a.languageName.toLowerCase() === 'indonesian';
            const isBIndonesian = b.languageName.toLowerCase() === 'indonesian';
            if (isAIndonesian && !isBIndonesian) return -1;
            if (!isAIndonesian && isBIndonesian) return 1;
            return 0;
        });
    }, [tafsirResources]);

    const filteredTafsirs = React.useMemo(() => {
        if (searchTafsir) {
            return sortedTafsirs.filter(t =>
                t.name.toLowerCase().includes(searchTafsir.toLowerCase()) ||
                t.authorName.toLowerCase().includes(searchTafsir.toLowerCase())
            );
        }
        return sortedTafsirs;
    }, [sortedTafsirs, searchTafsir]);

    // Ensure we have a valid selection only if none is set (tafsirId === 0)
    React.useEffect(() => {
        if (tafsirId === 0 && sortedTafsirs.length > 0) {
            // Set default to Kemenag (999) if available
            const kemenag = sortedTafsirs.find(t => t.id === 999);
            setTafsirId(kemenag ? kemenag.id : sortedTafsirs[0].id);
        }
    }, [sortedTafsirs, tafsirId, setTafsirId]);

    const selectedReciter = reciters?.find(r => r.identifier === selectedReciterId);
    const selectedTranslation = translations?.find(t => t.id === translationId);
    const selectedTafsir = sortedTafsirs.find(t => t.id === tafsirId) || tafsirResources?.find(t => t.id === tafsirId);

    const filteredReciters = reciters?.filter(r =>
        r.englishName.toLowerCase().includes(searchReciter.toLowerCase())
    );

    const filteredTranslations = translations?.filter(t =>
        t.name.toLowerCase().includes(searchTranslation.toLowerCase()) ||
        t.languageName.toLowerCase().includes(searchTranslation.toLowerCase()) ||
        (t.translatedName?.name || '').toLowerCase().includes(searchTranslation.toLowerCase())
    );

    const AccordionHeader = ({ id, icon: Icon, title, subtitle }: { id: typeof expandedSection, icon: any, title: string, subtitle?: string }) => (
        <button
            onClick={() => setExpandedSection(expandedSection === id ? null : id)}
            className="w-full flex items-center justify-between py-4 group"
        >
            <div className="flex items-center gap-4 text-left overflow-hidden">
                <div className={`p-2.5 rounded-xl transition-colors ${expandedSection === id ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm font-bold transition-colors ${expandedSection === id ? 'text-foreground' : 'text-foreground/60'}`}>{title}</span>
                    {subtitle && <span className="text-[10px] text-foreground/30 truncate">{subtitle}</span>}
                </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-300 ${expandedSection === id ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <div className={`space-y-2 pb-10 ${className}`}>
            {/* TAMPILAN */}
            <div className="border-b border-foreground/5">
                <AccordionHeader
                    id="tampilan"
                    icon={Eye}
                    title="Tampilan"
                    subtitle="Ukuran font & visibilitas"
                />
                <AnimatePresence>
                    {expandedSection === 'tampilan' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-1 pb-6 space-y-8">
                                {/* UKURAN TEKS */}
                                <div className="space-y-6 bg-foreground/[0.02] p-4 rounded-2xl border border-foreground/5">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-foreground/40 uppercase font-bold tracking-widest">Huruf Arab</span>
                                            <span className="font-black text-primary">{arabicFontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[arabicFontSize]} min={20} max={64} step={2}
                                            onValueChange={(val) => setArabicFontSize(val[0])}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-foreground/40 uppercase font-bold tracking-widest">Terjemahan</span>
                                            <span className="font-black text-primary">{translationFontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[translationFontSize]} min={12} max={32} step={1}
                                            onValueChange={(val) => setTranslationFontSize(val[0])}
                                        />
                                    </div>
                                </div>

                                {/* TOGGLES */}
                                <div className="space-y-1">
                                    {[
                                        { label: 'Warna Tajweed', checked: showTajweed, onChange: setShowTajweed },
                                        { label: 'Terjemahan', checked: showTranslation, onChange: setShowTranslation },
                                        { label: 'Latin (Transliterasi)', checked: showLatin, onChange: setShowLatin }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/[0.02] transition-colors">
                                            <span className="text-sm font-medium text-foreground/70">{item.label}</span>
                                            <Switch checked={item.checked} onCheckedChange={item.onChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* AUDIO */}
            <div className="border-b border-foreground/5">
                <AccordionHeader
                    id="reciter"
                    icon={Headphones}
                    title="Audio"
                    subtitle={selectedReciter ? `${selectedReciter.englishName} • ${selectedReciter.type}` : "Pilih Qori"}
                />
                <AnimatePresence>
                    {expandedSection === 'reciter' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pb-6"
                        >
                            <div className="bg-foreground/[0.03] rounded-2xl overflow-hidden">
                                <div className="p-3 border-b border-foreground/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20" />
                                        <Input
                                            placeholder="Cari Qori..."
                                            value={searchReciter}
                                            onChange={(e) => setSearchReciter(e.target.value)}
                                            className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto px-1.5 py-1.5 custom-scrollbar">
                                    {filteredReciters?.map((r) => (
                                        <button
                                            key={r.identifier}
                                            onClick={() => {
                                                setReciterId(r.identifier);
                                                setExpandedSection(null);
                                            }}
                                            className={`w-full flex items-center justify-between p-3.5 px-4 rounded-xl text-left transition-all ${selectedReciterId === r.identifier ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm truncate">{r.englishName}</span>
                                                <span className="text-[10px] opacity-40 font-medium uppercase tracking-wider">{r.type}</span>
                                            </div>
                                            {selectedReciterId === r.identifier && <Check className="w-4 h-4 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BAHASA */}
            <div className="border-b border-foreground/5">
                <AccordionHeader
                    id="translation"
                    icon={Languages}
                    title="Terjemahan"
                    subtitle={selectedTranslation ? (selectedTranslation.translatedName?.name || selectedTranslation.name) : "Pilih Terjemahan"}
                />
                <AnimatePresence>
                    {expandedSection === 'translation' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pb-6"
                        >
                            <div className="bg-foreground/[0.03] rounded-2xl overflow-hidden">
                                <div className="p-3 border-b border-foreground/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20" />
                                        <Input
                                            placeholder="Cari Terjemahan..."
                                            value={searchTranslation}
                                            onChange={(e) => setSearchTranslation(e.target.value)}
                                            className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto px-1.5 py-1.5 custom-scrollbar">
                                    {filteredTranslations?.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setTranslationId(t.id);
                                                setExpandedSection(null);
                                            }}
                                            className={`w-full flex items-center gap-4 p-3.5 px-4 rounded-xl text-left transition-all ${translationId === t.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                        >
                                            <span className="text-xl shrink-0">{getLanguageMeta(t.languageName).flag}</span>
                                            <span className="text-sm flex-1 truncate">{t.translatedName?.name || t.name}</span>
                                            {translationId === t.id && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TAFSIR */}
            <div>
                <AccordionHeader
                    id="tafsir"
                    icon={BookOpen}
                    title="Tafsir"
                    subtitle={selectedTafsir ? selectedTafsir.name : "Pilih Tafsir"}
                />
                <AnimatePresence>
                    {expandedSection === 'tafsir' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pb-6"
                        >
                            <div className="bg-foreground/[0.03] rounded-2xl overflow-hidden">
                                <div className="p-3 border-b border-foreground/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20" />
                                        <Input
                                            placeholder="Cari Tafsir..."
                                            value={searchTafsir}
                                            onChange={(e) => setSearchTafsir(e.target.value)}
                                            className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto px-1.5 py-1.5 custom-scrollbar">
                                    {isTafsirLoading ? (
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 w-full bg-foreground/5 animate-pulse rounded-full" />
                                            <div className="h-4 w-2/3 bg-foreground/5 animate-pulse rounded-full" />
                                        </div>
                                    ) : (
                                        filteredTafsirs.map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setTafsirId(t.id);
                                                    setExpandedSection(null);
                                                }}
                                                className={`w-full flex items-center gap-4 p-3.5 px-4 rounded-xl text-left transition-all ${tafsirId === t.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                            >
                                                <span className="text-xl shrink-0">{getLanguageMeta(t.languageName).flag}</span>
                                                <div className="flex-1 flex flex-col min-w-0">
                                                    <span className="text-sm truncate">{t.name}</span>
                                                    <span className="text-[10px] opacity-40 font-medium truncate">
                                                        {t.authorName}
                                                    </span>
                                                </div>
                                                {tafsirId === t.id && <Check className="w-4 h-4" />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="pt-8 flex items-start gap-3 opacity-20 px-2">
                <Info className="w-3 h-3 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-bold uppercase tracking-widest">Data Provided by Quran Foundation.</p>
            </div>
        </div>
    );
}
