import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, BellOff, X, Check, Clock, ChevronDown } from 'lucide-react';

// Available reminder times
const REMINDER_TIMES = [
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

const getTimeLabel = (value) => {
  const time = REMINDER_TIMES.find(t => t.value === value);
  return time ? time.label : '9:00 AM';
};

export default function NotificationPrompt({ onDismiss }) {
  const {
    permission,
    isEnabled,
    settings,
    loading,
    isSupported,
    canRequest,
    isDenied,
    requestPermission,
    disableNotifications,
    updateSettings,
    sendTest,
  } = useNotifications();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [testSent, setTestSent] = useState(false);

  // Don't show if not supported or already enabled
  if (!isSupported) {
    return null;
  }

  const handleEnable = async () => {
    const result = await requestPermission();
    if (result.success) {
      // Success - banner will hide automatically due to isEnabled check
    }
  };

  const handleTest = () => {
    const result = sendTest();
    if (result.success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const handleTimeChange = (time) => {
    updateSettings({ reminderTime: time });
    setShowTimePicker(false);
  };

  // Show settings view if already enabled
  if (isEnabled && showSettings) {
    return (
      <div className="card fade-in" data-testid="notification-settings">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#32D74B]" />
            <div>
              <p className="text-white font-medium">Notifications Enabled</p>
              <p className="text-xs text-[#8E8E93]">Daily reminders active</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 bg-transparent border-0 cursor-pointer text-[#8E8E93] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Time Picker */}
        <div className="mb-4">
          <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Reminder Time</p>
          <div className="relative">
            <button
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="w-full flex items-center justify-between p-3 border border-[#3A3A3C] bg-transparent text-white cursor-pointer hover:border-white"
              data-testid="time-picker-btn"
            >
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#8E8E93]" />
                <span>{getTimeLabel(settings.reminderTime)}</span>
              </div>
              <ChevronDown size={16} className={`text-[#8E8E93] transition-transform ${showTimePicker ? 'rotate-180' : ''}`} />
            </button>
            
            {showTimePicker && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3A3A3C] z-10 max-h-48 overflow-y-auto">
                {REMINDER_TIMES.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => handleTimeChange(time.value)}
                    className={`w-full text-left px-4 py-3 bg-transparent border-0 cursor-pointer transition-colors ${
                      settings.reminderTime === time.value 
                        ? 'text-white bg-[#3A3A3C]' 
                        : 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
                    }`}
                    data-testid={`time-option-${time.value}`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleTest}
            className="btn-secondary text-xs py-3"
            disabled={testSent}
            data-testid="test-notification-btn"
          >
            {testSent ? 'Notification Sent!' : 'Send Test Notification'}
          </button>
          
          <button
            onClick={async () => {
              await disableNotifications();
              setShowSettings(false);
            }}
            className="w-full py-3 text-xs uppercase tracking-widest font-semibold text-[#FF453A] border border-[#FF453A] bg-transparent cursor-pointer hover:bg-[#FF453A]/10"
            data-testid="disable-notifications-btn"
          >
            Disable Notifications
          </button>
        </div>
      </div>
    );
  }

  // Show enabled state (compact)
  if (isEnabled) {
    return (
      <button
        onClick={() => setShowSettings(true)}
        className="card-hover flex items-center gap-3 w-full"
        data-testid="notification-enabled-card"
      >
        <div className="w-10 h-10 border border-[#32D74B] flex items-center justify-center">
          <Bell size={18} className="text-[#32D74B]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-medium">Daily Reminders</p>
          <p className="text-xs text-[#32D74B]">Enabled - {getTimeLabel(settings.reminderTime)}</p>
        </div>
        <Check size={16} className="text-[#32D74B]" />
      </button>
    );
  }

  // Show permission denied state
  if (isDenied) {
    return (
      <div className="card border-[#FF453A]" data-testid="notification-denied">
        <div className="flex items-start gap-3">
          <BellOff size={20} className="text-[#FF453A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-medium mb-1">Notifications Blocked</p>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              To enable reminders, click the lock icon in your browser's address bar and allow notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show request prompt
  if (canRequest) {
    return (
      <div className="card border-white fade-in" data-testid="notification-prompt">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Daily Check-in Reminders</p>
              <p className="text-xs text-[#8E8E93]">Stay accountable with daily prompts</p>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 bg-transparent border-0 cursor-pointer text-[#8E8E93] hover:text-white"
              data-testid="dismiss-notification-prompt"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-[#8E8E93] mb-4">
          <Clock size={14} />
          <span>Reminder sent daily at 9:00 AM</span>
        </div>
        
        <button
          onClick={handleEnable}
          disabled={loading}
          className="btn-primary text-sm py-3"
          data-testid="enable-notifications-btn"
        >
          {loading ? 'Enabling...' : 'Enable Reminders'}
        </button>
      </div>
    );
  }

  return null;
}
