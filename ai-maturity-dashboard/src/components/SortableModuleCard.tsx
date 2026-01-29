import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SortableModuleCard.css';

interface SortableModuleCardProps {
  id: string;
  children: React.ReactNode;
}

const SortableModuleCard: React.FC<SortableModuleCardProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-module-card ${isDragging ? 'dragging' : ''}`}
    >
      <div
        className="sortable-module-card-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        onClickCapture={(e) => e.stopPropagation()}
      >
        <span className="sortable-module-card-drag-handle-icon">⋮⋮</span>
      </div>
      {children}
    </div>
  );
};

export default SortableModuleCard;

