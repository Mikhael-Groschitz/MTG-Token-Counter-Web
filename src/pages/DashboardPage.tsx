import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, LayoutGrid, Trash2, Edit, User, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { TokenCard } from '@/features/battlefield/components/TokenCard';
import { TokenModal } from '@/features/battlefield/components/TokenModal';
import { TokenData } from '@/types';
import { useTokens } from '@/hooks/useTokens';
import { useAuth } from '@/context/AuthContext';

const MAX_TOKENS = 5;

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const { tokens: libraryTokens, loading, isMutating, error, hasReachedLimit, fetchTokens, deleteToken } = useTokens();

    const [activeTab, setActiveTab] = useState<'tokens' | 'settings'>('tokens');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingToken, setEditingToken] = useState<TokenData | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [settingsError, setSettingsError] = useState<string | null>(null);

    useEffect(() => { void fetchTokens(); }, [fetchTokens]);
    useEffect(() => { if (user?.username) setUsername(user.username); }, [user]);

    const openCreate = () => { setEditingToken(null); setIsModalOpen(true); };
    const openEdit = (token: TokenData) => { setEditingToken(token); setIsModalOpen(true); };

    const handleSaveToken = () => {
        void fetchTokens();
        setIsModalOpen(false);
        setEditingToken(null);
    };

    const handleDeleteToken = async (id?: string) => {
        if (!id) return;
        setDeleteError(null);
        try {
            await deleteToken(id);
        } catch {
            setDeleteError('Erro ao excluir o token. O servidor está online?');
        }
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsError(null);
        if (newPassword && newPassword !== confirmPassword) {
            setSettingsError('As senhas não coincidem.');
            return;
        }
        // TODO: chamar api de atualização de perfil
    };

    return (
        <div className="min-h-screen pt-4 pb-20">

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Minha Biblioteca</h1>
                    <p className="text-gray-400">Gerencie seus modelos de tokens para usar nas partidas.</p>
                </div>
                <div className="bg-gray-900 p-1 rounded-lg flex gap-1 border border-gray-800">
                    <button
                        onClick={() => setActiveTab('tokens')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all font-medium ${activeTab === 'tokens' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <LayoutGrid size={18} /> Tokens Salvos
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all font-medium ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Settings size={18} /> Minha Conta
                    </button>
                </div>
            </div>

            {activeTab === 'tokens' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                    {/* Indicador de limite */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {Array.from({ length: MAX_TOKENS }).map((_, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i < libraryTokens.length ? 'bg-purple-500' : 'bg-gray-700'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-400">{libraryTokens.length}/{MAX_TOKENS} tokens salvos</span>
                        </div>
                        {hasReachedLimit && (
                            <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                                Limite atingido
                            </span>
                        )}
                    </div>

                    {/* Botão criar */}
                    <button
                        onClick={openCreate}
                        disabled={hasReachedLimit || isMutating}
                        className="w-full md:w-auto bg-gray-800/50 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed border-2 border-dashed border-gray-700 hover:border-purple-500 disabled:hover:border-gray-700 text-gray-400 hover:text-purple-400 disabled:hover:text-gray-400 py-6 px-12 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-4 transition-all group"
                    >
                        <div className="bg-gray-700 group-hover:bg-purple-500/20 p-3 rounded-full transition-colors">
                            <Plus size={24} />
                        </div>
                        <div className="text-left">
                            <span className="font-semibold text-lg block">Criar Novo Modelo de Token</span>
                            {hasReachedLimit && <span className="text-xs text-amber-400">Remova um token para criar um novo</span>}
                        </div>
                    </button>

                    {/* Erros */}
                    {deleteError && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle size={16} className="shrink-0" /> {deleteError}
                        </div>
                    )}
                    {error && !deleteError && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                            <AlertCircle size={16} className="shrink-0" /> {error}
                            <button onClick={() => void fetchTokens()} className="ml-auto underline text-xs">Tentar novamente</button>
                        </div>
                    )}

                    {/* Lista */}
                    {loading ? (
                        <div className="flex flex-col items-center py-20 text-purple-500">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <p className="text-xs uppercase tracking-widest opacity-50">Sincronizando biblioteca...</p>
                        </div>
                    ) : libraryTokens.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            Sua biblioteca está vazia. Crie um token para começar!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                            {libraryTokens.map(token => (
                                <div key={token.id} className="group relative flex flex-col items-center w-full max-w-[300px]">
                                    <div className="transform transition-transform group-hover:scale-[1.02] duration-300 w-full">
                                        <TokenCard data={token} className="shadow-xl brightness-90 group-hover:brightness-100 transition-all" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-[18px]">
                                        <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <button onClick={() => openEdit(token)} className="bg-white text-gray-900 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                                                <Edit size={16} /> Editar
                                            </button>
                                            <button onClick={() => handleDeleteToken(token.id)} disabled={isMutating} className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                                                <Trash2 size={16} /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

            ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Configurações de Perfil</h2>
                                <p className="text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        <form className="space-y-8" onSubmit={handleSaveSettings}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Nome de Usuário</label>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <input type="email" value={user?.email ?? ''} disabled className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                                    <p className="text-xs text-gray-600">O email não pode ser alterado.</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-semibold text-white border-l-4 border-purple-500 pl-3">Segurança</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Nova Senha</label>
                                        <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Confirmar Senha</label>
                                        <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                </div>
                                {settingsError && (
                                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                                        <AlertCircle size={16} className="shrink-0" /> {settingsError}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                                <button type="button" onClick={logout} className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <LogOut size={16} /> Sair da Conta
                                </button>
                                <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-900/20 transition-all hover:scale-105">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}

            <TokenModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingToken(null); }}
                onSave={handleSaveToken}
                initialData={editingToken}
            />
        </div>
    );
};