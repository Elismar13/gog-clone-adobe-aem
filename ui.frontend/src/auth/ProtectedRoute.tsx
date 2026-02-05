import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { authenticated, initialized } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!initialized) return null;
        if (authenticated) return children as any;
        const search = new URLSearchParams();
        if (location && location.pathname) search.set('goto', location.pathname);
        return <Redirect to={{ pathname: '/login', search: `?${search.toString()}` }} />;
      }}
    />
  );
};

export default ProtectedRoute;
