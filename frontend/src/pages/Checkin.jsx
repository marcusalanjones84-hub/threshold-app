import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckin } from '../hooks/useCheckin';
import { useStreak } from '../hooks/useStreak';
import ScoreSlider from '../components/ScoreSlider';
import { ArrowLeft, Check } from 'lucide-react';

export default function Checkin() {
  const navigate = useNavigate();
  const { submitCheckin, todaysCheckin } = useCheckin();
  const { updateStreak } = useStreak();
  
  const [step, setStep] = useState(todaysCheckin ? 'complete' : 'drink');
  const [drankToday, setDrankToday] = useState(null);
  const [drinksCount, setDrinksCount] = useState(0);
  const [clarity, setClarity] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [familyConnection, setFamilyConnection] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [intention, setIntention] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDrinkAnswer = (answer) => {
    setDrankToday(answer);
    if (answer) {
      setStep('drinks-count');
    } else {
      setStep('scores');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    await submitCheckin({
      drank_today: drankToday,
      drinks_count: drinksCount,
      clarity_score: clarity,
      energy_score: energy,
      family_connection: familyConnection,
      stress_level: stressLevel,
      todays_intention: intention,
      notes,
    });
    
    await updateStreak(drankToday);
    
    setStep('complete');
    setLoading(false);
  };

  if (step === 'complete' || todaysCheckin) {
    return (
      <div className="page-container min-h-screen flex flex-col pb-24" data-testid="checkin-complete-page">
        <div className="flex-1 flex flex-col justify-center content-width text-center">
          <div className="fade-in">
            <div className="w-16 h-16 mx-auto mb-6 border border-[#32D74B] flex items-center justify-center">
              <Check size={32} className="text-[#32D74B]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Check-in Complete</h1>
            <p className="text-[#8E8E93] mb-8">
              {todaysCheckin?.drank_today === false || drankToday === false
                ? "Another day stronger. Keep going."
                : "Tomorrow is a new day. Get back on track."}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              data-testid="back-to-dashboard-btn"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex flex-col pb-24" data-testid="checkin-page">
      {/* Header */}
      <div className="content-width mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-transparent border-0 cursor-pointer -ml-2"
          data-testid="checkin-back-btn"
        >
          <ArrowLeft size={20} className="text-[#8E8E93]" />
        </button>
      </div>

      <div className="flex-1 content-width">
        {step === 'drink' && (
          <div className="fade-in">
            <p className="section-label mb-6">Daily Check-in</p>
            <h1 className="text-2xl font-bold text-white mb-8">
              Did you drink today?
            </h1>
            
            <div className="space-y-4">
              <button
                onClick={() => handleDrinkAnswer(false)}
                className="card-hover w-full text-left"
                data-testid="no-drink-btn"
              >
                <p className="text-white font-medium">No</p>
                <p className="text-sm text-[#8E8E93]">I stayed alcohol-free</p>
              </button>
              
              <button
                onClick={() => handleDrinkAnswer(true)}
                className="card-hover w-full text-left"
                data-testid="yes-drink-btn"
              >
                <p className="text-white font-medium">Yes</p>
                <p className="text-sm text-[#8E8E93]">I had something to drink</p>
              </button>
            </div>
          </div>
        )}

        {step === 'drinks-count' && (
          <div className="fade-in">
            <p className="section-label mb-6">How many?</p>
            <h1 className="text-2xl font-bold text-white mb-8">
              How many drinks did you have?
            </h1>
            
            <div className="mb-8">
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setDrinksCount(Math.max(0, drinksCount - 1))}
                  className="w-12 h-12 border border-[#3A3A3C] text-white text-2xl bg-transparent cursor-pointer hover:border-white"
                  data-testid="decrease-drinks-btn"
                >
                  -
                </button>
                <span className="text-5xl font-bold text-white tabular-nums">
                  {drinksCount}
                </span>
                <button
                  onClick={() => setDrinksCount(drinksCount + 1)}
                  className="w-12 h-12 border border-[#3A3A3C] text-white text-2xl bg-transparent cursor-pointer hover:border-white"
                  data-testid="increase-drinks-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setStep('scores')}
              className="btn-primary"
              data-testid="drinks-continue-btn"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'scores' && (
          <div className="fade-in">
            <p className="section-label mb-6">How do you feel?</p>
            <h1 className="text-xl font-bold text-white mb-8">
              Rate your day
            </h1>
            
            <ScoreSlider
              label="Mental Clarity"
              value={clarity}
              onChange={setClarity}
              lowLabel="Foggy"
              highLabel="Sharp"
            />
            
            <ScoreSlider
              label="Energy Level"
              value={energy}
              onChange={setEnergy}
              lowLabel="Drained"
              highLabel="Energized"
            />
            
            <ScoreSlider
              label="Family Connection"
              value={familyConnection}
              onChange={setFamilyConnection}
              lowLabel="Distant"
              highLabel="Connected"
            />
            
            <ScoreSlider
              label="Stress Level"
              value={stressLevel}
              onChange={setStressLevel}
              lowLabel="Calm"
              highLabel="Stressed"
            />
            
            <button
              onClick={() => setStep('intention')}
              className="btn-primary mt-4"
              data-testid="scores-continue-btn"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'intention' && (
          <div className="fade-in">
            <p className="section-label mb-6">Tomorrow</p>
            <h1 className="text-xl font-bold text-white mb-4">
              What's your intention for tomorrow?
            </h1>
            <p className="text-sm text-[#8E8E93] mb-6">Optional but powerful</p>
            
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Tomorrow I will..."
              className="input-field min-h-[100px] resize-none mb-6"
              data-testid="intention-input"
            />
            
            <p className="text-sm text-[#8E8E93] mb-2">Any notes for today?</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className="input-field min-h-[80px] resize-none mb-6"
              data-testid="notes-input"
            />
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
              data-testid="submit-checkin-btn"
            >
              {loading ? 'Saving...' : 'Complete Check-in'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
