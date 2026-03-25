import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FRAMING_CONTENT = [
  {
    headline: 'This isn\'t about addiction.',
    body: [
      'It\'s about the gap between who you are and who you show up as.',
      'About the cost of numbing what needs to be felt.',
      'About whether the trade-off is still worth it.',
    ]
  },
  {
    headline: 'You\'ve built something.',
    body: [
      'A career. A family. A reputation.',
      'And somewhere along the way, drinking became how you managed the weight of it.',
      'That worked. Until it didn\'t.',
    ]
  },
  {
    headline: 'This assessment takes 5 minutes.',
    body: [
      'It\'s honest. It\'s private. And it will tell you something about where you actually are.',
      'Not where you hope you are.',
      'Where you are.',
    ]
  },
];

export default function Framing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < FRAMING_CONTENT.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/assessment');
    }
  };

  const content = FRAMING_CONTENT[step];
  const isLast = step === FRAMING_CONTENT.length - 1;

  return (
    <div className="page-container min-h-screen flex flex-col" data-testid="framing-page">
      <div className="flex-1 flex flex-col justify-center content-width">
        <div key={step} className="fade-in">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-12">
            {FRAMING_CONTENT.map((_, idx) => (
              <div
                key={idx}
                className={`h-px flex-1 transition-colors duration-300 ${
                  idx <= step ? 'bg-white' : 'bg-[#3A3A3C]'
                }`}
              />
            ))}
          </div>
          
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
            {content.headline}
          </h1>
          
          {/* Body paragraphs */}
          <div className="space-y-4 mb-12">
            {content.body.map((paragraph, idx) => (
              <p key={idx} className="text-[#D4D4D6] text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* CTA */}
          <button
            onClick={handleNext}
            className="btn-primary flex items-center justify-center gap-3"
            data-testid="framing-next-btn"
          >
            <span>{isLast ? 'Start Assessment' : 'Continue'}</span>
            <ArrowRight size={18} />
          </button>
          
          {/* Skip */}
          {!isLast && (
            <button
              onClick={() => navigate('/assessment')}
              className="btn-ghost mt-4"
              data-testid="skip-framing-btn"
            >
              Skip to assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
