import { DoaItem, DoaDetail } from "./types";
import { CONFIG } from "./api-config";

const DOA_API_URL = `${CONFIG.EQURAN_API}/doa`;

export async function getDoaList(): Promise<DoaItem[]> {
    try {
        const response = await fetch(DOA_API_URL);
        if (!response.ok) throw new Error("Failed to fetch doa list");

        const result = await response.json();
        
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
        const response = await fetch(`${DOA_API_URL}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch doa detail for ID ${id}`);

        const result = await response.json();
        
        if (result.status === "success" && result.data) {
            return result.data;
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching doa detail ${id}:`, error);
        return null;
    }
}
