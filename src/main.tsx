import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { Analytics } from "@vercel/analytics/next"
import App from './App'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
    console.warn("⚠️ AVISO: VITE_GOOGLE_CLIENT_ID não foi encontrado no arquivo .env. O login com Google não funcionará.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>

        <GoogleOAuthProvider clientId={clientId || ""}>
            <AuthProvider> 
            <App />
            </AuthProvider>
        </GoogleOAuthProvider>
        <Analytics/>
    </React.StrictMode>,
)
