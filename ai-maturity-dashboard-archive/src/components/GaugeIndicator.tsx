import React from 'react';
import { MaturityStage, STAGE_COLORS } from '../types/maturity';
import { getStageColor, getPercentageFromStage } from '../utils/maturityUtils';
import './GaugeIndicator.css';

interface GaugeIndicatorProps {
  stage: MaturityStage;
  stageIndex: number;
  size?: 'small' | 'medium' | 'large';
}

const STAGES: MaturityStage[] = ['Not Started', 'Beginning', 'Developing', 'Mature', 'Advanced'];

const GaugeIndicator: React.FC<GaugeIndicatorProps> = ({ stage, stageIndex, size = 'medium' }) => {
  const percentage = getPercentageFromStage(stageIndex);
  const color = getStageColor(stage);
  
  const sizeClass = `gauge-${size}`;
  const sizeValue = size === 'small' ? 120 : size === 'medium' ? 160 : 220;
  const radius = size === 'small' ? 45 : size === 'medium' ? 60 : 80;
  const strokeWidth = size === 'small' ? 8 : size === 'medium' ? 10 : 12;
  const centerX = sizeValue / 2;
  const centerY = sizeValue / 2;
  
  // Calculate circumference for full circle
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Calculate positions for stage labels around the circle
  const stageLabels = STAGES.map((stageName, index) => {
    // Position labels evenly around the circle (starting from top, going clockwise)
    const angle = (index / 5) * 2 * Math.PI - Math.PI / 2; // Start from top
    const labelRadius = radius + (size === 'small' ? 20 : size === 'medium' ? 25 : 30);
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    const stageColor = STAGE_COLORS[stageName];
    const isActive = index <= stageIndex;
    
    return {
      stageName,
      index,
      x,
      y,
      angle,
      stageColor,
      isActive,
    };
  });

  return (
    <div className={`gauge-container ${sizeClass}`}>
      <div className="gauge-content-wrapper">
        <div className="gauge-ring-wrapper">
          <svg className="gauge-ring-svg" width={sizeValue} height={sizeValue}>
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#f0f0f0"
              strokeWidth={strokeWidth}
            />
            
            {/* Progress circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="gauge-progress-ring"
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
            
            {/* Stage markers on the ring */}
            {STAGES.map((stageName, index) => {
              const angle = (index / 5) * 2 * Math.PI - Math.PI / 2;
              const markerRadius = radius;
              const markerX = centerX + markerRadius * Math.cos(angle);
              const markerY = centerY + markerRadius * Math.sin(angle);
              const stageColor = STAGE_COLORS[stageName];
              const isActive = index <= stageIndex;
              
              return (
                <circle
                  key={index}
                  cx={markerX}
                  cy={markerY}
                  r={size === 'small' ? 4 : size === 'medium' ? 5 : 6}
                  fill={isActive ? stageColor : '#ddd'}
                  stroke="white"
                  strokeWidth="2"
                  className="gauge-stage-marker"
                />
              );
            })}
          </svg>
          
          {/* Center percentage */}
          <div className="gauge-center-content">
            <div className="gauge-center-percentage" style={{ color }}>
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
        
        {/* Stage labels around the ring */}
        <div className="gauge-labels-wrapper" style={{ width: sizeValue, height: sizeValue }}>
          {stageLabels.map((label) => (
            <div
              key={label.index}
              className={`gauge-stage-label ${label.isActive ? 'active' : ''}`}
              style={{
                left: label.x,
                top: label.y,
                color: label.isActive ? label.stageColor : '#bbb',
              }}
            >
              <div className="gauge-label-number" title={label.stageName}>
                {label.index}
                <span className="gauge-tooltip">{label.stageName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current stage name below */}
      <div className="gauge-label">
        <div className="gauge-stage" style={{ color }}>{stage}</div>
      </div>
    </div>
  );
};

export default GaugeIndicator;
