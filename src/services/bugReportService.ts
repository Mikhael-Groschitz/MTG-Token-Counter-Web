import api from './api';

export interface BugReportPayload {
    title: string;
    module: string;
    severity: string;
    description: string;
    steps: string;
    environment: string;
    version: string;
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
        formData.append('environment', payload.environment);
        formData.append('version', payload.version);
        payload.files.forEach((file) => formData.append('files', file));

        // Não define Content-Type manualmente: o axios detecta o FormData e
        // deixa o navegador definir o header com o boundary correto.
        await api.post('/bugs', formData);
    },
};
