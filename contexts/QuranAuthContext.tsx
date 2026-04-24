"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

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
    const [isConnected, setIsConnected] = useState(false);
    const [qfUser, setQfUser] = useState<QFUser | null>(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/quran/status");
            const data = await res.json();
            setIsConnected(data.connected);
            setQfUser(data.user);
        } catch {
            setIsConnected(false);
            setQfUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const connectQuranAccount = () => {
        // Redirect ke QF OAuth login — akan kembali ke /quran setelah selesai
        window.location.href = "/api/quran/login";
    };

    const disconnectQuranAccount = () => {
        // Redirect ke QF logout — akan kembali ke /quran
        window.location.href = "/api/quran/logout";
    };

    const refreshStatus = async () => {
        setLoading(true);
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
