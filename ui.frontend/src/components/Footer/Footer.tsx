import React from 'react';

import './footer.css';
import logo from '../../assets/gog_logo.png';

const Footer = (props: any) => {
  return (
    <footer className="header bg-custom-dark sticky-top">
      <div className="container d-flex justify-content-between px-5">

        <img
          src={logo}
          alt="GOG"
          className='header-logo'
        />

        <div className="header-user-actions d-flex align-items-center">
          <button type="button" className="btn btn-primary">Download</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;