import React from "react";
import home_picture from "../../assets/home_picture.webp";
import logo from "../../assets/logo.png";
import "./Home.css";

export const WebPageDAccueil = () => {
  return (
    <div className="web-page-d-accueil">
      <div className="div">
        <header className="header">
          <div className="overlap-group">
            <div className="connexion-section">
              <button className="line"></button>

              <div className="bouton-connexion">
                <div className="text-wrapper">Connexion</div>
              </div>

              <div className="div-wrapper">
                <div className="text-wrapper-2">Inscription</div>
              </div>
            </div>

            <img className="logo" alt="Logo" src={logo} />
          </div>
        </header>

        <div className="frame">
          <div className="overlap">
            <img className="DALLE" alt="Dalle" src={home_picture} />

            <div className="bouton-default-green">
              <div className="text-wrapper-3">Commandez maintenant</div>
            </div>
          </div>

          <p className="vos-restos-pr-f-r-s">
            Vos restos préférés livrés chez vous ! <br />
            <br />
            C’est easy, commandez, détendez vous, dégustez !
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebPageDAccueil;
