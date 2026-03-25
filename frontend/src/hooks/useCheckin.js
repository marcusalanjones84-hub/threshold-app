import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getTodayDateString } from '../utils/dates';

export function useCheckin() {
  const { user } = useAuth();
  const [todaysCheckin, setTodaysCheckin] = useState(null);
  const [checkinCount, setCheckinCount] = useState(0);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = getTodayDateString();

  const fetchTodaysCheckin = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Get today's check-in
    const { data: todayData } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('checkin_date', today)
      .single();
    
    setTodaysCheckin(todayData);
    
    // Get all check-ins for count
    const allCheckins = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id);
    
    const checkins = allCheckins.data || [];
    setCheckinCount(checkins.length);
    
    // Get recent check-ins (last 30 days)
    const sortedCheckins = checkins.sort((a, b) => 
      new Date(b.checkin_date) - new Date(a.checkin_date)
    ).slice(0, 30);
    
    setRecentCheckins(sortedCheckins);
    setLoading(false);
  }, [user, today]);

  useEffect(() => {
    fetchTodaysCheckin();
  }, [fetchTodaysCheckin]);

  const submitCheckin = useCallback(async (checkinData) => {
    if (!user) return { error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('daily_checkins')
      .upsert({
        user_id: user.id,
        checkin_date: today,
        ...checkinData
      })
      .select()
      .single();
    
    if (!error) {
      setTodaysCheckin(data);
      setCheckinCount(prev => todaysCheckin ? prev : prev + 1);
      await fetchTodaysCheckin();
    }
    
    return { data, error };
  }, [user, today, todaysCheckin, fetchTodaysCheckin]);

  return { 
    todaysCheckin, 
    checkinCount, 
    recentCheckins,
    loading, 
    submitCheckin,
    hasCheckedInToday: !!todaysCheckin,
    refetch: fetchTodaysCheckin
  };
}
