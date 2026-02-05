import React from 'react';
import { useAuth } from '../../state/AuthContext';

const LoginPrompt: React.FC = () => {
  const { authenticated, initialized, login, logout } = useAuth();

  const handleLogin = () => {
    console.log('is initialized', initialized);
    console.log('is authenticated', authenticated);
    
    // Para página do AEM, usar a URL atual como base
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    
    // Preserve current page as goto destination after login
    const goto = url.searchParams.get('goto') || window.location.pathname;
    
    // Construir a URL de redirecionamento para o Keycloak
    const redirectUri = new URL(window.location.origin + window.location.pathname);
    redirectUri.searchParams.set('goto', goto);
    
    console.log('Redirecting to Keycloak with redirectUri:', redirectUri.toString());
    login({ redirectUri: redirectUri.toString() });
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
