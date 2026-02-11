import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Keycloak from 'keycloak-js';

// Minimal typing to avoid depending on keycloak-js types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeycloakInstance = any;

export type UserInfo = {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
};

export type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  userInfo?: UserInfo | null;
  login: (options?: { redirectUri?: string }) => void;
  logout: (options?: { redirectUri?: string }) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getEnv(name: string, fallback?: string) {
  // CRA exposes REACT_APP_* envs in process.env
  // Guard for TS in browser without @types/node
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p: any = (globalThis as any).process;
  const value = p?.env?.[name];
  return value || fallback;
}

function getKeycloakConfig() {
  const url = getEnv('REACT_APP_KEYCLOAK_URL', 'http://localhost:8080');
  const realm = getEnv('REACT_APP_KEYCLOAK_REALM', 'gogstore');
  const clientId = getEnv('REACT_APP_KEYCLOAK_CLIENT_ID', 'gogstore-spa');
  if (!url || !realm || !clientId) {
    // eslint-disable-next-line no-console
    console.warn('[Auth] Missing Keycloak config envs: REACT_APP_KEYCLOAK_URL, REACT_APP_KEYCLOAK_REALM, REACT_APP_KEYCLOAK_CLIENT_ID');
  }
  return { url, realm, clientId };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const kcRef = useRef<KeycloakInstance | null>(null);

  // Função para extrair informações do token
  const parseToken = (token: string): UserInfo | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        sub: payload.sub,
        name: payload.name || payload.preferred_username,
        email: payload.email,
        preferred_username: payload.preferred_username
      };
    } catch (error) {
      console.error('[Auth] Error parsing token:', error);
      return null;
    }
  };

  useEffect(() => {
    const cfg = getKeycloakConfig();
    if (!cfg.url || !cfg.realm || !cfg.clientId) {
      setInitialized(true);
      return;
    }

    const isKeycloakRedirect = window.location.search.includes('code=');
    if (isKeycloakRedirect) {
      console.log('[Auth] Detected Keycloak redirect, processing callback');
      // Processar o callback do Keycloak sem verificar SSO automaticamente
      const kc = new Keycloak({
        url: cfg.url,
        realm: cfg.realm,
        clientId: cfg.clientId,
      });
      kcRef.current = kc;
      
      kc.init({ checkLoginIframe: false })
        .then((auth: boolean) => {
          console.log('[Auth] Keycloak callback processed, authenticated:', auth);
          setAuthenticated(auth);
          setToken(kc.token);
          if (kc.token) {
            setUserInfo(parseToken(kc.token));
          }
          setInitialized(true);
        })
        .catch((e: unknown) => {
          console.error('[Auth] Keycloak callback error', e);
          setInitialized(true);
        });
      return;
    }

    const kc = new Keycloak({
      url: cfg.url,
      realm: cfg.realm,
      clientId: cfg.clientId,
    });
    kcRef.current = kc;

    kc.init({ onLoad: 'check-sso', checkLoginIframe: false })
      .then((auth: boolean) => {
        setAuthenticated(auth);
        setToken(kc.token);
        if (kc.token) {
          setUserInfo(parseToken(kc.token));
        }
        setInitialized(true);

        const refresh = () => {
          kc.updateToken(30).then((refreshed: boolean) => {
            if (refreshed) {
              setToken(kc.token);
              if (kc.token) {
                setUserInfo(parseToken(kc.token));
              }
            }
          }).catch(() => console.warn('[Auth] token refresh failed'));
        };
        const id = window.setInterval(refresh, 20 * 1000);
        return () => window.clearInterval(id);
      })
      .catch((e: unknown) => {
        console.error('[Auth] Keycloak init error', e);
        setInitialized(true);
      });
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    initialized,
    authenticated,
    token,
    userInfo,
    login: (options?: { redirectUri?: string }) => {
      console.log('[Auth] Login called, kcRef.current:', !!kcRef.current);
      const kc = kcRef.current;
      if (kc) {
        console.log('[Auth] Calling kc.login with redirectUri:', options?.redirectUri);
        kc.login({ redirectUri: options?.redirectUri });
      } else {
        console.error('[Auth] Keycloak instance not available for login');
      }
    },
    logout: (options?: { redirectUri?: string }) => {
      const kc = kcRef.current;
      if (kc) {
        kc.logout({ redirectUri: options?.redirectUri });
      }
      // Limpar estado local imediatamente
      setAuthenticated(false);
      setToken(undefined);
      setUserInfo(null);
    }
  }), [initialized, authenticated, token, userInfo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
