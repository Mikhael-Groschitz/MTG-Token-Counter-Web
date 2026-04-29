import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';

const RESEND_COOLDOWN = 60; // segundos

export const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string | undefined;

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cooldown de reenvio
    const [cooldown, setCooldown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState(false);

    // Redireciona se chegou sem email no state
    useEffect(() => {
        if (!email) navigate('/register');
    }, [email, navigate]);

    // Countdown do cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    if (!email) return null;

    // ── Verificar código ──────────────────────────────────
    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authService.verifyEmail(email, code);
            navigate('/login', {
                state: { verified: true, message: 'Email verificado! Faça login para continuar.' }
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Código inválido ou expirado. Tente novamente.'
            );
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Reenviar código ───────────────────────────────────
    const handleResend = async () => {
        if (cooldown > 0) return;
        setResendSuccess(false);
        setError(null);
        try {
            await authService.forgotPassword(email);
            setResendSuccess(true);
            setCooldown(RESEND_COOLDOWN);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Erro ao reenviar o código. Tente novamente.'
            );
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden rounded-3xl">

            {/* Blooms de fundo */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl text-center">

                    {/* Ícone */}
                    <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                        <ShieldCheck className="w-10 h-10 text-purple-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Verifique seu <span className="text-purple-400">Email</span>
                    </h1>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Enviamos um código de 6 dígitos para<br />
                        <span className="text-white font-bold">{email}</span>
                    </p>

                    <form onSubmit={handleVerify} className="space-y-6 text-left">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em] text-center">
                                Código de Verificação
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={code}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setCode(val);
                                    setError(null);
                                }}
                                className={`w-full bg-gray-950/40 border text-center text-3xl tracking-[1rem] font-black rounded-2xl py-5 focus:outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-normal placeholder:text-gray-700 shadow-inner ${
                                    error
                                        ? 'border-red-500/50 text-red-400 focus:border-red-500/70'
                                        : 'border-gray-800 text-white focus:border-purple-500/50'
                                }`}
                                placeholder="000000"
                                autoFocus
                            />

                            {/* Erro inline */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || code.length < 6}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading
                                ? <Loader2 className="animate-spin" size={22} />
                                : 'Confirmar Código'
                            }
                        </button>
                    </form>

                    {/* Reenvio */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                        <p className="text-gray-500 text-xs">Não recebeu o e-mail?</p>

                        {/* Feedback de reenvio bem-sucedido */}
                        {resendSuccess && (
                            <div className="flex items-center justify-center gap-2 text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
                                <CheckCircle size={14} />
                                Novo código enviado para {email}
                            </div>
                        )}

                        <button
                            onClick={handleResend}
                            type="button"
                            disabled={cooldown > 0}
                            className="text-purple-400 hover:text-purple-300 disabled:text-gray-600 disabled:cursor-not-allowed text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors group"
                        >
                            <RefreshCw
                                size={16}
                                className={`transition-transform duration-500 ${cooldown > 0 ? '' : 'group-hover:rotate-180'}`}
                            />
                            {cooldown > 0
                                ? `Reenviar em ${cooldown}s`
                                : 'Reenviar Código'
                            }
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};