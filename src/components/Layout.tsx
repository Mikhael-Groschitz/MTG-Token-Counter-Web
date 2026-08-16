import React, { lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CardNavItem } from './ui/CardNav';
import { useAuth } from '@/context/AuthContext';

const CardNav = lazy(() => import('./ui/CardNav'));

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();
    const { pathname } = useLocation();
    const isLanding = pathname === '/';

    const navItems: CardNavItem[] = [
        {
            label: 'Jogar',
            bgColor: '#3b0764',
            textColor: '#e9d5ff',
            links: [
                { label: 'Início', href: '/' },
                { label: 'Mesa de Jogo', href: '/jogar' }
            ]
        },
        isAuthenticated ? {
            label: 'Minha Conta',
            bgColor: '#172554',
            textColor: '#dbeafe',
            links: [
                { label: 'Dashboard', href: '/painel' },
                { label: 'Sair', href: '#', ariaLabel: 'Logout', onClick: logout }
            ]
        } : {
            label: 'Acesso',
            bgColor: '#172554',
            textColor: '#dbeafe',
            links: [
                { label: 'Login', href: '/entrar' },
                { label: 'Criar Conta', href: '/cadastro' }
            ]
        },
        {
            label: 'Sobre',
            bgColor: '#022c22',
            textColor: '#d1fae5',
            links: [
                { label: 'Como Apoiar', href: '/apoiar' },
                { label: 'Github do Projeto', href: 'https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web' },
                { label: 'Reportar Bug', href: '/reportar-bug' },
                { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
                { label: 'Termos de Uso', href: '/termos-de-uso' }
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
            >
                Pular para o conteúdo
            </a>

            {!isLanding && (
                <Suspense fallback={null}>
                    <CardNav
                        items={navItems}
                        baseColor="#111827"
                        logoHref={'/jogar'}
                        isAuthenticated={isAuthenticated}
                        onLogout={logout}
                    />
                </Suspense>
            )}

            <main id="main-content" tabIndex={-1} className={isLanding ? 'flex-grow w-full' : 'flex-grow max-w-7xl mx-auto px-4 pt-24 pb-8 w-full'}>
                {children}
            </main>

            <footer className="w-full py-8 mt-auto border-t border-gray-900 bg-gray-950/50">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
                    <p className="text-sm text-gray-500 font-medium tracking-wide">
                        © {new Date().getFullYear()} Token Forge
                    </p>
                    <nav className="flex items-center gap-4 text-xs text-gray-500">
                        <Link to="/politica-de-privacidade" className="hover:text-purple-400 transition-colors">Política de Privacidade</Link>
                        <span className="text-gray-800">•</span>
                        <Link to="/termos-de-uso" className="hover:text-purple-400 transition-colors">Termos de Uso</Link>
                    </nav>
                    <p className="text-[10px] text-gray-400 max-w-2xl leading-relaxed uppercase tracking-tighter italic">
                        Token Forge é um conteúdo de fã não oficial permitido pela Política de Conteúdo de Fãs da Wizards of the Coast.
                        Este projeto não é aprovado ou endossado pela Wizards. Magic: The Gathering e suas marcas são propriedade da Wizards of the Coast LLC.
                    </p>
                </div>
            </footer>
        </div>
    );
};