import { useContext, createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

// Crie o contexto
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            setUser({
                role: AuthService.getUserRole(),
                name: AuthService.getUserName()
            });
        }
    }, []);

    const login = (token, userData) => {
        AuthService.login(token, userData);
        setUser({
            role: userData.papel,
            name: userData.nome
        });
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};