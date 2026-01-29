import React, { useState, useEffect } from 'react';
import ModuleCard from './ModuleCard';
import ThemeToggle from './ThemeToggle';
import OrganizationPane from './OrganizationPane';
import { OrganizationNode } from '../types/organization';
import { calculateOverallScore } from '../utils/maturityUtils';
import { calculateOverallKPIScore } from '../utils/kpiUtils';
import { MaturityData } from '../types/maturity';
import { KPIData } from '../types/kpis';
import aiFitnessProgramStatusData from '../data/aiFitnessProgramStatus.json';
import {
  FITNESS_STATUS_COLORS,
  FitnessStatusData,
  FitnessStatusItem,
  getOverallFitnessStatus,
} from '../types/aiFitnessProgramStatus';
import maturityData from '../data/maturityData.json';
import kpisData from '../data/kpis.json';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [maturityScore, setMaturityScore] = useState<number>(0);
  const [kpiScore, setKpiScore] = useState<number>(0);
  const [programStatus, setProgramStatus] = useState<string>('Gray');
  const [programStatusColor, setProgramStatusColor] = useState<string>(FITNESS_STATUS_COLORS.Gray);
  const [programStatusUpdatedAt, setProgramStatusUpdatedAt] = useState<string>('');
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationNode | null>(null);
  const [isPaneOpen, setIsPaneOpen] = useState(true);

  useEffect(() => {
    // Calculate maturity score
    const maturity = maturityData as MaturityData;
    const maturityOverallScore = calculateOverallScore(maturity.buckets);
    setMaturityScore(maturityOverallScore);

    // Calculate KPI score
    const kpis = kpisData as KPIData;
    const kpiOverallScore = calculateOverallKPIScore(kpis.kpis);
    setKpiScore(kpiOverallScore);

    // Calculate AI Fitness Program overall status
    const programData = aiFitnessProgramStatusData as FitnessStatusData;
    const items: FitnessStatusItem[] = programData.items ?? [];
    const overall = getOverallFitnessStatus(items);
    setProgramStatus(overall);
    setProgramStatusColor(FITNESS_STATUS_COLORS[overall] ?? FITNESS_STATUS_COLORS.Gray);

    const updatedAt = programData.updatedAt;
    if (updatedAt) {
      const d = new Date(updatedAt);
      const formatted = Number.isNaN(d.getTime())
        ? updatedAt
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          }).format(d);
      setProgramStatusUpdatedAt(`Updated ${formatted}`);
    } else {
      setProgramStatusUpdatedAt('');
    }
  }, []);

  const handleOrganizationSelect = (org: OrganizationNode | null) => {
    setSelectedOrganization(org);
    // You can add logic here to filter data based on selected organization
    console.log('Selected organization:', org);
  };

  return (
    <div className={`home-page ${isPaneOpen ? 'pane-open' : 'pane-closed'}`}>
      <div className={`home-page-sidebar ${isPaneOpen ? 'open' : 'closed'}`}>
        <OrganizationPane onOrganizationSelect={handleOrganizationSelect} />
      </div>
      <div className="home-page-main">
        <div className="home-page-header">
          <button
            className="home-page-toggle"
            onClick={() => setIsPaneOpen(!isPaneOpen)}
            aria-label={isPaneOpen ? 'Hide organization pane' : 'Show organization pane'}
          >
            {isPaneOpen ? '◀' : '▶'}
          </button>
          <div className="home-page-header-content">
            <div className="home-page-header-top">
              <a 
                href="https://www.amdocs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="amdocs-logo"
              >
                <img 
                  src="https://www.amdocs.com/sites/default/files/amdocs-logo.svg" 
                  alt="Amdocs" 
                  className="amdocs-logo-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/amdocs-logo.svg';
                  }}
                />
              </a>
              <ThemeToggle />
            </div>
            <h1 className="home-page-title">Amdocs AI Fitness</h1>
            <p className="home-page-subtitle">Agentic AI Progress Status</p>
          </div>
        </div>

        <div className="home-page-modules">
          <div className="modules-grid">
            <ModuleCard
              title="Maturity Dashboard"
              description="View overall maturity scores, explore maturity by area, and compare different buckets. Get insights into your AI maturity journey across all key areas."
              icon="📊"
              route="/dashboard"
              color="#4a90e2"
              score={maturityScore}
            />
            <ModuleCard
              title="Maturity KPIs"
              description="Track and monitor key performance indicators for AI maturity. Analyze trends and measure progress across different maturity dimensions."
              icon="📈"
              route="/maturity-kpis"
              color="#50c878"
              score={kpiScore}
            />
            <ModuleCard
              title="AI Fitness Program Status"
              description="Status view across core program dimensions. Track overall state (Green/Yellow/Red/Gray) and the key reasons behind each status."
              icon="🧭"
              route="/ai-fitness-program-status"
              color="#667eea"
              statusLabel={programStatus}
              statusColor={programStatusColor}
              statusMeta={programStatusUpdatedAt}
            />
          </div>
        </div>
      </div>
      {selectedOrganization && (
        <div className="home-page-banner">
          <span className="home-page-banner-text">
            Viewing data for: <strong>{selectedOrganization.name}</strong> ({selectedOrganization.type})
          </span>
          <button
            className="home-page-banner-close"
            onClick={() => handleOrganizationSelect(null)}
            aria-label="Clear organization selection"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

