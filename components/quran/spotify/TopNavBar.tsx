"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Moon, Sun, Bell, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Link from 'next/link';

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
    const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useSearch(); // Reusing SearchContext for layout state or a local one
    const searchRef = React.useRef<HTMLInputElement>(null);
    const mobileSearchRef = React.useRef<HTMLInputElement>(null);

    // Initial mount to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
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
            "fixed top-0 right-0 left-0 z-50 transition-all duration-500 h-[65px]",
            "bg-background shadow-sm",
        )}>
            <div className="w-full px-4 sm:px-6 md:px-12 flex justify-between items-center h-full relative">
                <div className={cn(
                    "flex items-center gap-4 flex-1 transition-all duration-300",
                    isMobileSearchOpen ? "opacity-0 invisible pointer-events-none md:opacity-100 md:visible md:pointer-events-auto" : "opacity-100 visible"
                )}>
                    {/* Hamburger Toggle - Animated Morph */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white active:scale-95 transition-all mr-2 group"
                    >
                        <div className="relative w-5 h-5">
                            <motion.div
                                animate={{
                                    rotate: isMobileMenuOpen ? 180 : 0,
                                    opacity: isMobileMenuOpen ? 0 : 1
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Menu className="w-5 h-5" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, rotate: -180 }}
                                animate={{
                                    rotate: isMobileMenuOpen ? 0 : -180,
                                    opacity: isMobileMenuOpen ? 1 : 0
                                }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </button>

                    {/* Branding - Synced with Landing Page */}
                    <Link href="/" className="hidden sm:flex items-center gap-3 group shrink-0">
                        <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 transition-transform group-hover:scale-110 duration-500">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#00df9a]/20 to-transparent z-10" />
                            <Image
                                src="/logos/white.png"
                                alt="Syamna Quran Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-black text-white tracking-tight">
                            Syamna <span className="text-[#00df9a] transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,223,154,0.5)]">Quran</span>
                        </span>
                    </Link>

                    {/* Unified Search Bar - Mobile & Desktop (Centered on Desktop) */}
                    {!isReadingMode && (
                        <div className={cn(
                            "flex-1 relative group transition-all duration-500",
                            "lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-md lg:flex-none"
                        )}>
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface/30 group-focus-within:text-primary transition-colors" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={getSearchPlaceholder()}
                                className="w-full h-9 sm:h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs font-body focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface/20 text-white"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* User Profile / Login */}
                    {loading ? (
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden lg:flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 group">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center">
                                    {user.user_metadata.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt={user.user_metadata.full_name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-4 h-4 text-white/40" />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-white leading-tight">
                                    {user.user_metadata.full_name?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={signOut}
                                className="hidden lg:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
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
                            className="hidden lg:flex rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary font-bold px-6 h-10"
                        >
                            Masuk
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}

