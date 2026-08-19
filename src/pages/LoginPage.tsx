import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn, Loader2, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout, Field, inputClass, primaryButtonClass } from '@/components/AuthLayout';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login({ identifier, password });
            navigate('/jogar');
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors?.code === 'EMAIL_NOT_VERIFIED') {
                navigate('/verificar-email', { state: { email: errors.email } });
                return;
            }
            setError(err.response?.data?.message || 'Email/usuário ou senha incorretos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            eyebrow="Token Forge"
            title="Entrar"
            subtitle="Acesse sua biblioteca de tokens salvos."
            footer={
                <>
                    Ainda não tem conta?{' '}
                    <Link to="/cadastro" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        Criar conta
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Field id="login-identifier" label="Email ou usuário" icon={<User size={14} />}>
                    <input
                        id="login-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={e => { setIdentifier(e.target.value); setError(null); }}
                        className={inputClass}
                        placeholder="seu@email.com"
                    />
                </Field>

                <Field
                    id="login-password"
                    label="Senha"
                    icon={<Lock size={14} />}
                    action={
                        <Link to="/esqueci-senha" className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
                            Esqueci a senha
                        </Link>
                    }
                >
                    <input
                        id="login-password"
                        type="password"
                        required
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(null); }}
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
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={17} /> Entrar na mesa</>}
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
                    text="signin_with"
                    width="320"
                />
            </div>
        </AuthLayout>
    );
};
