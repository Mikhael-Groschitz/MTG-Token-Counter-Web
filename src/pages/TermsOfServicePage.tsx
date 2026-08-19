import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = '11 de agosto de 2026';

const SECTIONS = [
    { id: 'o-que-e', title: 'O que é o TokenForge' },
    { id: 'conta', title: 'Sua conta' },
    { id: 'uso-aceitavel', title: 'Uso aceitável' },
    { id: 'limites', title: 'Limites do serviço' },
    { id: 'garantias', title: 'Isenção de garantias e responsabilidade' },
    { id: 'propriedade', title: 'Propriedade intelectual' },
    { id: 'encerramento', title: 'Encerramento de conta' },
    { id: 'alteracoes', title: 'Alterações nestes termos' },
    { id: 'contato', title: 'Contato' },
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

export const TermsOfServicePage = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <header className="border-l-2 border-purple-500 pl-5 mb-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Documento</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">Termos de Uso</h1>
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
                        Ao criar uma conta ou usar o TokenForge, você concorda com estes Termos de Uso. Se você não
                        concordar com algum ponto, pedimos que não utilize a aplicação.
                    </p>

                    <Section id="o-que-e" index={1} title="O que é o TokenForge">
                        <p>
                            O TokenForge é uma ferramenta gratuita, feita por fãs, para ajudar jogadores de Magic: The
                            Gathering a criar e controlar tokens durante suas partidas. Não é um produto oficial e não tem
                            qualquer vínculo com a Wizards of the Coast — veja a seção 06.
                        </p>
                    </Section>

                    <Section id="conta" index={2} title="Sua conta">
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li>Você é responsável por manter suas credenciais de acesso em sigilo;</li>
                            <li>Você é responsável pela veracidade das informações fornecidas no cadastro;</li>
                            <li>Você é responsável pelo conteúdo (nomes, textos e imagens) que adicionar aos seus tokens;</li>
                            <li>Reservamo-nos o direito de suspender contas usadas de forma abusiva ou fraudulenta.</li>
                        </ul>
                    </Section>

                    <Section id="uso-aceitavel" index={3} title="Uso aceitável">
                        <p>Ao usar o TokenForge, você concorda em não:</p>
                        <ul className="space-y-2 text-gray-400 border-l border-gray-800 pl-4">
                            <li>Enviar imagens ou textos ilegais, ofensivos, ou que violem direitos autorais de terceiros;</li>
                            <li>Tentar burlar limites técnicos da aplicação (por exemplo, o limite de tokens por conta);</li>
                            <li>Tentar acessar contas de outros usuários ou explorar falhas de segurança;</li>
                            <li>Usar a aplicação para qualquer finalidade ilegal.</li>
                        </ul>
                    </Section>

                    <Section id="limites" index={4} title="Limites do serviço">
                        <p>
                            O TokenForge é oferecido gratuitamente, sem garantias de disponibilidade contínua. Por ser um
                            projeto independente, podem existir limites técnicos (como quantidade de tokens por conta) e o
                            serviço pode sofrer instabilidades, manutenções ou mudanças sem aviso prévio.
                        </p>
                    </Section>

                    <Section id="garantias" index={5} title="Isenção de garantias e limitação de responsabilidade">
                        <p>
                            O TokenForge é fornecido "como está", sem garantias de qualquer tipo. Na máxima extensão
                            permitida por lei, não nos responsabilizamos por perdas de dados, indisponibilidade do serviço
                            ou quaisquer danos decorrentes do uso da aplicação.
                        </p>
                    </Section>

                    <Section id="propriedade" index={6} title="Propriedade intelectual">
                        <p>
                            TokenForge é um conteúdo de fã não oficial, permitido pela Política de Conteúdo de Fãs da
                            Wizards of the Coast. Este projeto não é aprovado ou endossado pela Wizards. Magic: The
                            Gathering e suas marcas são propriedade da Wizards of the Coast LLC. Você mantém os direitos
                            sobre as imagens e textos que enviar, mas nos concede licença para armazená-los e exibi-los
                            dentro da aplicação, apenas para você.
                        </p>
                    </Section>

                    <Section id="encerramento" index={7} title="Encerramento de conta">
                        <p>
                            Você pode solicitar o encerramento da sua conta a qualquer momento. Também podemos suspender
                            ou encerrar contas que violem estes termos. Veja nossa{' '}
                            <Link to="/politica-de-privacidade" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                                Política de Privacidade
                            </Link>{' '}
                            para saber como seus dados são tratados após o encerramento.
                        </p>
                    </Section>

                    <Section id="alteracoes" index={8} title="Alterações nestes termos">
                        <p>
                            Podemos atualizar estes termos de tempos em tempos. Mudanças relevantes serão refletidas na
                            data de "última atualização" no topo desta página. O uso continuado da aplicação após uma
                            atualização representa sua concordância com os novos termos.
                        </p>
                    </Section>

                    <Section id="contato" index={9} title="Contato">
                        <p>
                            Dúvidas sobre estes termos podem ser enviadas através de uma issue no{' '}
                            <a
                                href="https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
                            >
                                repositório do projeto no GitHub
                            </a>{' '}
                            ou pela página de{' '}
                            <Link to="/reportar-bug" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                                Reportar Bug
                            </Link>.
                        </p>
                    </Section>
                </div>
            </div>
        </div>
    );
};
