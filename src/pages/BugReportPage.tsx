import { useNavigate } from 'react-router-dom';
import BugReportForm from '../components/ui/BugReportForm.tsx';
import { bugReportService } from '../services/bugReportService';
import { SEO } from '@/components/SEO';

export function ReportPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-10">
            <SEO title="Reportar Bug" description="Reporte um problema encontrado no TokenForge." path="/reportar-bug" noindex />
            <BugReportForm
                onSubmit={(data) => bugReportService.submit(data)}
                onCancel={() => navigate(-1)}
            />
        </div>
    );
}