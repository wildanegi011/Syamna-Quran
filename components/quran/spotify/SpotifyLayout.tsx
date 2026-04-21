"use client";

import React from 'react';
import { Sidebar as QuranSidebar } from './QuranSidebar';
import { TopNavBar } from './TopNavBar';
import { ScrollToTop } from './ScrollToTop';
import { AmbientBackground } from '@/components/shared/AmbientBackground';
import { usePathname, useParams } from 'next/navigation';
import { Home, Search, BookOpen, Clock, Sparkles, Heart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { useAudioState } from '@/contexts/AudioContext';
import { NowPlayingPanel } from './NowPlayingPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { TajweedLegend } from '../TajweedLegend';

export function SpotifyLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useParams();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const { isRightPanelOpen, setRightPanelOpen } = useAudioState();
    const [isTajweedOpen, setIsTajweedOpen] = React.useState(false);

    // Persist collapse state
    React.useEffect(() => {
        const saved = localStorage.getItem('syamna_sidebar_collapsed');
        if (saved !== null) setIsCollapsed(saved === 'true');
    }, []);

    const toggleCollapse = React.useCallback(() => {
        setIsCollapsed(prev => {
            const next = !prev;
            localStorage.setItem('syamna_sidebar_collapsed', String(next));
            return next;
        });
    }, []);

    // Landing page condition
    const isLandingPage = pathname === '/';

    // Reading mode condition (Quran Detail)
    const isReadingMode = !!params.id && pathname.includes('/quran/');

    // Quran Module condition - Sidebar only for Quran
    const isQuranModule = pathname.startsWith('/quran');

    React.useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setIsScrolled(scrollContainerRef.current.scrollTop > 20);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // If it's the landing page, just render children
    if (isLandingPage) return <>{children}</>;

    const navItems = [
        { icon: Home, label: 'Beranda', href: '/' },
        { icon: BookOpen, label: 'Quran', href: '/quran' },
        { icon: Sparkles, label: 'Asmaul Husna', href: '/asmaul-husna' },
        { icon: Clock, label: 'Sholat', href: '/jadwal-sholat' },
        { icon: Heart, label: 'Doa', href: '/doa' },
    ];

    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-surface overflow-hidden p-0 m-0 relative">
            {/* Ambient Background layer */}
            <div className="fixed inset-0 z-0 text-primary">
                <AmbientBackground className="opacity-10 mix-blend-screen" />
            </div>

            {/* Main Application Structure */}
            <div className="flex flex-1 overflow-hidden p-0 relative z-10">
                {/* Desktop Sidebar */}
                <QuranSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />

                {/* Content Area + Right Panel Container */}
                <div className={cn(
                    "flex-1 flex overflow-hidden",
                    isCollapsed ? "md:ml-20" : "md:ml-72"
                )}>
                    {/* Main Content Area - Hidden when Reading Panel is Open for Focus (Quran Only) */}
                    <div className={cn(
                        "flex-1 flex flex-col min-w-0 h-full relative transition-all duration-500",
                        (isQuranModule && isRightPanelOpen) ? "hidden lg:flex" : "flex"
                    )}>
                        {/* Floating Top Nav - Hide in Reading Mode */}
                        {!isReadingMode && (
                            <TopNavBar
                                isReadingMode={isReadingMode}
                                isScrolled={isScrolled}
                                isCollapsed={isCollapsed}
                            />
                        )}

                        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto relative scrollbar-hide md:scrollbar-default pt-0">
                            <div className="relative z-0 min-h-full flex flex-col">
                                {children}
                            </div>
                        </main>
                    </div>

                    {/* Desktop Right Sidebar (Now Playing Panel) - Only in Quran Module */}
                    <AnimatePresence>
                        {isQuranModule && (
                            isRightPanelOpen ? (
                                <NowPlayingPanel
                                    key="panel"
                                    onOpenTajweed={() => setIsTajweedOpen(true)}
                                />
                            ) : (
                                <motion.button
                                    key="trigger"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                                    onClick={() => setRightPanelOpen(true)}
                                    className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-8 h-16 rounded-l-2xl bg-primary/10 hover:bg-primary/20 border-l border-y border-primary/20 backdrop-blur-3xl flex items-center justify-center text-primary/60 hover:text-primary transition-all shadow-[-10px_0_30px_rgba(0,0,0,0.5)] group/open-side"
                                    title="Buka Panel"
                                >
                                    <ChevronLeft className="w-5 h-5 transition-transform group-hover/open-side:-translate-x-1 cursor-pointer" />
                                </motion.button>
                            )
                        )}
                    </AnimatePresence>
                </div>

                {/* Scroll to Top button in reading mode */}
                {isReadingMode && <ScrollToTop />}
            </div>

            {/* Mobile Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/70 backdrop-blur-3xl border-t border-outline-variant/10 flex items-center justify-around z-50 px-6 pb-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 transition-all duration-300",
                                isActive ? "text-primary scale-110" : "text-secondary opacity-60 hover:opacity-100"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                            <span className="text-[9px] font-label font-black uppercase tracking-[0.2em]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>



            {/* Global Tajweed Legend & Interactive Tooltips */}
            <TajweedLegend isOpen={isTajweedOpen} onOpenChange={setIsTajweedOpen} />
        </div>
    );
}


