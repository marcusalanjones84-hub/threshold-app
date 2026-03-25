import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import ProgressBar from '../components/ProgressBar';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Assessment() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === QUESTIONS.length - 1;
  
  // Check if current question is answered
  const currentAnswer = answers[question.id];
  const isAnswered = question.type === 'multi' 
    ? (currentAnswer && currentAnswer.length > 0)
    : !!currentAnswer;

  const handleOptionSelect = (value) => {
    if (question.type === 'multi') {
      const current = answers[question.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: value });
      // Auto-advance for single select after a brief delay
      if (!isLast) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
      }
    }
  };

  const handleNext = () => {
    if (isLast) {
      // Store answers and navigate to results
      sessionStorage.setItem('assessment_answers', JSON.stringify(answers));
      navigate('/results');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isOptionSelected = (value) => {
    if (question.type === 'multi') {
      return (answers[question.id] || []).includes(value);
    }
    return answers[question.id] === value;
  };

  return (
    <div className="page-container min-h-screen flex flex-col" data-testid="assessment-page">
      {/* Header */}
      <div className="content-width mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className={`p-2 bg-transparent border-0 cursor-pointer transition-opacity ${
              isFirst ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            data-testid="assessment-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <span className="section-label">{question.sectionLabel}</span>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
        <ProgressBar 
          current={currentIndex + 1} 
          total={QUESTIONS.length}
          showCount={true}
        />
      </div>

      {/* Question */}
      <div className="flex-1 content-width">
        <div key={currentIndex} className="fade-in">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
            {question.text}
          </h2>
          
          {question.subtext && (
            <p className="text-sm text-[#8E8E93] mb-8">
              {question.subtext}
            </p>
          )}

          {/* Options */}
          <div className="space-y-3 mt-8">
            {question.options.map((option, idx) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full text-left p-4 border transition-all duration-200 bg-transparent cursor-pointer ${
                  isOptionSelected(option.value)
                    ? 'border-white text-white'
                    : 'border-[#3A3A3C] text-[#D4D4D6] hover:border-[#8E8E93]'
                }`}
                data-testid={`option-${option.value}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    isOptionSelected(option.value)
                      ? 'border-white bg-white'
                      : 'border-[#3A3A3C]'
                  }`}>
                    {isOptionSelected(option.value) && (
                      <div className="w-2 h-2 bg-[#1C1C1E]" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium">{option.label}</span>
                    {option.sub && (
                      <p className="text-xs text-[#8E8E93] mt-1">{option.sub}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - only show for multi-select or last question */}
      {(question.type === 'multi' || isLast) && (
        <div className="content-width pt-6 pb-8">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="btn-primary flex items-center justify-center gap-3"
            data-testid="assessment-next-btn"
          >
            <span>{isLast ? 'See My Results' : 'Continue'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
