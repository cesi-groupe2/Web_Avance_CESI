import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdHome,
  MdRestaurant,
  MdShoppingCart,
  MdAccountCircle,
  MdDeliveryDining,
  MdBarChart,
  MdStorefront
} from 'react-icons/md';
import { useUser } from '../../../contexts/UserContext';
import './MobileNavbar.css';

const NAV_ITEMS_BY_ROLE = {
  client: [
    { to: '/', label: 'Accueil', icon: <MdHome /> },
    { to: '/restaurants', label: 'Restaurants', icon: <MdRestaurant /> },
    { to: '/panier', label: 'Panier', icon: <MdShoppingCart /> },
    { to: '/compte', label: 'Mon compte', icon: <MdAccountCircle /> },
  ],
  restaurateur: [
    { to: '/', label: 'Accueil', icon: <MdHome /> },
    { to: '/restaurant', label: 'Mon restaurant', icon: <MdStorefront /> },
    { to: '/stats', label: 'Statistiques', icon: <MdBarChart /> },
    { to: '/compte', label: 'Mon compte', icon: <MdAccountCircle /> },
  ],
  livreur: [
    { to: '/', label: 'Accueil', icon: <MdHome /> },
    { to: '/livraisons', label: 'Mes livraisons', icon: <MdDeliveryDining /> },
    { to: '/stats', label: 'Statistiques', icon: <MdBarChart /> },
    { to: '/compte', label: 'Mon compte', icon: <MdAccountCircle /> },
  ],
  developpeur: [
    { to: '/', label: 'Accueil', icon: <MdHome /> },
    { to: '/restaurants', label: 'Restaurants', icon: <MdRestaurant /> },
    { to: '/panier', label: 'Panier', icon: <MdShoppingCart /> },
    { to: '/compte', label: 'Mon compte', icon: <MdAccountCircle /> },
  ],
};

const MobileNavbar = () => {
  const { role } = useUser(); // ⬅️ récupère automatiquement le rôle
  const navItems = NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.client;

  return (
    <nav className="mobile-navbar">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <div className="icon">{item.icon}</div>
          <div className="label">{item.label}</div>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavbar;
