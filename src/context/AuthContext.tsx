import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, USER_KEY } from '../services/authService';
import { LoginCredentials, RegisterData, UpdateProfileData, User } from '@/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    loginWithGoogle: (token: string) => Promise<void>;
    updateProfile: (payload: UpdateProfileData) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem(USER_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const data = await authService.login(credentials);
        setUser({ username: data.username, email: data.email, provider: data.provider });
    };

    const register = async (userData: RegisterData) => {
        await authService.register(userData);
    };

    const loginWithGoogle = async (googleToken: string) => {
        const data = await authService.loginWithGoogle(googleToken);
        setUser({ username: data.username, email: data.email, provider: data.provider });
    };

    const updateProfile = async (payload: UpdateProfileData) => {
        const data = await authService.updateProfile(payload);
        setUser({ username: data.username, email: data.email, provider: data.provider });
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            loading,
            login,
            register,
            loginWithGoogle,
            updateProfile,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
};