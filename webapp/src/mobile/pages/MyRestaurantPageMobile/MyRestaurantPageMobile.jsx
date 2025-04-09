import React from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';
import MenuSection from '../../components/MenuSection/MenuSection';
import AddProductButton from '../../components/AddProductButton/AddProductButton';

const mockMenu = {
  'À PARTAGER': [
    {
      id: '1',
      name: 'Boîte Viennoiseries n°1',
      price: '12€',
      description: '4 croissants, 4 chocolatines',
      image: '/menu/viennoiserie1.jpg',
    },
    {
      id: '2',
      name: 'Boîte Cookies',
      price: '16€',
      description: '4 cookies chocolat, 4 cookies kinder maxi',
      image: '/menu/cookies.jpg',
    },
  ],
  'NOS DESSERTS': [
    {
      id: '3',
      name: 'Moelleux au chocolat',
      price: '3.40€',
      description: 'Un petit plaisir à savourer au dessert',
      image: '/menu/moelleux.jpg',
    },
  ],
};

const RestaurantMenuPage = () => {
  const handleAddProduct = () => {
    console.log('Ajouter un produit');
  };

  return (
    <MobileLayout>
      <div style={{ paddingBottom: '90px' }}>
        {Object.entries(mockMenu).map(([category, items]) => (
          <MenuSection key={category} title={category} items={items} />
        ))}
      </div>

      <AddProductButton onClick={handleAddProduct} />
      <MobileNavbar />
    </MobileLayout>
  );
};

export default RestaurantMenuPage;
