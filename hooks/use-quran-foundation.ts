import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Profile {
    id: string;
    full_name: string;
    email: string;
}

interface Streak {
    streak: number;
    last_activity_at: string;
    max_streak: number;
}

interface Activity {
    id: string;
    day: string;
    duration: number; // in seconds
    verses_count: number;
}

export function useQuranFoundation() {
    const queryClient = useQueryClient();

    // Fetch user profile
    const profile = useQuery<Profile>({
        queryKey: ["qf-profile"],
        queryFn: async () => {
            const res = await fetch("/api/quran/user/profile");
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
        retry: false,
    });

    // Fetch Streaks
    const streaks = useQuery<Streak>({
        queryKey: ["qf-streaks"],
        queryFn: async () => {
            const res = await fetch("/api/quran/user/streaks");
            if (!res.ok) throw new Error("Failed to fetch streaks");
            return res.json();
        },
        enabled: !!profile.data,
    });

    // Fetch Today's Activity
    const todayActivity = useQuery<Activity>({
        queryKey: ["qf-activity-today"],
        queryFn: async () => {
            const res = await fetch("/api/quran/user/activity-days/today");
            if (!res.ok) throw new Error("Failed to fetch activity");
            return res.json();
        },
        enabled: !!profile.data,
    });

    // Log Activity
    const logActivity = useMutation({
        mutationFn: async (data: { duration: number; verses_count: number }) => {
            const res = await fetch("/api/quran/user/activity-days", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to log activity");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qf-activity-today"] });
            queryClient.invalidateQueries({ queryKey: ["qf-streaks"] });
        },
    });

    return {
        profile,
        streaks,
        todayActivity,
        logActivity,
        isConnected: !!profile.data && !profile.isError,
    };
}
