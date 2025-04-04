import React, { useState } from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import './ForgotPasswordPageMobile.css';

const ForgotPasswordPageMobile = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Demande de réinitialisation pour :', email);
    // 👉 ici, tu pourrais appeler une API /auth/forgot-password
  };

  return (
    <MobileLayout>
      <div className="forgot-mobile-box">
        <h2 className="forgot-mobile-title">Mot de passe<br />oublié</h2>
        <form className="forgot-mobile-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse mail</label>
          <input
            type="email"
            id="email"
            placeholder="Adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="forgot-desc">
            Si un compte est associé à cette adresse, un mail avec un lien pour changer de mot de passe vous sera envoyé.
          </p>
          <button type="submit" className="btn-mobile-primary">
            Demander un nouveau mot de passe ⟶
          </button>
        </form>
      </div>
    </MobileLayout>
  );
};

export default ForgotPasswordPageMobile;
