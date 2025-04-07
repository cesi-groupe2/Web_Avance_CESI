import React from 'react';
import styled from 'styled-components';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  flex-grow: 1;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #00a082;
  margin-bottom: 15px;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'edit' ? '#00a082' : '#ff4444'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.variant === 'edit' ? '#008c74' : '#cc0000'};
  }
`;

const MenuItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <Card>
      <Image 
        src={item.image || 'https://via.placeholder.com/300x200?text=Menu'} 
        alt={item.name} 
      />
      <Name>{item.name}</Name>
      <Description>{item.description}</Description>
      <Price>{item.price?.toFixed(2) || "0.00"} €</Price>
      <Actions>
        <ActionButton variant="edit" onClick={() => onEdit(item)}>
          <FiEdit2 /> Modifier
        </ActionButton>
        <ActionButton variant="delete" onClick={() => onDelete(item)}>
          <FiTrash2 /> Supprimer
        </ActionButton>
      </Actions>
    </Card>
  );
};

export default MenuItemCard; 