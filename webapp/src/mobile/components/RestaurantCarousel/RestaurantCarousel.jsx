import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './RestaurantCarousel.css';

const RestaurantCarousel = ({ restaurants }) => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slides: { perView: 1.5, spacing: 15 },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 3, spacing: 20 },
      },
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider">
      {restaurants.map((restaurant) => (
        <a
          key={restaurant.id}
          href={`/restaurant/${restaurant.id}`}
          className="keen-slider__slide carousel-card"
        >
          <img src={restaurant.image} alt={restaurant.nom} className="carousel-image" />
          <div className="carousel-info">
            <h3 className="carousel-title">{restaurant.nom}</h3>
            <p className="carousel-details">
              Livraison à {restaurant.prix} – {restaurant.temps}
            </p>
            <p className="carousel-rating">
              {restaurant.note} ★ ({restaurant.avis}+)
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default RestaurantCarousel;
