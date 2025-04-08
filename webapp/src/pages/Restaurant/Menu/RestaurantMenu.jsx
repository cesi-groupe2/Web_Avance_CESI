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
    image: ''
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
      image: ''
    });
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

      const api = new MenuitemApi
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
          image: ''
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
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ajouter un élément</h3>
                  <button
                    onClick={handleCancelAdd}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmitAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom *</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image (URL)</label>
                    <input
                      type="text"
                      value={newItem.image}
                      onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelAdd}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Modifier l'élément</h3>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(editingItem);
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nom *</label>
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prix *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image (URL)</label>
                        <input
                          type="text"
                          value={editingItem.image}
                          onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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