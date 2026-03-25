import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NotificationService from '../lib/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [permission, setPermission] = useState('default');
  const [isEnabled, setIsEnabled] = useState(false);
  const [settings, setSettings] = useState({
    dailyReminder: true,
    reminderTime: '09:00',
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize notification service
  useEffect(() => {
    const init = async () => {
      await NotificationService.initialize();
      setPermission(NotificationService.getPermissionStatus());
      setIsEnabled(NotificationService.isEnabled());
      setSettings(NotificationService.getSettings());
      setInitialized(true);
      setLoading(false);
      
      // Schedule reminder if enabled
      if (NotificationService.isEnabled()) {
        NotificationService.scheduleReminder();
      }
    };
    
    init();
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    setLoading(true);
    const result = await NotificationService.requestPermission();
    
    if (result.success) {
      setPermission('granted');
      setIsEnabled(true);
      NotificationService.scheduleReminder();
    } else {
      setPermission(result.permission);
    }
    
    setLoading(false);
    return result;
  }, []);

  // Disable notifications
  const disableNotifications = useCallback(async () => {
    await NotificationService.disable();
    setIsEnabled(false);
  }, []);

  // Update settings
  const updateSettings = useCallback((updates) => {
    const updated = NotificationService.updatePrefs(updates);
    setSettings(updated);
    
    // Reschedule if reminder time changed
    if (updates.reminderTime && isEnabled) {
      NotificationService.scheduleReminder();
    }
  }, [isEnabled]);

  // Send test notification
  const sendTest = useCallback(() => {
    return NotificationService.sendTest();
  }, []);

  const value = {
    permission,
    isEnabled,
    settings,
    loading,
    initialized,
    isSupported: 'Notification' in window,
    isConfigured: NotificationService.isConfigured,
    requestPermission,
    disableNotifications,
    updateSettings,
    sendTest,
    canRequest: permission === 'default',
    isDenied: permission === 'denied',
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
