import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [mail, setMail] = useState('');
  const [motdepasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // redirection après connexion réussie

  // ✅ Création de l'objet URLSearchParams pour l'encodage correct
  const formData = new URLSearchParams();
  formData.append('email', mail);
  formData.append('password', motdepasse);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Login avec:', mail, motdepasse);

  if (!isValidEmail(mail)) {
    setError("Veuillez entrer une adresse email valide.");
    setLoading(false);
    return;
  }

    try {
      const response = await fetch('http://localhost:80/public/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // ✅ Accepter JSON en retour
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ Type correct
        },
        body: formData.toString(), // ✅ Convertir en format URL-Encoded
      });

      const data = await response.json();

      if (response.ok) {
        // Si la connexion est réussie, sauvegarder le token
        localStorage.setItem('token', data.token);
        alert('Authentification réussie !');

        // Redirection vers la page d'accueil ou une page protégée
        history.push('http://localhost:5173/');
      } else {
        // Gestion des erreurs si la connexion échoue
        setError(data.message || 'Identifiants invalides');
      }
    } catch (error) {
      // Gestion des erreurs de requêtes réseau
      setError('Une erreur est survenue, veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motdepasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn-yellow" disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter ⟶'}
        </button>

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
