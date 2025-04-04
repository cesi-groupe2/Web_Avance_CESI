import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import PublicApi from "../api/PublicApi";
import AuthApi from "../api/AuthApi";

// Initialiser les APIs
const publicApi = new PublicApi();
const authApi = new AuthApi();

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
  const [error, setError] = useState(null);

  // Propriétés dérivées
  const isAuthenticated = useMemo(() => !!token && !!currentUser, [token, currentUser]);
  const userRole = useMemo(() => currentUser?.role || currentUser?.IDRole?.toString() || null, [currentUser]);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      return new Promise((resolve, reject) => {
        publicApi.publicLoginPost(email, password, (error, data, response) => {
          if (error) {
            console.error("Erreur de connexion:", error);
            reject(error);
            return;
          }

          console.log("Réponse de connexion:", data);

          // Formater les données utilisateur pour assurer la cohérence
          const formattedUser = {
            ...data.user,
            // Assurer une structure uniforme quelle que soit la réponse de l'API
            FirstName: data.user.firstname || data.user.first_name || data.user.FirstName || "",
            LastName: data.user.lastname || data.user.last_name || data.user.LastName || "",
            Email: data.user.email || data.user.Email || "",
            Phone: data.user.phone || data.user.Phone || "",
            DeliveryAdress: data.user.deliveryAdress || data.user.DeliveryAdress || data.user.delivery_adress || "",
            FacturationAdress: data.user.facturationAdress || data.user.FacturationAdress || data.user.facturation_adress || "",
            role: data.user.id_role || data.user.IDRole || data.user.role || "1",
          };
          
          console.log("Données utilisateur formatées après login:", formattedUser);
          
          // Stocker le token et les informations utilisateur
          localStorage.setItem("token", data.token);
          localStorage.setItem("currentUser", JSON.stringify(formattedUser));
          
          setToken(data.token);
          setCurrentUser(formattedUser);
          
          resolve({ ...data, user: formattedUser });
        });
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      console.log("Données envoyées pour l'inscription:", userData);
      
      return new Promise((resolve, reject) => {
        // Préparer les options pour les paramètres optionnels
        const opts = {
          picture: "",
          phone: userData.phone || "",
          deliveryAdress: userData.deliveryAddress || "",
          facturationAdress: userData.facturationAddress || ""
        };
        
        publicApi.publicRegisterPost(
          userData.email,
          userData.password,
          userData.firstName,
          userData.lastName,
          userData.role || "1",
          opts,
          (error, data, response) => {
            if (error) {
              console.error("Erreur d'inscription:", error);
              reject(error);
              return;
            }
            
            console.log("Réponse d'inscription:", data);
            resolve({ success: true, message: "Inscription réussie" });
          }
        );
      });
    } catch (error) {
      console.error("Erreur d'inscription détaillée:", error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // On peut appeler l'API de déconnexion si nécessaire
    if (token) {
      authApi.authLogoutPost((error, data, response) => {
        if (error) {
          console.error("Erreur lors de la déconnexion:", error);
        } else {
          console.log("Déconnexion réussie:", data);
        }
      });
    }
    
    // Nettoyer les informations d'authentification locales
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken(null);
    setCurrentUser(null);
  };

  // Vérifier l'authenticité du token et récupérer les informations utilisateur
  const checkAuth = async () => {
    console.log("Vérification de l'authentification avec token:", token);
    
    if (!token) {
      // Supprimer toutes les données d'authentification au cas où
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      // Essayer d'abord de récupérer l'utilisateur du localStorage pour une expérience rapide
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log("Utilisateur récupéré du localStorage:", user);
          setCurrentUser(user);
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur stocké:", e);
        }
      }

      // L'AuthApi ne semble pas avoir de méthode pour vérifier le token
      // Nous devons utiliser la méthode fetch directe pour accéder à /auth/me
      // Cette partie restera avec fetch jusqu'à ce qu'un endpoint dans l'API soit disponible
      console.log("Envoi de requête à /auth/me avec token:", token);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Réponse de /auth/me:", response.status);
      
      if (!response.ok) {
        throw new Error(`Token invalide (status: ${response.status})`);
      }

      const userData = await response.json();
      console.log("Données utilisateur récupérées depuis l'API:", userData);
      
      // Vérifier si userData a les propriétés attendues et corriger la structure si nécessaire
      const formattedUserData = {
        ...userData,
        // Assurer une structure uniforme quelle que soit la réponse de l'API
        FirstName: userData.firstname || userData.first_name || userData.FirstName || "",
        LastName: userData.lastname || userData.last_name || userData.LastName || "",
        Email: userData.email || userData.Email || "",
        Phone: userData.phone || userData.Phone || "",
        DeliveryAdress: userData.deliveryAdress || userData.DeliveryAdress || userData.delivery_adress || "",
        FacturationAdress: userData.facturationAdress || userData.FacturationAdress || userData.facturation_adress || "",
        role: userData.id_role || userData.IDRole || userData.role || "1",
      };
      
      console.log("Données utilisateur formatées après checkAuth:", formattedUserData);
      
      // Mettre à jour le localStorage avec les données fraîches
      localStorage.setItem("currentUser", JSON.stringify(formattedUserData));
      localStorage.setItem("token", token); // S'assurer que le token est également sauvegardé
      setCurrentUser(formattedUserData);
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier l'authenticité au chargement de l'application
  useEffect(() => {
    checkAuth();
  }, [token]); // Dépendance sur token pour recharger les données si le token change

  const updateUser = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Mise à jour du profil avec:", userData);

      // Comme l'API ne semble pas avoir de méthode pour mettre à jour le profil,
      // on utilise fetch directement
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstname: userData.firstName,
          lastname: userData.lastName,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          postalCode: userData.postalCode,
          additionalInfo: userData.additionalInfo
        })
      });

      const responseText = await response.text();
      console.log("Réponse update-profile:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Échec de la mise à jour du profil");
      }

      // Mettre à jour les données utilisateur dans le contexte
      await checkAuth();
      return { success: true };
    } catch (error) {
      console.error("Erreur update-profile:", error);
      setError(error.message || "Échec de la mise à jour du profil");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    isAuthenticated,
    userRole
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
