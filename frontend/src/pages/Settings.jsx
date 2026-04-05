import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ArrowLeft, LogOut, Crown, Trash2, Bell, BellOff, Clock, ChevronDown, Sun, Moon, Heart, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

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

export default function Settings() {
  const navigate = useNavigate();
  const { profile, signOut, tier } = useAuth();
  const { 
    isEnabled, 
    isSupported, 
    isDenied,
    settings,
    requestPermission, 
    disableNotifications,
    updateSettings,
    sendTest,
    loading: notificationLoading 
  } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);
  const [testSent, setTestSent] = useState(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tierLabels = {
    free: 'Free',
    pro: 'Pro',
    complete: 'Complete'
  };

  return (
    <div className="page-container pb-24" data-testid="settings-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="settings-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        {/* Account Info */}
        <div className="card mb-6">
          <p className="section-label mb-4">Account</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-1">Name</p>
              <p className="text-white">{profile?.first_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-1">Email</p>
              <p className="text-white">{profile?.email || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="card mb-6">
          <p className="section-label mb-4">Subscription</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown size={20} className={tier !== 'free' ? 'text-[#D4A017]' : 'text-[#8E8E93]'} />
              <div>
                <p className="text-white font-medium">Threshold {tierLabels[tier]}</p>
                {tier === 'free' && (
                  <p className="text-xs text-[#8E8E93]">Limited features</p>
                )}
              </div>
            </div>
            {tier === 'free' && (
              <button
                onClick={() => navigate('/upgrade')}
                className="text-xs uppercase tracking-widest text-white border border-[#3A3A3C] px-4 py-2 bg-transparent cursor-pointer hover:border-white"
                data-testid="upgrade-btn"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Notifications */}
        {isSupported && (
          <div className="card mb-6">
            <p className="section-label mb-4">Notifications</p>
            
            {!isEnabled && !isDenied && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOff size={20} className="text-[#8E8E93]" />
                  <div>
                    <p className="text-white font-medium">Daily Reminders</p>
                    <p className="text-xs text-[#8E8E93]">Disabled</p>
                  </div>
                </div>
                <button
                  onClick={requestPermission}
                  disabled={notificationLoading}
                  className="text-xs uppercase tracking-widest text-white border border-[#3A3A3C] px-4 py-2 bg-transparent cursor-pointer hover:border-white"
                  data-testid="enable-notification-settings-btn"
                >
                  {notificationLoading ? 'Enabling...' : 'Enable'}
                </button>
              </div>
            )}
            
            {isDenied && (
              <div className="flex items-center gap-3">
                <BellOff size={20} className="text-[#FF453A]" />
                <div>
                  <p className="text-white font-medium">Notifications Blocked</p>
                  <p className="text-xs text-[#8E8E93]">Allow in browser settings</p>
                </div>
              </div>
            )}
            
            {isEnabled && (
              <div className="space-y-4">
                {/* Morning Reminder */}
                <div className="pb-4 border-b border-[#3A3A3C]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sun size={16} className="text-[#D4A017]" />
                      <span className="text-white text-sm">Morning Motivation</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ morningReminder: !settings?.morningReminder })}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        settings?.morningReminder ? 'bg-[#32D74B]' : 'bg-[#3A3A3C]'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                        settings?.morningReminder ? 'translate-x-4' : ''
                      }`} />
                    </button>
                  </div>
                  
                  {settings?.morningReminder && (
                    <div className="relative">
                      <button
                        onClick={() => { setShowMorningPicker(!showMorningPicker); setShowEveningPicker(false); }}
                        className="w-full flex items-center justify-between p-2 border border-[#3A3A3C] bg-transparent text-white cursor-pointer hover:border-white text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#8E8E93]" />
                          <span>{getTimeLabel(settings?.morningTime, MORNING_TIMES)}</span>
                        </div>
                        <ChevronDown size={14} className={`text-[#8E8E93] transition-transform ${showMorningPicker ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showMorningPicker && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3A3A3C] z-10 max-h-40 overflow-y-auto">
                          {MORNING_TIMES.map((time) => (
                            <button
                              key={time.value}
                              onClick={() => { updateSettings({ morningTime: time.value }); setShowMorningPicker(false); }}
                              className={`w-full text-left px-4 py-2 bg-transparent border-0 cursor-pointer text-sm ${
                                settings?.morningTime === time.value 
                                  ? 'text-white bg-[#3A3A3C]' 
                                  : 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
                              }`}
                            >
                              {time.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Evening Reminder */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Moon size={16} className="text-[#8E8E93]" />
                      <span className="text-white text-sm">Evening Check-in</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ eveningReminder: !settings?.eveningReminder })}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        settings?.eveningReminder ? 'bg-[#32D74B]' : 'bg-[#3A3A3C]'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${
                        settings?.eveningReminder ? 'translate-x-4' : ''
                      }`} />
                    </button>
                  </div>
                  
                  {settings?.eveningReminder && (
                    <div className="relative">
                      <button
                        onClick={() => { setShowEveningPicker(!showEveningPicker); setShowMorningPicker(false); }}
                        className="w-full flex items-center justify-between p-2 border border-[#3A3A3C] bg-transparent text-white cursor-pointer hover:border-white text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#8E8E93]" />
                          <span>{getTimeLabel(settings?.eveningTime, EVENING_TIMES)}</span>
                        </div>
                        <ChevronDown size={14} className={`text-[#8E8E93] transition-transform ${showEveningPicker ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showEveningPicker && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2C2C2E] border border-[#3A3A3C] z-10 max-h-40 overflow-y-auto">
                          {EVENING_TIMES.map((time) => (
                            <button
                              key={time.value}
                              onClick={() => { updateSettings({ eveningTime: time.value }); setShowEveningPicker(false); }}
                              className={`w-full text-left px-4 py-2 bg-transparent border-0 cursor-pointer text-sm ${
                                settings?.eveningTime === time.value 
                                  ? 'text-white bg-[#3A3A3C]' 
                                  : 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
                              }`}
                            >
                              {time.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Disable Button */}
                <button
                  onClick={disableNotifications}
                  className="w-full py-2 text-xs uppercase tracking-widest text-[#FF453A] border border-[#FF453A] bg-transparent cursor-pointer hover:bg-[#FF453A]/10 mt-2"
                >
                  Disable All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Commitment */}
        {profile?.commitment_statement && (
          <div className="card mb-6">
            <p className="section-label mb-4">Your Commitment</p>
            <p className="text-[#D4D4D6] text-sm leading-relaxed">
              "{profile.commitment_statement}"
            </p>
            {profile?.fighting_for && (
              <p className="text-xs text-[#8E8E93] mt-4">
                Fighting for: {profile.fighting_for}
              </p>
            )}
          </div>
        )}

        {/* Partner Access */}
        <div className="card mb-6">
          <p className="section-label mb-4">Accountability</p>
          <button
            onClick={() => navigate('/partner-access')}
            className="w-full flex items-center justify-between p-0 bg-transparent border-0 cursor-pointer"
            data-testid="partner-access-btn"
          >
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-[#FF453A]" />
              <div className="text-left">
                <p className="text-white font-medium">Partner Access</p>
                <p className="text-xs text-[#8E8E93]">Share progress with someone you trust</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#8E8E93]" />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="card-hover w-full flex items-center gap-4"
            data-testid="sign-out-btn"
          >
            <LogOut size={20} className="text-[#8E8E93]" />
            <span className="text-white">Sign Out</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="card w-full flex items-center gap-4 border-[#FF453A] hover:bg-[#FF453A]/10 transition-colors"
            data-testid="delete-account-btn"
          >
            <Trash2 size={20} className="text-[#FF453A]" />
            <span className="text-[#FF453A]">Delete Account</span>
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="card max-w-sm w-full">
              <h2 className="text-lg font-bold text-white mb-4">Delete Account?</h2>
              <p className="text-[#8E8E93] text-sm mb-6">
                This will permanently delete all your data including check-ins, journal entries, and progress. This cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary flex-1"
                  data-testid="cancel-delete-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate('/');
                  }}
                  className="flex-1 py-4 bg-[#FF453A] text-white uppercase tracking-widest text-sm font-semibold cursor-pointer border-0"
                  data-testid="confirm-delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logo & Version */}
        <div className="mt-8 text-center">
          <img 
            src="/logo.png" 
            alt="Marcus Jones Coaching" 
            className="h-8 w-auto mx-auto mb-2 opacity-60"
          />
          <p className="text-xs text-[#8E8E93]">
            Threshold v1.0.0
          </p>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
