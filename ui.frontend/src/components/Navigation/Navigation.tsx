import React from 'react';

import './navigation.css'

const Navigation = (props: any) => {
  return (
    <header className="header bg-custom-dark sticky-top">
      <div className="header-logo text-accent">GOG.COM</div>
    
      <nav className="header-nav d-none d-md-flex">
        <a href="#" className="nav-item active">Loja</a>
        <a href="#" className="nav-item">Biblioteca</a>
        <a href="#" className="nav-item">Comunidade</a>
      </nav>

      <div className="header-user-actions d-flex align-items-center">
        <i className="fas fa-search text-secondary mx-3 d-none d-sm-block"></i>
        <i className="fas fa-shopping-cart text-secondary me-3"></i>
        <button className="btn btn-accent btn-sm">Entrar</button>
      </div>
    </header>
  );
}

export default Navigation;