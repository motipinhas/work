import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bucket } from '../types/maturity';
import { getStageColor } from '../utils/maturityUtils';
import GaugeIndicator from './GaugeIndicator';
import './BucketCard.css';

interface BucketCardProps {
  bucket: Bucket;
}

const BucketCard: React.FC<BucketCardProps> = ({ bucket }) => {
  const navigate = useNavigate();
  const stageColor = getStageColor(bucket.stage);

  const handleClick = () => {
    navigate(`/bucket/${bucket.id}`);
  };

  return (
    <div className="bucket-card" onClick={handleClick}>
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









