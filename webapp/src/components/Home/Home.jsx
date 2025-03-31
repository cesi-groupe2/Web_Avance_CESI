import React from 'react';
import './Home.css';
import homePicture from '../../assets/home_picture.webp';


const Home = () => {
  return (
    <main className="home">
      <h2>Vos restos préférés livrés chez vous !</h2>
      <p>C’est easy, commandez, détendez vous, dégustez !</p>

      <a href="/restaurants" className="cta-button">Commandez maintenant</a>

      <img
        src={homePicture}
        alt="Happy delivery"
        className="hero-image"
      />
    </main>
  );
};

export default Home;
