/**
 * Fetches the list of all available Doas from internal API.
 */
export async function fetchDoaList() {
    const response = await fetch('/api/doa');
    if (!response.ok) throw new Error("Failed to fetch doa list");
    return await response.json();
}

/**
 * Fetches detail for a specific Doa by ID from internal API.
 */
export async function fetchDoaDetail(id: number) {
    const response = await fetch(`/api/doa/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch doa detail for ID ${id}`);
    return await response.json();
}
