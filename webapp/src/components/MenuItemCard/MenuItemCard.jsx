import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const getImageUrl = (item) => {
  console.log('Item reçu:', item); // Debug
  console.log('Type de l\'image:', typeof item?.image); // Debug
  console.log('Image:', item?.image); // Debug

  try {
    // Si l'image est une chaîne non vide
    if (typeof item?.image === 'string' && item.image.length > 0) {
      // Si l'image est déjà en format base64 avec préfixe
      if (item.image.startsWith('data:image')) {
        console.log('Image est déjà en format base64 avec préfixe'); // Debug
        return item.image;
      }
      
      // Si l'image est en base64 sans préfixe
      if (item.image.length > 100) {
        console.log('Image est en format base64 sans préfixe'); // Debug
        return `data:image/jpeg;base64,${item.image}`;
      }

      // Si c'est une URL
      if (item.image.startsWith('http')) {
        console.log('Image est une URL'); // Debug
        return item.image;
      }
    }
    
    // Dans tous les autres cas, utiliser le placeholder
    console.log('Format d\'image non reconnu, utilisation du placeholder'); // Debug
    return 'https://placehold.co/300x200?text=Image+non+disponible';
  } catch (error) {
    console.error('Erreur lors du chargement de l\'image:', error);
    return 'https://placehold.co/300x200?text=Image+non+disponible';
  }
};

const MenuItemCard = ({ item, onEdit, onDelete }) => {
  console.log('Item complet:', item); // Debug
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <img 
        src={getImageUrl(item)} 
        alt={item?.name || 'Image du plat'}
        className="w-full h-40 object-cover rounded-md mb-2"
        onError={(e) => {
          console.log('Erreur de chargement de l\'image:', e.target.src); // Debug
          e.target.src = 'https://placehold.co/300x200?text=Image+non+disponible';
        }}
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{item?.name || 'Nom non disponible'}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item?.description || 'Description non disponible'}</p>
      <div className="flex justify-between items-center">
        <span className="text-green-600 font-semibold">{item?.price?.toFixed(2) || "0.00"} €</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            <FiEdit2 size={14} /> Modifier
          </button>
          <button
            onClick={() => onDelete(item)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            <FiTrash2 size={14} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard; 