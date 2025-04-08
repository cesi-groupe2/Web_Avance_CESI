import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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

const Button = ({ children, variant, type, onClick, disabled, fullWidth, className }) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <StyledButton
      variant={variant}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  variant: "primary",
  type: "button",
  disabled: false,
  fullWidth: false,
  className: ""
};

export default Button; 