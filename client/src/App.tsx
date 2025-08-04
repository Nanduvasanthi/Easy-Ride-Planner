import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home"; // This is your Easy Route Planner's Home component

// Import Clerk components for conditional rendering
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'; // <-- ADD THIS LINE

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Add routes specific to this Easy Route Planner app if any, e.g., for different planner views */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Global Styles for the Header and Body */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        
        /* Basic Reset - important for consistent styling */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Body styles applied globally for the Easy Route Planner app */
        body {
          font-family: 'Inter', sans-serif;
          background-color: #ffffff; /* White background for the entire page */
          color: #1a202c; /* Black text color */
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Header Styles - Copied from your main app's header */
        .header {
          padding: 1rem 2rem;
          background-color: #ffffff; /* White background for the header */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
        }

        .left-nav-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo {
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          background-color: #f97316; /* Orange color for the 'E' logo */
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 1.125rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c; /* Black text for "Easy Ride Planner" */
        }

        .nav-list {
          list-style: none;
          display: flex;
          gap: 1.5rem;
        }

        /* Link colors: Ensure they are black by default and orange on hover */
        .nav-link {
          font-size: 1.125rem;
          font-weight: 500;
          color: #1a202c; /* Black for navigation links */
          text-decoration: none;
          transition: color 0.2s ease-in-out;
        }

        .nav-link:hover {
          color: #f97316; /* Orange on hover */
        }
        
        .right-auth-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        /* Auth button colors: Ensure text is black and orange on hover */
        .auth-button {
            text-decoration: none;
            color: #1a202c; /* Black text for Sign In/Sign Up buttons */
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            border: 1px solid #e2e8f0;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        
        .auth-button:hover {
            background-color: #f97316;
            color: #ffffff;
            border-color: #f97316;
        }
        `}
      </style>

      {/* The main container for the entire application */}
      <div className="easy-ride-planner-app">
        {/* Header section with branding and navigation - Adapted for wouter and external links */}
        <header className="header">
          {/* Left section: Logo and navigation links */}
          <div className="left-nav-section">
            <div className="header-brand">
              <div className="logo">
                <span>E</span>
              </div>
              <h1 className="logo-text">Easy Ride Planner</h1>
            </div>
            
            <nav>
              <ul className="nav-list">
                {/* Links back to the main app (http://localhost:5175/) */}
                <li><a href="http://localhost:5175/" className="nav-link">Home</a></li>
                <li><a href="http://localhost:5175/about" className="nav-link">About</a></li>
                <li><a href="http://localhost:5175/contact" className="nav-link">Contact</a></li>
                {/* Link to the Planner (this app's root) */}
                <li><Link to="/" className="nav-link">Planner</Link></li> 
              </ul>
            </nav>
          </div>
          
          {/* Right section: Authentication buttons - Now using Clerk's components */}
          <div className="right-auth-section">
            <SignedIn>
              {/* This will display the user's profile picture or initials */}
              <UserButton afterSignOutUrl="http://localhost:5175/" /> {/* Redirect to main app's home on sign out */}
            </SignedIn>
            <SignedOut>
              {/* These links direct to the main app's Clerk pages for sign-in/sign-up */}
              <a href="http://localhost:5175/sign-in" className="auth-button">Sign In</a>
              <a href="http://localhost:5175/sign-up" className="auth-button">Sign Up</a>
            </SignedOut>
          </div>
        </header>

        {/* The Router component now renders below the persistent header */}
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;