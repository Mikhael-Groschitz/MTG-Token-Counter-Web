import { useState, ChangeEvent, FormEvent } from "react";

type Severity = "low" | "medium" | "high" | "critical";

interface SeverityOption {
    value: Severity;
    label: string;
}

interface SeverityStyle {
    active: string;
    idle: string;
}

interface FormState {
    title: string;
    module: string;
    severity: Severity;
    description: string;
    steps: string;
    environment: string;
    version: string;
}

interface BugReportPayload extends FormState {
    files: File[];
    ticketId: string;
}

interface BugReportFormProps {
    onSubmit?: (data: BugReportPayload) => void;
    onCancel?: () => void;
}

const SEVERITIES: SeverityOption[] = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
];

const MODULES: string[] = [
    "Mesa de jogo",
    "Acesso/Perfil",
    "Tokens",
    "Outro",
];

const ENVIRONMENTS: string[] = ["Produção", "Staging", "Desenvolvimento"];

const severityStyles: Record<Severity, SeverityStyle> = {
    low: {
        active: "bg-green-500/20 border-green-500 text-green-400",
        idle: "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60",
    },
    medium: {
        active: "bg-amber-500/20 border-amber-400 text-amber-300",
        idle: "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60",
    },
    high: {
        active: "bg-orange-500/20 border-orange-400 text-orange-300",
        idle: "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60",
    },
    critical: {
        active: "bg-red-500/20 border-red-400 text-red-300",
        idle: "bg-white/5 border-white/10 text-white/40 hover:border-white/25 hover:text-white/60",
    },
};

const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg text-white placeholder-white/30 " +
    "bg-[#1e1e3a] border border-white/15 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 " +
    "transition-colors";

const labelClass =
    "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide";

function generateTicketId(): string {
    return "BUG-" + Math.floor(1000 + Math.random() * 9000);
}

export default function BugReportForm({ onSubmit, onCancel }: BugReportFormProps) {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [ticketId, setTicketId] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [form, setForm] = useState<FormState>({
        title: "",
        module: "",
        severity: "medium",
        description: "",
        steps: "",
        environment: "",
        version: "",
    });

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
        const incoming = Array.from(e.target.files ?? []);
        setFiles((prev) => [...prev, ...incoming].slice(0, 5));
    }

    function removeFile(index: number): void {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (!form.title || !form.description) return;

        const id = generateTicketId();
        setTicketId(id);
        setSubmitted(true);

        onSubmit?.({ ...form, files, ticketId: id });
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                    <CheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">
                    Bug reportado com sucesso!
                </h3>
                <p className="text-sm text-white/50">
                    Nossa equipe foi notificada e irá analisar o problema em breve.
                </p>
                <span className="mt-4 inline-block px-4 py-1.5 bg-white/8 border border-white/15 rounded-full text-sm font-mono text-white/60">
          {ticketId}
        </span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl w-full">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 bg-red-500/20 border border-red-500/30 rounded-md flex items-center justify-center">
                        <BugIcon className="w-4 h-4 text-red-400" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Reportar um bug</h2>
                </div>
                <p className="text-sm text-white/50">
                    Descreva o problema encontrado para que nossa equipe possa investigar.
                </p>
            </div>

            {/* Título + Módulo */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>
                        Título <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="Breve descrição do bug"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Módulo / Área</label>
                    <select
                        name="module"
                        value={form.module}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="" className="bg-[#1a1a2e]">Selecionar...</option>
                        {MODULES.map((m) => (
                            <option key={m} value={m} className="bg-[#1a1a2e]">
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Severidade */}
            <div>
                <label className={labelClass}>
                    Severidade <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {SEVERITIES.map(({ value, label }) => {
                        const isActive = form.severity === value;
                        const styles = severityStyles[value];
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setForm((p) => ({ ...p, severity: value }))}
                                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                                    isActive ? styles.active : styles.idle
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Descrição */}
            <div>
                <label className={labelClass}>
                    Descrição <span className="text-red-400">*</span>
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Explique o que aconteceu, o que você esperava que acontecesse e qualquer contexto relevante..."
                    className={inputClass + " resize-y"}
                />
            </div>

            {/* Passos para reproduzir */}
            <div>
                <label className={labelClass}>Passos para reproduzir</label>
                <textarea
                    name="steps"
                    value={form.steps}
                    onChange={handleChange}
                    rows={3}
                    placeholder={"1. Abrir a tela X\n2. Clicar em Y\n3. Observar o erro Z"}
                    className={inputClass + " resize-y"}
                />
            </div>

            {/* Ambiente + Versão */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Ambiente</label>
                    <select
                        name="environment"
                        value={form.environment}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="" className="bg-[#1a1a2e]">Selecionar...</option>
                        {ENVIRONMENTS.map((env) => (
                            <option key={env} value={env} className="bg-[#1a1a2e]">
                                {env}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Versão do sistema</label>
                    <input
                        type="text"
                        name="version"
                        value={form.version}
                        onChange={handleChange}
                        placeholder="ex: 2.3.1"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Anexos */}
            <div>
                <label className={labelClass}>Anexos</label>
                <label className="flex flex-col items-center justify-center w-full border border-dashed border-white/15 rounded-lg py-5 bg-white/5 cursor-pointer hover:border-white/30 hover:bg-white/8 transition-colors">
                    <UploadIcon className="w-5 h-5 text-white/30 mb-1" />
                    <span className="text-sm text-white/40">Clique para anexar ou arraste arquivos aqui</span>
                    <span className="text-xs text-white/25 mt-0.5">PNG, JPG, GIF, MP4, logs — até 10MB</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.txt,.log,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((file, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs rounded-full"
                            >
                {file.name}
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="text-blue-400 hover:text-blue-200 leading-none"
                                >
                  ×
                </button>
              </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm border border-white/15 rounded-lg text-white/50 hover:bg-white/8 hover:text-white/80 transition-colors"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 active:scale-95 transition-all"
                >
                    Enviar report
                </button>
            </div>
        </form>
    );
}

/* ── Inline icons ── */
interface IconProps {
    className?: string;
}

function BugIcon({ className }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <circle cx="8" cy="9" r="4" />
            <path d="M6 4.5C6 3.4 6.9 2.5 8 2.5s2 .9 2 2" />
            <path d="M4 7H2M14 7h-2M4 11H2M14 11h-2" />
        </svg>
    );
}

function CheckIcon({ className }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 11l4 4 8-8" />
        </svg>
    );
}

function UploadIcon({ className }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12V4M7 7l3-3 3 3" />
            <path d="M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
        </svg>
    );
}