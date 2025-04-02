import { createContext, useContext, useState } from 'react';

// Valeurs possibles : 'client', 'restaurateur', 'livreur', 'developpeur'
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('client'); // valeur par défaut

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
