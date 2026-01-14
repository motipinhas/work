import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bucket } from '../types/maturity';
import { getStageColor } from '../utils/maturityUtils';
import GaugeIndicator from './GaugeIndicator';
import './BucketCard.css';

interface BucketCardProps {
  bucket: Bucket;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

const BucketCard: React.FC<BucketCardProps> = ({ bucket, isSelected = false, onToggleSelection }) => {
  const navigate = useNavigate();
  const stageColor = getStageColor(bucket.stage);

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the checkbox
    if ((e.target as HTMLElement).closest('.bucket-card-checkbox')) {
      return;
    }
    navigate(`/bucket/${bucket.id}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection?.();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelection?.();
  };

  return (
    <div className={`bucket-card ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {onToggleSelection && (
        <div className="bucket-card-checkbox-container">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
            className="bucket-card-checkbox"
            aria-label={`Select ${bucket.name}`}
          />
        </div>
      )}
      <div className="bucket-card-header">
        <h3 className="bucket-card-title">{bucket.name}</h3>
        <div className="bucket-card-stage" style={{ color: stageColor }}>
          {bucket.stage}
        </div>
      </div>
      <div className="bucket-card-gauge">
        <GaugeIndicator stage={bucket.stage} stageIndex={bucket.stageIndex} size="small" />
      </div>
      <div className="bucket-card-footer">
        <span className="bucket-card-link">View Details →</span>
      </div>
    </div>
  );
};

export default BucketCard;









