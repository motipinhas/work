export type OrganizationType = 'Company' | 'Division' | 'Unit' | 'Department' | 'Team';

export interface OrganizationNode {
  id: string;
  name: string;
  type: OrganizationType;
  children: OrganizationNode[];
}

export interface OrganizationData {
  organization: OrganizationNode;
}







