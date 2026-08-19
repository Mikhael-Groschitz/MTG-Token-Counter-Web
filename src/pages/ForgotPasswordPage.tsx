import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Loader2, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { AuthLayout, Field, inputClass, primaryButtonClass } from '@/components/AuthLayout';

export const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao enviar o e-mail de recuperação. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="Recuperação"
            title="Esqueci a senha"
            subtitle="Enviamos um link de redefinição para o e-mail da sua conta."
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
                        <Field id="forgot-email" label="Email cadastrado" icon={<Mail size={14} />}>
                            <input
                                id="forgot-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="seu@email.com"
                            />
                        </Field>

                        {error && (
                            <p className="flex items-start gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                                {error}
                            </p>
                        )}

                        <button type="submit" disabled={isLoading} className={primaryButtonClass}>
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Enviar link <Send size={16} /></>}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-3"
                    >
                        <p className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <CheckCircle size={16} /> E-mail enviado
                        </p>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Mandamos um link de recuperação para{' '}
                            <span className="text-white font-medium">{email}</span>. O link vale por tempo limitado.
                        </p>
                        <p className="text-xs text-gray-600 border-t border-gray-800 pt-3">
                            Não chegou? Confira a caixa de spam antes de pedir outro.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthLayout>
    );
};
