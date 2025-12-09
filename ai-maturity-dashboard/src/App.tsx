import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Bucket, MaturityData } from './types/maturity';
import Overview from './components/Overview';
import BucketDetail from './components/BucketDetail';
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
          <Route path="/" element={<Overview buckets={buckets} />} />
          <Route path="/bucket/:id" element={<BucketDetail buckets={buckets} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;









