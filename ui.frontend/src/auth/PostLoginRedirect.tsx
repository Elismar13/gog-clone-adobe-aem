import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PostLoginRedirect: React.FC = () => {
  const { authenticated, initialized } = useAuth();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!initialized) return;
    if (!authenticated) return;

    const url = new URL(window.location.href);
    const goto = url.searchParams.get('goto');
    if (goto) {
      url.searchParams.delete('goto');
      window.history.replaceState({}, document.title, url.toString());
      history.replace(goto);
    }
  }, [authenticated, initialized, history]);

  return null;
};

export default PostLoginRedirect;
