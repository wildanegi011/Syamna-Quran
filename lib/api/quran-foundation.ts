import { CONFIG } from "@/lib/api-config";

export interface QFProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    picture?: string;
    username?: string;
}

export interface QFStreak {
    id: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "BROKEN";
    days: number;
}

export interface QFCurrentStreakDays {
    days: number;
}

export interface QFActivityPayload {
    date: string;
    type: "QURAN";
    seconds: number;
    ranges: string[];
    mushafId?: number;
}

export interface QFBookmark {
    id: string;
    type: "ayah";
    key: number;
    verseNumber: number;
    isReading: boolean;
}

/**
 * Fetches the user profile from Quran Foundation.
 */
export async function getQFProfile(): Promise<QFProfile> {
    const res = await fetch("/api/quran/user/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}

/**
 * Fetches streak summary from Quran Foundation.
 */
export async function getQFStreaks(): Promise<QFStreak[]> {
    const res = await fetch("/api/quran/user/streaks?first=10&type=QURAN");
    if (!res.ok) throw new Error("Failed to fetch streaks");
    const json = await res.json();
    return json.data;
}

/**
 * Fetches current streak days from Quran Foundation.
 */
export async function getQFCurrentStreakDays(): Promise<QFCurrentStreakDays> {
    const res = await fetch("/api/quran/user/streaks/current-streak-days?type=QURAN");
    if (!res.ok) throw new Error("Failed to fetch current streak");
    const json = await res.json();
    return json.data;
}

/**
 * Logs activity to Quran Foundation.
 */
export async function logQFActivity(payload: QFActivityPayload): Promise<any> {
    const finalPayload = {
        ...payload,
        mushafId: payload.mushafId ?? CONFIG.QURAN_FOUNDATION_MUSHAF_ID
    };
    const res = await fetch("/api/quran/user/activity-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
    });
    if (!res.ok) throw new Error("Failed to log activity");
    return res.json();
}

/**
 * Fetches the user's reading bookmark.
 * Since isReading is a singleton, it will either return the bookmark or null.
 */
export async function getQFReadingBookmark(): Promise<QFBookmark | null> {
    const res = await fetch("/api/quran/user/bookmarks?mushafId=4&first=20");
    if (!res.ok) return null;
    const json = await res.json();

    // Sometimes the API returns an array or an object depending on the endpoint structure.
    // If it's an array, find the reading one. But `isReading=true` might return just the object or an array.
    if (Array.isArray(json.data)) {
        return json.data.find((b: any) => b.isReading) || null;
    }
    return json.data || null;
}

/**
 * Sets the reading bookmark to a specific surah and ayah.
 */
export async function setQFReadingBookmark(surahId: number, ayahId: number): Promise<any> {
    const res = await fetch("/api/quran/user/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: "ayah",
            key: surahId,
            verseNumber: ayahId,
            isReading: true,
            mushafId: 4,
            mushaf: 4
        })
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Failed to set reading bookmark: ${err.message || 'Unknown error'}`);
    }
    return res.json();
}

export interface QFActivityDay {
    id: string;
    date: string;       // "YYYY-MM-DD"
    progress: number;   // 0-1 percentage
    type: string;
    ranges: string[];
    pagesRead?: number;
    secondsRead?: number;
    versesRead?: number;
}

/**
 * Fetches user activity days for a given date range from Quran Foundation.
 */
export async function getQFActivityDays(from: string, to: string): Promise<QFActivityDay[]> {
    const res = await fetch(`/api/quran/user/activity-days?from=${from}&to=${to}&type=QURAN&first=10`);
    if (!res.ok) {
        console.error(`Activity days fetch failed: ${res.status}`);
        return [];
    }
    const json = await res.json();
    return json.data || [];
}
