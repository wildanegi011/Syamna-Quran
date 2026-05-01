"use client";

import React from 'react';
import { ChevronDown, LogIn, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Moon, Sun, Bell, Menu, X, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { SettingsSheet } from '@/components/settings/SettingsSheet';
import { ProfileSheet } from './ProfileSheet';
import { useTranslation } from '@/lib/constants/translations';
import { useSettings } from '@/contexts/SettingsContext';

interface TopNavBarProps {
    isReadingMode?: boolean;
    isScrolled?: boolean;
    isCollapsed?: boolean;
    onToggleSidebar?: () => void;
}

export function TopNavBar({ isReadingMode, isScrolled, isCollapsed, onToggleSidebar }: TopNavBarProps) {
    const pathname = usePathname();
    const params = useParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const { user, signInWithGoogle, signOut, loading } = useAuth();
    const { resolvedTheme, setTheme } = useTheme();
    const { language, setLanguage } = useSettings();
    const { t } = useTranslation(language);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
    const { isMobileMenuOpen, setIsMobileMenuOpen } = useSearch(); // Reusing SearchContext for layout state or a local one
    const searchRef = React.useRef<HTMLInputElement>(null);
    const mobileSearchRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Initial mount to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Auto close dropdown on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                // If the click is inside a Radix UI portal (like the Settings sheet), don't close
                if (target instanceof Element && (
                    target.closest('[data-radix-portal]') || 
                    target.closest('[role="dialog"]') ||
                    target.closest('[role="menu"]')
                )) {
                    return;
                }
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getSearchPlaceholder = () => {
        if (pathname.includes('/quran')) return t('cariSurah');
        if (pathname.includes('/hadits')) return t('cariHadits');
        if (pathname.includes('/doa')) return t('cariDoa');
        if (pathname.includes('/asmaul-husna')) return t('cariAsmaul');
        return t('cari');
    };

    return (
        <nav className={cn(
            "fixed top-0 right-0 left-0 z-50 h-16 transition-colors duration-500",
            "bg-background/80 backdrop-blur-md border-b border-foreground/5",
        )}>
            <div className="w-full px-4 sm:px-6 md:px-12 flex justify-between items-center h-full relative gap-4">
                <div className={cn(
                    "flex items-center gap-6 flex-1 transition-all duration-300",
                    isMobileSearchOpen ? "opacity-0 invisible pointer-events-none md:opacity-100 md:visible md:pointer-events-auto" : "opacity-100 visible"
                )}>
                    {/* Hamburger Toggle - Smooth Morph */}
                    <button
                        onClick={() => {
                            if (window.innerWidth >= 768 && onToggleSidebar) {
                                onToggleSidebar();
                            } else {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                            }
                        }}
                        className="p-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/10 text-foreground/60 hover:text-foreground active:scale-95 transition-all mr-2 group"
                    >
                        <div className="relative w-5 h-5 overflow-hidden">
                            <motion.div
                                animate={{
                                    rotate: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 90 : 0,
                                    scale: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : 1,
                                    opacity: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : 1
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Menu className="w-5 h-5" />
                            </motion.div>
                            <motion.div
                                animate={{
                                    rotate: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -90,
                                    scale: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0,
                                    opacity: isMobileMenuOpen || (!isCollapsed && mounted && typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </motion.div>
                        </div>
                    </button>

                    {/* Branding - Synced with Landing Page */}
                    <Link href="/" className="hidden sm:flex items-center gap-3 group shrink-0">
                        <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-2xl border border-foreground/10 shrink-0 transition-transform group-hover:scale-110 duration-500">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
                            <Image
                                src="/logos/logo.png"
                                alt="Syamna Quran Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-black text-foreground tracking-tight">
                            Syamna <span className="text-primary transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,223,154,0.5)]">Quran</span>
                        </span>
                    </Link>

                    {/* Unified Search Bar - Mobile & Desktop (Centered on Desktop) */}
                    {!isReadingMode && (
                        <div className={cn(
                            "flex-1 relative group transition-all duration-500",
                            "lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-md lg:flex-none"
                        )}>
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={getSearchPlaceholder()}
                                className="w-full h-9 sm:h-10 pl-10 pr-10 bg-foreground/[0.03] border border-foreground/10 rounded-xl text-xs font-body focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-foreground/20 text-foreground"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-foreground/10 text-foreground/30 hover:text-foreground transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0 md:gap-3">
                    {/* Theme & Language Toggles - Desktop only */}
                    <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-foreground/5 border border-foreground/10">
                        <button
                            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-primary"
                            title={mounted ? (resolvedTheme === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap") : ""}
                        >
                            {mounted && (resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                        </button>
                        <div className="w-px h-4 bg-foreground/10 mx-1" />
                        <button
                            onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
                            className="px-2 py-1 rounded-lg hover:bg-foreground/10 transition-colors text-[10px] font-black text-foreground/50 hover:text-foreground"
                            title="Ganti Bahasa"
                        >
                            {language}
                        </button>
                    </div>

                    {/* Simplified User Menu Dropdown - Desktop Only */}
                    <div ref={dropdownRef} className="relative block">
                        <button
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className={cn(
                                "flex items-center gap-2 p-1 rounded-full transition-all duration-300",
                                isUserDropdownOpen ? "bg-foreground/10" : "hover:bg-foreground/5"
                            )}
                        >
                            {loading ? (
                                <div className="w-9 h-9 rounded-full bg-foreground/5 animate-pulse" />
                            ) : user ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-foreground/10 bg-background flex items-center justify-center">
                                        {user.user_metadata.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt={user.user_metadata.full_name || "User"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <User className="w-4 h-4 text-foreground/40" />
                                        )}
                                    </div>
                                    <ChevronDown className={cn("w-3.5 h-3.5 text-foreground/40 transition-transform hidden md:block", isUserDropdownOpen && "rotate-180")} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all">
                                    <LogIn className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{t('masuk')}</span>
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {isUserDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[60] bg-transparent"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 top-full mt-3 w-56 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-md shadow-2xl z-[70] overflow-hidden"
                                    >
                                        <div className="p-2 space-y-1">
                                            {/* Mobile Toggles inside Dropdown */}
                                            <div className="lg:hidden p-2 mb-2 bg-foreground/5 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">{language === 'ID' ? 'Mode' : 'Theme'}</span>
                                                    <div className="flex items-center gap-1 bg-background/50 p-1 rounded-sm">
                                                        <button
                                                            onClick={() => setTheme("light")}
                                                            className={cn("p-1.5 rounded-sm transition-all", (mounted && resolvedTheme === "light") ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40")}
                                                        >
                                                            <Sun className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setTheme("dark")}
                                                            className={cn("p-1.5 rounded-sm transition-all", (mounted && resolvedTheme === "dark") ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40")}
                                                        >
                                                            <Moon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">{language === 'ID' ? 'Bahasa' : 'Language'}</span>
                                                    <button
                                                        onClick={() => setLanguage(language === "ID" ? "EN" : "ID")}
                                                        className="px-3 py-1 rounded-sm bg-background/50 text-[10px] font-black text-foreground hover:bg-primary/20 hover:text-primary transition-all border border-foreground/5"
                                                    >
                                                        {language}
                                                    </button>
                                                </div>
                                            </div>

                                            {user && (
                                                <div className="px-4 py-3 border-b border-foreground/5 mb-1">
                                                    <p className="text-xs font-black text-foreground truncate">{user.user_metadata.full_name}</p>
                                                    <p className="text-[10px] text-foreground/30 truncate">{user.email}</p>
                                                </div>
                                            )}
                                            
                                            {user && (
                                                <button
                                                    onClick={() => { setIsProfileOpen(true); setIsUserDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all group text-left"
                                                >
                                                    <User className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('profil')}</span>
                                                </button>
                                            )}

                                            {/* Settings - Always show in app dropdown */}
                                            <SettingsSheet>
                                                <button
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all group text-left"
                                                >
                                                    <Settings className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('pengaturan')}</span>
                                                </button>
                                            </SettingsSheet>

                                            {!user ? (
                                                <button
                                                    onClick={() => { signInWithGoogle(); setIsUserDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary transition-all group text-left"
                                                >
                                                    <LogIn className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('masuk')} via Google</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { signOut(); setIsUserDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-foreground/60 hover:text-red-500 transition-all group text-left"
                                                >
                                                    <LogOut className="w-4 h-4 text-foreground/40 group-hover:text-red-500 transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('keluar')}</span>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <ProfileSheet 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </nav>
    );
}

