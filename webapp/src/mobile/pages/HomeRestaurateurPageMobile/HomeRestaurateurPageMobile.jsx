import React from 'react';
import MobileLayout from '../../components/MobileLayout/MobileLayout';
import MobileNavbar from '../../components/MobileNavbar/MobileNavbar';

import StatsDashboard from '../../components/StatsDashboard/StatsDashboard';
import LiveOrdersList from '../../components/LiveOrdersList/LiveOrdersList';
import LastOrdersPreview from '../../components/LastOrdersPreview/LastOrdersPreview';
import ShortcutsPanel from '../../components/ShortcutsPanel/ShortcutsPanel';

const HomeRestaurateurPageMobile = () => (
  <MobileLayout>
  <div style={{ textAlign: 'center', margin: '1rem 0' }}>
    <h2 style={{ marginTop: '1rem' }}>Vos commandes</h2>
  </div>
    <StatsDashboard />
    <LiveOrdersList />
    <LastOrdersPreview />
    <ShortcutsPanel />
    <MobileNavbar />
  </MobileLayout>
);

export default HomeRestaurateurPageMobile;
