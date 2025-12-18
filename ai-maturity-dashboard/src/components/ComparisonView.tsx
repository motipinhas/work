import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bucket } from '../types/maturity';
import { getStageColor } from '../utils/maturityUtils';
import GaugeIndicator from './GaugeIndicator';
import './ComparisonView.css';

interface ComparisonViewProps {
  buckets: Bucket[];
  selectedIds: string[];
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ buckets, selectedIds, onClose }) => {
  const navigate = useNavigate();
  const selectedBuckets = buckets.filter((b) => selectedIds.includes(b.id));

  if (selectedBuckets.length === 0) {
    return null;
  }

  const handleBucketClick = (bucketId: string) => {
    navigate(`/bucket/${bucketId}`);
  };

  return (
    <div className="comparison-view-overlay" onClick={onClose}>
      <div className="comparison-view" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-view-header">
          <h2 className="comparison-view-title">Compare Buckets</h2>
          <button className="comparison-view-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="comparison-view-content">
          <div className="comparison-grid">
            {selectedBuckets.map((bucket) => {
              const stageColor = getStageColor(bucket.stage);
              return (
                <div
                  key={bucket.id}
                  className="comparison-item"
                  onClick={() => handleBucketClick(bucket.id)}
                >
                  <h3 className="comparison-item-title">{bucket.name}</h3>
                  <div className="comparison-item-gauge">
                    <GaugeIndicator
                      stage={bucket.stage}
                      stageIndex={bucket.stageIndex}
                      size="medium"
                    />
                  </div>
                  <div className="comparison-item-details">
                    <div className="comparison-item-stage" style={{ color: stageColor }}>
                      {bucket.stage}
                    </div>
                    <div className="comparison-item-index">
                      Stage Index: {bucket.stageIndex} / 4
                    </div>
                    <div className="comparison-item-description">
                      {bucket.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;





