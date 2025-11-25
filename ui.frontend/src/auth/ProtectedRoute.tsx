import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { authenticated, login, initialized } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!initialized) return null;
        if (authenticated) return children as any;
        // trigger login and keep place
        login({ redirectUri: window.location.href });
        return (
          <Redirect
            to={{ pathname: '/', state: { from: location } }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
