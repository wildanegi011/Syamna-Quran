"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CONFIG } from "@/lib/api-config";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global lock to prevent double-checks during StrictMode or remounts
let hasCheckedAuth = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use React Query for auth status check (automatic deduplication and caching)
  const { data: authData, isLoading } = useQuery({
    queryKey: ["qf-auth-status"],
    queryFn: async () => {
      const res = await fetch("/api/quran/auth/status");
      if (!res.ok) throw new Error("Gagal mengambil status auth");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Token status stable for 5 mins
    retry: 1,
  });

  const user = useMemo(() => {
    if (authData?.connected && authData.user) {
      return {
        id: authData.user.sub,
        email: authData.user.email,
        firstName: authData.user.firstName,
        lastName: authData.user.lastName,
        picture: authData.user.picture,
        user_metadata: {
          full_name: `${authData.user.firstName || ""} ${authData.user.lastName || ""}`.trim() || authData.user.email?.split("@")[0] || "User",
          avatar_url: authData.user.picture || null,
        }
      };
    }
    return null;
  }, [authData]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/quran") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        // Forward code/state to API callback if redirected to /quran langsung
        const forwardKey = `qf_fwd_${state}`;
        if (!sessionStorage.getItem(forwardKey)) {
          sessionStorage.setItem(forwardKey, "true");
          const callbackUrl = new URL(`${CONFIG.NEXT_PUBLIC_URL}/api/quran/auth/callback`);
          callbackUrl.searchParams.set("code", code);
          callbackUrl.searchParams.set("state", state);
          window.location.href = callbackUrl.toString();
          return;
        }
        // Cleanup URL jika sudah diforward
        window.history.replaceState({}, "", "/quran");
      }
    }
  }, []);

  const value = {
    user,
    loading: isLoading,
    signOut: async () => {
      // Clear local auth cookies for a clean state
      document.cookie = "qf_connected=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "qf_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = `${CONFIG.NEXT_PUBLIC_URL}/api/quran/auth/logout`;
    },
    signInWithGoogle: async () => {
      window.location.href = `${CONFIG.NEXT_PUBLIC_URL}/api/quran/auth/login`;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
