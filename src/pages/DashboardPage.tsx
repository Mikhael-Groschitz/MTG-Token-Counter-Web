import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, LayoutGrid, Trash2, Edit, LogOut, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { TokenCard } from '@/features/battlefield/components/TokenCard';
import { TokenModal } from '@/features/battlefield/components/TokenModal';
import { TokenData } from '@/types';
import { useTokens } from '@/hooks/useTokens';
import { useAuth } from '@/context/AuthContext';

const MAX_TOKENS = 5;

const fieldClass =
    'w-full bg-gray-950/60 border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors';

export const DashboardPage = () => {
    const { user, logout, updateProfile } = useAuth();
    const { tokens: libraryTokens, loading, isMutating, error, hasReachedLimit, fetchTokens, deleteToken } = useTokens();

    const [activeTab, setActiveTab] = useState<'tokens' | 'settings'>('tokens');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingToken, setEditingToken] = useState<TokenData | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [settingsError, setSettingsError] = useState<string | null>(null);
    const [settingsSuccess, setSettingsSuccess] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);

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

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsError(null);
        setSettingsSuccess(false);

        if (newPassword && newPassword !== confirmPassword) {
            setSettingsError('As senhas não coincidem.');
            return;
        }

        setIsSavingSettings(true);
        try {
            await updateProfile({
                username,
                currentPassword: newPassword ? currentPassword : undefined,
                newPassword: newPassword || undefined,
            });
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setSettingsSuccess(true);
        } catch (err: any) {
            setSettingsError(err.response?.data?.message || 'Erro ao salvar as alterações.');
        } finally {
            setIsSavingSettings(false);
        }
    };

    const tabClass = (tab: 'tokens' | 'settings') =>
        `pb-3 -mb-px flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
        }`;

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 pt-8 pb-24">
            {/* Cabeçalho: título + estado da biblioteca na mesma linha, abas como navegação real */}
            <header className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="border-l-2 border-purple-500 pl-5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                            {user?.username ?? 'Sua conta'}
                        </span>
                        <h1 className="text-3xl font-bold text-white tracking-tight mt-1.5">Minha biblioteca</h1>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex gap-1" aria-hidden>
                            {Array.from({ length: MAX_TOKENS }).map((_, i) => (
                                <span key={i} className={`w-6 h-0.5 ${i < libraryTokens.length ? 'bg-purple-500' : 'bg-gray-800'}`} />
                            ))}
                        </div>
                        <span className="text-gray-400 font-mono text-xs">
                            {libraryTokens.length}/{MAX_TOKENS}
                        </span>
                        {hasReachedLimit && <span className="text-xs text-amber-400">limite atingido</span>}
                    </div>
                </div>

                <nav className="flex gap-6 border-b border-gray-900">
                    <button onClick={() => setActiveTab('tokens')} className={tabClass('tokens')}>
                        <LayoutGrid size={16} /> Tokens salvos
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>
                        <Settings size={16} /> Minha conta
                    </button>
                </nav>
            </header>

            {activeTab === 'tokens' ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-8 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Modelos salvos ficam disponíveis em qualquer mesa.
                        </p>
                        <button
                            onClick={openCreate}
                            disabled={hasReachedLimit || isMutating}
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                        >
                            <Plus size={16} /> Novo token
                        </button>
                    </div>

                    {deleteError && (
                        <p className="flex items-center gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                            <AlertCircle size={15} className="shrink-0" /> {deleteError}
                        </p>
                    )}
                    {error && !deleteError && (
                        <p className="flex items-center gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                            <AlertCircle size={15} className="shrink-0" /> {error}
                            <button onClick={() => void fetchTokens()} className="ml-2 underline text-xs">Tentar novamente</button>
                        </p>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-2 py-20 justify-center text-gray-500 text-sm">
                            <Loader2 className="animate-spin" size={18} /> Sincronizando biblioteca...
                        </div>
                    ) : libraryTokens.length === 0 ? (
                        <div className="border border-gray-900 rounded-xl py-16 px-6 text-center">
                            <p className="text-gray-400">Sua biblioteca está vazia.</p>
                            <button onClick={openCreate} className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2 transition-colors">
                                Criar o primeiro token
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center pt-2">
                            {libraryTokens.map(token => (
                                <div key={token.id} className="flex flex-col items-center w-full max-w-[300px]">
                                    <TokenCard data={token} className="shadow-xl" />
                                    {/* Ações sempre visíveis, logo abaixo do token — sem overlay no hover */}
                                    <div className="flex items-center gap-1 mt-3 text-xs">
                                        <button
                                            onClick={() => openEdit(token)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
                                        >
                                            <Edit size={14} /> Editar
                                        </button>
                                        <span className="w-px h-4 bg-gray-800" />
                                        <button
                                            onClick={() => handleDeleteToken(token.id)}
                                            disabled={isMutating}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-8 max-w-2xl">
                    <form className="space-y-10" onSubmit={handleSaveSettings}>
                        <section className="space-y-4">
                            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">Perfil</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="dash-username" className="text-xs text-gray-400">Nome de usuário</label>
                                    <input id="dash-username" type="text" value={username} onChange={e => setUsername(e.target.value)} className={fieldClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="dash-email" className="text-xs text-gray-400">Email</label>
                                    <input id="dash-email" type="email" value={user?.email ?? ''} disabled className={`${fieldClass} text-gray-500 cursor-not-allowed`} />
                                    <p className="text-[11px] text-gray-600">O email não pode ser alterado.</p>
                                </div>
                            </div>
                        </section>

                        {user?.provider === 'local' && (
                            <section className="space-y-4">
                                <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">Segurança</h2>
                                <div className="space-y-1.5">
                                    <label htmlFor="dash-current-password" className="text-xs text-gray-400">Senha atual</label>
                                    <input id="dash-current-password" type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={fieldClass} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="dash-new-password" className="text-xs text-gray-400">Nova senha</label>
                                        <input id="dash-new-password" type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={fieldClass} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="dash-confirm-password" className="text-xs text-gray-400">Confirmar senha</label>
                                        <input id="dash-confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={fieldClass} />
                                    </div>
                                </div>
                            </section>
                        )}

                        {settingsError && (
                            <p className="flex items-center gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                                <AlertCircle size={15} className="shrink-0" /> {settingsError}
                            </p>
                        )}
                        {settingsSuccess && (
                            <p className="flex items-center gap-2 text-emerald-400 text-sm border-l-2 border-emerald-500/60 pl-3">
                                <CheckCircle size={15} className="shrink-0" /> Perfil atualizado com sucesso.
                            </p>
                        )}

                        <div className="flex items-center justify-between border-t border-gray-900 pt-6">
                            <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-2 transition-colors">
                                <LogOut size={15} /> Sair da conta
                            </button>
                            <button type="submit" disabled={isSavingSettings} className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                                {isSavingSettings ? <Loader2 className="animate-spin" size={16} /> : 'Salvar alterações'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <TokenModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingToken(null); }}
                onSave={handleSaveToken}
                initialData={editingToken}
                forceLibrarySave
                libraryTokenCount={libraryTokens.length}
            />
        </div>
    );
};
