"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    Search,
    BookOpen,
    History,
    ChevronRight,
    Sparkles,
    Heart as HeartIcon,
    Clock,
    Book,
    FileText,
    LayoutGrid,
    Zap,
    Settings,
    GraduationCap,
    Bookmark,
    PlayCircle,
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSurahs } from '@/hooks/use-quran';
import { SurahSummary } from '@/lib/types';

import juzData from '@/lib/data/juz.json';

import Image from 'next/image';

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [lastRead, setLastRead] = useState<{ id: number; name: string } | null>(null);

    // Fetch last read from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('syamna_last_read');
        if (saved) {
            setLastRead(JSON.parse(saved));
        }
    }, [pathname]);

    const isJuzMode = pathname.includes('/quran/juz');
    const currentId = params.id ? parseInt(params.id as string) : null;
    const isReadingMode = !!params.id && pathname.includes('/quran/');

    const { data: surahs = [] } = useSurahs();

    const filteredSurahs = surahs.filter(s =>
        s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nomor.toString().includes(searchQuery)
    );

    const filteredJuz = juzData.filter(j =>
        j.id.toString().includes(searchQuery) ||
        j.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.end.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const menuGroups = [
        {
            label: 'UTAMA',
            items: [
                { icon: Home, label: 'Beranda', href: '/' },
                { icon: BookOpen, label: 'Baca Quran', href: '/quran' },
                // { icon: History, label: 'Terakhir Dibaca', href: '/quran/history' },
            ]
        },
        {
            label: 'IBADAH',
            items: [
                { icon: FileText, label: 'Hadits Nabawi', href: '/hadits' },
                { icon: HeartIcon, label: 'Kumpulan Doa', href: '/doa' },
                { icon: Clock, label: 'Jadwal Sholat', href: '/jadwal-sholat' },
            ]
        },
        {
            label: 'PELAJARAN',
            items: [
                // { icon: GraduationCap, label: 'Tajwid / Iqro', href: '/iqro' },
                { icon: Sparkles, label: 'Asmaul Husna', href: '/asmaul-husna' },
                // { icon: Settings, label: 'Pengaturan', href: '/settings' },
            ]
        }
    ];

    return (
        <aside className={cn(
            "hidden md:flex fixed left-0 top-0 h-full z-40 bg-background flex flex-col gap-0 p-0 border-r border-outline-variant/10 shadow-2xl transition-all duration-500 ease-in-out",
            isCollapsed ? "w-20" : "w-72"
        )}>
            {/* Logo area - Hide in Reading Mode for Focus */}
            {!isReadingMode && (
                <div className={cn("pt-5 pb-6 transition-all duration-500", isCollapsed ? "px-5" : "px-8")}>
                    <div className="flex items-center gap-3 relative">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                            <Image
                                src="/logos/white.png"
                                alt="Syamna Quran Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-black text-on-surface tracking-tighter whitespace-nowrap"
                            >
                                Syamna <span className="text-primary italic">Quran</span>
                            </motion.span>
                        )}

                        {/* Collapse Toggle */}
                        <button
                            onClick={toggleCollapse}
                            className={cn(
                                "absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface-container-highest rounded-full border border-white/10 flex items-center justify-center text-on-surface/40 hover:text-primary transition-all z-50",
                                isCollapsed ? "right-[-12px]" : ""
                            )}
                        >
                            {isCollapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Collapse Toggle - Persist but move to top in Reading Mode */}
            {isReadingMode && (
                <div className="flex justify-center py-6 border-b border-white/5 mb-4">
                    <button
                        onClick={toggleCollapse}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 flex items-center justify-center text-on-surface/40 hover:text-primary transition-all group"
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>
            )}

            {/* Grouped Navigation - Only show when NOT in Reading Mode */}
            {!isReadingMode && (
                <div className={cn("flex-1 overflow-y-auto custom-scrollbar transition-all duration-500", isCollapsed ? "px-2" : "px-4")}>
                    {menuGroups.map((group, groupIdx) => (
                        <div key={group.label} className={cn("mb-8", groupIdx === 0 ? "" : "pt-2")}>
                            {!isCollapsed && (
                                <h2 className="px-4 mb-4 text-[10px] font-headline font-black text-on-surface/60 uppercase tracking-[0.4em] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                                    {group.label}
                                </h2>
                            )}
                            <nav className="space-y-1.5 font-sans">
                                {group.items.map(({ icon: Icon, label, href }) => {
                                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                                    return (
                                        <Link
                                            key={label}
                                            href={href}
                                            className={cn(
                                                "flex items-center gap-4 py-3.5 rounded-xl font-headline text-sm font-bold transition-all duration-500 group active:scale-95 relative overflow-hidden",
                                                isCollapsed ? "px-0 justify-center" : "px-4",
                                                isActive
                                                    ? "bg-white/[0.08] text-white shadow-xl shadow-black/20"
                                                    : "text-on-surface/40 hover:bg-white/[0.03] hover:text-white"
                                            )}
                                        >
                                            {/* Glow overlay for active state */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent" />
                                            )}
                                            <Icon className={cn(
                                                "w-5 h-5 transition-all duration-500",
                                                isActive
                                                    ? "text-primary scale-110 drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)]"
                                                    : "text-on-surface/20 group-hover:text-primary group-hover:scale-110"
                                            )} strokeWidth={isActive ? 3 : 2} />

                                            {!isCollapsed && <span className={cn(isActive ? "font-black" : "font-semibold")}>{label}</span>}

                                            {/* Active Indicator Line - Sharpened */}
                                            {isActive && (
                                                <>
                                                    <div className="absolute left-0 top-[20%] bottom-[20%] w-1.5 bg-primary rounded-r-full shadow-[2px_0_15px_rgba(var(--primary-rgb),0.8)]" />
                                                    {isCollapsed && (
                                                        <div className="absolute left-full ml-3 px-3 py-2 bg-surface-container-highest text-white text-[10px] font-black rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10 uppercase tracking-widest">
                                                            {label}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>
            )}

            {/* List Section (Quran Reading Context) - Only show on Detail Pages */}
            {isReadingMode && (
                <div className={cn(
                    "flex-1 flex flex-col min-h-0 pb-2 group/list pt-12 transition-all duration-500",
                    isCollapsed ? "px-2" : "px-4"
                )}>
                    <div className={cn("flex items-center justify-between px-4 mb-4", isCollapsed && "flex-col gap-4")}>
                        <div className={cn("flex items-center gap-2 text-on-surface/60", isCollapsed && "hidden")}>
                            <ListIcon className="w-4 h-4" />
                            <span className="text-xs font-headline font-black uppercase tracking-[0.2em]">
                                {isJuzMode ? 'Pilih Juz' : 'Pilih Surah'}
                            </span>
                        </div>
                        <Link href="/quran" className="p-2 hover:bg-surface-container-low rounded-lg transition-colors group/back">
                            <LayoutGrid className="w-4 h-4 text-on-surface/20 group-hover/back:text-primary" />
                        </Link>
                    </div>

                    {/* Compact Search internal for sidebar */}
                    <div className="px-2 mb-4">
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface/30 group-focus-within/search:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder={isJuzMode ? "Cari Juz..." : "Cari Surah..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-surface-container-low border-none rounded-xl text-xs font-body focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface/20 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Scrollable List container */}
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 transition-colors space-y-1 custom-scrollbar">
                        {isJuzMode ? (
                            filteredJuz.map((juz) => {
                                const isActive = currentId === juz.id;
                                return (
                                    <Link
                                        key={juz.id}
                                        href={`/quran/juz/${juz.id}`}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group/item relative",
                                            isActive
                                                ? "bg-surface-container-highest/50 text-primary shadow-lg ring-1 ring-primary/10"
                                                : "hover:bg-surface-container-low text-on-surface/60 hover:text-on-surface"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-headline font-black transition-all shadow-sm shrink-0",
                                            isActive ? "bg-primary text-primary-foreground" : "bg-surface-container-highest text-on-surface/20 group-hover/item:text-primary/40"
                                        )}>
                                            {juz.id}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-headline font-black truncate",
                                                isActive ? "text-primary" : "text-on-surface/80"
                                            )}>
                                                Juz {juz.id}
                                            </p>
                                            <p className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface/30 truncate leading-none mt-1">
                                                {juz.start.split(' ')[0]} — {juz.end.split(' ')[0]}
                                            </p>
                                        </div>
                                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
                                    </Link>
                                );
                            })
                        ) : (
                            filteredSurahs.map((surah) => {
                                const isActive = currentId === surah.nomor;
                                return (
                                    <Link
                                        key={surah.nomor}
                                        href={`/quran/${surah.nomor}`}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group/item relative",
                                            isActive
                                                ? "bg-surface-container-highest/50 text-primary shadow-lg ring-1 ring-primary/10"
                                                : "hover:bg-surface-container-low text-on-surface/60 hover:text-on-surface"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-headline font-black transition-all shadow-sm shrink-0",
                                            isActive ? "bg-primary text-primary-foreground" : "bg-surface-container-highest text-on-surface/20 group-hover/item:text-primary/40"
                                        )}>
                                            {surah.nomor}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={cn(
                                                    "text-sm font-headline font-black truncate",
                                                    isActive ? "text-primary" : "text-on-surface/80"
                                                )}>
                                                    {surah.namaLatin}
                                                </p>
                                                <p className={cn(
                                                    "text-lg font-arabic",
                                                    isActive ? "text-primary" : "text-on-surface/20"
                                                )}>
                                                    {surah.nama}
                                                </p>
                                            </div>
                                            <p className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface/30 truncate leading-none">
                                                {surah.jumlahAyat} Ayat • {surah.tempatTurun}
                                            </p>
                                        </div>
                                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Footer / Credits - Hide in Reading Mode */}
            {!isReadingMode && (
                <div className={cn(
                    "p-6 border-t border-outline-variant/10 bg-surface-container-low/30 backdrop-blur-md transition-all duration-500",
                    isCollapsed ? "px-4" : "p-6"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary/30 to-primary/5 border border-primary/20 p-0.5 shadow-lg shrink-0">
                            <div className="w-full h-full rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-headline font-black text-[8px]">
                                SY
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-headline font-black text-on-surface truncate">Syamna Quran</p>
                                <p className="text-[8px] font-label font-bold text-primary tracking-[0.2em] uppercase opacity-60">v2.0.0-gold</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}

function ListIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
