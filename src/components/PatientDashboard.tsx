import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { VitalsEntryForm } from './VitalsEntryForm';
import { SymptomsForm } from './SymptomsForm';
import { VideoRecordingComponent } from './VideoRecordingComponent';
import { AssessmentResultComponent } from './AssessmentResultComponent';
import { useAIAssessment } from '../hooks/useAIAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LogOut, User, Heart, Stethoscope, FileText, Video } from 'lucide-react';

type Step = 'registration' | 'vitals' | 'symptoms' | 'assessment' | 'video' | 'completed';

interface FormData {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    address: string;
    phone: string;
  };
  vitals: {
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
    bloodSugar: string;
    temperature: string;
    oxygen: string;
  };
  symptoms: string[];
}

interface PatientDashboardProps {
  onLogout: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { assessPatient, isAssessing } = useAIAssessment();
  
  const [currentStep, setCurrentStep] = useState<Step>('registration');
  const [formData, setFormData] = useState<FormData>({
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
  
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);

  const steps = [
    { key: 'registration', label: 'Registration', icon: <User className="h-4 w-4" /> },
    { key: 'vitals', label: 'Vitals', icon: <Heart className="h-4 w-4" /> },
    { key: 'symptoms', label: 'Symptoms', icon: <Stethoscope className="h-4 w-4" /> },
    { key: 'assessment', label: 'Assessment', icon: <FileText className="h-4 w-4" /> },
    { key: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.key === step);
  const currentStepIndex = getStepIndex(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handlePatientInfoUpdate = (data: FormData['patientInfo']) => {
    setFormData(prev => ({ ...prev, patientInfo: data }));
  };

  const handleVitalsUpdate = (data: FormData['vitals']) => {
    setFormData(prev => ({ ...prev, vitals: data }));
  };

  const handleSymptomsUpdate = (data: string[]) => {
    setFormData(prev => ({ ...prev, symptoms: data }));
  };

  const createPatientRecord = async () => {
    try {
      // Create patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: formData.patientInfo.name,
          age: parseInt(formData.patientInfo.age),
          gender: formData.patientInfo.gender,
          address: formData.patientInfo.address,
          phone: formData.patientInfo.phone,
          operator_id: user?.id,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Create medical case
      const { data: caseData, error: caseError } = await supabase
        .from('medical_cases')
        .insert({
          patient_id: patientData.id,
          operator_id: user?.id,
          blood_pressure_systolic: parseInt(formData.vitals.bloodPressureSystolic),
          blood_pressure_diastolic: parseInt(formData.vitals.bloodPressureDiastolic),
          blood_sugar: parseInt(formData.vitals.bloodSugar),
          temperature: parseFloat(formData.vitals.temperature),
          oxygen_saturation: parseInt(formData.vitals.oxygen),
          symptoms: formData.symptoms,
        })
        .select()
        .single();

      if (caseError) throw caseError;

      setCurrentCaseId(caseData.id);
      return caseData.id;
    } catch (error) {
      console.error('Error creating patient record:', error);
      toast({
        title: "Error",
        description: "Failed to create patient record",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAssessment = async () => {
    setCurrentStep('assessment');
    
    try {
      const caseId = await createPatientRecord();
      const result = await assessPatient(formData.vitals, formData.symptoms);
      setAssessmentResult(result);

      // Update case with assessment result
      await supabase
        .from('medical_cases')
        .update({
          assessment_status: result.status,
          ai_recommendation: result.recommendation,
          severity_score: result.severity_score,
          prescribed_medicines: result.medicines || [],
        })
        .eq('id', caseId);

      // If simple case, mark as completed
      if (result.status === 'simple') {
        setCurrentStep('completed');
        toast({
          title: "Assessment Complete",
          description: "Simple condition detected. Medicines prescribed.",
        });
      } else if (result.status === 'moderate') {
        setCurrentStep('video');
      } else {
        toast({
          title: "High Risk Detected",
          description: "Immediate medical attention required!",
          variant: "destructive",
        });
        setCurrentStep('completed');
      }
    } catch (error) {
      console.error('Assessment failed:', error);
      toast({
        title: "Assessment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleVideoComplete = async (videoUrl: string) => {
    if (currentCaseId) {
      await supabase
        .from('medical_cases')
        .update({
          video_url: videoUrl,
          status: 'moderate'
        })
        .eq('id', currentCaseId);
    }
    
    setCurrentStep('completed');
    toast({
      title: "Video Recorded",
      description: "Video sent to doctor for review",
    });
  };

  const startNewCase = () => {
    setCurrentStep('registration');
    setFormData({
      patientInfo: { name: '', age: '', gender: '', address: '', phone: '' },
      vitals: { bloodPressureSystolic: '', bloodPressureDiastolic: '', bloodSugar: '', temperature: '', oxygen: '' },
      symptoms: [],
    });
    setAssessmentResult(null);
    setCurrentCaseId(null);
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
            onSubmit={handleAssessment}
            onBack={() => setCurrentStep('vitals')}
          />
        );
      case 'assessment':
        return (
          <AssessmentResultComponent
            result={assessmentResult}
            isLoading={isAssessing}
          />
        );
      case 'video':
        return (
          <VideoRecordingComponent
            onComplete={handleVideoComplete}
            onBack={() => setCurrentStep('symptoms')}
          />
        );
      case 'completed':
        return (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-green-600">Case Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Patient assessment has been completed successfully.</p>
              {assessmentResult && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>Status:</strong> {assessmentResult.status}</p>
                  <p><strong>Recommendation:</strong> {assessmentResult.recommendation}</p>
                  {assessmentResult.medicines && (
                    <div>
                      <strong>Medicines:</strong>
                      <ul className="list-disc list-inside">
                        {assessmentResult.medicines.map((medicine: string, index: number) => (
                          <li key={index}>{medicine}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <Button onClick={startNewCase} className="w-full">
                Start New Case
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              {user?.role === 'operator' ? <User className="h-6 w-6 text-blue-600" /> : <Heart className="h-6 w-6 text-blue-600" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        {currentStep !== 'completed' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-xs ${
                      index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-full mb-1 ${
                      index <= currentStepIndex ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {step.icon}
                    </div>
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};