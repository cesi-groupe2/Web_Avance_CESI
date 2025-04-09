import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProfileCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const EditButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
`;

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    additionalInfo: ""
  });

  console.log("Current User dans Profile:", currentUser);

  // Populate form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      console.log("Mise à jour du formData avec currentUser:", currentUser);
      
      // Adapter en fonction de la structure réelle de l'objet currentUser retourné par l'API
      setFormData({
        email: currentUser.email || currentUser.Email || "",
        firstName: currentUser.firstname || currentUser.first_name || currentUser.FirstName || "",
        lastName: currentUser.lastname || currentUser.last_name || currentUser.LastName || "",
        phone: currentUser.phone || currentUser.Phone || "",
        // Vérifier les différents noms possibles pour les champs d'adresse
        address: currentUser.address || currentUser.deliveryAdress || currentUser.DeliveryAdress || currentUser.delivery_adress || "",
        city: currentUser.city || currentUser.City || "",
        postalCode: currentUser.postalCode || currentUser.PostalCode || currentUser.postal_code || "",
        additionalInfo: currentUser.additionalInfo || currentUser.AdditionalInfo || currentUser.additional_info || ""
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (currentUser) {
      setFormData({
        email: currentUser.Email || "",
        firstName: currentUser.FirstName || "",
        lastName: currentUser.LastName || "",
        phone: currentUser.Phone || "",
        address: currentUser.Address || "",
        city: currentUser.City || "",
        postalCode: currentUser.PostalCode || "",
        additionalInfo: currentUser.AdditionalInfo || ""
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Formatage des données pour correspondre au format attendu par updateUser
      const formattedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        additionalInfo: formData.additionalInfo
      };
      
      console.log("Updating user profile with:", formattedData);
      
      if (updateUser) {
        const result = await updateUser(formattedData);
        if (result.success) {
          // Mise à jour réussie
          setIsEditing(false);
        } else {
          // Gérer l'erreur
          console.error("Échec de la mise à jour:", result.message);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (show message, etc.)
    }
  };

  if (!currentUser) {
    return (
      <>
        <Header />
        <ProfileContainer>
          <ProfileCard>
            <p>Veuillez vous connecter pour accéder à votre profil.</p>
          </ProfileCard>
        </ProfileContainer>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProfileContainer>
        <ProfileCard>
          <SectionTitle>
            Informations personnelles
            {!isEditing && (
              <EditButton onClick={handleEdit}>Modifier</EditButton>
            )}
          </SectionTitle>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <Input
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              <Input
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              <Input
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </FormGrid>

            <SectionTitle style={{ marginTop: '2rem' }}>Adresse de livraison</SectionTitle>
            <FormGrid>
              <FullWidth>
                <Input
                  label="Adresse"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </FullWidth>
              <Input
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Code postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <FullWidth>
                <Input
                  label="Informations complémentaires"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Étage, code d'entrée, etc."
                  disabled={!isEditing}
                />
              </FullWidth>
            </FormGrid>

            {isEditing && (
              <ButtonContainer>
                <CancelButton type="button" onClick={handleCancel}>
                  Annuler
                </CancelButton>
                <SaveButton type="submit">
                  Enregistrer
                </SaveButton>
              </ButtonContainer>
            )}
          </form>
        </ProfileCard>
      </ProfileContainer>
    </>
  );
};

export default Profile; 