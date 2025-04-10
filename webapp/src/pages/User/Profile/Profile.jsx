import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { FiAlertTriangle } from "react-icons/fi";

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

const DeleteAccountButton = styled(Button)`
  background-color: #f44336;
  margin-top: 2rem;
  width: 100%;
  &:hover {
    background-color: #d32f2f;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    color: #f44336;
    margin-right: 0.5rem;
    font-size: 1.8rem;
  }
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
  color: #666;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const DangerCard = styled(ProfileCard)`
  border: 1px solid #ffebee;
  margin-top: 2rem;
`;

const DangerTitle = styled(SectionTitle)`
  color: #d32f2f;
`;

const Profile = () => {
  const { currentUser, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        email: currentUser.email || currentUser.Email || "",
        firstName: currentUser.firstname || currentUser.first_name || currentUser.FirstName || "",
        lastName: currentUser.lastname || currentUser.last_name || currentUser.LastName || "",
        phone: currentUser.phone || currentUser.Phone || "",
        address: currentUser.address || currentUser.deliveryAdress || currentUser.DeliveryAdress || currentUser.delivery_adress || "",
        city: currentUser.city || currentUser.City || "",
        postalCode: currentUser.postalCode || currentUser.PostalCode || currentUser.postal_code || "",
        additionalInfo: currentUser.additionalInfo || currentUser.AdditionalInfo || currentUser.additional_info || ""
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Call API to update user profile
      // This is a placeholder for the actual API call
      console.log("Updating user profile with:", formData);
      
      // If you have an updateUser function in your AuthContext, use it
      if (updateUser) {
        await updateUser(formData);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (show message, etc.)
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
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
        
        <DangerCard>
          <DangerTitle>Zone de danger</DangerTitle>
          <p>Attention, la suppression de votre compte est irréversible. Toutes vos données seront effacées.</p>
          <DeleteAccountButton onClick={() => setShowDeleteModal(true)}>
            Supprimer mon compte
          </DeleteAccountButton>
        </DangerCard>
        
        {showDeleteModal && (
          <ModalOverlay>
            <Modal>
              <ModalTitle>
                <FiAlertTriangle /> Confirmation de suppression
              </ModalTitle>
              <ModalText>
                Êtes-vous vraiment sûr de vouloir supprimer votre compte ? Cette action est irréversible et entraînera la perte de toutes vos données, y compris votre historique de commandes et vos favoris.
              </ModalText>
              <ModalButtons>
                <Button onClick={() => setShowDeleteModal(false)}>
                  Annuler
                </Button>
                <CancelButton onClick={handleDeleteAccount}>
                  Confirmer la suppression
                </CancelButton>
              </ModalButtons>
            </Modal>
          </ModalOverlay>
        )}
      </ProfileContainer>
    </>
  );
};

export default Profile; 