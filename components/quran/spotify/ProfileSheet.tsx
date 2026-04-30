"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuranFoundation } from "@/hooks/use-quran-foundation";
import { User, Mail, Shield, Calendar, MapPin, Globe } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSheet({ isOpen, onClose }: ProfileSheetProps) {
  const { profile } = useQuranFoundation();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-foreground/5 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>View and manage your Quran Foundation profile details.</SheetDescription>
        </SheetHeader>
        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
          {/* Header/Cover Image */}
          <div className="h-32 bg-primary/10 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 rounded-2xl bg-background border-4 border-background shadow-xl overflow-hidden relative">
                {profile.data?.picture ? (
                  <Image src={profile.data.picture} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 pt-14 pb-8 space-y-6">
            {/* Name & Basic Info */}
            <div className="space-y-1">
              {profile.isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h2 className="text-2xl font-black text-foreground">
                  {profile.data?.first_name} {profile.data?.last_name}
                </h2>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest">
                  Verified Syamna User
                </Badge>
              </div>
            </div>

            <Separator className="bg-foreground/5" />

            {/* Profile Statistics or Details */}
            <div className="grid grid-cols-1 gap-6 text-sm">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Detail Akun</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground/60">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{profile.data?.email || "Email tidak tersedia"}</span>
                  </div>
                  
                  {profile.data?.username && (
                    <div className="flex items-center gap-3 text-foreground/60">
                      <Globe className="w-4 h-4 text-primary" />
                      <span>@{profile.data.username}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-foreground/60">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>ID Foundation: {profile.data?.id || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Izin Akses (Scopes)</h3>
                <div className="flex flex-wrap gap-2">
                  {["openid", "user", "bookmark", "note", "streak"].map(scope => (
                    <Badge key={scope} variant="secondary" className="bg-foreground/5 text-[9px] font-bold">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 relative overflow-hidden group">
               <div className="relative z-10 space-y-2">
                  <h4 className="font-black text-foreground text-sm uppercase tracking-wider">Status Premium Aktif</h4>
                  <p className="text-[10px] text-foreground/60 font-medium leading-relaxed">
                    Anda memiliki akses penuh ke fitur gamifikasi dan sinkronisasi awan Syamna Quran.
                  </p>
               </div>
               <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>

          <div className="mt-auto p-8 border-t border-foreground/5">
             <p className="text-[9px] text-center font-bold text-foreground/20 uppercase tracking-[0.4em]">
               Syaman Quran Profile System v1.0
             </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
