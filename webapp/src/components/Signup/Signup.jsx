import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    role: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motdepasse: '',
    confirmation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add form validation and submission logic
    console.log('Form submitted:', formData);
  };

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

        <input type="text" name="nom" placeholder="Nom" onChange={handleChange} />
        <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} />
        <input type="email" name="email" placeholder="Mail" onChange={handleChange} />
        <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} />
        <input type="password" name="motdepasse" placeholder="Mot de passe" onChange={handleChange} />
        <input type="password" name="confirmation" placeholder="Confirmation du mot de passe" onChange={handleChange} />

        <button type="submit" className="btn-yellow">S'inscrire ⟶</button>

        <div className="separator">OU</div>

        <Link to="/login" className="btn-secondary">Se connecter</Link>
      </form>
    </div>
  );
};

export default Signup;
