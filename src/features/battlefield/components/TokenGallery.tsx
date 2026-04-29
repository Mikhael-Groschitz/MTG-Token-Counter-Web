import React, { useEffect } from 'react';
import { TokenCard } from './TokenCard';
import { useTokens } from '@/hooks/useTokens'; // O motor que criamos
import { Loader2, Plus, Library } from 'lucide-react';

export const TokenGallery: React.FC = () => {
    // Agora toda a lógica de estado e erro vem do nosso hook customizado
    const { tokens, loading, error, fetchTokens } = useTokens();

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    // UI de Carregamento (Mantida a sua identidade visual de MTG)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-purple-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="animate-pulse font-medium uppercase tracking-widest text-xs">Acessando a Forja...</p>
            </div>
        );
    }

    // UI de Erro
    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md mx-auto">
                <p className="text-red-400 text-sm font-medium">{error}</p>
                <button
                    onClick={fetchTokens}
                    className="mt-4 text-xs text-red-400 underline uppercase tracking-tighter"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Library className="text-purple-500" /> Sua Coleção
                </h2>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-3 py-1 rounded-full border border-gray-700 uppercase tracking-widest font-bold">
                    {tokens.length} Tokens Encontrados
                </span>
            </div>

            {tokens.length === 0 ? (
                <div className="border-2 border-dashed border-gray-800 rounded-3xl p-16 text-center">
                    <div className="bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 text-gray-700">
                        <Plus size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">Sua biblioteca está vazia.</p>
                    <p className="text-gray-600 text-xs mt-1">Comece forjando seu primeiro token!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                    {tokens.map((token) => (
                        <TokenCard key={token.id} data={token} />
                    ))}
                </div>
            )}
        </section>
    );
};