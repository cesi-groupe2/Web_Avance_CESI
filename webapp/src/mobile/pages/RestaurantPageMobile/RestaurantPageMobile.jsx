import React from 'react';
import { useParams } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';
import MenuItem from '../../components/MenuItem/MenuItem';
import { restaurants } from '../../data/mockRestaurants';

const RestaurantPageMobile = () => {
  const { id } = useParams();

  const resto = restaurants.find(r => r.id === id);

  if (!resto) {
    return (
      <MobileLayout>
        <p style={{ padding: '1rem' }}>Restaurant introuvable 😢</p>
        <MobileNavbar />
      </MobileLayout>
    );
  }

  const handleAddToCart = (item) => {
    console.log(`Ajouté : ${item.name}`);
  };

  return (
    <MobileLayout>
      <div className="restaurant-page-content" style={{ paddingBottom: '80px' }}>
        <img src={resto.image} alt={resto.name} style={{ width: '100%' }} />
        <h2 style={{ textAlign: 'center', margin: '1rem 0 0.3rem' }}>{resto.name}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span className="chip">{resto.deliveryPrice} livraison</span>
          <span className="chip">arrivée en {resto.eta}</span>
        </div>

        <h3 style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>MENU</h3>
        {resto.menu.map((item) => (
          <MenuItem key={item.id} {...item} onAdd={() => handleAddToCart(item)} />
        ))}
      </div>

      <MobileNavbar />
    </MobileLayout>
  );
};

export default RestaurantPageMobile;
