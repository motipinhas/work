import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aiFitnessProgramStatusData from '../data/aiFitnessProgramStatus.json';
import {
  FITNESS_STATUS_COLORS,
  FitnessStatusColor,
  FitnessStatusData,
  FitnessStatusItem,
  getOverallFitnessStatus,
} from '../types/aiFitnessProgramStatus';
import './AIFitnessProgramStatus.css';

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

const AIFitnessProgramStatus: React.FC = () => {
  const navigate = useNavigate();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const data = aiFitnessProgramStatusData as FitnessStatusData;
  const items: FitnessStatusItem[] = data.items ?? [];
  const overallStatus = getOverallFitnessStatus(items);
  const overallColor = FITNESS_STATUS_COLORS[overallStatus] ?? FITNESS_STATUS_COLORS.Gray;
  const counts = countByStatus(items);
  const scoredCount = counts.total - counts.Gray;

  const itemsWithBullets = useMemo(() => {
    return new Set(
      items.filter((i) => (i.bullets?.filter(Boolean).length ?? 0) > 0).map((i) => i.id)
    );
  }, [items]);

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

            const content = (
              <>
                <div className="ai-fitness-status-card-header">
                  <h3 className="ai-fitness-status-card-title">{item.title}</h3>
                  <div className="ai-fitness-status-card-actions">
                    <span className="ai-fitness-status-badge">{item.status}</span>
                    {isExpandable && (
                      <span
                        className={`ai-fitness-status-more ${isOpen ? 'open' : ''}`}
                        aria-hidden="true"
                      >
                        More <span className="ai-fitness-status-more-chevron">▾</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="ai-fitness-status-card-description">{item.description}</p>

                {isExpandable && isOpen && (
                  <ul id={bulletsId} className="ai-fitness-status-bullets">
                    {bullets.map((bullet, idx) => (
                      <li key={`${item.id}-bullet-${idx}`}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </>
            );

            return isExpandable ? (
              <button
                key={item.id}
                type="button"
                className={`ai-fitness-status-card ai-fitness-status-card--expandable ${isOpen ? 'is-open' : ''}`}
                style={{ '--status-color': color } as React.CSSProperties}
                onClick={toggle}
                aria-expanded={isOpen}
                aria-controls={bulletsId}
              >
                {content}
              </button>
            ) : (
              <div
                key={item.id}
                className="ai-fitness-status-card"
                style={{ '--status-color': color } as React.CSSProperties}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIFitnessProgramStatus;

