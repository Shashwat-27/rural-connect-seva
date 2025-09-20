import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicalIcons } from './Icons';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'hi' as const, label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'pa' as const, label: 'ਪੰਜਾਬੀ', flag: '🏳️' },
];

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2 mb-6">
      <MedicalIcons.Language className="text-primary" size={20} />
      <span className="text-sm font-medium text-muted-foreground">
        {t.languageSwitch}:
      </span>
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
            className="medical-button text-sm"
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
};