import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  User, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Heart, 
  Droplets, 
  Thermometer, 
  Zap,
  Languages,
  Wifi,
  WifiOff,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  Send
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number;
}

export const MedicalIcons = {
  // Personal Info Icons
  Name: ({ className, size = 24 }: IconProps) => (
    <User className={className} size={size} aria-label="Name" />
  ),
  Age: ({ className, size = 24 }: IconProps) => (
    <Calendar className={className} size={size} aria-label="Age" />
  ),
  Gender: ({ className, size = 24 }: IconProps) => (
    <Users className={className} size={size} aria-label="Gender" />
  ),
  Address: ({ className, size = 24 }: IconProps) => (
    <MapPin className={className} size={size} aria-label="Address" />
  ),
  Phone: ({ className, size = 24 }: IconProps) => (
    <Phone className={className} size={size} aria-label="Phone" />
  ),
  
  // Vitals Icons
  BloodPressure: ({ className, size = 24 }: IconProps) => (
    <Heart className={className} size={size} aria-label="Blood Pressure" />
  ),
  BloodSugar: ({ className, size = 24 }: IconProps) => (
    <Droplets className={className} size={size} aria-label="Blood Sugar" />
  ),
  Temperature: ({ className, size = 24 }: IconProps) => (
    <Thermometer className={className} size={size} aria-label="Temperature" />
  ),
  Oxygen: ({ className, size = 24 }: IconProps) => (
    <Zap className={className} size={size} aria-label="Oxygen Level" />
  ),

  // System Icons
  Language: ({ className, size = 24 }: IconProps) => (
    <Languages className={className} size={size} aria-label="Language" />
  ),
  Online: ({ className, size = 24 }: IconProps) => (
    <Wifi className={className} size={size} aria-label="Online" />
  ),
  Offline: ({ className, size = 24 }: IconProps) => (
    <WifiOff className={className} size={size} aria-label="Offline" />
  ),
  Sync: ({ className, size = 24 }: IconProps) => (
    <RotateCcw className={className} size={size} aria-label="Sync" />
  ),
  Success: ({ className, size = 24 }: IconProps) => (
    <Check className={className} size={size} aria-label="Success" />
  ),
  Back: ({ className, size = 24 }: IconProps) => (
    <ChevronLeft className={className} size={size} aria-label="Back" />
  ),
  Next: ({ className, size = 24 }: IconProps) => (
    <ChevronRight className={className} size={size} aria-label="Next" />
  ),
  Save: ({ className, size = 24 }: IconProps) => (
    <Save className={className} size={size} aria-label="Save" />
  ),
  Submit: ({ className, size = 24 }: IconProps) => (
    <Send className={className} size={size} aria-label="Submit" />
  ),
};

// Symptom Icons (using emoji-like representations)
export const SymptomIcons = {
  cough: "🤧",
  fever: "🤒",
  weakness: "😴",
  chestPain: "💔",
  breathingProblem: "😮‍💨",
  headache: "🤕",
  vomiting: "🤮",
};

// Gender Icons
export const GenderIcons = {
  male: "👨",
  female: "👩",
  other: "👤",
};