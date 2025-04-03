import React from 'react';
import { Routes, Route } from 'react-router-dom';
import desktopRoutes from '../routes/desktopRoutes';

const AppDesktop = () => {
  return (
    <Routes>
      {desktopRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppDesktop;
