import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { Swords } from 'lucide-react';


type CardNavLink = {
    label: string;
    href: string;
    ariaLabel?: string;
    onClick?: () => void;
};

export type CardNavItem = {
    label: string;
    bgColor: string;
    textColor: string;
    links: CardNavLink[];
};

export interface CardNavProps {
    items: CardNavItem[];
    className?: string;
    baseColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
                                             items,
                                             className = '',
                                             baseColor = '#1f2937',
                                             buttonBgColor = '#9333ea',
                                             buttonTextColor = '#fff'
                                         }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    // CORREÇÃO: Calcula a altura de forma dinâmica para não cortar o conteúdo
    const calculateHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // No mobile damos uma altura fixa generosa, no desktop usamos 'auto'
        return isMobile ? 550 : "auto";
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });

            // Animação de abertura do container
            tl.to(navRef.current, {
                height: calculateHeight(),
                duration: 0.5,
                ease: 'power3.inOut',
                // Adiciona um pequeno padding interno quando aberto para respiro
                paddingBottom: "1.5rem"
            });

            // Animação dos cards aparecendo
            tl.fromTo(cardsRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
                "-=0.3"
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
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    cardsRef.current = [];

    return (
        <div className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 ${className}`}>
            <nav
                ref={navRef}
                className="w-full max-w-[800px] h-[60px] rounded-2xl shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: baseColor }}
            >
                {/* --- BARRA SUPERIOR (Sempre visível) --- */}
                <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-6 z-20">
                    <button
                        onClick={toggleMenu}
                        className="flex flex-col gap-[5px] group cursor-pointer p-2"
                        aria-label="Toggle menu"
                    >
                        <span className={`w-6 h-[2px] bg-white transition-transform origin-center duration-300 ${isExpanded ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${isExpanded ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-[2px] bg-white transition-transform origin-center duration-300 ${isExpanded ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>

                    <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-white font-bold text-xl">
                        <img src="/logo.png" alt="Logo TokenForge" className="w-16 h-16" />
                        <span>TokenForge</span>
                    </Link>

                    <Link
                        to="/login"
                        className="hidden md:flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-transform hover:scale-105"
                        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    >
                        Entrar na sua conta
                    </Link>
                </div>

                {/* --- CONTEÚDO EXPANDIDO --- */}
                <div className="pt-[70px] pb-4 px-4 flex flex-col md:flex-row gap-4 items-stretch justify-center">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            ref={addToRefs}
                            className="flex-1 rounded-xl p-5 flex flex-col gap-2 min-h-[120px] relative overflow-hidden transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: item.bgColor, color: item.textColor }}
                        >
                            <h3 className="font-bold text-xl mb-2">{item.label}</h3>

                            <div className="flex flex-col gap-3">
                                {item.links.map((link, linkIdx) => (
                                    <Link
                                        key={linkIdx}
                                        to={link.href}
                                        onClick={() => {
                                            toggleMenu();
                                            if (link.onClick) link.onClick();
                                        }}
                                        className="inline-flex items-center gap-2 text-sm md:text-base opacity-80 hover:opacity-100 transition-opacity font-medium group"
                                        aria-label={link.ariaLabel}
                                    >
                                        <GoArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;