import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicalIcons } from './Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Vitals {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  bloodSugar: string;
  temperature: string;
  oxygen: string;
}

interface VitalsEntryFormProps {
  data: Vitals;
  onUpdate: (data: Vitals) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VitalsEntryForm: React.FC<VitalsEntryFormProps> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const { t } = useLanguage();

  const handleChange = (field: keyof Vitals, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const isValid = data.bloodPressureSystolic && data.bloodPressureDiastolic && 
                 data.bloodSugar && data.temperature && data.oxygen;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-3 mb-6">
        <MedicalIcons.BloodPressure className="text-primary" size={28} />
        <h2 className="text-2xl font-bold text-foreground">{t.vitalsEntry}</h2>
      </div>

      <div className="space-y-6">
        {/* Blood Pressure */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.BloodPressure className="text-primary" size={20} />
            {t.bloodPressure} <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="systolic" className="text-sm text-muted-foreground">
                {t.systolic}
              </Label>
              <Input
                id="systolic"
                type="number"
                value={data.bloodPressureSystolic}
                onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
                placeholder="120"
                className="medical-input"
                min="60"
                max="250"
                required
              />
            </div>
            <div>
              <Label htmlFor="diastolic" className="text-sm text-muted-foreground">
                {t.diastolic}
              </Label>
              <Input
                id="diastolic"
                type="number"
                value={data.bloodPressureDiastolic}
                onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
                placeholder="80"
                className="medical-input"
                min="40"
                max="150"
                required
              />
            </div>
          </div>
        </div>

        {/* Blood Sugar */}
        <div className="space-y-2">
          <Label htmlFor="bloodSugar" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.BloodSugar className="text-primary" size={20} />
            {t.bloodSugar} ({t.mgdl}) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bloodSugar"
            type="number"
            value={data.bloodSugar}
            onChange={(e) => handleChange('bloodSugar', e.target.value)}
            placeholder="100"
            className="medical-input"
            min="50"
            max="500"
            required
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Temperature className="text-primary" size={20} />
            {t.temperature} ({t.fahrenheit}) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={data.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            placeholder="98.6"
            className="medical-input"
            min="95"
            max="110"
            required
          />
        </div>

        {/* Oxygen Level */}
        <div className="space-y-2">
          <Label htmlFor="oxygen" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Oxygen className="text-primary" size={20} />
            {t.oxygen} ({t.percentage}) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="oxygen"
            type="number"
            value={data.oxygen}
            onChange={(e) => handleChange('oxygen', e.target.value)}
            placeholder="98"
            className="medical-input"
            min="70"
            max="100"
            required
          />
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
            onClick={onNext}
            disabled={!isValid}
            className="flex-1 medical-button bg-primary text-primary-foreground hover:bg-primary-dark"
            size="lg"
          >
            <MedicalIcons.Next className="mr-2" size={20} />
            {t.next}
          </Button>
        </div>
      </div>
    </div>
  );
};