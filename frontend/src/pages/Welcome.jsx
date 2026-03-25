import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const handleStart = () => {
    if (isAuthenticated && profile?.onboarding_complete) {
      navigate('/dashboard');
    } else if (isAuthenticated) {
      navigate('/framing');
    } else {
      navigate('/framing');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="page-container min-h-screen flex flex-col" data-testid="welcome-page">
      <div className="flex-1 flex flex-col justify-center content-width">
        <div className="fade-in">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="Marcus Jones Coaching" 
              className="h-12 w-auto"
              data-testid="logo"
            />
          </div>
          
          {/* Brand */}
          <p className="section-label mb-4">Threshold</p>
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-white mb-6 leading-tight">
            For men who are done pretending.
          </h1>
          
          {/* Subtext */}
          <p className="text-[#D4D4D6] text-base leading-relaxed mb-4">
            A private assessment and 30-day plan for high-achieving men who drink too much and are ready to stop.
          </p>
          
          <p className="text-[#8E8E93] text-sm leading-relaxed mb-12">
            No labels. No judgment. Just clarity.
          </p>
          
          {/* CTA */}
          <button
            onClick={handleStart}
            className="btn-primary flex items-center justify-center gap-3"
            data-testid="start-assessment-btn"
          >
            <span>Begin Assessment</span>
            <ArrowRight size={18} />
          </button>
          
          {/* Login link */}
          <button
            onClick={handleLogin}
            className="btn-ghost mt-4"
            data-testid="login-link"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="content-width pb-8">
        <p className="text-xs text-[#8E8E93] text-center">
          15 questions. 5 minutes. Completely private.
        </p>
      </div>
    </div>
  );
}
