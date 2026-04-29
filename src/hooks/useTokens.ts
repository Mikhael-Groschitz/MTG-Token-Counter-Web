import { useState, useCallback } from 'react';
import { tokenService } from '../services/tokenService';
import { TokenData } from '@/types';

const MAX_TOKENS = 5;

export const useTokens = () => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isMutating, setIsMutating] = useState(false); // separado do loading de lista
    const [error, setError] = useState<string | null>(null);

    // ── READ ──────────────────────────────────────────────
    const fetchTokens = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tokenService.getAll();
            setTokens(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar o Grimório');
        } finally {
            setLoading(false);
        }
    }, []);

    // ── CREATE ────────────────────────────────────────────
    const createToken = async (newToken: Omit<TokenData, 'id' | 'count'>): Promise<TokenData> => {
        if (tokens.length >= MAX_TOKENS) {
            throw new Error(`Limite de ${MAX_TOKENS} tokens atingido.`);
        }
        setIsMutating(true);
        setError(null);
        try {
            const created = await tokenService.create(newToken);
            setTokens(prev => [created, ...prev]);
            return created;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao forjar o token');
            throw err;
        } finally {
            setIsMutating(false);
        }
    };

    // ── UPDATE ────────────────────────────────────────────
    const updateToken = async (id: string, updated: Omit<TokenData, 'id' | 'count'>): Promise<TokenData> => {
        setIsMutating(true);
        setError(null);
        try {
            const saved = await tokenService.update(id, updated);
            setTokens(prev => prev.map(t => t.id === id ? { ...saved, count: t.count } : t));
            return saved;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar o token');
            throw err;
        } finally {
            setIsMutating(false);
        }
    };

    // ── DELETE ────────────────────────────────────────────
    const deleteToken = async (id: string): Promise<void> => {
        setIsMutating(true);
        setError(null);
        try {
            await tokenService.delete(id);
            setTokens(prev => prev.filter(t => t.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao excluir o token');
            throw err;
        } finally {
            setIsMutating(false);
        }
    };

    return {
        tokens,
        loading,       // true durante fetchTokens
        isMutating,    // true durante create/update/delete
        error,
        hasReachedLimit: tokens.length >= MAX_TOKENS,
        fetchTokens,
        createToken,
        updateToken,
        deleteToken,
    };
};