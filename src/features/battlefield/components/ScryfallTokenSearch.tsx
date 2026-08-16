import { useEffect, useRef, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { ScryfallCard, searchTokenCards } from '@/services/scryfallService';

interface ScryfallTokenSearchProps {
    onSelect: (card: ScryfallCard) => void;
}

export const ScryfallTokenSearch = ({ onSelect }: ScryfallTokenSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ScryfallCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const trimmed = query.trim();
        abortRef.current?.abort();

        if (!trimmed) {
            setResults([]);
            setIsLoading(false);
            setError(null);
            setHasSearched(false);
            return;
        }

        const controller = new AbortController();
        abortRef.current = controller;
        setIsLoading(true);
        setError(null);

        const timeout = setTimeout(async () => {
            try {
                const cards = await searchTokenCards(trimmed, controller.signal);
                setResults(cards);
                setHasSearched(true);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setError('Não foi possível buscar no Scryfall. Tente novamente.');
                }
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    return (
        <div className="w-full space-y-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 pl-9 text-white text-sm outline-none focus:border-purple-500 transition-all"
                    placeholder="Buscar token no Scryfall (ex: Soldier, Goblin...)"
                />
                {isLoading && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 animate-spin" />
                )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            {!error && hasSearched && !isLoading && results.length === 0 && (
                <p className="text-xs text-gray-500">Nenhum token encontrado para "{query.trim()}".</p>
            )}

            {results.length > 0 && (
                <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-1 border border-gray-800 rounded-xl p-1.5 bg-gray-950">
                    {results.map(card => {
                        const thumb = card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small;
                        return (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => onSelect(card)}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-500/10 text-left transition-colors"
                            >
                                {thumb ? (
                                    <img src={thumb} alt={card.name} className="w-8 h-8 rounded-md object-cover shrink-0" />
                                ) : (
                                    <div className="w-8 h-8 rounded-md bg-gray-800 shrink-0" />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm text-white truncate">{card.name}</p>
                                    {card.set_name && (
                                        <p className="text-[10px] text-gray-500 truncate">{card.set_name}</p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
