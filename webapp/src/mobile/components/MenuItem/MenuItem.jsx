import React from 'react';
import './MenuItem.css';

const MenuItem = ({ name, price, description, image, onAdd }) => {
  return (
    <div className="menu-item">
      <div className="menu-info">
        <p className="menu-name">{name}</p>
        <p className="menu-price">{price}</p>
        <p className="menu-description">{description}</p>
      </div>
      <div className="menu-image-wrapper">
        <img src={image} alt={name} className="menu-image" />
        <button className="add-button" onClick={onAdd}>+</button>
      </div>
    </div>
  );
};

export default MenuItem;
