import React from 'react';
import './MenuCard.css';

const MenuCard = ({ title, onClick }) => {
  return (
    <div className="menu-card" onClick={onClick}>
      {title}
    </div>
  );
};

export default MenuCard;
