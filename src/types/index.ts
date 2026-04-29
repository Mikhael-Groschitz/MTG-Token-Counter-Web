// src/types/index.ts
export type TokenColor = 'white' | 'blue' | 'black' | 'red' | 'green' | 'gold' | 'colorless';
export type TokenLayout = 'classic' | 'fullArt'; // Nova tipagem

export interface TokenData {
    id: string;
    name: string;
    imageUrl?: string; // Pode ser undefined se o usuário ainda não subiu foto
    typeLine: string;  // Ex: "Token Creature - Goblin"
    color: TokenColor;
    power?: string;    // String pois pode ser "*" ou "X"
    toughness?: string;
    abilities?: string; // Texto da caixa
    count: number; // <--- NOVO CAMPO OBRIGATÓRIO
    layout?: TokenLayout; // <--- Novo campo opcional
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
    identifier: string; // Alinhado com o backend que fizemos
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}