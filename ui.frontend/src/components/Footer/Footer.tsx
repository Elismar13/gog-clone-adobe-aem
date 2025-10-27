import React from 'react';

import './footer.css'

const Footer = (props: any) => {
  return (
    <footer className="header bg-custom-dark sticky-top">
      <div className="header-logo text-accent">GOG.COM</div>

      <div className="header-user-actions d-flex align-items-center">
        <button type="button" className="btn btn-primary">Download</button>
      </div>
    </footer>
  );
}

export default Footer;