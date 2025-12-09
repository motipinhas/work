import React from 'react';
import { Bucket } from '../types/maturity';
import OverallScore from './OverallScore';
import BucketCard from './BucketCard';
import './Overview.css';

interface OverviewProps {
  buckets: Bucket[];
}

const Overview: React.FC<OverviewProps> = ({ buckets }) => {
  return (
    <div className="overview">
      <div className="overview-header">
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
      <OverallScore buckets={buckets} />
      <div className="overview-buckets">
        <h2 className="overview-buckets-title">Maturity by Area</h2>
        <div className="overview-buckets-grid">
          {buckets.map((bucket) => (
            <BucketCard key={bucket.id} bucket={bucket} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;

