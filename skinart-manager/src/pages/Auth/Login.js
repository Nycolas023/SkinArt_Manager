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
            email: 'admin@studiopiercing.com',
            password: 'admin123',
            role: 'admin',
            name: 'Administrador'
        },
        {
            email: 'tatuador@studiopiercing.com',
            password: 'tattoo123',
            role: 'tatuador',
            name: 'Tatuador Principal'
        },
        {
            email: 'recepcao@studiopiercing.com',
            password: 'recep123',
            role: 'recepcao',
            name: 'Atendente'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('https://localhost:5273/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    LOGIN_USUARIO: username,
                    SENHA_USUARIO: password
                })
            });

            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }

            const data = await response.json();
            onLogin(data);

        } catch (err) {
            setError(err.message || 'Erro ao conectar com o servidor');
        } finally {
            setIsLoading(false);
        }
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