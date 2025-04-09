import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();
  
  // Attendre que la vérification d'authentification soit terminée
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Chargement...
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page spécifiée ou de connexion par défaut
  if (!isAuthenticated) {
    console.log(`Redirection vers ${redirectTo || "/login"} : non authentifié`);
    return <Navigate to={redirectTo || "/login"} state={{ from: location.pathname }} replace />;
  }
  
  // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle, rediriger vers la page d'accueil
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Redirection vers / : rôle requis ${requiredRole}, rôle utilisateur ${userRole}`);
    return <Navigate to="/" replace />;
  }
  
  // Sinon, afficher le contenu protégé
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  redirectTo: PropTypes.string
};

export default ProtectedRoute; 