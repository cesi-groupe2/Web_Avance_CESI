import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Login, Footer } from '../../components';
import { login } from '../../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [motdepasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Veuillez entrer une adresse email valide.");
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, motdepasse);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Login
        email={email}
        password={motdepasse}
        onChangeEmail={(e) => setEmail(e.target.value)}
        onChangePassword={(e) => setMotDePasse(e.target.value)}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
      <Footer />
    </>
  );
};

export default LoginPage;