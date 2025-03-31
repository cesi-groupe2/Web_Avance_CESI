import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';
import appStore from '../../assets/apple_store.webp';
import googlePlay from '../../assets/google_play.png';

const Footer = () => {
  return (
    <footer className="footer">
      <a href="/"><img src={logo} alt="Easeeat logo" className="footer-logo" /></a>

      <div className="footer-links">
        <div>
          <p>Obtenir de l’aide</p>
          <p>Ajoutez votre restaurant</p>
          <p>Devenez coursier</p>
          <p>Promotions</p>
        </div>
        <div>
          <p>Restaurants à proximité</p>
          <p>Afficher toutes les villes</p>
          <p>À propos d’Easeat</p>
          <p>Faites vos courses</p>
        </div>
      </div>

      <div className="store-buttons">
        <a href="/"><img src={appStore} alt="App Store" /></a>
        <a href="/"><img src={googlePlay} alt="Google Play" /></a>
      </div>

      <div className="footer-bottom">
        <p>Fonctionnement du site et de l’application Easeat</p>
        <p>Politique de confidentialité • Conditions • Tarifs</p>
        <p>Ne vendez pas et ne partagez pas vos informations personnelles</p>
        <p>©2025 Easeat technology</p>
      </div>
    </footer>
  );
};

export default Footer;
