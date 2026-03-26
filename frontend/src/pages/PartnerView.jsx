import { useParams, useNavigate } from 'react-router-dom';
import { usePartnerViewData } from '../hooks/usePartnerAccess';
import { MILESTONES } from '../utils/dates';
import { Heart, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PartnerView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = usePartnerViewData(code);

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <p className="text-[#8E8E93]">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container min-h-screen flex flex-col items-center justify-center" data-testid="partner-error">
        <div className="content-width text-center">
          <div className="w-16 h-16 mx-auto mb-6 border border-[#FF453A] flex items-center justify-center">
            <XCircle size={32} className="text-[#FF453A]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-4">Link Not Valid</h1>
          <p className="text-[#8E8E93] mb-8">
            This partner link is invalid or has been revoked.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Go to Threshold
          </button>
        </div>
      </div>
    );
  }

  const milestone = MILESTONES[data.currentStreak];

  return (
    <div className="page-container pb-12" data-testid="partner-view">
      <div className="content-width">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart size={20} className="text-[#FF453A]" />
            <p className="section-label">Partner View</p>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {data.firstName}'s Journey
          </h1>
          <p className="text-sm text-[#8E8E93]">
            Supporting someone you love
          </p>
        </div>

        {/* Current Streak - Main Focus */}
        <div className="card mb-6 text-center border-white" data-testid="partner-streak">
          <p className="section-label mb-4">Current Streak</p>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-6xl font-bold text-white">{data.currentStreak}</span>
            <span className="text-xl text-[#8E8E93]">days</span>
          </div>
          {milestone && (
            <p className="text-sm text-[#D4A017] mt-4">
              {milestone.title} - {milestone.message}
            </p>
          )}
        </div>

        {/* Today's Status */}
        <div className={`card mb-6 ${data.hasCheckedInToday ? 'border-[#32D74B]' : 'border-[#D4A017]'}`}>
          <div className="flex items-center gap-4">
            {data.hasCheckedInToday ? (
              <>
                <div className="w-12 h-12 border border-[#32D74B] flex items-center justify-center">
                  <CheckCircle size={24} className="text-[#32D74B]" />
                </div>
                <div>
                  <p className="text-white font-medium">Checked in today</p>
                  <p className="text-sm text-[#8E8E93]">
                    {data.todayDrankStatus === false 
                      ? "Stayed alcohol-free" 
                      : data.todayDrankStatus === true 
                        ? "Had a difficult day, but checked in"
                        : "Completed daily check-in"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 border border-[#D4A017] flex items-center justify-center">
                  <Clock size={24} className="text-[#D4A017]" />
                </div>
                <div>
                  <p className="text-white font-medium">Waiting for check-in</p>
                  <p className="text-sm text-[#8E8E93]">
                    Not checked in yet today
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="card mb-6">
          <p className="section-label mb-4">Last 7 Days</p>
          <div className="flex justify-between">
            {data.last7Days.map((day, idx) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' }).charAt(0);
              const isToday = idx === data.last7Days.length - 1;
              
              return (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-[#8E8E93]">{dayName}</span>
                  <div className={`w-8 h-8 flex items-center justify-center border ${
                    !day.checkedIn 
                      ? 'border-[#3A3A3C] text-[#3A3A3C]'
                      : day.drankToday === false
                        ? 'border-[#32D74B] text-[#32D74B]'
                        : day.drankToday === true
                          ? 'border-[#FF453A] text-[#FF453A]'
                          : 'border-[#8E8E93] text-[#8E8E93]'
                  }`}>
                    {day.checkedIn ? (
                      day.drankToday === false ? '✓' : day.drankToday === true ? '×' : '•'
                    ) : (
                      isToday ? '?' : '–'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#3A3A3C]">
            <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
              <span className="w-3 h-3 border border-[#32D74B]"></span>
              <span>Alcohol-free</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8E8E93]">
              <span className="w-3 h-3 border border-[#FF453A]"></span>
              <span>Drank</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <TrendingUp size={20} className="text-[#8E8E93] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.longestStreak}</p>
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mt-1">Longest Streak</p>
          </div>
          <div className="card text-center">
            <Calendar size={20} className="text-[#8E8E93] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.totalDaysFree}</p>
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mt-1">Days Free</p>
          </div>
        </div>

        {/* Plan Progress */}
        <div className="card mb-8">
          <p className="section-label mb-2">30-Day Plan</p>
          <p className="text-white font-medium">Week {data.planWeek} of 4</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4].map((week) => (
              <div
                key={week}
                className={`flex-1 h-1 ${
                  week <= data.planWeek ? 'bg-white' : 'bg-[#3A3A3C]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Supportive Message */}
        <div className="text-center">
          <p className="text-[#8E8E93] text-sm leading-relaxed mb-4">
            Your support matters more than you know.<br />
            Being here shows you care.
          </p>
          <img 
            src="/logo.png" 
            alt="Marcus Jones Coaching" 
            className="h-6 w-auto mx-auto opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
