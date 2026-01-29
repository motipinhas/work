import React, { useMemo, useState, useEffect } from 'react';
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
import ModuleCard from './ModuleCard';
import SortableModuleCard from './SortableModuleCard';
import ThemeToggle from './ThemeToggle';
import OrganizationPane from './OrganizationPane';
import { OrganizationNode } from '../types/organization';
import { calculateOverallScore } from '../utils/maturityUtils';
import { calculateOverallKPIScore } from '../utils/kpiUtils';
import { MaturityData } from '../types/maturity';
import { KPIData } from '../types/kpis';
import aiFitnessProgramStatusData from '../data/aiFitnessProgramStatus.json';
import {
  FITNESS_STATUS_COLORS,
  FitnessStatusData,
  FitnessStatusItem,
  getOverallFitnessStatus,
} from '../types/aiFitnessProgramStatus';
import maturityData from '../data/maturityData.json';
import kpisData from '../data/kpis.json';
import './HomePage.css';

const HOME_MODULE_ORDER_STORAGE_KEY = 'home-module-order';

type HomeModuleId = 'maturity-dashboard' | 'maturity-kpis' | 'ai-fitness-program-status';

const DEFAULT_HOME_MODULE_ORDER: HomeModuleId[] = [
  'maturity-dashboard',
  'maturity-kpis',
  'ai-fitness-program-status',
];

const loadHomeModuleOrder = (): HomeModuleId[] | null => {
  try {
    const stored = localStorage.getItem(HOME_MODULE_ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveHomeModuleOrder = (order: HomeModuleId[]) => {
  try {
    localStorage.setItem(HOME_MODULE_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    console.error('Failed to save home module order:', error);
  }
};

const HomePage: React.FC = () => {
  const [maturityScore, setMaturityScore] = useState<number>(0);
  const [kpiScore, setKpiScore] = useState<number>(0);
  const [programStatus, setProgramStatus] = useState<string>('Gray');
  const [programStatusColor, setProgramStatusColor] = useState<string>(FITNESS_STATUS_COLORS.Gray);
  const [programStatusUpdatedAt, setProgramStatusUpdatedAt] = useState<string>('');
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationNode | null>(null);
  const [isPaneOpen, setIsPaneOpen] = useState(true);
  const [moduleOrder, setModuleOrder] = useState<HomeModuleId[]>(
    () => loadHomeModuleOrder() ?? DEFAULT_HOME_MODULE_ORDER
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Calculate maturity score
    const maturity = maturityData as MaturityData;
    const maturityOverallScore = calculateOverallScore(maturity.buckets);
    setMaturityScore(maturityOverallScore);

    // Calculate KPI score
    const kpis = kpisData as KPIData;
    const kpiOverallScore = calculateOverallKPIScore(kpis.kpis);
    setKpiScore(kpiOverallScore);

    // Calculate AI Fitness Program overall status
    const programData = aiFitnessProgramStatusData as FitnessStatusData;
    const items: FitnessStatusItem[] = programData.items ?? [];
    const overall = getOverallFitnessStatus(items);
    setProgramStatus(overall);
    setProgramStatusColor(FITNESS_STATUS_COLORS[overall] ?? FITNESS_STATUS_COLORS.Gray);

    const updatedAt = programData.updatedAt;
    if (updatedAt) {
      const d = new Date(updatedAt);
      const formatted = Number.isNaN(d.getTime())
        ? updatedAt
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          }).format(d);
      setProgramStatusUpdatedAt(`Updated ${formatted}`);
    } else {
      setProgramStatusUpdatedAt('');
    }
  }, []);

  const handleOrganizationSelect = (org: OrganizationNode | null) => {
    setSelectedOrganization(org);
    console.log('Selected organization:', org);
  };

  const orderedModules = useMemo(() => {
    const all: { id: HomeModuleId; node: React.ReactNode }[] = [
      {
        id: 'maturity-dashboard',
        node: (
          <ModuleCard
            title="Maturity Dashboard"
            description="View overall maturity scores, explore maturity by area, and compare different buckets. Get insights into your AI maturity journey across all key areas."
            icon="📊"
            route="/dashboard"
            color="#4a90e2"
            score={maturityScore}
          />
        ),
      },
      {
        id: 'maturity-kpis',
        node: (
          <ModuleCard
            title="Maturity KPIs"
            description="Track and monitor key performance indicators for AI maturity. Analyze trends and measure progress across different maturity dimensions."
            icon="📈"
            route="/maturity-kpis"
            color="#50c878"
            score={kpiScore}
          />
        ),
      },
      {
        id: 'ai-fitness-program-status',
        node: (
          <ModuleCard
            title="AI Fitness Program Status"
            description="Status view across core program dimensions. Track overall state (Green/Yellow/Red/Gray) and the key reasons behind each status."
            icon="🧭"
            route="/ai-fitness-program-status"
            color="#667eea"
            statusLabel={programStatus}
            statusColor={programStatusColor}
            statusMeta={programStatusUpdatedAt}
          />
        ),
      },
    ];

    const map = new Map(all.map((m) => [m.id, m]));
    const ordered: { id: HomeModuleId; node: React.ReactNode }[] = [];
    const used = new Set<HomeModuleId>();

    moduleOrder.forEach((id) => {
      const m = map.get(id);
      if (m) {
        ordered.push(m);
        used.add(id);
      }
    });

    all.forEach((m) => {
      if (!used.has(m.id)) ordered.push(m);
    });

    return ordered;
  }, [kpiScore, maturityScore, moduleOrder, programStatus, programStatusColor, programStatusUpdatedAt]);

  const orderedIds = useMemo(() => orderedModules.map((m) => m.id), [orderedModules]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setModuleOrder(() => {
      const current = orderedIds;
      const oldIndex = current.findIndex((id) => id === active.id);
      const newIndex = current.findIndex((id) => id === over.id);
      const next = arrayMove(current, oldIndex, newIndex) as HomeModuleId[];
      saveHomeModuleOrder(next);
      return next;
    });
  };

  return (
    <div className={`home-page ${isPaneOpen ? 'pane-open' : 'pane-closed'}`}>
      <div className={`home-page-sidebar ${isPaneOpen ? 'open' : 'closed'}`}>
        <OrganizationPane onOrganizationSelect={handleOrganizationSelect} />
      </div>
      <div className="home-page-main">
        <div className="home-page-header">
          <button
            className="home-page-toggle"
            onClick={() => setIsPaneOpen(!isPaneOpen)}
            aria-label={isPaneOpen ? 'Hide organization pane' : 'Show organization pane'}
          >
            {isPaneOpen ? '◀' : '▶'}
          </button>
          <div className="home-page-header-content">
            <div className="home-page-header-top">
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
              <ThemeToggle />
            </div>
            <h1 className="home-page-title">Amdocs AI Fitness</h1>
            <p className="home-page-subtitle">Agentic AI Progress Status</p>
          </div>
        </div>

        <div className="home-page-modules">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
              <div className="modules-grid">
                {orderedModules.map((m) => (
                  <SortableModuleCard key={m.id} id={m.id}>
                    {m.node}
                  </SortableModuleCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {selectedOrganization && (
        <div className="home-page-banner">
          <span className="home-page-banner-text">
            Viewing data for: <strong>{selectedOrganization.name}</strong> ({selectedOrganization.type})
          </span>
          <button
            className="home-page-banner-close"
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

export default HomePage;

