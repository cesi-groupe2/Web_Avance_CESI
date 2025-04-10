import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import RestaurantList from "./pages/Restaurant/List/RestaurantList";
import RestaurantDetails from "./pages/Restaurant/Details/RestaurantDetails";
import CreateRestaurant from "./pages/Restaurant/Create/CreateRestaurant";
import RestaurantMenu from "./pages/Restaurant/Menu/RestaurantMenu";
import Checkout from "./pages/Order/Checkout/Checkout";
import Tracking from "./pages/Order/Tracking/Tracking";
import Profile from "./pages/User/Profile/Profile";
import OrderHistory from "./pages/User/Orders/OrderHistory";
import Cart from "./pages/Order/Cart/Cart";
import Favorites from "./pages/User/Favorites/Favorites";
import Dashboard from "./pages/Restaurant/Dashboard/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute redirectTo="/login">
            <RestaurantList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:id"
        element={
          <ProtectedRoute redirectTo="/login">
            <RestaurantDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/create"
        element={
          <ProtectedRoute allowedRoles={['restaurant_owner']}>
            <CreateRestaurant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/menu"
        element={
          <ProtectedRoute requiredRole="2">
            <RestaurantMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/menuitems"
        element={
          <ProtectedRoute requiredRole="2">
            <RestaurantMenu />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/order/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/order/tracking/:orderId"
        element={
          <ProtectedRoute>
            <Tracking />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/restaurant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['restaurant_owner']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 