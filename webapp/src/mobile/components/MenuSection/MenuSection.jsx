import React from 'react';
import MenuItemEditable from '../MenuItemEditable/MenuItemEditable';

const MenuSection = ({ title, items }) => (
  <div className="menu-section">
    <div className="section-header">
      <h3>{title}</h3>
    </div>

    {items.map((item) => (
      <MenuItemEditable key={item.id} item={item} />
    ))}
  </div>
);

export default MenuSection;
