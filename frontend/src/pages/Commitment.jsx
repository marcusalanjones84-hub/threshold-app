import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Commitment() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [commitment, setCommitment] = useState('');
  const [fightingFor, setFightingFor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
    } else {
      setLoading(true);
      
      await updateProfile({
        commitment_statement: commitment,
        fighting_for: fightingFor,
        onboarding_complete: true,
      });
      
      navigate('/dashboard');
    }
  };

  const canProceed = step === 0 ? commitment.length >= 10 : fightingFor.length >= 3;

  return (
    <div className="page-container min-h-screen flex flex-col" data-testid="commitment-page">
      <div className="flex-1 flex flex-col justify-center content-width">
        {step === 0 ? (
          <div className="fade-in">
            <p className="section-label mb-6">Your Commitment</p>
            
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
              Why are you doing this?
            </h1>
            
            <p className="text-[#8E8E93] text-sm mb-8">
              Write it in your own words. This is for you alone.
            </p>
            
            <textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="I'm doing this because..."
              className="input-field min-h-[150px] resize-none mb-8"
              data-testid="commitment-input"
            />
            
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="btn-primary flex items-center justify-center gap-3"
              data-testid="commitment-next-btn"
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="fade-in">
            <p className="section-label mb-6">One More Thing</p>
            
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight">
              Who are you fighting for?
            </h1>
            
            <p className="text-[#8E8E93] text-sm mb-8">
              A name. A face. Someone who matters.
            </p>
            
            <input
              type="text"
              value={fightingFor}
              onChange={(e) => setFightingFor(e.target.value)}
              placeholder="Their name..."
              className="input-field mb-8"
              data-testid="fighting-for-input"
            />
            
            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="btn-primary flex items-center justify-center gap-3"
              data-testid="commitment-complete-btn"
            >
              <span>{loading ? 'Starting...' : 'Start My 30 Days'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
