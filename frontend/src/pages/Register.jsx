import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use direct fetch to avoid the body stream issue
      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/auth/v1/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            email,
            password,
            data: { first_name: firstName }
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error_description || result.msg || 'Signup failed');
        setLoading(false);
        return;
      }

      if (result.id || result.user) {
        const userId = result.id || result.user?.id;
        
        // Update profile with first name (fire and forget)
        if (userId) {
          supabase
            .from('profiles')
            .update({ first_name: firstName })
            .eq('id', userId)
            .then(() => console.log('Profile updated'))
            .catch(() => {});
        }
        
        // Send to GoHighLevel (fire and forget)
        const API_URL = process.env.REACT_APP_BACKEND_URL || '';
        if (API_URL) {
          fetch(`${API_URL}/api/integrations/ghl-signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              first_name: firstName,
              source: 'THRESHOLD App Signup'
            })
          }).catch(() => {});
        }
        
        // Store assessment data if available
        const assessmentResult = sessionStorage.getItem('assessment_result');
        const assessmentAnswers = sessionStorage.getItem('assessment_answers');
        
        if (assessmentResult && assessmentAnswers && userId) {
          try {
            const parsedResult = JSON.parse(assessmentResult);
            const answers = JSON.parse(assessmentAnswers);
            
            supabase.from('assessments').insert({
              user_id: userId,
              ...answers,
              profile_result: parsedResult.profile,
              risk_score: parsedResult.score,
              weekly_spend_gbp: parsedResult.weeklySpend,
              drinks_per_day: Math.round(parsedResult.drinksPerDay),
            }).catch(() => {});
            
            sessionStorage.removeItem('assessment_result');
            sessionStorage.removeItem('assessment_answers');
          } catch (parseErr) {
            console.log('Assessment parse error');
          }
        }
        
        // Show success message
        setError('Account created! Please check your email to confirm, then sign in.');
        setLoading(false);
      } else {
        setError('Please check your email to confirm your account.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Unable to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col" data-testid="register-page">
      <div className="flex-1 flex flex-col justify-center content-width">
        <div className="fade-in">
          <p className="section-label mb-6">Create Account</p>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            Start your 30 days
          </h1>
          
          <p className="text-[#8E8E93] text-sm mb-8">
            Your data is private. We'll never share it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-[#8E8E93] uppercase tracking-widest mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field"
                placeholder="Your first name"
                required
                data-testid="register-first-name"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
                data-testid="register-email"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8E8E93] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Create a password"
                  minLength={6}
                  required
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-[#8E8E93] mt-2">
                Minimum 6 characters
              </p>
            </div>

            {error && (
              <p className="text-[#FF453A] text-sm" data-testid="register-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !firstName || !email || password.length < 6}
              className="btn-primary flex items-center justify-center gap-3"
              data-testid="register-submit-btn"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#8E8E93] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline" data-testid="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
