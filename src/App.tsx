import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';

const GamePage = lazy(() => import('./pages/GamePage').then(m => ({ default: m.GamePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(m => ({ default: m.SupportPage })));
const ReportPage = lazy(() => import('./pages/BugReportPage').then(m => ({ default: m.ReportPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));

const RouteFallback = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" aria-label="Carregando" role="status" />
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<RouteFallback />}>
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
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
