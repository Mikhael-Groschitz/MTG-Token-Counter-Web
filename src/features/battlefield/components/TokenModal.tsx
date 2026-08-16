import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Wand2, Upload, Image as ImageIcon, LayoutList, Maximize, Search, AlertCircle, AlertTriangle, Library } from 'lucide-react';
import { TokenData, TokenColor } from '@/types';
import { tokenService } from '@/services/tokenService';
import { useAuth } from '@/context/AuthContext';
import { COLOR_IDENTITIES, TIER_LABELS, buildConicGradient, IdentityTier } from '../constants/colorIdentities';
import { ScryfallTokenSearch } from './ScryfallTokenSearch';
import { ScryfallCard, getImageStatusWarning, getScryfallImageUrl, mapScryfallColorsToToken } from '@/services/scryfallService';

const MAX_LIBRARY_TOKENS = 5;

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (token: TokenData) => void;
    initialData?: TokenData | null;
    /** Dashboard/biblioteca: sempre persiste no backend, sem exibir o toggle. */
    forceLibrarySave?: boolean;
    /** Quantidade atual de tokens na biblioteca do usuário, para bloquear o toggle no limite. */
    libraryTokenCount?: number;
}

const EMPTY_FORM: TokenData = {
    id: '',
    name: '',
    typeLine: 'Token Creature',
    color: 'colorless',
    power: '',
    toughness: '',
    abilities: '',
    count: 1,
    imageUrl: '',
    layout: 'classic',
};

