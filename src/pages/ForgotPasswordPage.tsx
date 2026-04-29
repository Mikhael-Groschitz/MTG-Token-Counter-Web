import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle, Send, Lock } from 'lucide-react';

export const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsSubmitted(true);
        console.log(`Email de recuperação enviado para: ${email}`);
    };

    return (
        // min-h-[90vh] para manter o alinhamento com Login/Register
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden rounded-3xl">

            {/* --- BLOOMS DE FUNDO (Ajustados para preencher a tela) --- */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                {/* Estilo de Vidro Premium: backdrop-blur-2xl e rounded-[2rem] */}
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
                                    {/* Ícone Estilizado */}
                                    <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-inner">
                                        <Lock className="w-10 h-10 text-purple-400" />
                                    </div>

                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
                                        Esqueceu a senha?
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        Não se preocupe. Digite seu email e enviaremos as instruções de recuperação.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-wider">Email Cadastrado</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-950/40 border border-gray-800 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-700 shadow-inner"
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 group"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={22} />
                                        ) : (
                                            <>
                                                Enviar Link <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                                            </>
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
                                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Email Enviado!</h2>
                                <p className="text-gray-400 text-sm mb-10 leading-relaxed px-4">
                                    Enviamos um link de recuperação para <br/>
                                    <span className="text-white font-bold">{email}</span>
                                </p>
                                <div className="bg-gray-950/30 rounded-xl p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs italic">
                                        Não recebeu? Verifique sua caixa de spam ou lixo eletrônico.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer do Card com separação sutil */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link
                            to="/login"
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