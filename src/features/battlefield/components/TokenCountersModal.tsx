import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Minus, Plus } from 'lucide-react';
import { KeywordCounterType, PTCounterType, TokenCounters, TokenData } from '@/types';
import { PT_COUNTER_DEFS, KEYWORD_COUNTER_DEFS } from '../constants/counters';
import { adjustKeywordCounter, adjustPTCounter, normalizeCounters } from '../utils/counters';

interface TokenCountersModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: TokenData | null;
    onChange: (tokenId: string, counters: TokenCounters) => void;
}

interface CounterStepperRowProps {
    icon?: ReactNode;
    label: string;
    value: number;
    onDecrement: () => void;
    onIncrement: () => void;
}

const CounterStepperRow = ({ icon, label, value, onDecrement, onIncrement }: CounterStepperRowProps) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
        <span className="flex items-center gap-2 text-sm text-gray-300 truncate">
            {icon}
            {label}
        </span>
        <div className={`flex items-center gap-2 bg-gray-900/95 border ${
            value > 0 ? 'border-purple-500/40' : 'border-gray-700'
        } rounded-full px-2 py-1 shrink-0`}>
            <button
                onClick={onDecrement}
                disabled={value === 0}
                className="w-6 h-6 rounded-full bg-gray-800 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center active:scale-90 transition-colors"
            >
                <Minus size={14} />
            </button>
            <span className={`text-sm font-semibold min-w-[16px] text-center font-serif ${value > 0 ? 'text-white' : 'text-gray-600'}`}>
                {value}
            </span>
            <button
                onClick={onIncrement}
                className="w-6 h-6 rounded-full bg-gray-800 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center active:scale-90 transition-colors"
            >
                <Plus size={14} />
            </button>
        </div>
    </div>
);

export const TokenCountersModal = ({ isOpen, onClose, token, onChange }: TokenCountersModalProps) => {
    if (!token) return null;

    const counters = normalizeCounters(token.counters);

    const handlePTChange = (type: PTCounterType, delta: number) => {
        onChange(token.id, adjustPTCounter(counters, type, delta));
    };

    const handleKeywordChange = (type: KeywordCounterType, delta: number) => {
        onChange(token.id, adjustKeywordCounter(counters, type, delta));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-gray-900 border border-gray-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar">

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Layers className="text-purple-400" />
                                    Marcadores — {token.name || 'Token'}
                                </h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Marcadores de +1/+1
                                    </label>
                                    <div className="divide-y divide-gray-800">
                                        {PT_COUNTER_DEFS.map(def => (
                                            <CounterStepperRow
                                                key={def.id}
                                                label={def.label}
                                                value={counters.pt[def.id] ?? 0}
                                                onDecrement={() => handlePTChange(def.id, -1)}
                                                onIncrement={() => handlePTChange(def.id, 1)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                                        Palavras-chave
                                    </label>
                                    <div className="divide-y divide-gray-800">
                                        {KEYWORD_COUNTER_DEFS.map(def => {
                                            const Icon = def.icon;
                                            return (
                                                <CounterStepperRow
                                                    key={def.id}
                                                    icon={<Icon size={14} className="text-gray-500 shrink-0" />}
                                                    label={def.label}
                                                    value={counters.keyword[def.id] ?? 0}
                                                    onDecrement={() => handleKeywordChange(def.id, -1)}
                                                    onIncrement={() => handleKeywordChange(def.id, 1)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
