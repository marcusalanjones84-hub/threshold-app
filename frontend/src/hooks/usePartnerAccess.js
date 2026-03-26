import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Generate a unique partner code
const generatePartnerCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export function usePartnerAccess() {
  const { user, profile } = useAuth();
  const [partnerCode, setPartnerCode] = useState(null);
  const [partnerLink, setPartnerLink] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load or create partner code
  const loadPartnerCode = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Check if partner code exists in localStorage (mock mode)
    const stored = localStorage.getItem('threshold_partner_code_' + user.id);
    
    if (stored) {
      setPartnerCode(stored);
      setPartnerLink(`${window.location.origin}/partner/${stored}`);
    }
    
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadPartnerCode();
  }, [loadPartnerCode]);

  // Generate new partner code
  const generateCode = useCallback(async () => {
    if (!user) return null;

    const code = generatePartnerCode();
    
    // Store in localStorage (mock mode)
    localStorage.setItem('threshold_partner_code_' + user.id, code);
    
    // Also store the user data associated with this code
    const partnerData = {
      userId: user.id,
      firstName: profile?.first_name || 'User',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('threshold_partner_data_' + code, JSON.stringify(partnerData));
    
    setPartnerCode(code);
    setPartnerLink(`${window.location.origin}/partner/${code}`);
    
    return code;
  }, [user, profile]);

  // Revoke partner access
  const revokeAccess = useCallback(async () => {
    if (!user || !partnerCode) return;

    localStorage.removeItem('threshold_partner_code_' + user.id);
    localStorage.removeItem('threshold_partner_data_' + partnerCode);
    
    setPartnerCode(null);
    setPartnerLink(null);
  }, [user, partnerCode]);

  return {
    partnerCode,
    partnerLink,
    loading,
    hasPartnerAccess: !!partnerCode,
    generateCode,
    revokeAccess,
  };
}

// Hook to get partner view data (for the partner viewing)
export function usePartnerViewData(code) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      setError('No partner code provided');
      return;
    }

    // Get partner data from localStorage (mock mode)
    const partnerDataStr = localStorage.getItem('threshold_partner_data_' + code);
    
    if (!partnerDataStr) {
      setLoading(false);
      setError('Invalid or expired partner link');
      return;
    }

    const partnerData = JSON.parse(partnerDataStr);
    const userId = partnerData.userId;

    // Get user's streak and check-in data
    const allData = JSON.parse(localStorage.getItem('threshold_data') || '{}');
    
    const streakData = Object.values(allData.streaks || {}).find(s => s.user_id === userId);
    const checkins = Object.values(allData.daily_checkins || {}).filter(c => c.user_id === userId);
    const planProgress = Object.values(allData.plan_progress || {}).find(p => p.user_id === userId);
    
    // Check if checked in today
    const today = new Date().toISOString().split('T')[0];
    const todaysCheckin = checkins.find(c => c.checkin_date === today);
    
    // Get recent check-in streak (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const checkin = checkins.find(c => c.checkin_date === dateStr);
      last7Days.push({
        date: dateStr,
        checkedIn: !!checkin,
        drankToday: checkin?.drank_today,
      });
    }

    setData({
      firstName: partnerData.firstName,
      currentStreak: streakData?.current_streak || 0,
      longestStreak: streakData?.longest_streak || 0,
      totalDaysFree: streakData?.total_days_free || 0,
      hasCheckedInToday: !!todaysCheckin,
      todayDrankStatus: todaysCheckin?.drank_today,
      last7Days,
      planWeek: planProgress?.current_week || 1,
      startDate: streakData?.start_date,
    });
    
    setLoading(false);
  }, [code]);

  return { data, loading, error };
}
