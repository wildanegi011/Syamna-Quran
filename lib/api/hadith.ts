/**
 * Fetches the list of all hadith categories from internal API.
 */
export async function fetchHadithCategories() {
    const response = await fetch('/api/hadith/categories/list/?language=id');
    if (!response.ok) throw new Error("Failed to fetch hadith categories");
    return await response.json();
}

/**
 * Fetches a list of hadiths from a specific category from internal API.
 */
export async function fetchHadithList(categoryId: string, page: number = 1, perPage: number = 20) {
    const response = await fetch(
        `/api/hadith/hadeeths/list/?language=id&category_id=${categoryId}&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) throw new Error("Failed to fetch hadith list");
    return await response.json();
}

/**
 * Fetches detail for a specific hadith by ID from internal API.
 */
export async function fetchHadithDetail(id: string) {
    const response = await fetch(`/api/hadith/hadeeths/one/?id=${id}&language=id`);
    if (!response.ok) throw new Error(`Failed to fetch hadith detail for ID ${id}`);
    return await response.json();
}
