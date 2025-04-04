import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: var(--text-color);
  border: 2px solid #e0e0e0;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;

  &:hover {
    background-color: #008c74;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #cccccc;
  }
`;

const ButtonGroup = ({ onCancel, onSubmit, loading }) => {
  return (
    <ButtonContainer>
      <CancelButton type="button" onClick={onCancel}>
        Annuler
      </CancelButton>
      <SubmitButton type="submit" disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer le restaurant'}
      </SubmitButton>
    </ButtonContainer>
  );
};

export default ButtonGroup; 