import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuleCard.css';

interface ModuleCardProps {
  title: string;
  description: string;
  icon?: string;
  route: string;
  color?: string;
  score?: number;
  statusLabel?: string;
  statusColor?: string;
  statusMeta?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  icon, 
  route,
  color = '#4a90e2',
  score,
  statusLabel,
  statusColor,
  statusMeta
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
        {score !== undefined && (
          <div className="module-card-score">
            <span className="module-card-score-label">Overall Score:</span>
            <span className="module-card-score-value" style={{ color: color }}>
              {score}%
            </span>
          </div>
        )}
        {statusLabel && (
          <div
            className="module-card-status"
            style={{ '--status-color': statusColor ?? color } as React.CSSProperties}
          >
            <span className="module-card-status-label">Overall Status:</span>
            <div className="module-card-status-right">
              <span className="module-card-status-badge">{statusLabel}</span>
              {statusMeta && <span className="module-card-status-meta">{statusMeta}</span>}
            </div>
          </div>
        )}
        <p className="module-card-description">{description}</p>
      </div>
      <div className="module-card-arrow">→</div>
    </div>
  );
};

export default ModuleCard;

