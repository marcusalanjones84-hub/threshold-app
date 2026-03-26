import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TIER_DETAILS, createCheckoutSession, pollPaymentStatus, mockUpgradeTier } from '../lib/stripe';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

export default function Upgrade() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tier, refreshProfile, user, profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  // Check for return from Stripe
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const status = searchParams.get('status');

    if (sessionId && status === 'success') {
      setPaymentStatus('checking');
      pollPaymentStatus(
        sessionId,
        (result) => {
          setPaymentStatus('success');
          // Update local tier based on metadata
          const packageId = result.metadata?.package_id;
          if (packageId) {
            const newTier = packageId.includes('complete') ? 'complete' : 'pro';
            mockUpgradeTier(newTier);
            refreshProfile();
          }
          // Redirect after short delay
          setTimeout(() => navigate('/dashboard'), 2000);
        },
        (errorMsg) => {
          setPaymentStatus('error');
          setError(errorMsg);
        }
      );
    } else if (status === 'cancelled') {
      setPaymentStatus('cancelled');
    }
  }, [searchParams, navigate, refreshProfile]);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine package ID
      let packageId;
      if (selectedPlan === 'complete') {
        packageId = 'complete_monthly';
      } else {
        packageId = billingCycle === 'annual' ? 'pro_annual' : 'pro_monthly';
      }
      
      // Create checkout session and redirect
      await createCheckoutSession(
        packageId,
        user?.id || null,
        profile?.email || null
      );
    } catch (err) {
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  const proDetails = TIER_DETAILS.pro;
  const completeDetails = TIER_DETAILS.complete;

  // Payment status screens
  if (paymentStatus === 'checking') {
    return (
      <div className="page-container min-h-screen flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-white animate-spin mb-4" />
        <p className="text-white text-lg">Verifying payment...</p>
        <p className="text-[#8E8E93] text-sm mt-2">Please wait</p>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="page-container min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#32D74B] flex items-center justify-center mb-4">
          <Check size={32} className="text-[#32D74B]" />
        </div>
        <p className="text-white text-lg font-bold">Payment Successful!</p>
        <p className="text-[#8E8E93] text-sm mt-2">Welcome to Threshold Pro</p>
        <p className="text-[#8E8E93] text-xs mt-4">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="page-container pb-24" data-testid="upgrade-page">
        <div className="content-width">
          <div className="card border-[#D4A017] mb-6 text-center">
            <p className="text-[#D4A017] font-medium mb-2">Payment Cancelled</p>
            <p className="text-[#8E8E93] text-sm">No worries - you can try again when ready.</p>
          </div>
          <button
            onClick={() => {
              setPaymentStatus(null);
              navigate('/upgrade', { replace: true });
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-24" data-testid="upgrade-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="upgrade-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <h1 className="text-2xl font-bold text-white">Upgrade</h1>
          <p className="text-[#8E8E93] text-sm mt-2">
            Get the full 30-day programme
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card border-[#FF453A] mb-6">
            <p className="text-[#FF453A] text-sm">{error}</p>
          </div>
        )}

        {/* Current Plan */}
        {tier !== 'free' && (
          <div className="card mb-6 border-[#32D74B]">
            <p className="section-label mb-2">Current Plan</p>
            <p className="text-white font-bold">
              {tier === 'pro' ? 'Threshold Pro' : 'Threshold Complete'}
            </p>
          </div>
        )}

        {/* Plan Selection */}
        <div className="space-y-4 mb-8">
          {/* Pro Plan */}
          <button
            onClick={() => setSelectedPlan('pro')}
            className={`card w-full text-left transition-colors ${
              selectedPlan === 'pro' ? 'border-white' : ''
            }`}
            disabled={tier === 'pro' || tier === 'complete'}
            data-testid="select-pro-btn"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-bold text-white">{proDetails.name}</p>
                <p className="text-sm text-[#8E8E93]">
                  {billingCycle === 'annual' 
                    ? `£${proDetails.annualMonthly}/month (billed annually)`
                    : `£${proDetails.monthlyPrice}/month`
                  }
                </p>
              </div>
              {selectedPlan === 'pro' && tier === 'free' && (
                <div className="w-5 h-5 border border-white bg-white flex items-center justify-center">
                  <Check size={14} className="text-[#1C1C1E]" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {proDetails.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-[#D4D4D6]">
                  <span className="text-[#8E8E93]">-</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </button>

          {/* Complete Plan */}
          <button
            onClick={() => setSelectedPlan('complete')}
            className={`card w-full text-left transition-colors ${
              selectedPlan === 'complete' ? 'border-white' : ''
            }`}
            disabled={tier === 'complete'}
            data-testid="select-complete-btn"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-bold text-white">{completeDetails.name}</p>
                <p className="text-sm text-[#8E8E93]">
                  £{completeDetails.monthlyPrice}/month
                </p>
              </div>
              {selectedPlan === 'complete' && tier !== 'complete' && (
                <div className="w-5 h-5 border border-white bg-white flex items-center justify-center">
                  <Check size={14} className="text-[#1C1C1E]" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {completeDetails.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-[#D4D4D6]">
                  <span className="text-[#8E8E93]">-</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Billing Toggle (for Pro) */}
        {selectedPlan === 'pro' && tier === 'free' && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#1C1C1E]'
                  : 'border border-[#3A3A3C] text-[#8E8E93] bg-transparent'
              }`}
              data-testid="annual-billing-btn"
            >
              Annual (Save 34%)
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-3 text-sm uppercase tracking-widest font-semibold transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#1C1C1E]'
                  : 'border border-[#3A3A3C] text-[#8E8E93] bg-transparent'
              }`}
              data-testid="monthly-billing-btn"
            >
              Monthly
            </button>
          </div>
        )}

        {/* Upgrade Button */}
        {tier === 'free' && (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2"
            data-testid="confirm-upgrade-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Redirecting to checkout...</span>
              </>
            ) : (
              `Upgrade to ${selectedPlan === 'pro' ? 'Pro' : 'Complete'}`
            )}
          </button>
        )}

        {/* Stripe trust badge */}
        <p className="text-xs text-[#8E8E93] text-center mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}
