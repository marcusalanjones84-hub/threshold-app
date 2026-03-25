import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getTodayDateString } from '../utils/dates';

export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStreak = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setStreak(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const updateStreak = useCallback(async (drankToday) => {
    if (!user || !streak) return;
    
    const today = getTodayDateString();
    const current = streak.current_streak || 0;
    const longest = streak.longest_streak || 0;
    const totalFree = streak.total_days_free || 0;
    
    const newStreak = drankToday ? 0 : current + 1;
    const newLongest = Math.max(longest, newStreak);
    const newTotal = drankToday ? totalFree : totalFree + 1;
    
    const updatedStreak = {
      user_id: user.id,
      current_streak: newStreak,
      longest_streak: newLongest,
      total_days_free: newTotal,
      last_updated: today,
      start_date: newStreak === 1 ? today : streak.start_date,
    };
    
    await supabase.from('streaks').upsert(updatedStreak);
    setStreak(prev => ({ ...prev, ...updatedStreak }));
    
    return newStreak;
  }, [user, streak]);

  const resetStreak = useCallback(async () => {
    if (!user) return;
    
    const today = getTodayDateString();
    const updatedStreak = {
      user_id: user.id,
      current_streak: 0,
      longest_streak: streak?.longest_streak || 0,
      total_days_free: streak?.total_days_free || 0,
      last_updated: today,
      start_date: null,
    };
    
    await supabase.from('streaks').upsert(updatedStreak);
    setStreak(prev => ({ ...prev, ...updatedStreak }));
  }, [user, streak]);

  return { streak, loading, updateStreak, resetStreak, refetch: fetchStreak };
}
