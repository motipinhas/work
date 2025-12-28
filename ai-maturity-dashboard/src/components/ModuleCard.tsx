import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuleCard.css';

interface ModuleCardProps {
  title: string;
  description: string;
  icon?: string;
  route: string;
  color?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon, 
  route,
  color = '#4a90e2'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div 
      className="module-card" 
      onClick={handleClick}
      style={{ '--module-color': color } as React.CSSProperties}
    >
      <div className="module-card-content">
        {icon && (
          <div className="module-card-icon">
            {icon}
          </div>
        )}
        <h3 className="module-card-title">{title}</h3>
        <p className="module-card-description">{description}</p>
      </div>
      <div className="module-card-arrow">→</div>
    </div>
  );
};

export default ModuleCard;

