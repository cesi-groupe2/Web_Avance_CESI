import React from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = ({ formData, handleChange, handleSubmit, error, loading }) => {
  return (
    <div className="signup-container">
      <h1>Inscription</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Je suis</legend>
          {['client', 'livreur', 'restaurateur', 'dev'].map((role) => (
            <label key={role}>
              <input
                type="radio"
                name="role"
                value={role}
                checked={formData.role === role}
                onChange={handleChange}
              />
              {` Un ${role === 'dev' ? 'développeur tiers' : role}`}
            </label>
          ))}
        </fieldset>

        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
        <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
        <input type="email" name="email" placeholder="Mail" value={formData.email} onChange={handleChange} />
        <input type="tel" name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
        <input type="password" name="motdepasse" placeholder="Mot de passe" value={formData.motdepasse} onChange={handleChange} />
        <input type="password" name="confirmation" placeholder="Confirmation du mot de passe" value={formData.confirmation} onChange={handleChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className="btn-yellow" disabled={loading}>
          {loading ? 'Chargement...' : "S'inscrire ⟶"}
        </button>

        <div className="separator">OU</div>

        <Link to="/login" className="btn-secondary">Se connecter</Link>
      </form>
    </div>
  );
};

export default Signup;
