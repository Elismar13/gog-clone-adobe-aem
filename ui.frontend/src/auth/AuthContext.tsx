import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

// Minimal typing to avoid depending on keycloak-js types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeycloakInstance = any;

export type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
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
  const url = getEnv('REACT_APP_KEYCLOAK_URL');
  const realm = getEnv('REACT_APP_KEYCLOAK_REALM');
  const clientId = getEnv('REACT_APP_KEYCLOAK_CLIENT_ID');
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
  const kcRef = useRef<KeycloakInstance | null>(null);

  useEffect(() => {
    const anyWindow = window as any;
    if (!anyWindow.Keycloak) {
      console.warn('[Auth] Keycloak script not found. Add the CDN script tag to public/index.html');
      setInitialized(true);
      return;
    }

    const cfg = getKeycloakConfig();
    if (!cfg.url || !cfg.realm || !cfg.clientId) {
      setInitialized(true);
      return;
    }

    const kc: KeycloakInstance = anyWindow.Keycloak({ url: cfg.url, realm: cfg.realm, clientId: cfg.clientId });
    kcRef.current = kc;

    kc.init({ onLoad: 'check-sso', checkLoginIframe: false })
      .then((auth: boolean) => {
        setAuthenticated(auth);
        setToken(kc.token);
        setInitialized(true);

        const refresh = () => {
          kc.updateToken(30).then((refreshed: boolean) => {
            if (refreshed) setToken(kc.token);
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
    login: (options?: { redirectUri?: string }) => {
      const kc = kcRef.current;
      if (kc) kc.login({ redirectUri: options?.redirectUri });
    },
    logout: (options?: { redirectUri?: string }) => {
      const kc = kcRef.current;
      if (kc) kc.logout({ redirectUri: options?.redirectUri });
    }
  }), [initialized, authenticated, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
