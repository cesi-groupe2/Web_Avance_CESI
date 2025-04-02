import React from 'react';
import AppDesktop from './desktop/AppDesktop';
import AppMobile from './mobile/AppMobile';
import useIsMobile from './hooks/useIsMobile';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      {isMobile ? <AppMobile /> : <AppDesktop />}
    </BrowserRouter>
  );
};

export default App;
