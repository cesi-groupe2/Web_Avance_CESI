import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MobileLayout.css';
import logo from '../../../assets/logo-mobile.png';
import { IoArrowBack } from 'react-icons/io5';

const MobileLayout = ({ children, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="mobile-layout-container">
      <div className="mobile-layout-background" />

      <header className="mobile-layout-header">
        {showBack && !isHome && (
          <button className="mobile-back-button" onClick={() => navigate(-1)}>
            <IoArrowBack size={24} />
          </button>
        )}
        <img src={logo} alt="Easeeat Logo" className="mobile-layout-logo" />
      </header>

      <main className="mobile-layout-content">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
