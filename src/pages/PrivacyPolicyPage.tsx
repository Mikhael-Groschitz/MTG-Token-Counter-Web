import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = '15 de agosto de 2026';

const SECTIONS = [
    { id: 'dados', title: 'Quais dados coletamos' },
    { id: 'uso', title: 'Como usamos seus dados' },
    { id: 'compartilhamento', title: 'Com quem seus dados são compartilhados' },
    { id: 'cookies', title: 'Cookies e armazenamento local' },
    { id: 'retencao', title: 'Por quanto tempo guardamos seus dados' },
    { id: 'direitos', title: 'Seus direitos' },
    { id: 'contato', title: 'Como falar conosco' },
    { id: 'criancas', title: 'Crianças e adolescentes' },
    { id: 'alteracoes', title: 'Alterações nesta política' },
];

const Section = ({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) => (
    <section id={id} className="scroll-mt-24 space-y-3 border-t border-gray-900 pt-8">
        <h2 className="text-lg font-bold text-white flex items-baseline gap-3">
            <span className="text-xs font-mono text-purple-400">{String(index).padStart(2, '0')}</span>
            {title}
        </h2>
        {children}
    </section>
);

export const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <header className="border-l-2 border-purple-500 pl-5 mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Documento</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">Política de Privacidade</h1>
                <p className="text-gray-500 text-sm mt-2">Última atualização: {LAST_UPDATED}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <nav className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start" aria-label="Sumário">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-600 mb-4">Nesta página</p>
                    <ol className="space-y-2 text-sm">
                        {SECTIONS.map((s, i) => (
                            <li key={s.id} className="flex gap-3">
                                <span className="font-mono text-xs text-gray-700 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                                <a href={`#${s.id}`} className="text-gray-400 hover:text-purple-400 transition-colors">
                                    {s.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="lg:col-span-8 space-y-8 text-gray-300 leading-relaxed text-[15px]">
                    <p className="text-gray-400">
                        O TokenForge ("nós", "nosso" ou "aplicação") é um projeto independente e não oficial, feito por fãs,
                        para ajudar jogadores de Magic: The Gathering a controlar tokens durante suas partidas. Esta política
                        explica quais dados coletamos, por que os coletamos, e como você pode controlá-los.
                    </p>

                    <Section id="dados" index={1} title="Quais dados coletamos">
                        <p>Coletamos apenas o necessário para o funcionamento da conta e da ferramenta:</p>
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li><strong className="text-gray-200">Dados de conta:</strong> nome de usuário e e-mail. Se você criar uma conta com senha, armazenamos apenas o hash da senha (nunca o texto original).</li>
                            <li><strong className="text-gray-200">Login social (Google):</strong> ao entrar com Google, recebemos seu nome, e-mail e um identificador único da conta social, fornecidos diretamente pelo provedor. Não recebemos nem armazenamos sua senha do Google.</li>
                            <li><strong className="text-gray-200">Dados dos tokens:</strong> nome, tipo, cor, força/resistência, habilidades e a imagem de cada token que você criar.</li>
                            <li><strong className="text-gray-200">Imagens:</strong> imagens enviadas por você (upload) ou URLs de imagens externas que você informar para seus tokens.</li>
                            <li><strong className="text-gray-200">Dados técnicos de uso:</strong> métricas agregadas e anônimas de navegação, coletadas pelo Vercel Analytics, sem uso de cookies de rastreamento.</li>
                        </ul>
                    </Section>

                    <Section id="uso" index={2} title="Como usamos seus dados">
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li>Criar e autenticar sua conta;</li>
                            <li>Salvar e exibir os tokens que você cria na sua biblioteca pessoal;</li>
                            <li>Enviar e-mails de verificação de conta e de recuperação de senha;</li>
                            <li>Manter a aplicação funcionando com segurança (por exemplo, identificar tentativas indevidas de acesso).</li>
                        </ul>
                        <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins publicitários.</p>
                    </Section>

                    <Section id="compartilhamento" index={3} title="Com quem seus dados são compartilhados">
                        <p>Utilizamos os seguintes serviços de terceiros para operar o TokenForge — cada um trata os dados que lhes são enviados de acordo com suas próprias políticas de privacidade:</p>
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li><strong className="text-gray-200">Google</strong> — apenas se você optar por entrar usando essa conta, para autenticação.</li>
                            <li><strong className="text-gray-200">Cloudinary</strong> — armazenamento e entrega das imagens dos seus tokens.</li>
                            <li><strong className="text-gray-200">Neon (PostgreSQL)</strong> — armazenamento do banco de dados da aplicação.</li>
                            <li><strong className="text-gray-200">Render</strong> — hospedagem do servidor da aplicação (backend).</li>
                            <li><strong className="text-gray-200">Vercel</strong> — hospedagem do site (frontend) e métricas de uso anônimas.</li>
                            <li><strong className="text-gray-200">Google (Gmail SMTP)</strong> — envio dos e-mails de verificação de conta e recuperação de senha.</li>
                        </ul>
                    </Section>

                    <Section id="cookies" index={4} title="Cookies e armazenamento local">
                        <p>
                            Não utilizamos cookies de rastreamento. Após o login, guardamos seu token de sessão no{' '}
                            <code className="text-purple-300 bg-gray-950/60 px-1.5 py-0.5 rounded text-xs">localStorage</code>{' '}
                            do seu navegador, para mantê-lo autenticado entre visitas. Esse token não é enviado a terceiros
                            e é removido automaticamente quando você faz logout.
                        </p>
                    </Section>

                    <Section id="retencao" index={5} title="Por quanto tempo guardamos seus dados">
                        <p>
                            Seus dados são mantidos enquanto sua conta existir. Ainda não oferecemos exclusão automática de
                            conta pelo próprio aplicativo — para solicitar a exclusão da sua conta e dos seus dados, entre
                            em contato conforme a seção 7. Faremos a exclusão manualmente em até 30 dias.
                        </p>
                    </Section>

                    <Section id="direitos" index={6} title="Seus direitos">
                        <p>Você pode, a qualquer momento, solicitar:</p>
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li>Acesso aos dados que temos sobre você;</li>
                            <li>Correção de dados incorretos;</li>
                            <li>Exclusão da sua conta e dos dados associados.</li>
                        </ul>
                        <p>Você também pode desvincular o login social da sua conta entrando em contato com a gente.</p>
                    </Section>

                    <Section id="contato" index={7} title="Como falar conosco">
                        <p>
                            Para dúvidas, solicitações sobre seus dados ou qualquer outro assunto relacionado a esta
                            política, entre em contato através de um dos canais abaixo:
                        </p>
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li>
                                Abrindo uma issue no{' '}
                                <a href="https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                                    repositório do projeto no GitHub
                                </a>;
                            </li>
                            <li>
                                Pela página de{' '}
                                <Link to="/reportar-bug" className="text-purple-400 hover:text-purple-300 underline">
                                    Reportar Bug
                                </Link>{' '}
                                dentro do próprio aplicativo.
                            </li>
                        </ul>
                    </Section>

                    <Section id="criancas" index={8} title="Crianças e adolescentes">
                        <p>
                            O TokenForge não é direcionado a menores de 13 anos e não coleta intencionalmente dados de
                            crianças. Se você acredita que uma criança nos forneceu dados pessoais, entre em contato para
                            que possamos removê-los.
                        </p>
                    </Section>

                    <Section id="alteracoes" index={9} title="Alterações nesta política">
                        <p>
                            Podemos atualizar esta política de tempos em tempos. Mudanças relevantes serão refletidas na
                            data de "última atualização" no topo desta página.
                        </p>
                    </Section>
                </div>
            </div>
        </div>
    );
};
