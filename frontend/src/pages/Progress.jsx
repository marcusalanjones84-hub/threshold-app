import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckin } from '../hooks/useCheckin';
import { useStreak } from '../hooks/useStreak';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import TierGate from '../components/TierGate';
import { ArrowLeft } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar 
} from 'recharts';
import { formatShortDate, getMoneySaved } from '../utils/dates';

export default function Progress() {
  const navigate = useNavigate();
  const { tier, user } = useAuth();
  const { recentCheckins } = useCheckin();
  const { streak } = useStreak();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setAssessment(data);
    };
    fetchAssessment();
  }, [user]);

  // Prepare chart data
  const chartData = recentCheckins
    .slice(0, 7)
    .reverse()
    .map(checkin => ({
      date: formatShortDate(checkin.checkin_date),
      clarity: checkin.clarity_score,
      energy: checkin.energy_score,
      connection: checkin.family_connection,
      drank: checkin.drank_today ? 1 : 0,
    }));

  const moneySaved = getMoneySaved(
    streak?.start_date,
    assessment?.weekly_spend_gbp || 50
  );

  return (
    <div className="page-container pb-24" data-testid="progress-page">
      <div className="content-width">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-transparent border-0 cursor-pointer -ml-2 mb-4"
            data-testid="progress-back-btn"
          >
            <ArrowLeft size={20} className="text-[#8E8E93]" />
          </button>
          <h1 className="text-2xl font-bold text-white">Your Progress</h1>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">{streak?.current_streak || 0}</p>
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mt-1">Current</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">{streak?.longest_streak || 0}</p>
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mt-1">Longest</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">{streak?.total_days_free || 0}</p>
            <p className="text-xs text-[#8E8E93] uppercase tracking-widest mt-1">Total Free</p>
          </div>
        </div>

        {/* Money Saved */}
        <TierGate requiredTier="pro" message="Savings tracker is a Pro feature.">
          <div className="card mb-8" data-testid="savings-card">
            <p className="section-label mb-2">Money Saved</p>
            <p className="text-4xl font-bold text-[#32D74B]">£{moneySaved}</p>
            <p className="text-xs text-[#8E8E93] mt-2">
              Based on £{assessment?.weekly_spend_gbp || 50}/week
            </p>
          </div>
        </TierGate>

        {/* Clarity Chart */}
        <TierGate requiredTier="pro" message="Progress charts are a Pro feature.">
          <div className="card mb-6" data-testid="clarity-chart">
            <p className="section-label mb-4">Mental Clarity (Last 7 Days)</p>
            {chartData.length > 0 ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#8E8E93', fontSize: 10 }}
                      axisLine={{ stroke: '#3A3A3C' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      tick={{ fill: '#8E8E93', fontSize: 10 }}
                      axisLine={{ stroke: '#3A3A3C' }}
                      tickLine={false}
                    />
                    <Line 
                      type="linear" 
                      dataKey="clarity" 
                      stroke="#FFFFFF" 
                      strokeWidth={2}
                      dot={{ fill: '#FFFFFF', strokeWidth: 0, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-[#8E8E93] text-sm">Complete check-ins to see your progress</p>
            )}
          </div>
        </TierGate>

        {/* Drink-Free Days Chart */}
        <TierGate requiredTier="pro">
          <div className="card" data-testid="drinks-chart">
            <p className="section-label mb-4">Drink-Free Days (Last 7 Days)</p>
            {chartData.length > 0 ? (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#8E8E93', fontSize: 10 }}
                      axisLine={{ stroke: '#3A3A3C' }}
                      tickLine={false}
                    />
                    <Bar 
                      dataKey="drank" 
                      fill="#FF453A"
                      radius={0}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-[#8E8E93] text-sm">Complete check-ins to see your progress</p>
            )}
            <p className="text-xs text-[#8E8E93] mt-3">
              Red bars indicate days with alcohol
            </p>
          </div>
        </TierGate>
      </div>
    </div>
  );
}
