import api from './api';

export interface BugReportPayload {
    title: string;
    module: string;
    severity: string;
    description: string;
    steps: string;
    occurredAt: string;
    reporterEmail?: string;
    files: File[];
}

export const bugReportService = {
    async submit(payload: BugReportPayload): Promise<void> {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('module', payload.module);
        formData.append('severity', payload.severity);
        formData.append('description', payload.description);
        formData.append('steps', payload.steps);
        formData.append('occurredAt', payload.occurredAt);
        if (payload.reporterEmail) {
            formData.append('reporterEmail', payload.reporterEmail);
        }
        payload.files.forEach((file) => formData.append('files', file));

        // Remove o Content-Type padrão (application/json) da instância do axios:
        // caso contrário o axios serializa o FormData como JSON em vez de enviar
        // multipart/form-data com o boundary correto.
        await api.post('/bugs', formData, {
            headers: { 'Content-Type': undefined },
        });
    },
};
