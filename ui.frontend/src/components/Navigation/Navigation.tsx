import React, { useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import { useHistory } from 'react-router-dom';

import './navigation.css';
import logo from '../../assets/gog_logo.png';
import { STORE_PAGE_PATH, LOGIN_PAGE_PATH } from '../../constants/constants';
import MiniCart from '../Cart/MiniCart';
import UserProfile from '../UserProfile/UserProfile';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navigation = (props: any) => {
  const { authenticated, initialized } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redireciona para página de busca com o parâmetro de pesquisa
      history.push('/content/gogstore/us/en/search.html?q=' + encodeURIComponent(searchQuery.trim()));
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="header bg-custom-dark sticky-top p-3">
      <div className="container d-flex justify-content-around">
        <img 
          src={logo}
          alt="GOG"
          className='header-logo'
        />

        <nav className="header-nav d-none d-md-flex">
          <Link to={STORE_PAGE_PATH} className="nav-link nav-item active">Loja</Link>
          <Link to={STORE_PAGE_PATH} className="nav-link nav-item">Biblioteca</Link>
          <Link to={STORE_PAGE_PATH} className="nav-link nav-item">Comunidade</Link>
        </nav>

        <div className="header-user-actions d-flex align-items-center">
          <form className="d-none d-lg-flex col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Buscar jogos..."
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <FiSearch />
              </button>
            </div>
          </form>
          <MiniCart />
          {initialized && authenticated ? (
            <UserProfile />
          ) : (
            <Link 
              to={LOGIN_PAGE_PATH} 
              className="btn btn-outline-light d-flex align-items-center"
            >
              <FiLogIn className="me-2" />
              <span className="d-none d-md-inline">Fazer Login</span>
            </Link>
          )}
        </div>
      </div>

    </header>
  );
}

export default Navigation;