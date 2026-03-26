import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { JOURNAL_PROMPTS } from '../data/journalPrompts';
import TierGate from '../components/TierGate';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { formatDate, getTodayDateString } from '../utils/dates';

export default function Journal() {
  const navigate = useNavigate();
  const { user, tier } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [content, setContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setEntries(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEntries();
    randomizePrompt();
  }, [user, fetchEntries]);

  const randomizePrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setCurrentPrompt(JOURNAL_PROMPTS[randomIndex]);
  };

  const handleSave = async () => {
    if (!content.trim() || !user) return;
    
    setSaving(true);
    
    await supabase.from('journal_entries').insert({
      user_id: user.id,
      content: content.trim(),
      prompt_used: currentPrompt?.text || null,
      entry_date: getTodayDateString(),
    });
    
    setContent('');
    setShowNew(false);
    await fetchEntries();
    setSaving(false);
  };

  // Free tier gets limited access
  if (tier === 'free' && !showNew) {
    return (
      <div className="page-container pb-24" data-testid="journal-page">
        <div className="content-width">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            >
              <ArrowLeft size={20} className="text-[#8E8E93]" />
            </button>
            <h1 className="text-2xl font-bold text-white">Journal</h1>
          </div>
          
          <TierGate 
            requiredTier="pro" 
            message="Private journaling is a Pro feature. Upgrade to reflect on your journey."
          >
            <div />
          </TierGate>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-24" data-testid="journal-page">
      <div className="content-width">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <button
              onClick={() => showNew ? setShowNew(false) : navigate('/dashboard')}
              className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
              data-testid="journal-back-btn"
            >
              <ArrowLeft size={20} className="text-[#8E8E93]" />
            </button>
            <h1 className="text-2xl font-bold text-white">
              {showNew ? 'New Entry' : 'Journal'}
            </h1>
          </div>
          {!showNew && (
            <button
              onClick={() => setShowNew(true)}
              className="p-2 border border-[#3A3A3C] bg-transparent cursor-pointer text-white hover:border-white"
              data-testid="new-entry-btn"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {showNew ? (
          <div className="fade-in">
            {/* Prompt */}
            {currentPrompt && (
              <div className="card mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="section-label mb-2">Today's Prompt</p>
                    <p className="text-white text-sm leading-relaxed">
                      {currentPrompt.text}
                    </p>
                  </div>
                  <button
                    onClick={randomizePrompt}
                    className="p-2 bg-transparent border-0 cursor-pointer text-[#8E8E93] hover:text-white flex-shrink-0"
                    data-testid="new-prompt-btn"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Editor */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely. This is for you alone."
              className="input-field min-h-[250px] resize-none mb-6"
              autoFocus
              data-testid="journal-content"
            />

            <button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className="btn-primary"
              data-testid="save-entry-btn"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <p className="text-[#8E8E93]">Loading...</p>
            ) : entries.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-[#8E8E93] mb-4">No entries yet</p>
                <button
                  onClick={() => setShowNew(true)}
                  className="btn-primary max-w-xs mx-auto"
                >
                  Write Your First Entry
                </button>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="card" data-testid="journal-entry">
                  <p className="text-xs text-[#8E8E93] mb-3">
                    {formatDate(entry.entry_date)}
                  </p>
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                  {entry.prompt_used && (
                    <p className="text-xs text-[#8E8E93] mt-4 pt-4 border-t border-[#3A3A3C] italic">
                      Prompt: {entry.prompt_used}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
