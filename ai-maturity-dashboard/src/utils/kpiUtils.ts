import { KPI } from '../types/kpis';

/**
 * Calculates the overall KPI score as a percentage (0-100)
 * Each KPI is normalized to a 0-100 scale based on its min/max range,
 * then all KPIs are averaged equally
 */
export const calculateOverallKPIScore = (kpis: KPI[]): number => {
  if (kpis.length === 0) return 0;

  const normalizedScores = kpis.map((kpi) => {
    const { currentValue, scale } = kpi;
    const { min, max } = scale;
    
    // Normalize the current value to 0-100 scale
    // Clamp value between min and max
    const clampedValue = Math.max(min, Math.min(max, currentValue));
    const normalizedScore = ((clampedValue - min) / (max - min)) * 100;
    
    return normalizedScore;
  });

  // Calculate average of all normalized scores
  const averageScore = normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length;
  
  return Math.round(averageScore);
};







