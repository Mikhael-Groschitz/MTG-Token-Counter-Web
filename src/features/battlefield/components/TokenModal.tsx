import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Wand2, Upload, Image as ImageIcon, LayoutList, Maximize, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { TokenData } from '@/types';
import { tokenService } from '@/services/tokenService';

interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (token: TokenData) => void;
    initialData?: TokenData | null;
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

export const TokenModal = ({ isOpen, onClose, onSave, initialData }: TokenModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!initialData;

    const [baseType, setBaseType] = useState('Creature');
    const [subType, setSubType] = useState('');
    const [imageSource, setImageSource] = useState<'upload' | 'url'>('upload');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TokenData>(EMPTY_FORM);

    // ── Sincroniza form ao abrir ──────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        setError(null);
        if (initialData) {
            setFormData(initialData);
            const parts = initialData.typeLine.replace('Token ', '').split(' — ');
            setBaseType(parts[0] || 'Creature');
            setSubType(parts[1] || '');
            setImageSource(initialData.imageUrl?.startsWith('data:') ? 'upload' : 'url');
        } else {
            setFormData(EMPTY_FORM);
            setBaseType('Creature');
            setSubType('');
            setImageSource('upload');
        }
    }, [isOpen, initialData]);

    // ── Reconstrói typeLine ao mudar baseType/subType ─────
    useEffect(() => {
        const fullType = subType.trim()
            ? `Token ${baseType} — ${subType.trim()}`
            : `Token ${baseType}`;
        setFormData(prev => ({ ...prev, typeLine: fullType }));
    }, [baseType, subType]);

    // ── Handlers ─────────────────────────────────────────
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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

    // ── Submit ────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError('O token precisa de um nome.');
            return;
        }

        setIsSaving(true);
        setError(null);

        // Omite id e count — tokenService cuida do mapeamento snake_case
        const { id, count, ...payload } = formData;

        try {
            let saved: TokenData;
            if (isEditing && initialData?.id) {
                saved = await tokenService.update(initialData.id, payload);
                // Preserva o count atual da mesa ao editar
                saved = { ...saved, count: initialData.count };
            } else {
                saved = await tokenService.create(payload);
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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-gray-900 border border-gray-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar">

                            {/* Cabeçalho */}
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
                                {/* Seletor de layout */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Estilo do Card</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['classic', 'fullArt'] as const).map(layout => (
                                            <button
                                                key={layout}
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, layout }))}
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

                                {/* Seletor de origem da arte */}
                                <div className="space-y-3">
                                    <div className="flex gap-4 border-b border-gray-800 pb-2">
                                        {(['upload', 'url'] as const).map(src => (
                                            <button
                                                key={src}
                                                type="button"
                                                onClick={() => setImageSource(src)}
                                                className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                                                    imageSource === src ? 'text-purple-400' : 'text-gray-600 hover:text-gray-400'
                                                }`}
                                            >
                                                {src === 'upload' ? <><Upload size={14} /> Upload</> : <><LinkIcon size={14} /> URL Externa</>}
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
                                        <div className="h-44 w-full bg-gray-950 border-2 border-gray-800 rounded-2xl flex flex-col items-center justify-center p-6 space-y-3">
                                            <div className="w-full">
                                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Link da Imagem</label>
                                                <input
                                                    name="imageUrl"
                                                    value={formData.imageUrl?.startsWith('data:') ? '' : formData.imageUrl}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-purple-500 transition-all"
                                                    placeholder="https://cards.scryfall.io/..."
                                                />
                                            </div>
                                            {formData.imageUrl && !formData.imageUrl.startsWith('data:') && (
                                                <div className="flex items-center gap-2 text-[10px] text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                                    </span>
                                                    URL Detectada com Sucesso
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
                                            <option value="gold">Multicolor/Ouro</option>
                                            <option value="colorless">Incolor</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Habilidades */}
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

                                {/* Stats */}
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

                            {/* Erro inline */}
                            {error && (
                                <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Botão salvar */}
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