import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 3rem 0;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 400px) {
    padding: 0 1rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: var(--text-color);
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`;

const FooterLink = styled(Link)`
  color: var(--gray-medium);
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-medium);
  margin-bottom: 0.5rem;

  svg {
    color: var(--primary-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: var(--gray-medium);
  font-size: 1.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--gray-medium);
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>À propos</h3>
          <p style={{ color: 'var(--gray-medium)', lineHeight: '1.6' }}>
            Easeat est une plateforme de commande de repas en ligne qui connecte les restaurants et les clients.
          </p>
        </FooterSection>

        <FooterSection>
          <h3>Liens rapides</h3>
          <FooterLink to="/">Accueil</FooterLink>
          <FooterLink to="/restaurants">Restaurants</FooterLink>
          <FooterLink to="/about">À propos</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <ContactInfo>
            <FiMail />
            contact@easeat.fr
          </ContactInfo>
          <ContactInfo>
            <FiPhone />
            +33 1 23 45 67 89
          </ContactInfo>
          <ContactInfo>
            <FiMapPin />
            123 rue de la Paix, 75001 Paris
          </ContactInfo>
        </FooterSection>

        <FooterSection>
          <h3>Suivez-nous</h3>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiInstagram />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiFacebook />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiTwitter />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
      </FooterContent>

      <Copyright>
        © {new Date().getFullYear()} Easeat. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 