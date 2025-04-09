import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressSection from './AddressSection';
import ContactSection from './ContactSection';
import RestaurantDetailsSection from './RestaurantDetailsSection';

const RestaurantForm = ({ restaurant, isEditing, onAddressChange, coordinates, error: coordinatesError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    cuisine: '',
    priceRange: '',
    imageUrl: '',
    latitude: '',
    longitude: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && restaurant) {
      setFormData(restaurant);
    }
  }, [isEditing, restaurant]);

  useEffect(() => {
    if (coordinates) {
      setFormData(prev => ({
        ...prev,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      }));
    }
  }, [coordinates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'address' && onAddressChange) {
      onAddressChange(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        latitude: formData.latitude || coordinates?.latitude,
        longitude: formData.longitude || coordinates?.longitude
      };

      if (isEditing) {
        await axios.put(`/api/restaurants/${restaurant.id}`, dataToSubmit);
      } else {
        await axios.post('/api/restaurants', dataToSubmit);
      }
      navigate('/restaurants');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError('Une erreur est survenue lors de la soumission du formulaire');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Modifier le restaurant' : 'Créer un nouveau restaurant'}
      </h2>
      {(error || coordinatesError) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || coordinatesError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <RestaurantDetailsSection 
          formData={formData} 
          handleChange={handleChange} 
        />
        
        <AddressSection 
          formData={formData} 
          handleChange={handleChange}
          coordinates={coordinates}
          error={coordinatesError}
        />
        
        <ContactSection 
          formData={formData} 
          handleChange={handleChange} 
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/restaurants')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm; 