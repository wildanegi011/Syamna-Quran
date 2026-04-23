import { HadithCategory, HadithSummary, HadithDetail } from "./types";
import { fetchHadithCategories, fetchHadithList, fetchHadithDetail } from "./api/hadith";

export async function getHadithCategories(): Promise<HadithCategory[]> {
    try {
        return await fetchHadithCategories();
    } catch (error) {
        console.error("Error fetching hadith categories:", error);
        return [];
    }
}

export async function getHadithList(categoryId: string, page: number = 1, perPage: number = 20): Promise<HadithSummary[]> {
    try {
        const result = await fetchHadithList(categoryId, page, perPage);
        // The API returns { data: [...], meta: {...} } or just [...] 
        if (result.data) return result.data;
        return result;
    } catch (error) {
        console.error("Error fetching hadith list:", error);
        return [];
    }
}

export async function getHadithDetail(id: string): Promise<HadithDetail | null> {
    try {
        return await fetchHadithDetail(id);
    } catch (error) {
        console.error(`Error fetching hadith detail ${id}:`, error);
        return null;
    }
}
