"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Moon, Sun, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface TopNavBarProps {
    isReadingMode?: boolean;
    isScrolled?: boolean;
    isCollapsed?: boolean;
}

export function TopNavBar({ isReadingMode, isScrolled, isCollapsed }: TopNavBarProps) {
    const pathname = usePathname();
    const params = useParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const searchRef = React.useRef<HTMLInputElement>(null);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

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
                        <button 
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-on-surface/60 hover:text-white"
                            title="Toggle Theme"
                        >
                            {mounted && resolvedTheme === 'dark' ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>

                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-on-surface/60 hover:text-white relative">
                            <Bell className="w-4 h-4" />
                            {/* Notification Badge */}
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-[#121212] flex items-center justify-center text-[9px] font-bold text-white">9</span>
                        </button>
                    </div>

                    {/* User Profile */}
                    {loading ? (
                        <div className="w-32 h-10 rounded-full bg-white/5 animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-3 pl-1 pr-3 py-1 transition-all rounded-full bg-white/5 border border-white/10 group">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center">
                                    {user.user_metadata.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt={user.user_metadata.full_name || "User"}
                                            fill
                                            className="object-cover relative z-10"
                                        />
                                    ) : (
                                        <User className="w-4 h-4 text-white/40" />
                                    )}
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-xs font-bold text-white transition-colors group-hover:text-primary leading-tight">
                                        {user.user_metadata.full_name?.split(' ')[0]}
                                    </span>
                                    <span className="text-[8px] font-bold text-[#8FA9F4] uppercase tracking-wide">ACTIVE USER</span>
                                </div>
                            </div>
                            <button
                                onClick={signOut}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Button
                            onClick={signInWithGoogle}
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary font-bold px-5"
                        >
                            Masuk
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
