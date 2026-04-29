import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, RotateCcw, Swords, Trash2, Edit2 } from 'lucide-react';
import { TokenCard } from "@/features/battlefield/components/TokenCard";
import { TokenModal } from "@/features/battlefield/components/TokenModal";
import { LibraryPickModal } from "@/features/battlefield/components/LibraryPickModal";
import { TokenData } from "@/types";
import { useAuth } from '@/context/AuthContext';
import { useTokens } from '@/hooks/useTokens';

const STORAGE_KEY = 'mtg_token_forge_mesa';

export const GamePage = () => {
    const { isAuthenticated } = useAuth();
    const { tokens: libraryTokens, fetchTokens } = useTokens();

    const [activeTokens, setActiveTokens] = useState<TokenData[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isPickModalOpen, setIsPickModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingToken, setEditingToken] = useState<TokenData | null>(null);

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

    const resetTable = () => {
        if (confirm('Deseja remover todos os tokens da mesa?')) setActiveTokens([]);
    };

    const resetCounters = () => {
        setActiveTokens(prev => prev.map(t => ({ ...t, count: 1 })));
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
                t.id === token.id ? { ...token, count: t.count } : t
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

    return (
        <div className="flex flex-col gap-8 pb-20 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-6 sticky top-0 bg-gray-950/80 backdrop-blur-md z-40 py-4 px-4">
                <div className="flex items-center gap-3">
                    <Swords className="text-purple-500" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold text-white leading-none">Mesa de Jogo</h1>
                        <span className="text-xs text-gray-500">
                            {activeTokens.length} {activeTokens.length === 1 ? 'tipo' : 'tipos'} —{' '}
                            <span className="text-purple-400 font-medium">{totalOnField} em campo</span>
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {activeTokens.length > 0 && (
                        <>
                            <button
                                onClick={resetCounters}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-purple-400 border border-gray-800 hover:border-purple-500/30 rounded-lg transition-all active:scale-95 bg-gray-900/50"
                                title="Resetar contadores"
                            >
                                <RotateCcw size={16} />
                                <span className="hidden sm:inline">Resetar Contadores</span>
                            </button>
                            <button
                                onClick={resetTable}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/30 rounded-lg transition-all active:scale-95 bg-gray-900/50"
                                title="Limpar Mesa"
                            >
                                <Trash2 size={16} />
                                <span className="hidden sm:inline">Limpar Mesa</span>
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => { setEditingToken(null); setIsPickModalOpen(true); }}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-purple-900/20 transition-all active:scale-95"
                    >
                        <Plus size={20} /> Adicionar Token
                    </button>
                </div>
            </div>

            {/* Área da Mesa */}
            {activeTokens.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed border-gray-800 rounded-3xl m-4">
                    <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                        <Swords className="text-gray-700" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-300 mb-2">A Mesa está Vazia</h2>
                    <p className="text-gray-500 max-w-md mb-8">
                        Adicione tokens para começar a batalha.
                        {!isAuthenticated && (
                            <span className="block text-purple-400 text-sm mt-2">
                                Faça login para salvar até 5 tokens favoritos.
                            </span>
                        )}
                    </p>
                    <button
                        onClick={() => { setEditingToken(null); setIsPickModalOpen(true); }}
                        className="text-white bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        Adicionar Token
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center px-4">
                    <AnimatePresence>
                        {activeTokens.map(token => (
                            <motion.div
                                key={token.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative flex flex-col items-center group"
                            >
                                <div className={`transition-all duration-300 ${token.count === 0 ? 'opacity-50 grayscale' : ''}`}>
                                    <TokenCard data={token} className="shadow-2xl" />
                                </div>

                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-40">
                                    <button
                                        onClick={() => openEditModal(token)}
                                        className="bg-gray-900 text-gray-500 hover:text-blue-400 hover:bg-white rounded-full p-2 shadow-md transition-all"
                                        title="Editar Token"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeToken(token.id)}
                                        className="bg-gray-900 text-gray-500 hover:text-red-500 hover:bg-white rounded-full p-2 shadow-md transition-all"
                                        title="Remover da Mesa"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className={`absolute bottom-[10%] z-30 flex items-center gap-4 bg-gray-900/95 backdrop-blur-xl border ${
                                    token.count > 0 ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-gray-700'
                                } rounded-xl p-2 px-3 transition-all transform translate-y-1/2`}>
                                    <button onClick={() => adjustCount(token.id, -1)} className="w-8 h-8 rounded bg-gray-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center active:scale-90 transition-colors">
                                        <Minus size={18} />
                                    </button>
                                    <span className={`text-3xl font-bold min-w-[40px] text-center font-serif ${token.count > 0 ? 'text-white' : 'text-gray-600'}`}>
                                        {token.count}
                                    </span>
                                    <button onClick={() => adjustCount(token.id, 1)} className="w-8 h-8 rounded bg-gray-800 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center active:scale-90 transition-colors">
                                        <Plus size={18} />
                                    </button>
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
            />
        </div>
    );
};