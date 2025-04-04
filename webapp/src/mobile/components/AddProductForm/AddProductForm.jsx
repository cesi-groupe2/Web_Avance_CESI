import React, { useState } from 'react';
import './AddProductForm.css';

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données du formulaire :', form);
    // Appel API ici 🔥
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Ajouter un article</h2>

      <label>Nom de l'article</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>Photographie de l'article</label>
      <div className="image-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="preview" className="image-preview" />
        ) : (
          <div className="image-placeholder">📷</div>
        )}
      </div>

      <label>Description de l'article</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        required
      />

      <label>Catégorie</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner une catégorie</option>
        <option value="A partager">À partager</option>
        <option value="Desserts">Desserts</option>
        <option value="Boissons">Boissons</option>
      </select>

      <label>Prix (€)</label>
      <input
        type="number"
        name="price"
        min="0.01"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        required
      />

      <button type="submit" className="submit-btn">
        Ajouter
      </button>
    </form>
  );
};

export default AddProductForm;
