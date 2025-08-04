// client/src/pages/About.tsx
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

export default function About() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        {/* Same navigation as Home.tsx */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-12 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About EasyRoutePlanner</h2>
            <p className="text-gray-600 mb-4">
              EasyRoutePlanner is a comprehensive route planning application designed to make your travel experience seamless.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to provide accurate, real-time route planning with multiple transportation options to suit your needs.
            </p>
            <p className="text-gray-600">
              Whether you're driving, taking public transit, or cycling, EasyRoutePlanner helps you find the best route.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}