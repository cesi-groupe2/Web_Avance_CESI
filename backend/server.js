require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./database/connexion");
const {apiRoads} = require("./roads/roads");

const app = express();

function startServer() {
  // Middleware
  app.use(express.json());
  app.use(cors());

  // Connexion à MongoDB
  connectToMongoDB();

  // Routes API
  apiRoads(app);

  // Lancer le serveur
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Serveur backend démarré sur le port ${PORT}`)
  );
}

startServer();
