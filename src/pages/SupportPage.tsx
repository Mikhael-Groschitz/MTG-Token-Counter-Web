import { Heart, Github, MessageSquare, Share2 } from 'lucide-react';

const ways = [
    {
        icon: MessageSquare,
        title: 'Dê seu feedback',
        text: 'Achou um bug ou tem ideia de funcionalidade? É assim que a ferramenta evolui.',
    },
    {
        icon: Github,
        title: 'Contribua com código',
        text: 'O projeto é open-source. Pull requests são bem-vindos no repositório.',
    },
    {
        icon: Share2,
        title: 'Espalhe a mágica',
        text: 'Mostre pro seu grupo de jogo ou pra loja local. Quanto mais gente usa, melhor fica.',
    },
    {
        icon: Heart,
        title: 'Mantenha a spark acesa',
        text: 'No futuro poderemos aceitar pequenas doações para cobrir custos de servidor.',
    },
];

export const SupportPage = () => {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <header className="border-l-2 border-purple-500 pl-5 mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Comunidade</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
                    Como apoiar o TokenForge
                </h1>
                <p className="text-gray-400 mt-3 max-w-xl">
                    Projeto de fã para fã, mantido nas horas vagas. Tem várias formas de ajudar — nenhuma
                    delas envolve pagar nada hoje.
                </p>
            </header>

            <ul className="divide-y divide-gray-900 border-y border-gray-900">
                {ways.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4 py-6">
                        <Icon size={20} className="text-purple-400 shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-semibold text-white">{title}</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mt-1">{text}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
