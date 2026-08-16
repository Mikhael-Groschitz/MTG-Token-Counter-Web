import { useState, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowLeft, Loader2, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { authService } from '@/services/authService';
import { SEO } from '@/components/SEO';

const MIN_PASSWORD_LENGTH = 8;

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Link de recuperação inválido. Solicite um novo e-mail de recuperação.');
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword(token, password);
            setIsSubmitted(true);
            setTimeout(() => navigate('/entrar'), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao redefinir a senha. Solicite um novo link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden rounded-3xl">
            <SEO title="Redefinir Senha" description="Defina uma nova senha para sua conta TokenForge." path="/redefinir-senha" noindex />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl min-h-[450px] flex flex-col justify-center">

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-inner">
                                        <KeyRound className="w-10 h-10 text-purple-400" />
                                    </div>

                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
                                        Nova senha
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        Escolha uma nova senha para sua conta.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="new-password" className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Nova Senha</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                id="new-password"
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                                className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700 shadow-inner"
                                                placeholder="Mín. 8 caracteres"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="confirm-password" className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Confirmar Senha</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                                                className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700 shadow-inner"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                                            <AlertCircle size={16} className="shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 group"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={22} />
                                        ) : (
                                            'Redefinir Senha'
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="text-center py-8"
                            >
                                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                    <CheckCircle className="w-12 h-12 text-green-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Senha redefinida!</h2>
                                <p className="text-gray-400 text-sm mb-2 leading-relaxed px-4">
                                    Redirecionando para o login...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link
                            to="/entrar"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors text-sm font-bold group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para o Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
