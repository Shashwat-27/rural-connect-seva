import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Clock, Shield, Smartphone, Wifi } from 'lucide-react';

export const HomePage = ({ onLoginClick }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-destructive" />,
      title: "AI-Powered Health Assessment",
      description: "Advanced AI evaluates symptoms and vital signs to provide instant preliminary diagnosis and treatment recommendations."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Remote Doctor Consultation",
      description: "Connect with qualified doctors through video calls for complex cases requiring professional medical attention."
    },
    {
      icon: <Clock className="h-8 w-8 text-success" />,
      title: "24/7 Availability",
      description: "Access healthcare services round the clock, ensuring medical assistance is always available when needed."
    },
    {
      icon: <Shield className="h-8 w-8 text-warning" />,
      title: "Secure & Private",
      description: "All patient data is encrypted and securely stored, maintaining complete privacy and confidentiality."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-accent-foreground" />,
      title: "Mobile-First Design",
      description: "Optimized for mobile devices and tablets, making it easy to use in rural healthcare settings."
    },
    {
      icon: <Wifi className="h-8 w-8 text-muted-foreground" />,
      title: "Offline Capable",
      description: "Works even with poor internet connectivity, syncing data automatically when connection is restored."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-destructive" />
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Rural TeleMedicine</h1>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Healthcare for <span className="text-primary bg-gradient-primary bg-clip-text text-transparent">Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Bringing quality healthcare to rural communities through AI-powered diagnostics, 
            remote consultations, and local healthcare operator support.
          </p>
          <Button 
            onClick={onLoginClick}
            size="lg"
            className="medical-button bg-primary hover:bg-primary-dark text-primary-foreground px-6 md:px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Healthcare Session
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8 md:mb-12">
            Comprehensive Healthcare Solutions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="medical-card border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-secondary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="medical-card bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Patient Registration</h3>
              <p className="text-muted-foreground leading-relaxed">Healthcare operator registers patient details and basic information.</p>
            </div>
            <div className="medical-card bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-success-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">AI Assessment</h3>
              <p className="text-muted-foreground leading-relaxed">AI analyzes vital signs and symptoms to determine severity level.</p>
            </div>
            <div className="medical-card bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-warning w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-warning-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Treatment Plan</h3>
              <p className="text-muted-foreground leading-relaxed">Get instant medication for simple cases or doctor consultation for complex ones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-6 w-6 text-destructive" />
            <h3 className="text-xl font-semibold text-foreground">Rural TeleMedicine</h3>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Empowering rural communities with accessible, affordable, and quality healthcare.
          </p>
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              © 2024 Rural TeleMedicine Platform. Bridging healthcare gaps with technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};