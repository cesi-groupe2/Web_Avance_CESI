import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantForm from './RestaurantForm';

const EditRestaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(response.data);
        if (response.data.latitude && response.data.longitude) {
          setCoordinates({
            latitude: response.data.latitude,
            longitude: response.data.longitude
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement du restaurant');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

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

  if (loading) {
    return <div className="text-center p-6">Chargement...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <RestaurantForm 
        restaurant={restaurant} 
        isEditing={true} 
        onAddressChange={fetchCoordinates}
        coordinates={coordinates}
      />
    </div>
  );
};

export default EditRestaurant; 