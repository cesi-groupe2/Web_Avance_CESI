import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import home_picture from "../../assets/home_picture.webp";
import RestaurantApi from "../../api/RestaurantApi";
import "./Home.css";
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
`;

const HeroSection = styled.div`
  position: relative;
  height: 80vh;
  min-height: 600px;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));

  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  transform: scale(1.1);
  animation: zoomIn 20s linear infinite alternate;

  @keyframes zoomIn {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }
`;

const HeroContent = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  color: white;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease 0.2s backwards;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  animation: fadeInUp 1s ease 0.4s backwards;

  &:hover {
    background-color: darken(var(--primary-color), 10%);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background-color: var(--gray-light);
`;

const FeatureTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--box-shadow);
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const FeatureCardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const FeatureCardText = styled.p`
  font-size: 1.1rem;
  color: var(--gray-medium);
  line-height: 1.6;
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

const RestaurateurSection = styled.div`
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f8ff;
`;

const RestaurateurTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
`;

const CreateRestaurantButton = styled(Button)`
  background-color: #00a082;
  color: white;
  padding: 20px 40px;
  font-size: 1.2rem;
  border-radius: 8px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #008c74;
    transform: scale(1.05);
  }
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
  max-width: 600px;
  width: 100%;
  margin: 20px 0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const RestaurantName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const RestaurantInfo = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
`;

const RestaurantActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const WebPageDAccueil = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, token, userRole } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("État d'authentification sur la page d'accueil:", { 
      isAuthenticated, 
      currentUser, 
      token,
      tokenInStorage: localStorage.getItem("token"),
      userInStorage: localStorage.getItem("currentUser")
    });

    if (currentUser?.role === '2') {
      // Vérifier si l'utilisateur a un id_restaurant
      if (currentUser.id_restaurant) {
        const restaurantApi = new RestaurantApi();
        restaurantApi.restaurantRestaurantIdGet(currentUser.id_restaurant.toString(), (error, data) => {
          if (!error && data) {
            setRestaurant(data);
          } else {
            console.error("Erreur lors de la récupération du restaurant:", error);
          }
          setLoading(false);
        });
      } else {
        // Si l'utilisateur n'a pas d'id_restaurant, on considère qu'il n'a pas de restaurant
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  return (
    <HomeContainer>
      <Header />
      
      {currentUser?.role === '2' && (
        <RestaurateurSection>
          <RestaurateurTitle>Espace Restaurateur</RestaurateurTitle>
          {loading ? (
            <p>Chargement...</p>
          ) : restaurant ? (
            <RestaurantCard>
              <RestaurantName>{restaurant.name}</RestaurantName>
              <RestaurantInfo>Adresse : {restaurant.address}</RestaurantInfo>
              <RestaurantInfo>Téléphone : {restaurant.phone}</RestaurantInfo>
              <RestaurantActions>
                <Button onClick={() => navigate(`/restaurant/${restaurant.id_restaurant}`)}>
                  Voir mon restaurant
                </Button>
                <Button onClick={() => navigate(`/restaurant/${restaurant.id_restaurant}/edit`)}>
                  Modifier
                </Button>
              </RestaurantActions>
            </RestaurantCard>
          ) : (
            <>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center' }}>
                Vous n'avez pas encore de restaurant. Créez votre restaurant pour commencer à recevoir des commandes !
              </p>
              <CreateRestaurantButton onClick={() => navigate("/restaurant/create")}>
                Créer mon restaurant
              </CreateRestaurantButton>
            </>
          )}
        </RestaurateurSection>
      )}
      
      <HeroSection>
        <HeroImage src={home_picture} alt="EasEat - Livraison de repas" />
        <HeroContent>
          <HeroTitle>Vos restos préférés livrés chez vous !</HeroTitle>
          <HeroSubtitle>
            C'est easy, commandez, détendez vous, dégustez !
          </HeroSubtitle>
          <HeroButton to="/restaurants">
            Commandez maintenant
          </HeroButton>
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
