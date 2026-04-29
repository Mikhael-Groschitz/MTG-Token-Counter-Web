import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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

    // ── Validação local ───────────────────────────────────
    const validate = (): string | null => {
        if (formData.username.trim().length < 3)
            return 'O nome de usuário deve ter pelo menos 3 caracteres.';
        if (formData.password.length < MIN_PASSWORD_LENGTH)
            return `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
        if (formData.password !== formData.confirmPassword)
            return 'As senhas não coincidem.';
        return null;
    };

    // ── Registro com email ────────────────────────────────
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
            // Redireciona para verificação de email após registro bem-sucedido
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Erro ao criar conta. Tente novamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ── Registro/Login com Google ─────────────────────────
    const googleLogin = useGoogleLogin({
        onSuccess: async ({ access_token }) => {
            setIsLoading(true);
            setError(null);
            try {
                await loginWithGoogle(access_token);
                navigate('/');
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                    'Falha ao autenticar com o Google.'
                );
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Falha ao conectar com o Google. Tente novamente.'),
    });

    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden rounded-3xl">

            {/* Blooms de fundo */}
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
                            Crie sua conta
                        </h1>
                        <p className="text-gray-400 text-sm mt-2 font-medium">
                            Comece a forjar seus tokens hoje mesmo.
                        </p>
                    </div>

                    {/* Botão Google */}
                    <button
                        onClick={() => googleLogin()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 disabled:opacity-60 transition-all active:scale-[0.98] mb-6 shadow-xl"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continuar com Google
                    </button>

                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-800" />
                        <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">Ou via email</span>
                        <div className="flex-grow border-t border-gray-800" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Nome de Usuário */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Nome de Usuário</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    placeholder="Ex: Planeswalker99"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700"
                                    placeholder="Mín. 8 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {/* Indicador de força */}
                            {formData.password.length > 0 && (
                                <div className="flex gap-1 mt-1.5">
                                    {[1, 2, 3].map(level => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${
                                                formData.password.length >= level * 4
                                                    ? level === 1 ? 'bg-red-500'
                                                        : level === 2 ? 'bg-amber-400'
                                                            : 'bg-green-500'
                                                    : 'bg-gray-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Confirmar Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-gray-950/40 border text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 transition-all placeholder:text-gray-700 ${
                                        formData.confirmPassword && formData.confirmPassword !== formData.password
                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
                                            : 'border-gray-800 focus:border-purple-500 focus:ring-purple-500/50'
                                    }`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Erro inline */}
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
                                <>
                                    Criar Conta <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                            Faça login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};