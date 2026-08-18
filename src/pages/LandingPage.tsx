import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Hammer,
    LogIn,
    UserPlus,
    Sparkles,
    Image as ImageIcon,
    Library,
    SlidersHorizontal,
    PenLine,
    BookmarkCheck,
} from 'lucide-react';
import { TokenCard } from '@/features/battlefield/components/TokenCard';
import { TokenData } from '@/types';

const soldierToken: TokenData = {
    id: 'preview-soldier',
    name: 'Avatar',
    imageUrl: '/landingpage-soldier.jpeg',
    typeLine: 'Token de Criatura — Avatar',
    color: 'white',
    power: '*',
    toughness: '*',
    abilities: 'O poder e a resistência desta criatura são ambos iguais ao seu total de pontos de vida',
    count: 1,
    layout: 'classic',
};

const dragonToken: TokenData = {
    id: 'preview-dragon',
    name: 'Dragão',
    imageUrl: '/landingpage-dragon.jpg',
    typeLine: 'Token de Criatura — Dragão',
    color: 'multicolored',
    colorIdentity: 'rakdos',
    power: '5',
    toughness: '5',
    abilities: 'Voar, ameaçar.\n \nToda vez que esta criatura causar dano de combate a um jogador, ganhe o controle do artefato alvo que aquele jogador controla',
    count: 1,
    layout: 'classic',
};

const zombieToken: TokenData = {
    id: 'preview-zombie',
    name: 'Zumbi',
    imageUrl: '/landingpage-zombie.jpg',
    typeLine: 'Token de Criatura — Zumbi',
    color: 'black',
    power: '2',
    toughness: '2',
    count: 1,
    layout: 'fullArt',
};

export const LandingPage = () => {
    return (
        <div className="flex flex-col pb-20">
            <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/icons/icon-192.png" alt="Logo TokenForge" width={36} height={36} className="w-9 h-9" />
                    <span className="font-bold text-lg tracking-tight text-white">Token Forge</span>
                </Link>
                <Link
                    to="/entrar"
                    className="text-sm font-semibold text-gray-400 hover:text-purple-400 transition-colors"
                >
                    Entrar
                </Link>
            </header>

            <section className="relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-6">
                            Sem instalar • Sem cadastro obrigatório
                        </span>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
                            Token Forge
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-medium mt-3 italic">
                            Forge seus próprios tokens
                        </p>

                        <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-6 max-w-xl mx-auto lg:mx-0">
                            Chega de improvisar tokens de <em>Magic: The Gathering</em> com dados, moedas ou pedacinhos
                            de papel. Crie proxies personalizadas — com nome, tipo, poder/resistência e imagem — e
                            controle a quantidade em campo em tempo real, direto do navegador.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
                            <Link
                                to="/jogar"
                                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                            >
                                <Hammer size={20} />
                                Começar a Forjar sem Cadastro
                            </Link>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 mt-6 text-sm">
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

                    <div className="hidden lg:flex items-end justify-center h-[420px] pb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -24, rotate: 0, scale: 0.78, zIndex: 5 }}
                            animate={{ opacity: 1, y: -24, rotate: -10, scale: 0.78, zIndex: 5 }}
                            whileHover={{ scale: 0.92, rotate: 0, y: -24, zIndex: 30, transition: { duration: 0.25, ease: 'easeOut' } }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="relative origin-bottom -mr-14 cursor-pointer"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TokenCard data={soldierToken} loading="eager" />
                            </motion.div>    
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -40, rotate: 0, scale: 0.78, zIndex: 15 }}
                            animate={{ opacity: 1, y: -40, rotate: 0, scale: 0.78, zIndex: 15 }}
                            whileHover={{ scale: 1, rotate: 0, y: -24, zIndex: 30, transition: { duration: 0.25, ease: 'easeOut' } }}
                            transition={{ duration: 0.7, delay: 0.45 }}
                            className="relative origin-bottom cursor-pointer"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TokenCard data={zombieToken} loading="eager" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -24, rotate: 0, scale: 0.78, zIndex: 5 }}
                            animate={{ opacity: 1, y: -24, rotate: 10, scale: 0.78, zIndex: 5 }}
                            whileHover={{ scale: 0.92, rotate: 0, y: -24, zIndex: 30, transition: { duration: 0.25, ease: 'easeOut' } }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative origin-bottom -ml-14 cursor-pointer"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <TokenCard data={dragonToken} loading="eager" />
                            </motion.div>    
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-24 md:gap-28 pt-4">

                <section className="max-w-6xl mx-auto w-full px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
                        Tudo que você precisa para forjar seus tokens
                    </h2>
                    <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                        Cada detalhe pensado pra tirar o improviso da mesa e devolver o tempo pro jogo.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                            <div className="bg-purple-500/10 rounded-xl p-3 w-fit mb-4">
                                <Sparkles className="text-purple-400" size={28} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Crie em segundos</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Defina nome, tipo, cor, poder/resistência e habilidades do seu token. Nenhum cadastro
                                necessário para começar a jogar.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all">
                            <div className="bg-blue-500/10 rounded-xl p-3 w-fit mb-4">
                                <ImageIcon className="text-blue-400" size={28} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Sua própria arte</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Envie uma imagem do seu computador ou use um link — do Scryfall ou qualquer outra
                                fonte — para deixar seus tokens com a cara da sua mesa.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-amber-500/50 hover:-translate-y-1 transition-all">
                            <div className="bg-amber-500/10 rounded-xl p-3 w-fit mb-4">
                                <SlidersHorizontal className="text-amber-400" size={28} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Controle em tempo real</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Ajuste a quantidade de cada token ao vivo, direto durante a partida — sem contar nos
                                dedos nem perder o fio da mesa.
                            </p>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-green-500/50 hover:-translate-y-1 transition-all">
                            <div className="bg-green-500/10 rounded-xl p-3 w-fit mb-4">
                                <Library className="text-green-400" size={28} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Biblioteca pessoal</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Crie uma conta gratuita para salvar seus tokens favoritos e reutilizá-los em qualquer
                                partida, sem recriar do zero.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-5xl mx-auto w-full px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
                        Do zero à mesa em três passos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-8 text-center">
                            <span className="block text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                                01
                            </span>
                            <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                                <PenLine size={18} className="text-purple-400" />
                                Crie seu token
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Escolha nome, tipo, cor, poder/resistência e a arte que quiser.
                            </p>
                        </div>

                        <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-8 text-center">
                            <span className="block text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                                02
                            </span>
                            <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                                <SlidersHorizontal size={18} className="text-purple-400" />
                                Controle em campo
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Ajuste a quantidade em tempo real, direto durante a partida.
                            </p>
                        </div>

                        <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-8 text-center">
                            <span className="block text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                                03
                            </span>
                            <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                                <BookmarkCheck size={18} className="text-purple-400" />
                                Salve na biblioteca
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Guarde seus favoritos e reutilize em qualquer mesa, sem recriar do zero.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto w-full px-6">
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-3xl px-8 py-14 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Pronto para forjar seu primeiro token?
                        </h2>
                        <p className="text-gray-300 max-w-xl mx-auto mb-8">
                            Entre na mesa agora mesmo — sem instalar nada e sem precisar criar conta.
                        </p>
                        <Link
                            to="/jogar"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                        >
                            <Hammer size={20} />
                            Começar a Forjar sem Cadastro
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};
