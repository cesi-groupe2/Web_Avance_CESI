import React from 'react';
import './RestaurantCarousel.css';

const RestaurantCarousel = ({ title, restaurants }) => {
  return (
    <div className="carousel-container">
      <h3 className="carousel-title">{title}</h3>
      <div className="carousel-scroll">
        {restaurants.map((resto) => (
          <div key={resto.id} className="carousel-card">
            <img src={resto.image} alt={resto.nom} />
            <p className="resto-title">{resto.nom}</p>
            <p className="resto-sub">
              livraison à {resto.prix} – {resto.temps}
              <br />
              {resto.note} ★ ({resto.avis}+)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCarousel;
