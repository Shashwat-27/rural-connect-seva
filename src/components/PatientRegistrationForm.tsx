import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicalIcons, GenderIcons } from './Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
}

interface PatientRegistrationFormProps {
  data: PatientInfo;
  onUpdate: (data: PatientInfo) => void;
  onNext: () => void;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const { t } = useLanguage();

  const handleChange = (field: keyof PatientInfo, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const isValid = data.name && data.age && data.gender && data.address && data.phone;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-3 mb-6">
        <MedicalIcons.Name className="text-primary" size={28} />
        <h2 className="text-2xl font-bold text-foreground">{t.patientRegistration}</h2>
      </div>

      <div className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Name className="text-primary" size={20} />
            {t.name} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t.enterValue}
            className="medical-input"
            required
          />
        </div>

        {/* Age Field */}
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Age className="text-primary" size={20} />
            {t.age} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            value={data.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder={t.enterValue}
            className="medical-input"
            min="0"
            max="120"
            required
          />
        </div>

        {/* Gender Field */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Gender className="text-primary" size={20} />
            {t.gender} <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => handleChange('gender', value)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="male" id="male" className="text-primary" />
              <Label htmlFor="male" className="flex items-center gap-2 text-lg cursor-pointer">
                <span className="text-2xl">{GenderIcons.male}</span>
                {t.male}
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="female" id="female" className="text-primary" />
              <Label htmlFor="female" className="flex items-center gap-2 text-lg cursor-pointer">
                <span className="text-2xl">{GenderIcons.female}</span>
                {t.female}
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value="other" id="other" className="text-primary" />
              <Label htmlFor="other" className="flex items-center gap-2 text-lg cursor-pointer">
                <span className="text-2xl">{GenderIcons.other}</span>
                {t.other}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Address Field */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Address className="text-primary" size={20} />
            {t.address} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder={t.enterValue}
            className="medical-input"
            required
          />
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-lg font-medium">
            <MedicalIcons.Phone className="text-primary" size={20} />
            {t.phone} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={t.enterValue}
            className="medical-input"
            required
          />
        </div>

        {/* Next Button */}
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full medical-button bg-primary text-primary-foreground hover:bg-primary-dark"
          size="lg"
        >
          <MedicalIcons.Next className="mr-2" size={20} />
          {t.next}
        </Button>
      </div>
    </div>
  );
};