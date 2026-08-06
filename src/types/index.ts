export type TokenColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'gold' | 'colorless';
export type TokenLayout = 'classic' | 'fullArt'; 

export interface TokenData {
    id: string;
    name: string;
    imageUrl?: string; 
    typeLine: string;  
    color: TokenColor;
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