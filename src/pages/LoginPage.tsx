import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LoginSocialFacebook from '@greatsumini/react-facebook-login';
import { motion } from 'motion/react';
import { Lock, LogIn, Loader2, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, loginWithFacebook } = useAuth();

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
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Email/usuário ou senha incorretos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden rounded-3xl">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-gray-400 text-sm mt-2 font-medium">
                            Acesse sua coleção de tokens.
                        </p>
                    </div>

                    {/* Login social — Google e Facebook lado a lado */}
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="flex items-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (!credentialResponse.credential) return;
                                    setIsLoading(true);
                                    setError(null);
                                    try {
                                        await loginWithGoogle(credentialResponse.credential);
                                        navigate('/');
                                    } catch (err: any) {
                                        setError(err.response?.data?.message || 'Falha ao autenticar com o Google.');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                onError={() => setError('Falha ao conectar com o Google. Tente novamente.')}
                                theme="filled_black"
                                type="icon"
                                shape="square"
                                size="large"
                            />
                        </div>

                        <LoginSocialFacebook
                            appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                            onResolve={async ({ data }) => {
                                if (!data?.accessToken) return;
                                setIsLoading(true);
                                setError(null);
                                try {
                                    await loginWithFacebook(data.accessToken);
                                    navigate('/');
                                } catch (err: any) {
                                    setError(err.response?.data?.message || 'Falha ao autenticar com o Facebook.');
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            onReject={() => setError('Falha ao conectar com o Facebook. Tente novamente.')}
                        >
                            <button
                                type="button"
                                className="w-10 h-10 rounded-md bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center transition-colors"
                                aria-label="Entrar com Facebook"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                        </LoginSocialFacebook>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-800" />
                        <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">Ou via email</span>
                        <div className="flex-grow border-t border-gray-800" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Email ou Usuário</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={e => { setIdentifier(e.target.value); setError(null); }}
                                    className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Senha</label>
                                <Link to="/forgot-password" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError(null); }}
                                    className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
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
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>Entrar na Mesa <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            Registre-se agora
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};