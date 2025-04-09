import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FiUser, FiShoppingBag, FiMenu, FiX, FiHeart } from "react-icons/fi";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.img`
  height: 40px;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  text-decoration: none;
  color: #00a082;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 160, 130, 0.05);
  }
`;

const RegisterButton = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  background-color: #00a082;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #008c70;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CartIcon = styled(FiShoppingBag)`
  font-size: 20px;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #d50000;
  color: white;
  font-size: 12px;
  border-radius: 50%;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  z-index: 1001;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MobileMenuLogo = styled.img`
  height: 30px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const MobileLoginButton = styled(Link)`
  text-decoration: none;
  color: #00a082;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 160, 130, 0.05);
  }
`;

const MobileRegisterButton = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  background-color: #00a082;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #008c70;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: none;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const UserMenuItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const UserMenuLogout = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
  font-weight: normal;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const FavoritesButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #333;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const Header = () => {
  const { currentUser, token, isAuthenticated, logout } = useAuth();
  const { cartItems = [] } = useCart() || { cartItems: [] };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Header Auth State Updated:", { 
      isAuthenticated, 
      token: token ? "exists" : "missing", 
      currentUser: currentUser ? `${currentUser.FirstName} ${currentUser.LastName}` : "missing" 
    });
  }, [isAuthenticated, token, currentUser]);

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

  const handleLogoClick = () => {
    navigate("/");
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeUserMenu();
    navigate("/");
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoLink to="/">
          <Logo src={logo} alt="EasEat" onClick={handleLogoClick} />
        </LogoLink>
        <NavLinks>
          <NavLink to="/restaurants">Restaurants</NavLink>
        </NavLinks>
        <Actions>
          {isAuthenticated ? (
            <UserActions>
              <CartButton to="/cart">
                <CartIcon />
                {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
              </CartButton>
              <FavoritesButton to="/favorites">
                <FiHeart />
              </FavoritesButton>
              <UserMenu>
                <UserMenuButton onClick={toggleUserMenu}>
                  {currentUser?.FirstName || "Mon Profil"}
                </UserMenuButton>
                <UserMenuDropdown isOpen={userMenuOpen}>
                  <UserMenuItem to="/profile" onClick={closeUserMenu}>Mon profil</UserMenuItem>
                  <UserMenuItem to="/favorites" onClick={closeUserMenu}>Mes favoris</UserMenuItem>
                  <UserMenuItem to="/orders" onClick={closeUserMenu}>Mes commandes</UserMenuItem>
                  <UserMenuLogout onClick={handleLogout}>Déconnexion</UserMenuLogout>
                </UserMenuDropdown>
              </UserMenu>
            </UserActions>
          ) : (
            <AuthButtons>
              <CartButton to="/cart">
                <CartIcon />
                {cartItems.length > 0 && <CartBadge>{cartItems.length}</CartBadge>}
              </CartButton>
              <LoginButton to="/login">Connexion</LoginButton>
              <RegisterButton to="/register">Inscription</RegisterButton>
            </AuthButtons>
          )}
          <MobileMenuButton onClick={toggleMenu}>
            <FiMenu />
          </MobileMenuButton>
        </Actions>
      </HeaderContent>

      {isMenuOpen && (
        <MobileMenu>
          <MobileMenuHeader>
            <MobileMenuLogo src={logo} alt="EasEat" />
            <CloseButton onClick={closeMenu}>
              <FiX />
            </CloseButton>
          </MobileMenuHeader>
          <MobileNavLinks>
            <MobileNavLink to="/restaurants" onClick={closeMenu}>
              Restaurants
            </MobileNavLink>
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/profile" onClick={closeMenu}>
                  Mon profil
                </MobileNavLink>
                <MobileNavLink to="/favorites" onClick={closeMenu}>
                  Mes favoris
                </MobileNavLink>
                <MobileNavLink to="/orders" onClick={closeMenu}>
                  Mes commandes
                </MobileNavLink>
                <MobileNavLink to="/cart" onClick={closeMenu}>
                  Mon panier {cartItems.length > 0 && `(${cartItems.length})`}
                </MobileNavLink>
                <MobileNavLink as="button" onClick={handleLogout} style={{ color: '#d32f2f', background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                  Déconnexion
                </MobileNavLink>
              </>
            ) : (
              <MobileAuthButtons>
                <MobileLoginButton to="/login" onClick={closeMenu}>
                  Connexion
                </MobileLoginButton>
                <MobileRegisterButton to="/register" onClick={closeMenu}>
                  Inscription
                </MobileRegisterButton>
              </MobileAuthButtons>
            )}
          </MobileNavLinks>
        </MobileMenu>
      )}
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