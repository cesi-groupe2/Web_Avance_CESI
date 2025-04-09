import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Appel API pour demander un lien de réinitialisation
    console.log('Demande de reset pour :', email);
  };

  return (
    <div className="forgot-container">
      <h1>Mot de passe oublié</h1>
      <form className="forgot-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <p className="info-text">
          Si un compte est associé à cette adresse, un mail avec un lien pour changer de mot de passe vous sera envoyé.
        </p>

        <button type="submit" className="btn-yellow">
          Demander un nouveau mot de passe
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
