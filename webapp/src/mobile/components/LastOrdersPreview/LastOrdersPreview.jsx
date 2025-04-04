import React from 'react';

const LastOrdersPreview = () => {
  const orders = [
    {
      id: '12528',
      items: ['x1 BOITE COOKIE', 'x1 MOELLEUX AU CHOCOLAT'],
      price: '19.40€',
    },
    {
      id: '12529',
      items: ['x1 MASCOTTE CHOCO', 'x1 CRÊPE NUTELLA'],
      price: '7.00€',
    }
  ];

  return (
    <div style={{ margin: '1rem' }}>
      <h3>Commandes récentes</h3>
      {orders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #f3c141',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '0.7rem'
        }}>
          <p><strong>Commande n°{order.id}</strong></p>
          <p>Articles :</p>
          <ul style={{ marginLeft: '1rem' }}>
            {order.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: '0.5rem' }}>Total : <strong>{order.price}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default LastOrdersPreview;
