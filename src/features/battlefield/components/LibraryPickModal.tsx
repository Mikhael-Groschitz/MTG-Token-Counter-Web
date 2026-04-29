import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Library } from 'lucide-react';
import { TokenData } from '@/types';
import { TokenCard } from './TokenCard';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface LibraryPickModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: TokenData) => void;
    onCreateNew: () => void;
    libraryTokens: TokenData[];
    activeTokenIds: string[]; // IDs dos tokens já na mesa
}

export const LibraryPickModal = ({
                                     isOpen,
                                     onClose,
                                     onSelect,
                                     onCreateNew,
                                     libraryTokens,
                                     activeTokenIds,
                                 }: LibraryPickModalProps) => {
    const { isAuthenticated } = useAuth();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-gray-900 border border-gray-700 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden">

                            {/* Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Adicionar à Mesa</h2>
                                    <p className="text-gray-400 text-sm">
                                        {isAuthenticated
                                            ? `${libraryTokens.length} token${libraryTokens.length !== 1 ? 's' : ''} na sua biblioteca`
                                            : 'Crie um token customizado para esta partida'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X />
                                </button>
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Card: Criar Novo */}
                                    <button
                                        onClick={onCreateNew}
                                        className="h-full min-h-[300px] border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500 hover:bg-gray-800/50 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Plus size={32} />
                                        </div>
                                        <span className="font-bold text-lg">Criar Customizado</span>
                                        <span className="text-xs text-gray-600 mt-1">Só para esta partida</span>
                                    </button>

                                    {/* Tokens da biblioteca */}
                                    {libraryTokens.map(token => {
                                        const isOnField = activeTokenIds.includes(token.id);
                                        return (
                                            <div
                                                key={token.id}
                                                onClick={() => onSelect(token)}
                                                className="cursor-pointer group relative transform hover:scale-[1.02] transition-transform"
                                            >
                                                <TokenCard
                                                    data={token}
                                                    className={`pointer-events-none ${isOnField ? 'brightness-75' : ''}`}
                                                />

                                                {/* Badge "Na Mesa" */}
                                                {isOnField && (
                                                    <div className="absolute top-3 left-3 z-10 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                        Na Mesa
                                                    </div>
                                                )}

                                                {/* Overlay de seleção */}
                                                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 rounded-[18px] transition-colors border-4 border-transparent group-hover:border-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <span className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
                                                        {isOnField ? '+1 na Mesa' : 'Adicionar'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Estado vazio: logado mas sem tokens salvos */}
                                {isAuthenticated && libraryTokens.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 border border-gray-700">
                                            <Library size={28} className="text-gray-600" />
                                        </div>
                                        <p className="text-gray-400 font-medium mb-1">Sua biblioteca está vazia</p>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Salve até 5 tokens no Dashboard para acessá-los em qualquer partida.
                                        </p>
                                        <Link
                                            to="/dashboard"
                                            onClick={onClose}
                                            className="text-purple-400 hover:text-purple-300 text-sm font-bold underline underline-offset-4 transition-colors"
                                        >
                                            Ir para o Dashboard →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};