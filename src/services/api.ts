import axios from 'axios';
import { USER_KEY } from './authService';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==========================================
// 🛠️ MOCK DATA & ADAPTER (Simulação de Backend)
// ==========================================

const MOCK_TOKEN = 'mock-jwt-token-123456';
const MOCK_USER_PROFILE = {
    id: 1,
    name: 'Usuário de Teste',
    email: 'teste@exemplo.com',
    role: 'ADMIN',
};

// "Banco de dados" em memória para os tokens
let mockTokens = [

];

const USE_MOCK = true;

if (USE_MOCK) {
    api.defaults.adapter = async (config) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const url = config.url || '';
                const method = config.method?.toLowerCase();
                const data = config.data ? JSON.parse(config.data) : null;

                // --- ROTAS DE AUTENTICAÇÃO ---
                if (url.includes('/login') && method === 'post') {
                    return resolve({ data: { token: MOCK_TOKEN, user: MOCK_USER_PROFILE }, status: 200, statusText: 'OK', headers: {}, config });
                }

                if (url.includes('/perfil') && method === 'get') {
                    if (config.headers?.Authorization === `Bearer ${MOCK_TOKEN}`) {
                        return resolve({ data: MOCK_USER_PROFILE, status: 200, statusText: 'OK', headers: {}, config });
                    }
                    return reject({ response: { status: 401 }, config });
                }
                if ((url.includes('/register') || url.includes('/auth/register')) && method === 'post') {
                    console.log("Dados recebidos no Registro Mock:", data); // Para você ver os dados no console
                    return resolve({
                        data: { message: 'Usuário criado com sucesso. Verifique seu e-mail.' },
                        status: 201,
                        statusText: 'Created',
                        headers: {},
                        config,
                    });
                }
                if (url.includes('/verify-email') && method === 'post') {
                    // Simulamos que o código correto é "123456"
                    if (data.code === '123456') {
                        return resolve({
                            data: {
                                token: MOCK_TOKEN,
                                user: MOCK_USER_PROFILE,
                                message: 'E-mail verificado com sucesso!'
                            },
                            status: 200,
                            statusText: 'OK',
                            headers: {},
                            config,
                        });
                    } else {
                        // Retorna erro para qualquer outro código
                        return reject({
                            response: {
                                status: 400,
                                data: { message: 'Código inválido ou expirado. Tente novamente.' }
                            },
                            config
                        });
                    }
                }

            // --- ROTA PARA REENVIAR CÓDIGO (MOCK) ---
                if (url.includes('/resend-code') && method === 'post') {
                    return resolve({
                        data: { message: 'Um novo código foi enviado para o seu e-mail.' },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    });
                }
            // 4. NOVO: LOGIN SOCIAL (Google e Facebook)
                if ((url.includes('/google') || url.includes('/facebook')) && method === 'post') {
                    return resolve({
                        data: {
                            token: MOCK_TOKEN,
                            user: { ...MOCK_USER_PROFILE, name: 'Usuário Social' }
                        },
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    });
                }
                // --- ROTAS DE TOKENS (CRUD) ---

// GET /tokens (Listar todos) - Verifica se a URL contém /tokens de forma segura
                if (url.includes('/tokens') && method === 'get') {
                    return resolve({ data: mockTokens, status: 200, statusText: 'OK', headers: {}, config });
                }

// POST /tokens (Criar novo)
// Usamos regex ou includes para ignorar barras extras ou query params
                if (url.match(/\/tokens\/?$/) && method === 'post') {
                    // Garantimos que 'data' seja um objeto, pois o Axios pode já tê-lo convertido
                    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

                    const newToken = {
                        ...body,
                        id: String(Date.now()),
                        count: body.count || 1
                    };
                    mockTokens.push(newToken);
                    return resolve({ data: newToken, status: 201, statusText: 'Created', headers: {}, config });
                }

// PUT /tokens/:id (Atualizar)
                if (url.includes('/tokens/') && method === 'put') {
                    // Pega o ID limpando possíveis barras extras no final
                    const urlParts = url.replace(/\/$/, '').split('/');
                    const id = urlParts.pop();

                    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
                    const index = mockTokens.findIndex(t => t.id === id);

                    if (index !== -1) {
                        mockTokens[index] = { ...mockTokens[index], ...body, id };
                        return resolve({ data: mockTokens[index], status: 200, statusText: 'OK', headers: {}, config });
                    }

                    return reject({
                        response: { status: 404, data: { message: 'Token não encontrado no Mock' } },
                        config
                    });
                }

// DELETE /tokens/:id
                if (url.includes('/tokens/') && method === 'delete') {
                    const urlParts = url.replace(/\/$/, '').split('/');
                    const id = urlParts.pop();
                    mockTokens = mockTokens.filter(t => t.id !== id);
                    return resolve({ data: null, status: 204, statusText: 'No Content', headers: {}, config });
                }

                // Fallback de erro 404
                console.warn(`Rota não mockada: ${method?.toUpperCase()} ${url}`);
                reject({ response: { status: 404, data: 'Not Found in Mock' }, config });

            }, 500);
        });
    };
}

api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user.token && config.headers) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            console.error('Erro ao processar token para requisição', e);
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(USER_KEY);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;