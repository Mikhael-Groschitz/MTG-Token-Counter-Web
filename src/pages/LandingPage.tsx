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

const capabilities = [
    {
        icon: Sparkles,
        title: 'Crie em segundos',
        text: 'Nome, tipo, cor, poder/resistência e habilidades. Sem cadastro para começar.',
    },
    {
        icon: ImageIcon,
        title: 'Sua própria arte',
        text: 'Suba uma imagem do computador ou cole um link do Scryfall — ou de onde você quiser.',
    },
    {
        icon: SlidersHorizontal,
        title: 'Contagem ao vivo',
        text: 'Sobe e desce a quantidade em campo no meio do turno, sem contar nos dedos.',
    },
    {
        icon: Library,
        title: 'Biblioteca pessoal',
        text: 'Com conta, seus tokens ficam salvos e voltam prontos na próxima mesa.',
    },
];

const steps = [
    { icon: PenLine, title: 'Crie o token', text: 'Nome, tipo, cor, P/R e arte.' },
    { icon: SlidersHorizontal, title: 'Leve pra mesa', text: 'Ajuste a quantidade durante a partida.' },
    { icon: BookmarkCheck, title: 'Salve e reuse', text: 'Sua biblioteca acompanha seu deck.' },
];

export const LandingPage = () => {
    return (
        <div className="flex flex-col pb-24">
            <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/icons/icon-192.png" alt="Logo TokenForge" width={32} height={32} className="w-8 h-8" />
                    <span className="font-semibold tracking-tight text-white">Token Forge</span>
                </Link>
                <Link
                    to="/entrar"
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                >
                    Entrar
                </Link>
            </header>

            {/* Hero — coluna de texto estreita à esquerda, tokens ocupando o resto */}
            <section className="max-w-6xl mx-auto w-full px-6 pt-8 lg:pt-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="lg:col-span-5"
                    >
                        <p className="text-[11px] uppercase tracking-[0.22em] text-purple-400 mb-6">
                            Proxies de token para Magic
                        </p>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                            Pare de usar<br />
                            <span className="text-gray-500">moeda, dado e</span><br />
                            papelzinho.
                        </h1>

                        <p className="text-gray-400 leading-relaxed mt-6 max-w-md">
                            Monte a criatura no navegador com nome, tipo, poder/resistência e a arte que você
                            escolher — e controle quantas estão em campo enquanto a partida corre.
                        </p>

                        <div className="mt-10 flex flex-col items-start gap-4">
                            <Link
                                to="/jogar"
                                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                            >
                                <Hammer size={18} />
                                Abrir a mesa
                            </Link>
                            <span className="text-xs text-gray-600">
                                Sem instalar, sem cadastro obrigatório.
                            </span>
                        </div>

                        <div className="flex items-center gap-5 mt-10 pt-6 border-t border-gray-900 text-sm">
                            <Link to="/entrar" className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors">
                                <LogIn size={15} /> Entrar
                            </Link>
                            <Link to="/cadastro" className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors">
                                <UserPlus size={15} /> Criar conta
                            </Link>
                        </div>
                    </motion.div>

                    <div className="hidden lg:flex lg:col-span-7 items-end justify-center h-[420px] pb-6">
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

            {/* Recursos — bloco de texto + lista com divisores, sem grade de 4 caixas iguais */}
            <section className="max-w-6xl mx-auto w-full px-6 mt-28 md:mt-36">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            O que dá pra fazer
                        </h2>
                        <p className="text-gray-500 text-sm mt-3 max-w-xs">
                            O suficiente pra tirar o improviso da mesa — e nada além disso.
                        </p>
                    </div>

                    <ul className="lg:col-span-8 divide-y divide-gray-900 border-t border-gray-900">
                        {capabilities.map(({ icon: Icon, title, text }) => (
                            <li key={title} className="flex gap-4 py-6">
                                <Icon size={20} className="text-purple-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-white">{title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mt-1 max-w-xl">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Passos — linha numerada horizontal */}
            <section className="max-w-6xl mx-auto w-full px-6 mt-24">
                <h2 className="text-xs uppercase tracking-[0.22em] text-gray-500 mb-8">Como funciona</h2>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-900 border border-gray-900">
                    {steps.map(({ icon: Icon, title, text }, i) => (
                        <li key={title} className="bg-gray-950 p-8">
                            <span className="text-sm font-mono text-purple-400">0{i + 1}</span>
                            <h3 className="font-semibold text-white mt-4 flex items-center gap-2">
                                <Icon size={16} className="text-gray-500" />
                                {title}
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">{text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Fechamento — linha simples, sem caixa em gradiente */}
            <section className="max-w-6xl mx-auto w-full px-6 mt-24">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-gray-900 pt-10">
                    <p className="text-xl md:text-2xl text-white font-semibold tracking-tight max-w-md">
                        Sua próxima mesa começa em um clique.
                    </p>
                    <Link
                        to="/jogar"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                    >
                        <Hammer size={18} />
                        Abrir a mesa
                    </Link>
                </div>
            </section>
        </div>
    );
};
