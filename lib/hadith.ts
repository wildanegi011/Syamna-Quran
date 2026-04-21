import { HadithCategory, HadithSummary, HadithDetail } from "./types";
import { CONFIG } from "./api-config";

const HADITH_API_BASE = CONFIG.HADIST_API;


export async function getHadithCategories(): Promise<HadithCategory[]> {
    try {
        const response = await fetch(`${HADITH_API_BASE}/categories/list/?language=id`);
        if (!response.ok) throw new Error("Failed to fetch hadith categories");
        return await response.json();
    } catch (error) {
        console.error("Error fetching hadith categories:", error);
        return [];
    }
}

export async function getHadithList(categoryId: string, page: number = 1, perPage: number = 20): Promise<HadithSummary[]> {
    try {
        const response = await fetch(
            `${HADITH_API_BASE}/hadeeths/list/?language=id&category_id=${categoryId}&page=${page}&per_page=${perPage}`
        );
        if (!response.ok) throw new Error("Failed to fetch hadith list");
        
        const result = await response.json();
        // The API returns { data: [...], meta: {...} } or just [...] 
        // Based on common patterns in HadithEnc, but let's handle both.
        if (result.data) return result.data;
        return result;
    } catch (error) {
        console.error("Error fetching hadith list:", error);
        return [];
    }
}

export async function getHadithDetail(id: string): Promise<HadithDetail | null> {
    try {
        const response = await fetch(`${HADITH_API_BASE}/hadeeths/one/?id=${id}&language=id`);
        if (!response.ok) throw new Error(`Failed to fetch hadith detail for ID ${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching hadith detail ${id}:`, error);
        return null;
    }
}
