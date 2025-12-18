import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bucket } from '../types/maturity';
import { getStageColor, getRecommendationsForStage } from '../utils/maturityUtils';
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
  const recommendations = bucket.recommendations || getRecommendationsForStage(bucket.stage, bucket.stageIndex);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#666';
    }
  };

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
        {recommendations && recommendations.length > 0 && (
          <div className="bucket-detail-recommendations">
            <h2>Recommendations & Next Steps</h2>
            <div className="recommendations-list">
              {recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-item">
                  <div className="recommendation-header">
                    <h3 className="recommendation-title">{rec.title}</h3>
                    <span
                      className="recommendation-priority"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="recommendation-description">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketDetail;

