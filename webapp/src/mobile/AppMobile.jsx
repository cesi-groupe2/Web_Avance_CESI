import React from 'react';
import { Routes, Route } from 'react-router-dom';
import mobileRoutes from '../routes/mobileRoutes';

const AppMobile = () => {
  return (
    <Routes>
      {mobileRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppMobile;
