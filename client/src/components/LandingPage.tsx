import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white h-screen font-sans antialiased">
      {/* Header */}
      <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md sticky top-0 z-10">
        <div className=" mx-auto py-4 px-6 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
            Zen-Z Ride Router
          </a>

  
          <button className="md:hidden focus:outline-none">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-24 md:py-36">
        <div className=" mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Revolutionize Your Commute
            <span className="text-green-400"> Today</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-300">
            Share rides, save money, and discover the fastest, most efficient routes to your destination.  Get real-time updates and connect with other commuters.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-black text-lg font-bold py-3 px-8 rounded-full shadow-xl transition-transform transform hover:scale-105 animate-pulse">
            <SignInButton />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className=" mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          {[
            { icon: '🚗', title: 'Ride Sharing', description: 'Connect with fellow commuters and share rides to reduce costs and your carbon footprint.' },
            { icon: '🗺', title: 'Optimized Routes', description: 'State-of-the-art route optimization to get you there in the quickest, most efficient way.' },
            { icon: '📍', title: 'Realtime Direction', description: 'Turn-by-turn directions to your destination, ensuring you never get lost.' },
            { icon: '📡', title: 'Live Tracking', description: 'Track your ride in real-time, so you always know where you are and when you arrive.' },
            { icon: '📜', title: 'History', description: 'View your ride history, including past routes and shared rides, for easy reference.' },
            { icon: '⚙', title: 'Customizable Profiles', description: 'Personalize your profile with preferences for ride sharing and route optimization.' },
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-800 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {/* Testimonial Cards */}
            {[
              { quote: 'Ride Router has transformed my commute! Incredibly convenient and efficient.', author: 'Happy Commuter' },
              { quote: 'Optimized routes save me time every day!', author: 'Satisfied User' },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-md">
                <p className="text-lg italic text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="text-green-400 font-semibold">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section id="contact" className="container mx-auto py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Commute?</h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Join thousands of users experiencing a smarter, more efficient way to travel.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-black text-lg font-bold py-3 px-8 rounded-full shadow-xl transition-transform transform hover:scale-105 animate-pulse">
          <SignInButton />
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 border-t border-gray-700">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Zen-Z Ride Router. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;