export const TokenModal = ({ isOpen, onClose, onSave, initialData, forceLibrarySave = false, libraryTokenCount = 0 }: TokenModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!initialData;
    const { isAuthenticated } = useAuth();

    const showLibraryToggle = isAuthenticated && !forceLibrarySave;
    const libraryLimitReached = libraryTokenCount >= MAX_LIBRARY_TOKENS;

    const [baseType, setBaseType] = useState('Creature');
    const [subType, setSubType] = useState('');
    const [imageSource, setImageSource] = useState<'upload' | 'scryfall'>('upload');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TokenData>(EMPTY_FORM);
    const [saveToLibrary, setSaveToLibrary] = useState(false);
    const [selectedScryfallCard, setSelectedScryfallCard] = useState<ScryfallCard | null>(null);
    const [scryfallWarning, setScryfallWarning] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setError(null);
        setSaveToLibrary(false);
        setSelectedScryfallCard(null);
        setScryfallWarning(null);
        if (initialData) {
            setFormData(initialData);
            const parts = initialData.typeLine.replace('Token ', '').split(' — ');
            setBaseType(parts[0] || 'Creature');
            setSubType(parts[1] || '');
            setImageSource(initialData.imageUrl?.startsWith('data:') ? 'upload' : 'scryfall');
        } else {
            setFormData(EMPTY_FORM);
            setBaseType('Creature');
            setSubType('');
            setImageSource('upload');
        }
    }, [isOpen, initialData]);

    const handleScryfallSelect = (card: ScryfallCard) => {
        if (card.layout !== 'token') {
            setError('Este resultado não é um card de token no Scryfall.');
            return;
        }
        setError(null);

        const { color, colorIdentity } = mapScryfallColorsToToken(card.colors);
        const typeLine = card.type_line ?? formData.typeLine;
        const parts = typeLine.replace('Token ', '').split(' — ');
        setBaseType(parts[0] || 'Creature');
        setSubType(parts[1] || '');

        setFormData(prev => ({
            ...prev,
            name: card.name,
            typeLine,
            color,
            colorIdentity,
            abilities: card.oracle_text ?? '',
            power: card.power ?? '',
            toughness: card.toughness ?? '',
            imageUrl: getScryfallImageUrl(card, prev.layout) ?? prev.imageUrl,
        }));

        setSelectedScryfallCard(card);
        setScryfallWarning(getImageStatusWarning(card));
    };

    useEffect(() => {
        const fullType = subType.trim()
            ? `Token ${baseType} — ${subType.trim()}`
            : `Token ${baseType}`;
        setFormData(prev => ({ ...prev, typeLine: fullType }));
    }, [baseType, subType]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'color') {
            setFormData(prev => ({
                ...prev,
                color: value as TokenColor,
                colorIdentity: value === 'multicolored' ? prev.colorIdentity : undefined,
            }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setError('A imagem é muito grande. Escolha uma de até 5MB.');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError('O token precisa de um nome.');
            return;
        }

        setIsSaving(true);
        setError(null);

        const { id, count, ...payload } = formData;
        const isEditingLocalToken = isEditing && !!initialData?.id?.startsWith('local_');
        const shouldPersistToBackend = forceLibrarySave || (isAuthenticated && saveToLibrary);

        try {
            let saved: TokenData;
            if (shouldPersistToBackend) {
                if (isEditing && initialData?.id && !isEditingLocalToken) {
                    saved = await tokenService.update(initialData.id, payload);
                    saved = { ...saved, count: initialData.count };
                } else {
                    saved = await tokenService.create(payload);
                }
            } else {
                saved = {
                    ...payload,
                    id: isEditingLocalToken ? initialData!.id : `local_${Date.now()}`,
                    count: initialData?.count ?? 1,
                } as TokenData;
            }
            onSave(saved);
            onClose();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Erro ao salvar. Verifique a conexão com o servidor.'
            );
        } finally {
            setIsSaving(false);
        }
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
                                    <Wand2 className="text-purple-400" />
                                    {isEditing ? 'Editar Token' : 'Forjar Novo'}
                                </h2>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Estilo do Card</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['classic', 'fullArt'] as const).map(layout => (
                                            <button
                                                key={layout}
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    layout,
                                                    imageUrl: (imageSource === 'scryfall' && selectedScryfallCard)
                                                        ? getScryfallImageUrl(selectedScryfallCard, layout) ?? prev.imageUrl
                                                        : prev.imageUrl,
                                                }))}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all ${
                                                    formData.layout === layout
                                                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                        : 'border-gray-800 text-gray-500 hover:border-gray-700'
                                                }`}
                                            >
                                                {layout === 'classic' ? <><LayoutList size={18} /> Clássico</> : <><Maximize size={18} /> Full Art</>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-4 border-b border-gray-800 pb-2">
                                        {(['upload', 'scryfall'] as const).map(src => (
                                            <button
                                                key={src}
                                                type="button"
                                                onClick={() => setImageSource(src)}
                                                className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                                                    imageSource === src ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
                                                }`}
                                            >
                                                {src === 'upload' ? <><Upload size={14} /> Upload</> : <><Search size={14} /> Scryfall</>}
                                            </button>
                                        ))}
                                    </div>

                                    {imageSource === 'upload' ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative h-44 w-full bg-gray-950 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all overflow-hidden group"
                                        >
                                            {formData.imageUrl?.startsWith('data:') ? (
                                                <>
                                                    <img src={formData.imageUrl} className="w-full h-full object-cover brightness-50 group-hover:brightness-[0.35] transition-all" alt="Preview" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-all">
                                                        <Upload size={28} className="mb-2 text-purple-400" />
                                                        <span className="text-sm">Substituir Imagem</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <ImageIcon size={40} className="mx-auto mb-3 text-gray-700" />
                                                    <p className="text-sm font-bold text-gray-400">Clique para carregar</p>
                                                    <p className="text-[11px] text-gray-600 mt-1 uppercase tracking-tighter">PNG, JPG ou WEBP (Max 5MB)</p>
                                                </div>
                                            )}
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                        </div>
                                    ) : (
                                        <div className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl p-4 space-y-3">
                                            <ScryfallTokenSearch onSelect={handleScryfallSelect} />

                                            {formData.imageUrl && !formData.imageUrl.startsWith('data:') && (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={formData.imageUrl}
                                                        alt={formData.name || 'Imagem selecionada'}
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-700 shrink-0"
                                                    />
                                                    <div className="flex items-center gap-2 text-[10px] text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                                        </span>
                                                        {selectedScryfallCard ? 'Card carregado do Scryfall' : 'Imagem atual'}
                                                    </div>
                                                </div>
                                            )}

                                            {scryfallWarning && (
                                                <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                                                    <AlertTriangle size={14} className="shrink-0" />
                                                    {scryfallWarning}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Campos de identidade */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tighter">Nome do Token</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Ex: Soldier, Goblin..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tighter">Tipo Base</label>
                                        <select
                                            value={baseType}
                                            onChange={e => setBaseType(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500 appearance-none cursor-pointer"
                                        >
                                            <option value="Creature">Criatura</option>
                                            <option value="Artifact">Artefato</option>
                                            <option value="Enchantment">Encantamento</option>
                                            <option value="Land">Terreno</option>
                                            <option value="Artifact Creature">Artefato Criatura</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tighter">Subtipo</label>
                                        <input
                                            value={subType}
                                            onChange={e => setSubType(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                                            placeholder="Ex: Angel, Dragon..."
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tighter">Cor da Moldura</label>
                                        <select
                                            name="color"
                                            value={formData.color}
                                            onChange={handleChange}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-purple-500 appearance-none cursor-pointer"
                                        >
                                            <option value="white">Branco (W)</option>
                                            <option value="blue">Azul (U)</option>
                                            <option value="black">Preto (B)</option>
                                            <option value="red">Vermelho (R)</option>
                                            <option value="green">Verde (G)</option>
                                            <option value="multicolored">Multicolor</option>
                                            <option value="colorless">Incolor</option>
                                        </select>
                                    </div>

                                    {formData.color === 'multicolored' && (
                                        <div className="col-span-2 space-y-3 bg-gray-950/50 border border-gray-800 rounded-xl p-3">
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-tighter">Identidade de Cor</label>
                                            {([2, 3, 4, 5] as IdentityTier[]).map(tier => (
                                                <div key={tier}>
                                                    <p className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest">{TIER_LABELS[tier]}</p>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {COLOR_IDENTITIES.filter(ci => ci.tier === tier).map(ci => (
                                                            <button
                                                                key={ci.id}
                                                                type="button"
                                                                onClick={() => setFormData(p => ({ ...p, colorIdentity: ci.id }))}
                                                                title={ci.name}
                                                                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 transition-all ${
                                                                    formData.colorIdentity === ci.id
                                                                        ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                                        : 'border-gray-800 hover:border-gray-700'
                                                                }`}
                                                            >
                                                                <span
                                                                    className="w-6 h-6 rounded-full border border-black/30 shrink-0"
                                                                    style={{ background: buildConicGradient(ci.colors) }}
                                                                />
                                                                <span className="text-[9px] leading-tight text-center text-gray-300 truncate w-full">{ci.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={formData.layout === 'fullArt' ? 'opacity-30 pointer-events-none' : ''}>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-tighter">
                                        Habilidades {formData.layout === 'fullArt' && '(Oculto no Full Art)'}
                                    </label>
                                    <textarea
                                        name="abilities"
                                        value={formData.abilities}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white outline-none resize-none focus:border-purple-500"
                                        placeholder="Vigilance, Flying..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Poder</label>
                                        <input name="power" value={formData.power} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-center focus:border-purple-500 outline-none" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Resistência</label>
                                        <input name="toughness" value={formData.toughness} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-center focus:border-purple-500 outline-none" placeholder="0" />
                                    </div>
                                </div>
                            </div>

                            {showLibraryToggle && (
                                <label
                                    className={`mt-5 flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                                        libraryLimitReached
                                            ? 'border-gray-800 opacity-60 cursor-not-allowed'
                                            : 'border-gray-800 hover:border-purple-500/40 cursor-pointer'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={saveToLibrary}
                                        disabled={libraryLimitReached}
                                        onChange={e => setSaveToLibrary(e.target.checked)}
                                        className="mt-0.5 accent-purple-500 w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-300 flex items-center gap-2">
                                        <Library size={16} className="text-purple-400 shrink-0" />
                                        {libraryLimitReached
                                            ? `Limite de ${MAX_LIBRARY_TOKENS} tokens na biblioteca atingido. Remova um token no Dashboard para salvar outro.`
                                            : 'Também salvar este token na minha biblioteca'}
                                    </span>
                                </label>
                            )}

                            {error && (
                                <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="mt-6 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/30 group"
                            >
                                {isSaving ? (
                                    <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5" />
                                ) : (
                                    <Save size={20} className="group-hover:rotate-12 transition-transform" />
                                )}
                                {isSaving ? 'Forjando...' : isEditing ? 'Salvar Alterações' : 'Forjar Token'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};