import React from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';
import RestaurantCarousel from '../../components/RestaurantCarousel/RestaurantCarousel'
import './HomePageConnectedMobile.css';

const restaurantsProches = [
  {
    id: 1,
    nom: 'Brioche dorée',
    image: '../../../assets/restos/brioche-doree.jpeg',
    prix: '2.99€',
    temps: '10 min',
    note: 4.6,
    avis: 240,
  },
  {
    id: 2,
    nom: 'Tommy’s Burger',
    image: '../../../assets/restos/tommys.png',
    prix: '2.69€',
    temps: '30 min',
    note: 4.5,
    avis: 260,
  },
  {
    id: 3,
    nom: 'Koboon',
    image: '../../../assets/restos/koboon.png',
    prix: '3.19€',
    temps: '25 min',
    note: 4.5,
    avis: 600,
  },
  {
    id: 4,
    nom: 'Pizza Hut',
    image: '../../../assets/restos/pizza-hut.png',
    prix: '2.99€',
    temps: '15 min',
    note: 4.8,
    avis: 320,
  },
  {
    id: 5,
    nom: 'Pizza Bonici',
    image: '../../../assets/restos/pizza-bonici.png',
    prix: '3.49€',
    temps: '20 min',
    note: 4.7,
    avis: 400,
  },
];

const restaurantsPopulaires = [
  {
    id: 2,
    nom: 'Snack N Nem',
    image: '../../../assets/restos/snack-nem.png',
    prix: '2.69€',
    temps: '30 min',
    note: 4.5,
    avis: 260,
  },
  {
    id: 3,
    nom: 'Poketeria',
    image: '../../../assets/restos/poketeria.png',
    prix: '3.19€',
    temps: '25 min',
    note: 4.5,
    avis: 600,
  },
  {
    id: 4,
    nom: 'Pizza Hut',
    image: '../../../assets/restos/pizza-hut.png',
    prix: '2.99€',
    temps: '15 min',
    note: 4.8,
    avis: 320,
  },
  {
    id: 5,
    nom: 'Pizza Bonici',
    image: '../../../assets/restos/pizza-bonici.png',
    prix: '3.49€',
    temps: '20 min',
    note: 4.7,
    avis: 400,
  }
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
  {
    id: 4,
    nom: 'Tacostanet',
    image: '../../../assets/restos/tacostanet.png',
    prix: '2.99€',
    temps: '15 min',
    note: 4.8,
    avis: 320,
  },
  {
    id: 5,
    nom: 'Pizza Bonici',
    image: '../../../assets/restos/pizza-bonici.png',
    prix: '3.49€',
    temps: '20 min',
    note: 4.7,
    avis: 400,
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
      <h1 className="title-mobile">Proches de chez vous</h1>
      <RestaurantCarousel restaurants={restaurantsProches} />
      <h1 className="title-mobile">Restaurants populaires</h1>
      <RestaurantCarousel restaurants={restaurantsPopulaires} />
      <h1 className="title-mobile">Restaurants recommandés</h1>
      <RestaurantCarousel restaurants={recommandes} />

      <MobileNavbar />
    </MobileLayout>
  );
};

export default HomePageConnectedMobile;
