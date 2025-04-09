import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
  font-size: 16px;
  text-decoration: none;
  
  /* Default - Green */
  background-color: ${props => props.variant === 'primary' ? '#00a082' : 
    props.variant === 'secondary' ? '#ffffff' : 
    props.variant === 'outline' ? 'transparent' : 
    props.variant === 'danger' ? '#ff4d4d' : '#00a082'};
  
  color: ${props => props.variant === 'primary' ? '#ffffff' : 
    props.variant === 'secondary' ? '#00a082' : 
    props.variant === 'outline' ? '#00a082' : 
    props.variant === 'danger' ? '#ffffff' : '#ffffff'};
  
  border: ${props => props.variant === 'outline' || props.variant === 'secondary' ? '2px solid #00a082' : 'none'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#008c70' : 
      props.variant === 'secondary' ? '#f0f0f0' : 
      props.variant === 'outline' ? '#e6f7f4' : 
      props.variant === 'danger' ? '#e60000' : '#008c70'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.fullWidth && 'width: 100%;'}
`;

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  disableApiCall = true,
  as,
  to
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
      as={as}
      to={to}
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