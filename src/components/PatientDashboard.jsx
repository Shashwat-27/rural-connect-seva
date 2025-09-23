import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { VitalsEntryForm } from './VitalsEntryForm';
import { SymptomsForm } from './SymptomsForm';
import { AssessmentResultComponent } from './AssessmentResultComponent';
import { VideoRecordingComponent } from './VideoRecordingComponent';
import { VideoCallComponent } from './VideoCallComponent';
import { ResponsiveNavbar } from './ResponsiveNavbar';
import { useAIAssessment } from '../hooks/useAIAssessment';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Activity, 
  FileText, 
  ClipboardCheck, 
  Heart, 
  LogOut,
  Video,
  Download,
  AlertTriangle
} from 'lucide-react';

export const PatientDashboard = ({ onLogout }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState('registration');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const { assessSymptoms, loading } = useAIAssessment();
  const { saveFormData } = useOfflineSync();
  
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

  const steps = [
    { key: 'registration', title: t?.registration || 'Registration', icon: User },
    { key: 'vitals', title: t?.vitals || 'Vitals', icon: Activity },
    { key: 'symptoms', title: t?.symptoms || 'Symptoms', icon: FileText },
    { key: 'assessment', title: t?.assessment || 'Assessment', icon: ClipboardCheck },
  ];

  const getStepProgress = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStep);
    return ((stepIndex + 1) / steps.length) * 100;
  };

  const handlePatientInfoUpdate = (data) => {
    setFormData(prev => ({ ...prev, patientInfo: data }));
  };

  const handleVitalsUpdate = (data) => {
    setFormData(prev => ({ ...prev, vitals: data }));
  };

  const handleSymptomsUpdate = (data) => {
    setFormData(prev => ({ ...prev, symptoms: data }));
  };

  const handleSymptomsSubmit = async () => {
    try {
      const result = await assessSymptoms(formData);
      setAssessmentResult(result);
      setCurrentStep('assessment');
      
      // Save form data through offline sync system
      saveFormData({ ...formData, assessment: result });
      
      toast({
        title: t?.assessmentComplete || "Assessment Complete",
        description: t?.assessmentCompleteDesc || "AI assessment has been completed successfully.",
      });

      // Check if high risk case needs video call
      if (result?.riskLevel === 'high') {
        toast({
          title: t?.highRiskCase || "High Risk Case Detected",
          description: t?.highRiskCaseDesc || "This case requires immediate doctor consultation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t?.assessmentError || "Assessment Error",
        description: t?.assessmentErrorDesc || "Failed to complete assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewPatient = () => {
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
    setAssessmentResult(null);
    setCurrentStep('registration');
    setShowVideoCall(false);
  };

  const downloadPrescription = () => {
    if (!assessmentResult || !formData.patientInfo.name) {
      toast({
        title: "Error",
        description: "No prescription data available to download.",
        variant: "destructive",
      });
      return;
    }

    const prescriptionData = {
      patient: formData.patientInfo,
      vitals: formData.vitals,
      symptoms: formData.symptoms,
      assessment: assessmentResult,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const dataStr = JSON.stringify(prescriptionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_${formData.patientInfo.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Prescription downloaded successfully.",
    });
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
            onSubmit={handleSymptomsSubmit}
            onBack={() => setCurrentStep('vitals')}
            isLoading={loading}
          />
        );
      case 'assessment':
        return (
          <div className="space-y-6">
            <AssessmentResultComponent 
              result={assessmentResult}
              patientData={formData}
            />
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleNewPatient}
                className="flex-1 medical-button bg-primary hover:bg-primary-dark text-primary-foreground"
              >
                <User className="h-4 w-4 mr-2" />
                New Patient
              </Button>
              
              <Button
                onClick={downloadPrescription}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Prescription
              </Button>
              
              {assessmentResult?.riskLevel === 'high' && (
                <Button
                  onClick={() => setShowVideoCall(true)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Emergency Call
                </Button>
              )}
            </div>

            {/* Video Recording Component */}
            <VideoRecordingComponent caseId={formData.patientInfo.name || 'unknown'} />
          </div>
        );
      default:
        return null;
    }
  };

  if (showVideoCall) {
    return (
      <VideoCallComponent
        patientData={formData}
        assessmentResult={assessmentResult}
        onEnd={() => setShowVideoCall(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Patient Dashboard</h1>
                <p className="text-sm text-muted-foreground">Healthcare Assessment Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Section */}
        <Card className="medical-card mb-6 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Healthcare Assessment
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Step {steps.findIndex(s => s.key === currentStep) + 1} of {steps.length}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-4">
              <Progress value={getStepProgress()} className="h-3" />
            </div>
            
            {/* Step Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.key === currentStep;
                const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
                
                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : isCompleted 
                        ? 'bg-success text-success-foreground shadow-md' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <StepIcon className="h-6 w-6" />
                    <span className="text-sm text-center font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};