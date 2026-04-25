"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/quran/auth/status");
      const data = await res.json();

      if (data.connected && data.user) {
        setUser({
          id: data.user.sub,
          email: data.user.email,
          user_metadata: {
            full_name: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
            avatar_url: data.user.picture || null,
          }
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/quran") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        // Forward code/state to API callback if redirected to /quran directly (QF Dashboard issue)
        const forwardKey = `qf_fwd_${state}`;
        if (!sessionStorage.getItem(forwardKey)) {
          sessionStorage.setItem(forwardKey, "true");
          const callbackUrl = new URL("https://syamna-quran.netlify.app/api/quran/auth/callback");
          callbackUrl.searchParams.set("code", code);
          callbackUrl.searchParams.set("state", state);
          window.location.href = callbackUrl.toString();
          return;
        }
        // Cleanup URL if already forwarded
        window.history.replaceState({}, "", "/quran");
      }
    }
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    signOut: async () => {
      window.location.href = "https://syamna-quran.netlify.app/api/quran/auth/logout";
    },
    signInWithGoogle: async () => {
      window.location.href = "https://syamna-quran.netlify.app/api/quran/auth/login";
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
