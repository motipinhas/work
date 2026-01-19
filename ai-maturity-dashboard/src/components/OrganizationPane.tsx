import React, { useState, useEffect } from 'react';
import { OrganizationNode, OrganizationType, OrganizationData } from '../types/organization';
import { useOrganization } from '../contexts/OrganizationContext';
import orgData from '../data/OrgData.json';
import './OrganizationPane.css';

interface OrganizationPaneProps {
  onOrganizationSelect?: (org: OrganizationNode | null) => void;
}

const OrganizationPane: React.FC<OrganizationPaneProps> = ({ onOrganizationSelect }) => {
  const { selectedOrganization, setSelectedOrganization } = useOrganization();
  const [organization, setOrganization] = useState<OrganizationNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['amdocs']));
  const [selectedNode, setSelectedNode] = useState<OrganizationNode | null>(selectedOrganization);

  useEffect(() => {
    const data = orgData as OrganizationData;
    setOrganization(data.organization);
  }, []);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeSelect = (node: OrganizationNode) => {
    setSelectedNode(node);
    setSelectedOrganization(node);
    onOrganizationSelect?.(node);
  };

  // Sync selectedNode with context
  useEffect(() => {
    setSelectedNode(selectedOrganization);
  }, [selectedOrganization]);

  const getTypeIcon = (type: OrganizationType): string => {
    switch (type) {
      case 'Company':
        return '🏢';
      case 'Division':
        return '📁';
      case 'Unit':
        return '📦';
      case 'Department':
        return '📋';
      case 'Team':
        return '👥';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: OrganizationType): string => {
    switch (type) {
      case 'Company':
        return '#667eea';
      case 'Division':
        return '#4a90e2';
      case 'Unit':
        return '#50c878';
      case 'Department':
        return '#ffa500';
      case 'Team':
        return '#ff6b6b';
      default:
        return '#999';
    }
  };

  const renderTreeNode = (node: OrganizationNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="org-tree-node">
        <div
          className={`org-tree-node-content ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => handleNodeSelect(node)}
        >
          {hasChildren && (
            <button
              className="org-tree-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="org-tree-toggle-spacer" />}
          <span
            className="org-tree-icon"
            style={{ color: getTypeColor(node.type) }}
          >
            {getTypeIcon(node.type)}
          </span>
          <span className="org-tree-name">{node.name}</span>
          <span
            className="org-tree-type-badge"
            style={{ backgroundColor: getTypeColor(node.type) }}
          >
            {node.type}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="org-tree-children">
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!organization) {
    return (
      <div className="organization-pane">
        <div className="organization-pane-loading">Loading organization data...</div>
      </div>
    );
  }

  return (
    <div className="organization-pane">
      <div className="organization-pane-header">
        <h3 className="organization-pane-title">Organization</h3>
        {selectedNode && (
          <button
            className="organization-pane-clear"
            onClick={() => {
              setSelectedNode(null);
              setSelectedOrganization(null);
              onOrganizationSelect?.(null);
            }}
            title="Clear selection"
          >
            Clear
          </button>
        )}
      </div>
      <div className="organization-pane-content">
        <div className="org-tree">
          {renderTreeNode(organization)}
        </div>
        {selectedNode && (
          <div className="organization-pane-selected">
            <div className="organization-pane-selected-label">Selected:</div>
            <div className="organization-pane-selected-name">
              {getTypeIcon(selectedNode.type)} {selectedNode.name}
            </div>
            <div className="organization-pane-selected-type">{selectedNode.type}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationPane;

