import React from 'react';

const ShortcutsPanel = () => (
  <div style={{ margin: '1rem' }}>
    <h3>Actions rapides</h3>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {[
        { label: 'Ajouter un article', link: '#' },
        { label: 'Gérer le stock', link: '#' },
        { label: 'Horaires', link: '#' },
        { label: 'Promotions', link: '#' }
      ].map((btn, i) => (
        <a
          key={i}
          href={btn.link}
          style={{
            background: '#f3c141',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {btn.label}
        </a>
      ))}
    </div>
  </div>
);

export default ShortcutsPanel;
