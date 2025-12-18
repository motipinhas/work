import React, { useState, useMemo } from 'react';
import { Bucket, MaturityStage } from '../types/maturity';
import OverallScore from './OverallScore';
import BucketCard from './BucketCard';
import ComparisonView from './ComparisonView';
import './Overview.css';

interface OverviewProps {
  buckets: Bucket[];
}

type SortOption = 'name' | 'stage' | 'stageIndex';
type FilterOption = MaturityStage | 'all';

const Overview: React.FC<OverviewProps> = ({ buckets }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedBuckets, setSelectedBuckets] = useState<Set<string>>(new Set());

  const filteredAndSortedBuckets = useMemo(() => {
    let filtered = buckets;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((bucket) =>
        bucket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bucket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply stage filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((bucket) => bucket.stage === filterBy);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stage':
          return a.stage.localeCompare(b.stage);
        case 'stageIndex':
          return b.stageIndex - a.stageIndex; // Descending
        default:
          return 0;
      }
    });

    return sorted;
  }, [buckets, searchQuery, sortBy, filterBy]);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ buckets: filteredAndSortedBuckets }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-maturity-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Stage', 'Stage Index', 'Description'];
    const rows = filteredAndSortedBuckets.map((bucket) => [
      bucket.name,
      bucket.stage,
      bucket.stageIndex.toString(),
      bucket.description.replace(/,/g, ';'), // Replace commas to avoid CSV issues
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-maturity-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleBucketSelection = (bucketId: string) => {
    setSelectedBuckets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bucketId)) {
        newSet.delete(bucketId);
      } else {
        newSet.add(bucketId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedBuckets(new Set());
  };

  const handleCompare = () => {
    // Comparison view is automatically shown when showComparison is true
    // This function can be used for any additional logic if needed
  };

  const showComparison = selectedBuckets.size > 1;

  return (
    <div className="overview">
      <div className="overview-header">
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
      <OverallScore buckets={buckets} />
      
      <div className="overview-controls">
        <div className="overview-controls-row">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search buckets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <label htmlFor="filter-select">Filter by Stage:</label>
            <select
              id="filter-select"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="filter-select"
            >
              <option value="all">All Stages</option>
              <option value="Not Started">Not Started</option>
              <option value="Beginning">Beginning</option>
              <option value="Developing">Developing</option>
              <option value="Mature">Mature</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="sort-container">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="stage">Stage</option>
              <option value="stageIndex">Maturity Level</option>
            </select>
          </div>
        </div>

        <div className="overview-actions">
          <div className="export-buttons">
            <button onClick={handleExportJSON} className="export-button">
              Export JSON
            </button>
            <button onClick={handleExportCSV} className="export-button">
              Export CSV
            </button>
          </div>
          {selectedBuckets.size > 0 && (
            <div className="selection-info">
              <span>{selectedBuckets.size} selected</span>
              {selectedBuckets.size > 1 && (
                <button
                  onClick={handleCompare}
                  className="compare-button"
                >
                  Compare
                </button>
              )}
              <button onClick={clearSelection} className="clear-selection-button">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overview-buckets">
        <h2 className="overview-buckets-title">
          Maturity by Area
          {filteredAndSortedBuckets.length !== buckets.length && (
            <span className="results-count">
              ({filteredAndSortedBuckets.length} of {buckets.length})
            </span>
          )}
        </h2>
        {filteredAndSortedBuckets.length === 0 ? (
          <div className="no-results">
            <p>No buckets found matching your search criteria.</p>
          </div>
        ) : (
          <div className="overview-buckets-grid">
            {filteredAndSortedBuckets.map((bucket) => (
              <BucketCard
                key={bucket.id}
                bucket={bucket}
                isSelected={selectedBuckets.has(bucket.id)}
                onToggleSelection={() => toggleBucketSelection(bucket.id)}
              />
            ))}
          </div>
        )}
      </div>
      {showComparison && (
        <ComparisonView
          buckets={buckets}
          selectedIds={Array.from(selectedBuckets)}
          onClose={clearSelection}
        />
      )}
    </div>
  );
};

export default Overview;

