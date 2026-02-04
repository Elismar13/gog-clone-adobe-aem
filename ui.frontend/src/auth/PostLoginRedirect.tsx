import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PostLoginRedirect: React.FC = () => {
  const { authenticated, initialized } = useAuth();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!initialized || !authenticated) return;
    const params = new URLSearchParams(location.search);
    const goto = params.get('goto');
    if (goto) {
      params.delete('goto');
      history.replace({ pathname: goto, search: params.toString() ? `?${params.toString()}` : '' });
    }
  }, [authenticated, initialized, location.search, history]);

  return null;
};

export default PostLoginRedirect;
