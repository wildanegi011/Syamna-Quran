"use client";

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/lib/constants/translations';
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
    BookOpen,
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLanguageMeta } from '@/lib/constants/languages';
import { Input } from '@/components/ui/input';
import { Book } from 'lucide-react';
import { SettingsPreview } from './SettingsPreview';

const MUSHAF_OPTIONS = [
    { id: 1, name: 'QCF V2', desc: 'Standard Digital V2' },
    { id: 2, name: 'QCF V1', desc: 'Standard Digital V1' },
    { id: 3, name: 'Indopak', desc: 'Skrip Asia Selatan' },
    { id: 4, name: 'Uthmani Hafs', desc: 'Standar Internasional' },
    { id: 5, name: 'KFGQPCHAFS', desc: 'Mushaf Madinah' },
    { id: 6, name: 'Indopak 15 Lines', desc: 'Standar Indonesia' },
    { id: 7, name: 'Indopak 16 Lines', desc: 'Standard Asia' },
    { id: 19, name: 'QCF Tajweed V4', desc: 'Standard Digital Tajweed' },
];

interface AccordionHeaderProps {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    expandedId: string | null;
    setExpandedId: (id: any) => void;
}

const AccordionHeader = ({ id, icon: Icon, title, subtitle, expandedId, setExpandedId }: AccordionHeaderProps) => (
    <button
        type="button"
        onClick={(e) => {
            e.stopPropagation();
            setExpandedId(expandedId === id ? null : id);
        }}
        className="w-full flex items-center justify-between py-4 group text-left"
    >
        <div className="flex items-center gap-4 text-left overflow-hidden">
            <div className={`p-2.5 rounded-xl transition-colors ${expandedId === id ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className={`text-sm font-bold transition-colors ${expandedId === id ? 'text-foreground' : 'text-foreground/60'}`}>{title}</span>
                {subtitle && <span className="text-[10px] text-foreground/30 truncate">{subtitle}</span>}
            </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-300 ${expandedId === id ? 'rotate-180' : ''}`} />
    </button>
);

