import React, { useState } from 'react';
import Header from './components/Layout/Header';
import VectorSearch from './components/Search/VectorSearch';
import LiveAnalytics from './components/Analytics/LiveAnalytics';
import HospitalDirectory from './components/Hospitals/HospitalDirectory';

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'analytics' | 'hospitals'>('search');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header view={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'search' && <VectorSearch />}
        {currentView === 'analytics' && <LiveAnalytics />}
        {currentView === 'hospitals' && <HospitalDirectory />}
      </main>
    </div>
  );
}

export default App;