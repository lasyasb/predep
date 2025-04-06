import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Home, Languages, Building2, Users, HelpCircle, GraduationCap } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        <Icon className="w-8 h-8 text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TrackSection({ title, features, loginPath }: { 
  title: string, 
  features: Array<{ icon: React.ElementType, title: string, description: string }>,
  loginPath: string 
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => navigate(loginPath)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const preDepartureFeatures = [
    {
      icon: Plane,
      title: "Visa & Passport Guide",
      description: "Learn about visa requirements and passport procedures for your destination country."
    },
    {
      icon: Languages,
      title: "Language Learning",
      description: "Interactive language learning through games and flashcards."
    },
    {
      icon: Home,
      title: "Accommodation Search",
      description: "Find and compare housing options in your destination city."
    },
    {
      icon: Building2,
      title: "Institution Guide",
      description: "Information about your college or company."
    }
  ];

  const abroadLivingFeatures = [
    {
      icon: Users,
      title: "Community Connect",
      description: "Connect with people living around you and build your network."
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Easy access to embassy contacts and emergency assistance."
    },
    {
      icon: GraduationCap,
      title: "Mentorship",
      description: "Train and guide newcomers to your country."
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Complete Guide to Living Abroad</h2>
        <p className="text-xl text-gray-600">Choose your journey track and let us guide you every step of the way</p>
      </div>

      <TrackSection 
        title="Pre-Departure Training" 
        features={preDepartureFeatures}
        loginPath="/pre-departure/login"
      />

      <TrackSection 
        title="Living Abroad" 
        features={abroadLivingFeatures}
        loginPath="/living-abroad/login"
      />
    </main>
  );
}