export function SettingsContent({ className = "" }: { className?: string }) {
    const {
        arabicFontSize, setArabicFontSize,
        translationFontSize, setTranslationFontSize,
        translationId, setTranslationId,
        showTajweed, setShowTajweed,
        showTranslation, setShowTranslation,
        showLatin, setShowLatin,
        tafsirId, setTafsirId,
        mushafId, setMushafId,
        language
    } = useSettings();

    const { t } = useTranslation(language);

    const { selectedReciterId, setReciterId } = useAudioState();
    const { data: reciters } = useReciters();
    const { data: translations } = useTranslations();
    const { data: tafsirResources, isLoading: isTafsirLoading } = useTafsirResources();

    const [searchReciter, setSearchReciter] = React.useState('');
    const [searchTranslation, setSearchTranslation] = React.useState('');
    const [searchTafsir, setSearchTafsir] = React.useState('');
    const [searchMushaf, setSearchMushaf] = React.useState('');
    const [expandedSection, setExpandedSection] = React.useState<'tampilan' | 'mushaf' | 'reciter' | 'translation' | 'tafsir' | null>('tampilan');

    const sortedTafsirs = React.useMemo(() => {
        if (!tafsirResources) return [];
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

    React.useEffect(() => {
        if (tafsirId === 0 && sortedTafsirs.length > 0) {
            const kemenag = sortedTafsirs.find(t => t.id === 999);
            setTafsirId(kemenag ? kemenag.id : sortedTafsirs[0].id);
        }
    }, [sortedTafsirs, tafsirId, setTafsirId]);

    const selectedReciter = reciters?.find(r => r.identifier === selectedReciterId);
    const selectedTranslation = translations?.find(t => t.id === translationId);
    const selectedMushaf = MUSHAF_OPTIONS.find(m => m.id === mushafId);

    const filteredMushafs = MUSHAF_OPTIONS.filter(m =>
        m.name.toLowerCase().includes(searchMushaf.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchMushaf.toLowerCase())
    );

    const filteredReciters = reciters?.filter(r =>
        r.englishName.toLowerCase().includes(searchReciter.toLowerCase())
    );

    const filteredTranslations = translations?.filter(trans =>
        trans.name.toLowerCase().includes(searchTranslation.toLowerCase()) ||
        trans.languageName.toLowerCase().includes(searchTranslation.toLowerCase()) ||
        (trans.translatedName?.name || '').toLowerCase().includes(searchTranslation.toLowerCase())
    );

    const selectedTafsir = sortedTafsirs.find(tafsir => tafsir.id === tafsirId) || tafsirResources?.find(tafsir => tafsir.id === tafsirId);


    return (
        <div className={`space-y-2 pb-10 ${className}`}>
            <div className="border-b border-foreground/5">
                <AccordionHeader
                    id="tampilan"
                    icon={Layout}
                    expandedId={expandedSection}
                    setExpandedId={setExpandedSection}
                    title={t('tampilan')}
                    subtitle={t('ukuranFont') + " & Pratinjau"}
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
                                            <span className="text-foreground/40 uppercase font-bold tracking-widest">{t('hurufArab')}</span>
                                            <span className="font-black text-primary">{arabicFontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[arabicFontSize]} min={20} max={64} step={2}
                                            onValueChange={(val) => setArabicFontSize(val[0])}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-foreground/40 uppercase font-bold tracking-widest">{t('terjemahan')}</span>
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
                                        { label: t('warnaTajweed'), checked: showTajweed, onChange: setShowTajweed },
                                        { label: t('terjemahan'), checked: showTranslation, onChange: setShowTranslation },
                                        { label: t('latin'), checked: showLatin, onChange: setShowLatin }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/[0.02] transition-colors">
                                            <span className="text-sm font-medium text-foreground/70">{item.label}</span>
                                            <Switch checked={item.checked} onCheckedChange={item.onChange} />
                                        </div>
                                    ))}
                                </div>

                                {/* PREVIEW */}
                                <SettingsPreview />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* JENIS MUSHAF */}
            <div className="border-b border-foreground/5">
                <AccordionHeader
                    id="mushaf"
                    icon={Book}
                    expandedId={expandedSection}
                    setExpandedId={setExpandedSection}
                    title={t('jenisMushaf')}
                    subtitle={selectedMushaf ? `${selectedMushaf.name} • ${selectedMushaf.desc}` : (language === 'ID' ? 'Pilih Mushaf' : 'Select Mushaf')}
                />
                <AnimatePresence>
                    {expandedSection === 'mushaf' && (
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
                                            placeholder="Cari Mushaf..."
                                            value={searchMushaf}
                                            onChange={(e) => setSearchMushaf(e.target.value)}
                                            className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto px-1.5 py-1.5 custom-scrollbar">
                                    {filteredMushafs.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => {
                                                setMushafId(m.id);
                                                setExpandedSection(null);
                                            }}
                                            className={`w-full flex items-center justify-between p-3.5 px-4 rounded-xl text-left transition-all ${mushafId === m.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm truncate">{m.name}</span>
                                                <span className="text-[10px] opacity-40 font-medium uppercase tracking-wider">{m.desc}</span>
                                            </div>
                                            {mushafId === m.id && <Check className="w-4 h-4 shrink-0" />}
                                        </button>
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
                    expandedId={expandedSection}
                    setExpandedId={setExpandedSection}
                    title={t('audio')}
                    subtitle={selectedReciter ? `${selectedReciter.englishName} • ${selectedReciter.type}` : (language === 'ID' ? 'Pilih Qori' : 'Select Reciter')}
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
                    expandedId={expandedSection}
                    setExpandedId={setExpandedSection}
                    title={t('terjemahan')}
                    subtitle={selectedTranslation ? (selectedTranslation.translatedName?.name || selectedTranslation.name) : (language === 'ID' ? 'Pilih Terjemahan' : 'Select Translation')}
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
                                    {filteredTranslations?.map((trans) => (
                                        <button
                                            key={trans.id}
                                            onClick={() => {
                                                setTranslationId(trans.id);
                                                setExpandedSection(null);
                                            }}
                                            className={`w-full flex items-center gap-4 p-3.5 px-4 rounded-xl text-left transition-all ${translationId === trans.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                        >
                                            <span className="text-xl shrink-0">{getLanguageMeta(trans.languageName).flag}</span>
                                            <span className="text-sm flex-1 truncate">{trans.translatedName?.name || trans.name}</span>
                                            {translationId === trans.id && <Check className="w-4 h-4" />}
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
                    expandedId={expandedSection}
                    setExpandedId={setExpandedSection}
                    title={t('tafsir')}
                    subtitle={selectedTafsir ? selectedTafsir.name : (language === 'ID' ? 'Pilih Tafsir' : 'Select Commentary')}
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
                                        filteredTafsirs.map((tafsir) => (
                                            <button
                                                key={tafsir.id}
                                                onClick={() => {
                                                    setTafsirId(tafsir.id);
                                                    setExpandedSection(null);
                                                }}
                                                className={`w-full flex items-center gap-4 p-3.5 px-4 rounded-xl text-left transition-all ${tafsirId === tafsir.id ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/60 hover:bg-foreground/5'}`}
                                            >
                                                <span className="text-xl shrink-0">{getLanguageMeta(tafsir.languageName).flag}</span>
                                                <div className="flex-1 flex flex-col min-w-0">
                                                    <span className="text-sm truncate">{tafsir.name}</span>
                                                    <span className="text-[10px] opacity-40 font-medium truncate">
                                                        {tafsir.authorName}
                                                    </span>
                                                </div>
                                                {tafsirId === tafsir.id && <Check className="w-4 h-4" />}
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
