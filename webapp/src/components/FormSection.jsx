import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
  width: 100%;

  @media (max-width: 400px) {
    padding: 1rem;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 400px) {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  svg {
    color: var(--primary-color);
    font-size: 1.2em;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormSection = ({ title, icon, children, grid = false }) => {
  return (
    <SectionContainer>
      <SectionTitle>
        {icon}
        {title}
      </SectionTitle>
      {grid ? <FormGrid>{children}</FormGrid> : children}
    </SectionContainer>
  );
};

export default FormSection; 