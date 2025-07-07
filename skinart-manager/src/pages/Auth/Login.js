import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import AuthService from '../../services/AuthService';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const testUsers = [
        {
            email: 'admin01',
            password: 'admin123',
            role: 'admin',
            name: 'Administrador'
        },
        {
            email: 'tatuador01',
            password: 'tatuador123',
            role: 'tatuador',
            name: 'Tatuador Principal'
        },
    ];

    const handleLogin = async (credentials) => {
        try {
            const response = await fetch('https://localhost:5000/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                // Armazene o token no localStorage
                localStorage.setItem('token', data.Token);
                console.log('Token armazenado:', data.Token); // Para debug
                // Redirecione para o dashboard ou página principal
                onLogin(data.Token, data.Usuario);
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            setError(error.message || 'Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await handleLogin({
            LOGIN_USUARIO: username,
            SENHA_USUARIO: password
        });
    };

    const handleTestLogin = (testUser) => {
        setUsername(testUser.email);
        setPassword(testUser.password);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>SkinArt Manager</h2>
                    <p>Painel Administrativo</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuário ou E-mail</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Seu usuário ou e-mail"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insira sua senha"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span> Carregando...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <div className="test-logins">
                    <h4>Logins de Teste:</h4>

                    <button
                        type="button"
                        className="test-button admin"
                        onClick={() => handleTestLogin(testUsers[0])}
                    >
                        Admin
                    </button>

                    <button
                        type="button"
                        className="test-button tattoo"
                        onClick={() => handleTestLogin(testUsers[1])}
                    >
                        Tatuador
                    </button>
                </div>

                <div className="login-footer">
                    <p>© {new Date().getFullYear()} SkinArt Manager</p>
                    <a href="/forgot-password" className="forgot-password">
                        Esqueceu sua senha?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;