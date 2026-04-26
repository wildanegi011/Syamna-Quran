"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User as UserIcon, LogOut } from "lucide-react";
import Image from "next/image";

interface IqroHeaderProps {
    levelId: number;
    levelTitle?: string;
    currentPage: number;
    totalPages: number;
}

export function IqroHeader({ levelId, levelTitle, currentPage, totalPages }: IqroHeaderProps) {
    const router = useRouter();
    const { user, loading, signOut, signInWithGoogle } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b h-16 md:h-24 flex items-center px-4 md:px-10 justify-between transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 md:w-14 md:h-14 bg-white/50 dark:bg-white/10 hover:bg-primary/10 transition-colors border border-white/40 dark:border-white/10 shadow-lg"
                    onClick={() => router.push('/iqro')}
                >
                    <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                </Button>
                <div className="space-y-0.5 md:space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60">Pelajaran Aktif</span>
                    </div>
                    <h1 className="text-sm md:text-lg font-black tracking-tighter leading-none flex items-center gap-2 md:gap-3">
                        {levelTitle || `Iqro ${levelId}`}
                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/40" />
                        <span className="text-[10px] md:text-xs text-muted-foreground opacity-60">Halaman {currentPage} dari {totalPages}</span>
                    </h1>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {loading ? (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 animate-pulse" />
                ) : user ? (
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex flex-col items-end text-right">
                            <span className="text-xs font-bold text-white leading-tight">
                                {user.user_metadata.full_name?.split(' ')[0]}
                            </span>
                            <span className="text-[8px] font-bold text-primary uppercase tracking-wide">IQRO LEARNER</span>
                        </div>
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10 bg-surface-container-highest flex items-center justify-center group cursor-pointer" onClick={signOut} title="Sign Out">
                            {user.user_metadata.avatar_url ? (
                                <Image
                                    src={user.user_metadata.avatar_url}
                                    alt={user.user_metadata.full_name || "User"}
                                    fill
                                    className="object-cover group-hover:opacity-20 transition-opacity"
                                />
                            ) : (
                                <UserIcon className="w-4 h-4 text-white/40 group-hover:opacity-20 transition-opacity" />
                            )}
                            <LogOut className="absolute inset-0 m-auto w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ) : null}
                {false && !user && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full h-10 px-6 bg-primary/10 border-primary/20 text-primary font-bold"
                        onClick={signInWithGoogle}
                    >
                        Masuk
                    </Button>
                )}
            </div>
        </header>
    );
}
