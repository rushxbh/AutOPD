import React from 'react';
import { TrendingUp, Brain, Target, Zap } from 'lucide-react';

interface VectorVisualizationProps {
  baseVector: number[];
  deltaVector: number[];
  effectiveVector: number[];
  title: string;
}

export default function VectorVisualization({ 
  baseVector, 
  deltaVector, 
  effectiveVector, 
  title 
}: VectorVisualizationProps) {
  // Display only first 20 dimensions for readability
  const displayDimensions = 20;
  const base = baseVector.slice(0, displayDimensions);
  const delta = deltaVector.slice(0, displayDimensions);
  const effective = effectiveVector.slice(0, displayDimensions);

  const maxVal = Math.max(...effective.map(Math.abs));
  const minVal = Math.min(...effective);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Vector Equation */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Vector Composition:</div>
          <div className="flex items-center space-x-2 text-sm font-mono">
            <span className="text-primary-600">Effective</span>
            <span>=</span>
            <span className="text-secondary-600">Base</span>
            <span>+</span>
            <span className="text-accent-600">Delta</span>
          </div>
        </div>

        {/* Vector Bars */}
        <div className="space-y-3">
          {/* Base Vector */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Target className="h-4 w-4 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-600">Base Vector</span>
            </div>
            <div className="flex space-x-1">
              {base.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 rounded-sm relative"
                  style={{ height: '8px' }}
                >
                  <div
                    className="bg-secondary-500 rounded-sm transition-all duration-300"
                    style={{
                      height: '100%',
                      width: `${Math.abs(val) / maxVal * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delta Vector */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="h-4 w-4 text-accent-600" />
              <span className="text-sm font-medium text-accent-600">Delta Vector (Real-time)</span>
            </div>
            <div className="flex space-x-1">
              {delta.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 rounded-sm relative"
                  style={{ height: '8px' }}
                >
                  <div
                    className={`rounded-sm transition-all duration-300 ${
                      val >= 0 ? 'bg-accent-500' : 'bg-critical-500'
                    }`}
                    style={{
                      height: '100%',
                      width: `${Math.abs(val) / maxVal * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Effective Vector */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-600">Effective Vector</span>
            </div>
            <div className="flex space-x-1">
              {effective.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 rounded-sm relative"
                  style={{ height: '12px' }}
                >
                  <div
                    className="bg-primary-500 rounded-sm transition-all duration-300"
                    style={{
                      height: '100%',
                      width: `${Math.abs(val) / maxVal * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vector Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-secondary-600">
              {base.reduce((sum, val) => sum + Math.abs(val), 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Base Magnitude</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-accent-600">
              {delta.reduce((sum, val) => sum + Math.abs(val), 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Delta Magnitude</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary-600">
              {effective.reduce((sum, val) => sum + Math.abs(val), 0).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">Effective Magnitude</div>
          </div>
        </div>
      </div>
    </div>
  );
}