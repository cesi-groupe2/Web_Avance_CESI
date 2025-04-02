import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [motdepasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle login logic here
    console.log('Login avec:', identifiant, motdepasse);
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Identifiant"
          value={identifiant}
          onChange={(e) => setIdentifiant(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        <button type="submit" className="btn-yellow">Se connecter ⟶</button>

        <Link to="/forgot-password" className="forgot-link">
          Mot de passe oublié ?
        </Link>

        <div className="separator">OU</div>

        <Link to="/signup" className="btn-secondary">
          Créer un compte ⟶
        </Link>
      </form>
    </div>
  );
};

export default Login;
