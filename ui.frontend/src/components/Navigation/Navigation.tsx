import React from 'react';

import './navigation.css'

const Navigation = (props: any) => {
  return (
    <header className="header bg-custom-dark sticky-top p-3">
      <div className="header-logo text-accent">GOG.COM</div>
    
      <nav className="header-nav d-none d-md-flex">
        <a href="#" className="nav-link nav-item active">Loja</a>
        <a href="#" className="nav-link nav-item">Biblioteca</a>
        <a href="#" className="nav-link nav-item">Comunidade</a>
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
        <button className="btn btn-accent btn-sm">Entrar</button>
      </div>
    </header>
  );
}

export default Navigation;