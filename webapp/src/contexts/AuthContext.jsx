import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import PublicApi from "../api/PublicApi";
import AuthApi from "../api/AuthApi";
import ModelUser from "../model/ModelUser";
import HandlersLoginRequest from "../model/HandlersLoginRequest";
import RestaurantApi from "../api/RestaurantApi";

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
            // Assurons-nous d'avoir firstname et lastname en plus de first_name et last_name
            first_name: userModel.first_name || "",
            last_name: userModel.last_name || "",
            
            // Versions en camelCase
            firstName: userModel.first_name || "",
            lastName: userModel.last_name || "",
            
            // Versions en minuscules pour le backend
            firstname: (userModel.first_name || ""),
            lastname: (userModel.last_name || ""),
            
            // Versions en PascalCase pour la rétrocompatibilité
            FirstName: userModel.first_name || "",
            LastName: userModel.last_name || "",
            
            Email: userModel.email || "",
            email: userModel.email || "",
            Phone: userModel.phone || "",
            phone: userModel.phone || "",
            DeliveryAdress: userModel.delivery_adress || "",
            delivery_adress: userModel.delivery_adress || "",
            FacturationAdress: userModel.facturation_adress || "",
            facturation_adress: userModel.facturation_adress || "",
            role: userModel.id_role?.toString() || "1"
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
          userData.firstname,
          userData.lastname,
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
          console.log("first_name:", user.first_name);
          console.log("firstName:", user.firstName);
          console.log("firstname:", user.firstname);
          console.log("FirstName:", user.FirstName);
          setCurrentUser(user);
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur stocké:", e);
        }
      }

      // Utiliser fetch directement comme dans updateUser pour éviter les problèmes avec l'API générée
      console.log("Récupération des informations utilisateur depuis /auth/me");
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        console.log("URL utilisée pour /me:", apiUrl);
        
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        console.log("Statut de la réponse /me:", response.status);
        
        if (!response.ok) {
          // Si l'erreur est une 404, le serveur est peut-être simplement indisponible
          // Ne pas déconnecter l'utilisateur si nous avons des données locales valides
          if (response.status === 404 && storedUser) {
            console.log("Serveur /auth/me non disponible (404), utilisation des données locales");
            setLoading(false);
            return;
          }
          
          const errorText = await response.text();
          console.error("Erreur lors de la récupération du profil:", errorText);
          
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setToken(null);
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        // Traiter la réponse
        const userData = await response.json();
        console.log("Données brutes utilisateur récupérées depuis l'API:", userData);
        
        // Récupérer le restaurant de l'utilisateur si c'est un restaurateur
        if (userData.id_role === 2) {
          try {
            const restaurantApi = new RestaurantApi();
            restaurantApi.restaurantMyGet((error, restaurants) => {
              if (error) {
                console.error("Erreur lors de la récupération du restaurant:", error);
              } else if (restaurants && restaurants.length > 0) {
                userData.restaurantId = restaurants[0].id_restaurant;
              }
              
              updateUserDataAndFinish(userData);
            });
          } catch (restaurantError) {
            console.error("Erreur lors de la récupération du restaurant:", restaurantError);
            updateUserDataAndFinish(userData);
          }
        } else {
          updateUserDataAndFinish(userData);
        }
      } catch (fetchError) {
        console.error("Erreur de réseau lors de l'appel à /auth/me:", fetchError);
        // Ne pas déconnecter l'utilisateur si nous avons des données locales
        if (storedUser) {
          console.log("Erreur réseau, conservation des données locales");
          setLoading(false);
          return;
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setToken(null);
        setCurrentUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur générale d'authentification:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setToken(null);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  // Fonction auxiliaire pour formatter et mettre à jour les données utilisateur
  const updateUserDataAndFinish = (userData) => {
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
      restaurantId: userData.restaurantId,
      
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

      // Formater les noms en minuscules comme attendu par le backend
      const firstname = (userData.firstName || userData.firstname || "");
      const lastname = (userData.lastName || userData.lastname || "");
      
      console.log("Firstname et lastname formatés pour updateUser:", firstname, lastname);
      
      // Créer un objet avec les données à envoyer
      const updateData = {
        firstname: firstname,
        lastname: lastname,
        phone: userData.phone || "",
        deliveryAdress: userData.address || "",
        facturationAdress: userData.address || "", // Par défaut, même adresse pour la livraison et la facturation
      };
      
      console.log("Données formatées pour l'API:", updateData);

      // Utiliser fetch pour appeler l'API de mise à jour de profil
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log("URL utilisée pour update-profile:", apiUrl);
      
      const response = await fetch(`${apiUrl}/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
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

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Tentative de suppression du compte utilisateur");
      console.log("URL de l'API:", import.meta.env.VITE_API_URL);
      
      // URL absolue pour debug
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log("URL utilisée:", apiUrl);

      // Appel à l'API pour supprimer le compte
      const response = await fetch(`${apiUrl}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const responseData = await response.text();
      console.log("Réponse delete-account:", responseData);

      if (!response.ok) {
        throw new Error(responseData || "Échec de la suppression du compte");
      }

      // Déconnexion après suppression réussie
      logout();
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      setError(error.message || "Échec de la suppression du compte");
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
    deleteAccount,
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
