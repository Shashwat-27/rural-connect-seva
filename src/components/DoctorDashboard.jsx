import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { LogOut, User, Clock, AlertCircle, Video, Pill, Send } from 'lucide-react';

export const DoctorDashboard = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [medicines, setMedicines] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [prescribing, setPrescribing] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_cases')
        .select(`
          *,
          patients (name, age, phone)
        `)
        .in('assessment_status', ['moderate', 'high'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch medical cases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleCaseSelect = (medicalCase) => {
    setSelectedCase(medicalCase);
    setPrescription(medicalCase.prescription || '');
    setMedicines(medicalCase.prescribed_medicines?.join(', ') || '');
    setDoctorNotes(medicalCase.doctor_notes || '');
  };

  const handlePrescribe = async () => {
    if (!selectedCase || !prescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter prescription details",
        variant: "destructive",
      });
      return;
    }

    setPrescribing(true);
    try {
      const medicineList = medicines.split(',').map(m => m.trim()).filter(m => m);

      const { error } = await supabase
        .from('medical_cases')
        .update({
          doctor_id: user?.id,
          prescription: prescription,
          prescribed_medicines: medicineList,
          doctor_notes: doctorNotes,
          status: 'prescribed',
        })
        .eq('id', selectedCase.id);

      if (error) throw error;

      // Send SMS notification
      try {
        const { error: smsError } = await supabase.functions.invoke('send-sms', {
          body: {
            caseId: selectedCase.id,
            phoneNumber: selectedCase.patients.phone,
            patientName: selectedCase.patients.name,
            prescription: prescription,
            medicines: medicineList,
          },
        });

        if (smsError) {
          console.error('SMS send failed:', smsError);
          toast({
            title: "Prescription Saved",
            description: "Prescription saved but SMS failed to send",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Prescription saved and SMS sent to patient",
          });
        }
      } catch (smsError) {
        console.error('SMS function error:', smsError);
        toast({
          title: "Prescription Saved",
          description: "Prescription saved but SMS failed to send",
          variant: "destructive",
        });
      }

      // Refresh cases
      await fetchCases();
      setSelectedCase(null);
      setPrescription('');
      setMedicines('');
      setDoctorNotes('');
    } catch (error) {
      console.error('Error prescribing:', error);
      toast({
        title: "Error",
        description: "Failed to send prescription",
        variant: "destructive",
      });
    } finally {
      setPrescribing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'moderate':
        return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>;
      case 'prescribed':
        return <Badge className="bg-green-100 text-green-800">Prescribed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-600">Doctor Dashboard</p>
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cases List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Medical Cases</CardTitle>
                <CardDescription>
                  Cases requiring your attention ({cases.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cases.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No cases available</p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {cases.map((medicalCase) => (
                      <Card
                        key={medicalCase.id}
                        className={`cursor-pointer transition-colors ${
                          selectedCase?.id === medicalCase.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCaseSelect(medicalCase)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{medicalCase.patients.name}</h4>
                              <p className="text-sm text-gray-600">Age: {medicalCase.patients.age}</p>
                            </div>
                            {getStatusBadge(medicalCase.assessment_status)}
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <p><strong>Symptoms:</strong> {medicalCase.symptoms.join(', ')}</p>
                            <p><strong>Severity Score:</strong> {medicalCase.severity_score}/10</p>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatDate(medicalCase.created_at)}
                            </div>
                            {medicalCase.video_url && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <Video className="h-4 w-4" />
                                <span className="text-xs">Video Available</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Case Details & Prescription */}
          <div>
            {selectedCase ? (
              <div className="space-y-6">
                {/* Patient Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCase.patients.name}</CardTitle>
                    <CardDescription>Patient Details & Vitals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Age:</strong> {selectedCase.patients.age}</p>
                        <p><strong>Phone:</strong> {selectedCase.patients.phone}</p>
                        <p><strong>BP:</strong> {selectedCase.blood_pressure_systolic}/{selectedCase.blood_pressure_diastolic}</p>
                        <p><strong>Blood Sugar:</strong> {selectedCase.blood_sugar} mg/dL</p>
                      </div>
                      <div>
                        <p><strong>Temperature:</strong> {selectedCase.temperature}°F</p>
                        <p><strong>Oxygen:</strong> {selectedCase.oxygen_saturation}%</p>
                        <p><strong>Severity:</strong> {selectedCase.severity_score}/10</p>
                        <p><strong>Status:</strong> {getStatusBadge(selectedCase.assessment_status)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p><strong>Symptoms:</strong></p>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedCase.symptoms.join(', ')}</p>
                    </div>
                    
                    <div className="mt-4">
                      <p><strong>AI Recommendation:</strong></p>
                      <p className="text-sm bg-blue-50 p-2 rounded">{selectedCase.ai_recommendation}</p>
                    </div>

                    {selectedCase.video_url && (
                      <div className="mt-4">
                        <p><strong>Patient Video:</strong></p>
                        <video
                          controls
                          className="w-full max-w-md rounded-lg"
                          src={selectedCase.video_url}
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Prescription Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Write Prescription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prescription">Prescription Details</Label>
                      <Textarea
                        id="prescription"
                        placeholder="Enter detailed prescription, dosage, and instructions..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicines">Medicines (comma-separated)</Label>
                      <Input
                        id="medicines"
                        placeholder="e.g., Paracetamol 500mg, Cough Syrup..."
                        value={medicines}
                        onChange={(e) => setMedicines(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Doctor Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes or follow-up instructions..."
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handlePrescribe}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={prescribing}
                    >
                      {prescribing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Sending Prescription...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Prescription via SMS
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a case to view details and write prescription</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};