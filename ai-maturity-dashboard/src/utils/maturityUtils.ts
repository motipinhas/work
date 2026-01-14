import { Bucket, MaturityStage, STAGE_COLORS, Recommendation } from '../types/maturity';

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

export const getRecommendationsForStage = (_stage: MaturityStage, stageIndex: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  if (stageIndex < 1) {
    // Not Started -> Beginning
    recommendations.push(
      {
        id: '1',
        title: 'Establish Initial Framework',
        description: 'Create a foundational framework and identify key stakeholders for AI initiatives. Define initial goals and success metrics.',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Conduct Readiness Assessment',
        description: 'Assess current capabilities, infrastructure, and organizational readiness for AI adoption.',
        priority: 'high',
      },
      {
        id: '3',
        title: 'Develop Initial Strategy',
        description: 'Create a high-level strategy document outlining vision, objectives, and initial roadmap.',
        priority: 'medium',
      },
    );
  } else if (stageIndex < 2) {
    // Beginning -> Developing
    recommendations.push(
      {
        id: '1',
        title: 'Expand Pilot Programs',
        description: 'Scale successful pilot programs and expand to additional use cases and departments.',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Build Core Capabilities',
        description: 'Invest in building core AI capabilities, including tools, processes, and team expertise.',
        priority: 'high',
      },
      {
        id: '3',
        title: 'Establish Governance',
        description: 'Implement basic governance structures and processes for AI initiatives.',
        priority: 'medium',
      },
    );
  } else if (stageIndex < 3) {
    // Developing -> Mature
    recommendations.push(
      {
        id: '1',
        title: 'Optimize and Scale',
        description: 'Optimize existing AI implementations and scale successful initiatives across the organization.',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Enhance Integration',
        description: 'Deepen integration of AI capabilities into core business processes and workflows.',
        priority: 'high',
      },
      {
        id: '3',
        title: 'Mature Governance',
        description: 'Enhance governance frameworks with advanced risk management and compliance measures.',
        priority: 'medium',
      },
    );
  } else if (stageIndex < 4) {
    // Mature -> Advanced
    recommendations.push(
      {
        id: '1',
        title: 'Achieve Excellence',
        description: 'Focus on achieving excellence in AI operations, continuous improvement, and innovation.',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Drive Innovation',
        description: 'Invest in cutting-edge AI research and development to maintain competitive advantage.',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Share Best Practices',
        description: 'Document and share best practices internally and externally to establish thought leadership.',
        priority: 'low',
      },
    );
  } else {
    // Advanced - maintain excellence
    recommendations.push(
      {
        id: '1',
        title: 'Maintain Leadership Position',
        description: 'Continue to innovate and maintain your position as an AI leader in the industry.',
        priority: 'medium',
      },
      {
        id: '2',
        title: 'Explore Emerging Technologies',
        description: 'Stay ahead by exploring and adopting emerging AI technologies and methodologies.',
        priority: 'low',
      },
    );
  }
  
  return recommendations;
};









