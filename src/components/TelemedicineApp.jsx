import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { LanguageToggle } from './LanguageToggle';
import { SyncStatus } from './SyncStatus';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { VitalsEntryForm } from './VitalsEntryForm';
import { SymptomsForm } from './SymptomsForm';

const TelemedicineAppContent = () => {
  const [currentStep, setCurrentStep] = useState('registration');
  const [formData, setFormData] = useState({
    patientInfo: {
      name: '',
      age: '',
      gender: '',
      address: '',
      phone: '',
    },
    vitals: {
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      bloodSugar: '',
      temperature: '',
      oxygen: '',
    },
    symptoms: [],
  });

  const { saveFormData } = useOfflineSync();

  const handlePatientInfoUpdate = (data) => {
    setFormData(prev => ({ ...prev, patientInfo: data }));
  };

  const handleVitalsUpdate = (data) => {
    setFormData(prev => ({ ...prev, vitals: data }));
  };

  const handleSymptomsUpdate = (data) => {
    setFormData(prev => ({ ...prev, symptoms: data }));
  };

  const handleSubmit = () => {
    // Save form data through offline sync system
    saveFormData(formData);
    
    // Reset form and go back to first step
    setFormData({
      patientInfo: {
        name: '',
        age: '',
        gender: '',
        address: '',
        phone: '',
      },
      vitals: {
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        bloodSugar: '',
        temperature: '',
        oxygen: '',
      },
      symptoms: [],
    });
    setCurrentStep('registration');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'registration':
        return (
          <PatientRegistrationForm
            data={formData.patientInfo}
            onUpdate={handlePatientInfoUpdate}
            onNext={() => setCurrentStep('vitals')}
          />
        );
      case 'vitals':
        return (
          <VitalsEntryForm
            data={formData.vitals}
            onUpdate={handleVitalsUpdate}
            onNext={() => setCurrentStep('symptoms')}
            onBack={() => setCurrentStep('registration')}
          />
        );
      case 'symptoms':
        return (
          <SymptomsForm
            data={formData.symptoms}
            onUpdate={handleSymptomsUpdate}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep('vitals')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <LanguageToggle />
          <SyncStatus />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 ${currentStep === 'registration' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'registration' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="text-sm">Registration</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'vitals' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'vitals' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="text-sm">Vitals</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'symptoms' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'symptoms' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm">Symptoms</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ 
                width: currentStep === 'registration' ? '33%' : 
                       currentStep === 'vitals' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        {/* Current Form Step */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export const TelemedicineApp = () => {
  return (
    <LanguageProvider>
      <TelemedicineAppContent />
    </LanguageProvider>
  );
};