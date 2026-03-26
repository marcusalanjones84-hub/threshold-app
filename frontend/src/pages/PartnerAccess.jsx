import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartnerAccess } from '../hooks/usePartnerAccess';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, Copy, Check, Link2, Trash2, Share2 } from 'lucide-react';

export default function PartnerAccess() {
  const navigate = useNavigate();
  const { tier } = useAuth();
  const { 
    partnerCode, 
    partnerLink, 
    loading, 
    hasPartnerAccess, 
    generateCode, 
    revokeAccess 
  } = usePartnerAccess();
  
  const [copied, setCopied] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const handleCopyLink = async () => {
    if (partnerLink) {
      await navigator.clipboard.writeText(partnerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (partnerLink && navigator.share) {
      try {
        await navigator.share({
          title: 'Threshold Partner View',
          text: 'I\'m on a journey to change my relationship with alcohol. Here\'s how you can support me.',
          url: partnerLink,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRevoke = async () => {
    await revokeAccess();
    setShowRevokeConfirm(false);
  };

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center pb-20">
        <p className="text-[#8E8E93]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container pb-24" data-testid="partner-access-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="partner-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Heart size={24} className="text-[#FF453A]" />
            <h1 className="text-2xl font-bold text-white">Partner Access</h1>
          </div>
          <p className="text-[#8E8E93] text-sm">
            Let someone you trust see your progress
          </p>
        </div>

        {/* Explanation */}
        <div className="card mb-6">
          <p className="section-label mb-3">What They'll See</p>
          <ul className="space-y-2 text-sm text-[#D4D4D6]">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-[#32D74B] mt-0.5 flex-shrink-0" />
              <span>Your current streak and longest streak</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-[#32D74B] mt-0.5 flex-shrink-0" />
              <span>Whether you've checked in today</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-[#32D74B] mt-0.5 flex-shrink-0" />
              <span>Last 7 days check-in status</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-[#32D74B] mt-0.5 flex-shrink-0" />
              <span>Your plan progress (week 1-4)</span>
            </li>
          </ul>
          
          <div className="divider" />
          
          <p className="section-label mb-3">What They Won't See</p>
          <ul className="space-y-2 text-sm text-[#8E8E93]">
            <li className="flex items-start gap-2">
              <span className="text-[#FF453A]">×</span>
              <span>Your journal entries (completely private)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF453A]">×</span>
              <span>Your assessment results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF453A]">×</span>
              <span>Your commitment statement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF453A]">×</span>
              <span>Daily check-in details or scores</span>
            </li>
          </ul>
        </div>

        {/* Partner Link Section */}
        {hasPartnerAccess ? (
          <div className="space-y-4">
            <div className="card border-white">
              <p className="section-label mb-3">Your Partner Link</p>
              <div className="flex items-center gap-2 p-3 bg-[#2C2C2E] border border-[#3A3A3C] mb-4">
                <Link2 size={16} className="text-[#8E8E93] flex-shrink-0" />
                <p className="text-white text-sm truncate flex-1 font-mono">
                  {partnerLink}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3"
                  data-testid="copy-link-btn"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                  data-testid="share-link-btn"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Revoke Access */}
            <button
              onClick={() => setShowRevokeConfirm(true)}
              className="card w-full flex items-center gap-4 border-[#FF453A] hover:bg-[#FF453A]/10 transition-colors"
              data-testid="revoke-access-btn"
            >
              <Trash2 size={20} className="text-[#FF453A]" />
              <span className="text-[#FF453A]">Revoke Partner Access</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[#8E8E93] text-sm mb-6">
              Create a private link to share with your partner, spouse, or someone you trust.
            </p>
            
            <button
              onClick={generateCode}
              className="btn-primary flex items-center justify-center gap-2"
              data-testid="create-partner-link-btn"
            >
              <Heart size={18} />
              <span>Create Partner Link</span>
            </button>
          </div>
        )}

        {/* Revoke Confirmation Modal */}
        {showRevokeConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="card max-w-sm w-full">
              <h2 className="text-lg font-bold text-white mb-4">Revoke Access?</h2>
              <p className="text-[#8E8E93] text-sm mb-6">
                This will disable the current partner link. Your partner will no longer be able to see your progress.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRevokeConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  className="flex-1 py-4 bg-[#FF453A] text-white uppercase tracking-widest text-sm font-semibold cursor-pointer border-0"
                  data-testid="confirm-revoke-btn"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
