import React from 'react';
import { Users, Bed, Clock, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, change, changeType, icon, color }: StatsCardProps) {
  const changeColor = changeType === 'positive' ? 'text-accent-600' : 
                     changeType === 'negative' ? 'text-critical-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Active Patients"
        value={247}
        change="+12% from yesterday"
        changeType="positive"
        icon={<Users className="h-6 w-6 text-white" />}
        color="bg-primary-500"
      />
      <StatsCard
        title="Bed Occupancy"
        value="78%"
        change="156/200 beds occupied"
        changeType="neutral"
        icon={<Bed className="h-6 w-6 text-white" />}
        color="bg-secondary-500"
      />
      <StatsCard
        title="Avg Wait Time"
        value="23 min"
        change="-8% from last week"
        changeType="positive"
        icon={<Clock className="h-6 w-6 text-white" />}
        color="bg-accent-500"
      />
      <StatsCard
        title="Critical Alerts"
        value={5}
        change="3 inventory, 2 equipment"
        changeType="negative"
        icon={<AlertTriangle className="h-6 w-6 text-white" />}
        color="bg-critical-500"
      />
    </div>
  );
}