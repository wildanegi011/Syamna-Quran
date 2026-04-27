"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { LogOut, User, Menu, X, BookOpen, Sparkles, ChevronDown, Moon, Sun, BookText, HandHelping, Clock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppModules } from "@/hooks/use-modules";

const iconMap: Record<string, any> = {
  "Moon": Moon,
  "BookText": BookText,
  "HandHelping": HandHelping,
  "Sparkles": Sparkles,
  "Clock": Clock,
};

export function Navbar() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const { data: modules = [] } = useAppModules();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("ID");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Auto close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-4 sm:px-6 md:px-12",
          isScrolled
            ? "bg-background/70 backdrop-blur-2xl border-b border-foreground/5 py-3"
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-8 text-foreground">
          {/* Column 1: Logo & Name (Left) */}
          <div className="flex-initial lg:flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-2xl border border-foreground/10 shrink-0 transition-transform group-hover:scale-110 duration-500">
                <div className="absolute inset-0 bg-primary/20 to-transparent z-10" />
                <Image
                  src="/logos/logo.png"
                  alt="Syamna Quran Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg md:text-2xl font-black text-foreground tracking-tight">
                Syamna <span className="text-primary transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,223,154,0.5)]">Quran</span>
              </span>
            </Link>
          </div>

          {/* Column 2: Navigation Features (Center) - Hidden per request */}
          {/* <div className="hidden xl:flex items-center justify-center gap-1 flex-[2]">
            {modules.map((module) => {
              const Icon = iconMap[module.icon] || Sparkles;
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-500 group shrink-0",
                    module.id === 1 ? "bg-foreground/5 border border-foreground/5" : "hover:bg-foreground/5"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 group-hover:scale-110",
                    module.id === 1 
                      ? "bg-[#00df9a]/20 border-[#00df9a]/40 group-hover:bg-[#00df9a]/30" 
                      : "bg-foreground/5 border-foreground/5 group-hover:bg-[#00df9a]/10 group-hover:border-[#00df9a]/30"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4 transition-colors", 
                      module.id === 1 ? "text-[#00df9a]" : "text-foreground/40 group-hover:text-[#00df9a]"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-colors whitespace-nowrap",
                    module.id === 1 ? "text-foreground" : "text-foreground/50 group-hover:text-foreground"
                  )}>
                    {module.title}
                  </span>
                  {module.id === 1 && (
                    <div className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df9a] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00df9a]"></span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div> */}

          {/* Column 3: Account/Login (Right) */}
          <div className="flex-initial lg:flex-1 flex justify-end items-center gap-2 sm:gap-4">
            {/* Theme & Language Toggles - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-foreground/5 border border-foreground/5">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-primary"
                title={mounted ? (theme === "dark" ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap") : ""}
              >
                {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
              </button>
              <div className="w-px h-4 bg-foreground/10 mx-1" />
              <button
                onClick={() => setLanguage(l => l === "ID" ? "EN" : "ID")}
                className="px-2 py-1 rounded-lg hover:bg-foreground/10 transition-colors text-[10px] font-black text-foreground/50 hover:text-foreground"
                title="Ganti Bahasa"
              >
                {language}
              </button>
            </div>


            {/* Unified User Dropdown - Desktop Only */}
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={cn(
                  "flex items-center gap-2 p-1 rounded-full transition-all duration-300",
                  isUserDropdownOpen ? "bg-foreground/10" : "hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
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
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-foreground/40 transition-transform hidden md:block", isUserDropdownOpen && "rotate-180")} />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-foreground/10 text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
                    <LogIn className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Masuk</span>
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[160] bg-transparent"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-md shadow-2xl z-[170] overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        {/* Mobile Toggles inside Dropdown */}
                        <div className="lg:hidden p-2 mb-2 bg-foreground/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Mode</span>
                            <div className="flex items-center gap-1 bg-background/50 p-1 rounded-sm">
                              <button
                                onClick={() => setTheme("light")}
                                className={cn("p-1.5 rounded-sm transition-all", (mounted && theme === "light") ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40 hover:text-foreground")}
                              >
                                <Sun className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setTheme("dark")}
                                className={cn("p-1.5 rounded-sm transition-all", (mounted && theme === "dark") ? "bg-primary text-primary-foreground shadow-lg" : "text-foreground/40 hover:text-foreground")}
                              >
                                <Moon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Bahasa</span>
                            <button
                              onClick={() => setLanguage(l => l === "ID" ? "EN" : "ID")}
                              className="px-3 py-1 rounded-sm bg-background/50 text-[10px] font-black text-foreground/60 hover:bg-primary/20 hover:text-primary transition-all border border-foreground/5"
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

                        {!user ? (
                          <button
                            onClick={() => { signInWithGoogle(); setIsUserDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all group text-left"
                          >
                            <LogIn className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Masuk via Google</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => { signOut(); setIsUserDropdownOpen(false); }}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-foreground/60 hover:text-red-500 transition-all group text-left"
                            >
                              <LogOut className="w-4 h-4 text-foreground/40 group-hover:text-red-500 transition-colors" />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Keluar</span>
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground active:scale-95 transition-all group"
            >
              <div className="relative w-5 h-5">
                <motion.div
                  animate={{
                    rotate: isMobileMenuOpen ? 180 : 0,
                    opacity: isMobileMenuOpen ? 0 : 1
                  }}
                  className="absolute inset-0"
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{
                    rotate: isMobileMenuOpen ? 0 : -180,
                    opacity: isMobileMenuOpen ? 1 : 0
                  }}
                  className="absolute inset-0"
                >
                  <X className="w-5 h-5" />
                </motion.div>
              </div>
            </button>
          </div>

        </div>
      </motion.nav>

      {/* Unified Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-[160] bg-background/90 backdrop-blur-3xl border-l border-foreground/5 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Fitur</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground/20 hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2 mb-8">
                {modules.map((module) => {
                  const Icon = iconMap[module.icon] || Sparkles;
                  return (
                    <Link
                      key={module.id}
                      href={module.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.02] hover:bg-primary/10 border border-foreground/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-all group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-bold text-foreground/60 group-hover:text-foreground transition-colors uppercase tracking-widest">{module.title}</span>
                    </Link>
                  );
                })}

                {/* Theme & Language Toggles in Drawer */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Theme & Language</span>
                  </div>
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-foreground/5">
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-primary"
                    >
                      {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                    </button>
                    <div className="w-px h-4 bg-foreground/10 mx-1" />
                    <button
                      onClick={() => setLanguage(l => l === "ID" ? "EN" : "ID")}
                      className="px-2 py-1 rounded-lg hover:bg-foreground/10 transition-colors text-[10px] font-black text-foreground/50 hover:text-foreground"
                    >
                      {language}
                    </button>
                  </div>
                </div>
              </div>

              {/* Authentication Section in Drawer */}
              <div className="mt-auto space-y-4 pt-8 border-t border-foreground/10">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-foreground/5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-foreground/10">
                        {user.user_metadata.avatar_url ? (
                          <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-foreground text-sm truncate">{user.user_metadata.full_name}</span>
                        <span className="text-[10px] text-foreground/30 truncate">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full h-12 rounded-full border border-foreground/10 hover:bg-red-500/5 hover:border-red-500/20 text-foreground/40 hover:text-red-500 font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                      Keluar
                    </button>
                  </div>
                ) : null}
                {!user && (
                  <button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full h-14 rounded-full bg-foreground text-background font-black uppercase tracking-widest gap-4 transition-all active:scale-95 shadow-lg"
                  >
                    Masuk Sekarang
                  </button>
                )}

                {/* Branding / Footer inside Drawer */}
                <p className="text-center text-[9px] font-bold text-foreground/20 uppercase tracking-[0.3em] pt-4">
                  Syamna Quran &copy; 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  );
}
