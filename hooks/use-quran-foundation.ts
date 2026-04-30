import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
    getQFProfile,
    getQFStreaks,
    QFProfile,
    QFStreak,
    QFCurrentStreakDays,
    getQFCurrentStreakDays,
    logQFActivity,
    QFActivityPayload,
    QFBookmark,
    getQFReadingBookmark,
    setQFReadingBookmark
} from "@/lib/api/quran-foundation";

export const qfKeys = {
    all: ["qf"] as const,
    profile: () => [...qfKeys.all, "profile"] as const,
    streaks: () => [...qfKeys.all, "streaks"] as const,
    currentStreak: () => [...qfKeys.all, "current-streak"] as const,
    readingBookmark: () => [...qfKeys.all, "reading-bookmark"] as const,
};

export function useQuranFoundation() {
    const queryClient = useQueryClient();
    const { user, loading: authLoading } = useAuth();
    const isConnected = !!user;

    // Fetch user profile
    const profile = useQuery<QFProfile>({
        queryKey: qfKeys.profile(),
        queryFn: getQFProfile,
        retry: false,
        enabled: isConnected,
    });

    // Fetch Streaks Summary
    const streaks = useQuery<QFStreak[]>({
        queryKey: qfKeys.streaks(),
        queryFn: getQFStreaks,
        enabled: isConnected,
    });

    // Fetch Current Streak Days
    const currentStreakCount = useQuery<QFCurrentStreakDays>({
        queryKey: qfKeys.currentStreak(),
        queryFn: getQFCurrentStreakDays,
        enabled: isConnected,
    });

    // Log Activity
    const logActivity = useMutation({
        mutationFn: logQFActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qfKeys.currentStreak() });
            queryClient.invalidateQueries({ queryKey: qfKeys.streaks() });
        }
    });

    // Fetch Reading Bookmark
    const readingBookmark = useQuery<QFBookmark | null>({
        queryKey: qfKeys.readingBookmark(),
        queryFn: getQFReadingBookmark,
        enabled: isConnected,
    });

    // Set Reading Bookmark
    const toggleReadingBookmark = useMutation({
        mutationFn: ({ surahId, ayahId }: { surahId: number, ayahId: number }) => 
            setQFReadingBookmark(surahId, ayahId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qfKeys.readingBookmark() });
        }
    });

    return {
        profile,
        streaks,
        currentStreakCount,
        logActivity,
        readingBookmark,
        toggleReadingBookmark,
        isConnected,
        authLoading
    };
}
