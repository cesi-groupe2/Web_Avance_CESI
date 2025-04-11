import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Banner = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`;

const MessageBanner = ({ type, children }) => {
  return (
    <Banner type={type}>
      {type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
      {children}
    </Banner>
  );
};

export default MessageBanner; 