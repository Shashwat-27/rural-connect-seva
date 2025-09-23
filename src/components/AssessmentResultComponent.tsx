import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Pill } from 'lucide-react';

interface AssessmentResult {
  status: 'simple' | 'moderate' | 'high';
  severity_score: number;
  recommendation: string;
  medicines?: string[];
}

interface AssessmentResultComponentProps {
  result: AssessmentResult | null;
  isLoading: boolean;
}

export const AssessmentResultComponent: React.FC<AssessmentResultComponentProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <h3 className="text-lg font-semibold">AI Assessment in Progress</h3>
            <p className="text-gray-600">Analyzing symptoms and vital signs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'simple':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          title: 'Simple Condition',
          description: 'Condition can be treated with general medication'
        };
      case 'moderate':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          title: 'Moderate Condition',
          description: 'Requires video consultation with doctor'
        };
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          title: 'High Risk Condition',
          description: 'Immediate medical attention required'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          title: 'Unknown',
          description: 'Assessment incomplete'
        };
    }
  };

  const statusConfig = getStatusConfig(result.status);

  return (
    <div className="space-y-6">
      {/* Assessment Result */}
      <Card className={`border-2 ${statusConfig.color.includes('green') ? 'border-green-200' : 
                                   statusConfig.color.includes('yellow') ? 'border-yellow-200' : 
                                   'border-red-200'}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {statusConfig.icon}
            <div>
              <CardTitle className="text-xl">{statusConfig.title}</CardTitle>
              <CardDescription>{statusConfig.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={statusConfig.color}>
                Severity Score: {result.severity_score}/10
              </Badge>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI Recommendation:</h4>
              <p className="text-gray-700">{result.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medicines for Simple Cases */}
      {result.status === 'simple' && result.medicines && result.medicines.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Pill className="h-5 w-5" />
              Prescribed Medication
            </CardTitle>
            <CardDescription className="text-green-700">
              Please follow the dosage instructions carefully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.medicines.map((medicine, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{medicine}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Take medicines as directed. If symptoms persist or worsen, please seek immediate medical attention.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps for Moderate Cases */}
      {result.status === 'moderate' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Next Steps</CardTitle>
            <CardDescription className="text-yellow-700">
              Video consultation required for proper diagnosis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-yellow-700">
              <div className="flex items-start gap-2">
                <div className="bg-yellow-200 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <p>Record a 2-3 minute video describing your symptoms</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-yellow-200 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <p>Video will be sent to an available doctor</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-yellow-200 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <p>Doctor will review and prescribe appropriate treatment</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-yellow-200 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                <p>You will receive SMS notification with prescription</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Alert for High Risk Cases */}
      {result.status === 'high' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Alert
            </CardTitle>
            <CardDescription className="text-red-700">
              Immediate medical attention required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-red-700">
              <p className="font-semibold">Please take the following actions immediately:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Visit the nearest hospital or healthcare center</li>
                <li>Call emergency services if condition is severe</li>
                <li>Do not delay seeking medical attention</li>
                <li>Take this assessment report with you</li>
              </ul>
              
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm font-semibold">
                  Emergency Contacts:
                </p>
                <p className="text-sm">
                  📞 Emergency: 108 | 🏥 Local Hospital: Contact your operator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};