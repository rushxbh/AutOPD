import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, TrendingDown, AlertTriangle, Activity, Bed, Users, Clock } from 'lucide-react';
import { AnalyticsData, BedAvailability } from '../../types';
import { getHospitalAnalytics, getBedTrends } from '../../utils/mongoUtils';
import { delhiBedAvailability } from '../../data/delhiHealthData';

export default function LiveAnalytics() {
  const [bedData, setBedData] = useState<BedAvailability[]>(delhiBedAvailability);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBedData(current => 
        current.map(bed => ({
          ...bed,
          bedCounts: {
            ...bed.bedCounts,
            available: Math.max(0, bed.bedCounts.available + (Math.random() > 0.5 ? 1 : -1)),
            occupied: bed.bedCounts.total - bed.bedCounts.available,
            icu: {
              ...bed.bedCounts.icu,
              available: Math.max(0, bed.bedCounts.icu.available + (Math.random() > 0.7 ? 1 : -1))
            }
          },
          timestamp: new Date().toISOString()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Generate analytics from bed data
  useEffect(() => {
    const generateAnalytics = async () => {
      const hospitalTrends = await getHospitalAnalytics(bedData);
      const trends = await getBedTrends(bedData, timeRange);
      
      const districtSummary = bedData.reduce((acc, bed) => {
        const existing = acc.find(d => d.district === bed.district);
        if (existing) {
          existing.totalBeds += bed.bedCounts.total;
          existing.availableBeds += bed.bedCounts.available;
        } else {
          acc.push({
            district: bed.district,
            totalBeds: bed.bedCounts.total,
            availableBeds: bed.bedCounts.available,
            occupancyRate: ((bed.bedCounts.total - bed.bedCounts.available) / bed.bedCounts.total) * 100,
            criticalHospitals: 0
          });
        }
        return acc;
      }, [] as any[]);

      // Update occupancy rates and critical hospitals
      districtSummary.forEach(district => {
        district.occupancyRate = ((district.totalBeds - district.availableBeds) / district.totalBeds) * 100;
        district.criticalHospitals = bedData.filter(bed => 
          bed.district === district.district && 
          (bed.bedCounts.available / bed.bedCounts.total) < 0.1
        ).length;
      });

      const realTimeAlerts = bedData
        .filter(bed => bed.bedCounts.available < bed.bedCounts.total * 0.1)
        .map(bed => ({
          type: 'bed_shortage' as const,
          message: `${bed.hospitalName} has only ${bed.bedCounts.available} beds available`,
          hospitalId: bed.hospitalId,
          severity: bed.bedCounts.available === 0 ? 'critical' as const : 'high' as const,
          timestamp: new Date().toISOString()
        }));

      setAnalytics({
        hospitalTrends,
        districtSummary,
        realTimeAlerts
      });
    };

    generateAnalytics();
  }, [bedData, timeRange]);

  const districts = ['all', ...Array.from(new Set(bedData.map(bed => bed.district)))];
  const filteredData = selectedDistrict === 'all' ? bedData : bedData.filter(bed => bed.district === selectedDistrict);

  const totalBeds = filteredData.reduce((sum, bed) => sum + bed.bedCounts.total, 0);
  const availableBeds = filteredData.reduce((sum, bed) => sum + bed.bedCounts.available, 0);
  const occupancyRate = ((totalBeds - availableBeds) / totalBeds) * 100;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-primary-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Live Healthcare Analytics</h1>
        <p className="text-secondary-100 text-lg">
          Real-time bed availability and hospital capacity insights powered by MongoDB aggregation pipelines
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {districts.map(district => (
                  <option key={district} value={district}>
                    {district === 'all' ? 'All Districts' : district}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-2 bg-accent-50 rounded-lg">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-sm text-accent-800 font-medium">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-3xl font-bold text-gray-900">{totalBeds.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Bed className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <p className="text-3xl font-bold text-accent-600">{availableBeds.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-lg">
              <Activity className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-3xl font-bold text-warning-600">{occupancyRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-3xl font-bold text-critical-600">
                {analytics?.realTimeAlerts.length || 0}
              </p>
            </div>
            <div className="p-3 bg-critical-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-critical-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Capacity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Bed Capacity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hospitalName" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bedCounts.total" fill="#3B82F6" name="Total Beds" />
              <Bar dataKey="bedCounts.available" fill="#10B981" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Distribution by District</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.districtSummary || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ district, percent }) => `${district} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalBeds"
              >
                {(analytics?.districtSummary || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hospital Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Hospital Performance Dashboard</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time capacity and availability metrics</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ICU Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((bed) => {
                const occupancy = ((bed.bedCounts.total - bed.bedCounts.available) / bed.bedCounts.total) * 100;
                const status = occupancy > 90 ? 'critical' : occupancy > 75 ? 'high' : 'normal';
                
                return (
                  <tr key={bed._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bed.hospitalName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{bed.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bed.bedCounts.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-accent-600">{bed.bedCounts.available}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-600">{bed.bedCounts.icu.available}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{occupancy.toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        status === 'critical' ? 'bg-critical-100 text-critical-800' :
                        status === 'high' ? 'bg-warning-100 text-warning-800' :
                        'bg-accent-100 text-accent-800'
                      }`}>
                        {status === 'critical' ? 'Critical' : status === 'high' ? 'High Load' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Alerts */}
      {analytics?.realTimeAlerts && analytics.realTimeAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Alerts</h3>
          </div>
          <div className="p-6 space-y-4">
            {analytics.realTimeAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-critical-50 border-critical-500' :
                  alert.severity === 'high' ? 'bg-warning-50 border-warning-500' :
                  'bg-primary-50 border-primary-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-critical-600' :
                    alert.severity === 'high' ? 'text-warning-600' :
                    'text-primary-600'
                  }`} />
                  <span className="font-medium text-gray-900">{alert.message}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}