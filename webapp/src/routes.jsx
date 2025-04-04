import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import RestaurantList from "./pages/Restaurant/List/RestaurantList";
import RestaurantDetails from "./pages/Restaurant/Details/RestaurantDetails";
import Checkout from "./pages/Order/Checkout/Checkout";
import Tracking from "./pages/Order/Tracking/Tracking";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      
      <Route
        path="/order/checkout"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/order/tracking/:orderNumber"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Tracking />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
