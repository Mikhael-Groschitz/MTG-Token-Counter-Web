import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout, Field, inputClass, primaryButtonClass } from '@/components/AuthLayout';

const MIN_PASSWORD_LENGTH = 8;

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const validate = (): string | null => {
        if (formData.username.trim().length < 3)
            return 'O nome de usuário deve ter pelo menos 3 caracteres.';
        if (formData.password.length < MIN_PASSWORD_LENGTH)
            return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
        if (formData.password !== formData.confirmPassword)
            return 'As senhas não coincidem.';
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setIsLoading(true);
        setError(null);
        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            navigate('/verificar-email', { state: { email: formData.email } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const mismatch = formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password;

    return (
        <AuthLayout
            eyebrow="Token Forge"
            title="Criar conta"
            subtitle="Salve seus tokens e reutilize em qualquer mesa."
            footer={
                <>
                    Já tem conta?{' '}
                    <Link to="/entrar" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        Entrar
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Field id="register-username" label="Nome de usuário" icon={<User size={14} />}>
                    <input
                        id="register-username"
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Ex: Planeswalker99"
                    />
                </Field>

                <Field id="register-email" label="Email" icon={<Mail size={14} />}>
                    <input
                        id="register-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="seu@email.com"
                    />
                </Field>

                <Field id="register-password" label="Senha" icon={<Lock size={14} />}>
                    <div className="relative">
                        <input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`${inputClass} pr-11`}
                            placeholder={`Mín. ${MIN_PASSWORD_LENGTH} caracteres`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {formData.password.length > 0 && (
                        <div className="flex gap-1 pt-1">
                            {[1, 2, 3].map(level => (
                                <div
                                    key={level}
                                    className={`h-0.5 flex-1 transition-colors ${
                                        formData.password.length >= level * 4
                                            ? level === 1 ? 'bg-red-500'
                                                : level === 2 ? 'bg-amber-400'
                                                    : 'bg-green-500'
                                            : 'bg-gray-800'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </Field>

                <Field id="register-confirm-password" label="Confirmar senha" icon={<Lock size={14} />}>
                    <input
                        id="register-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${inputClass} ${mismatch ? 'border-red-500/60 focus:border-red-500' : ''}`}
                        placeholder="••••••••"
                    />
                    {mismatch && <p className="text-xs text-red-400">As senhas não coincidem.</p>}
                </Field>

                {error && (
                    <p className="flex items-start gap-2 text-red-400 text-sm border-l-2 border-red-500/60 pl-3">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        {error}
                    </p>
                )}

                <button type="submit" disabled={isLoading} className={primaryButtonClass}>
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Criar conta <ArrowRight size={17} /></>}
                </button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <span className="h-px flex-1 bg-gray-800" />
                <span className="text-[10px] uppercase tracking-widest text-gray-600">ou</span>
                <span className="h-px flex-1 bg-gray-800" />
            </div>

            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        if (!credentialResponse.credential) return;
                        setIsLoading(true);
                        setError(null);
                        try {
                            await loginWithGoogle(credentialResponse.credential);
                            navigate('/jogar');
                        } catch (err: any) {
                            setError(err.response?.data?.message || 'Falha ao autenticar com o Google.');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    onError={() => setError('Falha ao conectar com o Google. Tente novamente.')}
                    theme="filled_black"
                    type="standard"
                    shape="rectangular"
                    size="large"
                    text="signup_with"
                    width="320"
                />
            </div>
        </AuthLayout>
    );
};
