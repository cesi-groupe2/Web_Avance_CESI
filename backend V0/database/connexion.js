// imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Connects to MongoDB using the connection string provided in the environment variable `MONGO_URI`.
 * 
 * @returns {boolean} - Returns `true` if the connection is successful, otherwise `false`.
 * 
 * @example
 * const isConnected = connectToMongoDB();
 * if (isConnected) {
 *   console.log('Connection to MongoDB was successful.');
 * } else {
 *   console.log('Failed to connect to MongoDB.');
 * }
 */
function connectToMongoDB() {
  let isConnected = false;
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connecté");
      isConnected = true;
    })
    .catch((err) => {
      console.error("Erreur de connexion MongoDB:", err);
    });
    return isConnected;
}


/**
 * Checks the health of the MongoDB connection.
 *
 * @returns {number} The ready state of the MongoDB connection.
 *                   0: disconnected
 *                   1: connected
 *                   2: connecting
export function healthCheck() {
 */
function healthCheck() {
    return mongoose.connection.readyState;
}

module.exports = { connectToMongoDB, healthCheck };
