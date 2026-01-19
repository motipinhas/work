import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KPI } from '../types/kpis';
import KPICard from './KPICard';
import './SortableKPICard.css';

interface SortableKPICardProps {
  kpi: KPI;
}

const SortableKPICard: React.FC<SortableKPICardProps> = ({ kpi }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: kpi.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-kpi-card ${isDragging ? 'dragging' : ''}`}
    >
      <div 
        className="sortable-kpi-card-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <span className="drag-handle-icon">⋮⋮</span>
      </div>
      <KPICard kpi={kpi} />
    </div>
  );
};

export default SortableKPICard;
