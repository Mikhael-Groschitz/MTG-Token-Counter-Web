import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hammer, LogIn, UserPlus, Sparkles, Image as ImageIcon, Library } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="flex flex-col gap-24 pb-20">

            {/* Hero */}
            <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden rounded-3xl -mt-8">
                <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-2xl mx-auto text-center px-4"
                >
                    <img src="/logo.svg" alt="Logo TokenForge" className="w-24 h-24 mx-auto mb-6" />

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
                        Token Forge
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 font-medium mt-3 italic">
                        Forge your own token
                    </p>

                    <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-8 max-w-xl mx-auto">
                        Chega de improvisar tokens de <em>Magic: The Gathering</em> com dados, moedas ou pedacinhos de
                        papel. Crie tokens personalizados — com nome, tipo, poder/resistência e imagem — e controle a
                        quantidade em campo em tempo real, direto do navegador. Sem instalar nada.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <Link
                            to="/jogar"
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Hammer size={20} />
                            Começar a Forjar sem Cadastro
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                        <Link
                            to="/entrar"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 font-semibold transition-colors"
                        >
                            <LogIn size={16} />
                            Entrar
                        </Link>
                        <span className="text-gray-800">•</span>
                        <Link
                            to="/cadastro"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 font-semibold transition-colors"
                        >
                            <UserPlus size={16} />
                            Criar conta para salvar seus tokens
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Recursos */}
            <section className="max-w-5xl mx-auto w-full px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                    Tudo que você precisa para forjar seus tokens
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-purple-500/50 transition-colors">
                        <Sparkles className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-lg font-bold mb-2">Crie em segundos</h3>
                        <p className="text-gray-400 text-sm">
                            Defina nome, tipo, cor, poder/resistência e habilidades do seu token. Nenhum cadastro
                            necessário para começar a jogar.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors">
                        <ImageIcon className="text-blue-400 mb-4" size={32} />
                        <h3 className="text-lg font-bold mb-2">Sua própria arte</h3>
                        <p className="text-gray-400 text-sm">
                            Envie uma imagem do seu computador ou use um link — do Scryfall ou qualquer outra fonte —
                            para deixar seus tokens com a cara da sua mesa.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-green-500/50 transition-colors">
                        <Library className="text-green-400 mb-4" size={32} />
                        <h3 className="text-lg font-bold mb-2">Biblioteca pessoal</h3>
                        <p className="text-gray-400 text-sm">
                            Crie uma conta gratuita para salvar seus tokens favoritos e reutilizá-los em qualquer
                            partida, sem recriar do zero.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
