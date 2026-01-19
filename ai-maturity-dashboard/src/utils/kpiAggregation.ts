import { KPI, SubMetric, HistoricalDataPoint } from '../types/kpis';
import { OrganizationNode } from '../types/organization';
import { orgKpiData, getLeafNodeIds } from './orgKpiMapping';

/**
 * Aggregates KPIs from all child units of the given organization node
 */
export function aggregateKPIsForOrganization(orgNode: OrganizationNode | null): KPI[] {
  if (!orgNode) {
    // Return default/company-level KPIs if no org is selected
    return [];
  }

  // First, check if this node itself has direct KPI data
  const directKPIs = orgKpiData[orgNode.id] || [];
  
  // Get all leaf nodes (teams/departments with actual data) under this org
  const leafNodeIds = getLeafNodeIds(orgNode);
  
  // Collect all KPIs from leaf nodes (excluding the current node if it's a leaf)
  const kpiMap = new Map<string, KPI[]>();
  
  // If this node has direct data, include it
  if (directKPIs.length > 0) {
    directKPIs.forEach(kpi => {
      if (!kpiMap.has(kpi.id)) {
        kpiMap.set(kpi.id, []);
      }
      kpiMap.get(kpi.id)!.push(kpi);
    });
  }
  
  // Also collect from child leaf nodes
  leafNodeIds.forEach(nodeId => {
    // Skip the current node if it's a leaf (we already added its data above)
    if (nodeId === orgNode.id) {
      return;
    }
    const nodeKPIs = orgKpiData[nodeId] || [];
    nodeKPIs.forEach(kpi => {
      if (!kpiMap.has(kpi.id)) {
        kpiMap.set(kpi.id, []);
      }
      kpiMap.get(kpi.id)!.push(kpi);
    });
  });

  // If no data found for this org, return empty array
  if (kpiMap.size === 0) {
    return [];
  }

  // Aggregate KPIs by ID
  const aggregatedKPIs: KPI[] = [];
  
  kpiMap.forEach((kpis, kpiId) => {
    if (kpis.length > 0) {
      aggregatedKPIs.push(aggregateKPI(kpiId, kpis));
    }
  });

  return aggregatedKPIs;
}

/**
 * Aggregates multiple KPI instances into a single KPI
 */
function aggregateKPI(kpiId: string, kpis: KPI[]): KPI {
  if (kpis.length === 0) {
    throw new Error('Cannot aggregate empty KPI array');
  }

  if (kpis.length === 1) {
    return { ...kpis[0] };
  }

  const firstKpi = kpis[0];
  
  // Aggregate current values (average)
  const avgCurrentValue = kpis.reduce((sum, kpi) => sum + kpi.currentValue, 0) / kpis.length;
  
  // Aggregate target values (average)
  const avgTargetValue = kpis.reduce((sum, kpi) => sum + kpi.targetValue, 0) / kpis.length;
  
  // Determine trend (if most are up, trend is up)
  const upCount = kpis.filter(kpi => kpi.trend === 'up').length;
  const aggregatedTrend = upCount >= kpis.length / 2 ? 'up' : 'down';
  
  // Aggregate history (average values for each date)
  const aggregatedHistory = aggregateHistory(kpis.map(kpi => kpi.history || []));
  
  // Aggregate sub-metrics if they exist
  let aggregatedSubMetrics = undefined;
  const subMetricsMap = new Map<string, any[]>();
  
  kpis.forEach(kpi => {
    if (kpi.subMetrics && kpi.subMetrics.length > 0) {
      kpi.subMetrics.forEach(subMetric => {
        if (!subMetricsMap.has(subMetric.id)) {
          subMetricsMap.set(subMetric.id, []);
        }
        subMetricsMap.get(subMetric.id)!.push(subMetric);
      });
    }
  });
  
  if (subMetricsMap.size > 0) {
    aggregatedSubMetrics = [];
    subMetricsMap.forEach((subMetrics, subMetricId) => {
      if (subMetrics.length > 0) {
        aggregatedSubMetrics!.push(aggregateSubMetric(subMetricId, subMetrics));
      }
    });
  }

  // Create aggregated KPI
  const aggregated: KPI = {
    id: firstKpi.id,
    name: firstKpi.name,
    description: firstKpi.description,
    currentValue: Math.round(avgCurrentValue * 100) / 100, // Round to 2 decimals
    targetValue: Math.round(avgTargetValue * 100) / 100,
    scale: { ...firstKpi.scale },
    trend: aggregatedTrend,
    category: firstKpi.category,
    history: aggregatedHistory.length > 0 ? aggregatedHistory : undefined,
    subMetrics: aggregatedSubMetrics
  };

  return aggregated;
}

/**
 * Aggregates multiple history arrays by averaging values for matching dates
 */
function aggregateHistory(histories: HistoricalDataPoint[][]): HistoricalDataPoint[] {
  if (histories.length === 0) {
    return [];
  }

  // Get all unique dates
  const dateSet = new Set<string>();
  histories.forEach(history => {
    history.forEach(point => dateSet.add(point.date));
  });

  const dates = Array.from(dateSet).sort();
  
  // For each date, calculate average value across all histories
  return dates.map(date => {
    const values: number[] = [];
    histories.forEach(history => {
      const point = history.find(p => p.date === date);
      if (point) {
        values.push(point.value);
      }
    });

    if (values.length === 0) {
      return { date, value: 0 };
    }

    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    return {
      date,
      value: Math.round(avgValue * 100) / 100 // Round to 2 decimals
    };
  });
}

/**
 * Aggregates multiple SubMetric instances into a single SubMetric
 */
function aggregateSubMetric(subMetricId: string, subMetrics: SubMetric[]): SubMetric {
  if (subMetrics.length === 0) {
    throw new Error('Cannot aggregate empty SubMetric array');
  }

  if (subMetrics.length === 1) {
    return { ...subMetrics[0] };
  }

  const firstSubMetric = subMetrics[0];
  
  // Aggregate current values (average)
  const avgCurrentValue = subMetrics.reduce((sum, sm) => sum + sm.currentValue, 0) / subMetrics.length;
  
  // Aggregate target values (average)
  const avgTargetValue = subMetrics.reduce((sum, sm) => sum + sm.targetValue, 0) / subMetrics.length;
  
  // Determine trend (if most are up, trend is up)
  const upCount = subMetrics.filter(sm => sm.trend === 'up').length;
  const aggregatedTrend = upCount >= subMetrics.length / 2 ? 'up' : 'down';
  
  // Aggregate history (average values for each date)
  const aggregatedHistory = aggregateHistory(subMetrics.map(sm => sm.history || []));
  
  return {
    id: firstSubMetric.id,
    name: firstSubMetric.name,
    description: firstSubMetric.description,
    currentValue: Math.round(avgCurrentValue * 100) / 100,
    targetValue: Math.round(avgTargetValue * 100) / 100,
    scale: { ...firstSubMetric.scale },
    trend: aggregatedTrend,
    history: aggregatedHistory.length > 0 ? aggregatedHistory : undefined
  };
}

/**
 * Gets the default/company-level KPIs (fallback when no org is selected)
 */
export function getDefaultKPIs(): KPI[] {
  // You can return a default set of KPIs here, or load from the original kpis.json
  // For now, we'll aggregate from all leaf nodes
  return [];
}
