import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicalIcons, SymptomIcons } from './Icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const symptomsList = [
  'cough',
  'fever',
  'weakness',
  'chestPain',
  'breathingProblem',
  'headache',
  'vomiting',
] as const;

type Symptom = typeof symptomsList[number];

interface SymptomsFormProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const SymptomsForm: React.FC<SymptomsFormProps> = ({
  data,
  onUpdate,
  onSubmit,
  onBack,
}) => {
  const { t } = useLanguage();

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      onUpdate([...data, symptom]);
    } else {
      onUpdate(data.filter(s => s !== symptom));
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center gap-3 mb-6">
        <MedicalIcons.Temperature className="text-primary" size={28} />
        <h2 className="text-2xl font-bold text-foreground">{t.symptomsForm}</h2>
      </div>

      <div className="space-y-4 mb-8">
        {symptomsList.map((symptom) => (
          <div key={symptom} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <Checkbox
              id={symptom}
              checked={data.includes(symptom)}
              onCheckedChange={(checked) => handleSymptomChange(symptom, !!checked)}
              className="h-5 w-5"
            />
            <Label htmlFor={symptom} className="flex items-center gap-3 text-lg cursor-pointer flex-1">
              <span className="text-2xl">{SymptomIcons[symptom as keyof typeof SymptomIcons]}</span>
              <span>{t[symptom as keyof typeof t]}</span>
            </Label>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 medical-button"
          size="lg"
        >
          <MedicalIcons.Back className="mr-2" size={20} />
          {t.back}
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1 medical-button bg-success text-success-foreground hover:bg-success/90"
          size="lg"
        >
          <MedicalIcons.Submit className="mr-2" size={20} />
          {t.submit}
        </Button>
      </div>
    </div>
  );
};