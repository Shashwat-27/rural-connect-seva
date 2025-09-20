import React from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicalIcons } from './Icons';
import { Badge } from '@/components/ui/badge';

export const SyncStatus: React.FC = () => {
  const { isOnline, isSyncing, pendingCount } = useOfflineSync();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <MedicalIcons.Online className="text-success" size={20} />
        ) : (
          <MedicalIcons.Offline className="text-destructive" size={20} />
        )}
        <span className="text-sm font-medium">
          {isOnline ? t.online : t.offline}
        </span>
      </div>

      {isSyncing && (
        <div className="flex items-center gap-2">
          <MedicalIcons.Sync className="text-primary animate-spin" size={16} />
          <span className="text-sm text-muted-foreground">{t.sync}...</span>
        </div>
      )}

      {pendingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {pendingCount} pending
        </Badge>
      )}
    </div>
  );
};