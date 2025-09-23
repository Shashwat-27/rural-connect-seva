import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Heart, 
  LogOut, 
  User, 
  Activity, 
  FileText, 
  Video,
  Settings,
  Phone
} from 'lucide-react';

export const ResponsiveNavbar = ({ 
  title = "Rural TeleMedicine", 
  onLogout, 
  showLanguageToggle = true,
  currentStep = null,
  onStepChange = null 
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { 
      key: 'registration', 
      title: t?.registration || 'Registration', 
      icon: User,
      description: 'Patient information and details'
    },
    { 
      key: 'vitals', 
      title: t?.vitals || 'Vitals', 
      icon: Activity,
      description: 'Vital signs and measurements'
    },
    { 
      key: 'symptoms', 
      title: t?.symptoms || 'Symptoms', 
      icon: FileText,
      description: 'Symptoms and medical history'
    },
    { 
      key: 'video', 
      title: t?.videoCall || 'Video Call', 
      icon: Video,
      description: 'Connect with healthcare providers'
    },
  ];

  const handleNavigation = (stepKey) => {
    if (onStepChange) {
      onStepChange(stepKey);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-destructive" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                {title}
              </h1>
              {currentStep && (
                <p className="text-xs text-muted-foreground hidden md:block">
                  Current: {currentStep}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {onStepChange && navigationItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = currentStep === item.key;
              
              return (
                <Button
                  key={item.key}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.key)}
                  className="flex items-center gap-2"
                >
                  <ItemIcon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.title}</span>
                </Button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {showLanguageToggle && <LanguageToggle />}
            
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <Heart className="h-5 w-5 text-destructive" />
                    Rural TeleMedicine
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Language Toggle */}
                  {showLanguageToggle && (
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm font-medium text-foreground">Language</span>
                      <LanguageToggle />
                    </div>
                  )}

                  {/* Navigation Items */}
                  {onStepChange && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground mb-3">Navigation</h3>
                      {navigationItems.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = currentStep === item.key;
                        
                        return (
                          <Button
                            key={item.key}
                            variant={isActive ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleNavigation(item.key)}
                          >
                            <ItemIcon className="h-4 w-4 mr-3" />
                            <div className="text-left flex-1">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs opacity-70">{item.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="h-4 w-4 mr-3" />
                      Emergency Contact
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </div>

                  {/* Logout */}
                  {onLogout && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => {
                          onLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};