import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import RestaurantApi from '../../../api/RestaurantApi';
import Header from '../../../components/Header';
import MenuItemCard from '../../../components/MenuItemCard/MenuItemCard';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import MenuitemApi from '../../../api/MenuitemApi';

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenuItems = async () => {
      try {
        if (!currentUser) {
          setError('Utilisateur non connecté');
          setLoading(false);
          return;
        }

        console.log('Utilisateur actuel:', currentUser);

        // Récupérer d'abord l'ID du restaurant
        const api = new RestaurantApi();
        api.restaurantMyGet((error, restaurantData) => {
          if (error) {
            console.error('Erreur lors de la récupération du restaurant:', error);
            setError(`Erreur lors de la récupération du restaurant: ${error.message || 'Erreur inconnue'}`);
            setLoading(false);
            return;
          }

          if (!restaurantData || !Array.isArray(restaurantData) || restaurantData.length === 0 || !restaurantData[0].id_restaurant) {
            setError('Aucun restaurant associé à cet utilisateur');
            setLoading(false);
            return;
          }

          const restaurant = restaurantData[0];
          console.log('Données du restaurant:', restaurant);
          setRestaurantId(restaurant.id_restaurant);

          // Récupérer les éléments du menu avec l'ID du restaurant
          api.restaurantRestaurantIdMenuitemsGet(restaurant.id_restaurant, (error, menuData) => {
            if (error) {
              console.error('Erreur lors de la récupération des éléments du menu:', error);
              setError(`Erreur lors de la récupération des éléments du menu: ${error.message || 'Erreur inconnue'}`);
              setLoading(false);
              return;
            }

            console.log('Données du menu:', menuData);
            setMenuItems(menuData || []);
            setLoading(false);
          });
          console.log('Menu items après ajout:', menuItems);
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError(`Une erreur est survenue: ${err.message || 'Erreur inconnue'}`);
        setLoading(false);
      }
    };

    fetchRestaurantAndMenuItems();
  }, [currentUser]);

  const handleAddMenuItem = () => {
    if (!restaurantId) {
      setError('Aucun restaurant associé à cet utilisateur');
      return;
    }
    setShowAddForm(true);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewItem({
      name: '',
      description: '',
      price: '',
      image: null
    });
  };

  const handleImageChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingItem(prev => ({
            ...prev,
            image: reader.result
          }));
        } else {
          setNewItem(prev => ({
            ...prev,
            image: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        image: newItem.image
      };

      console.log('Envoi des données:', itemData);

      const api = new MenuitemApi();
      api.restaurantRestaurantIdMenuitemsNewPost(restaurantId, itemData, (error, response) => {
        if (error) {
          console.error('Erreur lors de l\'ajout:', error);
          setError(`Erreur lors de l'ajout: ${error.message || 'Erreur inconnue'}`);
          return;
        } 
        
        console.log('Réponse de l\'API:', response);
        setMenuItems(prev => [...prev, response]);
        setShowAddForm(false);
        setNewItem({
          name: '',
          description: '',
          price: '',
          image: null
        });
      });
    } catch (err) {
      console.error('Erreur:', err);
      setError(`Une erreur est survenue lors de l'ajout: ${err.message || 'Erreur inconnue'}`);
    }
  };

  const handleEditMenuItem = (item) => {
    if (!restaurantId) {
      setError('Aucun restaurant associé à cet utilisateur');
      return;
    }
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = async (updatedItem) => {
    try {
      const api = new MenuitemApi();
      api.restaurantRestaurantIdMenuitemsMenuItemIdPut(restaurantId, updatedItem.id_menu_item, updatedItem, (error, response) => {
        if (error) {
          console.error('Erreur lors de la modification:', error);
          setError(`Erreur lors de la modification: ${error.message || 'Erreur inconnue'}`);
          return;
        }
        
        setMenuItems(prev => prev.map(item => 
          item.id_menu_item === updatedItem.id_menu_item ? response : item
        ));
        setEditingItem(null);
      });
    } catch (err) {
      console.error('Erreur:', err);
      setError(`Une erreur est survenue lors de la modification: ${err.message || 'Erreur inconnue'}`);
    }
  };

  const handleDeleteMenuItem = async (item) => {
    if (!restaurantId) {
      setError('Aucun restaurant associé à cet utilisateur');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément du menu ?')) {
      try {
        const api = new MenuitemApi();
        api.restaurantRestaurantIdMenuitemsMenuItemIdDelete(restaurantId, item.id_menu_item, (error) => {
          if (error) {
            console.error('Erreur lors de la suppression:', error);
            setError(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`);
            return;
          }
          setMenuItems(prev => prev.filter(menuItem => menuItem.id_menu_item !== item.id_menu_item));
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError(`Une erreur est survenue lors de la suppression: ${err.message || 'Erreur inconnue'}`);
      }
    }
  };

  const getImagePreview = (imageData) => {
    if (!imageData) return null;
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:image')) {
        return imageData;
      }
      return null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Chargement...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Erreur</h1>
          <p className="text-red-600 mb-4">{error}</p>
          {error === 'Aucun restaurant associé à cet utilisateur' && (
            <button
              onClick={() => navigate('/restaurant/create')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Créer un restaurant
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Gestion du menu</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Éléments du menu</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte d'ajout ou formulaire */}
            {showAddForm ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Ajouter un nouvel élément</h2>
                <form onSubmit={handleSubmitAdd}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Prix
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {newItem.image && (
                      <img 
                        src={getImagePreview(newItem.image)} 
                        alt="Aperçu" 
                        className="mt-2 w-32 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelAdd}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div 
                onClick={handleAddMenuItem}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors duration-200"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  <FiPlus className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Ajouter un élément</p>
              </div>
            )}

            {/* Liste des éléments existants */}
            {menuItems.map((item) => (
              <div key={item.id_menu_item}>
                {editingItem?.id_menu_item === item.id_menu_item ? (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Modifier l'élément</h2>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(editingItem);
                    }}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Description
                        </label>
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Prix
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, true)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {editingItem.image && (
                          <img 
                            src={getImagePreview(editingItem.image)} 
                            alt="Aperçu" 
                            className="mt-2 w-32 h-32 object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <MenuItemCard
                    item={item}
                    onEdit={handleEditMenuItem}
                    onDelete={handleDeleteMenuItem}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu; 