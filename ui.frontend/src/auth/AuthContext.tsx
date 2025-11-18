import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Keycloak from 'keycloak-js';

export type AuthState = {
  isAuthenticated: boolean;
  token?: string;
  profile?: any;
};

type AuthContextType = {
  state: AuthState;
  login: () => void;
  logout: () => void;
  keycloak?: Keycloak;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>({ isAuthenticated: false });
  const [kc, setKc] = useState<Keycloak | undefined>(undefined);

  useEffect(() => {
    const url = process.env.REACT_APP_KC_URL || (window as any).__KC_URL__;
    const realm = process.env.REACT_APP_KC_REALM || (window as any).__KC_REALM__;
    const clientId = process.env.REACT_APP_KC_CLIENT_ID || (window as any).__KC_CLIENT_ID__;
    if (!url || !realm || !clientId) {
      return;
    }
    const keycloak = new (Keycloak as any)({ url, realm, clientId });
    setKc(keycloak);
    keycloak
      .init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' })
      .then(async (authenticated: boolean) => {
        if (authenticated) {
          const token = keycloak.token || undefined;
          let profile: any = undefined;
          try {
            profile = await keycloak.loadUserInfo();
          } catch {}
          setState({ isAuthenticated: true, token, profile });
        } else {
          setState({ isAuthenticated: false });
        }
      })
      .catch(() => setState({ isAuthenticated: false }));

    const updateToken = setInterval(() => {
      if (keycloak) {
        keycloak.updateToken(60).catch(() => {});
      }
    }, 20000);
    return () => clearInterval(updateToken);
  }, []);

  const login = useCallback(() => {
    if (kc) kc.login();
  }, [kc]);

  const logout = useCallback(() => {
    if (kc) kc.logout();
  }, [kc]);

  const value = useMemo(() => ({ state, login, logout, keycloak: kc }), [state, login, logout, kc]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
