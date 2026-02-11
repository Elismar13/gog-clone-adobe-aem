import React, { useRef } from 'react';
import { useAuth } from '../../state/AuthContext';
import { FiUser, FiLogOut, FiChevronDown, FiShoppingBag, FiHeart, FiClock, FiGift } from 'react-icons/fi';
import { useCart } from '../../state/CartContext';
import './UserProfile.css';

// Evitar erro de tipo do Bootstrap
declare global {
  interface Window {
    Bootstrap: {
      Dropdown: any;
    };
  }
}

const UserProfile: React.FC = () => {
  const { authenticated, initialized, logout, userInfo } = useAuth();
  const { items } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);


  const handleLogout = () => {
    logout({ redirectUri: window.location.href });
  };

  const handleProfileClick = () => {
    // TODO: Navegar para página de perfil
    console.log('Navigate to profile');
  };

  const handleLibraryClick = () => {
    // TODO: Navegar para biblioteca de jogos
    console.log('Navigate to library');
  };

  const handleWishlistClick = () => {
    // TODO: Navegar para lista de desejos
    console.log('Navigate to wishlist');
  };

  const handleOrdersClick = () => {
    window.location.href = '/content/gogstore/us/en/orders.html';
  };

  if (!initialized || !authenticated) {
    return null;
  }

  const displayName = userInfo?.name || userInfo?.preferred_username || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const cartItemsCount = items.length;

  return (
    <div className="user-profile dropdown" ref={dropdownRef}>
      <button 
        className="user-profile-button btn btn-outline-light d-flex align-items-center "
        type="button"
        id="userDropdownButton"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        <div className="user-avatar rounded-circle bg-success d-flex align-items-center justify-content-center me-2">
          {userInitial}
        </div>
        <span className="user-name d-none d-md-inline">{displayName}</span>
        <FiChevronDown className="dropdown-icon ms-1" />
      </button>

      <ul className="dropdown-menu dropdown-menu-end p-0 bg-dark text-white" aria-labelledby="userDropdownButton">
        <li>
          <div className="dropdown-header d-flex align-items-center p-3 border-bottom">
            <div className="dropdown-avatar rounded-circle bg-success d-flex align-items-center justify-content-center me-3">
              {userInitial}
            </div>
            <div className="dropdown-user-info flex-grow-1">
              <div className="dropdown-name fw-semibold text-white">{displayName}</div>
              {userInfo?.email && (
                <div className="dropdown-email text-text-secondary small">{userInfo.email}</div>
              )}
              <div className="dropdown-status d-flex align-items-center mt-1">
                <span className="status-indicator rounded-circle bg-success me-2"></span>
                <span className="status-text text-text-secondary small">Online</span>
              </div>
            </div>
          </div>
        </li>
        
        <li><div className="dropdown-divider border-top my-0"></div></li>
        
        {/* Quick Stats */}
        <li>
          <div className="dropdown-stats d-grid grid-cols-3 gap-0 p-3">
            <div className="stat-item text-center p-2 border-end">
              <div className="stat-icon text-success mb-2">
                <FiShoppingBag />
              </div>
              <div className="stat-value fw-bold text-white">{cartItemsCount}</div>
              <div className="stat-label text-text-secondary small">Carrinho</div>
            </div>
            <div className="stat-item text-center p-2 border-end">
              <div className="stat-icon text-success mb-2">
                <FiHeart />
              </div>
              <div className="stat-value fw-bold text-white">0</div>
              <div className="stat-label text-text-secondary small">Favoritos</div>
            </div>
            <div className="stat-item text-center p-2">
              <div className="stat-icon text-success mb-2">
                <FiClock />
              </div>
              <div className="stat-value fw-bold text-white">0</div>
              <div className="stat-label text-text-secondary small">Pedidos</div>
            </div>
          </div>
        </li>
        
        <li><div className="dropdown-divider border-top my-0"></div></li>
        
        <li className="dropdown-menu-list p-0">
          <button className="dropdown-item d-flex align-items-center px-3 py-2" type="button" onClick={handleProfileClick}>
            <FiUser className="me-3 text-text-secondary" />
            <div className="item-content flex-grow-1 text-start">
              <div>Meu Perfil</div>
              <small className="text-text-secondary">Gerenciar informações pessoais</small>
            </div>
          </button>
          <button className="dropdown-item d-flex align-items-center px-3 py-2" type="button" onClick={handleLibraryClick}>
            <FiShoppingBag className="me-3 text-text-secondary" />
            <div className="item-content flex-grow-1 text-start">
              <div>Minha Biblioteca</div>
              <small className="text-text-secondary">Jogos adquiridos</small>
            </div>
          </button>
          <button className="dropdown-item d-flex align-items-center px-3 py-2" type="button" onClick={handleWishlistClick}>
            <FiHeart className="me-3 text-text-secondary" />
            <div className="item-content flex-grow-1 text-start">
              <div>Lista de Desejos</div>
              <small className="text-text-secondary">Jogos favoritos</small>
            </div>
          </button>
          <button className="dropdown-item d-flex align-items-center px-3 py-2" type="button" onClick={handleOrdersClick}>
            <FiClock className="me-3 text-text-secondary" />
            <div className="item-content flex-grow-1 text-start">
              <div>Histórico de Pedidos</div>
              <small className="text-text-secondary">Ver compras anteriores</small>
            </div>
          </button>
          {/* <button className="dropdown-item d-flex align-items-center px-3 py-2" type="button" onClick={handleSettingsClick}>
            <FiSettings className="me-3 text-text-secondary" />
            <div className="item-content flex-grow-1 text-start">
              <div>Configurações</div>
              <small className="text-text-secondary">Preferências da conta</small>
            </div>
          </button> */}
        </li>
        
        <li><div className="dropdown-divider border-top my-0"></div></li>
        
        {/* Special Offers */}
        <li>
          <div className="dropdown-offers p-3 bg-success bg-opacity-10 border-start border-success border-3">
            <div className="offers-header d-flex align-items-center mb-2">
              <FiGift className="me-2 text-success" />
              <span className="fw-semibold text-success">Ofertas Especiais</span>
            </div>
            <div className="offers-content d-flex align-items-center">
              <span className="badge bg-success me-2">Novo!</span>
              <small className="text-white-50">10% de desconto na próxima compra</small>
            </div>
          </div>
        </li>
        
        <li><div className="dropdown-divider border-top my-0"></div></li>
        
        <li>
          <button className="dropdown-item d-flex align-items-center px-3 py-2 text-danger" type="button" onClick={handleLogout}>
            <FiLogOut className="me-3" />
            <div className="item-content flex-grow-1 text-start">
              <div>Sair</div>
              <small className="text-text-secondary">Encerrar sessão</small>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
