import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Home from './pages/Home';
import PreDepartureLogin from './pages/PreDepartureLogin';
import LivingAbroadLogin from './pages/LivingAbroadLogin';
import PreDepartureDashboard from './pages/PreDepartureDashboard';
import LivingAbroadDashboard from './pages/LivingAbroadDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Link to="/" className="text-3xl font-bold text-gray-900 flex items-center hover:text-blue-600 transition-colors">
              <Plane className="w-8 h-8 mr-3 text-blue-600" />
              Global Journey Assistant
            </Link>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pre-departure/login" element={<PreDepartureLogin />} />
          <Route path="/living-abroad/login" element={<LivingAbroadLogin />} />
          <Route path="/pre-departure/dashboard" element={<PreDepartureDashboard />} />
          <Route path="/living-abroad/dashboard" element={<LivingAbroadDashboard />} />
        </Routes>

        <footer className="bg-gray-50 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500">© 2025 Global Journey Assistant. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App