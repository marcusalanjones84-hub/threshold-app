import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TIER_DETAILS, mockUpgradeTier } from '../lib/stripe';
import { ArrowLeft, Check } from 'lucide-react';

export default function Upgrade() {
  const navigate = useNavigate();
  const { tier, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    
    // Mock upgrade - in production, this would redirect to Stripe
    const success = mockUpgradeTier(selectedPlan);
    
    if (success) {
      await refreshProfile();
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const proDetails = TIER_DETAILS.pro;
  const completeDetails = TIER_DETAILS.complete;

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
            className="btn-primary"
            data-testid="confirm-upgrade-btn"
          >
            {loading ? 'Processing...' : `Upgrade to ${selectedPlan === 'pro' ? 'Pro' : 'Complete'}`}
          </button>
        )}

        {/* Note about mock */}
        <p className="text-xs text-[#8E8E93] text-center mt-4">
          Demo mode: Upgrade is simulated. Connect Stripe for real payments.
        </p>
      </div>
    </div>
  );
}
