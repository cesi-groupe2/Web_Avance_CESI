import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/logo.png";
import Header from "../../../components/Header";
import { FiArrowLeft } from "react-icons/fi";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: #00a082;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const Logo = styled.img`
  height: 60px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ForgotPassword = styled(Link)`
  color: #00a082;
  text-align: right;
  margin-top: -10px;
  margin-bottom: 20px;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 30px;
  color: #666;
  font-size: 14px;

  a {
    color: #00a082;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const Login = () => {
  const { login, isAuthenticated, currentUser, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [loginSuccessful, setLoginSuccessful] = useState(false);

  // Effet pour surveiller l'état d'authentification et rediriger l'utilisateur
  useEffect(() => {
    console.log("État d'auth dans useEffect:", { isAuthenticated, currentUser, token, loginSuccessful });
    
    if (loginSuccessful && isAuthenticated) {
      console.log("Redirection après connexion réussie");
      // Get the redirect path from location state or default to home
      const { state } = location;
      const redirectPath = state?.from || "/";
      console.log("Redirection vers:", redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, currentUser, loginSuccessful, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      // Valider les données du formulaire
      if (!formData.email || !formData.password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      // Email valide ?
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Utiliser la fonction login du contexte d'authentification
      const result = await login(formData.email, formData.password);
      console.log("Résultat de la connexion:", result);

      if (result && result.user) {
        console.log("Utilisateur connecté:", result.user);
        setLoginSuccessful(true);
      } else {
        throw new Error("Échec de la connexion: informations utilisateur manquantes");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      
      // Gestion d'erreurs plus précise
      if (err.status === 401) {
        setFormError("Email ou mot de passe incorrect");
      } else if (err.status === 404) {
        setFormError("Utilisateur introuvable");
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError("Une erreur est survenue lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <BackButton to="/">
          <FiArrowLeft /> Retour à l'accueil
        </BackButton>
        
        <LogoContainer>
          <Logo src={logo} alt="EasEat Logo" />
        </LogoContainer>
        
        <Title>Connexion</Title>
        
        {formError && <ErrorMessage>{formError}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Entrez votre adresse email"
            required
          />
          
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Entrez votre mot de passe"
            required
          />
          
          <ForgotPassword to="/forgot-password">
            Mot de passe oublié ?
          </ForgotPassword>
          
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </Form>
        
        <RegisterLink>
          Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 