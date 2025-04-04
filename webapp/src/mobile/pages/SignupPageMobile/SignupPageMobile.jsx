import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import './SignupPageMobile.css';

const SignupPageMobile = () => {
  const [formData, setFormData] = useState({
    role: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Inscription avec:', formData);
  };

  return (
    <MobileLayout>
      <div className="signup-mobile-box">
        <h2 className="signup-mobile-title">Inscription</h2>
        <form className="signup-mobile-form" onSubmit={handleSubmit}>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Je suis</option>
            <option value="client">Un client</option>
            <option value="livreur">Un livreur</option>
            <option value="restaurateur">Un restaurateur</option>
            <option value="dev">Un développeur tiers</option>
          </select>

          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Mail" onChange={handleChange} required />
          <input type="tel" name="telephone" placeholder="Téléphone" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" onChange={handleChange} required />

          <button type="submit" className="btn-mobile-primary">Créer un compte ⟶</button>

          <div className="home-mobile-separator">ou</div>

          <Link to="/login" className="btn-mobile-secondary">
            Se connecter ⟶
          </Link>
        </form>
      </div>
    </MobileLayout>
  );
};

export default SignupPageMobile;
