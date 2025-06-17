import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Stethoscope, Filter, Zap, Phone, Calendar } from 'lucide-react';
import { SearchQuery, SearchResult, Doctor, Hospital } from '../../types';
import { performVectorSearch } from '../../utils/mongoUtils';
import { delhiDoctors, delhiHospitals } from '../../data/delhiHealthData';

export default function VectorSearch() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'doctors' | 'hospitals'>('doctors');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(10);
  const [filters, setFilters] = useState({
    specialization: '',
    experience: { min: 0, max: 50 },
    rating: { min: 0 },
    availability: false,
    emergencyOnly: false,
    hospitalType: [] as string[]
  });
  const [results, setResults] = useState<SearchResult<Doctor | Hospital>[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Location access denied, using default Delhi location');
          setLocation([77.2090, 28.6139]); // Default to Delhi center
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      const searchQuery: SearchQuery = {
        text: query,
        location: location ? { coordinates: location, radius } : undefined,
        filters: {
          ...filters,
          hospitalType: filters.hospitalType.length > 0 ? filters.hospitalType : undefined
        },
        limit: 10
      };

      const searchResults = await performVectorSearch(
        searchType,
        searchQuery,
        searchType === 'doctors' ? delhiDoctors : delhiHospitals
      );

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Emergency Medicine', 'General Medicine', 'Surgery'
  ];

  const hospitalTypes = ['Government', 'Private', 'Trust', 'Corporate'];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">AI-Powered Healthcare Search</h1>
        <p className="text-primary-100 text-lg">
          Find doctors and hospitals using natural language with MongoDB Atlas Vector Search
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Search Type Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSearchType('doctors')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === 'doctors'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Stethoscope className="h-4 w-4 inline mr-2" />
              Find Doctors
            </button>
            <button
              onClick={() => setSearchType('hospitals')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                searchType === 'hospitals'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Find Hospitals
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              searchType === 'doctors' 
                ? "e.g., 'Cardiologist near me with good reviews' or 'Heart specialist for chest pain'"
                : "e.g., 'Hospital with ICU beds available' or 'Emergency care near Connaught Place'"
            }
            className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors">
              {isSearching ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location & Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={20}>Within 20 km</option>
                  <option value={50}>Within 50 km</option>
                </select>
              </div>

              {/* Specialization */}
              {searchType === 'doctors' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Any Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hospital Type */}
              {searchType === 'hospitals' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Type
                  </label>
                  <select
                    value={filters.hospitalType[0] || ''}
                    onChange={(e) => setFilters({ 
                      ...filters, 
                      hospitalType: e.target.value ? [e.target.value] : [] 
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Any Type</option>
                    {hospitalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating.min}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    rating: { min: Number(e.target.value) } 
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>

            {/* Availability Filters */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available Now</span>
              </label>
              
              {searchType === 'doctors' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.emergencyOnly}
                    onChange={(e) => setFilters({ ...filters, emergencyOnly: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Emergency Available</span>
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({results.length} found)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Ranked by AI similarity and real-time availability
            </p>
          </div>

          <div className="p-6 space-y-6">
            {results.map((result, index) => (
              <div
                key={result.document._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {searchType === 'doctors' ? (
                  <DoctorResult result={result as SearchResult<Doctor>} index={index} />
                ) : (
                  <HospitalResult result={result as SearchResult<Hospital>} index={index} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && query && !isSearching && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}

// Doctor Result Component
function DoctorResult({ result, index }: { result: SearchResult<Doctor>; index: number }) {
  const doctor = result.document;
  
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{doctor.name}</h4>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
              {(result.score * 100).toFixed(1)}% match
            </span>
            {doctor.availability.isEmergency && (
              <span className="px-2 py-1 bg-critical-100 text-critical-800 text-xs font-medium rounded-full flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Emergency
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">{doctor.specialization} • {doctor.experience} years experience</p>
          
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{doctor.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{doctor.hospital}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{doctor.availability.slots} slots available</span>
            </div>
            {result.distance && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{result.distance.toFixed(1)} km away</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-700 mb-3">{doctor.bio}</p>
          
          {result.highlights && result.highlights.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Matched content:</div>
              <div className="text-sm text-gray-600 italic">
                {result.highlights[0]}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {doctor.languages.map(lang => (
              <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex space-x-2">
        <button className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Calendar className="h-4 w-4" />
          <span>Book</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </button>
      </div>
    </div>
  );
}

// Hospital Result Component
function HospitalResult({ result, index }: { result: SearchResult<Hospital>; index: number }) {
  const hospital = result.document;
  const occupancyRate = ((hospital.bedCapacity.total - hospital.bedCapacity.available) / hospital.bedCapacity.total) * 100;
  
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-6 w-6 text-secondary-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">{hospital.name}</h4>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
              {(result.score * 100).toFixed(1)}% match
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              hospital.type === 'Government' ? 'bg-accent-100 text-accent-800' :
              hospital.type === 'Private' ? 'bg-secondary-100 text-secondary-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {hospital.type}
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">{hospital.address}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-900">{hospital.bedCapacity.available}</div>
              <div className="text-xs text-gray-600">Available Beds</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-900">{hospital.bedCapacity.icu.available}</div>
              <div className="text-xs text-gray-600">ICU Available</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-900">{occupancyRate.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Occupancy</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-gray-900">{hospital.rating}</span>
              </div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">Specialties:</div>
            <div className="flex flex-wrap gap-1">
              {hospital.specialties.slice(0, 5).map(specialty => (
                <span key={specialty} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                  {specialty}
                </span>
              ))}
              {hospital.specialties.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{hospital.specialties.length - 5} more
                </span>
              )}
            </div>
          </div>
          
          {result.distance && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{result.distance.toFixed(1)} km away</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex space-x-2">
        <button className="flex items-center space-x-1 px-3 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
          <MapPin className="h-4 w-4" />
          <span>Directions</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </button>
      </div>
    </div>
  );
}