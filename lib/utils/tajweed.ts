const TAJWEED_COLORS: Record<string, string> = {
    // Aladhan Short Codes
    h: '#AAAAAA',  // Hamzatul Wasl
    s: '#AAAAAA',  // Silent
    p: '#2196F3',  // Madd Permissible/Normal
    n: '#1B5E20',  // Madd Necessary
    g: '#4CAF50',  // Ghunnah
    i: '#E91E63',  // Ikhfa
    k: '#E91E63',  // Ikhfa Shafawi
    o: '#FF9800',  // Idgham Ghunnah
    u: '#03A9F4',  // Idgham Without Ghunnah
    f: '#FF9800',  // Idgham Shafawi
    q: '#F44336',  // Qalqalah
    l: '#03A9F4',  // Laam Shamsiyah
    c: '#4CAF50',  // Madd Connect/Separated

    // Legacy / Descriptive Codes
    ham_wasl: '#AAAAAA',
    slnt: '#AAAAAA',
    madda_normal: '#A8D5A2',
    madda_permissible: '#4CAF50',
    madda_necessary: '#1B5E20',
    ghunnah: '#66BB6A',
    ikhafa: '#F48FB1',
    ikhafa_shafawi: '#F48FB1',
    idgham_ghunnah: '#FF9800',
    idgham_wo_ghunnah: '#2196F3',
    idgham_shafawi: '#FF9800',
    qalaqah: '#F44336',
    laam_shamsiyah: '#64B5F6',
};

/**
 * Parses Tajweed tags from Aladhan API and returns HTML with colored spans.
 * Format: [tag:code[char]] or [tag[char]]
 */
export function parseTajweed(text: string): string {
    if (!text) return "";
    
    let parsed = text;
    
    // 1. Handle Quran Foundation Format: <tajweed class=tag>char</tajweed>
    const qfRegex = /<tajweed class=([a-z0-9_]+)>([^<]+)<\/tajweed>/g;
    parsed = parsed.replace(qfRegex, (_, cls: string, char: string) => {
        const color = TAJWEED_COLORS[cls] || 'inherit';
        return `<span style="color:${color};display:inline;font-family:inherit;">${char}</span>`;
    });

    // 2. Handle [tag:code]content[/tag] format
    const tagRegex = /\[([a-z0-9_]+)(?::\d+)?\]([^\[]+)\[\/\1\]/g;
    parsed = parsed.replace(tagRegex, (_, cls: string, char: string) => {
        const color = TAJWEED_COLORS[cls] || 'inherit';
        return `<span style="color:${color};display:inline;font-family:inherit;">${char}</span>`;
    });

    // 3. Handle Aladhan Format: [tag:code[char]] or [tag[char]]
    const tajweedRegex = /\[([a-z0-9_]+)(?::\d+)?\[([^\]]+)\]/g;
    const replaceFn = (_: string, cls: string, char: string) => {
        const color = TAJWEED_COLORS[cls] || 'inherit';
        return `<span style="color:${color};display:inline;font-family:inherit;">${char}</span>`;
    };

    parsed = parsed.replace(tajweedRegex, replaceFn);
    parsed = parsed.replace(tajweedRegex, replaceFn); // Second pass for nesting if any

    return parsed;
}