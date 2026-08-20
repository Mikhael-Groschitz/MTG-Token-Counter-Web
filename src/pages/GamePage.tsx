import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, RotateCcw, Swords, Trash2, Edit2, Layers, Eraser, Trash } from 'lucide-react';
import { TokenCard } from "@/features/battlefield/components/TokenCard";
import { TokenModal } from "@/features/battlefield/components/TokenModal";
import { LibraryPickModal } from "@/features/battlefield/components/LibraryPickModal";
import { TokenCountersModal } from "@/features/battlefield/components/TokenCountersModal";
import { normalizeCounters } from "@/features/battlefield/utils/counters";
import { TokenCounters, TokenData } from "@/types";
import { useAuth } from '@/context/AuthContext';
import { useTokens } from '@/hooks/useTokens';

const STORAGE_KEY = 'mtg_token_forge_mesa';

export const GamePage = () => {
    const { isAuthenticated } = useAuth();
    const { tokens: libraryTokens, fetchTokens } = useTokens();

    const [activeTokens, setActiveTokens] = useState<TokenData[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed: TokenData[] = saved ? JSON.parse(saved) : [];
            return parsed.map(t => ({ ...t, counters: normalizeCounters(t.counters) }));
        } catch {
            return [];
        }
    });

    const [isPickModalOpen, setIsPickModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingToken, setEditingToken] = useState<TokenData | null>(null);
    const [countersToken, setCountersToken] = useState<TokenData | null>(null);
    const [isCountersModalOpen, setIsCountersModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTokens));
    }, [activeTokens]);

    useEffect(() => {
        if (isAuthenticated) void fetchTokens();
    }, [isAuthenticated, fetchTokens]);

    const totalOnField = activeTokens.reduce((sum, t) => sum + t.count, 0);

    const adjustCount = useCallback((id: string, delta: number) => {
        setActiveTokens(prev => prev.map(t =>
            t.id === id ? { ...t, count: Math.max(0, t.count + delta) } : t
        ));
    }, []);

    const removeToken = useCallback((id: string) => {
        setActiveTokens(prev => prev.filter(t => t.id !== id));
    }, []);

    const resetQuantities = () => {
        setActiveTokens(prev => prev.map(t => ({ ...t, count: 1 })));
    };

    const resetMarkers = () => {
        setActiveTokens(prev => prev.map(t => ({ ...t, counters: normalizeCounters() })));
    };

    const resetTable = () => {
        setActiveTokens([]);
    };

    const handleAddFromLibrary = useCallback((token: TokenData) => {
        setActiveTokens(prev => {
            const existing = prev.find(t => t.id === token.id);
            if (existing) return prev.map(t => t.id === token.id ? { ...t, count: t.count + 1 } : t);
            return [...prev, { ...token, count: 1 }];
        });
        setIsPickModalOpen(false);
    }, []);

    const handleSaveToken = useCallback((token: TokenData) => {
        if (editingToken) {
            setActiveTokens(prev => prev.map(t =>
                t.id === token.id ? { ...token, count: t.count, counters: t.counters } : t
            ));
        } else {
            setActiveTokens(prev => [...prev, { ...token, id: `local_${Date.now()}`, count: 1 }]);
        }
        setIsCreateModalOpen(false);
        setEditingToken(null);
    }, [editingToken]);

    const openEditModal = useCallback((token: TokenData) => {
        setEditingToken(token);
        setIsCreateModalOpen(true);
    }, []);

    const openCountersModal = useCallback((token: TokenData) => {
        setCountersToken(token);
        setIsCountersModalOpen(true);
    }, []);

    const handleCountersChange = useCallback((tokenId: string, counters: TokenCounters) => {
        setActiveTokens(prev => prev.map(t => t.id === tokenId ? { ...t, counters } : t));
        setCountersToken(prev => prev?.id === tokenId ? { ...prev, counters } : prev);
    }, []);

    const utilityButton =
        'flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-purple-400 rounded-md transition-colors active:scale-95';

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-baseline gap-3">
                        <Swords className="text-purple-500 self-center" size={18} />
                        <span className="text-2xl font-bold text-white leading-none tabular-nums">{totalOnField}</span>
                        <span className="text-xs text-gray-500">
                            em campo · {activeTokens.length} {activeTokens.length === 1 ? 'tipo' : 'tipos'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 ml-auto">
                        {activeTokens.length > 0 && (
                            <>
                                <button onClick={resetQuantities} className={utilityButton} title="Resetar quantidades">
                                    <RotateCcw size={15} />
                                    <span className="hidden sm:inline">Quantidades</span>
                                </button>
                                <button onClick={resetMarkers} className={utilityButton} title="Resetar marcadores">
                                    <Eraser size={15} />
                                    <span className="hidden sm:inline">Marcadores</span>
                                </button>
                                <button onClick={resetTable} className={utilityButton} title="Limpar Mesa">
                                    <Trash size={15} />
                                    <span className="hidden sm:inline">Limpar Mesa</span>
                                </button>    
                            </>
                        )}
                        <button
                            onClick={() => { setEditingToken(null); setIsPickModalOpen(true); }}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors active:scale-95"
                        >
                            <Plus size={17} /> Adicionar token
                        </button>
                    </div>
                </div>
            </div>

            {activeTokens.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-600 mb-4">Mesa vazia</p>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Nada em campo ainda</h2>
                    <p className="text-gray-500 max-w-sm mt-3">
                        Adicione um token da sua biblioteca ou crie um na hora.
                    </p>
                    <button
                        onClick={() => { setEditingToken(null); setIsPickModalOpen(true); }}
                        className="mt-8 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <Plus size={17} /> Adicionar token
                    </button>
                    {!isAuthenticated && (
                        <p className="text-xs text-gray-600 mt-6">
                            Com conta você salva até 5 tokens favoritos.
                        </p>
                    )}
                </div>
            ) : (
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center px-4 pt-10">
                    <AnimatePresence>
                        {activeTokens.map(token => (
                            <motion.div
                                key={token.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center w-full max-w-[300px]"
                            >
                                <div className={`transition-all duration-300 ${token.count === 0 ? 'opacity-50 grayscale' : ''}`}>
                                    <TokenCard data={token} className="shadow-2xl" />
                                </div>

                                <div className="mt-3 w-full flex items-center justify-between gap-2 border-t border-gray-900 pt-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => adjustCount(token.id, -1)}
                                            className="w-7 h-7 rounded-md border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/40 flex items-center justify-center active:scale-90 transition-colors"
                                            aria-label="Remover uma cópia"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className={`text-lg font-semibold tabular-nums min-w-[22px] text-center ${token.count > 0 ? 'text-white' : 'text-gray-600'}`}>
                                            {token.count}
                                        </span>
                                        <button
                                            onClick={() => adjustCount(token.id, 1)}
                                            className="w-7 h-7 rounded-md border border-gray-800 text-gray-400 hover:text-green-400 hover:border-green-500/40 flex items-center justify-center active:scale-90 transition-colors"
                                            aria-label="Adicionar uma cópia"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                        <button onClick={() => openCountersModal(token)} className="p-1.5 rounded-md text-gray-600 hover:text-purple-400 hover:bg-gray-900 transition-colors" title="Marcadores">
                                            <Layers size={15} />
                                        </button>
                                        <button onClick={() => openEditModal(token)} className="p-1.5 rounded-md text-gray-600 hover:text-blue-400 hover:bg-gray-900 transition-colors" title="Editar token">
                                            <Edit2 size={15} />
                                        </button>
                                        <button onClick={() => removeToken(token.id)} className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-gray-900 transition-colors" title="Remover da mesa">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <LibraryPickModal
                isOpen={isPickModalOpen}
                onClose={() => setIsPickModalOpen(false)}
                libraryTokens={libraryTokens}
                activeTokenIds={activeTokens.map(t => t.id)}
                onSelect={handleAddFromLibrary}
                onCreateNew={() => {
                    setIsPickModalOpen(false);
                    setEditingToken(null);
                    setIsCreateModalOpen(true);
                }}
            />

            <TokenModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setEditingToken(null); }}
                onSave={handleSaveToken}
                initialData={editingToken}
                libraryTokenCount={libraryTokens.length}
            />

            <TokenCountersModal
                isOpen={isCountersModalOpen}
                onClose={() => { setIsCountersModalOpen(false); setCountersToken(null); }}
                token={countersToken}
                onChange={handleCountersChange}
            />
        </div>
    );
};
