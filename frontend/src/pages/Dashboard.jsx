import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStreak } from '../hooks/useStreak';
import { useCheckin } from '../hooks/useCheckin';
import { usePlan } from '../hooks/usePlan';
import MilestoneCard from '../components/MilestoneCard';
import NotificationPrompt from '../components/NotificationPrompt';
import { MILESTONES } from '../utils/dates';
import { ArrowRight, Settings } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const { streak, loading: streakLoading } = useStreak();
  const { hasCheckedInToday, checkinCount } = useCheckin();
  const { currentDay, currentWeek, hasStarted, startPlan } = usePlan();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true);

  // Start plan automatically if not started
  useEffect(() => {
    if (!hasStarted && profile?.onboarding_complete) {
      startPlan();
    }
  }, [hasStarted, profile, startPlan]);

  // Show notification prompt after first check-in or after 3 days
  const shouldShowNotificationPrompt = showNotificationPrompt && (
    checkinCount >= 1 || (streak?.current_streak >= 1)
  );

  if (authLoading || streakLoading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center pb-20">
        <p className="text-[#8E8E93]">Loading...</p>
      </div>
    );
  }

  const currentStreak = streak?.current_streak || 0;
  const showMilestone = MILESTONES[currentStreak];
  const greeting = getGreeting();

  return (
    <div className="page-container pb-24" data-testid="dashboard-page">
      <div className="content-width">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="section-label mb-2">{greeting}</p>
            <h1 className="text-2xl font-bold text-white">
              {profile?.first_name || 'There'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-transparent border-0 cursor-pointer text-[#8E8E93] hover:text-white"
            data-testid="settings-btn"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Milestone Card (if applicable) */}
        {showMilestone && (
          <div className="mb-8">
            <MilestoneCard streak={currentStreak} />
          </div>
        )}

        {/* Notification Prompt */}
        {shouldShowNotificationPrompt && (
          <div className="mb-6">
            <NotificationPrompt onDismiss={() => setShowNotificationPrompt(false)} />
          </div>
        )}

        {/* Current Streak */}
        <div className="card mb-6" data-testid="streak-card">
          <p className="section-label mb-4">Current Streak</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{currentStreak}</span>
            <span className="text-[#8E8E93] text-lg">days</span>
          </div>
          {streak?.longest_streak > currentStreak && (
            <p className="text-xs text-[#8E8E93] mt-2">
              Longest: {streak.longest_streak} days
            </p>
          )}
        </div>

        {/* Daily Check-in CTA */}
        {!hasCheckedInToday ? (
          <button
            onClick={() => navigate('/checkin')}
            className="card-hover w-full text-left mb-6 flex items-center justify-between"
            data-testid="checkin-cta"
          >
            <div>
              <p className="section-label mb-2">Daily Check-in</p>
              <p className="text-white font-medium">How are you today?</p>
            </div>
            <ArrowRight size={20} className="text-[#8E8E93]" />
          </button>
        ) : (
          <div className="card mb-6 border-[#32D74B]" data-testid="checkin-complete">
            <p className="section-label mb-2">Today's Check-in</p>
            <p className="text-[#32D74B] font-medium">Complete</p>
          </div>
        )}

        {/* Plan Progress */}
        <button
          onClick={() => navigate('/plan')}
          className="card-hover w-full text-left mb-6 flex items-center justify-between"
          data-testid="plan-cta"
        >
          <div>
            <p className="section-label mb-2">30-Day Plan</p>
            <p className="text-white font-medium">
              Week {currentWeek || 1} - Day {currentDay || 1}
            </p>
          </div>
          <ArrowRight size={20} className="text-[#8E8E93]" />
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Check-ins</p>
            <p className="text-2xl font-bold text-white">{checkinCount}</p>
          </div>
          <div className="card">
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Days Free</p>
            <p className="text-2xl font-bold text-white">{streak?.total_days_free || 0}</p>
          </div>
        </div>

        {/* Fighting For */}
        {profile?.fighting_for && (
          <div className="card border-[#3A3A3C]">
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Fighting For</p>
            <p className="text-white font-medium">{profile.fighting_for}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
