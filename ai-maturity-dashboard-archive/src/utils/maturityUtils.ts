import { Bucket, MaturityStage, STAGE_INDICES, STAGE_COLORS } from '../types/maturity';

export const calculateOverallScore = (buckets: Bucket[]): number => {
  if (buckets.length === 0) return 0;
  const total = buckets.reduce((sum, bucket) => sum + bucket.stageIndex, 0);
  return Math.round((total / (buckets.length * 4)) * 100);
};

export const getOverallStage = (buckets: Bucket[]): MaturityStage => {
  const avgIndex = buckets.reduce((sum, bucket) => sum + bucket.stageIndex, 0) / buckets.length;
  const roundedIndex = Math.round(avgIndex);
  
  const stages: MaturityStage[] = ['Not Started', 'Beginning', 'Developing', 'Mature', 'Advanced'];
  return stages[Math.min(roundedIndex, 4)];
};

export const getStageColor = (stage: MaturityStage): string => {
  return STAGE_COLORS[stage];
};

export const getPercentageFromStage = (stageIndex: number): number => {
  return (stageIndex / 4) * 100;
};









