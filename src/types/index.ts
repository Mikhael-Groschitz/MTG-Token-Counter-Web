export type TokenColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'colorless' | 'multicolored';
export type TokenLayout = 'classic' | 'fullArt';

export type MulticolorIdentity =
    // 2-color guilds
    | 'azorius' | 'dimir' | 'rakdos' | 'gruul' | 'selesnya'
    | 'orzhov' | 'izzet' | 'golgari' | 'boros' | 'simic'
    // 3-color shards & wedges
    | 'esper' | 'grixis' | 'jund' | 'naya' | 'bant'
    | 'abzan' | 'jeskai' | 'sultai' | 'mardu' | 'temur'
    // 4-color nephilim
    | 'yoreTiller' | 'glintEye' | 'duneBrood' | 'inkTreader' | 'witchMaw'
    // 5-color
    | 'fiveColor';

export type PTCounterType =
    | 'plus1plus1' | 'plus1plus0' | 'plus0plus1'
    | 'minus1minus1' | 'minus1minus0' | 'minus0minus1';

export type KeywordCounterType =
    | 'deathtouch' | 'defender' | 'doubleStrike' | 'firstStrike'
    | 'flying' | 'hexproof' | 'indestructible' | 'lifelink'
    | 'menace' | 'reach' | 'trample' | 'vigilance'
    | 'haste' | 'exalted' | 'shadow' | 'decayed'
    | 'shield' | 'stun' | 'lore' | 'charge';

export interface TokenCounters {
    pt: Partial<Record<PTCounterType, number>>;
    keyword: Partial<Record<KeywordCounterType, number>>;
}

export interface TokenData {
    id: string;
    name: string;
    imageUrl?: string;
    typeLine: string;
    color: TokenColor;
    colorIdentity?: MulticolorIdentity;
    power?: string;
    toughness?: string;
    abilities?: string;
    count: number;
    layout?: TokenLayout;
    counters?: TokenCounters;
}

export type AuthProvider = 'local' | 'google';

export interface User {
    id?: string;
    username: string;
    email: string;
    avatarUrl?: string;
    provider?: AuthProvider;
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
    provider: AuthProvider;
}

export interface LoginCredentials {
    identifier: string; 
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface UpdateProfileData {
    username: string;
    currentPassword?: string;
    newPassword?: string;
}