// client/src/pages/Contact.tsx
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

export default function Contact() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        {/* Same navigation as Home.tsx */}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-12 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">support@easyrouteplanner.com</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">123 Route Street, Navigation City, 10001</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}