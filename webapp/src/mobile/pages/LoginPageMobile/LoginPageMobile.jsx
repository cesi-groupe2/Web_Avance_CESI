import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import './LoginPageMobile.css';

const LoginPageMobile = () => {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Connexion avec :', email, motdepasse);
  };

  return (
    <MobileLayout>
      <div className="login-mobile-box">
        <h2 className="login-mobile-title">Connexion</h2>
        <form className="login-mobile-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Identifiant"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motdepasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
          <button type="submit" className="btn-mobile-primary">
            Se connecter ⟶
          </button>
          <Link to="/forgot-password" className="login-mobile-link">
            Mot de passe oublié ?
          </Link>
          <div className="home-mobile-separator">ou</div>
          <Link to="/signup" className="btn-mobile-secondary">
            Créer un compte ⟶
          </Link>
        </form>
      </div>
    </MobileLayout>
  );
};

export default LoginPageMobile;
