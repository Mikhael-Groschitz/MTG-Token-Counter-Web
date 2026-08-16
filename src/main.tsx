import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { inject } from "@vercel/analytics"
import App from './App'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
    console.warn("⚠️ AVISO: VITE_GOOGLE_CLIENT_ID não foi encontrado no arquivo .env. O login com Google não funcionará.");
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://mtg-token-counter-backend.onrender.com').trim();
fetch(API_BASE_URL, { mode: 'no-cors' }).catch(() => {});

inject();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <GoogleOAuthProvider clientId={clientId || ""}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </HelmetProvider>
    </React.StrictMode>,
)
