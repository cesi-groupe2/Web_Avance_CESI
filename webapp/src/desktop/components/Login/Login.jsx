import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/authService';  // Importer le service

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Utiliser useNavigate pour rediriger

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);  // Appeler la méthode login du service
      localStorage.setItem('token', user.token);  // Sauvegarder le token dans le localStorage
      alert('Connexion réussie!');
      navigate.push('/home');  // Rediriger vers la page d'accueil ou autre
    } catch (err) {
      setError(err.message);  // Afficher l'erreur si la connexion échoue
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
