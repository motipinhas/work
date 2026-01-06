export type Trend = 'up' | 'down';

export interface Scale {
  min: number;
  max: number;
  unit: string;
}

export interface HistoricalDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  value: number;
}

export interface SubMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  scale: Scale;
  trend: Trend;
  history?: HistoricalDataPoint[];
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  scale: Scale;
  trend: Trend;
  category?: string;
  subMetrics?: SubMetric[];
  history?: HistoricalDataPoint[];
}

export interface KPIData {
  kpis: KPI[];
}

