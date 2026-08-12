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
}

export interface User {
    id?: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
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