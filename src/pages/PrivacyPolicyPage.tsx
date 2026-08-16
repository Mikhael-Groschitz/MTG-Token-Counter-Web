import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { SEO } from '@/components/SEO';

const LAST_UPDATED = '15 de agosto de 2026';

export const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-10 py-10">
            <SEO
                title="Política de Privacidade"
                description="Entenda como o TokenForge trata seus dados pessoais."
                path="/politica-de-privacidade"
            />
            <header className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
                    <ShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Política de Privacidade</h1>
                <p className="text-gray-500 text-sm">Última atualização: {LAST_UPDATED}</p>
            </header>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-10 space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">

                <p>
                    O TokenForge ("nós", "nosso" ou "aplicação") é um projeto independente e não oficial, feito por fãs,
                    para ajudar jogadores de Magic: The Gathering a controlar tokens durante suas partidas. Esta política
                    explica quais dados coletamos, por que os coletamos, e como você pode controlá-los.
                </p>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">1. Quais dados coletamos</h2>
                    <p>Coletamos apenas o necessário para o funcionamento da conta e da ferramenta:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li><strong className="text-gray-200">Dados de conta:</strong> nome de usuário e e-mail. Se você criar uma conta com senha, armazenamos apenas o hash da senha (nunca o texto original).</li>
                        <li><strong className="text-gray-200">Login social (Google):</strong> ao entrar com Google, recebemos seu nome, e-mail e um identificador único da conta social, fornecidos diretamente pelo provedor. Não recebemos nem armazenamos sua senha do Google.</li>
                        <li><strong className="text-gray-200">Dados dos tokens:</strong> nome, tipo, cor, força/resistência, habilidades e a imagem de cada token que você criar.</li>
                        <li><strong className="text-gray-200">Imagens:</strong> imagens enviadas por você (upload) ou URLs de imagens externas que você informar para seus tokens.</li>
                        <li><strong className="text-gray-200">Dados técnicos de uso:</strong> métricas agregadas e anônimas de navegação, coletadas pelo Vercel Analytics, sem uso de cookies de rastreamento.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">2. Como usamos seus dados</h2>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li>Criar e autenticar sua conta;</li>
                        <li>Salvar e exibir os tokens que você cria na sua biblioteca pessoal;</li>
                        <li>Enviar e-mails de verificação de conta e de recuperação de senha;</li>
                        <li>Manter a aplicação funcionando com segurança (por exemplo, identificar tentativas indevidas de acesso).</li>
                    </ul>
                    <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins publicitários.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">3. Com quem seus dados são compartilhados</h2>
                    <p>Utilizamos os seguintes serviços de terceiros para operar o TokenForge — cada um trata os dados que lhes são enviados de acordo com suas próprias políticas de privacidade:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li><strong className="text-gray-200">Google</strong> — apenas se você optar por entrar usando essa conta, para autenticação.</li>
                        <li><strong className="text-gray-200">Cloudinary</strong> — armazenamento e entrega das imagens dos seus tokens.</li>
                        <li><strong className="text-gray-200">Neon (PostgreSQL)</strong> — armazenamento do banco de dados da aplicação.</li>
                        <li><strong className="text-gray-200">Render</strong> — hospedagem do servidor da aplicação (backend).</li>
                        <li><strong className="text-gray-200">Vercel</strong> — hospedagem do site (frontend) e métricas de uso anônimas.</li>
                        <li><strong className="text-gray-200">Google (Gmail SMTP)</strong> — envio dos e-mails de verificação de conta e recuperação de senha.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">4. Cookies e armazenamento local</h2>
                    <p>
                        Não utilizamos cookies de rastreamento. Após o login, guardamos seu token de sessão no{' '}
                        <code className="text-purple-300 bg-gray-950/60 px-1.5 py-0.5 rounded text-xs">localStorage</code>{' '}
                        do seu navegador, para mantê-lo autenticado entre visitas. Esse token não é enviado a terceiros
                        e é removido automaticamente quando você faz logout.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">5. Por quanto tempo guardamos seus dados</h2>
                    <p>
                        Seus dados são mantidos enquanto sua conta existir. Ainda não oferecemos exclusão automática de
                        conta pelo próprio aplicativo — para solicitar a exclusão da sua conta e dos seus dados, entre
                        em contato conforme a seção 7. Faremos a exclusão manualmente em até 30 dias.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">6. Seus direitos</h2>
                    <p>Você pode, a qualquer momento, solicitar:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li>Acesso aos dados que temos sobre você;</li>
                        <li>Correção de dados incorretos;</li>
                        <li>Exclusão da sua conta e dos dados associados.</li>
                    </ul>
                    <p>Você também pode desvincular o login social da sua conta entrando em contato com a gente.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">7. Como falar conosco</h2>
                    <p>
                        Para dúvidas, solicitações sobre seus dados ou qualquer outro assunto relacionado a esta
                        política, entre em contato através de um dos canais abaixo:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
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
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">8. Crianças e adolescentes</h2>
                    <p>
                        O TokenForge não é direcionado a menores de 13 anos e não coleta intencionalmente dados de
                        crianças. Se você acredita que uma criança nos forneceu dados pessoais, entre em contato para
                        que possamos removê-los.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">9. Alterações nesta política</h2>
                    <p>
                        Podemos atualizar esta política de tempos em tempos. Mudanças relevantes serão refletidas na
                        data de "última atualização" no topo desta página.
                    </p>
                </section>
            </div>
        </div>
    );
};
