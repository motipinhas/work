import React from 'react';
import { Bucket } from '../types/maturity';
import { calculateOverallScore, getOverallStage, getStageColor } from '../utils/maturityUtils';
import GaugeIndicator from './GaugeIndicator';
import './OverallScore.css';

interface OverallScoreProps {
  buckets: Bucket[];
}

const OverallScore: React.FC<OverallScoreProps> = ({ buckets }) => {
  const overallScore = calculateOverallScore(buckets);
  const overallStage = getOverallStage(buckets);
  const stageColor = getStageColor(overallStage);
  const stageIndex = buckets.length > 0 
    ? Math.round(buckets.reduce((sum, b) => sum + b.stageIndex, 0) / buckets.length)
    : 0;

  return (
    <div className="overall-score">
      <div className="overall-score-header">
        <h1 className="overall-score-title">Amdocs AI maturity dashboard</h1>
        <p className="overall-score-subtitle">Agentic AI Progress Status</p>
      </div>
      <div className="overall-score-content">
        <div className="overall-score-gauge">
          <GaugeIndicator stage={overallStage} stageIndex={stageIndex} size="large" />
        </div>
        <div className="overall-score-details">
          <div className="overall-score-value" style={{ color: stageColor }}>
            {overallScore}%
          </div>
          <div className="overall-score-stage" style={{ color: stageColor }}>
            {overallStage}
          </div>
          <div className="overall-score-description">
            Overall maturity across all {buckets.length} key areas
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallScore;

