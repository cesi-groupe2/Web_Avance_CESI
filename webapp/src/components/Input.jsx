import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.error ? '#ff4d4d' : '#e0e0e0'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  outline: none;
  width: 100%;
  
  &:focus {
    border-color: #00a082;
    box-shadow: 0 0 0 2px rgba(0, 160, 130, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const Input = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  required,
  className,
  name,
}) => {
  return (
    <InputContainer className={className}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span style={{ color: '#ff4d4d' }}>*</span>}
        </Label>
      )}
      <StyledInput
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        required={required}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  value: "",
  placeholder: "",
  error: "",
  disabled: false,
  required: false,
  className: "",
};

export default Input; 