import React from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';
import RestaurantCarousel from '../../components/RestaurantCarousel/RestaurantCarousel'
import './HomePageConnectedMobile.css';

const restaurantsProches = [
  {
    id: 1,
    nom: 'Brioche dorée',
    image: '/restos/brioche.jpg',
    prix: '2.99€',
    temps: '10 min',
    note: 4.6,
    avis: 240,
  },
  // ... autres
];

const restaurantsPopulaires = [
  {
    id: 2,
    nom: 'Snack N Nem',
    image: '/restos/snack.jpg',
    prix: '2.69€',
    temps: '30 min',
    note: 4.5,
    avis: 260,
  },
];

const recommandes = [
  {
    id: 3,
    nom: 'Koboon',
    image: '/restos/koboon.jpg',
    prix: '3.19€',
    temps: '25 min',
    note: 4.5,
    avis: 600,
  },
];

const HomePageConnectedMobile = () => {
  return (
    <MobileLayout>
      <input
        type="text"
        placeholder="Restaurant indien"
        className="search-mobile"
      />

      <RestaurantCarousel title="Proches de chez vous" restaurants={restaurantsProches} />
      <RestaurantCarousel title="Les plus populaires" restaurants={restaurantsPopulaires} />
      <RestaurantCarousel title="Commander à nouveau" restaurants={recommandes} />

      <MobileNavbar />
    </MobileLayout>
  );
};

export default HomePageConnectedMobile;
