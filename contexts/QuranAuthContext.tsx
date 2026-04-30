"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface QFUser {
    sub: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

interface QuranAuthContextType {
    /** Apakah akun Quran Foundation sudah terkoneksi */
    isConnected: boolean;
    /** User info dari Quran Foundation (sub, email, dst) */
    qfUser: QFUser | null;
    /** Loading state saat cek status */
    loading: boolean;
    /** Hubungkan akun Quran Foundation — redirect ke QF login */
    connectQuranAccount: () => void;
    /** Putuskan koneksi akun Quran Foundation */
    disconnectQuranAccount: () => void;
    /** Refresh status koneksi */
    refreshStatus: () => Promise<void>;
}

const QuranAuthContext = createContext<QuranAuthContextType | undefined>(
    undefined
);

export function QuranAuthProvider({ children }: { children: React.ReactNode }) {
    // Use the SAME query key and logic as the main AuthProvider for automatic deduplication
    const { data: authData, isLoading, refetch } = useQuery({
        queryKey: ["qf-auth-status"],
        queryFn: async () => {
            const res = await fetch("/api/quran/auth/status");
            if (!res.ok) throw new Error("Gagal mengambil status auth");
            return res.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const isConnected = !!(authData?.connected && authData.user);
    const qfUser = authData?.user || null;
    const loading = isLoading;

    const checkStatus = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const connectQuranAccount = () => {
        // Redirect ke QF OAuth login — akan kembali ke /quran setelah selesai
        window.location.href = "/api/quran/auth/login";
    };

    const disconnectQuranAccount = () => {
        // Redirect ke QF logout — akan kembali ke /quran
        window.location.href = "/api/quran/auth/logout";
    };

    const refreshStatus = async () => {
        await checkStatus();
    };

    return (
        <QuranAuthContext.Provider
            value={{
                isConnected,
                qfUser,
                loading,
                connectQuranAccount,
                disconnectQuranAccount,
                refreshStatus,
            }}
        >
            {children}
        </QuranAuthContext.Provider>
    );
}

export const useQuranAuth = () => {
    const context = useContext(QuranAuthContext);
    if (context === undefined) {
        throw new Error(
            "useQuranAuth must be used within a QuranAuthProvider"
        );
    }
    return context;
};
