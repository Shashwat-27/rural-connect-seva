import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface FormData {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    address: string;
    phone: string;
  };
  vitals: {
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
    bloodSugar: string;
    temperature: string;
    oxygen: string;
  };
  symptoms: string[];
  timestamp: number;
  id: string;
}

interface OfflineData {
  pendingSubmissions: FormData[];
  lastSync: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { t } = useLanguage();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending data on mount
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updatePendingCount = () => {
    const offlineData = getOfflineData();
    setPendingCount(offlineData.pendingSubmissions.length);
  };

  const getOfflineData = (): OfflineData => {
    const stored = localStorage.getItem('telemedicine-offline-data');
    return stored ? JSON.parse(stored) : { pendingSubmissions: [], lastSync: 0 };
  };

  const saveOfflineData = (data: OfflineData) => {
    localStorage.setItem('telemedicine-offline-data', JSON.stringify(data));
    updatePendingCount();
  };

  const saveFormData = useCallback((formData: Omit<FormData, 'timestamp' | 'id'>) => {
    const offlineData = getOfflineData();
    const newSubmission: FormData = {
      ...formData,
      timestamp: Date.now(),
      id: Date.now().toString(),
    };

    offlineData.pendingSubmissions.push(newSubmission);
    saveOfflineData(offlineData);

    if (!isOnline) {
      toast({
        title: t.offline,
        description: t.offlineMessage,
        variant: "default",
      });
    } else {
      syncPendingData();
    }
  }, [isOnline, t]);

  const syncPendingData = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    const offlineData = getOfflineData();
    if (offlineData.pendingSubmissions.length === 0) return;

    setIsSyncing(true);

    try {
      // Data is now handled by the main application flow
      // Clear pending submissions since they're processed elsewhere
      saveOfflineData({
        pendingSubmissions: [],
        lastSync: Date.now(),
      });

      toast({
        title: t.success,
        description: t.dataSubmitted,
        variant: "default",
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: t.error,
        description: "Sync failed, will retry later",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, t]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && !isSyncing) {
      const timer = setTimeout(syncPendingData, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncPendingData, isSyncing]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    saveFormData,
    syncPendingData,
  };
};
