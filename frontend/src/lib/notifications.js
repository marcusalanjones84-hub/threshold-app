// OneSignal Push Notification Service for THRESHOLD
// Mock mode when credentials not provided

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
      dailyReminder: true,
      reminderTime: '09:00',
      subscriptionId: null,
    };
  } catch {
    return {
      enabled: false,
      dailyReminder: true,
      reminderTime: '09:00',
      subscriptionId: null,
    };
  }
};

const setNotificationPrefs = (prefs) => {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
};

// Initialize OneSignal (or mock)
export const initializeOneSignal = async () => {
  if (isOneSignalConfigured) {
    try {
      // Load OneSignal SDK dynamically
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
            enable: false, // We use our own UI
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
  // Check if browser supports notifications
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
    // Mock mode - use native Notification API
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const prefs = getNotificationPrefs();
        prefs.enabled = true;
        prefs.subscriptionId = 'mock_' + Date.now();
        setNotificationPrefs(prefs);
        
        // Show a test notification
        new Notification('Threshold', {
          body: 'Notifications enabled! You\'ll receive daily check-in reminders.',
          icon: '/icons/icon-192.png',
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

// Schedule local notification (for mock mode daily reminders)
export const scheduleLocalReminder = () => {
  const prefs = getNotificationPrefs();
  
  if (!prefs.enabled || !prefs.dailyReminder) {
    return;
  }
  
  // Calculate time until next reminder
  const [hours, minutes] = prefs.reminderTime.split(':').map(Number);
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);
  
  // If reminder time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }
  
  const msUntilReminder = reminderTime - now;
  
  // Store the scheduled time
  localStorage.setItem('threshold_next_reminder', reminderTime.toISOString());
  
  // Note: In production with OneSignal, this would be handled by the server
  // For mock mode, we set a timeout (only works while page is open)
  if (!isOneSignalConfigured) {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Threshold - Daily Check-in', {
          body: 'Take a moment to reflect on your day. How are you doing?',
          icon: '/icons/icon-192.png',
          tag: 'threshold-daily-reminder',
          requireInteraction: true,
        });
        
        // Reschedule for next day
        scheduleLocalReminder();
      }
    }, msUntilReminder);
  }
};

// Send test notification
export const sendTestNotification = () => {
  if (Notification.permission === 'granted') {
    new Notification('Threshold - Test', {
      body: 'Notifications are working correctly!',
      icon: '/icons/icon-192.png',
      tag: 'threshold-test',
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
  scheduleReminder: scheduleLocalReminder,
  sendTest: sendTestNotification,
  isConfigured: isOneSignalConfigured,
};

export default NotificationService;
