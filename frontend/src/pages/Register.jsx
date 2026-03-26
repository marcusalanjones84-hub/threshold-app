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

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

    try {
      const response = await fetch(
        `${supabaseUrl}/auth/v1/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            email,
            password,
            data: { first_name: firstName }
          })
        }
      );

      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('Failed to parse response:', responseText);
        setError('Server error. Please try again.');
        setLoading(false);
        return;
      }

      if (response.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(result.error_description || result.msg || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      if (result.id || result.user) {
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
        
        setError('Account created! Check your email to confirm, then sign in.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('Check your email to confirm your account.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Connection error. Please check your internet and try again.');
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
