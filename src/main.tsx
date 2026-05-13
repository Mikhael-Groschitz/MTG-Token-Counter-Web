import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import App from './App'
import './index.css'


const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
    console.warn("⚠️ AVISO: VITE_GOOGLE_CLIENT_ID não foi encontrado no arquivo .env. O login com Google não funcionará.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* O Provider precisa envolver toda a aplicação para o hook useGoogleLogin funcionar nas páginas */}
        <GoogleOAuthProvider clientId={clientId || ""}>
            <AuthProvider> {/* <--- Garanta que abre e fecha aqui */}
            <App />
            </AuthProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)