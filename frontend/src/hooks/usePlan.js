import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getPlanDay, getPlanWeek, getTodayDateString } from '../utils/dates';

export function usePlan() {
  const { user } = useAuth();
  const [planProgress, setPlanProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const { data } = await supabase
      .from('plan_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setPlanProgress(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPlanProgress();
  }, [fetchPlanProgress]);

  const startPlan = useCallback(async () => {
    if (!user) return { error: 'Not authenticated' };
    
    const today = getTodayDateString();
    
    const { data, error } = await supabase
      .from('plan_progress')
      .upsert({
        user_id: user.id,
        plan_start_date: today,
        current_week: 1,
        week1_complete: false,
        week2_complete: false,
        week3_complete: false,
        week4_complete: false,
      })
      .select()
      .single();
    
    if (!error) {
      setPlanProgress(data);
    }
    
    return { data, error };
  }, [user]);

  const updatePlanProgress = useCallback(async (updates) => {
    if (!user) return { error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('plan_progress')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (!error) {
      setPlanProgress(data);
    }
    
    return { data, error };
  }, [user]);

  const completeWeek = useCallback(async (weekNumber) => {
    const weekField = `week${weekNumber}_complete`;
    return updatePlanProgress({
      [weekField]: true,
      current_week: Math.min(weekNumber + 1, 4),
    });
  }, [updatePlanProgress]);

  const currentDay = planProgress?.plan_start_date 
    ? getPlanDay(planProgress.plan_start_date) 
    : 0;
  
  const currentWeek = planProgress?.plan_start_date 
    ? getPlanWeek(planProgress.plan_start_date) 
    : 0;

  return { 
    planProgress, 
    loading, 
    startPlan,
    updatePlanProgress,
    completeWeek,
    currentDay,
    currentWeek,
    hasStarted: !!planProgress?.plan_start_date,
    refetch: fetchPlanProgress
  };
}
