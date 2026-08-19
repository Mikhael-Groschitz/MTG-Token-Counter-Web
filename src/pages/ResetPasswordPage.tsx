import { useState, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Loader2, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { authService } from '@/services/authService';
import { AuthLayout, Field, inputClass, primaryButtonClass } from '@/components/AuthLayout';

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
        <AuthLayout
            eyebrow="Recuperação"
            title="Nova senha"
            subtitle="Defina a senha que você vai usar para entrar."
            backTo={{ to: '/entrar', label: 'Voltar para o login' }}
        >
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                    >
                        <Field id="new-password" label="Nova senha" icon={<KeyRound size={14} />}>
                            <input
                                id="new-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                className={inputClass}
                                placeholder={`Mín. ${MIN_PASSWORD_LENGTH} caracteres`}
                            />
                        </Field>

                        <Field id="confirm-password" label="Confirmar senha" icon={<Lock size={14} />}>
                            <input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                                className={inputClass}
                                placeholder="••••••••"
                            />
                        </Field>

                        {error && (
                            <p className="flex items-start gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                {error}
                            </p>
                        )}

                        <button type="submit" disabled={isLoading} className={primaryButtonClass}>
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Redefinir senha'}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                    >
                        <p className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <CheckCircle size={16} /> Senha redefinida
                        </p>
                        <p className="text-sm text-gray-400">Levando você para o login...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
};
