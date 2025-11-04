import React from 'react';

import './navigation.css';
import logo from '../../assets/gog_logo.png';
import { AEM_HOST, STORE_PAGE_PATH } from '../../constants/constants';


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
          <a href={`${AEM_HOST}${STORE_PAGE_PATH}`} className="nav-link nav-item active">Loja</a>
          <a href={`${AEM_HOST}${STORE_PAGE_PATH}`} className="nav-link nav-item">Biblioteca</a>
          <a href={`${AEM_HOST}${STORE_PAGE_PATH}`} className="nav-link nav-item">Comunidade</a>
        </nav>

        <div className="header-user-actions d-flex align-items-center">
          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
        </div>
      </div>

    </header>
  );
}

export default Navigation;