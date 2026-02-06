import React, { useEffect, useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { FiLogIn, FiLogOut, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import './LoginPrompt.css';

interface LoginPromptProps {
  gotoPath?: string;
  showLogout?: boolean;
  postLoginDestination?: string;
  redirectionTimeout?: number;
  shouldRedirect?: boolean;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  gotoPath,
  showLogout = true,
  postLoginDestination,
  redirectionTimeout = 3,
  shouldRedirect = true
}) => {
  const { authenticated, initialized, login, logout } = useAuth();
  const [countdown, setCountdown] = useState(redirectionTimeout);
  const [redirecting, setRedirecting] = useState(false);

  // Efeito para redirecionamento automático após login
  useEffect(() => {
    if (authenticated && shouldRedirect && postLoginDestination && countdown > 0) {
      setRedirecting(true);
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [authenticated, shouldRedirect, postLoginDestination, countdown]);

  // Efeito para executar o redirecionamento quando o countdown chega a 0
  useEffect(() => {
    if (authenticated && redirecting && countdown === 0 && postLoginDestination) {
      const finalDestination = postLoginDestination.startsWith('http') 
        ? postLoginDestination 
        : `${window.location.origin}${postLoginDestination}`;
      window.location.href = finalDestination;
    }
  }, [authenticated, redirecting, countdown, postLoginDestination]);

  const handleLogin = () => {
    console.log('is initialized', initialized);
    console.log('is authenticated', authenticated);
    
    // Usar postLoginDestination como prioridade para goto, ou fallback para gotoPath ou página atual
    const gotoDestination = postLoginDestination || gotoPath || window.location.pathname;
    
    // Para página do AEM, usar a URL atual como base
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    
    // Preserve current page as goto destination after login
    const goto = url.searchParams.get('goto') || gotoDestination;
    
    // Construir a URL de redirecionamento para o Keycloak
    const redirectUri = new URL(window.location.origin + window.location.pathname);
    redirectUri.searchParams.set('goto', goto);
    
    console.log('Redirecting to Keycloak with redirectUri:', redirectUri.toString());
    login({ redirectUri: redirectUri.toString() });
  };

  const handleLogout = () => {
    logout({ redirectUri: window.location.href });
  };

  const handleCancelRedirect = () => {
    setRedirecting(false);
    setCountdown(redirectionTimeout);
  };

  const handleManualRedirect = () => {
    if (postLoginDestination) {
      const finalDestination = postLoginDestination.startsWith('http') 
        ? postLoginDestination 
        : `${window.location.origin}${postLoginDestination}`;
      window.location.href = finalDestination;
    }
  };

  if (!initialized) {
    return (
      <div className="login-prompt-container">
        <div className="login-prompt-loading">
          <div className="spinner"></div>
          <p>Inicializando autenticação...</p>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="login-prompt-container">
        <div className="login-prompt-authenticated">
          <div className="auth-header">
            <FiCheckCircle className="auth-icon success" />
            <h2>Você está autenticado</h2>
          </div>
          
          {redirecting && shouldRedirect && postLoginDestination && (
            <div className="redirect-countdown">
              <div className="countdown-header">
                <FiClock className="countdown-icon" />
                <span>Redirecionando em {countdown} segundos...</span>
              </div>
              <div className="countdown-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${((redirectionTimeout - countdown) / redirectionTimeout) * 100}%` }}
                ></div>
              </div>
              <div className="redirect-actions">
                <button className="btn btn-primary" onClick={handleManualRedirect}>
                  <FiArrowRight /> Ir agora
                </button>
                <button className="btn btn-outline" onClick={handleCancelRedirect}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
          
          {showLogout && (
            <div className="auth-actions">
              <p className="auth-message">Aproveite sua sessão segura.</p>
              <button className="btn btn-logout" onClick={handleLogout}>
                <FiLogOut /> Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-prompt-container">
      <div className="login-prompt-guest">
        <div className="guest-header">
          <FiLogIn className="guest-icon" />
          <h2>Bem-vindo de volta!</h2>
        </div>
        <p className="guest-message">
          Faça login para acessar recursos exclusivos, finalizar suas compras 
          e aproveitar uma experiência personalizada.
        </p>
        <div className="guest-features">
          <div className="feature-item">
            <FiCheckCircle className="feature-icon" />
            <span>Acesso exclusivo a ofertas</span>
          </div>
          <div className="feature-item">
            <FiCheckCircle className="feature-icon" />
            <span>Salvar itens na biblioteca</span>
          </div>
          <div className="feature-item">
            <FiCheckCircle className="feature-icon" />
            <span>Checkout rápido e seguro</span>
          </div>
        </div>
        <button className="btn btn-login" onClick={handleLogin}>
          <FiLogIn /> Entrar com Keycloak
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;
