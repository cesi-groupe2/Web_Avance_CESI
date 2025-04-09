import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  padding: 40px 20px;
`;

const StatusCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: #00a082;
  margin: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 20px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin-bottom: 30px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const NotFound = () => {
  const { currentUser } = useAuth();

  return (
    <NotFoundContainer>
      <Header isAuthenticated={!!currentUser} userRole={currentUser?.role} />
      
      <ContentContainer>
        <StatusCode>404</StatusCode>
        <Title>Page non trouvée</Title>
        <Description>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </Description>
        <Link to="/">
          <Button>Retourner à l'accueil</Button>
        </Link>
      </ContentContainer>
    </NotFoundContainer>
  );
};

export default NotFound; 