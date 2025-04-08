import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledButton = styled.button`
  /* Add your styles here */
`;

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  disableApiCall = true // Désactive l'appel API par défaut
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    if (disabled || isLoading) return;

    if (onClick) {
      if (typeof onClick === 'function') {
        onClick(e);
      } else if (typeof onClick === 'string') {
        navigate(onClick);
      }
    }

    // Si disableApiCall est true, on ne fait pas l'appel API
    if (disableApiCall) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/restaurant', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des restaurants');
      }

      const data = await response.json();
      console.log('Restaurants récupérés:', data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledButton
      type={type}
      onClick={handleClick}
      className={`${className} ${isLoading ? 'loading' : ''}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button; 