import { DoaItem, DoaDetail } from "./types";
import { fetchDoaList, fetchDoaDetail } from "./api/doa";

export async function getDoaList(): Promise<DoaItem[]> {
    try {
        const result = await fetchDoaList();
        
        if (result.status === "success" && Array.isArray(result.data)) {
            return result.data;
        }
        
        return [];
    } catch (error) {
        console.error("Error fetching doa list:", error);
        return [];
    }
}

export async function getDoaDetail(id: number): Promise<DoaDetail | null> {
    try {
        const result = await fetchDoaDetail(id);
        
        if (result.status === "success" && result.data) {
            return result.data;
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching doa detail ${id}:`, error);
        return null;
    }
}
