import { Heart, Github, MessageSquare, Share2 } from 'lucide-react';

export const SupportPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white tracking-tight">Como Apoiar o <span className="text-purple-500">TokenForge</span></h1>
                <p className="text-gray-400 text-lg">Este é um projeto feito de fã para fãs. Veja como você pode ajudar a manter o projeto vivo.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card de Feedback */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-purple-500/50 transition-colors">
                    <MessageSquare className="text-purple-400 mb-4" size={32} />
                    <h2 className="text-xl font-bold mb-2">Dê seu Feedback</h2>
                    <p className="text-gray-400 text-sm">Encontrou um erro ou tem uma ideia de funcionalidade? Seu feedback é a principal forma de evolução da ferramenta.</p>
                </div>

                {/* Card de Código */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors">
                    <Github className="text-blue-400 mb-4" size={32} />
                    <h2 className="text-xl font-bold mb-2">Contribua com Código</h2>
                    <p className="text-gray-400 text-sm">O projeto é open-source. Se você é desenvolvedor, sinta-se à vontade para abrir Pull Requests no nosso repositório.</p>
                </div>

                {/* Card de Divulgação */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-green-500/50 transition-colors">
                    <Share2 className="text-green-400 mb-4" size={32} />
                    <h2 className="text-xl font-bold mb-2">Espalhe a Mágica</h2>
                    <p className="text-gray-400 text-sm">Compartilhe o TokenForge com seu grupo de jogo ou na sua loja local. Quanto mais pessoas usarem, melhor a ferramenta se torna.</p>
                </div>

                {/* Card de Mana (Doação ou Simbólico) */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-red-500/50 transition-colors">
                    <Heart className="text-red-400 mb-4" size={32} />
                    <h2 className="text-xl font-bold mb-2">Mantenha a Spark acesa</h2>
                    <p className="text-gray-400 text-sm">Gosta muito do projeto? No futuro, poderemos aceitar pequenas doações para cobrir os custos de servidor.</p>
                </div>
            </div>
        </div>
    );
};