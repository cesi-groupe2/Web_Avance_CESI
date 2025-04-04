import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Signup, Footer } from '../../components';
import { register } from '../../../services/authService'; // Importer le service d'inscription

const SignupPage = () => {
  const [formData, setFormData] = useState({
    role: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motdepasse: '',
    confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gérer les changements des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérifier que les mots de passe correspondent
    if (formData.motdepasse !== formData.confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    // Préparer les données à envoyer
    const userData = new URLSearchParams();
    for (const key in formData) {
      userData.append(key, formData[key]);
    }

    try {
      const response = await register(userData);
      alert('Inscription réussie!');
      // Rediriger l'utilisateur vers la page de connexion ou autre après succès
      window.location.href = '/home';
    } catch (error) {
      setError(error.message || 'Une erreur est survenue pendant l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Signup 
        formData={formData} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
        error={error} 
        loading={loading} 
      />
      <Footer />
    </>
  );
};

export default SignupPage;
