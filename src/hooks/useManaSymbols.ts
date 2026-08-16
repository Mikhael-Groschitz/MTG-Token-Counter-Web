import { useEffect, useState } from 'react';
import { getSymbologyMap } from '@/services/scryfallSymbologyService';

export const useManaSymbols = () => {
    const [symbolMap, setSymbolMap] = useState<Record<string, string>>({});

    useEffect(() => {
        let cancelled = false;
        getSymbologyMap()
            .then(map => {
                if (!cancelled) setSymbolMap(map);
            })
            .catch(() => {
                // Falha silenciosa: o texto continua sendo exibido cru
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return symbolMap;
};
