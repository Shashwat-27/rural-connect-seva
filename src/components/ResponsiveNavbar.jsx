import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  LogOut, 
  User, 
  Heart, 
  Stethoscope,
  Menu,
  X,
  Home,
  FileText,
  Settings,
  Phone
} from 'lucide-react';

export const ResponsiveNavbar = ({ onLogout, activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const navItems = [
    { key: 'dashboard', label: t.dashboard || 'Dashboard', icon: Home },
    { key: 'patients', label: t.patients || 'Patients', icon: User },
    { key: 'cases', label: t.cases || 'Cases', icon: FileText },
    { key: 'emergency', label: t.emergency || 'Emergency', icon: Phone },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Card className="hidden lg:block mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t.telemedicineApp || 'Telemedicine Platform'}</h1>
                <p className="text-blue-100 text-sm">{t.ruralHealthcare || 'Rural Healthcare Solution'}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSectionChange(item.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === item.key 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Info & Controls */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-blue-100 text-sm capitalize">{user?.role}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                {user?.role === 'operator' ? (
                  <User className="h-6 w-6 text-white" />
                ) : (
                  <Stethoscope className="h-6 w-6 text-white" />
                )}
              </div>
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20 border border-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout || 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile Navbar */}
      <Card className="lg:hidden mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{t.telemedicineApp || 'Telemedicine'}</h1>
                <p className="text-blue-100 text-xs">{user?.name}</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-white hover:bg-white/20 p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSectionChange(item.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.key 
                          ? 'bg-white/20 text-white' 
                          : 'text-blue-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-2 mt-2 border-t border-white/20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">{t.logout || 'Logout'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};