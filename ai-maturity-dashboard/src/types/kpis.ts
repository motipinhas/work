export type Trend = 'up' | 'down';

export interface Scale {
  min: number;
  max: number;
  unit: string;
}

export interface SubMetric {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  scale: Scale;
  trend: Trend;
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
}

export interface KPIData {
  kpis: KPI[];
}

