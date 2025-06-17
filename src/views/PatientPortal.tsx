import React, { useState } from 'react';
import { User, Search, Zap, Calendar, MapPin, Phone } from 'lucide-react';
import DoctorSearch from '../components/Patient/DoctorSearch';
import EmergencyBooking from '../components/Patient/EmergencyBooking';

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState<'search' | 'emergency' | 'appointments'>('search');

  const tabs = [
    { id: 'search', label: 'Find Doctors', icon: Search },
    { id: 'emergency', label: 'Emergency', icon: Zap },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
            <p className="text-gray-600 mt-1">AI-powered healthcare access with vector-based doctor matching</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
              <User className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-primary-800">Ayushman ID: AY-123456789</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Search className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">247</div>
              <div className="text-sm text-gray-600">Available Doctors</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">23 min</div>
              <div className="text-sm text-gray-600">Avg Wait Time</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-critical-100 rounded-lg">
              <Zap className="h-6 w-6 text-critical-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Emergency Care</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'search' && <DoctorSearch />}
        {activeTab === 'emergency' && <EmergencyBooking />}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Appointments</h2>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments scheduled</p>
              <p className="text-sm text-gray-400 mt-1">Book your first appointment using the doctor search</p>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="mt-8 bg-critical-50 border border-critical-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Phone className="h-5 w-5 text-critical-600" />
          <h3 className="font-medium text-critical-800">Emergency Contacts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-critical-800">National Emergency</div>
            <div className="text-critical-700">Call 108</div>
          </div>
          <div>
            <div className="font-medium text-critical-800">Medical Emergency</div>
            <div className="text-critical-700">Call 102</div>
          </div>
          <div>
            <div className="font-medium text-critical-800">Hospital Direct</div>
            <div className="text-critical-700">Call +91-11-2345-6789</div>
          </div>
        </div>
      </div>
    </div>
  );
}