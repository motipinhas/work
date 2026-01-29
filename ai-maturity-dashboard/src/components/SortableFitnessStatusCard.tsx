import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FitnessStatusItem } from '../types/aiFitnessProgramStatus';
import './SortableFitnessStatusCard.css';

interface SortableFitnessStatusCardProps {
  item: FitnessStatusItem;
  statusColor: string;
  isExpandable: boolean;
  isOpen: boolean;
  bullets: string[];
  bulletsId: string;
  onToggle: () => void;
}

const SortableFitnessStatusCard: React.FC<SortableFitnessStatusCardProps> = ({
  item,
  statusColor,
  isExpandable,
  isOpen,
  bullets,
  bulletsId,
  onToggle,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cardContent = (
    <>
      <div
        className="sortable-fitness-status-card-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        onClickCapture={(e) => e.stopPropagation()}
      >
        <span className="sortable-fitness-status-drag-handle-icon">⋮⋮</span>
      </div>

      <div className="ai-fitness-status-card-header">
        <h3 className="ai-fitness-status-card-title">{item.title}</h3>
        <div className="ai-fitness-status-card-actions">
          <span className="ai-fitness-status-badge">{item.status}</span>
          {isExpandable && (
            <span
              className={`ai-fitness-status-more ${isOpen ? 'open' : ''}`}
              aria-hidden="true"
            >
              {isOpen ? 'Less' : 'More'}{' '}
              <span className="ai-fitness-status-more-chevron">▾</span>
            </span>
          )}
        </div>
      </div>

      <p className="ai-fitness-status-card-description">{item.description}</p>

      {isExpandable && isOpen && (
        <>
          <div className="ai-fitness-status-expand-divider" aria-hidden="true" />
          <ul id={bulletsId} className="ai-fitness-status-bullets">
            {bullets.map((bullet, idx) => (
              <li key={`${item.id}-bullet-${idx}`}>{bullet}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-fitness-status-card ${isDragging ? 'dragging' : ''}`}
    >
      {isExpandable ? (
        <button
          type="button"
          className={`ai-fitness-status-card ai-fitness-status-card--expandable ${isOpen ? 'is-open' : ''}`}
          style={{ '--status-color': statusColor } as React.CSSProperties}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={bulletsId}
        >
          {cardContent}
        </button>
      ) : (
        <div
          className="ai-fitness-status-card"
          style={{ '--status-color': statusColor } as React.CSSProperties}
        >
          {cardContent}
        </div>
      )}
    </div>
  );
};

export default SortableFitnessStatusCard;

