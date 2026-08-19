import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bug, Check, Paperclip, X } from "lucide-react";

type Severity = "low" | "medium" | "high" | "critical";

interface SeverityOption {
    value: Severity;
    label: string;
}

interface FormState {
    title: string;
    module: string;
    severity: Severity;
    description: string;
    steps: string;
    occurredAt: string;
}

interface BugReportPayload extends FormState {
    reporterEmail?: string;
    files: File[];
}

interface BugReportFormProps {
    onSubmit?: (data: BugReportPayload) => Promise<void>;
    onCancel?: () => void;
}

const SEVERITIES: SeverityOption[] = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
];

const MODULES: string[] = ["Mesa de jogo", "Acesso/Perfil", "Tokens", "Outro"];

/** Severidade sem 4 caixas coloridas: um seletor sóbrio com um ponto de cor. */
const severityDot: Record<Severity, string> = {
    low: "bg-green-400",
    medium: "bg-amber-400",
    high: "bg-orange-400",
    critical: "bg-red-400",
};

const inputClass =
    "w-full bg-gray-950/60 border border-gray-800 text-gray-100 rounded-lg py-2.5 px-3.5 text-sm " +
    "focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-700";

const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

/** Linha de campo: rótulo à esquerda, controle à direita, separada por régua. */
function Row({
    label,
    htmlFor,
    required,
    hint,
    children,
}: {
    label: string;
    htmlFor?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 border-t border-gray-900 pt-5">
            <div className="sm:pt-2">
                <label htmlFor={htmlFor} className={labelClass}>
                    {label}
                    {required && <span className="text-purple-400"> *</span>}
                </label>
                {hint && <p className="text-xs text-gray-600 leading-relaxed hidden sm:block">{hint}</p>}
            </div>
            <div className="sm:col-span-2">{children}</div>
        </div>
    );
}

export default function BugReportForm({ onSubmit, onCancel }: BugReportFormProps) {
    const { isAuthenticated } = useAuth();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [reporterEmail, setReporterEmail] = useState<string>("");
    const [form, setForm] = useState<FormState>({
        title: "",
        module: "",
        severity: "medium",
        description: "",
        steps: "",
        occurredAt: new Date().toISOString().slice(0, 10),
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

    async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!form.title || !form.description) return;

        setSubmitError(null);
        setIsSubmitting(true);
        try {
            await onSubmit?.({
                ...form,
                files,
                reporterEmail: !isAuthenticated ? reporterEmail : undefined,
            });
            setSubmitted(true);
        } catch (err: any) {
            setSubmitError(
                err.response?.data?.message ||
                "Não foi possível enviar o report. Tente novamente em instantes."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="border-l-2 border-green-500 pl-5 py-2">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                    <Check size={13} /> Enviado
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-2">Report registrado</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">
                    Recebemos seu report por e-mail e vamos analisar o problema em breve.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-baseline gap-2.5 mb-6">
                <Bug className="w-4 h-4 text-purple-400 translate-y-0.5" />
                <div>
                    <h2 className="text-base font-semibold text-white">Detalhes do problema</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Campos marcados com <span className="text-purple-400">*</span> são obrigatórios.
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                <Row label="Título" htmlFor="bug-title" required hint="Uma frase que resuma o bug.">
                    <input
                        id="bug-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="Ex.: token some da mesa ao recarregar"
                        className={inputClass}
                    />
                </Row>

                <Row label="Módulo / Área" htmlFor="bug-module">
                    <select
                        id="bug-module"
                        name="module"
                        value={form.module}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="" className="bg-gray-950">Selecionar...</option>
                        {MODULES.map((m) => (
                            <option key={m} value={m} className="bg-gray-950">
                                {m}
                            </option>
                        ))}
                    </select>
                </Row>

                <Row label="Severidade" required hint="O quanto isso atrapalha a partida.">
                    <div role="group" aria-label="Severidade" className="flex flex-wrap gap-2">
                        {SEVERITIES.map(({ value, label }) => {
                            const isActive = form.severity === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, severity: value }))}
                                    aria-pressed={isActive}
                                    className={`inline-flex items-center gap-2 py-2 px-3.5 rounded-lg border text-xs font-medium transition-colors ${
                                        isActive
                                            ? "border-purple-500 bg-purple-500/10 text-white"
                                            : "border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700"
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${severityDot[value]}`} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </Row>

                {!isAuthenticated && (
                    <Row
                        label="Seu e-mail"
                        htmlFor="reporterEmail"
                        required
                        hint="Usamos para te responder sobre o andamento."
                    >
                        <input
                            id="reporterEmail"
                            type="email"
                            name="reporterEmail"
                            value={reporterEmail}
                            onChange={(e) => setReporterEmail(e.target.value)}
                            required
                            placeholder="voce@exemplo.com"
                            className={inputClass}
                        />
                    </Row>
                )}

                <Row
                    label="Descrição"
                    htmlFor="bug-description"
                    required
                    hint="O que aconteceu e o que era esperado."
                >
                    <textarea
                        id="bug-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Explique o que aconteceu, o que você esperava que acontecesse e qualquer contexto relevante..."
                        className={inputClass + " resize-y"}
                    />
                </Row>

                <Row label="Passos para reproduzir" htmlFor="bug-steps">
                    <textarea
                        id="bug-steps"
                        name="steps"
                        value={form.steps}
                        onChange={handleChange}
                        rows={3}
                        placeholder={"1. Abrir a tela X\n2. Clicar em Y\n3. Observar o erro Z"}
                        className={inputClass + " resize-y"}
                    />
                </Row>

                <Row label="Data do ocorrido" htmlFor="bug-date">
                    <input
                        id="bug-date"
                        type="date"
                        name="occurredAt"
                        value={form.occurredAt}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </Row>

                <Row label="Anexos" hint="Até 5 arquivos, 5MB cada.">
                    <label className="flex items-center gap-3 w-full border border-dashed border-gray-800 rounded-lg px-4 py-3 cursor-pointer hover:border-purple-500/60 transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-600 shrink-0" />
                        <span className="text-sm text-gray-500">
                            Anexar prints, vídeos ou logs
                            <span className="block text-xs text-gray-700">PNG, JPG, GIF, MP4, .txt, .log, .pdf</span>
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.txt,.log,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    {files.length > 0 && (
                        <ul className="mt-3 divide-y divide-gray-900 border-t border-gray-900">
                            {files.map((file, i) => (
                                <li key={i} className="flex items-center justify-between gap-3 py-2 text-sm text-gray-400">
                                    <span className="truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        aria-label={`Remover ${file.name}`}
                                        className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                                    >
                                        <X size={15} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Row>
            </div>

            {submitError && (
                <p className="mt-5 text-sm text-red-400 border-l-2 border-red-500 pl-3">{submitError}</p>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-900">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 text-sm rounded-lg text-gray-500 hover:text-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-60"
                >
                    {isSubmitting ? "Enviando..." : "Enviar report"}
                </button>
            </div>
        </form>
    );
}
