import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { GamePage } from './pages/GamePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { DashboardPage } from './pages/DashboardPage';
import { SupportPage } from './pages/SupportPage';
import { ReportPage } from './pages/BugReportPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/jogar" element={<GamePage />} />
                    <Route path="/entrar" element={<LoginPage />} />
                    <Route path="/cadastro" element={<RegisterPage />} />
                    <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
                    <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
                    <Route path="/verificar-email" element={<VerifyEmailPage />} />
                    <Route path="/painel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/apoiar" element={<SupportPage />} />
                    <Route path="/reportar-bug" element={<ReportPage />} />
                    <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
                    <Route path="/termos-de-uso" element={<TermsOfServicePage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;