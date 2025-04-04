import React from 'react';

const LiveOrdersList = () => {
  const liveOrders = [
    { id: '12532', status: 'Préparation', items: 2 },
    { id: '12531', status: 'Prête', items: 1 },
  ];

  return (
    <div style={{ margin: '1rem' }}>
      <h3>Commandes en cours</h3>
      {liveOrders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '0.8rem',
          marginBottom: '0.5rem'
        }}>
          <p><strong>Commande n°{order.id}</strong></p>
          <p>{order.items} article(s) – <span>{order.status}</span></p>
        </div>
      ))}
    </div>
  );
};

export default LiveOrdersList;
