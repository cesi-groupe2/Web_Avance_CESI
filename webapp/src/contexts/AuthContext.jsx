import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

// Créer le contexte
const AuthContext = createContext();

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      // Appel à l'API pour se connecter
      const response = await fetch(`${import.meta.env.VITE_API_URL}/public/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la connexion");
      }

      const data = await response.json();
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      console.log("Données envoyées pour l'inscription:", userData);
      
      // Extraire seulement email et mot de passe pour correspondre avec le backend
      const simplifiedData = {
        email: userData.email,
        password: userData.password
      };
      
      // Appel à l'API pour s'inscrire
      const response = await fetch(`${import.meta.env.VITE_API_URL}/public/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simplifiedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'inscription");
      }

      return response;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  // Vérifier l'authenticité du token et récupérer les informations utilisateur
  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Appel à l'API pour vérifier le token et récupérer les informations utilisateur
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token invalide");
      }

      const userData = await response.json();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      localStorage.removeItem("token");
      setToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier l'authenticité au chargement de l'application
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
