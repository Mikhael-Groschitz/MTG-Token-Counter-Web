import React from 'react';
import { TokenData, TokenColor } from '@/types';
import { Image as ImageIcon } from 'lucide-react';
import { COLOR_IDENTITY_MAP, buildConicGradient } from '../constants/colorIdentities';

interface TokenCardProps {
    data: TokenData;
    className?: string;
}

// --- CONFIGURAÇÃO DE ESTILOS ---

const frameColors: Record<Exclude<TokenColor, 'multicolored'>, string> = {
    white: 'bg-[#F8F6D8] border-[#E0DBC5]',
    blue: 'bg-[#C1D7E9] border-[#1D6F93]',
    black: 'bg-[#746C69] border-[#2B2625]',
    red: 'bg-[#E49977] border-[#A83D2A]',
    green: 'bg-[#9DCC9B] border-[#1F6636]',
    colorless: 'bg-[#D6D9DD] border-[#9EA2A7]',
};

const MULTICOLOR_FALLBACK_CLASS = 'bg-[#EBCF6E] border-[#D4B542]';

function getFrameStyle(data: Pick<TokenData, 'color' | 'colorIdentity'>): { className: string; style?: React.CSSProperties } {
    if (data.color === 'multicolored') {
        const identity = data.colorIdentity ? COLOR_IDENTITY_MAP[data.colorIdentity] : undefined;
        if (!identity) {
            return { className: MULTICOLOR_FALLBACK_CLASS };
        }
        return {
            className: 'border-[#8a7a52]',
            style: { background: buildConicGradient(identity.colors) },
        };
    }
    return { className: frameColors[data.color] ?? frameColors.colorless };
}

const textBoxBase = "border-[1px] border-[#8f9193] shadow-inner z-20 relative text-black transition-all duration-300";

export const TokenCard: React.FC<TokenCardProps> = ({ data, className = '' }) => {
    const isFullArt = data.layout === 'fullArt';
    const { className: frameClassName, style: frameStyle } = getFrameStyle(data);

    const barBackground = isFullArt ? "bg-[#EAECEE]/80 backdrop-blur-md" : "bg-[#EAECEE]";

    return (
        <div className={`w-[280px] aspect-[2.5/3.5] rounded-[14px] bg-black p-[10px] shadow-2xl relative group transition-transform hover:scale-[1.02] ${className}`}>

            <div className={`w-full h-full ${frameClassName} rounded-[6px] p-[3px] flex flex-col gap-[3px] relative overflow-hidden transition-colors duration-300`} style={frameStyle}>

                {isFullArt && data.imageUrl && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={data.imageUrl}
                            alt={data.name}
                            className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                )}

                <div className={`${textBoxBase} ${barBackground} h-[28px] rounded-tl-[4px] rounded-tr-[4px] px-2 flex items-center font-bold text-xs border-b-2 border-[#b0b2b4] z-30`}>
                    <span className="truncate w-full">{data.name || "Token Sem Nome"}</span>
                </div>

                {!isFullArt && (
                    <div className="flex-1 border-[1px] border-black bg-gray-900 relative overflow-hidden shadow-md mx-[1px] z-10">
                        {data.imageUrl ? (
                            <img
                                src={data.imageUrl}
                                alt={data.name}
                                className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-800">
                                <ImageIcon size={48} strokeWidth={1} />
                                <span className="text-[10px] mt-2 font-serif tracking-widest opacity-60">NO ART</span>
                            </div>
                        )}
                    </div>
                )}

                {isFullArt && <div className="flex-1" />}

                <div className={`${textBoxBase} ${barBackground} h-[24px] rounded-[2px] px-2 flex items-center z-30 
                    ${isFullArt ? 'mb-1 mx-1 shadow-lg' : ''}`}>
                    <span className="font-semibold text-[10px] uppercase tracking-wider truncate">
                        {data.typeLine || "Creature — Token"}
                    </span>
                    {!isFullArt && <div className="ml-auto w-4 h-4 bg-black rounded-full opacity-20"></div>}
                </div>

                {!isFullArt && (
                    <div className={`${textBoxBase} ${barBackground} h-[32%] rounded-bl-[4px] rounded-br-[4px] p-2 text-[11px] leading-snug relative z-20`}>
                        <div className="h-full w-full overflow-hidden overflow-y-auto pr-1 scrollbar-none font-serif text-gray-900">
                            {data.abilities ? (
                                data.abilities.split('\n').map((line, i) => (
                                    <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center italic text-gray-400 opacity-60 text-[10px]">
                                    (Sem habilidades)
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(data.power || data.toughness) && (
                    <div className={`${barBackground} border-l-[1px] border-t-[1px] border-[#8f9193] rounded-tl-[8px] px-3 py-1 font-bold text-sm shadow-sm z-40 min-w-[50px] text-center text-black absolute bottom-[-1px] right-[-1px] 
                        ${isFullArt ? 'rounded-br-[4px]' : 'rounded-br-[2px]'}`}>
                        {data.power || "0"}/{data.toughness || "0"}
                    </div>
                )}

            </div>
        </div>
    );
};