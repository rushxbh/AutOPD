import React from 'react';
import DashboardStats from '../components/Hospital/DashboardStats';
import BedManagement from '../components/Hospital/BedManagement';
import AppointmentQueue from '../components/Hospital/AppointmentQueue';
import InventoryDashboard from '../components/Hospital/InventoryDashboard';
import AgentMonitor from '../components/AgentSystem/AgentMonitor';
import VectorVisualization from '../components/VectorDisplay/VectorVisualization';
import { mockDoctors } from '../data/mockData';

export default function HospitalDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time hospital operations powered by AI vector analysis</p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <BedManagement />
        <AppointmentQueue />
      </div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        <InventoryDashboard />
        
        {/* AI System Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AgentMonitor />
          <VectorVisualization
            baseVector={mockDoctors[0].baseVector}
            deltaVector={mockDoctors[0].deltaVector}
            effectiveVector={mockDoctors[0].effectiveVector}
            title="Doctor Vector Analysis (Dr. Arun Sharma)"
          />
        </div>
      </div>
    </div>
  );
}