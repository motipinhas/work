import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import aiFitnessProgramStatusData from '../data/aiFitnessProgramStatus.json';
import {
  FITNESS_STATUS_COLORS,
  FitnessStatusColor,
  FitnessStatusData,
  FitnessStatusItem,
  getOverallFitnessStatus,
} from '../types/aiFitnessProgramStatus';
import SortableFitnessStatusCard from './SortableFitnessStatusCard';
import './AIFitnessProgramStatus.css';

const FITNESS_STATUS_ORDER_STORAGE_KEY = 'ai-fitness-status-order';

const countByStatus = (items: FitnessStatusItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] += 1;
      return acc;
    },
    { total: 0, Green: 0, Yellow: 0, Red: 0, Gray: 0 } as Record<
      'total' | FitnessStatusColor,
      number
    >
  );
};

const loadOrder = (): string[] | null => {
  try {
    const stored = localStorage.getItem(FITNESS_STATUS_ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveOrder = (order: string[]) => {
  try {
    localStorage.setItem(FITNESS_STATUS_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    console.error('Failed to save AI Fitness status order:', error);
  }
};

const applyOrder = (itemsToOrder: FitnessStatusItem[], customOrder: string[] | null) => {
  if (!customOrder || customOrder.length === 0) return itemsToOrder;

  const itemMap = new Map(itemsToOrder.map((i) => [i.id, i]));
  const ordered: FitnessStatusItem[] = [];
  const usedIds = new Set<string>();

  customOrder.forEach((id) => {
    const item = itemMap.get(id);
    if (item) {
      ordered.push(item);
      usedIds.add(id);
    }
  });

  itemsToOrder.forEach((item) => {
    if (!usedIds.has(item.id)) {
      ordered.push(item);
    }
  });

  return ordered;
};

const AIFitnessProgramStatus: React.FC = () => {
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const data = aiFitnessProgramStatusData as FitnessStatusData;
  const baseItems: FitnessStatusItem[] = data.items ?? [];
  const [items, setItems] = useState<FitnessStatusItem[]>(() => {
    const saved = loadOrder();
    return applyOrder(baseItems, saved);
  });
  const [orderedIds, setOrderedIds] = useState<string[]>(() => items.map((i) => i.id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const overallStatus = getOverallFitnessStatus(items);
  const overallColor = FITNESS_STATUS_COLORS[overallStatus] ?? FITNESS_STATUS_COLORS.Gray;
  const counts = countByStatus(items);
  const scoredCount = counts.total - counts.Gray;

  const itemsWithBullets = useMemo(() => {
    return new Set(
      items.filter((i) => (i.bullets?.filter(Boolean).length ?? 0) > 0).map((i) => i.id)
    );
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      const nextOrder = next.map((i) => i.id);
      setOrderedIds(nextOrder);
      saveOrder(nextOrder);
      return next;
    });
  };

  const updatedAt = data.updatedAt;
  const updatedAtText = (() => {
    if (!updatedAt) return null;
    const d = new Date(updatedAt);
    if (Number.isNaN(d.getTime())) return updatedAt;
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
  })();

  return (
    <div className="ai-fitness-status">
      <div className="ai-fitness-status-header">
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

      <div className="ai-fitness-status-content">
        <div className="ai-fitness-status-title-section">
          <h1 className="ai-fitness-status-title">AI Fitness Program Status</h1>
          <p className="ai-fitness-status-subtitle">
            Status view across core program dimensions
          </p>

          <div
            className="ai-fitness-status-overall"
            style={{ '--status-color': overallColor } as React.CSSProperties}
          >
            <div className="ai-fitness-status-overall-label">Overall Status</div>
            <div className="ai-fitness-status-overall-value">
              <span className="ai-fitness-status-overall-badge">{overallStatus}</span>
              <span className="ai-fitness-status-overall-meta">
                {updatedAtText ? `Updated ${updatedAtText} • ` : ''}
                Based on {scoredCount} of {counts.total} (Gray ignored)
              </span>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
            <div className="ai-fitness-status-grid">
              {items.map((item) => {
                const color = FITNESS_STATUS_COLORS[item.status] ?? FITNESS_STATUS_COLORS.Gray;
                const bullets = item.bullets?.filter(Boolean) ?? [];
                const isExpandable = itemsWithBullets.has(item.id);
                const isOpen = openIds.has(item.id);
                const bulletsId = `ai-fitness-status-bullets-${item.id}`;

                const toggle = () => {
                  if (!isExpandable) return;
                  setOpenIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  });
                };

                return (
                  <SortableFitnessStatusCard
                    key={item.id}
                    item={item}
                    statusColor={color}
                    isExpandable={isExpandable}
                    isOpen={isOpen}
                    bullets={bullets}
                    bulletsId={bulletsId}
                    onToggle={toggle}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default AIFitnessProgramStatus;

