import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrganizationNode } from '../types/organization';

interface OrganizationContextType {
  selectedOrganization: OrganizationNode | null;
  setSelectedOrganization: (org: OrganizationNode | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationNode | null>(null);

  return (
    <OrganizationContext.Provider value={{ selectedOrganization, setSelectedOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
