import React from 'react';
import ModuleCard from './ModuleCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="home-page-header">
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
        <h1 className="home-page-title">Amdocs AI Fitness</h1>
        <p className="home-page-subtitle">Agentic AI Progress Status</p>
      </div>

      <div className="home-page-modules">
        <h2 className="modules-section-title">Modules</h2>
        <div className="modules-grid">
          <ModuleCard
            title="Maturity Dashboard"
            description="View overall maturity scores, explore maturity by area, and compare different buckets. Get insights into your AI maturity journey across all key areas."
            icon="📊"
            route="/dashboard"
            color="#4a90e2"
          />
          <ModuleCard
            title="Maturity KPIs"
            description="Track and monitor key performance indicators for AI maturity. Analyze trends and measure progress across different maturity dimensions."
            icon="📈"
            route="/maturity-kpis"
            color="#50c878"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

