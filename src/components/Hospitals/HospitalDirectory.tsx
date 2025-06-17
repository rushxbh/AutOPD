import React, { useState } from 'react';
import { MapPin, Phone, Star, Bed, Users, Clock, Globe, Shield, Zap } from 'lucide-react';
import { Hospital } from '../../types';
import { delhiHospitals } from '../../data/delhiHealthData';

export default function HospitalDirectory() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'availability'>('rating');

  const hospitalTypes = ['all', 'Government', 'Private', 'Trust', 'Corporate'];
  
  const filteredHospitals = delhiHospitals
    .filter(hospital => filterType === 'all' || hospital.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'availability':
          return b.bedCapacity.available - a.bedCapacity.available;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Hospital Directory</h1>
        <p className="text-accent-100 text-lg">
          Comprehensive hospital information with real-time bed availability
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {hospitalTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="availability">Bed Availability</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredHospitals.length} hospitals found
          </div>
        </div>
      </div>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHospitals.map(hospital => (
          <HospitalCard
            key={hospital._id}
            hospital={hospital}
            onSelect={() => setSelectedHospital(hospital)}
            isSelected={selectedHospital?._id === hospital._id}
          />
        ))}
      </div>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <HospitalDetailModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}
    </div>
  );
}

function HospitalCard({ hospital, onSelect, isSelected }: {
  hospital: Hospital;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const occupancyRate = ((hospital.bedCapacity.total - hospital.bedCapacity.available) / hospital.bedCapacity.total) * 100;
  
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-primary-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                hospital.type === 'Government' ? 'bg-accent-100 text-accent-800' :
                hospital.type === 'Private' ? 'bg-secondary-100 text-secondary-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {hospital.type}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{hospital.district}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{hospital.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hospital.metadata.emergencyServices && (
              <div className="p-1 bg-critical-100 rounded">
                <Zap className="h-4 w-4 text-critical-600" />
              </div>
            )}
            {hospital.metadata.verified && (
              <div className="p-1 bg-accent-100 rounded">
                <Shield className="h-4 w-4 text-accent-600" />
              </div>
            )}
          </div>
        </div>

        {/* Bed Availability */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{hospital.bedCapacity.available}</div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <div className="text-lg font-bold text-primary-600">{hospital.bedCapacity.icu.available}</div>
            <div className="text-xs text-gray-600">ICU</div>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <div className="text-lg font-bold text-secondary-600">{hospital.bedCapacity.emergency.available}</div>
            <div className="text-xs text-gray-600">Emergency</div>
          </div>
          <div className="text-center p-3 bg-warning-50 rounded-lg">
            <div className="text-lg font-bold text-warning-600">{occupancyRate.toFixed(0)}%</div>
            <div className="text-xs text-gray-600">Occupancy</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Specialties:</div>
          <div className="flex flex-wrap gap-1">
            {hospital.specialties.slice(0, 4).map(specialty => (
              <span key={specialty} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                {specialty}
              </span>
            ))}
            {hospital.specialties.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{hospital.specialties.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{hospital.contact.phone}</span>
          </div>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

function HospitalDetailModal({ hospital, onClose }: {
  hospital: Hospital;
  onClose: () => void;
}) {
  const occupancyRate = ((hospital.bedCapacity.total - hospital.bedCapacity.available) / hospital.bedCapacity.total) * 100;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{hospital.name}</h2>
              <p className="text-gray-600 mt-1">{hospital.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <Bed className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">{hospital.bedCapacity.total}</div>
              <div className="text-sm text-gray-600">Total Beds</div>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-lg">
              <Users className="h-6 w-6 text-accent-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent-600">{hospital.bedCapacity.available}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <Star className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary-600">{hospital.rating}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-warning-600">{occupancyRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Occupancy</div>
            </div>
          </div>

          {/* Detailed Bed Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Availability Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">General Beds</h4>
                <div className="text-2xl font-bold text-gray-900">{hospital.bedCapacity.general.available}</div>
                <div className="text-sm text-gray-600">of {hospital.bedCapacity.general.total} available</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">ICU Beds</h4>
                <div className="text-2xl font-bold text-primary-600">{hospital.bedCapacity.icu.available}</div>
                <div className="text-sm text-gray-600">of {hospital.bedCapacity.icu.total} available</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Emergency Beds</h4>
                <div className="text-2xl font-bold text-critical-600">{hospital.bedCapacity.emergency.available}</div>
                <div className="text-sm text-gray-600">of {hospital.bedCapacity.emergency.total} available</div>
              </div>
            </div>
          </div>

          {/* Specialties and Facilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map(specialty => (
                  <span key={specialty} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.facilities.map(facility => (
                  <span key={facility} className="px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Phone</div>
                  <div className="text-gray-600">{hospital.contact.phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Address</div>
                  <div className="text-gray-600">{hospital.address}</div>
                </div>
              </div>
              {hospital.contact.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Website</div>
                    <a href={hospital.contact.website} className="text-primary-600 hover:text-primary-700">
                      {hospital.contact.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Accreditation */}
          {hospital.accreditation.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accreditation</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.accreditation.map(acc => (
                  <span key={acc} className="px-3 py-1 bg-accent-100 text-accent-800 text-sm rounded-full flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}