import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import RestaurantApi from "../../api/RestaurantApi";
import home_picture from "../../assets/home_picture.webp";
import "./Home.css";

// Instance de l'API Restaurant
const restaurantApi = new RestaurantApi();

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
`;

const HeroSection = styled.div`
  position: relative;
  height: 500px;
  width: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  color: white;
  text-align: center;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 30px;
  max-width: 700px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeaturesSection = styled.div`
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
`;

const FeatureTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 50px;
  text-align: center;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #00a082;
`;

const FeatureCardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const FeatureCardText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
`;

const DebugAuthSection = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  border-radius: 8px;
`;

const DebugAuthItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  
  span {
    font-weight: bold;
    margin-right: 10px;
    min-width: 150px;
  }
`;

const WebPageDAccueil = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, token, userRole } = useAuth();
  const [hasRestaurant, setHasRestaurant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("État d'authentification sur la page d'accueil:", { 
      isAuthenticated, 
      currentUser, 
      token,
      tokenInStorage: localStorage.getItem("token"),
      userInStorage: localStorage.getItem("currentUser"),
      userRole
    });

    // Vérifier si l'utilisateur est un restaurateur et s'il a un restaurant
    if (isAuthenticated && userRole === "2") {
      console.log("L'utilisateur est un restaurateur, vérification de la possession d'un restaurant");
      setIsLoading(true);
      restaurantApi.restaurantMyGet((error, data, response) => {
        if (error) {
          console.error('Erreur lors de la vérification de la possession d\'un restaurant:', error);
          setHasRestaurant(false);
        } else {
          console.log("Données du restaurant:", data);
          // Si le tableau est vide, le restaurateur n'a pas de restaurant
          const hasRestaurantData = data && data.length > 0;
          console.log("Le restaurateur a-t-il un restaurant ?", hasRestaurantData);
          setHasRestaurant(hasRestaurantData);
        }
        setIsLoading(false);
      });
    } else {
      console.log("L'utilisateur n'est pas un restaurateur ou n'est pas authentifié");
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser, token, userRole]);

  const getButtonText = () => {
    console.log("État actuel pour le texte du bouton:", {
      isLoading,
      isAuthenticated,
      userRole,
      hasRestaurant
    });

    if (isLoading) {
      return "Chargement...";
    }
    if (isAuthenticated && userRole === "2" && !hasRestaurant) {
      return "Ouvrir mon restaurant";
    }
    return "Commandez maintenant";
  };

  const handleButtonClick = () => {
    if (isLoading) return;
    
    if (isAuthenticated && userRole === "2" && !hasRestaurant) {
      navigate("/restaurant/create");
    } else {
      navigate("/restaurants");
    }
  };

  return (
    <HomeContainer>
      <Header />
      
      <HeroSection>
        <HeroImage src={home_picture} alt="EasEat - Livraison de repas" />
        <HeroContent>
          <HeroTitle>Vos restos préférés livrés chez vous !</HeroTitle>
          <HeroSubtitle>
            C'est easy, commandez, détendez vous, dégustez !
          </HeroSubtitle>
          <Button onClick={handleButtonClick}>
            {getButtonText()}
          </Button>
        </HeroContent>
      </HeroSection>
      
      {/* Section de débogage d'authentification */}
      <DebugAuthSection>
        <h2>Informations d'authentification</h2>
        <DebugAuthItem>
          <span>isAuthenticated:</span> {isAuthenticated ? 'Oui' : 'Non'}
        </DebugAuthItem>
        <DebugAuthItem>
          <span>userRole:</span> {userRole || 'Aucun'}
        </DebugAuthItem>
        <DebugAuthItem>
          <span>Token disponible:</span> {token ? 'Oui' : 'Non'}
        </DebugAuthItem>
        <DebugAuthItem>
          <span>Utilisateur:</span> {currentUser ? `${currentUser.FirstName} ${currentUser.LastName}` : 'Non connecté'}
        </DebugAuthItem>
        {currentUser && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <h3>Détails utilisateur</h3>
            <pre style={{ background: '#eee', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </div>
        )}
      </DebugAuthSection>

      <FeaturesSection>
        <FeatureTitle>Pourquoi choisir EasEat ?</FeatureTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🚀</FeatureIcon>
            <FeatureCardTitle>Livraison rapide</FeatureCardTitle>
            <FeatureCardText>
              Nos livreurs s'engagent à vous livrer en moins de 30 minutes pour que vos plats restent chauds et délicieux.
            </FeatureCardText>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🍽️</FeatureIcon>
            <FeatureCardTitle>Large choix de restaurants</FeatureCardTitle>
            <FeatureCardText>
              Des milliers de restaurants partenaires pour satisfaire toutes vos envies, à tout moment de la journée.
            </FeatureCardText>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💸</FeatureIcon>
            <FeatureCardTitle>Paiement facile et sécurisé</FeatureCardTitle>
            <FeatureCardText>
              Payez en ligne en toute sécurité et profitez de nombreuses promotions exclusives.
            </FeatureCardText>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureCardTitle>Suivi en temps réel</FeatureCardTitle>
            <FeatureCardText>
              Suivez votre commande en temps réel et recevez des notifications à chaque étape jusqu'à la livraison.
            </FeatureCardText>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⭐</FeatureIcon>
            <FeatureCardTitle>Programme de fidélité</FeatureCardTitle>
            <FeatureCardText>
              Gagnez des points à chaque commande et profitez de réductions et avantages exclusifs.
            </FeatureCardText>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureCardTitle>Parrainage récompensé</FeatureCardTitle>
            <FeatureCardText>
              Parrainez vos amis et recevez des crédits à utiliser sur vos prochaines commandes.
            </FeatureCardText>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default WebPageDAccueil;
