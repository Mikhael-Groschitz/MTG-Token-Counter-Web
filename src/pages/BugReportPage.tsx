import { useNavigate } from 'react-router-dom';
import BugReportForm from '../components/ui/BugReportForm.tsx';
import { bugReportService } from '../services/bugReportService';

export function ReportPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-10">
            <BugReportForm
                onSubmit={(data) => bugReportService.submit(data)}
                onCancel={() => navigate(-1)}
            />
        </div>
    );
}