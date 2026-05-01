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
    setQFReadingBookmark,
    QFActivityDay,
    getQFActivityDays
} from "@/lib/api/quran-foundation";

export const qfKeys = {
    all: ["qf"] as const,
    profile: () => [...qfKeys.all, "profile"] as const,
    streaks: () => [...qfKeys.all, "streaks"] as const,
    currentStreak: () => [...qfKeys.all, "current-streak"] as const,
    readingBookmark: () => [...qfKeys.all, "reading-bookmark"] as const,
    activityDays: () => [...qfKeys.all, "activity-days"] as const,
};

/** Returns Monday..Sunday date range for the current week */
function getWeekRange(): { from: string; to: string } {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const fromDate = fmt(monday);
    const toDate = fmt(now); // Cap at today instead of next Sunday
    
    return { from: fromDate, to: toDate };
}

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

    // Fetch Weekly Activity Days
    const { from: weekFrom, to: weekTo } = getWeekRange();
    const activityDays = useQuery<QFActivityDay[]>({
        queryKey: [...qfKeys.activityDays(), weekFrom],
        queryFn: () => getQFActivityDays(weekFrom, weekTo),
        enabled: isConnected,
    });

    // Log Activity
    const logActivity = useMutation({
        mutationFn: logQFActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qfKeys.currentStreak() });
            queryClient.invalidateQueries({ queryKey: qfKeys.streaks() });
            queryClient.invalidateQueries({ queryKey: qfKeys.activityDays() });
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
        activityDays,
        logActivity,
        readingBookmark,
        toggleReadingBookmark,
        isConnected,
        authLoading
    };
}
