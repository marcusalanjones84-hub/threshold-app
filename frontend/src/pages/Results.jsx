import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateResult, PROFILE_CONTENT, getWeeklySpend, getDrinksPerDay } from '../utils/scoring';
import { ArrowRight } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('assessment_answers');
    if (!stored) {
      navigate('/assessment');
      return;
    }
    
    const parsedAnswers = JSON.parse(stored);
    setAnswers(parsedAnswers);
    
    const calculatedResult = calculateResult(parsedAnswers);
    setResult(calculatedResult);
    
    // Delay content reveal for dramatic effect
    setTimeout(() => setShowContent(true), 500);
  }, [navigate]);

  if (!result || !answers) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <p className="text-[#8E8E93]">Loading your results...</p>
      </div>
    );
  }

  const content = PROFILE_CONTENT[result.profile];
  const weeklySpend = getWeeklySpend(answers.weekly_spend);
  const yearlySpend = weeklySpend * 52;
  const drinksPerDay = getDrinksPerDay(answers.weeknight_drinks, answers.weekend_drinks);

  const handleContinue = () => {
    // Store result for later use
    sessionStorage.setItem('assessment_result', JSON.stringify({
      ...result,
      weeklySpend,
      drinksPerDay,
    }));
    navigate('/register');
  };

  return (
    <div className="page-container min-h-screen" data-testid="results-page">
      <div className="content-width py-8">
        {showContent && (
          <div className="fade-in">
            {/* Headline */}
            <h1 className={`text-2xl sm:text-3xl font-bold mb-8 leading-tight ${content.colour}`}>
              {content.headline}
            </h1>
            
            {/* Opening */}
            <div className="space-y-4 mb-8">
              {content.opening.map((line, idx) => (
                <p key={idx} className="text-white text-lg font-medium">
                  {line}
                </p>
              ))}
            </div>
            
            {/* Divider */}
            <div className="divider" />
            
            {/* Body */}
            <div className="space-y-4 mb-8">
              {content.body.map((paragraph, idx) => (
                <p key={idx} className="text-[#D4D4D6] text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Divider */}
            <div className="divider" />
            
            {/* Cost Calculator */}
            <div className="mb-8">
              <p className="section-label mb-4">Your Cost</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="card">
                  <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Weekly</p>
                  <p className="text-2xl font-bold text-white">£{weeklySpend}</p>
                </div>
                <div className="card">
                  <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Yearly</p>
                  <p className="text-2xl font-bold text-white">£{yearlySpend.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="card mt-4">
                <p className="text-xs text-[#8E8E93] uppercase tracking-widest mb-2">Average per day</p>
                <p className="text-2xl font-bold text-white">{drinksPerDay} drinks</p>
                <p className="text-xs text-[#8E8E93] mt-1">
                  ~{Math.round(drinksPerDay * 180)} calories daily from alcohol
                </p>
              </div>
            </div>
            
            {/* CTA */}
            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="btn-primary flex items-center justify-center gap-3"
                data-testid="results-continue-btn"
              >
                <span>Create My Account</span>
                <ArrowRight size={18} />
              </button>
              
              <p className="text-xs text-[#8E8E93] text-center">
                Free. Private. Start the 30-day plan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
