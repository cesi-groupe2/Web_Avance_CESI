import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/logo.png";
import { FiArrowLeft } from "react-icons/fi";
import ModelUser from "../../../model/ModelUser";

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f9f9f9;
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 550px;
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

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const UserTypeSelection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const UserTypeLabel = styled.p`
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
`;

const UserTypeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const UserTypeOption = styled.div`
  flex: 1;
  min-width: 120px;
`;

const UserTypeButton = styled.button`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#00a082" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#333")};
  border: 1px solid ${(props) => (props.active ? "#00a082" : "#e0e0e0")};
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.active ? "#008c70" : "#f5f5f5")};
  }
`;

const LoginLink = styled.p`
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

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    postalCode: "",
    city: "",
    additionalInfo: "",
    role: "1", // 1 = client par défaut
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.passwordConfirm || 
        !formData.firstName || !formData.lastName) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Créer une adresse complète à partir des champs individuels
      const fullAddress = [
        formData.street,
        formData.additionalInfo,
        `${formData.postalCode} ${formData.city}`
      ].filter(Boolean).join(", ");
      
      // Créer un modèle utilisateur compatible directement avec l'API
      const apiUserData = {
        email: formData.email,
        password: formData.password,
        // Utiliser exactement les noms de champs attendus par l'API
        firstname: formData.firstName,
        lastname: formData.lastName,
        phone: formData.phone || "",
        // Utiliser les noms de champs exacts pour les adresses
        deliveryAdress: fullAddress || "",
        facturationAdress: fullAddress || "", // Utiliser la même adresse pour la facturation par défaut
        role: formData.role
      };
      
      console.log("Données d'inscription préparées:", apiUserData);
      const result = await register(apiUserData);
      
      if (result && result.success) {
        setSuccess("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(result?.message || "Échec de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      if (error.status === 409) {
        setError("Cette adresse email est déjà utilisée.");
      } else if (error.status === 400) {
        setError("Données d'inscription invalides. Veuillez vérifier vos informations.");
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackButton to="/">
          <FiArrowLeft /> Retour à l'accueil
        </BackButton>

        <LogoContainer>
          <Logo src={logo} alt="EasEat Logo" />
        </LogoContainer>

        <Title>Créer un compte</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <UserTypeSelection>
            <UserTypeLabel>Je suis :</UserTypeLabel>
            <UserTypeOptions>
              <UserTypeOption>
                <UserTypeButton
                  type="button"
                  active={formData.role === "1"}
                  onClick={() => handleRoleSelect("1")}
                >
                  Client
                </UserTypeButton>
              </UserTypeOption>
              <UserTypeOption>
                <UserTypeButton
                  type="button"
                  active={formData.role === "2"}
                  onClick={() => handleRoleSelect("2")}
                >
                  Restaurateur
                </UserTypeButton>
              </UserTypeOption>
              <UserTypeOption>
                <UserTypeButton
                  type="button"
                  active={formData.role === "3"}
                  onClick={() => handleRoleSelect("3")}
                >
                  Livreur
                </UserTypeButton>
              </UserTypeOption>
              <UserTypeOption>
                <UserTypeButton
                  type="button"
                  active={formData.role === "4"}
                  onClick={() => handleRoleSelect("4")}
                >
                  Commercial
                </UserTypeButton>
              </UserTypeOption>
              <UserTypeOption>
                <UserTypeButton
                  type="button"
                  active={formData.role === "5"}
                  onClick={() => handleRoleSelect("5")}
                >
                  Développeur
                </UserTypeButton>
              </UserTypeOption>
            </UserTypeOptions>
          </UserTypeSelection>

          <FormRow>
            <Input
              id="firstName"
              name="firstName"
              label="Prénom"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Entrez votre prénom"
              required
            />
            <Input
              id="lastName"
              name="lastName"
              label="Nom"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              required
            />
          </FormRow>

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre adresse email"
            required
          />

          <Input
            id="phone"
            name="phone"
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Entrez votre numéro de téléphone"
          />

          <Input
            id="street"
            name="street"
            label="Rue"
            type="text"
            value={formData.street || ""}
            onChange={handleChange}
            placeholder="Numéro et nom de rue"
          />

          <FormRow>
            <Input
              id="postalCode"
              name="postalCode"
              label="Code postal"
              type="text"
              value={formData.postalCode || ""}
              onChange={handleChange}
              placeholder="Code postal"
            />
            <Input
              id="city"
              name="city"
              label="Ville"
              type="text"
              value={formData.city || ""}
              onChange={handleChange}
              placeholder="Ville"
            />
          </FormRow>

          <Input
            id="additionalInfo"
            name="additionalInfo"
            label="Complément d'adresse"
            type="text"
            value={formData.additionalInfo || ""}
            onChange={handleChange}
            placeholder="Étage, digicode, etc."
          />

          <FormRow>
            <Input
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Créez un mot de passe"
              required
            />
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              label="Confirmer le mot de passe"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </FormRow>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </Button>
        </Form>

        <LoginLink>
          Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 