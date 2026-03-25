import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function TierGate({ 
  requiredTier = 'pro',
  children,
  message,
  ctaText
}) {
  const { tier } = useAuth();
  const navigate = useNavigate();
  
  const tierLevel = { free: 0, pro: 1, complete: 2 };
  const hasAccess = tierLevel[tier] >= tierLevel[requiredTier];
  
  if (hasAccess) return children;
  
  const defaultMessages = {
    pro: 'This feature is part of Threshold Pro.',
    complete: 'This feature is part of Threshold Complete.'
  };
  
  const defaultCTA = {
    pro: 'Unlock Pro',
    complete: 'See Threshold Complete'
  };
  
  return (
    <div className="card text-center py-10" data-testid="tier-gate">
      <div className="flex justify-center mb-6">
        <Lock size={24} className="text-[#8E8E93]" />
      </div>
      <p className="text-[#8E8E93] text-sm leading-relaxed mb-6 max-w-xs mx-auto">
        {message || defaultMessages[requiredTier]}
      </p>
      <button 
        onClick={() => navigate('/upgrade')}
        className="btn-primary mx-auto max-w-xs"
        data-testid="tier-gate-upgrade-btn"
      >
        {ctaText || defaultCTA[requiredTier]}
      </button>
    </div>
  );
}
