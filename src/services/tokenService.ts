import api from './api';
import { TokenData } from '@/types';
import { TokenLayout } from '@/types';

export interface TokenResponse {
    id: string;
    name: string;
    type_line: string;
    color: string;
    power?: string;
    toughness?: string;
    abilities?: string;
    image_url: string;
    layout: string;
}

export const mapToTokenData = (t: TokenResponse): TokenData => ({
    id: t.id,
    name: t.name,
    typeLine: t.type_line,
    color: t.color as TokenData['color'],
    power: t.power,
    toughness: t.toughness,
    abilities: t.abilities,
    imageUrl: t.image_url,
    layout: t.layout as TokenLayout,
    count: 1,
});

const mapToPayload = (token: Omit<TokenData, 'id' | 'count'>): Omit<TokenResponse, 'id'> => ({
    name: token.name,
    type_line: token.typeLine,
    color: token.color,
    power: token.power,
    toughness: token.toughness,
    abilities: token.abilities,
    image_url: token.imageUrl ?? '',
    layout: token.layout ?? 'classic',
});

export const tokenService = {
    async getAll(): Promise<TokenData[]> {
        const { data } = await api.get<TokenResponse[]>('/tokens');
        return data.map(mapToTokenData);
    },

    async create(token: Omit<TokenData, 'id' | 'count'>): Promise<TokenData> {
        const { data } = await api.post<TokenResponse>('/tokens', mapToPayload(token));
        return mapToTokenData(data);
    },

    async update(id: string, token: Omit<TokenData, 'id' | 'count'>): Promise<TokenData> {
        const { data } = await api.put<TokenResponse>(`/tokens/${id}`, mapToPayload(token));
        return mapToTokenData(data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/tokens/${id}`);
    },
};