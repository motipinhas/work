export type MaturityStage = 'Not Started' | 'Beginning' | 'Developing' | 'Mature' | 'Advanced';

export const STAGE_INDICES: Record<MaturityStage, number> = {
  'Not Started': 0,
  'Beginning': 1,
  'Developing': 2,
  'Mature': 3,
  'Advanced': 4,
};

export const STAGE_COLORS: Record<MaturityStage, string> = {
  'Not Started': '#dc3545',      // Red
  'Beginning': '#ffc107',        // Yellow/Orange
  'Developing': '#17a2b8',       // Blue/Cyan
  'Mature': '#28a745',          // Green
  'Advanced': '#006400',         // Dark Green
};

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Bucket {
  id: string;
  name: string;
  stage: MaturityStage;
  stageIndex: number;
  description: string;
  recommendations?: Recommendation[];
}

export interface MaturityData {
  buckets: Bucket[];
}









