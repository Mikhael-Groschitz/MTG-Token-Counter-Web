import React from 'react';
import CardNav, { CardNavItem } from './ui/CardNav';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();

    const navItems: CardNavItem[] = [
        {
            label: 'Jogar',
            bgColor: '#3b0764',
            textColor: '#e9d5ff',
            links: [
                { label: 'Mesa de Jogo', href: '/' }
            ]
        },
        isAuthenticated ? {
            label: 'Minha Conta',
            bgColor: '#172554',
            textColor: '#dbeafe',
            links: [
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Sair', href: '#', ariaLabel: 'Logout', onClick: logout }
            ]
        } : {
            label: 'Acesso',
            bgColor: '#172554',
            textColor: '#dbeafe',
            links: [
                { label: 'Login', href: '/login' },
                { label: 'Criar Conta', href: '/register' }
            ]
        },
        {
            label: 'Sobre',
            bgColor: '#022c22',
            textColor: '#d1fae5',
            links: [
                { label: 'Como Apoiar', href: '/support' },
                { label: 'Github do Projeto', href: 'https://github.com/Mikhael-Groschitz/MTG-Token-Counter-Web' },
                { label: 'Reportar Bug', href: '/bugreport' }
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 font-sans selection:bg-purple-500 selection:text-white">

            <CardNav
                items={navItems}
                baseColor="#111827"
            />

            <main className="flex-grow max-w-7xl mx-auto px-4 pt-24 pb-8 w-full">
                {children}
            </main>

            {/* Footer Minimalista sem links pessoais */}
            <footer className="w-full py-8 mt-auto border-t border-gray-900 bg-gray-950/50">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
                    <p className="text-sm text-gray-500 font-medium tracking-wide">
                        © {new Date().getFullYear()} Arg
                    </p>
                    <p className="text-[10px] text-gray-600 max-w-2xl leading-relaxed uppercase tracking-tighter italic">
                        TokenForge é um conteúdo de fã não oficial permitido pela Política de Conteúdo de Fãs da Wizards of the Coast.
                        Este projeto não é aprovado ou endossado pela Wizards. Magic: The Gathering e suas marcas são propriedade da Wizards of the Coast LLC.
                    </p>
                </div>
            </footer>
        </div>
    );
};