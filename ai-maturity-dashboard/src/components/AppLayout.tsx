import React, { useState } from 'react';
import { OrganizationNode } from '../types/organization';
import OrganizationPane from './OrganizationPane';
import ThemeToggle from './ThemeToggle';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationNode | null>(null);
  const [isPaneOpen, setIsPaneOpen] = useState(true);

  const handleOrganizationSelect = (org: OrganizationNode | null) => {
    setSelectedOrganization(org);
    // You can add logic here to filter data based on selected organization
    console.log('Selected organization:', org);
  };

  return (
    <div className="app-layout">
      <div className={`app-layout-sidebar ${isPaneOpen ? 'open' : 'closed'}`}>
        <OrganizationPane onOrganizationSelect={handleOrganizationSelect} />
      </div>
      <div className="app-layout-main">
        <div className="app-layout-header">
          <button
            className="app-layout-toggle"
            onClick={() => setIsPaneOpen(!isPaneOpen)}
            aria-label={isPaneOpen ? 'Hide organization pane' : 'Show organization pane'}
          >
            {isPaneOpen ? '◀' : '▶'}
          </button>
          <ThemeToggle />
        </div>
        <div className="app-layout-content">
          {children}
        </div>
      </div>
      {selectedOrganization && (
        <div className="app-layout-banner">
          <span className="app-layout-banner-text">
            Viewing data for: <strong>{selectedOrganization.name}</strong> ({selectedOrganization.type})
          </span>
          <button
            className="app-layout-banner-close"
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

export default AppLayout;


