import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, BellOff, X, Check, Clock, ChevronDown, Sun, Moon } from 'lucide-react';

// Available reminder times
const MORNING_TIMES = [
  { value: '05:00', label: '5:00 AM' },
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
];

const EVENING_TIMES = [
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '20:00', label: '8:00 PM' },
  { value: '21:00', label: '9:00 PM' },
  { value: '22:00', label: '10:00 PM' },
];

const getTimeLabel = (value, times) => {
  const time = times.find(t => t.value === value);
  return time ? time.label : value;
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
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [testSent, setTestSent] = useState(null);

  if (!isSupported) {
    return null;
  }

  const handleEnable = async () => {
    const result = await requestPermission();
    if (result.success) {
      // Success
    }
  };

  const handleTest = (type) => {
    const result = sendTest(type);
    if (result.success) {
      setTestSent(type);
      setTimeout(() => setTestSent(null), 3000);
    }
  };

  const handleMorningTimeChange = (time) => {
    updateSettings({ morningTime: time });
    setShowMorningPicker(false);
  };

  const handleEveningTimeChange = (time) => {
    updateSettings({ eveningTime: time });
    setShowEveningPicker(false);
  };

  const toggleMorningReminder = () => {
    updateSettings({ morningReminder: !settings.morningReminder });
  };

  const toggleEveningReminder = () => {
    updateSettings({ eveningReminder: !settings.eveningReminder });
  };

  // Show settings view if already enabled
  if (isEnabled && showSettings) {
    return (
      <div className="card fade-in" data-testid="notification-settings">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-[#32D74B]" />
            <div>
              <p className="text-white font-medium">Notifications Enabled</p>
              <p className="text-xs text-[#8E8E93]">Customize your reminders</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 bg-transparent border-0 cursor-pointer text-[#8E8E93] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Morning Reminder */}
        <div className="mb-4 pb-4 border-b border-[#3A3A3C]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-[#D4A017]" />
              <span className="text-white text-sm font-medium">Morning Motivation</span>
            </div>
            <button
              onClick={toggleMorningReminder}
              className={`w-10 h-6 rounded-full transition-colors ${
                settings.morningReminder ? 'bg-[#32D74B]' : 'bg-[#3A3A3C]'
              }`}
              data-testid="toggle-morning"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                settings.morningReminder ? 'translate-x-4' : ''
              }`} />
            </button>
          </div>
          
          {settings.morningReminder && (
            <div className="relative">
              <button
                onClick={() => { setShowMorningPicker(!showMorningPicker); setShowEveningPicker(false); }}
                className="w-full flex items-center justify-between p-3 border border-[#3A3A3C] bg-transparent text-white cursor-pointer hover:border-white text-sm"
                data-testid="morning-time-picker"
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#8E8E93]" />
                  <span>{getTimeLabel(settings.morningTime, MORNING_TIMES)}</span>
                </div>
                <ChevronDown size={14} className={`text-[#8E8E93] transition-transform ${showMorningPicker ? 'rotate-180' : ''}`} />
              </button>
              
              {showMorningPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3A3A3C] z-10 max-h-40 overflow-y-auto">
                  {MORNING_TIMES.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => handleMorningTimeChange(time.value)}
                      className={`w-full text-left px-4 py-2 bg-transparent border-0 cursor-pointer text-sm transition-colors ${
                        settings.morningTime === time.value 
                          ? 'text-white bg-[#3A3A3C]' 
                          : 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => handleTest('morning')}
                className="mt-2 text-xs text-[#8E8E93] hover:text-white bg-transparent border-0 cursor-pointer"
                disabled={testSent === 'morning'}
              >
                {testSent === 'morning' ? 'Sent!' : 'Test morning reminder'}
              </button>
            </div>
          )}
        </div>

        {/* Evening Reminder */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-[#8E8E93]" />
              <span className="text-white text-sm font-medium">Evening Check-in</span>
            </div>
            <button
              onClick={toggleEveningReminder}
              className={`w-10 h-6 rounded-full transition-colors ${
                settings.eveningReminder ? 'bg-[#32D74B]' : 'bg-[#3A3A3C]'
              }`}
              data-testid="toggle-evening"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                settings.eveningReminder ? 'translate-x-4' : ''
              }`} />
            </button>
          </div>
          
          {settings.eveningReminder && (
            <div className="relative">
              <button
                onClick={() => { setShowEveningPicker(!showEveningPicker); setShowMorningPicker(false); }}
                className="w-full flex items-center justify-between p-3 border border-[#3A3A3C] bg-transparent text-white cursor-pointer hover:border-white text-sm"
                data-testid="evening-time-picker"
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#8E8E93]" />
                  <span>{getTimeLabel(settings.eveningTime, EVENING_TIMES)}</span>
                </div>
                <ChevronDown size={14} className={`text-[#8E8E93] transition-transform ${showEveningPicker ? 'rotate-180' : ''}`} />
              </button>
              
              {showEveningPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3A3A3C] z-10 max-h-40 overflow-y-auto">
                  {EVENING_TIMES.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => handleEveningTimeChange(time.value)}
                      className={`w-full text-left px-4 py-2 bg-transparent border-0 cursor-pointer text-sm transition-colors ${
                        settings.eveningTime === time.value 
                          ? 'text-white bg-[#3A3A3C]' 
                          : 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => handleTest('evening')}
                className="mt-2 text-xs text-[#8E8E93] hover:text-white bg-transparent border-0 cursor-pointer"
                disabled={testSent === 'evening'}
              >
                {testSent === 'evening' ? 'Sent!' : 'Test evening reminder'}
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={async () => {
            await disableNotifications();
            setShowSettings(false);
          }}
          className="w-full py-3 text-xs uppercase tracking-widest font-semibold text-[#FF453A] border border-[#FF453A] bg-transparent cursor-pointer hover:bg-[#FF453A]/10 mt-4"
          data-testid="disable-notifications-btn"
        >
          Disable All Notifications
        </button>
      </div>
    );
  }

  // Show enabled state (compact)
  if (isEnabled) {
    const activeReminders = [];
    if (settings.morningReminder) activeReminders.push(`${getTimeLabel(settings.morningTime, MORNING_TIMES)}`);
    if (settings.eveningReminder) activeReminders.push(`${getTimeLabel(settings.eveningTime, EVENING_TIMES)}`);
    
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
          <p className="text-xs text-[#32D74B]">
            {activeReminders.length > 0 ? activeReminders.join(' & ') : 'Tap to configure'}
          </p>
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
              <p className="text-white font-medium">Stay Accountable</p>
              <p className="text-xs text-[#8E8E93]">Get daily motivation & check-in reminders</p>
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
        
        <div className="space-y-2 mb-4 text-xs text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-[#D4A017]" />
            <span>Morning motivation at 7:00 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <Moon size={14} />
            <span>Evening check-in at 8:00 PM</span>
          </div>
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
