import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Zap, User, Stethoscope } from 'lucide-react';
import { Doctor, VectorSearchQuery } from '../../types';
import { mockDoctors } from '../../data/mockData';
import { vectorSearch } from '../../utils/vectorUtils';

export default function DoctorSearch() {
  const [query, setQuery] = useState<VectorSearchQuery>({
    symptoms: [],
    urgency: 'Medium',
    specialization: '',
    location: '',
    preferredLanguage: '',
  });
  const [symptomInput, setSymptomInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ doctor: Doctor; similarity: number; reasoning: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !query.symptoms.includes(symptomInput.trim())) {
      setQuery({ ...query, symptoms: [...query.symptoms, symptomInput.trim()] });
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setQuery({ ...query, symptoms: query.symptoms.filter(s => s !== symptom) });
  };

  const handleSearch = () => {
    if (query.symptoms.length === 0) return;
    
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
      const results = vectorSearch(query, mockDoctors, 6);
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General'];
  const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'] as const;

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Find the Right Doctor</h2>
        
        {/* Symptoms Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your symptoms
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                placeholder="e.g., chest pain, headache, fever"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                onClick={handleAddSymptom}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Symptoms Tags */}
          {query.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {query.symptoms.map(symptom => (
                <span
                  key={symptom}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{symptom}</span>
                  <button
                    onClick={() => handleRemoveSymptom(symptom)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level
              </label>
              <select
                value={query.urgency}
                onChange={(e) => setQuery({ ...query, urgency: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {urgencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization (Optional)
              </label>
              <select
                value={query.specialization}
                onChange={(e) => setQuery({ ...query, specialization: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Any</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                value={query.preferredLanguage}
                onChange={(e) => setQuery({ ...query, preferredLanguage: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Any</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Marathi">Marathi</option>
                <option value="Punjabi">Punjabi</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={query.symptoms.length === 0 || isSearching}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Find Doctors</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Matched Doctors ({searchResults.length} results)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Ranked by vector similarity and real-time availability
            </p>
          </div>

          <div className="p-6 space-y-4">
            {searchResults.map(({ doctor, similarity, reasoning }, index) => (
              <div
                key={doctor.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{doctor.experience} years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-sm font-medium text-primary-600">
                        {(similarity * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.availability.slots > 0 
                        ? 'bg-accent-100 text-accent-800' 
                        : 'bg-critical-100 text-critical-800'
                    }`}>
                      {doctor.availability.slots > 0 ? 'Available' : 'Fully Booked'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{doctor.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Next: {new Date(doctor.availability.nextAvailable).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {doctor.availability.isEmergency && (
                      <Zap className="h-4 w-4 text-critical-500" />
                    )}
                    <span className="text-gray-600">
                      {doctor.availability.slots} slots available
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-600 mb-1">AI Reasoning:</div>
                  <div className="text-sm text-gray-800">{reasoning}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {doctor.languages.map(lang => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                  <button
                    disabled={doctor.availability.slots === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}