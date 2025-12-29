import React from 'react';
import { KPI } from '../types/kpis';
import './KPICard.css';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const calculatePercentage = (value: number, min: number, max: number): number => {
    return ((value - min) / (max - min)) * 100;
  };

  const getTrendIcon = (trend: string): string => {
    return trend === 'up' ? '↑' : '↓';
  };

  const getTrendColor = (trend: string, isTarget: boolean = false): string => {
    if (isTarget) return '#667eea';
    return trend === 'up' ? '#28a745' : '#dc3545';
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return `${value.toFixed(1)} ${unit}`;
  };

  const currentPercentage = calculatePercentage(
    kpi.currentValue,
    kpi.scale.min,
    kpi.scale.max
  );

  const targetPercentage = calculatePercentage(
    kpi.targetValue,
    kpi.scale.min,
    kpi.scale.max
  );

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <h3 className="kpi-card-title">{kpi.name}</h3>
        {kpi.category && (
          <span className="kpi-card-category">{kpi.category}</span>
        )}
      </div>

      <p className="kpi-card-description">{kpi.description}</p>

      <div className="kpi-card-main-metric">
        <div className="kpi-card-value-section">
          <div className="kpi-card-current">
            <div className="kpi-card-value-label">Current</div>
            <div 
              className="kpi-card-value"
              style={{ color: getTrendColor(kpi.trend) }}
            >
              {formatValue(kpi.currentValue, kpi.scale.unit)}
              <span className="kpi-card-trend" style={{ color: getTrendColor(kpi.trend) }}>
                {getTrendIcon(kpi.trend)}
              </span>
            </div>
          </div>
          <div className="kpi-card-target">
            <div className="kpi-card-value-label">Target</div>
            <div 
              className="kpi-card-value"
              style={{ color: getTrendColor(kpi.trend, true) }}
            >
              {formatValue(kpi.targetValue, kpi.scale.unit)}
            </div>
          </div>
        </div>

        <div className="kpi-card-progress">
          <div className="kpi-card-progress-bar-container">
            <div 
              className="kpi-card-progress-bar kpi-card-progress-current"
              style={{ 
                width: `${Math.min(currentPercentage, 100)}%`,
                backgroundColor: getTrendColor(kpi.trend)
              }}
            />
            {targetPercentage > currentPercentage && (
              <div 
                className="kpi-card-progress-target-marker"
                style={{ 
                  left: `${Math.min(targetPercentage, 100)}%`,
                  borderColor: getTrendColor(kpi.trend, true)
                }}
              />
            )}
          </div>
          <div className="kpi-card-progress-labels">
            <span>{formatValue(kpi.scale.min, kpi.scale.unit)}</span>
            <span>{formatValue(kpi.scale.max, kpi.scale.unit)}</span>
          </div>
        </div>
      </div>

      {kpi.subMetrics && kpi.subMetrics.length > 0 && (
        <div className="kpi-card-submetrics">
          <h4 className="kpi-card-submetrics-title">Sub-Metrics</h4>
          <div className="kpi-card-submetrics-list">
            {kpi.subMetrics.map((subMetric) => {
              const subPercentage = calculatePercentage(
                subMetric.currentValue,
                subMetric.scale.min,
                subMetric.scale.max
              );
              return (
                <div key={subMetric.id} className="kpi-card-submetric">
                  <div className="kpi-card-submetric-header">
                    <span className="kpi-card-submetric-name">{subMetric.name}</span>
                    <span 
                      className="kpi-card-submetric-value"
                      style={{ color: getTrendColor(subMetric.trend) }}
                    >
                      {formatValue(subMetric.currentValue, subMetric.scale.unit)}
                      <span className="kpi-card-trend" style={{ color: getTrendColor(subMetric.trend) }}>
                        {getTrendIcon(subMetric.trend)}
                      </span>
                    </span>
                  </div>
                  <p className="kpi-card-submetric-description">{subMetric.description}</p>
                  <div className="kpi-card-submetric-progress">
                    <div 
                      className="kpi-card-submetric-progress-bar"
                      style={{ 
                        width: `${Math.min(subPercentage, 100)}%`,
                        backgroundColor: getTrendColor(subMetric.trend)
                      }}
                    />
                  </div>
                  <div className="kpi-card-submetric-target">
                    Target: {formatValue(subMetric.targetValue, subMetric.scale.unit)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPICard;

