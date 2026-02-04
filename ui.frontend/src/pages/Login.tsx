import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const { login, initialized, authenticated } = useAuth();
  const location = useLocation();

  const handleLogin = () => {
    const url = new URL(window.location.origin + location.pathname + location.search);
    const params = new URLSearchParams(location.search);
    const goto = params.get('goto') || '/';
    // ensure goto remains
    url.searchParams.set('goto', goto);
    login({ redirectUri: url.toString() });
  };

  if (!initialized) {
    return <div className="container py-5 text-white">Inicializando autenticação...</div>;
  }

  if (initialized && authenticated) {
    return <div className="container py-5 text-white">Você já está autenticado.</div>;
  }

  return (
    <div className="container py-5 text-white">
      <h1 className="mb-3">Entrar</h1>
      <p className="mb-4">Para continuar, faça login com sua conta.</p>
      <button className="btn btn-success text-dark" onClick={handleLogin}>Entrar com Keycloak</button>
    </div>
  );
};

export default Login;
