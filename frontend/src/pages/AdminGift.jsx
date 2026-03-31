import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Gift, Check, X } from 'lucide-react';

const ADMIN_KEY = 'threshold-gift-2026';

export default function AdminGift() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Check for secret key
  const key = searchParams.get('key');
  
  if (key !== ADMIN_KEY) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <X size={48} className="text-[#FF453A] mx-auto mb-4" />
          <p className="text-white text-lg">Access Denied</p>
          <p className="text-[#8E8E93] text-sm mt-2">Invalid or missing access key</p>
        </div>
      </div>
    );
  }

  const handleGift = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Find user by email in profiles
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id, email, tier, first_name')
        .eq('email', email.toLowerCase().trim());

      if (searchError) {
        setResult({ success: false, message: `Error: ${searchError.message}` });
        setLoading(false);
        return;
      }

      if (!profiles || profiles.length === 0) {
        setResult({ success: false, message: 'User not found. Make sure they have signed up first.' });
        setLoading(false);
        return;
      }

      const profile = profiles[0];

      // Update tier
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tier: tier })
        .eq('id', profile.id);

      if (updateError) {
        setResult({ success: false, message: `Failed to update: ${updateError.message}` });
        setLoading(false);
        return;
      }

      setResult({ 
        success: true, 
        message: `Successfully gifted ${tier.toUpperCase()} access to ${profile.first_name || email}!`,
        previousTier: profile.tier,
        newTier: tier
      });
      setEmail('');

    } catch (err) {
      setResult({ success: false, message: `Error: ${err.message}` });
    }

    setLoading(false);
  };

  return (
    <div className="page-container pb-24" data-testid="admin-gift-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Gift size={28} className="text-[#32D74B]" />
            <h1 className="text-2xl font-bold text-white">Gift Access</h1>
          </div>
          <p className="text-[#8E8E93] text-sm">
            Give someone free access to THRESHOLD Pro or Complete
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleGift}>
          <div className="card mb-6">
            <label className="section-label mb-2 block">User Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              required
              className="input-field mb-4"
              data-testid="gift-email-input"
            />

            <label className="section-label mb-2 block">Access Level</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTier('pro')}
                className={`flex-1 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                  tier === 'pro'
                    ? 'bg-white text-[#1C1C1E]'
                    : 'border border-[#3A3A3C] text-[#8E8E93] bg-transparent'
                }`}
                data-testid="tier-pro-btn"
              >
                Pro
              </button>
              <button
                type="button"
                onClick={() => setTier('complete')}
                className={`flex-1 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                  tier === 'complete'
                    ? 'bg-white text-[#1C1C1E]'
                    : 'border border-[#3A3A3C] text-[#8E8E93] bg-transparent'
                }`}
                data-testid="tier-complete-btn"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={() => setTier('free')}
                className={`flex-1 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                  tier === 'free'
                    ? 'bg-white text-[#1C1C1E]'
                    : 'border border-[#3A3A3C] text-[#8E8E93] bg-transparent'
                }`}
                data-testid="tier-free-btn"
              >
                Free
              </button>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`card mb-6 ${result.success ? 'border-[#32D74B]' : 'border-[#FF453A]'}`}>
              <div className="flex items-center gap-3">
                {result.success ? (
                  <Check size={20} className="text-[#32D74B]" />
                ) : (
                  <X size={20} className="text-[#FF453A]" />
                )}
                <p className={result.success ? 'text-[#32D74B]' : 'text-[#FF453A]'}>
                  {result.message}
                </p>
              </div>
              {result.success && (
                <p className="text-[#8E8E93] text-sm mt-2">
                  Changed from {result.previousTier} → {result.newTier}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="btn-primary flex items-center justify-center gap-2"
            data-testid="gift-submit-btn"
          >
            {loading ? 'Processing...' : `Gift ${tier.toUpperCase()} Access`}
          </button>
        </form>

        {/* Info */}
        <div className="card mt-8">
          <p className="section-label mb-2">How it works</p>
          <ul className="text-[#8E8E93] text-sm space-y-2">
            <li>- User must have already signed up</li>
            <li>- Their account will be upgraded instantly</li>
            <li>- They'll have full access to all features</li>
            <li>- No payment or subscription created</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
