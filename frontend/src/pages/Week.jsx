import { useParams, useNavigate } from 'react-router-dom';
import { usePlan } from '../hooks/usePlan';
import { useAuth } from '../context/AuthContext';
import { PLAN_WEEKS } from '../data/planContent';
import { ArrowLeft, Check } from 'lucide-react';

export default function Week() {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const { tier } = useAuth();
  const { completeWeek, planProgress } = usePlan();
  
  const weekNum = parseInt(weekNumber);
  const week = PLAN_WEEKS.find(w => w.week === weekNum);
  
  if (!week) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center pb-20">
        <p className="text-[#8E8E93]">Week not found</p>
      </div>
    );
  }

  // Check access
  if (tier === 'free' && weekNum > 1) {
    navigate('/upgrade');
    return null;
  }

  const isComplete = planProgress?.[`week${weekNum}_complete`];

  const handleComplete = async () => {
    await completeWeek(weekNum);
  };

  return (
    <div className="page-container pb-24" data-testid="week-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/plan')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="week-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <p className="section-label mb-2">{week.subtitle}</p>
          <h1 className="text-2xl font-bold text-white mb-2">{week.title}</h1>
          <p className="text-[#8E8E93] text-sm">{week.tagline}</p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {week.sections.map((section, idx) => (
            <div key={idx} className="card" data-testid={`section-${idx}`}>
              <h2 className="text-lg font-bold text-white mb-3">
                {section.title}
              </h2>
              <p className="text-[#D4D4D6] text-sm leading-relaxed mb-4">
                {section.content}
              </p>
              
              {section.actions && section.actions.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-[#3A3A3C]">
                  <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-3">
                    Actions
                  </p>
                  {section.actions.map((action, actionIdx) => (
                    <div 
                      key={actionIdx} 
                      className="flex gap-3 text-sm text-[#D4D4D6]"
                    >
                      <span className="text-[#8E8E93] flex-shrink-0">-</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Complete Week Button */}
        <div className="mt-8">
          {isComplete ? (
            <div className="card border-[#32D74B] text-center">
              <div className="flex items-center justify-center gap-2">
                <Check size={20} className="text-[#32D74B]" />
                <span className="text-[#32D74B] font-medium">Week Complete</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-primary"
              data-testid="complete-week-btn"
            >
              Mark Week as Complete
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-4">
          {weekNum > 1 && (
            <button
              onClick={() => navigate(`/plan/week/${weekNum - 1}`)}
              className="btn-secondary flex-1"
            >
              Previous Week
            </button>
          )}
          {weekNum < 4 && (tier !== 'free' || weekNum < 1) && (
            <button
              onClick={() => navigate(`/plan/week/${weekNum + 1}`)}
              className="btn-secondary flex-1"
            >
              Next Week
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
