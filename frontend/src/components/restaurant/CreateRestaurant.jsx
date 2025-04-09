import React, { useState } from 'react';
import RestaurantForm from './RestaurantForm';
import axios from 'axios';

const CreateRestaurant = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);

  const fetchCoordinates = async (address) => {
    if (!address || address.trim() === '') {
      setError('Veuillez entrer une adresse');
      return null;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        setError(null); // Réinitialiser l'erreur si la géolocalisation réussit
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        setError('Impossible de localiser cette adresse. Veuillez vérifier l\'orthographe ou ajouter plus de détails.');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées:', error);
      setError('Erreur lors de la récupération des coordonnées. Veuillez réessayer.');
      return null;
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <RestaurantForm 
        isEditing={false} 
        onAddressChange={fetchCoordinates}
        coordinates={coordinates}
      />
    </div>
  );
};

export default CreateRestaurant; 