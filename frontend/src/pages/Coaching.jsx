import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TierGate from '../components/TierGate';
import { ArrowLeft, Calendar, MessageCircle, Users, ExternalLink } from 'lucide-react';

const CALENDLY_URL = 'https://calendly.com/marcusjonescoaching/weekly-coaching-call';
const COMMUNITY_URL = 'https://www.skool.com/booze-to-beast';
const WEBSITE_URL = 'https://boozetobeast.com/';

export default function Coaching() {
  const navigate = useNavigate();
  const { tier } = useAuth();

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (tier !== 'complete') {
    return (
      <div className="page-container pb-24" data-testid="coaching-page">
        <div className="content-width">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            >
              <ArrowLeft size={20} className="text-[#8E8E93]" />
            </button>
            <h1 className="text-2xl font-bold text-white">1:1 Coaching</h1>
          </div>
          
          <TierGate 
            requiredTier="complete" 
            message="1:1 coaching is part of Threshold Complete. Get personalised support from an expert coach."
            ctaText="See Threshold Complete"
          >
            <div />
          </TierGate>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-24" data-testid="coaching-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="coaching-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <h1 className="text-2xl font-bold text-white">1:1 Coaching</h1>
          <p className="text-[#8E8E93] text-sm mt-2">
            Fortnightly sessions with your coach
          </p>
        </div>

        {/* Book Session */}
        <div className="card mb-6" data-testid="book-session-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border border-[#3A3A3C] flex items-center justify-center">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Book Your Next Session</p>
              <p className="text-sm text-[#8E8E93]">30 minutes, video call</p>
            </div>
          </div>
          <button 
            className="btn-primary flex items-center justify-center gap-2"
            onClick={() => openLink(CALENDLY_URL)}
            data-testid="book-session-btn"
          >
            Schedule Session
            <ExternalLink size={16} />
          </button>
          <p className="text-xs text-[#8E8E93] mt-3 text-center">
            Book directly via Calendly
          </p>
        </div>

        {/* Community */}
        <div className="card mb-6" data-testid="community-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border border-[#3A3A3C] flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Private Community</p>
              <p className="text-sm text-[#8E8E93]">Connect with others on the same journey</p>
            </div>
          </div>
          <button 
            className="btn-secondary flex items-center justify-center gap-2"
            onClick={() => openLink(COMMUNITY_URL)}
            data-testid="community-btn"
          >
            Join Community
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Resources */}
        <div className="card mb-6" data-testid="resources-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border border-[#3A3A3C] flex items-center justify-center">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">Booze to Beast</p>
              <p className="text-sm text-[#8E8E93]">Resources and articles</p>
            </div>
          </div>
          <button 
            className="btn-secondary flex items-center justify-center gap-2"
            onClick={() => openLink(WEBSITE_URL)}
            data-testid="website-btn"
          >
            Visit Website
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Session Notes */}
        <div className="card">
          <p className="section-label mb-4">Recent Sessions</p>
          <p className="text-[#8E8E93] text-sm">
            No sessions yet. Book your first session above.
          </p>
        </div>
      </div>
    </div>
  );
}
