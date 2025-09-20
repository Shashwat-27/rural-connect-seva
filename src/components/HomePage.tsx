import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Clock, Shield, Smartphone, Wifi } from 'lucide-react';

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "AI-Powered Health Assessment",
      description: "Advanced AI evaluates symptoms and vital signs to provide instant preliminary diagnosis and treatment recommendations."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Remote Doctor Consultation",
      description: "Connect with qualified doctors through video calls for complex cases requiring professional medical attention."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: "24/7 Availability",
      description: "Access healthcare services round the clock, ensuring medical assistance is always available when needed."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Secure & Private",
      description: "All patient data is encrypted and securely stored, maintaining complete privacy and confidentiality."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices and tablets, making it easy to use in rural healthcare settings."
    },
    {
      icon: <Wifi className="h-8 w-8 text-teal-500" />,
      title: "Offline Capable",
      description: "Works even with poor internet connectivity, syncing data automatically when connection is restored."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">Rural TeleMedicine</h1>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Healthcare for <span className="text-blue-600">Everyone</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bringing quality healthcare to rural communities through AI-powered diagnostics, 
            remote consultations, and local healthcare operator support.
          </p>
          <Button 
            onClick={onLoginClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Start Healthcare Session
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Comprehensive Healthcare Solutions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Patient Registration</h3>
              <p className="text-gray-600">Healthcare operator registers patient details and basic information.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Assessment</h3>
              <p className="text-gray-600">AI analyzes vital signs and symptoms to determine severity level.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Treatment Plan</h3>
              <p className="text-gray-600">Get instant medication for simple cases or doctor consultation for complex ones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-semibold">Rural TeleMedicine</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering rural communities with accessible, affordable, and quality healthcare.
          </p>
          <div className="border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-500">
              © 2024 Rural TeleMedicine Platform. Bridging healthcare gaps with technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};