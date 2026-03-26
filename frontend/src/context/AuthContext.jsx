import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      // Silently fail - profile may not exist yet
      console.log('Profile fetch skipped');
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
          }
          setLoading(false);
        }
      } catch (err) {
        console.log('Auth init skipped');
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            setTimeout(() => {
              if (mounted) fetchProfile(session.user.id);
            }, 500);
          } else {
            setProfile(null);
          }
        }
      });
      subscription = data?.subscription;
    } catch (err) {
      console.log('Auth listener skipped');
    }

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: 'Not authenticated' };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
    
    return { data, error };
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    refreshProfile,
    signOut,
    updateProfile,
    tier: profile?.tier || 'free',
    isAuthenticated: !!user,
    isPro: ['pro', 'complete'].includes(profile?.tier),
    isComplete: profile?.tier === 'complete',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
