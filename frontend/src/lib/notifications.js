// OneSignal Push Notification Service for THRESHOLD
// Supports dual reminders: Morning Motivation + Evening Check-in

const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID;

// Check if OneSignal is configured
const isOneSignalConfigured = !!ONESIGNAL_APP_ID && ONESIGNAL_APP_ID !== 'your_onesignal_app_id';

// Mock notification storage
const NOTIFICATION_PREFS_KEY = 'threshold_notification_prefs';

const getNotificationPrefs = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    return stored ? JSON.parse(stored) : {
      enabled: false,
      morningReminder: true,
      morningTime: '07:00',
      eveningReminder: true,
      eveningTime: '20:00',
      subscriptionId: null,
    };
  } catch {
    return {
      enabled: false,
      morningReminder: true,
      morningTime: '07:00',
      eveningReminder: true,
      eveningTime: '20:00',
      subscriptionId: null,
    };
  }
};

const setNotificationPrefs = (prefs) => {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
};

// Generate mock UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initialize OneSignal (or mock)
export const initializeOneSignal = async () => {
  if (isOneSignalConfigured) {
    try {
      if (!window.OneSignalDeferred) {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      window.OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          },
        });
      });
      
      console.log('OneSignal initialized successfully');
      return true;
    } catch (error) {
      console.error('OneSignal initialization failed:', error);
      return false;
    }
  } else {
    console.log('OneSignal not configured - using mock mode');
    return true;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return { success: false, permission: 'unsupported' };
  }

  if (isOneSignalConfigured && window.OneSignal) {
    try {
      const permission = await window.OneSignal.Notifications.requestPermission();
      if (permission) {
        const prefs = getNotificationPrefs();
        prefs.enabled = true;
        prefs.subscriptionId = await window.OneSignal.User.PushSubscription.id;
        setNotificationPrefs(prefs);
        return { success: true, permission: 'granted' };
      }
      return { success: false, permission: 'denied' };
    } catch (error) {
      console.error('OneSignal permission request failed:', error);
      return { success: false, permission: 'error', error };
    }
  } else {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const prefs = getNotificationPrefs();
        prefs.enabled = true;
        prefs.subscriptionId = 'mock_' + generateUUID();
        setNotificationPrefs(prefs);
        
        // Show a welcome notification
        new Notification('Threshold', {
          body: 'Notifications enabled! You\'ll receive morning motivation and evening check-in reminders.',
          icon: '/logo.png',
          tag: 'threshold-welcome',
        });
        
        return { success: true, permission: 'granted' };
      }
      
      return { success: false, permission };
    } catch (error) {
      console.error('Permission request failed:', error);
      return { success: false, permission: 'error', error };
    }
  }
};

// Get current permission status
export const getPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Check if notifications are enabled
export const isNotificationsEnabled = () => {
  const prefs = getNotificationPrefs();
  return prefs.enabled && Notification.permission === 'granted';
};

// Update notification preferences
export const updateNotificationPrefs = (updates) => {
  const prefs = getNotificationPrefs();
  const updated = { ...prefs, ...updates };
  setNotificationPrefs(updated);
  return updated;
};

// Get notification preferences
export const getNotificationSettings = () => {
  return getNotificationPrefs();
};

// Disable notifications
export const disableNotifications = async () => {
  if (isOneSignalConfigured && window.OneSignal) {
    try {
      await window.OneSignal.User.PushSubscription.optOut();
    } catch (error) {
      console.error('OneSignal opt-out failed:', error);
    }
  }
  
  const prefs = getNotificationPrefs();
  prefs.enabled = false;
  setNotificationPrefs(prefs);
  
  return { success: true };
};

// Schedule local reminders (for mock mode)
export const scheduleLocalReminders = () => {
  const prefs = getNotificationPrefs();
  
  if (!prefs.enabled) return;
  
  const now = new Date();
  
  // Schedule morning reminder
  if (prefs.morningReminder && prefs.morningTime) {
    const [hours, minutes] = prefs.morningTime.split(':').map(Number);
    const morningTime = new Date();
    morningTime.setHours(hours, minutes, 0, 0);
    
    if (morningTime <= now) {
      morningTime.setDate(morningTime.getDate() + 1);
    }
    
    const msUntilMorning = morningTime - now;
    localStorage.setItem('threshold_next_morning_reminder', morningTime.toISOString());
    
    if (!isOneSignalConfigured) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Threshold - Good Morning', {
            body: 'Today is another day to be the man you want to be. You\'ve got this.',
            icon: '/logo.png',
            tag: 'threshold-morning',
            requireInteraction: true,
          });
          scheduleLocalReminders();
        }
      }, msUntilMorning);
    }
  }
  
  // Schedule evening reminder
  if (prefs.eveningReminder && prefs.eveningTime) {
    const [hours, minutes] = prefs.eveningTime.split(':').map(Number);
    const eveningTime = new Date();
    eveningTime.setHours(hours, minutes, 0, 0);
    
    if (eveningTime <= now) {
      eveningTime.setDate(eveningTime.getDate() + 1);
    }
    
    const msUntilEvening = eveningTime - now;
    localStorage.setItem('threshold_next_evening_reminder', eveningTime.toISOString());
    
    if (!isOneSignalConfigured) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Threshold - Evening Check-in', {
            body: 'How was your day? Take a moment to check in and reflect.',
            icon: '/logo.png',
            tag: 'threshold-evening',
            requireInteraction: true,
          });
          scheduleLocalReminders();
        }
      }, msUntilEvening);
    }
  }
};

// Send test notification
export const sendTestNotification = (type = 'general') => {
  if (Notification.permission === 'granted') {
    const messages = {
      morning: {
        title: 'Threshold - Morning Motivation',
        body: 'Today is another day to be the man you want to be. You\'ve got this.',
      },
      evening: {
        title: 'Threshold - Evening Check-in',
        body: 'How was your day? Take a moment to check in and reflect.',
      },
      general: {
        title: 'Threshold - Test',
        body: 'Notifications are working correctly!',
      },
    };
    
    const msg = messages[type] || messages.general;
    
    new Notification(msg.title, {
      body: msg.body,
      icon: '/logo.png',
      tag: `threshold-test-${type}`,
    });
    return { success: true };
  }
  return { success: false, reason: 'Permission not granted' };
};

// Export service object
export const NotificationService = {
  initialize: initializeOneSignal,
  requestPermission: requestNotificationPermission,
  getPermissionStatus,
  isEnabled: isNotificationsEnabled,
  updatePrefs: updateNotificationPrefs,
  getSettings: getNotificationSettings,
  disable: disableNotifications,
  scheduleReminders: scheduleLocalReminders,
  sendTest: sendTestNotification,
  isConfigured: isOneSignalConfigured,
};

export default NotificationService;
