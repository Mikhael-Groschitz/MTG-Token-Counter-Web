import { useNavigate } from 'react-router-dom';
import BugReportForm from '../components/ui/BugReportForm.tsx';

export function ReportPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-10">
            <BugReportForm
                onSubmit={(data) => {
                    console.log('Bug report enviado:', data);
                    // Aqui você pode chamar sua API, ex: await api.post('/bugs', data)
                }}
                onCancel={() => navigate(-1)}
            />
        </div>
    );
}