import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { KPI, KPIData } from '../types/kpis';
import { useOrganization } from '../contexts/OrganizationContext';
import { aggregateKPIsForOrganization } from '../utils/kpiAggregation';
import kpisData from '../data/kpis.json';
import SortableKPICard from './SortableKPICard';
import './KPIsView.css';

const KPI_ORDER_STORAGE_KEY = 'kpi-order';

const KPIsView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedOrganization } = useOrganization();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [orderedKpiIds, setOrderedKpiIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load KPI order from localStorage
  const loadKpiOrder = (): string[] | null => {
    try {
      const stored = localStorage.getItem(KPI_ORDER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // Save KPI order to localStorage
  const saveKpiOrder = (order: string[]) => {
    try {
      localStorage.setItem(KPI_ORDER_STORAGE_KEY, JSON.stringify(order));
    } catch (error) {
      console.error('Failed to save KPI order:', error);
    }
  };

  // Apply custom order to KPIs
  const applyOrder = (kpisToOrder: KPI[], customOrder: string[] | null): KPI[] => {
    if (!customOrder || customOrder.length === 0) {
      return kpisToOrder;
    }

    // Create a map for quick lookup
    const kpiMap = new Map(kpisToOrder.map(kpi => [kpi.id, kpi]));
    
    // Order KPIs according to custom order, then append any missing ones
    const ordered: KPI[] = [];
    const usedIds = new Set<string>();

    customOrder.forEach(id => {
      const kpi = kpiMap.get(id);
      if (kpi) {
        ordered.push(kpi);
        usedIds.add(id);
      }
    });

    // Add any KPIs that weren't in the custom order
    kpisToOrder.forEach(kpi => {
      if (!usedIds.has(kpi.id)) {
        ordered.push(kpi);
      }
    });

    return ordered;
  };

  useEffect(() => {
    let loadedKpis: KPI[] = [];
    
    if (selectedOrganization) {
      // Aggregate KPIs for the selected organization
      loadedKpis = aggregateKPIsForOrganization(selectedOrganization);
    } else {
      // Show default/company-level KPIs when no org is selected
      const data = kpisData as KPIData;
      loadedKpis = data.kpis;
    }

    // Load saved order and apply it
    const savedOrder = loadKpiOrder();
    const orderedKpis = applyOrder(loadedKpis, savedOrder);
    
    setKpis(orderedKpis);
    setOrderedKpiIds(orderedKpis.map(kpi => kpi.id));
  }, [selectedOrganization]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setKpis((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        const newOrder = newItems.map(item => item.id);
        
        // Save the new order
        saveKpiOrder(newOrder);
        setOrderedKpiIds(newOrder);
        
        return newItems;
      });
    }
  };

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
          <p className="kpis-view-subtitle">
            {selectedOrganization 
              ? `KPIs for ${selectedOrganization.name} (aggregated from child units)`
              : 'Track and monitor key performance indicators for AI maturity (Company-wide)'}
          </p>
        </div>

        {kpis.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedKpiIds}
            >
              <div className="kpis-grid">
                {kpis.map((kpi) => (
                  <SortableKPICard key={kpi.id} kpi={kpi} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="kpis-view-empty">
            <p>No KPI data available for the selected organizational unit.</p>
            <p>Please select a different unit or clear the selection to view company-wide KPIs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIsView;








