// client/src/components/RoutePlanner.tsx
import { useState } from 'react';

export default function RoutePlanner() {
  const [startLocation, setStartLocation] = useState('Guntur, Andhra Pradesh, India');
  const [destination, setDestination] = useState('Vijayawada (Rural), NTR, Andhra Pradesh, India');
  const [transportMode, setTransportMode] = useState('Driving');
  const [weather, setWeather] = useState('3°C');
  const [condition, setCondition] = useState('Savory');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">EasyRoutePlanner</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Plan Your Route</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
              <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                {startLocation}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                {destination}
              </div>
            </div>
          </div>
          
          <button className="text-blue-600 text-sm font-medium mb-4">
            Use Current Location
          </button>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Transportation Mode</h3>
            <div className="flex space-x-4">
              {['Driving', 'Public Transit', 'Cycling'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTransportMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    transportMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Find Routes →
          </button>
          
          <p className="text-gray-500 text-sm mt-2">
            Save your routes feature coming soon!
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Turn-by-Turn Directions</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">{weather}</span>
            <span className="text-gray-700">{condition}</span>
          </div>
        </div>
      </div>
    </div>
  );
}