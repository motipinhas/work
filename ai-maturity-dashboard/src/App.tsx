import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bucket, MaturityData } from './types/maturity';
import { OrganizationProvider } from './contexts/OrganizationContext';
import AppLayout from './components/AppLayout';
import HomePage from './components/HomePage';
import Overview from './components/Overview';
import BucketDetail from './components/BucketDetail';
import KPIsView from './components/KPIsView';
import AIFitnessProgramStatus from './components/AIFitnessProgramStatus';
import maturityData from './data/maturityData.json';
import './App.css';

function App() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  useEffect(() => {
    // Load data from JSON file
    const data = maturityData as MaturityData;
    setBuckets(data.buckets);
  }, []);

  return (
    <BrowserRouter>
      <OrganizationProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Overview buckets={buckets} />
                </AppLayout>
              }
            />
            <Route
              path="/bucket/:id"
              element={
                <AppLayout>
                  <BucketDetail buckets={buckets} />
                </AppLayout>
              }
            />
            <Route
              path="/maturity-kpis"
              element={
                <AppLayout>
                  <KPIsView />
                </AppLayout>
              }
            />
            <Route
              path="/ai-fitness-program-status"
              element={
                <AppLayout>
                  <AIFitnessProgramStatus />
                </AppLayout>
              }
            />
          </Routes>
        </div>
      </OrganizationProvider>
    </BrowserRouter>
  );
}

export default App;













