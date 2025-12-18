import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bucket } from '../types/maturity';
import { getStageColor } from '../utils/maturityUtils';
import GaugeIndicator from './GaugeIndicator';
import './BucketDetail.css';

interface BucketDetailProps {
  buckets: Bucket[];
}

const BucketDetail: React.FC<BucketDetailProps> = ({ buckets }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bucket = buckets.find((b) => b.id === id);

  if (!bucket) {
    return (
      <div className="bucket-detail">
        <div className="bucket-detail-error">
          <h2>Bucket not found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Overview
          </button>
        </div>
      </div>
    );
  }

  const stageColor = getStageColor(bucket.stage);

  return (
    <div className="bucket-detail">
      <div className="bucket-detail-header-logo">
        <a 
          href="https://www.amdocs.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="amdocs-logo"
        >
          <img 
            src="https://www.amdocs.com/sites/default/files/amdocs-logo.svg" 
            alt="Amdocs" 
            className="amdocs-logo-img"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/amdocs-logo.svg';
            }}
          />
        </a>
      </div>
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Overview
      </button>
      <div className="bucket-detail-content">
        <div className="bucket-detail-header">
          <h1 className="bucket-detail-title">{bucket.name}</h1>
          <div className="bucket-detail-stage" style={{ color: stageColor }}>
            {bucket.stage}
          </div>
        </div>
        <div className="bucket-detail-gauge">
          <GaugeIndicator stage={bucket.stage} stageIndex={bucket.stageIndex} size="large" />
        </div>
        <div className="bucket-detail-description">
          <h2>Description</h2>
          <p>{bucket.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BucketDetail;

