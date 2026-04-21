import { supabase } from "./supabase";
import {
    IqroItem,
    IqroSection,
    IqroPageData,
    IqroLevel
} from "./types";

const AUDIO_MAP: Record<string, string> = {
    "ALIF": "Alif/0_Alif_29.wav",
    "JIM": "Jeem/4_Jeem_1.wav",
    "KHA": "Kha/6_Kha_1.wav",
    "DAL": "Dal/7_Dal_1.wav",
    "DZAL": "Thal/8_Thal_1.wav",
    "RA": "Ra/9_Ra_1.wav",
    "ZAI": "Zay/10_Zay_1.wav",
    "SIN": "Seen/11_Seen_1.wav",
    "SYIN": "Sheen/12_Sheen_1.wav",
    "SHAD": "Sad/13_Sad_1.wav",
    "SHOD": "Sad/13_Sad_1.wav",
    "DHAD": "Dad/14_Dad_1.wav",
    "DHOD": "Dad/14_Dad_1.wav",
    "THA": "Taa/15_Taa_1.wav",
    "GHAIN": "Ghain/18_Ghain_1.wav",
    "QAF": "Qaf/20_Qaf_1.wav",
    "KAF": "Kaf/21_Kaf_1.wav",
    "LAM": "Lam/22_Lam_1.wav",
    "MIM": "Meem/23_Meem_1.wav",
    "NUN": "Noon/24_Noon_1.wav",
    "WAU": "Waw/26_Waw_1.wav",
    "LAM ALIF": "Lam/22_Lam_1.wav",
    "HAMZAH": "Alif/0_Alif_1.wav",
    "HA2": "Ha2/25_Ha2_1.wav",
    "HA_BIG": "Ha2/26_Ha2_1.wav",
};

export async function getIqroBookMetadata(levelNumber: number): Promise<{ title: string; total_pages: number; is_disabled: boolean } | null> {
    try {
        const { data, error } = await supabase
            .from('iqro_levels')
            .select('title, is_disabled, iqro_pages(count)')
            .eq('level_number', levelNumber)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            title: data.title,
            is_disabled: data.is_disabled || false,
            total_pages: data.iqro_pages?.[0]?.count || 0
        };
    } catch (error) {
        console.error("Error loading Iqro book metadata from Supabase:", error);
        return null;
    }
}

export async function getIqroPageData(levelNumber: number, pageNumber: number): Promise<IqroPageData | null> {
    try {
        const { data: levelData, error: levelError } = await supabase
            .from('iqro_levels')
            .select('id, title, level_number, basmallah')
            .eq('level_number', levelNumber)
            .single();

        if (levelError) throw levelError;

        const { data: pageData, error: pageError } = await supabase
            .from('iqro_pages')
            .select('*')
            .eq('level_id', levelData.id)
            .eq('page_number', pageNumber)
            .single();

        if (pageError) throw pageError;

        return {
            page_number: pageData.page_number,
            level_id: levelNumber,
            level_title: levelData.title,
            basmallah: levelData.basmallah,
            instruction: pageData.instructions,
            name: pageData.name,
            sections: (pageData.sections as any[]).map(section => {
                // Try to find audio if it's a simple character
                const audioPath = AUDIO_MAP[section.text.toUpperCase().trim()];
                return {
                    ...section,
                    audioUrl: section.audioUrl || (audioPath ? `/audio/${audioPath}` : undefined)
                };
            })
        };
    } catch (error) {
        console.error("Error loading Iqro page data from Supabase:", error);
        return null;
    }
}

export async function getHijaiyahIntroData(): Promise<IqroItem[]> {
    try {
        const { data, error } = await supabase
            .from('hijaiyah_letters')
            .select('*')
            .order('order_id', { ascending: true });

        if (error) throw error;
        if (!data) return [];

        return data.map(item => {
            const audioPath = item.audio_key ? AUDIO_MAP[item.audio_key] : undefined;
            return {
                order_id: item.order_id,
                latin: item.latin,
                arabic: item.arabic,
                audioUrl: audioPath ? `/audio/${audioPath}` : undefined
            };
        });
    } catch (error) {
        console.error("Error loading Hijaiyah intro data from Supabase:", error);
        return [];
    }
}
/**
 * Formats pronunciation text for RTL display.
 * Reverses the word order so that Latin phonetic guides align correctly with Arabic text
 * which is read from right to left (e.g., "A BA" becomes "BA A").
 */
export function formatPronunciation(pronunciation?: string): string | undefined {
    if (!pronunciation) return undefined;
    return pronunciation.split(' ').reverse().join(' ');
}

export async function getAllIqroLevels(): Promise<IqroLevel[]> {
    try {
        const { data, error } = await supabase
            .from('iqro_levels')
            .select('level_number, title, description, color, is_disabled')
            .order('level_number', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Error loading all Iqro levels from Supabase:", error);
        return [];
    }
}
