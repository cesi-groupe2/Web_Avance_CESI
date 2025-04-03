import React from 'react';
import './Header.css';
import logo from '../../../assets/logo.png';

const Header = () => {
  return (
    <header className="header">
      <a href="/" className="header-logo">
      <img src={logo} alt="Easeeat Logo" className="logo" />
      </a>
      <div className="header-buttons">
        <a href="/login" className="btn login">Connexion</a>
        <a href="/signup" className="btn signup">Inscription</a>
      </div>
    </header>
  );
};

export default Header;
