import React from 'react';
import './StatsDashboard.css';

const StatsDashboard = () => (
  <div className="stats-dashboard">
    <div className="stat-box">
      <p className="stat-label">CA aujourd’hui</p>
      <p className="stat-value">132.40€</p>
    </div>
    <div className="stat-box">
      <p className="stat-label">Top produit</p>
      <p className="stat-value">Cookie géant</p>
    </div>
  </div>
);

export default StatsDashboard;
