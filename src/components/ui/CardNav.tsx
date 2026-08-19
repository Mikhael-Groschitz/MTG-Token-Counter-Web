import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

type CardNavLink = {
    label: string;
    href: string;
    ariaLabel?: string;
    onClick?: () => void;
};

export type CardNavItem = {
    label: string;
    /** Mantido por compatibilidade com o uso atual; o novo menu não usa cor de fundo por bloco. */
    bgColor?: string;
    textColor?: string;
    links: CardNavLink[];
};

export interface CardNavProps {
    items: CardNavItem[];
    className?: string;
    baseColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    logoHref?: string;
    isAuthenticated?: boolean;
    onLogout?: () => void;
}

/**
 * Barra de navegação enxuta: régua fina, tipografia e colunas de links.
 * Sem cartões coloridos empilhados, sem hover-scale decorativo.
 */
const CardNav: React.FC<CardNavProps> = ({
    items,
    className = '',
    baseColor = '#0b0b12',
    buttonBgColor = '#9333ea',
    buttonTextColor = '#fff',
    logoHref = '/jogar',
    isAuthenticated = false,
    onLogout
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const colsRef = useRef<HTMLDivElement[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const calculateHeight = () => 60 + (contentRef.current?.scrollHeight ?? 320);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            tl.to(navRef.current, {
                height: calculateHeight,
                duration: 0.42,
                ease: 'power3.inOut'
            });

            tl.fromTo(
                colsRef.current,
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out' },
                '-=0.22'
            );

            tlRef.current = tl;
        }, navRef);

        return () => ctx.revert();
    }, [items]);

    const toggleMenu = () => {
        if (!tlRef.current) return;
        if (!isExpanded) {
            setIsExpanded(true);
            tlRef.current.play();
        } else {
            setIsExpanded(false);
            tlRef.current.reverse();
        }
    };

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !colsRef.current.includes(el)) {
            colsRef.current.push(el);
        }
    };

    colsRef.current = [];

    return (
        <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 ${className}`}>
            <nav
                ref={navRef}
                className="w-full max-w-[900px] h-[60px] rounded-xl border border-gray-800 relative overflow-hidden"
                style={{ backgroundColor: baseColor }}
            >
                <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-4 sm:px-5 z-20">
                    <Link
                        to={logoHref}
                        className="flex items-center gap-2.5 text-white font-semibold tracking-tight rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                        <img src="/icons/icon-192.png" alt="Logo TokenForge" width={28} height={28} className="w-7 h-7" />
                        <span className="text-[15px]">
                            Token<span className="text-purple-400">Forge</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-lg font-medium text-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                            >
                                Sair
                            </button>
                        ) : (
                            <Link
                                to="/entrar"
                                className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-lg font-medium text-sm transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                            >
                                Entrar
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            aria-label={isExpanded ? 'Fechar menu' : 'Abrir menu'}
                            aria-expanded={isExpanded}
                            aria-controls="card-nav-content"
                        >
                            <span className="hidden sm:inline text-[11px] font-medium uppercase tracking-[0.18em]">
                                {isExpanded ? 'Fechar' : 'Menu'}
                            </span>
                            <span className="flex flex-col gap-[5px]">
                                <span className={`w-5 h-px bg-current transition-transform origin-center duration-300 ${isExpanded ? 'rotate-45 translate-y-[6px]' : ''}`} />
                                <span className={`w-5 h-px bg-current transition-opacity duration-300 ${isExpanded ? 'opacity-0' : ''}`} />
                                <span className={`w-5 h-px bg-current transition-transform origin-center duration-300 ${isExpanded ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                            </span>
                        </button>
                    </div>
                </div>

                <div
                    id="card-nav-content"
                    ref={contentRef}
                    className="pt-[70px] pb-6 px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7 border-t border-gray-900"
                >
                    {items.map((item, idx) => (
                        <div key={idx} ref={addToRefs} className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-3">
                                {item.label}
                            </p>
                            <ul className="space-y-2 border-l border-gray-800 pl-4">
                                {item.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            to={link.href}
                                            onClick={() => {
                                                toggleMenu();
                                                if (link.onClick) link.onClick();
                                            }}
                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                            aria-label={link.ariaLabel}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;
