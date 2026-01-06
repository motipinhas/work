import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalDataPoint } from '../types/kpis';
import './HistoryModal.css';

interface HistoryModalProps {
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  history: HistoricalDataPoint[];
  onClose: () => void;
  color?: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  title,
  description,
  currentValue,
  targetValue,
  unit,
  history,
  onClose,
  color = '#667eea',
}) => {
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare chart data with formatted dates
  const chartData = history.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date),
  }));

  return (
    <div className="history-modal-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-modal-header">
          <div>
            <h2 className="history-modal-title">{title}</h2>
            <p className="history-modal-description">{description}</p>
          </div>
          <button className="history-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div className="history-modal-content">
          <div className="history-modal-stats">
            <div className="history-stat">
              <span className="history-stat-label">Current</span>
              <span className="history-stat-value" style={{ color }}>
                {formatValue(currentValue, unit)}
              </span>
            </div>
            <div className="history-stat">
              <span className="history-stat-label">Target</span>
              <span className="history-stat-value" style={{ color: '#667eea' }}>
                {formatValue(targetValue, unit)}
              </span>
            </div>
          </div>

          <div className="history-modal-chart">
            <h3 className="history-chart-title">3-Month Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis 
                  dataKey="formattedDate" 
                  stroke="var(--text-tertiary)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--text-tertiary)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                  }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                  formatter={(value: number | undefined) => formatValue(value ?? 0, unit)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name={title}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={() => targetValue} 
                  name="Target"
                  stroke="#667eea"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

