import React, { useState, useEffect } from 'react';
import { Bot, Activity, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { AgentUpdate } from '../../types';
import { mockAgentUpdates } from '../../data/mockData';

export default function AgentMonitor() {
  const [updates, setUpdates] = useState<AgentUpdate[]>(mockAgentUpdates);
  const [isActive, setIsActive] = useState(true);

  // Simulate real-time agent updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newUpdate: AgentUpdate = {
        timestamp: new Date().toISOString(),
        type: ['doctor_availability', 'bed_status', 'inventory_update'][Math.floor(Math.random() * 3)] as any,
        entityId: `entity-${Date.now()}`,
        deltaVector: new Array(30).fill(0).map(() => (Math.random() - 0.5) * 0.5),
        reasoning: [
          'Availability status updated based on appointment completion',
          'Bed status changed due to patient discharge',
          'Inventory levels updated via barcode scan',
          'Emergency mode activated due to critical patient',
          'Delta vector adjusted for temporal decay patterns',
        ][Math.floor(Math.random() * 5)],
        confidence: 0.8 + Math.random() * 0.2,
      };

      setUpdates(current => [newUpdate, ...current.slice(0, 9)]); // Keep last 10 updates
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getTypeIcon = (type: AgentUpdate['type']) => {
    switch (type) {
      case 'doctor_availability':
        return <Activity className="h-4 w-4 text-primary-500" />;
      case 'bed_status':
        return <CheckCircle className="h-4 w-4 text-accent-500" />;
      case 'inventory_update':
        return <TrendingUp className="h-4 w-4 text-warning-500" />;
      case 'emergency_alert':
        return <AlertCircle className="h-4 w-4 text-critical-500" />;
    }
  };

  const getTypeColor = (type: AgentUpdate['type']) => {
    switch (type) {
      case 'doctor_availability':
        return 'bg-primary-100 text-primary-800';
      case 'bed_status':
        return 'bg-accent-100 text-accent-800';
      case 'inventory_update':
        return 'bg-warning-100 text-warning-800';
      case 'emergency_alert':
        return 'bg-critical-100 text-critical-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Agent Monitor</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isActive ? 'bg-accent-100 text-accent-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>{isActive ? 'Active' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
            >
              {isActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Agent Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <div className="text-lg font-bold text-primary-600">{updates.length}</div>
            <div className="text-xs text-gray-600">Total Updates</div>
          </div>
          <div className="text-center p-3 bg-accent-50 rounded-lg">
            <div className="text-lg font-bold text-accent-600">
              {updates.filter(u => u.confidence > 0.9).length}
            </div>
            <div className="text-xs text-gray-600">High Confidence</div>
          </div>
          <div className="text-center p-3 bg-warning-50 rounded-lg">
            <div className="text-lg font-bold text-warning-600">
              {(updates.reduce((sum, u) => sum + u.confidence, 0) / updates.length * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Avg Confidence</div>
          </div>
          <div className="text-center p-3 bg-critical-50 rounded-lg">
            <div className="text-lg font-bold text-critical-600">
              {updates.filter(u => u.type === 'emergency_alert').length}
            </div>
            <div className="text-xs text-gray-600">Emergency Alerts</div>
          </div>
        </div>

        {/* Live Update Stream */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Real-Time Agent Updates</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {updates.map((update, index) => (
              <div
                key={`${update.timestamp}-${index}`}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow animate-fade-in"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(update.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                      {update.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="text-sm text-gray-800 mb-2">{update.reasoning}</div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Entity: {update.entityId}</span>
                  <div className="flex items-center space-x-1">
                    <span>Confidence:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-primary-500 rounded-full transition-all duration-300"
                          style={{ width: `${update.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-medium">{(update.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}