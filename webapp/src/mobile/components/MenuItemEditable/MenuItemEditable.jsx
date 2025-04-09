import React from 'react';
import './MenuItemEditable.css';

const MenuItemEditable = ({ item }) => {
  return (
    <div className="menu-item-editable">
      <div className="menu-texts">
        <p className="menu-name">{item.name}</p>
        <p className="menu-price">{item.price}</p>
        <p className="menu-desc">{item.description}</p>
      </div>
      <img src={item.image} alt={item.name} className="menu-thumb" />
    </div>
  );
};

export default MenuItemEditable;
