import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiUser, FiShoppingBag, FiMenu, FiX, FiHeart, FiLogOut, FiHome, FiPlus } from "react-icons/fi";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 400px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.img`
  height: 40px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 400px) {
    height: 30px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 400px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--primary-color);
    background-color: rgba(0, 160, 130, 0.1);
  }

  svg {
    font-size: 1.2rem;
  }

  @media (max-width: 400px) {
    span {
      display: none;
    }
    svg {
      font-size: 1.4rem;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-weight: 500;

  @media (max-width: 400px) {
    span {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }

  svg {
    font-size: 1.2rem;
  }

  @media (max-width: 400px) {
    span {
      display: none;
    }
    svg {
      font-size: 1.4rem;
    }
  }
`;

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { cartItems = [] } = useCart() || { cartItems: [] };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Link to="/">
          <Logo src={logo} alt="Easeat" />
        </Link>

        <NavLinks>
          <NavLink to="/">
            <FiHome />
            <span>Accueil</span>
          </NavLink>
          
          {currentUser && (
            <>
              <NavLink to="/restaurants">
                <FiShoppingBag />
                <span>Restaurants</span>
              </NavLink>
              
              {currentUser.role === '2' && (
                <NavLink to="/restaurant/create">
                  <FiPlus />
                  <span>Ajouter un restaurant</span>
                </NavLink>
              )}
            </>
          )}
        </NavLinks>

        {currentUser ? (
          <UserMenu>
            <UserInfo>
              <FiUser />
              <span>{currentUser.firstname} {currentUser.lastname}</span>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FiLogOut />
              <span>Déconnexion</span>
            </LogoutButton>
          </UserMenu>
        ) : (
          <NavLinks>
            <NavLink to="/login">
              <FiUser />
              <span>Connexion</span>
            </NavLink>
          </NavLinks>
        )}
      </NavContainer>
    </HeaderContainer>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  userRole: PropTypes.string
};

Header.defaultProps = {
  isAuthenticated: false,
  userRole: "user"
};

export default Header; 