import axios from 'axios';
import UserModel from '../models/UserModel';  // Importer le modèle d'utilisateur

// URL de base de l'API
const BASE_URL = 'http://localhost:80/public';

// Crée une instance d'axios avec la configuration de base
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Fonction pour se connecter
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', new URLSearchParams({
      email: email,
      password: password,
    }));

    const user = UserModel.fromApi(response.data);  // Convertir la réponse de l'API en modèle UserModel
    return user;  // Renvoie l'instance de UserModel
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors de la connexion');
  }
};

// Fonction pour s'inscrire
export const register = async (userDetails) => {
  try {
    const formData = new URLSearchParams();
    for (const key in userDetails) {
      formData.append(key, userDetails[key]);
    }
    const response = await apiClient.post('/register', formData);

    const user = UserModel.fromApi(response.data);  // Convertir la réponse en UserModel
    return user;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors de l\'inscription');
  }
};

// Fonction pour déconnexion
export const logout = async (token) => {
  try {
    const response = await apiClient.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,  // Utilisation du token d'authentification
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors de la déconnexion');
  }
};

// Fonction pour rafraîchir le token JWT
export const refreshToken = async (token) => {
  try {
    const response = await apiClient.post('/auth/refreshToken', new URLSearchParams({
      token: token,
    }));

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors du rafraîchissement du token');
  }
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (userId, newPassword, token) => {
  try {
    const response = await apiClient.post(`/auth/resetPwd/${userId}`, new URLSearchParams({
      password: newPassword,
    }), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors de la réinitialisation du mot de passe');
  }
};

// Fonction pour gérer l'oubli de mot de passe (envoi d'un e-mail)
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/forgotPassword', new URLSearchParams({
      email: email,
    }));

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.msg || 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation');
  }
};
