const SYMBOLOGY_URL = 'https://api.scryfall.com/symbology';
const CACHE_KEY = 'scryfall_symbology_v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface ScryfallSymbologyEntry {
    symbol: string;
    svg_uri: string;
}

interface ScryfallSymbologyResponse {
    data: ScryfallSymbologyEntry[];
}

interface SymbologyCache {
    fetchedAt: number;
    symbols: Record<string, string>;
}

function readCache(): SymbologyCache | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed: SymbologyCache = JSON.parse(raw);
        if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
        return parsed;
    } catch {
        return null;
    }
}

function writeCache(symbols: Record<string, string>): void {
    try {
        const cache: SymbologyCache = { fetchedAt: Date.now(), symbols };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // localStorage indisponível (modo privado, quota etc.) — segue sem cache
    }
}

async function fetchSymbology(): Promise<Record<string, string>> {
    const response = await fetch(SYMBOLOGY_URL);
    if (!response.ok) {
        throw new Error('Falha ao buscar símbolos no Scryfall.');
    }
    const body: ScryfallSymbologyResponse = await response.json();
    const symbols: Record<string, string> = {};
    for (const entry of body.data) {
        symbols[entry.symbol] = entry.svg_uri;
    }
    return symbols;
}

export async function getSymbologyMap(): Promise<Record<string, string>> {
    const cached = readCache();
    if (cached) return cached.symbols;

    const symbols = await fetchSymbology();
    writeCache(symbols);
    return symbols;
}
