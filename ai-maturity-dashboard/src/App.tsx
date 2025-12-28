import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bucket, MaturityData } from './types/maturity';
import HomePage from './components/HomePage';
import Overview from './components/Overview';
import BucketDetail from './components/BucketDetail';
import KPIsView from './components/KPIsView';
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
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Overview buckets={buckets} />} />
          <Route path="/bucket/:id" element={<BucketDetail buckets={buckets} />} />
          <Route path="/maturity-kpis" element={<KPIsView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;













