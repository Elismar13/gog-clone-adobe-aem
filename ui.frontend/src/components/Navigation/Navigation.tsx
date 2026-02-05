import React from 'react';

import './navigation.css';
import logo from '../../assets/gog_logo.png';
import { STORE_PAGE_PATH } from '../../constants/constants';
import MiniCart from '../Cart/MiniCart';
import UserProfile from '../UserProfile/UserProfile';
import { Link } from 'react-router-dom';


const Navigation = (props: any) => {
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
          <form className="d-none d-lg-flex col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input
              type="search"
              className="form-control bg-white"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <MiniCart />
          <UserProfile />
        </div>
      </div>

    </header>
  );
}

export default Navigation;