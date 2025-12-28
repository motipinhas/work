import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPI, KPIData } from '../types/kpis';
import kpisData from '../data/kpis.json';
import KPICard from './KPICard';
import './KPIsView.css';

const KPIsView: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPI[]>([]);

  useEffect(() => {
    const data = kpisData as KPIData;
    setKpis(data.kpis);
  }, []);

  return (
    <div className="kpis-view">
      <div className="kpis-view-header">
        <button 
          onClick={() => navigate('/')}
          className="back-button"
          title="Back to Home"
        >
          ← Home
        </button>
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
      </div>

      <div className="kpis-view-content">
        <div className="kpis-view-title-section">
          <h1 className="kpis-view-title">Maturity KPIs</h1>
          <p className="kpis-view-subtitle">Track and monitor key performance indicators for AI maturity</p>
        </div>

        <div className="kpis-grid">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIsView;

