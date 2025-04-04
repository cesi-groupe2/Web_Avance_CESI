import React from 'react';
import styled from 'styled-components';

const HoursGrid = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
`;

const DayRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  background-color: ${props => props.$isEvenRow ? '#f9f9f9' : 'white'};
  border-radius: 8px;
  transition: all 0.3s ease;

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const DayLabel = styled.span`
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  @media (max-width: 400px) {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 160, 130, 0.1);
    outline: none;
  }
`;

const TimeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 400px) {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TimeLabel = styled.span`
  font-size: 0.8rem;
  color: var(--gray-medium);
  display: none;

  @media (max-width: 400px) {
    display: inline;
    min-width: 60px;
  }
`;

const daysOfWeek = [
  { id: 0, name: 'Dimanche' },
  { id: 1, name: 'Lundi' },
  { id: 2, name: 'Mardi' },
  { id: 3, name: 'Mercredi' },
  { id: 4, name: 'Jeudi' },
  { id: 5, name: 'Vendredi' },
  { id: 6, name: 'Samedi' }
];

const OpeningHours = ({ openingHours, onChange }) => {
  return (
    <HoursGrid>
      {daysOfWeek.map((day, index) => (
        <DayRow key={day.id} $isEvenRow={index % 2 === 0}>
          <DayLabel>{day.name}</DayLabel>
          <TimeInputContainer>
            <TimeLabel>Ouverture:</TimeLabel>
            <TimeInput
              type="time"
              value={openingHours.find(h => h.day_of_week === day.id)?.opening_time || ''}
              onChange={(e) => onChange(day.id, 'opening_time', e.target.value)}
              placeholder="Ouverture"
            />
          </TimeInputContainer>
          <TimeInputContainer>
            <TimeLabel>Fermeture:</TimeLabel>
            <TimeInput
              type="time"
              value={openingHours.find(h => h.day_of_week === day.id)?.closing_time || ''}
              onChange={(e) => onChange(day.id, 'closing_time', e.target.value)}
              placeholder="Fermeture"
            />
          </TimeInputContainer>
        </DayRow>
      ))}
    </HoursGrid>
  );
};

export default OpeningHours; 