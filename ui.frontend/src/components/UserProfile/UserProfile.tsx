import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../state/AuthContext';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { authenticated, initialized, logout, token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string; preferred_username?: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (authenticated && token) {
      // Extrair informações do token JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          name: payload.name || payload.preferred_username,
          email: payload.email,
          preferred_username: payload.preferred_username
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [authenticated, token]);

  const handleLogout = () => {
    logout({ redirectUri: window.location.href });
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!initialized || !authenticated) {
    return null;
  }

  const displayName = userInfo?.name || userInfo?.preferred_username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button 
        className="user-profile-button"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <div className="user-avatar">
          {userInitial}
        </div>
        <span className="user-name">{displayName}</span>
        <FiChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {userInitial}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-name">{displayName}</div>
              {userInfo?.email && (
                <div className="dropdown-email">{userInfo.email}</div>
              )}
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-menu">
            <button className="dropdown-item">
              <FiUser />
              <span>Meu Perfil</span>
            </button>
            <button className="dropdown-item">
              <FiSettings />
              <span>Configurações</span>
            </button>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <FiLogOut />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
