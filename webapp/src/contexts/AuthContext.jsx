import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import PublicApi from "../api/PublicApi";
import AuthApi from "../api/AuthApi";
import ModelUser from "../model/ModelUser";
import HandlersLoginRequest from "../model/HandlersLoginRequest";

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
  const userRole = useMemo(() => currentUser?.id_role?.toString() || currentUser?.role || null, [currentUser]);

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

          if (!data || !data.token || !data.user) {
            reject(new Error("Format de réponse invalide"));
            return;
          }

          // Créer un ModelUser à partir des données utilisateur
          const userModel = ModelUser.constructFromObject(data.user);
          
          // Formater les données utilisateur pour assurer la cohérence en front-end
          const formattedUser = {
            ...userModel,
            // Ajouter des propriétés spécifiques au front-end pour la rétrocompatibilité
            // et s'assurer que FirstName et LastName sont correctement définis
            FirstName: userModel.first_name || "",
            LastName: userModel.last_name || "",
            Email: userModel.email || "",
            Phone: userModel.phone || "",
            DeliveryAdress: userModel.delivery_adress || "",
            FacturationAdress: userModel.facturation_adress || "",
            role: userModel.id_role?.toString() || "1",

            // S'assurer que first_name et last_name sont définis
            first_name: userModel.first_name || userModel.FirstName || "",
            last_name: userModel.last_name || userModel.LastName || ""
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
        // Utiliser seulement les champs que l'API accepte
        const opts = {
          picture: "",
          phone: userData.phone || "",
          // Utiliser les noms de champs exacts de l'API
          deliveryAdress: userData.deliveryAdress || "",
          facturationAdress: userData.facturationAdress || ""
          // Ne pas inclure sponsorship_code qui cause une erreur de colonne inconnue
        };
        
        console.log("Options d'inscription:", opts);
        
        // S'assurer que nous utilisons les noms de champs corrects pour le backend
        publicApi.publicRegisterPost(
          userData.email,
          userData.password,
          userData.firstname || userData.firstName, // Utiliser firstname ou firstName
          userData.lastname || userData.lastName,   // Utiliser lastname ou lastName
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

      // Utiliser l'API AuthApi pour vérifier l'authentification
      console.log("Vérification de l'authentification avec authMeGet");
      authApi.authMeGet((error, userData, response) => {
        if (error) {
          console.error("Erreur d'authentification:", error);
          
          // Si l'erreur est une 404, le serveur est peut-être simplement indisponible
          // Ne pas déconnecter l'utilisateur si nous avons des données locales valides
          if (error.status === 404 && storedUser) {
            console.log("Serveur /auth/me non disponible, utilisation des données locales");
            setLoading(false);
            return;
          }
          
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setToken(null);
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        console.log("Données utilisateur récupérées depuis l'API:", userData);
        
        // Formater les données utilisateur pour assurer la cohérence en front-end
        const formattedUserData = {
          ...userData,
          // Ajouter des propriétés spécifiques au front-end pour la rétrocompatibilité
          FirstName: userData.first_name || "",
          LastName: userData.last_name || "",
          Email: userData.email || "",
          Phone: userData.phone || "",
          DeliveryAdress: userData.delivery_adress || "",
          FacturationAdress: userData.facturation_adress || "",
          role: userData.id_role?.toString() || "1",
            
          // S'assurer que first_name et last_name sont définis
          first_name: userData.first_name || userData.FirstName || "",
          last_name: userData.last_name || userData.LastName || ""
        };
        
        console.log("Données utilisateur formatées après checkAuth:", formattedUserData);
        
        // Mettre à jour le localStorage avec les données fraîches
        localStorage.setItem("currentUser", JSON.stringify(formattedUserData));
        localStorage.setItem("token", token); // S'assurer que le token est également sauvegardé
        setCurrentUser(formattedUserData);
        setLoading(false);
      });
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setToken(null);
      setCurrentUser(null);
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
