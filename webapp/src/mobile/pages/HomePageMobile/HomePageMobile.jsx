import React from 'react';
import { Link } from 'react-router-dom';
import './HomePageMobile.css';
import logo from '../../../assets/logo-mobile.png';

const HomePageMobile = () => {
  return (
    <div className="home-mobile-container">
      <div className="home-mobile-background" />

      <img src={logo} alt="Easeeat logo" className="mobile-logo" />

      <h2 className="home-mobile-title">Vos restos préférés livrés chez vous !</h2>
      <p className="home-mobile-sub">
        C’est easy : commandez, détendez-vous, dégustez !
      </p>

      <div className="home-mobile-actions">
        <Link to="/login" className="btn-mobile-primary">
          Se connecter ⟶
        </Link>

        <div className="home-mobile-separator">ou</div>

        <Link to="/signup" className="btn-mobile-secondary">
          Créer un compte ⟶
        </Link>
      </div>
    </div>
  );
};

export default HomePageMobile;
