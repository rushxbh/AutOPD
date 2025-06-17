import React, { useState, useEffect } from 'react';
import { Bed as BedIcon, User, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Bed } from '../../types';
import { mockBeds } from '../../data/mockData';

export default function BedManagement() {
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [selectedWard, setSelectedWard] = useState<string>('all');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBeds(current => current.map(bed => ({
        ...bed,
        // Randomly change occupancy status for demo
        isOccupied: Math.random() > 0.7 ? !bed.isOccupied : bed.isOccupied,
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const wards = ['all', ...Array.from(new Set(beds.map(bed => bed.ward)))];
  const filteredBeds = selectedWard === 'all' ? beds : beds.filter(bed => bed.ward === selectedWard);

  const getBedStatusColor = (bed: Bed) => {
    if (bed.isOccupied) {
      return bed.type === 'ICU' ? 'bg-critical-100 border-critical-300' : 'bg-warning-100 border-warning-300';
    }
    return bed.type === 'ICU' ? 'bg-accent-100 border-accent-300' : 'bg-gray-100 border-gray-300';
  };

  const getBedStatusText = (bed: Bed) => {
    return bed.isOccupied ? 'Occupied' : 'Available';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Real-Time Bed Management</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {wards.map(ward => (
                <option key={ward} value={ward}>
                  {ward === 'all' ? 'All Wards' : ward}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Bed Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-accent-50 rounded-lg">
            <div className="text-2xl font-bold text-accent-600">
              {filteredBeds.filter(bed => !bed.isOccupied).length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <div className="text-2xl font-bold text-warning-600">
              {filteredBeds.filter(bed => bed.isOccupied && bed.type !== 'ICU').length}
            </div>
            <div className="text-sm text-gray-600">General Occupied</div>
          </div>
          <div className="text-center p-4 bg-critical-50 rounded-lg">
            <div className="text-2xl font-bold text-critical-600">
              {filteredBeds.filter(bed => bed.isOccupied && bed.type === 'ICU').length}
            </div>
            <div className="text-sm text-gray-600">ICU Occupied</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round((filteredBeds.filter(bed => bed.isOccupied).length / filteredBeds.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
        </div>

        {/* Bed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeds.map(bed => (
            <div
              key={bed.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getBedStatusColor(bed)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BedIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{bed.id}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bed.isOccupied 
                    ? 'bg-critical-100 text-critical-800' 
                    : 'bg-accent-100 text-accent-800'
                }`}>
                  {getBedStatusText(bed)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{bed.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ward:</span>
                  <span className="font-medium">{bed.ward}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Floor:</span>
                  <span className="font-medium">{bed.floor}</span>
                </div>
              </div>

              {bed.patient && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{bed.patient.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{bed.patient.condition}</div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Admitted: {new Date(bed.patient.admissionTime).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {bed.equipment.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Equipment:</div>
                  <div className="flex flex-wrap gap-1">
                    {bed.equipment.map(eq => (
                      <span
                        key={eq}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}