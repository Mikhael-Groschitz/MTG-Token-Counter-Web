import { Fragment, ReactNode } from 'react';

const SYMBOL_PATTERN = /(\{[^}]+\})/g;

export function renderTextWithSymbols(text: string, symbolMap: Record<string, string>): ReactNode[] {
    return text.split(SYMBOL_PATTERN).map((part, i) => {
        const svgUri = symbolMap[part];
        if (svgUri) {
            return (
                <img
                    key={i}
                    src={svgUri}
                    alt={part}
                    className="inline-block h-[1em] w-[1em] align-[-0.15em] mx-[1px]"
                />
            );
        }
        return <Fragment key={i}>{part}</Fragment>;
    });
}
