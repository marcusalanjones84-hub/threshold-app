import { useNavigate } from 'react-router-dom';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../context/AuthContext';
import { PLAN_WEEKS } from '../data/planContent';
import TierGate from '../components/TierGate';
import { ArrowLeft, ArrowRight, Lock, Check } from 'lucide-react';

export default function Plan() {
  const navigate = useNavigate();
  const { tier } = useAuth();
  const { currentWeek, planProgress } = usePlan();

  const isWeekUnlocked = (weekNum) => {
    if (tier === 'free') return weekNum === 1;
    return true;
  };

  const isWeekComplete = (weekNum) => {
    if (!planProgress) return false;
    return planProgress[`week${weekNum}_complete`];
  };

  return (
    <div className="page-container pb-24" data-testid="plan-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="plan-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <h1 className="text-2xl font-bold text-white">30-Day Plan</h1>
          <p className="text-[#8E8E93] text-sm mt-2">
            Week {currentWeek || 1} of 4
          </p>
        </div>

        {/* Week Cards */}
        <div className="space-y-4">
          {PLAN_WEEKS.map((week) => {
            const unlocked = isWeekUnlocked(week.week);
            const complete = isWeekComplete(week.week);
            const isCurrent = week.week === currentWeek;
            
            return (
              <div key={week.week}>
                {unlocked ? (
                  <button
                    onClick={() => navigate(`/plan/week/${week.week}`)}
                    className={`card-hover w-full text-left ${
                      isCurrent ? 'border-white' : ''
                    }`}
                    data-testid={`week-${week.week}-btn`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="section-label">{week.subtitle}</p>
                          {complete && (
                            <Check size={14} className="text-[#32D74B]" />
                          )}
                        </div>
                        <p className="text-lg font-bold text-white mb-1">
                          {week.title}
                        </p>
                        <p className="text-sm text-[#8E8E93]">
                          {week.tagline}
                        </p>
                      </div>
                      <ArrowRight size={20} className="text-[#8E8E93] mt-1" />
                    </div>
                  </button>
                ) : (
                  <div className="card opacity-60" data-testid={`week-${week.week}-locked`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="section-label mb-2">{week.subtitle}</p>
                        <p className="text-lg font-bold text-white mb-1">
                          {week.title}
                        </p>
                        <p className="text-sm text-[#8E8E93]">
                          {week.tagline}
                        </p>
                      </div>
                      <Lock size={20} className="text-[#8E8E93] mt-1" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade CTA for free users */}
        {tier === 'free' && (
          <div className="mt-8">
            <TierGate requiredTier="pro">
              <div />
            </TierGate>
          </div>
        )}
      </div>
    </div>
  );
}
