import React from 'react';
import { Search, MapPin, Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  view: 'search' | 'analytics' | 'hospitals';
  onViewChange: (view: 'search' | 'analytics' | 'hospitals') => void;
}

export default function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">AutOPD</span>
             
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => onViewChange('search')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'search'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Smart Search</span>
              </button>
              <button
                onClick={() => onViewChange('analytics')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'analytics'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Live Analytics</span>
              </button>
              <button
                onClick={() => onViewChange('hospitals')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'hospitals'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Hospitals</span>
              </button>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-critical-500 ring-2 ring-white" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2 px-3 py-1 bg-accent-50 rounded-lg">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                <span className="text-sm text-accent-800 font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}