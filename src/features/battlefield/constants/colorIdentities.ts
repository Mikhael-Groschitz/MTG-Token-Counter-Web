import type { MulticolorIdentity } from '@/types';

export type IdentityTier = 2 | 3 | 4 | 5;
export type BaseManaColor = 'white' | 'blue' | 'black' | 'red' | 'green';

export interface ColorIdentityInfo {
    id: MulticolorIdentity;
    name: string;
    tier: IdentityTier;
    colors: BaseManaColor[];
}

export const COLOR_IDENTITIES: ColorIdentityInfo[] = [
    // --- 2-color guilds ---
    { id: 'azorius', name: 'Azorius', tier: 2, colors: ['white', 'blue'] },
    { id: 'dimir', name: 'Dimir', tier: 2, colors: ['blue', 'black'] },
    { id: 'rakdos', name: 'Rakdos', tier: 2, colors: ['black', 'red'] },
    { id: 'gruul', name: 'Gruul', tier: 2, colors: ['red', 'green'] },
    { id: 'selesnya', name: 'Selesnya', tier: 2, colors: ['green', 'white'] },
    { id: 'orzhov', name: 'Orzhov', tier: 2, colors: ['white', 'black'] },
    { id: 'izzet', name: 'Izzet', tier: 2, colors: ['blue', 'red'] },
    { id: 'golgari', name: 'Golgari', tier: 2, colors: ['black', 'green'] },
    { id: 'boros', name: 'Boros', tier: 2, colors: ['red', 'white'] },
    { id: 'simic', name: 'Simic', tier: 2, colors: ['green', 'blue'] },
    // --- 3-color shards & wedges ---
    { id: 'esper', name: 'Esper', tier: 3, colors: ['white', 'blue', 'black'] },
    { id: 'grixis', name: 'Grixis', tier: 3, colors: ['blue', 'black', 'red'] },
    { id: 'jund', name: 'Jund', tier: 3, colors: ['black', 'red', 'green'] },
    { id: 'naya', name: 'Naya', tier: 3, colors: ['red', 'green', 'white'] },
    { id: 'bant', name: 'Bant', tier: 3, colors: ['green', 'white', 'blue'] },
    { id: 'abzan', name: 'Abzan', tier: 3, colors: ['white', 'black', 'green'] },
    { id: 'jeskai', name: 'Jeskai', tier: 3, colors: ['blue', 'red', 'white'] },
    { id: 'sultai', name: 'Sultai', tier: 3, colors: ['black', 'green', 'blue'] },
    { id: 'mardu', name: 'Mardu', tier: 3, colors: ['red', 'white', 'black'] },
    { id: 'temur', name: 'Temur', tier: 3, colors: ['green', 'blue', 'red'] },
    // --- 4-color nephilim ---
    { id: 'yoreTiller', name: 'Yore-Tiller', tier: 4, colors: ['white', 'blue', 'black', 'red'] },
    { id: 'glintEye', name: 'Glint-Eye', tier: 4, colors: ['blue', 'black', 'red', 'green'] },
    { id: 'duneBrood', name: 'Dune-Brood', tier: 4, colors: ['black', 'red', 'green', 'white'] },
    { id: 'inkTreader', name: 'Ink-Treader', tier: 4, colors: ['red', 'green', 'white', 'blue'] },
    { id: 'witchMaw', name: 'Witch-Maw', tier: 4, colors: ['green', 'white', 'blue', 'black'] },
    // --- 5-color ---
    { id: 'fiveColor', name: '5 Color', tier: 5, colors: ['white', 'blue', 'black', 'red', 'green'] },
];

export const COLOR_IDENTITY_MAP: Record<MulticolorIdentity, ColorIdentityInfo> = Object.fromEntries(
    COLOR_IDENTITIES.map(ci => [ci.id, ci])
) as Record<MulticolorIdentity, ColorIdentityInfo>;

export const TIER_LABELS: Record<IdentityTier, string> = {
    2: 'Guildas (2 cores)',
    3: 'Shards & Wedges (3 cores)',
    4: 'Nephilim (4 cores)',
    5: '5 Cores',
};

export const BASE_COLOR_HEX: Record<BaseManaColor, string> = {
    white: '#F8F6D8',
    blue: '#C1D7E9',
    black: '#746C69',
    red: '#E49977',
    green: '#9DCC9B',
};

export function buildConicGradient(colors: BaseManaColor[]): string {
    const n = colors.length;
    const stops = colors
        .map((c, i) => `${BASE_COLOR_HEX[c]} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`)
        .join(', ');
    return `conic-gradient(${stops})`;
}
