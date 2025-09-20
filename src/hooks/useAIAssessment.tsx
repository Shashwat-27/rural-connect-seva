import { useState } from 'react';

interface VitalsData {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  bloodSugar: string;
  temperature: string;
  oxygen: string;
}

interface AssessmentResult {
  status: 'simple' | 'moderate' | 'high';
  severity_score: number;
  recommendation: string;
  medicines?: string[];
}

export const useAIAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);

  const assessPatient = async (vitals: VitalsData, symptoms: string[]): Promise<AssessmentResult> => {
    setIsAssessing(true);
    
    // Simulate AI assessment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      let severity_score = 0;
      let status: 'simple' | 'moderate' | 'high' = 'simple';
      let recommendation = '';
      let medicines: string[] = [];

      // Simple AI logic based on vitals and symptoms
      const systolic = parseInt(vitals.bloodPressureSystolic);
      const diastolic = parseInt(vitals.bloodPressureDiastolic);
      const bloodSugar = parseInt(vitals.bloodSugar);
      const temperature = parseFloat(vitals.temperature);
      const oxygen = parseInt(vitals.oxygen);

      // Check vitals ranges
      if (systolic > 140 || diastolic > 90) severity_score += 2;
      if (bloodSugar > 140) severity_score += 2;
      if (temperature > 100.4) severity_score += 1;
      if (oxygen < 95) severity_score += 3;

      // Check symptoms severity
      const severeSymptoms = ['chestPain', 'breathingProblem', 'severeHeadache'];
      const moderateSymptoms = ['fever', 'cough', 'bodyPain', 'diarrhea'];
      
      symptoms.forEach(symptom => {
        if (severeSymptoms.includes(symptom)) severity_score += 3;
        else if (moderateSymptoms.includes(symptom)) severity_score += 1;
      });

      // Determine status and treatment
      if (severity_score >= 7) {
        status = 'high';
        recommendation = 'Immediate medical attention required. High-risk condition detected.';
      } else if (severity_score >= 4) {
        status = 'moderate';
        recommendation = 'Requires video consultation with doctor for proper assessment.';
      } else {
        status = 'simple';
        recommendation = 'Condition appears to be mild. General medication can be prescribed.';
        
        // Simple condition medicines
        if (symptoms.includes('fever')) medicines.push('Paracetamol 500mg');
        if (symptoms.includes('cough')) medicines.push('Cough Syrup');
        if (symptoms.includes('headache')) medicines.push('Aspirin 300mg');
        if (symptoms.includes('bodyPain')) medicines.push('Ibuprofen 400mg');
        if (symptoms.includes('acidity')) medicines.push('Antacid Tablet');
        
        // Default general medicine if no specific symptoms
        if (medicines.length === 0) {
          medicines.push('Rest and adequate fluid intake');
        }
      }

      setIsAssessing(false);
      return { status, severity_score, recommendation, medicines };
    } catch (error) {
      setIsAssessing(false);
      throw error;
    }
  };

  return { assessPatient, isAssessing };
};