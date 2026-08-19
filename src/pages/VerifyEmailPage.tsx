import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { AuthLayout, primaryButtonClass } from '@/components/AuthLayout';

const RESEND_COOLDOWN = 60; // segundos

export const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string | undefined;

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [cooldown, setCooldown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        if (!email) navigate('/cadastro');
    }, [email, navigate]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    if (!email) return null;

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authService.verifyEmail(email, code);
            navigate('/entrar', {
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

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResendSuccess(false);
        setError(null);
        try {
            await authService.resendVerificationCode(email);
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
        <AuthLayout
            eyebrow="Verificação"
            title="Confirme seu e-mail"
            subtitle={`Enviamos um código de 6 dígitos para ${email}. Ele expira em alguns minutos.`}
            backTo={{ to: '/entrar', label: 'Voltar para o login' }}
        >
            <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="verify-code" className="text-xs font-medium text-gray-400">
                        Código de verificação
                    </label>
                    <input
                        id="verify-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setCode(val);
                            setError(null);
                        }}
                        className={`w-full bg-gray-950/60 border rounded-lg py-4 text-center text-2xl font-semibold tracking-[0.6em] indent-[0.6em] focus:outline-none transition-colors placeholder:tracking-normal placeholder:indent-0 placeholder:text-sm placeholder:font-normal placeholder:text-gray-700 ${
                            error
                                ? 'border-red-500/60 text-red-400 focus:border-red-500'
                                : 'border-gray-800 text-gray-100 focus:border-purple-500'
                        }`}
                        placeholder="000000"
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- deliberate: this is a single-field OTP entry screen reached right after a redirect, autofocus is the expected UX for code-entry flows
                        autoFocus
                    />

                    {error && (
                        <p className="flex items-center gap-2 text-sm text-red-400">
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </p>
                    )}
                </div>

                <button type="submit" disabled={isLoading || code.length < 6} className={primaryButtonClass}>
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Confirmar código'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-500">Não recebeu o e-mail?</span>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={15} />
                    {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
                </button>
            </div>

            {resendSuccess && (
                <p className="mt-3 flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle size={14} />
                    Novo código enviado para {email}
                </p>
            )}
        </AuthLayout>
    );
};
