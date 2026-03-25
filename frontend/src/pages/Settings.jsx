import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ArrowLeft, LogOut, Crown, Trash2, Bell, BellOff } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, signOut, tier } = useAuth();
  const { 
    isEnabled, 
    isSupported, 
    isDenied,
    requestPermission, 
    disableNotifications,
    sendTest,
    loading: notificationLoading 
  } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [testSent, setTestSent] = useState(false);

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isEnabled ? (
                  <Bell size={20} className="text-[#32D74B]" />
                ) : (
                  <BellOff size={20} className="text-[#8E8E93]" />
                )}
                <div>
                  <p className="text-white font-medium">Daily Reminders</p>
                  <p className="text-xs text-[#8E8E93]">
                    {isEnabled ? 'Enabled - 9:00 AM' : isDenied ? 'Blocked in browser' : 'Disabled'}
                  </p>
                </div>
              </div>
              {isEnabled ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sendTest();
                      setTestSent(true);
                      setTimeout(() => setTestSent(false), 2000);
                    }}
                    className="text-xs uppercase tracking-widest text-[#8E8E93] border border-[#3A3A3C] px-3 py-2 bg-transparent cursor-pointer hover:border-white hover:text-white"
                    disabled={testSent}
                    data-testid="test-notification-settings-btn"
                  >
                    {testSent ? 'Sent!' : 'Test'}
                  </button>
                  <button
                    onClick={disableNotifications}
                    className="text-xs uppercase tracking-widest text-[#FF453A] border border-[#FF453A] px-3 py-2 bg-transparent cursor-pointer hover:bg-[#FF453A]/10"
                    data-testid="disable-notification-settings-btn"
                  >
                    Disable
                  </button>
                </div>
              ) : !isDenied ? (
                <button
                  onClick={requestPermission}
                  disabled={notificationLoading}
                  className="text-xs uppercase tracking-widest text-white border border-[#3A3A3C] px-4 py-2 bg-transparent cursor-pointer hover:border-white"
                  data-testid="enable-notification-settings-btn"
                >
                  {notificationLoading ? 'Enabling...' : 'Enable'}
                </button>
              ) : null}
            </div>
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
                    // In production, this would call an API to delete the account
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

        {/* Version */}
        <p className="text-xs text-[#8E8E93] text-center mt-8">
          Threshold v1.0.0
        </p>
      </div>
    </div>
  );
}
