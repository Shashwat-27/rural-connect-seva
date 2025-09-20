import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { HomePage } from '../components/HomePage';
import { LoginPage } from '../components/LoginPage';
import { PatientDashboard } from '../components/PatientDashboard';
import { DoctorDashboard } from '../components/DoctorDashboard';

type AppState = 'home' | 'login' | 'dashboard';

const Index = () => {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>('home');

  const handleLoginClick = () => setAppState('login');
  const handleLoginSuccess = () => setAppState('dashboard');
  const handleBackToHome = () => setAppState('home');
  const handleLogout = () => setAppState('home');

  const renderContent = () => {
    if (user && appState === 'dashboard') {
      return user.role === 'doctor' ? (
        <DoctorDashboard onLogout={handleLogout} />
      ) : (
        <PatientDashboard onLogout={handleLogout} />
      );
    }

    switch (appState) {
      case 'home':
        return <HomePage onLoginClick={handleLoginClick} />;
      case 'login':
        return <LoginPage onBack={handleBackToHome} onLoginSuccess={handleLoginSuccess} />;
      default:
        return <HomePage onLoginClick={handleLoginClick} />;
    }
  };

  return <LanguageProvider>{renderContent()}</LanguageProvider>;
};

export default Index;
