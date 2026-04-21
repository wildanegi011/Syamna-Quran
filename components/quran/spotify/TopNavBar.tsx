"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';

interface TopNavBarProps {
    isReadingMode?: boolean;
    isScrolled?: boolean;
    isCollapsed?: boolean;
}

export function TopNavBar({ isReadingMode, isScrolled, isCollapsed }: TopNavBarProps) {
    const pathname = usePathname();
    const params = useParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const searchRef = React.useRef<HTMLInputElement>(null);

    // Focus search on Cmd+K
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getSearchPlaceholder = () => {
        if (pathname.includes('/quran')) return "Cari Surah atau Juz...";
        if (pathname.includes('/hadits')) return "Cari Kategori Hadits...";
        if (pathname.includes('/doa')) return "Cari Doa...";
        if (pathname.includes('/asmaul-husna')) return "Cari Asmaul Husna...";
        return "Cari Sesuatu...";
    };

    return (
        <nav className={cn(
            "fixed top-0 right-0 z-50 transition-all duration-500 flex items-center h-16 left-0",
            isCollapsed ? "md:left-20" : "md:left-72",
            "bg-background/60 backdrop-blur-3xl border-b border-white/10 shadow-sm",
        )}>
            <div className="w-full px-8 md:px-12 flex justify-between items-center h-full">
                <div className="flex items-center gap-4 flex-1">
                    <div className="md:hidden font-headline text-xl font-bold tracking-tight text-white drop-shadow-md">
                        Syamna <span className="text-primary italic">Quran</span>
                    </div>

                    {/* Global Search Bar - Hidden in Reading Mode Desktop */}
                    {!isReadingMode && (
                        <div className="hidden md:flex items-center relative w-full max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/30 group-focus-within:text-primary transition-colors" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={getSearchPlaceholder()}
                                className="w-full h-11 pl-12 pr-4 bg-surface-container-low/50 hover:bg-surface-container-low border border-white/10 rounded-2xl text-sm font-body focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface/20 text-white"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-surface-container-highest border border-white/10 text-[10px] font-black text-on-surface/40">
                                ⌘ K
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme & Notification Toggle */}
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-on-surface/60 hover:text-white">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                        </button>

                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-on-surface/60 hover:text-white relative">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            {/* Notification Badge */}
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-[#121212] flex items-center justify-center text-[9px] font-bold text-white">9</span>
                        </button>
                    </div>

                    {/* User Profile */}
                    <button className="flex items-center gap-3 pl-1 pr-2 py-1 transition-all group">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center">
                            <span className="text-xs font-black text-on-surface/40 absolute">UA</span>
                            <Image 
                                src="/avatars/user_umar.png" 
                                alt="Umar Al-Faruq" 
                                fill 
                                className="object-cover relative z-10"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-sm font-bold text-white transition-colors group-hover:text-primary">Umar Al-Faruq</span>
                            <span className="text-[10px] font-bold text-[#8FA9F4] uppercase tracking-wide">JAMA'AH AKTIF</span>
                        </div>
                        <svg className="w-4 h-4 text-on-surface/40 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
