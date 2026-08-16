import { MulticolorIdentity, TokenColor, TokenLayout } from '@/types';
import { COLOR_IDENTITIES } from '../features/battlefield/constants/colorIdentities';

const SCRYFALL_SEARCH_URL = 'https://api.scryfall.com/cards/search';

const COLOR_LETTER_MAP: Record<string, Exclude<TokenColor, 'colorless' | 'multicolored'>> = {
    W: 'white',
    U: 'blue',
    B: 'black',
    R: 'red',
    G: 'green',
};

export interface ScryfallImageUris {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
}

export interface ScryfallCardFace {
    image_uris?: ScryfallImageUris;
}

export interface ScryfallCard {
    id: string;
    name: string;
    layout: string;
    image_status?: string;
    set_name?: string;
    type_line?: string;
    oracle_text?: string;
    power?: string;
    toughness?: string;
    colors?: string[];
    keywords?: string[];
    image_uris?: ScryfallImageUris;
    card_faces?: ScryfallCardFace[];
}

interface ScryfallSearchResponse {
    data: ScryfallCard[];
}

export async function searchTokenCards(query: string, signal?: AbortSignal): Promise<ScryfallCard[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const q = `layout:token ${trimmed}`;
    const url = `${SCRYFALL_SEARCH_URL}?q=${encodeURIComponent(q)}&unique=cards&order=name`;

    const response = await fetch(url, { signal });

    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new Error('Falha ao buscar cards no Scryfall.');
    }

    const body: ScryfallSearchResponse = await response.json();
    return body.data;
}

export function mapScryfallColorsToToken(colors: string[] | undefined): { color: TokenColor; colorIdentity?: MulticolorIdentity } {
    const uniqueColors = Array.from(new Set(colors ?? []));

    if (uniqueColors.length === 0) {
        return { color: 'colorless' };
    }

    if (uniqueColors.length === 1) {
        const single = COLOR_LETTER_MAP[uniqueColors[0]];
        return { color: single ?? 'colorless' };
    }

    const baseColors = uniqueColors.map(letter => COLOR_LETTER_MAP[letter]).filter(Boolean);
    const match = COLOR_IDENTITIES.find(
        ci => ci.colors.length === baseColors.length && ci.colors.every(c => baseColors.includes(c))
    );

    return { color: 'multicolored', colorIdentity: match?.id };
}

function resolveImageUris(card: ScryfallCard): ScryfallImageUris | undefined {
    return card.image_uris ?? card.card_faces?.[0]?.image_uris;
}

export function getScryfallImageUrl(card: ScryfallCard, layout: TokenLayout | undefined): string | undefined {
    const uris = resolveImageUris(card);
    if (!uris) return undefined;
    return layout === 'fullArt' ? uris.border_crop ?? uris.art_crop : uris.art_crop ?? uris.border_crop;
}

export function getImageStatusWarning(card: ScryfallCard): string | null {
    switch (card.image_status) {
        case 'missing':
            return 'Este card não possui imagem disponível no Scryfall.';
        case 'placeholder':
            return 'O Scryfall só tem uma imagem provisória (placeholder) para este card.';
        case 'lowres':
            return 'A imagem deste card no Scryfall está em baixa resolução.';
        default:
            return null;
    }
}
