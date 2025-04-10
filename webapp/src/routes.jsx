import React from "react";
import { Routes, Route } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

const stripePromise = loadStripe("pk_test_51RAAUmPjM3vsbSp4V1QGOZvz4NzJu4SL05Hux584EwGL8tvxLqeIrEgND53merqpBXbQHB48wvZHfdoD222NRxtn00brQSG80h");

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
        path="/restaurant/create"
        element={
          <ProtectedRoute>
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
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
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
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/orders"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderHistory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/favorites"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Favorites />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
