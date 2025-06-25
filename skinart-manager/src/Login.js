import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
//import studioLogo from './studio-logo.png'; // Adicione sua imagem na pasta src

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Dados dos usuários de teste
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
      // Simulação de autenticação
      const user = testUsers.find(
        user => user.email === email && user.password === password
      );

      if (user) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede
        onLogin(user.role, user.name);
        navigate('/dashboard');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro durante o login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (testUser) => {
    setEmail(testUser.email);
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
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
              placeholder="••••••••"
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