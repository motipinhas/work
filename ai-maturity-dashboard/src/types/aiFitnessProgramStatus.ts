export type FitnessStatusColor = 'Green' | 'Yellow' | 'Red' | 'Gray';

export interface FitnessStatusItem {
  id: string;
  title: string;
  description: string;
  status: FitnessStatusColor;
  bullets?: string[];
}

export interface FitnessStatusData {
  updatedAt?: string;
  items: FitnessStatusItem[];
}

export const FITNESS_STATUS_COLORS: Record<FitnessStatusColor, string> = {
  Green: '#28a745',
  Yellow: '#ffc107',
  Red: '#dc3545',
  Gray: '#6c757d',
};

export const FITNESS_STATUS_SCORES: Record<FitnessStatusColor, number> = {
  Red: 1,
  Yellow: 2,
  Green: 3,
  Gray: 0,
};

export const getOverallFitnessStatus = (items: FitnessStatusItem[]): FitnessStatusColor => {
  const scored = items.filter((i) => i.status !== 'Gray');
  if (scored.length === 0) return 'Gray';

  const avg =
    scored.reduce((sum, i) => sum + (FITNESS_STATUS_SCORES[i.status] ?? 0), 0) / scored.length;

  if (avg < 1.5) return 'Red';
  if (avg < 2.5) return 'Yellow';
  return 'Green';
};

