import { Link } from 'react-router-dom';
import { Scroll } from 'lucide-react';
import { SEO } from '@/components/SEO';

const LAST_UPDATED = '11 de agosto de 2026';

export const TermsOfServicePage = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-10 py-10">
            <SEO
                title="Termos de Uso"
                description="Confira os termos de uso do TokenForge."
                path="/termos-de-uso"
            />
            <header className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20">
                    <Scroll className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Termos de Uso</h1>
                <p className="text-gray-500 text-sm">Última atualização: {LAST_UPDATED}</p>
            </header>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-10 space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">

                <p>
                    Ao criar uma conta ou usar o TokenForge, você concorda com estes Termos de Uso. Se você não
                    concordar com algum ponto, pedimos que não utilize a aplicação.
                </p>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">1. O que é o TokenForge</h2>
                    <p>
                        O TokenForge é uma ferramenta gratuita, feita por fãs, para ajudar jogadores de Magic: The
                        Gathering a criar e controlar tokens durante suas partidas. Não é um produto oficial e não tem
                        qualquer vínculo com a Wizards of the Coast — veja a seção 6.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">2. Sua conta</h2>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li>Você é responsável por manter suas credenciais de acesso em sigilo;</li>
                        <li>Você é responsável pela veracidade das informações fornecidas no cadastro;</li>
                        <li>Você é responsável pelo conteúdo (nomes, textos e imagens) que adicionar aos seus tokens;</li>
                        <li>Reservamo-nos o direito de suspender contas usadas de forma abusiva ou fraudulenta.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">3. Uso aceitável</h2>
                    <p>Ao usar o TokenForge, você concorda em não:</p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 ml-2">
                        <li>Enviar imagens ou textos ilegais, ofensivos, ou que violem direitos autorais de terceiros;</li>
                        <li>Tentar burlar limites técnicos da aplicação (por exemplo, o limite de tokens por conta);</li>
                        <li>Tentar acessar contas de outros usuários ou explorar falhas de segurança;</li>
                        <li>Usar a aplicação para qualquer finalidade ilegal.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">4. Limites do serviço</h2>
                    <p>
                        O TokenForge é oferecido gratuitamente, sem garantias de disponibilidade contínua. Por ser um
                        projeto independente, podem existir limites técnicos (como quantidade de tokens por conta) e o
                        serviço pode sofrer instabilidades, manutenções ou mudanças sem aviso prévio.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">5. Isenção de garantias e limitação de responsabilidade</h2>
                    <p>
                        O TokenForge é fornecido "como está", sem garantias de qualquer tipo. Na máxima extensão
                        permitida por lei, não nos responsabilizamos por perdas de dados, indisponibilidade do serviço
                        ou quaisquer danos decorrentes do uso da aplicação.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">6. Propriedade intelectual</h2>
                    <p>
                        TokenForge é um conteúdo de fã não oficial, permitido pela Política de Conteúdo de Fãs da
                        Wizards of the Coast. Este projeto não é aprovado ou endossado pela Wizards. Magic: The
                        Gathering e suas marcas são propriedade da Wizards of the Coast LLC. Você mantém os direitos
                        sobre as imagens e textos que enviar, mas nos concede licença para armazená-los e exibi-los
                        dentro da aplicação, apenas para você.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">7. Encerramento de conta</h2>
                    <p>
                        Você pode solicitar o encerramento da sua conta a qualquer momento. Também podemos suspender
                        ou encerrar contas que violem estes termos. Veja nossa{' '}
                        <Link to="/politica-de-privacidade" className="text-purple-400 hover:text-purple-300 underline">
                            Política de Privacidade
                        </Link>{' '}
                        para saber como seus dados são tratados após o encerramento.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">8. Alterações nestes termos</h2>
                    <p>
                        Podemos atualizar estes termos de tempos em tempos. Mudanças relevantes serão refletidas na
                        data de "última atualização" no topo desta página. O uso continuado da aplicação após uma
                        atualização representa sua concordância com os novos termos.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-white">9. Contato</h2>
                    <p>
                        Dúvidas sobre estes termos podem ser enviadas através de uma issue no{' '}
                        <a href="https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                            repositório do projeto no GitHub
                        </a>{' '}
                        ou pela página de{' '}
                        <Link to="/reportar-bug" className="text-purple-400 hover:text-purple-300 underline">
                            Reportar Bug
                        </Link>.
                    </p>
                </section>
            </div>
        </div>
    );
};
