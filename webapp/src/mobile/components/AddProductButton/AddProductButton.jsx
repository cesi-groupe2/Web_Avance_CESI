import React from 'react';
import { IoAdd } from 'react-icons/io5';
import './AddProductButton.css';

const AddProductButton = ({ onClick }) => (
  <button className="add-product-button" onClick={onClick}>
    <IoAdd size={24} color="#fff" />
  </button>
);

export default AddProductButton;
