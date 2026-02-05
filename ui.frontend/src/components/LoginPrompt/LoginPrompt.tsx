import React from 'react';
import { useAuth } from '../../auth/AuthContext';

const LoginPrompt: React.FC = () => {
  const { authenticated, initialized, login, logout } = useAuth();

  const handleLogin = () => {
    const url = new URL(window.location.href);
    // Preserve current page as goto destination after login
    url.searchParams.set('goto', window.location.pathname);
    login({ redirectUri: url.toString() });
  };

  const handleLogout = () => {
    logout({ redirectUri: window.location.href });
  };

  if (!initialized) {
    return <div className="container py-4 text-white">Inicializando autenticação...</div>;
  }

  if (authenticated) {
    return (
      <div className="container py-4 text-white">
        <h2 className="mb-3">Você está autenticado</h2>
        <p className="mb-3">Aproveite sua sessão segura.</p>
        <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div className="container py-4 text-white">
      <h2 className="mb-3">Entrar</h2>
      <p className="mb-3">Faça login para acessar recursos exclusivos e finalizar suas compras.</p>
      <button className="btn btn-success text-dark" onClick={handleLogin}>Entrar com Keycloak</button>
    </div>
  );
};

export default LoginPrompt;
