import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { DashboardPage } from './pages/DashboardPage';
import { SupportPage } from './pages/SupportPage';
import { ReportPage } from './pages/BugReportPage';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<GamePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/bugreport" element={<ReportPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;