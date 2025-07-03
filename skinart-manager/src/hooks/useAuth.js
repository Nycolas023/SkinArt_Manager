import { useContext, createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verifica localStorage ao carregar o componente
        if (AuthService.isAuthenticated()) {
            setUser({
                name: AuthService.getUserName(),
                role: AuthService.getUserRole()
            });
        }
    }, []);

    const login = (token, userData) => {
        // Salva no localStorage
        AuthService.login(token, userData);
        
        // Atualiza o estado do contexto IMEDIATAMENTE
        setUser({
            name: userData.NOME_USUARIO || '',
            role: userData.NOME_PAPEL || 'Admin'
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};