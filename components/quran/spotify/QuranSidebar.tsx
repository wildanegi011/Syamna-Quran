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
    PanelLeftOpen,
    X,
    LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
    const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();
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
                { icon: Sparkles, label: 'Asmaul Husna', href: '/asmaul-husna' },
            ]
        }
    ];

    return (
        <aside className={cn(
            "h-full w-full bg-background flex flex-col gap-0 p-0 shadow-2xl relative",
        )}>
            {/* Logo area */}
            <div className={cn("pt-5 pb-6 px-8 border-b border-white/5")}>
                <div className="flex items-center gap-3 relative">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                        <Image
                            src="/logos/white.png"
                            alt="Syamna Quran Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-black text-on-surface tracking-tighter whitespace-nowrap"
                    >
                        Syamna <span className="text-primary italic">Quran</span>
                    </motion.span>

                    {/* Close Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 hover:bg-white/5 rounded-full flex items-center justify-center text-on-surface/40 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Combined View: Features & List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {/* Features Group */}
                <div className="px-4 pt-6 pb-4">
                    {menuGroups.map((group, groupIdx) => (
                        <div key={group.label} className="mb-6">
                            <h2 className="px-4 mb-4 text-[10px] font-headline font-black text-on-surface/40 uppercase tracking-[0.4em] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary/40" />
                                {group.label}
                            </h2>
                            <nav className="space-y-1 font-sans">
                                {group.items.map(({ icon: Icon, label, href }) => {
                                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                                    return (
                                        <Link
                                            key={label}
                                            href={href}
                                            onClick={toggleCollapse}
                                            className={cn(
                                                "flex items-center gap-4 py-3 px-4 rounded-xl font-headline text-sm font-bold transition-all duration-300 relative overflow-hidden",
                                                isActive
                                                    ? "bg-white/[0.08] text-white"
                                                    : "text-on-surface/40 hover:bg-white/[0.03] hover:text-white"
                                            )}
                                        >
                                            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-on-surface/20")} />
                                            <span>{label}</span>
                                            {isActive && <div className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-primary rounded-r-full" />}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Separator if Reading Mode */}
                {isReadingMode && (
                    <div className="px-4 py-2 border-t border-white/5 bg-surface-container-low/20">
                        <div className="flex items-center gap-2 text-on-surface/40 px-4 py-3">
                            <ListIcon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                {isJuzMode ? 'Ganti Juz' : 'Ganti Surah'}
                            </span>
                        </div>
                        
                        {/* Compact Search */}
                        <div className="px-2 mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/20" />
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white/5 border-none rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary/20 transition-all text-white"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                            {isJuzMode ? (
                                filteredJuz.map(j => (
                                    <Link key={j.id} href={`/quran/juz/${j.id}`} onClick={toggleCollapse} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all", currentId === j.id ? "bg-primary/10 text-primary" : "text-white/40 hover:bg-white/5")}>
                                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black">{j.id}</span>
                                        <span className="text-sm font-bold">Juz {j.id}</span>
                                    </Link>
                                ))
                            ) : (
                                filteredSurahs.map(s => (
                                    <Link key={s.nomor} href={`/quran/${s.nomor}`} onClick={toggleCollapse} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all", currentId === s.nomor ? "bg-primary/10 text-primary" : "text-white/40 hover:bg-white/5")}>
                                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black">{s.nomor}</span>
                                        <span className="text-sm font-bold truncate">{s.namaLatin}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Authentication Footer (Consolidated) */}
            <div className="p-8 border-t border-white/10 bg-surface-container-highest/10">
                {user ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                                {user.user_metadata.avatar_url ? (
                                    <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {user.user_metadata.full_name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user.user_metadata.full_name}</p>
                                <p className="text-[10px] text-white/30 truncate uppercase tracking-widest">Premium Member</p>
                            </div>
                        </div>
                        <Button 
                            onClick={signOut}
                            variant="outline" 
                            className="w-full h-12 rounded-xl border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-bold uppercase tracking-widest text-[10px]"
                        >
                            Keluar Akun
                        </Button>
                    </div>
                ) : (
                    <Button 
                        onClick={signInWithGoogle}
                        disabled={authLoading}
                        className="w-full h-14 rounded-xl bg-primary hover:bg-primary text-black font-black uppercase tracking-widest gap-3 transition-all active:scale-95 shadow-xl shadow-primary/10"
                    >
                        <LogIn className="w-5 h-5" />
                        Masuk Sekarang
                    </Button>
                )}
            </div>
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
