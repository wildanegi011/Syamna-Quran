import modulesData from "./data/modules.json";
import { AppModule } from "./types";

export async function getAppModules(): Promise<AppModule[]> {
    try {
        // Return structured data from the local JSON file
        const modules = modulesData as unknown as AppModule[];
        return modules.sort((a, b) => a.display_order - b.display_order);
    } catch (error) {
        console.error("Error loading app modules from local JSON:", error);
        return [];
    }
}
