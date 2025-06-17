import React, { useState, useEffect } from 'react';
import { Package, TrendingDown, TrendingUp, AlertTriangle, Truck } from 'lucide-react';
import { InventoryItem } from '../../types';
import { mockInventory } from '../../data/mockData';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  // Simulate real-time stock updates
  useEffect(() => {
    const interval = setInterval(() => {
      setInventory(current => 
        current.map(item => {
          const change = Math.floor(Math.random() * 10) - 5; // Random change -5 to +5
          const newStock = Math.max(0, item.currentStock + change);
          
          let status: InventoryItem['status'] = 'Normal';
          if (newStock <= item.minThreshold * 0.5) status = 'Critical';
          else if (newStock <= item.minThreshold) status = 'Low';
          else if (newStock >= item.maxThreshold) status = 'Overstocked';
          
          return {
            ...item,
            currentStock: newStock,
            status,
            lastUpdated: new Date().toISOString(),
          };
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Critical':
        return 'bg-critical-100 text-critical-800 border-critical-200';
      case 'Low':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'Normal':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'Overstocked':
        return 'bg-primary-100 text-primary-800 border-primary-200';
    }
  };

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-critical-500" />;
      case 'Low':
        return <TrendingDown className="h-4 w-4 text-warning-500" />;
      case 'Normal':
        return <Package className="h-4 w-4 text-accent-500" />;
      case 'Overstocked':
        return <TrendingUp className="h-4 w-4 text-primary-500" />;
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    return Math.min(100, (item.currentStock / item.maxThreshold) * 100);
  };

  const criticalItems = inventory.filter(item => item.status === 'Critical');
  const lowItems = inventory.filter(item => item.status === 'Low');

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {(criticalItems.length > 0 || lowItems.length > 0) && (
        <div className="bg-critical-50 border border-critical-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-critical-500" />
            <h3 className="font-medium text-critical-800">Inventory Alerts</h3>
          </div>
          <p className="text-sm text-critical-700 mt-1">
            {criticalItems.length} critical items and {lowItems.length} low stock items require attention
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Truck className="h-4 w-4" />
              <span>Auto Reorder</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-critical-50 rounded-lg">
              <div className="text-2xl font-bold text-critical-600">{criticalItems.length}</div>
              <div className="text-sm text-gray-600">Critical Items</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">{lowItems.length}</div>
              <div className="text-sm text-gray-600">Low Stock Items</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">
                {inventory.filter(item => item.status === 'Normal').length}
              </div>
              <div className="text-sm text-gray-600">Normal Stock</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                ₹{inventory.reduce((sum, item) => sum + (item.currentStock * 10), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>

          {/* Inventory Items */}
          <div className="space-y-4">
            {inventory.map(item => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <span className="text-gray-500 text-sm">Current Stock:</span>
                    <div className="font-medium">{item.currentStock} {item.unit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Min Threshold:</span>
                    <div className="font-medium">{item.minThreshold} {item.unit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Reorder Point:</span>
                    <div className="font-medium">{item.reorderPoint} {item.unit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Last Updated:</span>
                    <div className="font-medium text-xs">
                      {new Date(item.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Stock Level Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.status === 'Critical' ? 'bg-critical-500' :
                      item.status === 'Low' ? 'bg-warning-500' :
                      item.status === 'Overstocked' ? 'bg-primary-500' : 'bg-accent-500'
                    }`}
                    style={{ width: `${getStockPercentage(item)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {getStockPercentage(item).toFixed(1)}% of maximum capacity
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}