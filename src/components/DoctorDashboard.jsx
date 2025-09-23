import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ResponsiveNavbar } from './ResponsiveNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  Search,
  User,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Video,
  Download,
  Eye,
  Calendar,
  Heart,
  Stethoscope
} from 'lucide-react';

export const DoctorDashboard = ({ onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState('');

  // Mock patient cases data
  const [cases, setCases] = useState([
    {
      id: 'CASE001',
      patientName: 'राम कुमार',
      age: 45,
      gender: 'Male',
      riskLevel: 'high',
      status: 'pending',
      symptoms: ['chest pain', 'shortness of breath', 'dizziness'],
      vitals: {
        bloodPressure: '160/100',
        temperature: '38.5°C',
        heartRate: '95 bpm',
        oxygenSaturation: '96%'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      operator: 'OP001',
      priority: 'urgent'
    },
    {
      id: 'CASE002',
      patientName: 'सुनीता देवी',
      age: 32,
      gender: 'Female',
      riskLevel: 'medium',
      status: 'pending',
      symptoms: ['fever', 'headache', 'body ache'],
      vitals: {
        bloodPressure: '120/80',
        temperature: '39.2°C',
        heartRate: '88 bpm',
        oxygenSaturation: '98%'
      },
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      operator: 'OP002',
      priority: 'normal'
    },
    {
      id: 'CASE003',
      patientName: 'अनिल शर्मा',
      age: 58,
      gender: 'Male',
      riskLevel: 'low',
      status: 'completed',
      symptoms: ['mild cough', 'throat pain'],
      vitals: {
        bloodPressure: '130/85',
        temperature: '37.8°C',
        heartRate: '72 bpm',
        oxygenSaturation: '99%'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      operator: 'OP001',
      priority: 'low',
      consultationNotes: 'Prescribed rest and warm water gargling. Follow up in 3 days if symptoms persist.'
    }
  ]);

  const getRiskBadgeVariant = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'default';
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesTab = activeTab === 'all' || case_.status === activeTab;
    const matchesSearch = case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCaseSelect = (case_) => {
    setSelectedCase(case_);
    setConsultationNotes(case_.consultationNotes || '');
  };

  const handleStartConsultation = (caseId) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId 
        ? { ...case_, status: 'in-progress' }
        : case_
    ));
    toast({
      title: "Consultation Started",
      description: "Patient consultation has been initiated.",
    });
  };

  const handleCompleteConsultation = () => {
    if (!selectedCase || !consultationNotes.trim()) {
      toast({
        title: "Error",
        description: "Please add consultation notes before completing.",
        variant: "destructive",
      });
      return;
    }

    setCases(prev => prev.map(case_ => 
      case_.id === selectedCase.id 
        ? { ...case_, status: 'completed', consultationNotes }
        : case_
    ));

    setSelectedCase({ ...selectedCase, status: 'completed', consultationNotes });
    
    toast({
      title: "Consultation Completed",
      description: "Patient consultation has been completed successfully.",
    });
  };

  const handleVideoCall = (caseId) => {
    toast({
      title: "Video Call Initiated",
      description: "Connecting to video call with patient...",
    });
    // Here you would integrate with actual video calling service
  };

  const downloadCaseReport = (case_) => {
    const reportData = {
      caseId: case_.id,
      patient: {
        name: case_.patientName,
        age: case_.age,
        gender: case_.gender
      },
      vitals: case_.vitals,
      symptoms: case_.symptoms,
      riskLevel: case_.riskLevel,
      consultationNotes: case_.consultationNotes || 'No notes available',
      timestamp: case_.timestamp.toISOString(),
      operator: case_.operator
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case_report_${case_.id}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Case report has been downloaded successfully.",
    });
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: cases.filter(c => c.status === 'pending').length },
    { key: 'in-progress', label: 'In Progress', count: cases.filter(c => c.status === 'in-progress').length },
    { key: 'completed', label: 'Completed', count: cases.filter(c => c.status === 'completed').length },
    { key: 'all', label: 'All Cases', count: cases.length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Patient Consultation Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Cases List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header and Search */}
            <Card className="medical-card shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Patient Cases
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage and review patient consultations
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients or case ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-1">
                    {tab.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Cases List */}
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredCases.map((case_) => (
                  <Card 
                    key={case_.id} 
                    className={`medical-card cursor-pointer transition-all hover:shadow-lg ${
                      selectedCase?.id === case_.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleCaseSelect(case_)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{case_.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Case ID: {case_.id} • Age: {case_.age} • {case_.gender}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getRiskBadgeVariant(case_.riskLevel)}>
                            {case_.riskLevel.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(case_.status)}>
                            {case_.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Symptoms:</p>
                          <p className="text-sm text-muted-foreground">
                            {case_.symptoms.join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Vitals:</p>
                          <p className="text-sm text-muted-foreground">
                            BP: {case_.vitals.bloodPressure}, Temp: {case_.vitals.temperature}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {case_.timestamp.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          {case_.status === 'pending' && (
                            <>
                              {case_.riskLevel === 'high' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoCall(case_.id);
                                  }}
                                >
                                  <Video className="h-4 w-4 mr-1" />
                                  Emergency Call
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartConsultation(case_.id);
                                }}
                              >
                                <User className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            </>
                          )}
                          {case_.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadCaseReport(case_);
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Report
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredCases.length === 0 && (
                  <Card className="medical-card">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Cases Found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No cases match your search criteria.' : 'No cases available in this category.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Case Details */}
          <div className="space-y-6">
            {selectedCase ? (
              <>
                {/* Patient Details */}
                <Card className="medical-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Patient Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-foreground">{selectedCase.patientName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Age</Label>
                        <p className="text-foreground">{selectedCase.age}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Gender</Label>
                        <p className="text-foreground">{selectedCase.gender}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Case ID</Label>
                      <p className="text-foreground">{selectedCase.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getRiskBadgeVariant(selectedCase.riskLevel)}>
                        {selectedCase.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(selectedCase.status)}>
                        {selectedCase.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Vitals */}
                <Card className="medical-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Activity className="h-5 w-5 text-success" />
                      Vital Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(selectedCase.vitals).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-sm font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Symptoms */}
                <Card className="medical-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <FileText className="h-5 w-5 text-warning" />
                      Symptoms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Consultation Notes */}
                <Card className="medical-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Consultation Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter consultation notes, diagnosis, and treatment recommendations..."
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      className="min-h-[120px]"
                      disabled={selectedCase.status === 'completed'}
                    />
                    
                    {selectedCase.status !== 'completed' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCompleteConsultation}
                          className="flex-1 medical-button bg-success hover:bg-success text-success-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Consultation
                        </Button>
                        {selectedCase.riskLevel === 'high' && (
                          <Button
                            variant="destructive"
                            onClick={() => handleVideoCall(selectedCase.id)}
                          >
                            <Video className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {selectedCase.status === 'completed' && (
                      <Button
                        variant="outline"
                        onClick={() => downloadCaseReport(selectedCase)}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Case Report
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="medical-card shadow-lg">
                <CardContent className="p-8 text-center">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Case</h3>
                  <p className="text-muted-foreground">
                    Choose a patient case from the list to view details and manage consultation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};