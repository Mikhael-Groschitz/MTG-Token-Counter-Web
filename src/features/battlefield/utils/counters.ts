import { KeywordCounterType, PTCounterType, TokenCounters } from '@/types';
import { PT_COUNTER_DEFS } from '../constants/counters';

export function normalizeCounters(counters?: TokenCounters): TokenCounters {
    return {
        pt: counters?.pt ?? {},
        keyword: counters?.keyword ?? {},
    };
}

export function adjustPTCounter(counters: TokenCounters, type: PTCounterType, delta: number): TokenCounters {
    const current = counters.pt[type] ?? 0;
    const next = Math.max(0, current + delta);
    return { ...counters, pt: { ...counters.pt, [type]: next } };
}

export function adjustKeywordCounter(counters: TokenCounters, type: KeywordCounterType, delta: number): TokenCounters {
    const current = counters.keyword[type] ?? 0;
    const next = Math.max(0, current + delta);
    return { ...counters, keyword: { ...counters.keyword, [type]: next } };
}

interface EffectivePT {
    displayPower: string;
    displayToughness: string;
    netPower: number;
    netToughness: number;
    hasMod: boolean;
    netLabel: string;
}

// Regra 122.4: contadores +1/+1 e -1/-1 do mesmo permanente se anulam par a par.
// A soma aritmética simples já produz o resultado correto (um par se cancela
// naturalmente: +1 e -1 somam 0), então não é necessário nenhum passo extra
// de cancelamento antes de somar power/toughness.
export function getEffectivePT(
    base: { power?: string; toughness?: string },
    pt: TokenCounters['pt'],
): EffectivePT {
    let netPower = 0;
    let netToughness = 0;
    let hasMod = false;

    for (const def of PT_COUNTER_DEFS) {
        const count = pt[def.id] ?? 0;
        if (count === 0) continue;
        hasMod = true;
        netPower += def.deltaPower * count;
        netToughness += def.deltaToughness * count;
    }

    const basePowerNum = Number(base.power);
    const baseToughnessNum = Number(base.toughness);
    const isPowerNumeric = base.power !== undefined && base.power !== '' && Number.isFinite(basePowerNum);
    const isToughnessNumeric = base.toughness !== undefined && base.toughness !== '' && Number.isFinite(baseToughnessNum);

    const displayPower = isPowerNumeric ? String(basePowerNum + netPower) : (base.power || '0');
    const displayToughness = isToughnessNumeric ? String(baseToughnessNum + netToughness) : (base.toughness || '0');

    const netLabel = `${formatSigned(netPower)}/${formatSigned(netToughness)}`;

    return { displayPower, displayToughness, netPower, netToughness, hasMod, netLabel };
}

function formatSigned(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
}
