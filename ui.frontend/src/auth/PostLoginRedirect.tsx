import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const PostLoginRedirect: React.FC = () => {
  const { authenticated, initialized } = useAuth();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!initialized || !authenticated) return;
    const params = new URLSearchParams(location.search);
    const goto = params.get('goto');
    if (goto) {
      console.log('[PostLoginRedirect] Redirecting to:', goto);
      // Se o goto começar com /content/, é uma página do AEM, usar window.location
      if (goto.startsWith('/content/')) {
        window.location.href = goto;
      } else {
        // Se não, é uma rota SPA, usar history.replace
        params.delete('goto');
        history.replace({ pathname: goto, search: params.toString() ? `?${params.toString()}` : '' });
      }
    }
  }, [authenticated, initialized, location.search, history]);

  return null;
};

export default PostLoginRedirect;
