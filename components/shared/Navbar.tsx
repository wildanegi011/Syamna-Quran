"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Menu, X, BookOpen, Sparkles, ChevronDown, Moon, BookText, HandHelping, Clock, LogIn } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            ? "bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 py-3"
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-8 text-white">
          {/* Column 1: Logo & Name (Left) */}
          <div className="flex-initial lg:flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 transition-transform group-hover:scale-110 duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00df9a]/20 to-transparent z-10" />
                <Image
                  src="/logos/white.png"
                  alt="Syamna Quran Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg md:text-2xl font-black text-white tracking-tight">
                Syamna <span className="text-[#00df9a] transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,223,154,0.5)]">Quran</span>
              </span>
            </Link>
          </div>

          {/* Column 2: Navigation Features (Center) */}
          <div className="hidden xl:flex items-center justify-center gap-1 flex-[2]">
            {modules.map((module) => {
              const Icon = iconMap[module.icon] || Sparkles;
              return (
                <Link
                  key={module.id}
                  href={module.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 group hover:bg-white/5 shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-[#00df9a]/10 group-hover:border-[#00df9a]/30 transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-[#00df9a]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors whitespace-nowrap">
                    {module.title}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Column 3: Account/Login (Right) */}
          <div className="flex-initial lg:flex-1 flex justify-end items-center gap-2 sm:gap-4">
            {loading ? (
              <div className="w-10 h-10 sm:w-24 h-10 rounded-xl bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-3 px-2 sm:px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden ring-2 ring-[#00df9a]/20 group-hover:ring-[#00df9a]/40 transition-all">
                    {user.user_metadata.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.full_name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#00df9a]/20 flex items-center justify-center">
                        <User className="w-3 h-3 text-[#00df9a]" />
                      </div>
                    )}
                  </div>
                  <span className="hidden xl:block text-sm font-bold text-white/50 group-hover:text-white transition-colors">{user.user_metadata.full_name?.split(' ')[0]}</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 text-white/40 hover:text-red-500 transition-all shrink-0"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white active:scale-95 transition-all group"
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
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-[160] bg-[#020617]/90 backdrop-blur-3xl border-l border-white/5 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Fitur</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
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
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-[#00df9a]/10 border border-white/5 hover:border-[#00df9a]/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#00df9a]/20 transition-colors">
                        <Icon className="w-5 h-5 text-white/30 group-hover:text-[#00df9a] transition-all group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">{module.title}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Authentication Section in Drawer */}
              <div className="mt-auto space-y-4 pt-8 border-t border-white/10">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10">
                        {user.user_metadata.avatar_url ? (
                          <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#00df9a]/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-[#00df9a]" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-white text-sm truncate">{user.user_metadata.full_name}</span>
                        <span className="text-[10px] text-white/30 truncate">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      className="w-full rounded-2xl flex items-center gap-2 h-14 font-black uppercase tracking-widest border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-500/60 hover:text-red-500 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-[#00df9a] hover:bg-[#00df9a] text-black font-black uppercase tracking-widest gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                  >
                    <LogIn className="w-6 h-6" />
                    Masuk Sekarang
                  </Button>
                )}
                
                {/* Branding / Footer inside Drawer */}
                <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] pt-4">
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
